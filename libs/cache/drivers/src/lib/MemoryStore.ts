/**
 * MemoryStore - In-memory cache store adapter
 *
 * Default cache driver for development and testing.
 * Data is stored in a Map and cleared on process restart.
 *
 * @module adapters/MemoryStore
 */
import { Effect, Layer, Option, Ref } from "effect"
import {
  toMillis,
  CacheStoreTag,
  TaggableStoreTag,
} from "@gello/cache"
import type {
  CacheKey,
  CacheTag,
  Duration,
  CacheStore,
  TaggableStore,
  CacheError,
} from "@gello/cache"

/**
 * Internal memory entry structure
 */
interface MemoryEntry {
  readonly value: string
  readonly expiresAt: number | null
  readonly tags: readonly string[]
}

/**
 * Create an in-memory cache store
 *
 * Supports both basic CacheStore and TaggableStore interfaces.
 */
export const makeMemoryStore = (): Effect.Effect<TaggableStore, never> =>
  Effect.gen(function* () {
    // Main storage
    const store = yield* Ref.make<Map<string, MemoryEntry>>(new Map())
    // Tag to keys mapping for efficient tag-based operations
    const tagIndex = yield* Ref.make<Map<string, Set<string>>>(new Map())

    /**
     * Clean up expired entries
     */
    const cleanup = (): Effect.Effect<void, never> =>
      Ref.update(store, (map) => {
        const now = Date.now()
        const newMap = new Map(map)
        for (const [key, entry] of newMap) {
          if (entry.expiresAt !== null && entry.expiresAt < now) {
            newMap.delete(key)
          }
        }
        return newMap
      })

    /**
     * Remove a key from the tag index
     */
    const removeFromTagIndex = (
      key: string,
      tags: readonly string[]
    ): Effect.Effect<void, never> =>
      Ref.update(tagIndex, (index) => {
        const newIndex = new Map(index)
        for (const tag of tags) {
          const keys = newIndex.get(tag)
          if (keys) {
            keys.delete(key)
            if (keys.size === 0) {
              newIndex.delete(tag)
            }
          }
        }
        return newIndex
      })

    /**
     * Add a key to the tag index
     */
    const addToTagIndex = (
      key: string,
      tags: readonly string[]
    ): Effect.Effect<void, never> =>
      Ref.update(tagIndex, (index) => {
        const newIndex = new Map(index)
        for (const tag of tags) {
          const keys = newIndex.get(tag) ?? new Set()
          keys.add(key)
          newIndex.set(tag, keys)
        }
        return newIndex
      })

    const cacheStore: TaggableStore = {
      get: <A>(key: CacheKey): Effect.Effect<Option.Option<A>, CacheError> =>
        Effect.gen(function* () {
          yield* cleanup()
          const map = yield* Ref.get(store)
          const entry = map.get(key)

          if (!entry) {
            return Option.none()
          }

          // Check expiration
          if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
            yield* Ref.update(store, (m) => {
              const newMap = new Map(m)
              newMap.delete(key)
              return newMap
            })
            yield* removeFromTagIndex(key, entry.tags)
            return Option.none()
          }

          try {
            return Option.some(JSON.parse(entry.value) as A)
          } catch {
            return Option.none()
          }
        }),

      put: <A>(
        key: CacheKey,
        value: A,
        ttl?: Duration
      ): Effect.Effect<void, CacheError> =>
        Effect.gen(function* () {
          const serialized = JSON.stringify(value)
          const expiresAt = ttl ? toMillis(ttl) : null
          const expiresAtAbsolute =
            expiresAt !== null ? Date.now() + expiresAt : null

          yield* Ref.update(store, (map) => {
            const newMap = new Map(map)
            newMap.set(key, {
              value: serialized,
              expiresAt: expiresAtAbsolute,
              tags: [],
            })
            return newMap
          })
        }),

      has: (key: CacheKey): Effect.Effect<boolean, CacheError> =>
        Effect.gen(function* () {
          yield* cleanup()
          const map = yield* Ref.get(store)
          const entry = map.get(key)

          if (!entry) return false
          if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
            return false
          }
          return true
        }),

      forget: (key: CacheKey): Effect.Effect<boolean, CacheError> =>
        Ref.modify(store, (map) => {
          const newMap = new Map(map)
          const existed = newMap.has(key)
          const entry = newMap.get(key)
          newMap.delete(key)
          return [{ existed, tags: entry?.tags ?? [] }, newMap] as const
        }).pipe(
          Effect.flatMap(({ existed, tags }) =>
            removeFromTagIndex(key, tags).pipe(Effect.map(() => existed))
          )
        ),

      flush: (): Effect.Effect<void, CacheError> =>
        Effect.all([
          Ref.set(store, new Map()),
          Ref.set(tagIndex, new Map()),
        ]).pipe(Effect.asVoid),

      increment: (
        key: CacheKey,
        value = 1
      ): Effect.Effect<number, CacheError> =>
        Ref.modify(store, (map) => {
          const newMap = new Map(map)
          const entry = newMap.get(key)
          const current = entry ? Number(JSON.parse(entry.value)) || 0 : 0
          const newValue = current + value

          newMap.set(key, {
            value: JSON.stringify(newValue),
            expiresAt: entry?.expiresAt ?? null,
            tags: entry?.tags ?? [],
          })

          return [newValue, newMap] as const
        }),

      decrement: (
        key: CacheKey,
        value = 1
      ): Effect.Effect<number, CacheError> =>
        Ref.modify(store, (map) => {
          const newMap = new Map(map)
          const entry = newMap.get(key)
          const current = entry ? Number(JSON.parse(entry.value)) || 0 : 0
          const newValue = current - value

          newMap.set(key, {
            value: JSON.stringify(newValue),
            expiresAt: entry?.expiresAt ?? null,
            tags: entry?.tags ?? [],
          })

          return [newValue, newMap] as const
        }),

      many: <A>(
        keys: readonly CacheKey[]
      ): Effect.Effect<Map<CacheKey, A | null>, CacheError> =>
        Effect.gen(function* () {
          yield* cleanup()
          const map = yield* Ref.get(store)
          const result = new Map<CacheKey, A | null>()

          for (const key of keys) {
            const entry = map.get(key)
            if (!entry) {
              result.set(key, null)
            } else if (
              entry.expiresAt !== null &&
              entry.expiresAt < Date.now()
            ) {
              result.set(key, null)
            } else {
              try {
                result.set(key, JSON.parse(entry.value) as A)
              } catch {
                result.set(key, null)
              }
            }
          }

          return result
        }),

      putMany: <A>(
        items: ReadonlyMap<CacheKey, A>,
        ttl?: Duration
      ): Effect.Effect<void, CacheError> =>
        Ref.update(store, (map) => {
          const newMap = new Map(map)
          const expiresAt = ttl ? toMillis(ttl) : null
          const expiresAtAbsolute =
            expiresAt !== null ? Date.now() + expiresAt : null

          for (const [key, value] of items) {
            newMap.set(key, {
              value: JSON.stringify(value),
              expiresAt: expiresAtAbsolute,
              tags: [],
            })
          }

          return newMap
        }),

      // TaggableStore methods

      getTagged: <A>(
        tags: readonly CacheTag[],
        key: CacheKey
      ): Effect.Effect<Option.Option<A>, CacheError> =>
        Effect.gen(function* () {
          yield* cleanup()
          const map = yield* Ref.get(store)
          const entry = map.get(key)

          if (!entry) return Option.none()
          if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
            return Option.none()
          }

          // Check if entry has all required tags
          const hasAllTags = tags.every((tag) => entry.tags.includes(tag))
          if (!hasAllTags) return Option.none()

          try {
            return Option.some(JSON.parse(entry.value) as A)
          } catch {
            return Option.none()
          }
        }),

      putTagged: <A>(
        tags: readonly CacheTag[],
        key: CacheKey,
        value: A,
        ttl?: Duration
      ): Effect.Effect<void, CacheError> =>
        Effect.gen(function* () {
          const serialized = JSON.stringify(value)
          const expiresAt = ttl ? toMillis(ttl) : null
          const expiresAtAbsolute =
            expiresAt !== null ? Date.now() + expiresAt : null
          const tagStrings = tags.map(String)

          yield* Ref.update(store, (map) => {
            const newMap = new Map(map)
            newMap.set(key, {
              value: serialized,
              expiresAt: expiresAtAbsolute,
              tags: tagStrings,
            })
            return newMap
          })

          yield* addToTagIndex(key, tagStrings)
        }),

      flushTags: (
        tags: readonly CacheTag[]
      ): Effect.Effect<void, CacheError> =>
        Effect.gen(function* () {
          const index = yield* Ref.get(tagIndex)
          const keysToDelete = new Set<string>()

          for (const tag of tags) {
            const keys = index.get(tag)
            if (keys) {
              for (const key of keys) {
                keysToDelete.add(key)
              }
            }
          }

          yield* Ref.update(store, (map) => {
            const newMap = new Map(map)
            for (const key of keysToDelete) {
              newMap.delete(key)
            }
            return newMap
          })

          yield* Ref.update(tagIndex, (idx) => {
            const newIndex = new Map(idx)
            for (const tag of tags) {
              newIndex.delete(tag)
            }
            return newIndex
          })
        }),

      getTaggedKeys: (
        tag: CacheTag
      ): Effect.Effect<readonly CacheKey[], CacheError> =>
        Effect.gen(function* () {
          yield* cleanup()
          const index = yield* Ref.get(tagIndex)
          const keys = index.get(tag)
          return keys ? (Array.from(keys) as CacheKey[]) : []
        }),
    }

    return cacheStore
  })

/**
 * Layer providing MemoryStore as CacheStore
 */
export const MemoryStoreLive: Layer.Layer<CacheStore> = Layer.effect(
  CacheStoreTag,
  makeMemoryStore() as Effect.Effect<CacheStore, never>
)

/**
 * Layer providing MemoryStore as TaggableStore
 */
export const MemoryTaggableStoreLive: Layer.Layer<TaggableStore> = Layer.effect(
  TaggableStoreTag,
  makeMemoryStore()
)
