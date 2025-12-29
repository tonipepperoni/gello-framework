/**
 * GCSDisk - Google Cloud Storage adapter
 *
 * @module @gello/storage-drivers
 */

import { Effect, Layer, Stream, Duration, pipe } from "effect"
import type { Disk, PutOptions, StreamableDisk, TemporaryUrlDisk } from "@gello/storage"
import {
  FilePath,
  unsafeFilePath,
  guessMimeType,
  FileInfo,
  GCS,
  DiskTag,
  StreamableDiskTag,
  TemporaryUrlDiskTag,
  FileNotFoundError,
  PermissionDeniedError,
  DiskConnectionError,
  StreamError,
} from "@gello/storage"
import type { StorageError } from "@gello/storage"
import { Storage, type Bucket, type File } from "@google-cloud/storage"

/**
 * Configuration for GCSDisk
 */
export interface GCSDiskConfig {
  /**
   * GCP project ID
   */
  readonly projectId: string

  /**
   * GCS bucket name
   */
  readonly bucket: string

  /**
   * Path to service account key file (JSON)
   * If not provided, uses Application Default Credentials
   */
  readonly keyFilename?: string

  /**
   * Service account credentials object (alternative to keyFilename)
   */
  readonly credentials?: {
    readonly client_email: string
    readonly private_key: string
  }

  /**
   * Public URL base for generating URLs
   */
  readonly publicUrl?: string

  /**
   * Default visibility for new files
   */
  readonly visibility?: "public" | "private"

  /**
   * Key prefix (virtual directory)
   */
  readonly prefix?: string

  /**
   * Default expiration for temporary URLs
   */
  readonly temporaryUrlExpiration?: Duration.Duration

  /**
   * Custom API endpoint (for emulator or alternative endpoints)
   */
  readonly apiEndpoint?: string
}

/**
 * Create a GCSDisk adapter
 */
