/**
 * Testing utilities for @gello/storage
 *
 * @module @gello/storage/testing
 */

import { Effect, Layer, Ref } from "effect"
import type { Disk, PutOptions, StreamableDisk } from "./ports/index.js"
import type { StorageService } from "./Storage.js"
import { Storage, makeStorageService } from "./Storage.js"
import type { FilePath } from "./domain/FilePath.js"
import { unsafeFilePath, guessMimeType } from "./domain/index.js"
import { FileInfo } from "./domain/FileInfo.js"
import { DiskTag, StreamableDiskTag } from "./ports/index.js"
import { FileNotFoundError } from "./errors/StorageError.js"
import { MEMORY } from "./domain/DiskName.js"
import { Stream } from "effect"

/**
 * Test file structure for MockStorage
 */
export interface MockFile {
  readonly contents: Uint8Array
  readonly mimeType: string | null
  readonly visibility: "public" | "private"
  readonly lastModified: Date
  readonly metadata: Record<string, string>
}

/**
 * Configuration for MockStorage
 */
export interface MockStorageConfig {
  /**
   * Initial files to populate the storage with
   */
  readonly files?: Record<string, string | Uint8Array>

  /**
   * Default visibility
   */
  readonly visibility?: "public" | "private"

  /**
   * Simulate errors for specific operations
   */
  readonly simulateErrors?: {
    readonly get?: string[]
    readonly put?: string[]
    readonly delete?: string[]
  }
}

/**
 * Create a mock storage disk for testing
 *
 * @example
 * ```typescript
 * const { disk, getFiles, clear } = await Effect.runPromise(
 *   makeMockDisk({
 *     files: {
 *       "test.txt": "Hello, World!",
 *       "data.json": JSON.stringify({ foo: "bar" }),
 *     },
 *   })
 * )
 *
 * // Use in tests
 * const storage = makeStorageService(disk)
 * const content = await Effect.runPromise(storage.getString("test.txt"))
 * expect(content).toBe("Hello, World!")
 *
 * // Inspect stored files
 * const files = getFiles()
 * expect(files.size).toBe(2)
 *
 * // Clear all files
 * clear()
 * ```
 */
export const makeMockDisk = (
  config: MockStorageConfig = {}
): Effect.Effect<
  {
    readonly disk: Disk & StreamableDisk
    readonly getFiles: () => Map<string, MockFile>
    readonly getFile: (path: string) => MockFile | undefined
    readonly setFile: (path: string, contents: string | Uint8Array) => void
    readonly clear: () => void
  },
  never
