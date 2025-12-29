/**
 * FileStore - File system cache store adapter
 *
 * Stores cache entries as files on disk. Useful for simple persistence
 * without external dependencies.
 *
 * @module adapters/FileStore
 */
import { Effect, Layer, Option } from "effect"
import * as fs from "node:fs"
import * as path from "node:path"
import * as crypto from "node:crypto"
import {
  toMillis,
  CacheStoreTag,
  CacheStoreError,
} from "@gello/cache"
import type {
  CacheKey,
  Duration,
  CacheStore,
  CacheError,
} from "@gello/cache"

/**
 * File store configuration
 */
export interface FileStoreConfig {
  /**
   * Directory to store cache files
   */
  readonly directory: string

  /**
   * File extension for cache files (default: .cache)
   */
  readonly extension?: string

  /**
   * Prefix for cache file names
   */
  readonly prefix?: string
}

/**
 * Internal file entry structure
 */
interface FileEntry<A> {
  readonly value: A
  readonly expiresAt: number | null
  readonly createdAt: number
}

/**
 * Hash a key to create a safe filename
 */
const hashKey = (key: string): string =>
  crypto.createHash("sha256").update(key).digest("hex").slice(0, 32)

/**
 * Create a file-based cache store
 */
export const makeFileStore = (
  config: FileStoreConfig
): Effect.Effect<CacheStore, CacheError> =>
  Effect.gen(function* () {
    const ext = config.extension ?? ".cache"
    const prefix = config.prefix ?? ""
    const dir = config.directory

    // Ensure directory exists
    yield* Effect.try({
      try: () => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
      },
      catch: (cause) =>
        new CacheStoreError({
          operation: "init",
          driver: "file",
          cause,
        }),
    })

    const keyToPath = (key: CacheKey): string =>
      path.join(dir, `${prefix}${hashKey(key)}${ext}`)

    const readFile = <A>(filePath: string): Effect.Effect<FileEntry<A> | null, CacheError> =>
      Effect.try({
        try: () => {
          if (!fs.existsSync(filePath)) {
            return null
          }
          const content = fs.readFileSync(filePath, "utf-8")
          return JSON.parse(content) as FileEntry<A>
        },
        catch: (cause) =>
          new CacheStoreError({
            operation: "read",
            driver: "file",
            cause,
          }),
      })

    const writeFile = <A>(filePath: string, entry: FileEntry<A>): Effect.Effect<void, CacheError> =>
      Effect.try({
        try: () => {
          fs.writeFileSync(filePath, JSON.stringify(entry), "utf-8")
        },
        catch: (cause) =>
          new CacheStoreError({
            operation: "write",
            driver: "file",
            cause,
          }),
      })

    const deleteFile = (filePath: string): Effect.Effect<boolean, CacheError> =>
      Effect.try({
        try: () => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
            return true
          }
          return false
        },
        catch: (cause) =>
          new CacheStoreError({
            operation: "delete",
            driver: "file",
            cause,
          }),
      })

    const listFiles = (): Effect.Effect<string[], CacheError> =>
      Effect.try({
        try: () => {
          if (!fs.existsSync(dir)) {
            return []
          }
          return fs.readdirSync(dir).filter((f) => f.endsWith(ext))
        },
        catch: (cause) =>
          new CacheStoreError({
            operation: "list",
            driver: "file",
            cause,
          }),
      })

    const cacheStore: CacheStore = {
      get: <A>(key: CacheKey): Effect.Effect<Option.Option<A>, CacheError> =>
        Effect.gen(function* () {
          const filePath = keyToPath(key)
          const entry = yield* readFile<A>(filePath)

          if (!entry) {
            return Option.none()
          }

          // Check expiration
          if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
            yield* deleteFile(filePath)
            return Option.none()
          }

          return Option.some(entry.value)
        }),

      put: <A>(
        key: CacheKey,
        value: A,
        ttl?: Duration
      ): Effect.Effect<void, CacheError> =>
        Effect.gen(function* () {
          const filePath = keyToPath(key)
          const expiresAt = ttl ? toMillis(ttl) : null
          const expiresAtAbsolute =
            expiresAt !== null ? Date.now() + expiresAt : null

          const entry: FileEntry<A> = {
            value,
            expiresAt: expiresAtAbsolute,
            createdAt: Date.now(),
          }

          yield* writeFile(filePath, entry)
        }),

      has: (key: CacheKey): Effect.Effect<boolean, CacheError> =>
        Effect.gen(function* () {
          const filePath = keyToPath(key)
          const entry = yield* readFile<unknown>(filePath)

          if (!entry) return false
          if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
            yield* deleteFile(filePath)
            return false
          }
          return true
        }),

      forget: (key: CacheKey): Effect.Effect<boolean, CacheError> =>
        deleteFile(keyToPath(key)),

      flush: (): Effect.Effect<void, CacheError> =>
        Effect.gen(function* () {
          const files = yield* listFiles()
          for (const file of files) {
            yield* deleteFile(path.join(dir, file))
          }
        }),

      increment: (
        key: CacheKey,
        value = 1
      ): Effect.Effect<number, CacheError> =>
        Effect.gen(function* () {
          const filePath = keyToPath(key)
          const entry = yield* readFile<number>(filePath)
          const current = entry?.value ?? 0
          const newValue = current + value

          const newEntry: FileEntry<number> = {
            value: newValue,
            expiresAt: entry?.expiresAt ?? null,
            createdAt: entry?.createdAt ?? Date.now(),
          }

          yield* writeFile(filePath, newEntry)
          return newValue
        }),

      decrement: (
        key: CacheKey,
        value = 1
      ): Effect.Effect<number, CacheError> =>
        Effect.gen(function* () {
          const filePath = keyToPath(key)
          const entry = yield* readFile<number>(filePath)
          const current = entry?.value ?? 0
          const newValue = current - value

          const newEntry: FileEntry<number> = {
            value: newValue,
            expiresAt: entry?.expiresAt ?? null,
            createdAt: entry?.createdAt ?? Date.now(),
          }

          yield* writeFile(filePath, newEntry)
          return newValue
        }),

      many: <A>(
        keys: readonly CacheKey[]
      ): Effect.Effect<Map<CacheKey, A | null>, CacheError> =>
        Effect.forEach(keys, (key: CacheKey) =>
          cacheStore
            .get<A>(key)
            .pipe(
              Effect.map(
                (opt: Option.Option<A>) =>
                  [key, Option.getOrNull(opt)] as const
              )
            )
        ).pipe(
          Effect.map(
            (entries: readonly (readonly [CacheKey, A | null])[]) =>
              new Map(entries)
          )
        ),

      putMany: <A>(
        items: ReadonlyMap<CacheKey, A>,
        ttl?: Duration
      ): Effect.Effect<void, CacheError> =>
        Effect.forEach(
          Array.from(items),
          ([key, value]: [CacheKey, A]) => cacheStore.put(key, value, ttl)
        ).pipe(Effect.asVoid),
    }

    return cacheStore
  })

/**
 * Create a FileStore layer with configuration
 */
export const FileStoreLive = (
  config: FileStoreConfig
): Layer.Layer<CacheStore, CacheError> =>
  Layer.effect(CacheStoreTag, makeFileStore(config))

/**
 * Garbage collect expired entries from file store
 */
export const garbageCollect = (
  config: FileStoreConfig
): Effect.Effect<number, CacheError> =>
  Effect.gen(function* () {
    const ext = config.extension ?? ".cache"
    const dir = config.directory

    if (!fs.existsSync(dir)) {
      return 0
    }

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(ext))
    let deleted = 0

    for (const file of files) {
      const filePath = path.join(dir, file)
      const content = fs.readFileSync(filePath, "utf-8")
      const entry = JSON.parse(content) as FileEntry<unknown>

      if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
        fs.unlinkSync(filePath)
        deleted++
      }
    }

    return deleted
  })