export const makeGCSDisk = (
  config: GCSDiskConfig
): Effect.Effect<Disk & StreamableDisk & TemporaryUrlDisk, never> =>
  Effect.gen(function* () {
    const storage = new Storage({
      projectId: config.projectId,
      keyFilename: config.keyFilename,
      credentials: config.credentials,
      apiEndpoint: config.apiEndpoint,
    })

    const bucket = storage.bucket(config.bucket)
    const prefix = config.prefix ?? ""
    const defaultVisibility = config.visibility ?? "private"
    const defaultTemporaryUrlExpiration =
      config.temporaryUrlExpiration ?? Duration.hours(1)

    const resolveKey = (filePath: FilePath): string =>
      prefix ? `${prefix}/${filePath}` : filePath

    const stripPrefix = (key: string): string =>
      prefix && key.startsWith(`${prefix}/`)
        ? key.slice(prefix.length + 1)
        : key

    const toStorageError = (
      error: unknown,
      filePath: FilePath,
      operation: "read" | "write" | "delete" | "list"
    ): StorageError => {
      const err = error as { code?: number | string; message?: string }

      if (err.code === 404 || err.message?.includes("No such object")) {
        return new FileNotFoundError({ path: filePath, disk: GCS })
      }
      if (err.code === 403 || err.message?.includes("forbidden")) {
        return new PermissionDeniedError({ path: filePath, disk: GCS, operation })
      }
      return new DiskConnectionError({
        disk: GCS,
        cause: error instanceof Error ? error : new Error(String(error)),
      })
    }

    const disk: Disk & StreamableDisk & TemporaryUrlDisk = {
      get: (filePath) =>
        Effect.gen(function* () {
          const file = bucket.file(resolveKey(filePath))
          return yield* Effect.tryPromise({
            try: async () => {
              const [contents] = await file.download()
              return new Uint8Array(contents)
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      getString: (filePath, encoding = "utf-8") =>
        Effect.gen(function* () {
          const contents = yield* disk.get(filePath)
          return new TextDecoder(encoding).decode(contents)
        }),

      put: (filePath, contents, options) =>
        Effect.gen(function* () {
          const file = bucket.file(resolveKey(filePath))
          const data =
            typeof contents === "string"
              ? Buffer.from(contents)
              : Buffer.from(contents)

          yield* Effect.tryPromise({
            try: async () => {
              await file.save(data, {
                contentType:
                  options?.mimeType ?? guessMimeType(filePath) ?? undefined,
                metadata: options?.metadata,
                public: options?.visibility === "public",
              })
            },
            catch: (e) => toStorageError(e, filePath, "write"),
          })
        }),

      exists: (filePath) =>
        Effect.gen(function* () {
          const file = bucket.file(resolveKey(filePath))
          return yield* Effect.tryPromise({
            try: async () => {
              const [exists] = await file.exists()
              return exists
            },
            catch: () => false,
          })
        }),

      missing: (filePath) =>
        pipe(
          disk.exists(filePath),
          Effect.map((exists) => !exists)
        ),

      delete: (filePath) =>
        Effect.gen(function* () {
          const file = bucket.file(resolveKey(filePath))
          return yield* Effect.tryPromise({
            try: async () => {
              const [exists] = await file.exists()
              if (exists) {
                await file.delete()
                return true
              }
              return false
            },
            catch: (e) => toStorageError(e, filePath, "delete"),
          })
        }),

      deleteMany: (paths) =>
        Effect.gen(function* () {
          yield* Effect.forEach(
            paths,
            (p) => disk.delete(p),
            { concurrency: 10 }
          )
        }),

      copy: (from, to) =>
        Effect.gen(function* () {
          const sourceFile = bucket.file(resolveKey(from))
          const destFile = bucket.file(resolveKey(to))

          yield* Effect.tryPromise({
            try: async () => {
              await sourceFile.copy(destFile)
            },
            catch: (e) => toStorageError(e, from, "read"),
          })
        }),

      move: (from, to) =>
        Effect.gen(function* () {
          const sourceFile = bucket.file(resolveKey(from))
          const destFile = bucket.file(resolveKey(to))

          yield* Effect.tryPromise({
            try: async () => {
              await sourceFile.move(destFile)
            },
            catch: (e) => toStorageError(e, from, "write"),
          })
        }),

      size: (filePath) =>
        Effect.gen(function* () {
          const file = bucket.file(resolveKey(filePath))
          return yield* Effect.tryPromise({
            try: async () => {
              const [metadata] = await file.getMetadata()
              return Number(metadata.size) || 0
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      lastModified: (filePath) =>
        Effect.gen(function* () {
          const file = bucket.file(resolveKey(filePath))
          return yield* Effect.tryPromise({
            try: async () => {
              const [metadata] = await file.getMetadata()
              return metadata.updated
                ? new Date(metadata.updated)
                : new Date()
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      getMetadata: (filePath) =>
        Effect.gen(function* () {
          const file = bucket.file(resolveKey(filePath))
          return yield* Effect.tryPromise({
            try: async () => {
              const [metadata] = await file.getMetadata()
              return FileInfo.make({
                path: filePath,
                size: Number(metadata.size) || 0,
                mimeType: metadata.contentType ?? null,
                lastModified: metadata.updated
                  ? new Date(metadata.updated)
                  : new Date(),
                visibility: defaultVisibility,
                isDirectory: false,
                metadata: (metadata.metadata as Record<string, string>) ?? {},
              })
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      url: (filePath) =>
        config.publicUrl
          ? Effect.succeed(`${config.publicUrl}/${resolveKey(filePath)}`)
          : Effect.succeed(
              `https://storage.googleapis.com/${config.bucket}/${resolveKey(filePath)}`
            ),

      getVisibility: () => Effect.succeed(defaultVisibility),

      setVisibility: (filePath, visibility) =>
        Effect.gen(function* () {
          const file = bucket.file(resolveKey(filePath))
          yield* Effect.tryPromise({
            try: async () => {
              if (visibility === "public") {
                await file.makePublic()
              } else {
                await file.makePrivate()
              }
            },
            catch: (e) => toStorageError(e, filePath, "write"),
          })
        }),

      prepend: (filePath, data) =>
        Effect.gen(function* () {
          const existing = yield* pipe(
            disk.get(filePath),
            Effect.catchAll(() => Effect.succeed(new Uint8Array(0)))
          )

          const newData =
            typeof data === "string"
              ? new TextEncoder().encode(data)
              : new Uint8Array(data)

          const combined = new Uint8Array(newData.length + existing.length)
          combined.set(newData, 0)
          combined.set(existing, newData.length)

          yield* disk.put(filePath, combined)
        }),

      append: (filePath, data) =>
        Effect.gen(function* () {
          const existing = yield* pipe(
            disk.get(filePath),
            Effect.catchAll(() => Effect.succeed(new Uint8Array(0)))
          )

          const newData =
            typeof data === "string"
              ? new TextEncoder().encode(data)
              : new Uint8Array(data)

          const combined = new Uint8Array(existing.length + newData.length)
          combined.set(existing, 0)
          combined.set(newData, existing.length)

          yield* disk.put(filePath, combined)
        }),

      files: (directory) =>
        Effect.gen(function* () {
          const prefixPath = directory
            ? prefix
              ? `${prefix}/${directory}/`
              : `${directory}/`
            : prefix
              ? `${prefix}/`
              : ""

          return yield* Effect.tryPromise({
            try: async () => {
              const [files] = await bucket.getFiles({
                prefix: prefixPath,
                delimiter: "/",
              })

              return files
                .filter((f) => !f.name.endsWith("/"))
                .map((f) => {
                  const relativePath = stripPrefix(f.name)
                  return unsafeFilePath(relativePath)
                })
            },
            catch: (e) =>
              toStorageError(e, unsafeFilePath(directory ?? "."), "list"),
          })
        }),

      allFiles: (directory) =>
        Effect.gen(function* () {
          const prefixPath = directory
            ? prefix
              ? `${prefix}/${directory}/`
              : `${directory}/`
            : prefix
              ? `${prefix}/`
              : ""

          return yield* Effect.tryPromise({
            try: async () => {
              const [files] = await bucket.getFiles({
                prefix: prefixPath,
              })

              return files
                .filter((f) => !f.name.endsWith("/"))
                .map((f) => {
                  const relativePath = stripPrefix(f.name)
                  return unsafeFilePath(relativePath)
                })
            },
            catch: (e) =>
              toStorageError(e, unsafeFilePath(directory ?? "."), "list"),
          })
        }),

      directories: (directory) =>
        Effect.gen(function* () {
          const prefixPath = directory
            ? prefix
              ? `${prefix}/${directory}/`
              : `${directory}/`
            : prefix
              ? `${prefix}/`
              : ""

          return yield* Effect.tryPromise({
            try: async () => {
              const [, , apiResponse] = await bucket.getFiles({
                prefix: prefixPath,
                delimiter: "/",
                autoPaginate: false,
              })

              const prefixes = (apiResponse as { prefixes?: string[] })?.prefixes ?? []
              return prefixes.map((p) => {
                const dirName = p.endsWith("/") ? p.slice(0, -1) : p
                const relativePath = stripPrefix(dirName)
                return unsafeFilePath(relativePath)
              })
            },
            catch: (e) =>
              toStorageError(e, unsafeFilePath(directory ?? "."), "list"),
          })
        }),

      allDirectories: (directory) =>
        Effect.gen(function* () {
          const prefixPath = directory
            ? prefix
              ? `${prefix}/${directory}/`
              : `${directory}/`
            : prefix
              ? `${prefix}/`
              : ""

          return yield* Effect.tryPromise({
            try: async () => {
              const [files] = await bucket.getFiles({
                prefix: prefixPath,
              })

              const dirs = new Set<string>()
              for (const file of files) {
                const relativePath = stripPrefix(file.name)
                const parts = relativePath.split("/")

                // Extract all directory levels
                let current = directory ?? ""
                for (let i = 0; i < parts.length - 1; i++) {
                  current = current ? `${current}/${parts[i]}` : parts[i]
                  dirs.add(current)
                }
              }

              return Array.from(dirs).map(unsafeFilePath)
            },
            catch: (e) =>
              toStorageError(e, unsafeFilePath(directory ?? "."), "list"),
          })
        }),

      makeDirectory: () => Effect.void, // GCS doesn't have real directories

      deleteDirectory: (dirPath) =>
        Effect.gen(function* () {
          const files = yield* disk.allFiles(dirPath)
          if (files.length > 0) {
            yield* disk.deleteMany(files)
          }
        }),

      // StreamableDisk methods
      readStream: (filePath) =>
        Effect.gen(function* () {
          const file = bucket.file(resolveKey(filePath))

          // Check file exists first
          const exists = yield* disk.exists(filePath)
          if (!exists) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: GCS })
            )
          }

          return Stream.async<Uint8Array, StorageError>((emit) => {
            const readStream = file.createReadStream()

            readStream.on("data", (chunk: Buffer) => {
              emit.single(new Uint8Array(chunk))
            })

            readStream.on("end", () => {
              emit.end()
            })

            readStream.on("error", (err) => {
              emit.fail(
                new StreamError({ path: filePath, disk: GCS, cause: err })
              )
            })
          })
        }),

      writeStream: (filePath, stream, options) =>
        Effect.gen(function* () {
          const file = bucket.file(resolveKey(filePath))

          // Collect stream and upload
          const chunks: Uint8Array[] = []
          yield* Stream.runForEach(stream, (chunk) =>
            Effect.sync(() => {
              chunks.push(chunk)
            })
          )

          const totalLength = chunks.reduce((acc, c) => acc + c.length, 0)
          const combined = new Uint8Array(totalLength)
          let offset = 0
          for (const chunk of chunks) {
            combined.set(chunk, offset)
            offset += chunk.length
          }

          yield* Effect.tryPromise({
            try: async () => {
              await file.save(Buffer.from(combined), {
                contentType:
                  options?.mimeType ?? guessMimeType(filePath) ?? undefined,
                metadata: options?.metadata,
                public: options?.visibility === "public",
              })
            },
            catch: (e) => toStorageError(e, filePath, "write"),
          })
        }),

      // TemporaryUrlDisk methods
      temporaryUrl: (filePath, expiration) =>
        Effect.gen(function* () {
          const file = bucket.file(resolveKey(filePath))
          const expiresAt =
            Date.now() +
            Duration.toMillis(expiration ?? defaultTemporaryUrlExpiration)

          return yield* Effect.tryPromise({
            try: async () => {
              const [url] = await file.getSignedUrl({
                action: "read",
                expires: expiresAt,
              })
              return url
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      temporaryUploadUrl: (filePath, expiration) =>
        Effect.gen(function* () {
          const file = bucket.file(resolveKey(filePath))
          const expiresAt =
            Date.now() +
            Duration.toMillis(expiration ?? defaultTemporaryUrlExpiration)

          return yield* Effect.tryPromise({
            try: async () => {
              const [url] = await file.getSignedUrl({
                action: "write",
                expires: expiresAt,
                contentType: "application/octet-stream",
              })
              return url
            },
            catch: (e) => toStorageError(e, filePath, "write"),
          })
        }),
    }

    return disk
  })

/**
 * Create a GCSDisk layer
 */
export const GCSDiskLive = (
  config: GCSDiskConfig
): Layer.Layer<DiskTag, never> =>
  Layer.effect(DiskTag, makeGCSDisk(config))

/**
 * Create a GCSDisk layer with StreamableDisk
 */
export const GCSDiskStreamableLive = (
  config: GCSDiskConfig
): Layer.Layer<StreamableDiskTag, never> =>
  Layer.effect(StreamableDiskTag, makeGCSDisk(config))

/**
 * Create a GCSDisk layer with TemporaryUrlDisk
 */
export const GCSDiskTemporaryUrlLive = (
  config: GCSDiskConfig
): Layer.Layer<TemporaryUrlDiskTag, never> =>
  Layer.effect(TemporaryUrlDiskTag, makeGCSDisk(config))