> =>
  Effect.gen(function* () {
    const filesRef = yield* Ref.make<Map<string, MockFile>>(new Map())
    const defaultVisibility = config.visibility ?? "private"

    // Initialize with provided files
    if (config.files) {
      yield* Ref.update(filesRef, (store) => {
        const newStore = new Map(store)
        for (const [path, contents] of Object.entries(config.files!)) {
          const data =
            typeof contents === "string"
              ? new TextEncoder().encode(contents)
              : contents
          newStore.set(path, {
            contents: data,
            mimeType: guessMimeType(unsafeFilePath(path)),
            visibility: defaultVisibility,
            lastModified: new Date(),
            metadata: {},
          })
        }
        return newStore
      })
    }

    const shouldError = (operation: "get" | "put" | "delete", path: string): boolean => {
      const paths = config.simulateErrors?.[operation]
      return paths ? paths.includes(path) : false
    }

    const disk: Disk & StreamableDisk = {
      get: (filePath) =>
        Effect.gen(function* () {
          if (shouldError("get", filePath)) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: MEMORY })
            )
          }
          const store = yield* Ref.get(filesRef)
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
          if (shouldError("get", filePath)) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: MEMORY })
            )
          }
          const store = yield* Ref.get(filesRef)
          const file = store.get(filePath)
          if (!file) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: MEMORY })
            )
          }
          return new TextDecoder(encoding).decode(file.contents)
        }),

      put: (filePath, contents, options) =>
        Effect.gen(function* () {
          if (shouldError("put", filePath)) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: MEMORY })
            )
          }
          yield* Ref.update(filesRef, (store) => {
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
          })
        }),

      exists: (filePath) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(filesRef)
          return store.has(filePath)
        }),

      missing: (filePath) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(filesRef)
          return !store.has(filePath)
        }),

      delete: (filePath) =>
        Effect.gen(function* () {
          if (shouldError("delete", filePath)) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: MEMORY })
            )
          }
          return yield* Ref.modify(filesRef, (store) => {
            const existed = store.has(filePath)
            const newStore = new Map(store)
            newStore.delete(filePath)
            return [existed, newStore]
          })
        }),

      deleteMany: (paths) =>
        Ref.update(filesRef, (store) => {
          const newStore = new Map(store)
          for (const p of paths) {
            newStore.delete(p)
          }
          return newStore
        }),

      copy: (from, to) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(filesRef)
          const file = store.get(from)
          if (!file) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: from, disk: MEMORY })
            )
          }
          yield* Ref.update(filesRef, (s) => {
            const newStore = new Map(s)
            newStore.set(to, { ...file, lastModified: new Date() })
            return newStore
          })
        }),

      move: (from, to) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(filesRef)
          const file = store.get(from)
          if (!file) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: from, disk: MEMORY })
            )
          }
          yield* Ref.update(filesRef, (s) => {
            const newStore = new Map(s)
            newStore.delete(from)
            newStore.set(to, { ...file, lastModified: new Date() })
            return newStore
          })
        }),

      size: (filePath) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(filesRef)
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
          const store = yield* Ref.get(filesRef)
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
          const store = yield* Ref.get(filesRef)
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

      url: (filePath) => Effect.succeed(`mock://${filePath}`),

      getVisibility: (filePath) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(filesRef)
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
          const store = yield* Ref.get(filesRef)
          const file = store.get(filePath)
          if (!file) {
            return yield* Effect.fail(
              new FileNotFoundError({ path: filePath, disk: MEMORY })
            )
          }
          yield* Ref.update(filesRef, (s) => {
            const newStore = new Map(s)
            newStore.set(filePath, { ...file, visibility })
            return newStore
          })
        }),

      prepend: (filePath, data) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(filesRef)
          const file = store.get(filePath)
          const newData =
            typeof data === "string"
              ? new TextEncoder().encode(data)
              : new Uint8Array(data)

          if (!file) {
            yield* Ref.update(filesRef, (s) => {
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
            const combined = new Uint8Array(newData.length + file.contents.length)
            combined.set(newData, 0)
            combined.set(file.contents, newData.length)
            yield* Ref.update(filesRef, (s) => {
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
          const store = yield* Ref.get(filesRef)
          const file = store.get(filePath)
          const newData =
            typeof data === "string"
              ? new TextEncoder().encode(data)
              : new Uint8Array(data)

          if (!file) {
            yield* Ref.update(filesRef, (s) => {
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
            const combined = new Uint8Array(file.contents.length + newData.length)
            combined.set(file.contents, 0)
            combined.set(newData, file.contents.length)
            yield* Ref.update(filesRef, (s) => {
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
          const store = yield* Ref.get(filesRef)
          const prefix = directory ? `${directory}/` : ""
          const results: FilePath[] = []

          for (const key of store.keys()) {
            if (directory) {
              if (key.startsWith(prefix)) {
                const rest = key.slice(prefix.length)
                if (!rest.includes("/")) {
                  results.push(unsafeFilePath(key))
                }
              }
            } else {
              if (!key.includes("/")) {
                results.push(unsafeFilePath(key))
              }
            }
          }

          return results
        }),

      allFiles: (directory) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(filesRef)
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
          const store = yield* Ref.get(filesRef)
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
          const store = yield* Ref.get(filesRef)
          const prefix = directory ? `${directory}/` : ""
          const dirs = new Set<string>()

          for (const key of store.keys()) {
            let path = key
            if (directory) {
              if (!key.startsWith(prefix)) continue
              path = key.slice(prefix.length)
            }

            const parts = path.split("/")
            let current = directory ?? ""
            for (let i = 0; i < parts.length - 1; i++) {
              current = current ? `${current}/${parts[i]}` : parts[i]
              dirs.add(current)
            }
          }

          return Array.from(dirs).map(unsafeFilePath)
        }),

      makeDirectory: () => Effect.void,

      deleteDirectory: (dirPath) =>
        Ref.update(filesRef, (store) => {
          const prefix = `${dirPath}/`
          const newStore = new Map(store)
          for (const key of newStore.keys()) {
            if (key === dirPath || key.startsWith(prefix)) {
              newStore.delete(key)
            }
          }
          return newStore
        }),

      readStream: (filePath) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(filesRef)
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

          yield* Ref.update(filesRef, (store) => {
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

    // Helper functions for test assertions
    const getFiles = (): Map<string, MockFile> => Effect.runSync(Ref.get(filesRef))

    const getFile = (path: string): MockFile | undefined => getFiles().get(path)

    const setFile = (path: string, contents: string | Uint8Array): void => {
      Effect.runSync(
        Ref.update(filesRef, (store) => {
          const newStore = new Map(store)
          newStore.set(path, {
            contents:
              typeof contents === "string"
                ? new TextEncoder().encode(contents)
                : contents,
            mimeType: guessMimeType(unsafeFilePath(path)),
            visibility: defaultVisibility,
            lastModified: new Date(),
            metadata: {},
          })
          return newStore
        })
      )
    }

    const clear = (): void => {
      Effect.runSync(Ref.set(filesRef, new Map()))
    }

    return { disk, getFiles, getFile, setFile, clear }
  })

/**
 * Create a mock storage layer for testing
 */
export const MockStorageLive = (
  config: MockStorageConfig = {}
): Layer.Layer<Storage, never> =>
  Layer.effect(
    Storage,
    Effect.gen(function* () {
      const { disk } = yield* makeMockDisk(config)
      return makeStorageService(disk)
    })
  )

/**
 * Create a mock disk layer for testing
 */
export const MockDiskLive = (
  config: MockStorageConfig = {}
): Layer.Layer<DiskTag, never> =>
  Layer.effect(
    DiskTag,
    Effect.gen(function* () {
      const { disk } = yield* makeMockDisk(config)
      return disk
    })
  )
