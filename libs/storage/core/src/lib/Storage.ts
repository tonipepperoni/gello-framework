/**
 * Storage - Main storage service (application layer)
 *
 * @module @gello/storage
 */

import { Effect, Context, Layer, Stream, Duration, pipe } from "effect"
import {
  FilePath,
  makeFilePath,
  unsafeFilePath,
  basename,
  guessMimeType,
  unsafeJoin,
} from "./domain/index.js"
import type { FileInfo } from "./domain/FileInfo.js"
import type { Visibility } from "./domain/Visibility.js"
import type { StorageError } from "./errors/StorageError.js"
import { InvalidPathError } from "./errors/StorageError.js"
import type { Disk, PutOptions } from "./ports/Disk.js"
import { DiskTag } from "./ports/Disk.js"
import type { StreamableDisk } from "./ports/StreamableDisk.js"
import { isStreamable } from "./ports/StreamableDisk.js"
import type { TemporaryUrlDisk } from "./ports/TemporaryUrlDisk.js"
import { supportsTemporaryUrls } from "./ports/TemporaryUrlDisk.js"

/**
 * Generate a unique filename
 */
const generateUniqueFilename = (mimeType?: string): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  const ext = mimeType ? getExtensionFromMime(mimeType) : ""
  return ext ? `${timestamp}-${random}.${ext}` : `${timestamp}-${random}`
}

/**
 * Get file extension from MIME type
 */
const getExtensionFromMime = (mimeType: string): string => {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "application/pdf": "pdf",
    "application/json": "json",
    "text/plain": "txt",
    "text/html": "html",
    "text/css": "css",
    "text/javascript": "js",
    "application/zip": "zip",
    "video/mp4": "mp4",
    "audio/mpeg": "mp3",
  }
  return map[mimeType] ?? ""
}

/**
 * Storage service interface
 */
export interface StorageService {
  // Basic file operations
  readonly get: (path: string) => Effect.Effect<Uint8Array, StorageError>
  readonly getString: (path: string, encoding?: BufferEncoding) => Effect.Effect<string, StorageError>
  readonly put: (path: string, contents: Uint8Array | string, options?: PutOptions) => Effect.Effect<void, StorageError>
  readonly exists: (path: string) => Effect.Effect<boolean, StorageError>
  readonly missing: (path: string) => Effect.Effect<boolean, StorageError>
  readonly delete: (path: string) => Effect.Effect<boolean, StorageError>
  readonly deleteMany: (paths: ReadonlyArray<string>) => Effect.Effect<void, StorageError>
  readonly copy: (from: string, to: string) => Effect.Effect<void, StorageError>
  readonly move: (from: string, to: string) => Effect.Effect<void, StorageError>

  // Metadata
  readonly size: (path: string) => Effect.Effect<number, StorageError>
  readonly lastModified: (path: string) => Effect.Effect<Date, StorageError>
  readonly mimeType: (path: string) => Effect.Effect<string | null, StorageError>
  readonly getMetadata: (path: string) => Effect.Effect<FileInfo, StorageError>

  // URLs
  readonly url: (path: string) => Effect.Effect<string, StorageError>
  readonly temporaryUrl: (path: string, expiration: Duration.Duration) => Effect.Effect<string, StorageError>

  // Visibility
  readonly getVisibility: (path: string) => Effect.Effect<Visibility, StorageError>
  readonly setVisibility: (path: string, visibility: Visibility) => Effect.Effect<void, StorageError>

  // Append/Prepend
  readonly prepend: (path: string, data: Uint8Array | string) => Effect.Effect<void, StorageError>
  readonly append: (path: string, data: Uint8Array | string) => Effect.Effect<void, StorageError>

  // Directory operations
  readonly files: (directory?: string) => Effect.Effect<ReadonlyArray<string>, StorageError>
  readonly allFiles: (directory?: string) => Effect.Effect<ReadonlyArray<string>, StorageError>
  readonly directories: (directory?: string) => Effect.Effect<ReadonlyArray<string>, StorageError>
  readonly allDirectories: (directory?: string) => Effect.Effect<ReadonlyArray<string>, StorageError>
  readonly makeDirectory: (path: string) => Effect.Effect<void, StorageError>
  readonly deleteDirectory: (path: string) => Effect.Effect<void, StorageError>

  // Streaming
  readonly readStream: (path: string) => Effect.Effect<Stream.Stream<Uint8Array, StorageError>, StorageError>
  readonly writeStream: (path: string, stream: Stream.Stream<Uint8Array, never>, options?: PutOptions) => Effect.Effect<void, StorageError>

  // File uploads
  readonly putFile: (directory: string, contents: Uint8Array, options?: PutOptions) => Effect.Effect<FilePath, StorageError>
  readonly putFileAs: (directory: string, contents: Uint8Array, name: string, options?: PutOptions) => Effect.Effect<FilePath, StorageError>

  // Access underlying disk
  readonly getDisk: () => Disk
}

/**
 * Create a storage service from a disk
 */
