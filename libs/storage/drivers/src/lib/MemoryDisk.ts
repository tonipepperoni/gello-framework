/**
 * MemoryDisk - In-memory storage adapter (for testing)
 *
 * @module @gello/storage-drivers
 */

import { Effect, Layer, Ref, Stream } from "effect"
import type { Disk, PutOptions, StreamableDisk } from "@gello/storage"
import {
  FilePath,
  unsafeFilePath,
  dirname,
  guessMimeType,
  FileInfo,
  Visibility,
  MEMORY,
  DiskTag,
  StreamableDiskTag,
  FileNotFoundError,
} from "@gello/storage"
import type { StorageError } from "@gello/storage"

/**
 * Internal representation of a file in memory
 */
interface MemoryFile {
  readonly contents: Uint8Array
  readonly mimeType: string | null
  readonly visibility: "public" | "private"
  readonly lastModified: Date
  readonly metadata: Record<string, string>
}

/**
 * Configuration for MemoryDisk
 */
export interface MemoryDiskConfig {
  /**
   * Public URL base (for url() method)
   */
  readonly publicUrl?: string

  /**
   * Default visibility for new files
   */
  readonly visibility?: "public" | "private"
}

/**
 * Create a MemoryDisk adapter
 */
export const makeMemoryDisk = (
  config: MemoryDiskConfig = {}
): Effect.Effect<Disk & StreamableDisk, never> =>
  Effect.gen(function* () {
    const files = yield* Ref.make<Map<string, MemoryFile>>(new Map())
    const defaultVisibility = config.visibility ?? "private"

    const disk: Disk & StreamableDisk = {
      get: (filePath) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const file = store.get(filePath)
          if (!file) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: MEMORY })
            )
          }
          return file.contents
        }),

      getString: (filePath, encoding = "utf-8") =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const file = store.get(filePath)
          if (!file) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: MEMORY })
            )
          }
          return new TextDecoder(encoding).decode(file.contents)
        }),

      put: (filePath, contents, options) =>
        Ref.update(files, (store) => {
          const newStore = new Map(store)
          newStore.set(filePath, {
            contents:
              typeof contents === "string"
                ? new TextEncoder().encode(contents)
                : contents instanceof Uint8Array
                  ? contents
                  : new Uint8Array(contents),
            mimeType: options?.mimeType ?? guessMimeType(filePath),
            visibility: options?.visibility ?? defaultVisibility,
            lastModified: new Date(),
            metadata: options?.metadata ?? {},
          })
          return newStore
        }),

      exists: (filePath) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          return store.has(filePath)
        }),

      missing: (filePath) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          return !store.has(filePath)
        }),

      delete: (filePath) =>
        Ref.modify(files, (store) => {
          const existed = store.has(filePath)
          const newStore = new Map(store)
          newStore.delete(filePath)
          return [existed, newStore]
        }),

      deleteMany: (paths) =>
        Ref.update(files, (store) => {
          const newStore = new Map(store)
          for (const p of paths) {
            newStore.delete(p)
          }
          return newStore
        }),

      copy: (from, to) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const file = store.get(from)
          if (!file) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: from, disk: MEMORY })
            )
          }
          yield* Ref.update(files, (s) => {
            const newStore = new Map(s)
            newStore.set(to, { ...file, lastModified: new Date() })
            return newStore
          })
        }),

      move: (from, to) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const file = store.get(from)
          if (!file) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: from, disk: MEMORY })
            )
          }
          yield* Ref.update(files, (s) => {
            const newStore = new Map(s)
            newStore.delete(from)
            newStore.set(to, { ...file, lastModified: new Date() })
            return newStore
          })
        }),

      size: (filePath) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const file = store.get(filePath)
          if (!file) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: MEMORY })
            )
          }
          return file.contents.length
        }),

      lastModified: (filePath) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const file = store.get(filePath)
          if (!file) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: MEMORY })
            )
          }
          return file.lastModified
        }),

      getMetadata: (filePath) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const file = store.get(filePath)
          if (!file) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: MEMORY })
            )
          }
          return FileInfo.make({
            path: filePath,
            size: file.contents.length,
            mimeType: file.mimeType,
            lastModified: file.lastModified,
            visibility: file.visibility,
            isDirectory: false,
            metadata: file.metadata,
          })
        }),

      url: (filePath) =>
        config.publicUrl
          ? Effect.succeed(`${config.publicUrl}/${filePath}`)
          : Effect.succeed(`memory://${filePath}`),

      getVisibility: (filePath) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const file = store.get(filePath)
          if (!file) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: MEMORY })
            )
          }
          return file.visibility
        }),

      setVisibility: (filePath, visibility) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const file = store.get(filePath)
          if (!file) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: MEMORY })
            )
          }
          yield* Ref.update(files, (s) => {
            const newStore = new Map(s)
            newStore.set(filePath, { ...file, visibility })
            return newStore
          })
        }),

      prepend: (filePath, data) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const file = store.get(filePath)
          const newData =
            typeof data === "string"
              ? new TextEncoder().encode(data)
              : new Uint8Array(data)

          if (!file) {
            // Create new file
            yield* Ref.update(files, (s) => {
              const newStore = new Map(s)
              newStore.set(filePath, {
                contents: newData,
                mimeType: guessMimeType(filePath),
                visibility: defaultVisibility,
                lastModified: new Date(),
                metadata: {},
              })
              return newStore
            })
          } else {
            // Prepend to existing
            const combined = new Uint8Array(newData.length + file.contents.length)
            combined.set(newData, 0)
            combined.set(file.contents, newData.length)
            yield* Ref.update(files, (s) => {
              const newStore = new Map(s)
              newStore.set(filePath, {
                ...file,
                contents: combined,
                lastModified: new Date(),
              })
              return newStore
            })
          }
        }),

      append: (filePath, data) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const file = store.get(filePath)
          const newData =
            typeof data === "string"
              ? new TextEncoder().encode(data)
              : new Uint8Array(data)

          if (!file) {
            // Create new file
            yield* Ref.update(files, (s) => {
              const newStore = new Map(s)
              newStore.set(filePath, {
                contents: newData,
                mimeType: guessMimeType(filePath),
                visibility: defaultVisibility,
                lastModified: new Date(),
                metadata: {},
              })
              return newStore
            })
          } else {
            // Append to existing
            const combined = new Uint8Array(file.contents.length + newData.length)
            combined.set(file.contents, 0)
            combined.set(newData, file.contents.length)
            yield* Ref.update(files, (s) => {
              const newStore = new Map(s)
              newStore.set(filePath, {
                ...file,
                contents: combined,
                lastModified: new Date(),
              })
              return newStore
            })
          }
        }),

      files: (directory) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const prefix = directory ? `${directory}/` : ""
          const results: FilePath[] = []

          for (const key of store.keys()) {
            if (directory) {
              if (key.startsWith(prefix)) {
                const rest = key.slice(prefix.length)
                // Only direct children (no nested directories)
                if (!rest.includes("/")) {
                  results.push(unsafeFilePath(key))
                }
              }
            } else {
              // Root level files (no directory separator)
              if (!key.includes("/")) {
                results.push(unsafeFilePath(key))
              }
            }
          }

          return results
        }),

      allFiles: (directory) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const prefix = directory ? `${directory}/` : ""
          const results: FilePath[] = []

          for (const key of store.keys()) {
            if (directory) {
              if (key.startsWith(prefix)) {
                results.push(unsafeFilePath(key))
              }
            } else {
              results.push(unsafeFilePath(key))
            }
          }

          return results
        }),

      directories: (directory) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const prefix = directory ? `${directory}/` : ""
          const dirs = new Set<string>()

          for (const key of store.keys()) {
            let path = key
            if (directory) {
              if (!key.startsWith(prefix)) continue
              path = key.slice(prefix.length)
            }

            const slashIndex = path.indexOf("/")
            if (slashIndex > 0) {
              const dir = directory
                ? `${directory}/${path.slice(0, slashIndex)}`
                : path.slice(0, slashIndex)
              dirs.add(dir)
            }
          }

          return Array.from(dirs).map(unsafeFilePath)
        }),

      allDirectories: (directory) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const prefix = directory ? `${directory}/` : ""
          const dirs = new Set<string>()

          for (const key of store.keys()) {
            let path = key
            if (directory) {
              if (!key.startsWith(prefix)) continue
              path = key.slice(prefix.length)
            }

            // Extract all directory levels
            const parts = path.split("/")
            let current = directory ?? ""
            for (let i = 0; i < parts.length - 1; i++) {
              current = current ? `${current}/${parts[i]}` : parts[i]
              dirs.add(current)
            }
          }

          return Array.from(dirs).map(unsafeFilePath)
        }),

      makeDirectory: () => Effect.void, // No-op for memory disk

      deleteDirectory: (dirPath) =>
        Ref.update(files, (store) => {
          const prefix = `${dirPath}/`
          const newStore = new Map(store)
          for (const key of newStore.keys()) {
            if (key === dirPath || key.startsWith(prefix)) {
              newStore.delete(key)
            }
          }
          return newStore
        }),

      // StreamableDisk methods
      readStream: (filePath) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files)
          const file = store.get(filePath)
          if (!file) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: MEMORY })
            )
          }
          return Stream.make(file.contents)
        }),

      writeStream: (filePath, stream, options) =>
        Effect.gen(function* () {
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

          yield* Ref.update(files, (store) => {
            const newStore = new Map(store)
            newStore.set(filePath, {
              contents: combined,
              mimeType: options?.mimeType ?? guessMimeType(filePath),
              visibility: options?.visibility ?? defaultVisibility,
              lastModified: new Date(),
              metadata: options?.metadata ?? {},
            })
            return newStore
          })
        }),
    }

    return disk
  })

/**
 * Create a MemoryDisk layer
 */
export const MemoryDiskLive = (
  config: MemoryDiskConfig = {}
): Layer.Layer<DiskTag, never> =>
  Layer.effect(DiskTag, makeMemoryDisk(config))

/**
 * Create a default MemoryDisk layer (no config needed)
 */
export const MemoryDiskDefaultLive: Layer.Layer<DiskTag, never> =
  Layer.effect(DiskTag, makeMemoryDisk())

/**
 * Create a MemoryDisk layer with StreamableDisk tag
 */
export const MemoryDiskStreamableLive = (
  config: MemoryDiskConfig = {}
): Layer.Layer<StreamableDiskTag, never> =>
  Layer.effect(StreamableDiskTag, makeMemoryDisk(config))
