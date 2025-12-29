/**
 * S3Disk - Amazon S3 / S3-compatible storage adapter
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
  S3,
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
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  CopyObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  type S3ClientConfig,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

/**
 * Configuration for S3Disk
 */
export interface S3DiskConfig {
  /**
   * S3 bucket name
   */
  readonly bucket: string

  /**
   * AWS region
   */
  readonly region: string

  /**
   * AWS access key ID (optional if using IAM roles)
   */
  readonly accessKeyId?: string

  /**
   * AWS secret access key (optional if using IAM roles)
   */
  readonly secretAccessKey?: string

  /**
   * Custom endpoint URL (for S3-compatible services like MinIO, R2)
   */
  readonly endpoint?: string

  /**
   * Force path-style URLs (required for some S3-compatible services)
   */
  readonly forcePathStyle?: boolean

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
 * Create an S3Disk adapter
 */
export const makeS3Disk = (
  config: S3DiskConfig
): Effect.Effect<Disk & StreamableDisk & TemporaryUrlDisk, never> =>
  Effect.gen(function* () {
    const clientConfig: S3ClientConfig = {
      region: config.region,
      ...(config.accessKeyId && config.secretAccessKey
        ? {
            credentials: {
              accessKeyId: config.accessKeyId,
              secretAccessKey: config.secretAccessKey,
            },
          }
        : {}),
      ...(config.endpoint ? { endpoint: config.endpoint } : {}),
      ...(config.forcePathStyle !== undefined
        ? { forcePathStyle: config.forcePathStyle }
        : {}),
    }

    const client = new S3Client(clientConfig)
    const bucket = config.bucket
    const prefix = config.prefix ?? ""
    const defaultVisibility = config.visibility ?? "private"
    const defaultTemporaryUrlExpiration =
      config.temporaryUrlExpiration ?? Duration.hours(1)

    const resolveKey = (filePath: FilePath): string =>
      prefix ? `${prefix}/${filePath}` : filePath

    const toStorageError = (
      error: unknown,
      filePath: FilePath,
      operation: "read" | "write" | "delete" | "list"
    ): StorageError => {
      const err = error as { name?: string; $metadata?: { httpStatusCode?: number } }
      const statusCode = err.$metadata?.httpStatusCode

      if (err.name === "NoSuchKey" || statusCode === 404) {
        return new FileNotFoundError({ path: filePath, disk: S3 })
      }
      if (err.name === "AccessDenied" || statusCode === 403) {
        return new PermissionDeniedError({ path: filePath, disk: S3, operation })
      }
      return new DiskConnectionError({
        disk: S3,
        cause: error instanceof Error ? error : new Error(String(error)),
      })
    }

    const disk: Disk & StreamableDisk & TemporaryUrlDisk = {
      get: (filePath) =>
        Effect.gen(function* () {
          const key = resolveKey(filePath)
          return yield* Effect.tryPromise({
            try: async () => {
              const command = new GetObjectCommand({ Bucket: bucket, Key: key })
              const response = await client.send(command)
              const body = response.Body
              if (!body) {
                throw new Error("Empty response body")
              }
              return new Uint8Array(await body.transformToByteArray())
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      getString: (filePath, encoding = "utf-8") =>
        Effect.gen(function* () {
          const key = resolveKey(filePath)
          return yield* Effect.tryPromise({
            try: async () => {
              const command = new GetObjectCommand({ Bucket: bucket, Key: key })
              const response = await client.send(command)
              const body = response.Body
              if (!body) {
                throw new Error("Empty response body")
              }
              return await body.transformToString(encoding)
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      put: (filePath, contents, options) =>
        Effect.gen(function* () {
          const key = resolveKey(filePath)
          const body =
            typeof contents === "string"
              ? Buffer.from(contents)
              : Buffer.from(contents)

          yield* Effect.tryPromise({
            try: async () => {
              const command = new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: body,
                ContentType: options?.mimeType ?? guessMimeType(filePath) ?? undefined,
                ACL:
                  (options?.visibility ?? defaultVisibility) === "public"
                    ? "public-read"
                    : "private",
                Metadata: options?.metadata,
              })
              await client.send(command)
            },
            catch: (e) => toStorageError(e, filePath, "write"),
          })
        }),

      exists: (filePath) =>
        Effect.gen(function* () {
          const key = resolveKey(filePath)
          return yield* Effect.tryPromise({
            try: async () => {
              const command = new HeadObjectCommand({ Bucket: bucket, Key: key })
              await client.send(command)
              return true
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
          const key = resolveKey(filePath)
          return yield* Effect.tryPromise({
            try: async () => {
              const command = new DeleteObjectCommand({ Bucket: bucket, Key: key })
              await client.send(command)
              return true
            },
            catch: (e) => toStorageError(e, filePath, "delete"),
          })
        }),

      deleteMany: (paths) =>
        Effect.gen(function* () {
          if (paths.length === 0) return

          const objects = paths.map((p) => ({ Key: resolveKey(p) }))

          yield* Effect.tryPromise({
            try: async () => {
              const command = new DeleteObjectsCommand({
                Bucket: bucket,
                Delete: { Objects: objects },
              })
              await client.send(command)
            },
            catch: (e) => toStorageError(e, paths[0], "delete"),
          })
        }),

      copy: (from, to) =>
        Effect.gen(function* () {
          const fromKey = resolveKey(from)
          const toKey = resolveKey(to)

          yield* Effect.tryPromise({
            try: async () => {
              const command = new CopyObjectCommand({
                Bucket: bucket,
                CopySource: `${bucket}/${fromKey}`,
                Key: toKey,
              })
              await client.send(command)
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
          const key = resolveKey(filePath)
          return yield* Effect.tryPromise({
            try: async () => {
              const command = new HeadObjectCommand({ Bucket: bucket, Key: key })
              const response = await client.send(command)
              return response.ContentLength ?? 0
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      lastModified: (filePath) =>
        Effect.gen(function* () {
          const key = resolveKey(filePath)
          return yield* Effect.tryPromise({
            try: async () => {
              const command = new HeadObjectCommand({ Bucket: bucket, Key: key })
              const response = await client.send(command)
              return response.LastModified ?? new Date()
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      getMetadata: (filePath) =>
        Effect.gen(function* () {
          const key = resolveKey(filePath)
          return yield* Effect.tryPromise({
            try: async () => {
              const command = new HeadObjectCommand({ Bucket: bucket, Key: key })
              const response = await client.send(command)
              return FileInfo.make({
                path: filePath,
                size: response.ContentLength ?? 0,
                mimeType: response.ContentType ?? null,
                lastModified: response.LastModified ?? new Date(),
                visibility: defaultVisibility,
                isDirectory: false,
                metadata: response.Metadata ?? {},
              })
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      url: (filePath) =>
        config.publicUrl
          ? Effect.succeed(`${config.publicUrl}/${resolveKey(filePath)}`)
          : Effect.succeed(
              `https://${bucket}.s3.${config.region}.amazonaws.com/${resolveKey(filePath)}`
            ),

      getVisibility: () => Effect.succeed(defaultVisibility),

      setVisibility: (filePath, visibility) =>
        Effect.gen(function* () {
          const key = resolveKey(filePath)
          yield* Effect.tryPromise({
            try: async () => {
              // Copy object to itself with new ACL
              const command = new CopyObjectCommand({
                Bucket: bucket,
                CopySource: `${bucket}/${key}`,
                Key: key,
                ACL: visibility === "public" ? "public-read" : "private",
                MetadataDirective: "COPY",
              })
              await client.send(command)
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
              const command = new ListObjectsV2Command({
                Bucket: bucket,
                Prefix: prefixPath,
                Delimiter: "/",
              })
              const response = await client.send(command)
              const contents = response.Contents ?? []

              return contents
                .filter((obj) => obj.Key && !obj.Key.endsWith("/"))
                .map((obj) => {
                  const key = obj.Key!
                  const relativePath = prefix ? key.slice(prefix.length + 1) : key
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
              const results: FilePath[] = []
              let continuationToken: string | undefined

              do {
                const command = new ListObjectsV2Command({
                  Bucket: bucket,
                  Prefix: prefixPath,
                  ContinuationToken: continuationToken,
                })
                const response = await client.send(command)
                const contents = response.Contents ?? []

                for (const obj of contents) {
                  if (obj.Key && !obj.Key.endsWith("/")) {
                    const relativePath = prefix
                      ? obj.Key.slice(prefix.length + 1)
                      : obj.Key
                    results.push(unsafeFilePath(relativePath))
                  }
                }

                continuationToken = response.NextContinuationToken
              } while (continuationToken)

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
              const command = new ListObjectsV2Command({
                Bucket: bucket,
                Prefix: prefixPath,
                Delimiter: "/",
              })
              const response = await client.send(command)
              const commonPrefixes = response.CommonPrefixes ?? []

              return commonPrefixes
                .filter((cp) => cp.Prefix)
                .map((cp) => {
                  const dir = cp.Prefix!.slice(0, -1) // Remove trailing /
                  const relativePath = prefix ? dir.slice(prefix.length + 1) : dir
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
              const dirs = new Set<string>()
              let continuationToken: string | undefined

              do {
                const command = new ListObjectsV2Command({
                  Bucket: bucket,
                  Prefix: prefixPath,
                  ContinuationToken: continuationToken,
                })
                const response = await client.send(command)
                const contents = response.Contents ?? []

                for (const obj of contents) {
                  if (obj.Key) {
                    const relativePath = prefix
                      ? obj.Key.slice(prefix.length + 1)
                      : obj.Key
                    const parts = relativePath.split("/")

                    // Extract all directory levels
                    let current = directory ?? ""
                    for (let i = 0; i < parts.length - 1; i++) {
                      current = current ? `${current}/${parts[i]}` : parts[i]
                      dirs.add(current)
                    }
                  }
                }

                continuationToken = response.NextContinuationToken
              } while (continuationToken)

              return Array.from(dirs).map(unsafeFilePath)
            },
            catch: (e) =>
              toStorageError(e, unsafeFilePath(directory ?? "."), "list"),
          })
        }),

      makeDirectory: () => Effect.void, // S3 doesn't have real directories

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
          const key = resolveKey(filePath)

          return yield* Effect.tryPromise({
            try: async () => {
              const command = new GetObjectCommand({ Bucket: bucket, Key: key })
              const response = await client.send(command)
              const body = response.Body

              if (!body) {
                throw new Error("Empty response body")
              }

              // Convert readable stream to Effect Stream
              const webStream = body.transformToWebStream()
              const reader = webStream.getReader()

              return Stream.async<Uint8Array, StorageError>((emit) => {
                const read = async (): Promise<void> => {
                  try {
                    const { done, value } = await reader.read()
                    if (done) {
                      emit.end()
                    } else {
                      emit.single(new Uint8Array(value))
                      await read()
                    }
                  } catch (err) {
                    emit.fail(
                      new StreamError({ path: filePath, disk: S3, cause: err })
                    )
                  }
                }
                read()
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
          const key = resolveKey(filePath)
          const expiresIn = Duration.toSeconds(expiration ?? defaultTemporaryUrlExpiration)

          return yield* Effect.tryPromise({
            try: async () => {
              const command = new GetObjectCommand({ Bucket: bucket, Key: key })
              return await getSignedUrl(client, command, { expiresIn })
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      temporaryUploadUrl: (filePath, expiration) =>
        Effect.gen(function* () {
          const key = resolveKey(filePath)
          const expiresIn = Duration.toSeconds(expiration ?? defaultTemporaryUrlExpiration)

          return yield* Effect.tryPromise({
            try: async () => {
              const command = new PutObjectCommand({ Bucket: bucket, Key: key })
              return await getSignedUrl(client, command, { expiresIn })
            },
            catch: (e) => toStorageError(e, filePath, "write"),
          })
        }),
    }

    return disk
  })

/**
 * Create an S3Disk layer
 */
export const S3DiskLive = (
  config: S3DiskConfig
): Layer.Layer<DiskTag, never> =>
  Layer.effect(DiskTag, makeS3Disk(config))

/**
 * Create an S3Disk layer with StreamableDisk
 */
export const S3DiskStreamableLive = (
  config: S3DiskConfig
): Layer.Layer<StreamableDiskTag, never> =>
  Layer.effect(StreamableDiskTag, makeS3Disk(config))

/**
 * Create an S3Disk layer with TemporaryUrlDisk
 */
export const S3DiskTemporaryUrlLive = (
  config: S3DiskConfig
): Layer.Layer<TemporaryUrlDiskTag, never> =>
  Layer.effect(TemporaryUrlDiskTag, makeS3Disk(config))