export const makeStorageService = (disk: Disk): StorageService => {
  const validatePath = (path: string): Effect.Effect<FilePath, StorageError> =>
    makeFilePath(path).pipe(
      Effect.mapError((e) => new InvalidPathError({ path: e.path, reason: e.reason }))
    )

  const validateOptionalPath = (path?: string): Effect.Effect<FilePath | undefined, StorageError> =>
    path !== undefined
      ? validatePath(path)
      : Effect.succeed(undefined)

  return {
    get: (path) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.get(validPath)
      }),

    getString: (path, encoding = "utf-8") =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.getString(validPath, encoding)
      }),

    put: (path, contents, options) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.put(validPath, contents, options)
      }),

    exists: (path) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.exists(validPath)
      }),

    missing: (path) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.missing(validPath)
      }),

    delete: (path) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.delete(validPath)
      }),

    deleteMany: (paths) =>
      Effect.gen(function* () {
        const validPaths = yield* Effect.all(paths.map(validatePath))
        return yield* disk.deleteMany(validPaths)
      }),

    copy: (from, to) =>
      Effect.gen(function* () {
        const fromPath = yield* validatePath(from)
        const toPath = yield* validatePath(to)
        return yield* disk.copy(fromPath, toPath)
      }),

    move: (from, to) =>
      Effect.gen(function* () {
        const fromPath = yield* validatePath(from)
        const toPath = yield* validatePath(to)
        return yield* disk.move(fromPath, toPath)
      }),

    size: (path) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.size(validPath)
      }),

    lastModified: (path) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.lastModified(validPath)
      }),

    mimeType: (path) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return guessMimeType(validPath)
      }),

    getMetadata: (path) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.getMetadata(validPath)
      }),

    url: (path) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.url(validPath)
      }),

    temporaryUrl: (path, expiration) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        if (supportsTemporaryUrls(disk)) {
          return yield* disk.temporaryUrl(validPath, expiration)
        }
        // Fall back to regular URL if temporary URLs not supported
        return yield* disk.url(validPath)
      }),

    getVisibility: (path) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.getVisibility(validPath)
      }),

    setVisibility: (path, visibility) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.setVisibility(validPath, visibility)
      }),

    prepend: (path, data) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.prepend(validPath, data)
      }),

    append: (path, data) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.append(validPath, data)
      }),

    files: (directory) =>
      Effect.gen(function* () {
        const validDir = yield* validateOptionalPath(directory)
        const paths = yield* disk.files(validDir)
        return paths.map((p) => p as string)
      }),

    allFiles: (directory) =>
      Effect.gen(function* () {
        const validDir = yield* validateOptionalPath(directory)
        const paths = yield* disk.allFiles(validDir)
        return paths.map((p) => p as string)
      }),

    directories: (directory) =>
      Effect.gen(function* () {
        const validDir = yield* validateOptionalPath(directory)
        const paths = yield* disk.directories(validDir)
        return paths.map((p) => p as string)
      }),

    allDirectories: (directory) =>
      Effect.gen(function* () {
        const validDir = yield* validateOptionalPath(directory)
        const paths = yield* disk.allDirectories(validDir)
        return paths.map((p) => p as string)
      }),

    makeDirectory: (path) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.makeDirectory(validPath)
      }),

    deleteDirectory: (path) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        return yield* disk.deleteDirectory(validPath)
      }),

    readStream: (path) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        if (isStreamable(disk)) {
          return yield* disk.readStream(validPath)
        }
        // Fall back to loading entire file
        const contents = yield* disk.get(validPath)
        return Stream.make(contents)
      }),

    writeStream: (path, stream, options) =>
      Effect.gen(function* () {
        const validPath = yield* validatePath(path)
        if (isStreamable(disk)) {
          return yield* disk.writeStream(validPath, stream, options)
        }
        // Fall back to collecting stream
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
        return yield* disk.put(validPath, combined, options)
      }),

    putFile: (directory, contents, options) =>
      Effect.gen(function* () {
        const filename = generateUniqueFilename(options?.mimeType)
        const path = unsafeJoin(directory, filename)
        yield* disk.put(path, contents, options)
        return path
      }),

    putFileAs: (directory, contents, name, options) =>
      Effect.gen(function* () {
        const path = unsafeJoin(directory, name)
        yield* disk.put(path, contents, options)
        return path
      }),

    getDisk: () => disk,
  }
}

/**
 * Context tag for Storage service
 */
export class Storage extends Context.Tag("@gello/storage/Storage")<
  Storage,
  StorageService
>() {}

/**
 * Create a Storage layer from a Disk
 */
export const StorageLive: Layer.Layer<Storage, never, DiskTag> = Layer.effect(
  Storage,
  Effect.gen(function* () {
    const disk = yield* DiskTag
    return makeStorageService(disk)
  })
)

/**
 * Create a Storage layer from a specific disk
 */
export const makeStorageLayer = (disk: Disk): Layer.Layer<Storage> =>
  Layer.succeed(Storage, makeStorageService(disk))
