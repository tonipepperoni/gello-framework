/**
 * AzureDisk - Azure Blob Storage adapter
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
  AZURE,
  DiskTag,
  StreamableDiskTag,
  TemporaryUrlDiskTag,
  FileNotFoundError,
  PermissionDeniedError,
  DiskConnectionError,
  StreamError,
} from "@gello/storage"
import type { StorageError } from "@gello/storage"
import {
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  type BlobDownloadResponseParsed,
} from "@azure/storage-blob"

/**
 * Configuration for AzureDisk
 */
export interface AzureDiskConfig {
  /**
   * Azure Storage account name
   */
  readonly accountName: string

  /**
   * Azure Storage account key
   */
  readonly accountKey: string

  /**
   * Container name
   */
  readonly container: string

  /**
   * Custom endpoint URL (for Azure Government, China, etc.)
   */
  readonly endpoint?: string

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
}

/**
 * Create an AzureDisk adapter
 */
export const makeAzureDisk = (
  config: AzureDiskConfig
): Effect.Effect<Disk & StreamableDisk & TemporaryUrlDisk, never> =>
  Effect.gen(function* () {
    const credential = new StorageSharedKeyCredential(
      config.accountName,
      config.accountKey
    )

    const endpoint =
      config.endpoint ??
      `https://${config.accountName}.blob.core.windows.net`

    const blobServiceClient = new BlobServiceClient(endpoint, credential)
    const containerClient = blobServiceClient.getContainerClient(config.container)

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
      const err = error as { statusCode?: number; code?: string }

      if (err.statusCode === 404 || err.code === "BlobNotFound") {
        return new FileNotFoundError({ path: filePath, disk: AZURE })
      }
      if (err.statusCode === 403 || err.code === "AuthorizationFailure") {
        return new PermissionDeniedError({ path: filePath, disk: AZURE, operation })
      }
      return new DiskConnectionError({
        disk: AZURE,
        cause: error instanceof Error ? error : new Error(String(error)),
      })
    }

    const disk: Disk & StreamableDisk & TemporaryUrlDisk = {
      get: (filePath) =>
        Effect.gen(function* () {
          const blobClient = containerClient.getBlobClient(resolveKey(filePath))
          return yield* Effect.tryPromise({
            try: async () => {
              const response = await blobClient.download()
              const body = response.readableStreamBody
              if (!body) {
                throw new Error("Empty response body")
              }
              const chunks: Buffer[] = []
              for await (const chunk of body) {
                chunks.push(Buffer.from(chunk))
              }
              return new Uint8Array(Buffer.concat(chunks))
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
          const blockBlobClient = containerClient.getBlockBlobClient(
            resolveKey(filePath)
          )
          const data =
            typeof contents === "string"
              ? Buffer.from(contents)
              : Buffer.from(contents)

          yield* Effect.tryPromise({
            try: async () => {
              await blockBlobClient.upload(data, data.length, {
                blobHTTPHeaders: {
                  blobContentType:
                    options?.mimeType ?? guessMimeType(filePath) ?? undefined,
                },
                metadata: options?.metadata,
              })
            },
            catch: (e) => toStorageError(e, filePath, "write"),
          })
        }),

      exists: (filePath) =>
        Effect.gen(function* () {
          const blobClient = containerClient.getBlobClient(resolveKey(filePath))
          return yield* Effect.tryPromise({
            try: async () => blobClient.exists(),
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
          const blobClient = containerClient.getBlobClient(resolveKey(filePath))
          return yield* Effect.tryPromise({
            try: async () => {
              const response = await blobClient.deleteIfExists()
              return response.succeeded
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
          const sourceBlobClient = containerClient.getBlobClient(resolveKey(from))
          const destBlobClient = containerClient.getBlobClient(resolveKey(to))

          yield* Effect.tryPromise({
            try: async () => {
              const copyPoller = await destBlobClient.beginCopyFromURL(
                sourceBlobClient.url
              )
              await copyPoller.pollUntilDone()
            },
            catch: (e) => toStorageError(e, from, "read"),
          })
        }),

      move: (from, to) =>
        Effect.gen(function* () {
          yield* disk.copy(from, to)
          yield* disk.delete(from)
        }),

      size: (filePath) =>
        Effect.gen(function* () {
          const blobClient = containerClient.getBlobClient(resolveKey(filePath))
          return yield* Effect.tryPromise({
            try: async () => {
              const properties = await blobClient.getProperties()
              return properties.contentLength ?? 0
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      lastModified: (filePath) =>
        Effect.gen(function* () {
          const blobClient = containerClient.getBlobClient(resolveKey(filePath))
          return yield* Effect.tryPromise({
            try: async () => {
              const properties = await blobClient.getProperties()
              return properties.lastModified ?? new Date()
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      getMetadata: (filePath) =>
        Effect.gen(function* () {
          const blobClient = containerClient.getBlobClient(resolveKey(filePath))
          return yield* Effect.tryPromise({
            try: async () => {
              const properties = await blobClient.getProperties()
              return FileInfo.make({
                path: filePath,
                size: properties.contentLength ?? 0,
                mimeType: properties.contentType ?? null,
                lastModified: properties.lastModified ?? new Date(),
                visibility: defaultVisibility,
                isDirectory: false,
                metadata: properties.metadata ?? {},
              })
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      url: (filePath) =>
        config.publicUrl
          ? Effect.succeed(`${config.publicUrl}/${resolveKey(filePath)}`)
          : Effect.succeed(
              `${endpoint}/${config.container}/${resolveKey(filePath)}`
            ),

      getVisibility: () => Effect.succeed(defaultVisibility),

      setVisibility: (filePath, visibility) =>
        Effect.gen(function* () {
          // Azure doesn't have per-blob visibility like S3
          // Container-level access policies control this
          // This is a no-op but could set metadata to track visibility
          const blobClient = containerClient.getBlobClient(resolveKey(filePath))
          yield* Effect.tryPromise({
            try: async () => {
              await blobClient.setMetadata({
                visibility,
              })
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
              const results: FilePath[] = []
              for await (const blob of containerClient.listBlobsFlat({
                prefix: prefixPath,
              })) {
                const name = blob.name
                // Only direct children (check for no additional slashes after prefix)
                const relativePath = stripPrefix(name)
                const afterDir = directory
                  ? relativePath.slice(directory.length + 1)
                  : relativePath

                if (!afterDir.includes("/")) {
                  results.push(unsafeFilePath(relativePath))
                }
              }
              return results
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
              const results: FilePath[] = []
              for await (const blob of containerClient.listBlobsFlat({
                prefix: prefixPath,
              })) {
                const relativePath = stripPrefix(blob.name)
                results.push(unsafeFilePath(relativePath))
              }
              return results
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
              const results: FilePath[] = []
              for await (const item of containerClient.listBlobsByHierarchy("/", {
                prefix: prefixPath,
              })) {
                if (item.kind === "prefix" && item.name) {
                  const dirName = item.name.endsWith("/")
                    ? item.name.slice(0, -1)
                    : item.name
                  const relativePath = stripPrefix(dirName)
                  results.push(unsafeFilePath(relativePath))
                }
              }
              return results
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
              const dirs = new Set<string>()
              for await (const blob of containerClient.listBlobsFlat({
                prefix: prefixPath,
              })) {
                const relativePath = stripPrefix(blob.name)
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

      makeDirectory: () => Effect.void, // Azure Blob doesn't have real directories

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
          const blobClient = containerClient.getBlobClient(resolveKey(filePath))

          return yield* Effect.tryPromise({
            try: async () => {
              const response = await blobClient.download()
              const body = response.readableStreamBody

              if (!body) {
                throw new Error("Empty response body")
              }

              return Stream.async<Uint8Array, StorageError>((emit) => {
                body.on("data", (chunk: Buffer) => {
                  emit.single(new Uint8Array(chunk))
                })
                body.on("end", () => {
                  emit.end()
                })
                body.on("error", (err) => {
                  emit.fail(
                    new StreamError({ path: filePath, disk: AZURE, cause: err })
                  )
                })
              })
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      writeStream: (filePath, stream, options) =>
        Effect.gen(function* () {
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

          yield* disk.put(filePath, combined, options)
        }),

      // TemporaryUrlDisk methods
      temporaryUrl: (filePath, expiration) =>
        Effect.gen(function* () {
          const blobClient = containerClient.getBlobClient(resolveKey(filePath))
          const expiresOn = new Date(
            Date.now() +
              Duration.toMillis(expiration ?? defaultTemporaryUrlExpiration)
          )

          return yield* Effect.tryPromise({
            try: async () => {
              const sasToken = generateBlobSASQueryParameters(
                {
                  containerName: config.container,
                  blobName: resolveKey(filePath),
                  permissions: BlobSASPermissions.parse("r"),
                  expiresOn,
                },
                credential
              ).toString()

              return `${blobClient.url}?${sasToken}`
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      temporaryUploadUrl: (filePath, expiration) =>
        Effect.gen(function* () {
          const blobClient = containerClient.getBlobClient(resolveKey(filePath))
          const expiresOn = new Date(
            Date.now() +
              Duration.toMillis(expiration ?? defaultTemporaryUrlExpiration)
          )

          return yield* Effect.tryPromise({
            try: async () => {
              const sasToken = generateBlobSASQueryParameters(
                {
                  containerName: config.container,
                  blobName: resolveKey(filePath),
                  permissions: BlobSASPermissions.parse("cw"),
                  expiresOn,
                },
                credential
              ).toString()

              return `${blobClient.url}?${sasToken}`
            },
            catch: (e) => toStorageError(e, filePath, "write"),
          })
        }),
    }

    return disk
  })

/**
 * Create an AzureDisk layer
 */
export const AzureDiskLive = (
  config: AzureDiskConfig
): Layer.Layer<DiskTag, never> =>
  Layer.effect(DiskTag, makeAzureDisk(config))

/**
 * Create an AzureDisk layer with StreamableDisk
 */
export const AzureDiskStreamableLive = (
  config: AzureDiskConfig
): Layer.Layer<StreamableDiskTag, never> =>
  Layer.effect(StreamableDiskTag, makeAzureDisk(config))

/**
 * Create an AzureDisk layer with TemporaryUrlDisk
 */
export const AzureDiskTemporaryUrlLive = (
  config: AzureDiskConfig
): Layer.Layer<TemporaryUrlDiskTag, never> =>
  Layer.effect(TemporaryUrlDiskTag, makeAzureDisk(config))
