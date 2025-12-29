/**
 * LocalDisk - Local filesystem adapter
 *
 * @module @gello/storage-drivers
 */

import { Effect, Layer, Stream, pipe } from "effect"
import * as fs from "node:fs"
import * as path from "node:path"
import type { Disk, PutOptions } from "@gello/storage"
import type { StreamableDisk } from "@gello/storage"
import {
  FilePath,
  unsafeFilePath,
  basename,
  guessMimeType,
  FileInfo,
  Visibility,
  LOCAL,
  DiskTag,
  StreamableDiskTag,
  FileNotFoundError,
  PermissionDeniedError,
  IsADirectoryError,
  StreamError,
} from "@gello/storage"
import type { StorageError } from "@gello/storage"

/**
 * Configuration for LocalDisk
 */
export interface LocalDiskConfig {
  /**
   * Root directory for storage
   */
  readonly root: string

  /**
   * Public URL base (for url() method)
   */
  readonly publicUrl?: string

  /**
   * Default visibility for new files
   */
  readonly visibility?: "public" | "private"

  /**
   * File permissions (octal)
   */
  readonly permissions?: {
    readonly file?: number
    readonly directory?: number
  }
}

/**
 * Create a LocalDisk adapter
 */
export const makeLocalDisk = (
  config: LocalDiskConfig
): Effect.Effect<Disk & StreamableDisk, never> =>
  Effect.gen(function* () {
    const root = path.resolve(config.root)
    const defaultVisibility = config.visibility ?? "private"
    const filePerms = config.permissions?.file ?? 0o644
    const dirPerms = config.permissions?.directory ?? 0o755

    // Ensure root directory exists
    yield* Effect.sync(() => {
      if (!fs.existsSync(root)) {
        fs.mkdirSync(root, { recursive: true, mode: dirPerms })
      }
    })

    const resolvePath = (filePath: FilePath): string =>
      path.join(root, filePath)

    const ensureDirectory = (filePath: string): Effect.Effect<void, never> =>
      Effect.sync(() => {
        const dir = path.dirname(filePath)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true, mode: dirPerms })
        }
      })

    const toStorageError = (error: unknown, filePath: FilePath, operation: "read" | "write" | "delete" | "list"): StorageError => {
      const err = error as NodeJS.ErrnoException
      if (err.code === "ENOENT") {
        return new FileNotFoundError({ path: filePath, disk: LOCAL })
      }
      if (err.code === "EACCES" || err.code === "EPERM") {
        return new PermissionDeniedError({ path: filePath, disk: LOCAL, operation })
      }
      if (err.code === "EISDIR") {
        return new IsADirectoryError({ path: filePath, disk: LOCAL })
      }
      return new PermissionDeniedError({ path: filePath, disk: LOCAL, operation })
    }

    const disk: Disk & StreamableDisk = {
      get: (filePath) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath)
          return yield* Effect.try({
            try: () => new Uint8Array(fs.readFileSync(fullPath)),
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      getString: (filePath, encoding = "utf-8") =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath)
          return yield* Effect.try({
            try: () => fs.readFileSync(fullPath, encoding),
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      put: (filePath, contents, options) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath)
          yield* ensureDirectory(fullPath)

          const data =
            typeof contents === "string"
              ? Buffer.from(contents)
              : Buffer.from(contents)

          yield* Effect.try({
            try: () => fs.writeFileSync(fullPath, data, { mode: filePerms }),
            catch: (e) => toStorageError(e, filePath, "write"),
          })
        }),

      exists: (filePath) =>
        Effect.sync(() => fs.existsSync(resolvePath(filePath))),

      missing: (filePath) =>
        Effect.sync(() => !fs.existsSync(resolvePath(filePath))),

      delete: (filePath) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath)
          return yield* Effect.try({
            try: () => {
              if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath)
                return true
              }
              return false
            },
            catch: (e) => toStorageError(e, filePath, "delete"),
          })
        }),

      deleteMany: (paths) =>
        Effect.forEach(paths, (p) =>
          Effect.try({
            try: () => {
              const fullPath = resolvePath(p)
              if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath)
              }
            },
            catch: (e) => toStorageError(e, p, "delete"),
          })
        ).pipe(Effect.asVoid),

      copy: (from, to) =>
        Effect.gen(function* () {
          const fromPath = resolvePath(from)
          const toPath = resolvePath(to)
          yield* ensureDirectory(toPath)
          yield* Effect.try({
            try: () => fs.copyFileSync(fromPath, toPath),
            catch: (e) => toStorageError(e, from, "read"),
          })
        }),

      move: (from, to) =>
        Effect.gen(function* () {
          const fromPath = resolvePath(from)
          const toPath = resolvePath(to)
          yield* ensureDirectory(toPath)
          yield* Effect.try({
            try: () => fs.renameSync(fromPath, toPath),
            catch: (e) => toStorageError(e, from, "write"),
          })
        }),

      size: (filePath) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath)
          return yield* Effect.try({
            try: () => fs.statSync(fullPath).size,
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      lastModified: (filePath) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath)
          return yield* Effect.try({
            try: () => fs.statSync(fullPath).mtime,
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      getMetadata: (filePath) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath)
          return yield* Effect.try({
            try: () => {
              const stats = fs.statSync(fullPath)
              return FileInfo.make({
                path: filePath,
                size: stats.size,
                mimeType: guessMimeType(filePath),
                lastModified: stats.mtime,
                visibility: defaultVisibility,
                isDirectory: stats.isDirectory(),
              })
            },
            catch: (e) => toStorageError(e, filePath, "read"),
          })
        }),

      url: (filePath) =>
        config.publicUrl
          ? Effect.succeed(`${config.publicUrl}/${filePath}`)
          : Effect.succeed(`file://${resolvePath(filePath)}`),

      getVisibility: () => Effect.succeed(defaultVisibility),

      setVisibility: (filePath, visibility) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath)
          const mode = visibility === "public" ? 0o644 : 0o600
          yield* Effect.try({
            try: () => fs.chmodSync(fullPath, mode),
            catch: (e) => toStorageError(e, filePath, "write"),
          })
        }),

      prepend: (filePath, data) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath)
          yield* Effect.try({
            try: () => {
              const existing = fs.existsSync(fullPath)
                ? fs.readFileSync(fullPath)
                : Buffer.alloc(0)
              const newData =
                typeof data === "string" ? Buffer.from(data) : Buffer.from(data)
              fs.writeFileSync(fullPath, Buffer.concat([newData, existing]))
            },
            catch: (e) => toStorageError(e, filePath, "write"),
          })
        }),

      append: (filePath, data) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath)
          yield* ensureDirectory(fullPath)
          yield* Effect.try({
            try: () => {
              const newData =
                typeof data === "string" ? Buffer.from(data) : Buffer.from(data)
              fs.appendFileSync(fullPath, newData)
            },
            catch: (e) => toStorageError(e, filePath, "write"),
          })
        }),

      files: (directory) =>
        Effect.gen(function* () {
          const dir = directory ? resolvePath(directory) : root
          return yield* Effect.try({
            try: () => {
              if (!fs.existsSync(dir)) return []
              const entries = fs.readdirSync(dir, { withFileTypes: true })
              return entries
                .filter((e) => e.isFile())
                .map((e) =>
                  unsafeFilePath(directory ? `${directory}/${e.name}` : e.name)
                )
            },
            catch: (e) => toStorageError(e, directory ?? unsafeFilePath("."), "list"),
          })
        }),

      allFiles: (directory) =>
        Effect.gen(function* () {
          const results: FilePath[] = []
          const walk = (dir: string, prefix: string): void => {
            if (!fs.existsSync(dir)) return
            const entries = fs.readdirSync(dir, { withFileTypes: true })
            for (const entry of entries) {
              const entryPath = prefix ? `${prefix}/${entry.name}` : entry.name
              if (entry.isFile()) {
                results.push(unsafeFilePath(entryPath))
              } else if (entry.isDirectory()) {
                walk(path.join(dir, entry.name), entryPath)
              }
            }
          }
          const startDir = directory ? resolvePath(directory) : root
          yield* Effect.try({
            try: () => walk(startDir, directory ?? ""),
            catch: (e) => toStorageError(e, directory ?? unsafeFilePath("."), "list"),
          })
          return results
        }),

      directories: (directory) =>
        Effect.gen(function* () {
          const dir = directory ? resolvePath(directory) : root
          return yield* Effect.try({
            try: () => {
              if (!fs.existsSync(dir)) return []
              const entries = fs.readdirSync(dir, { withFileTypes: true })
              return entries
                .filter((e) => e.isDirectory())
                .map((e) =>
                  unsafeFilePath(directory ? `${directory}/${e.name}` : e.name)
                )
            },
            catch: (e) => toStorageError(e, directory ?? unsafeFilePath("."), "list"),
          })
        }),

      allDirectories: (directory) =>
        Effect.gen(function* () {
          const results: FilePath[] = []
          const walk = (dir: string, prefix: string): void => {
            if (!fs.existsSync(dir)) return
            const entries = fs.readdirSync(dir, { withFileTypes: true })
            for (const entry of entries) {
              if (entry.isDirectory()) {
                const entryPath = prefix ? `${prefix}/${entry.name}` : entry.name
                results.push(unsafeFilePath(entryPath))
                walk(path.join(dir, entry.name), entryPath)
              }
            }
          }
          const startDir = directory ? resolvePath(directory) : root
          yield* Effect.try({
            try: () => walk(startDir, directory ?? ""),
            catch: (e) => toStorageError(e, directory ?? unsafeFilePath("."), "list"),
          })
          return results
        }),

      makeDirectory: (dirPath) =>
        Effect.try({
          try: () => {
            const fullPath = resolvePath(dirPath)
            fs.mkdirSync(fullPath, { recursive: true, mode: dirPerms })
          },
          catch: (e) => toStorageError(e, dirPath, "write"),
        }),

      deleteDirectory: (dirPath) =>
        Effect.try({
          try: () => {
            const fullPath = resolvePath(dirPath)
            if (fs.existsSync(fullPath)) {
              fs.rmSync(fullPath, { recursive: true, force: true })
            }
          },
          catch: (e) => toStorageError(e, dirPath, "delete"),
        }),

      // StreamableDisk methods
      readStream: (filePath) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath)

          // Check file exists first
          const exists = yield* Effect.sync(() => fs.existsSync(fullPath))
          if (!exists) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: LOCAL })
            )
          }

          return Stream.async<Uint8Array, StorageError>((emit) => {
            const nodeStream = fs.createReadStream(fullPath)

            nodeStream.on("data", (chunk: Buffer) => {
              emit.single(new Uint8Array(chunk))
            })

            nodeStream.on("end", () => {
              emit.end()
            })

            nodeStream.on("error", (err) => {
              emit.fail(new StreamError({ path: filePath, disk: LOCAL, cause: err }))
            })
          })
        }),

      writeStream: (filePath, stream, options) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath)
          yield* ensureDirectory(fullPath)

          const writeStream = fs.createWriteStream(fullPath)

          yield* pipe(
            stream,
            Stream.runForEach((chunk) =>
              Effect.async<void, StreamError>((resume) => {
                const canContinue = writeStream.write(Buffer.from(chunk))
                if (canContinue) {
                  resume(Effect.void)
                } else {
                  writeStream.once("drain", () => resume(Effect.void))
                }
              })
            ),
            Effect.catchAll((e) =>
              Effect.fail(new StreamError({ path: filePath, disk: LOCAL, cause: e }))
            )
          )

          yield* Effect.async<void, StreamError>((resume) => {
            writeStream.end(() => resume(Effect.void))
            writeStream.on("error", (err) =>
              resume(Effect.fail(new StreamError({ path: filePath, disk: LOCAL, cause: err })))
            )
          })
        }),
    }

    return disk
  })

/**
 * Create a LocalDisk layer
 */
export const LocalDiskLive = (
  config: LocalDiskConfig
): Layer.Layer<DiskTag, never> =>
  Layer.effect(DiskTag, makeLocalDisk(config))

/**
 * Create a LocalDisk layer with StreamableDisk
 */
export const LocalDiskStreamableLive = (
  config: LocalDiskConfig
): Layer.Layer<StreamableDiskTag, never> =>
  Layer.effect(StreamableDiskTag, makeLocalDisk(config))
