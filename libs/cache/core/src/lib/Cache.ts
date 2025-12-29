/**
 * Cache Service - Main application layer for caching
 *
 * Provides the high-level API for caching operations including
 * Laravel-style remember patterns.
 *
 * @module Cache
 */
import { Context, Effect, Option, Layer } from "effect"
import type { CacheStore } from "./ports/CacheStore.js"
import { CacheStoreTag } from "./ports/CacheStore.js"
import { isTaggable } from "./ports/TaggableStore.js"
import { CacheKey, unsafeMakeCacheKey } from "./domain/CacheKey.js"
import { CacheTag, unsafeMakeCacheTag } from "./domain/CacheTag.js"
import type { Duration } from "./domain/Duration.js"
import { forever } from "./domain/Duration.js"
import type { CacheError } from "./errors/CacheError.js"
import { CacheMiss } from "./errors/CacheError.js"

/**
 * Tagged cache service interface
 * Provides a subset of cache operations scoped to specific tags
 */
export interface TaggedCacheService {
  /**
   * Get a value by key (with tags)
   */
  readonly get: <A>(
    key: string,
    defaultValue?: A
  ) => Effect.Effect<A, CacheError>

  /**
   * Store a value with tags
   */
  readonly put: <A>(
    key: string,
    value: A,
    ttl?: Duration
  ) => Effect.Effect<void, CacheError>

  /**
   * Store a value with tags that never expires
   */
  readonly forever: <A>(
    key: string,
    value: A
  ) => Effect.Effect<void, CacheError>

  /**
   * Flush all entries with these tags
   */
  readonly flush: () => Effect.Effect<void, CacheError>

  /**
   * Remember pattern with tags
   */
  readonly remember: <A, E, R>(
    key: string,
    ttl: Duration,
    compute: Effect.Effect<A, E, R>
  ) => Effect.Effect<A, E | CacheError, R>

  /**
   * Remember forever with tags
   */
  readonly rememberForever: <A, E, R>(
    key: string,
    compute: Effect.Effect<A, E, R>
  ) => Effect.Effect<A, E | CacheError, R>
}

/**
 * Main cache service interface
 */
export interface CacheService {
  // ─── Basic Operations ───────────────────────────────────────────────

  /**
   * Get a value from the cache
   *
   * @param key - The cache key
   * @param defaultValue - Value to return if key not found
   */
  readonly get: <A>(
    key: string,
    defaultValue?: A
  ) => Effect.Effect<A, CacheError>

  /**
   * Store a value in the cache
   *
   * @param key - The cache key
   * @param value - The value to store
   * @param ttl - Optional time-to-live
   */
  readonly put: <A>(
    key: string,
    value: A,
    ttl?: Duration
  ) => Effect.Effect<void, CacheError>

  /**
   * Check if a key exists in the cache
   */
  readonly has: (key: string) => Effect.Effect<boolean, CacheError>

  /**
   * Remove a key from the cache
   */
  readonly forget: (key: string) => Effect.Effect<boolean, CacheError>

  /**
   * Clear all items from the cache
   */
  readonly flush: () => Effect.Effect<void, CacheError>

  // ─── Advanced Operations ────────────────────────────────────────────

  /**
   * Store a value that never expires
   */
  readonly forever: <A>(
    key: string,
    value: A
  ) => Effect.Effect<void, CacheError>

  /**
   * Get and delete a value (pull pattern)
   */
  readonly pull: <A>(key: string) => Effect.Effect<Option.Option<A>, CacheError>

  /**
   * Store a value only if it doesn't exist
   * Returns true if the value was added, false if it already existed
   */
  readonly add: <A>(
    key: string,
    value: A,
    ttl?: Duration
  ) => Effect.Effect<boolean, CacheError>

  // ─── Remember Patterns (Cache-Aside) ────────────────────────────────

  /**
   * Get cached value or compute and store it
   *
   * This is the classic cache-aside pattern:
   * 1. Check cache for value
   * 2. If found, return it
   * 3. If not found, compute value, store it, and return it
   */
  readonly remember: <A, E, R>(
    key: string,
    ttl: Duration,
    compute: Effect.Effect<A, E, R>
  ) => Effect.Effect<A, E | CacheError, R>

  /**
   * Remember forever (no expiration)
   */
  readonly rememberForever: <A, E, R>(
    key: string,
    compute: Effect.Effect<A, E, R>
  ) => Effect.Effect<A, E | CacheError, R>

  // ─── Atomic Counters ────────────────────────────────────────────────

  /**
   * Increment a numeric value
   */
  readonly increment: (
    key: string,
    value?: number
  ) => Effect.Effect<number, CacheError>

  /**
   * Decrement a numeric value
   */
  readonly decrement: (
    key: string,
    value?: number
  ) => Effect.Effect<number, CacheError>

  // ─── Bulk Operations ────────────────────────────────────────────────

  /**
   * Get multiple values at once
   */
  readonly many: <A>(
    keys: readonly string[]
  ) => Effect.Effect<Record<string, A | null>, CacheError>

  /**
   * Store multiple values at once
   */
  readonly putMany: <A>(
    items: Record<string, A>,
    ttl?: Duration
  ) => Effect.Effect<void, CacheError>

  // ─── Tagged Cache ───────────────────────────────────────────────────

  /**
   * Get a tagged cache service
   * Operations on the returned service will be scoped to the specified tags
   */
  readonly tags: (tags: readonly string[]) => TaggedCacheService
}

/**
 * Cache service tag for dependency injection
 */
export class Cache extends Context.Tag("@gello/cache/Cache")<
  Cache,
  CacheService
>() {}

/**
 * Create a cache service from a store
 */
export const makeCacheService = (store: CacheStore): CacheService => {
  const toKey = (key: string): CacheKey => unsafeMakeCacheKey(key)
  const toTag = (tag: string): CacheTag => unsafeMakeCacheTag(tag)

  /**
   * Create a tagged cache service wrapper
   */
  const createTaggedCache = (tags: readonly string[]): TaggedCacheService => {
    const cacheTags = tags.map(toTag)

    return {
      get: <A>(key: string, defaultValue?: A) => {
        if (isTaggable(store)) {
          return store.getTagged<A>(cacheTags, toKey(key)).pipe(
            Effect.flatMap((opt) =>
              Option.match(opt, {
                onNone: () =>
                  defaultValue !== undefined
                    ? Effect.succeed(defaultValue)
                    : Effect.fail(new CacheMiss({ key: toKey(key) })),
                onSome: Effect.succeed,
              })
            )
          )
        }
        // Fallback to regular get if store doesn't support tags
        return store.get<A>(toKey(key)).pipe(
          Effect.flatMap((opt) =>
            Option.match(opt, {
              onNone: () =>
                defaultValue !== undefined
                  ? Effect.succeed(defaultValue)
                  : Effect.fail(new CacheMiss({ key: toKey(key) })),
              onSome: Effect.succeed,
            })
          )
        )
      },

      put: <A>(key: string, value: A, ttl?: Duration) => {
        if (isTaggable(store)) {
          return store.putTagged(cacheTags, toKey(key), value, ttl)
        }
        return store.put(toKey(key), value, ttl)
      },

      forever: <A>(key: string, value: A) => {
        if (isTaggable(store)) {
          return store.putTagged(cacheTags, toKey(key), value, forever)
        }
        return store.put(toKey(key), value, forever)
      },

      flush: () => {
        if (isTaggable(store)) {
          return store.flushTags(cacheTags)
        }
        return store.flush()
      },

      remember: <A, E, R>(
        key: string,
        ttl: Duration,
        compute: Effect.Effect<A, E, R>
      ) =>
        Effect.gen(function* () {
          const cacheKey = toKey(key)

          // Try to get from cache
          const cached = isTaggable(store)
            ? yield* store.getTagged<A>(cacheTags, cacheKey)
            : yield* store.get<A>(cacheKey)

          if (Option.isSome(cached)) {
            return cached.value
          }

          // Compute and store
          const value = yield* compute
          if (isTaggable(store)) {
            yield* store.putTagged(cacheTags, cacheKey, value, ttl)
          } else {
            yield* store.put(cacheKey, value, ttl)
          }

          return value
        }),

      rememberForever: <A, E, R>(
        key: string,
        compute: Effect.Effect<A, E, R>
      ) => createTaggedCache(tags).remember(key, forever, compute),
    }
  }

  return {
    // Basic operations
    get: <A>(key: string, defaultValue?: A) =>
      store.get<A>(toKey(key)).pipe(
        Effect.flatMap((opt) =>
          Option.match(opt, {
            onNone: () =>
              defaultValue !== undefined
                ? Effect.succeed(defaultValue)
                : Effect.fail(new CacheMiss({ key: toKey(key) })),
            onSome: Effect.succeed,
          })
        )
      ),

    put: <A>(key: string, value: A, ttl?: Duration) =>
      store.put(toKey(key), value, ttl),

    has: (key: string) => store.has(toKey(key)),

    forget: (key: string) => store.forget(toKey(key)),

    flush: () => store.flush(),

    // Advanced operations
    forever: <A>(key: string, value: A) =>
      store.put(toKey(key), value, forever),

    pull: <A>(key: string) =>
      Effect.gen(function* () {
        const cacheKey = toKey(key)
        const value = yield* store.get<A>(cacheKey)
        if (Option.isSome(value)) {
          yield* store.forget(cacheKey)
        }
        return value
      }),

    add: <A>(key: string, value: A, ttl?: Duration) =>
      Effect.gen(function* () {
        const cacheKey = toKey(key)
        const exists = yield* store.has(cacheKey)
        if (exists) {
          return false
        }
        yield* store.put(cacheKey, value, ttl)
        return true
      }),

    // Remember patterns
    remember: <A, E, R>(
      key: string,
      ttl: Duration,
      compute: Effect.Effect<A, E, R>
    ) =>
      Effect.gen(function* () {
        const cacheKey = toKey(key)

        // Try to get from cache
        const cached = yield* store.get<A>(cacheKey)

        if (Option.isSome(cached)) {
          return cached.value
        }

        // Compute and store
        const value = yield* compute
        yield* store.put(cacheKey, value, ttl)

        return value
      }),

    rememberForever: <A, E, R>(
      key: string,
      compute: Effect.Effect<A, E, R>
    ) =>
      Effect.gen(function* () {
        const cacheKey = toKey(key)

        // Try to get from cache
        const cached = yield* store.get<A>(cacheKey)

        if (Option.isSome(cached)) {
          return cached.value
        }

        // Compute and store forever
        const value = yield* compute
        yield* store.put(cacheKey, value, forever)

        return value
      }),

    // Atomic counters
    increment: (key: string, value = 1) => store.increment(toKey(key), value),

    decrement: (key: string, value = 1) => store.decrement(toKey(key), value),

    // Bulk operations
    many: <A>(keys: readonly string[]) =>
      Effect.gen(function* () {
        const cacheKeys = keys.map(toKey)
        const result = yield* store.many<A>(cacheKeys)
        const record: Record<string, A | null> = {}
        for (const [key, value] of result) {
          record[key] = value
        }
        return record
      }),

    putMany: <A>(items: Record<string, A>, ttl?: Duration) => {
      const map = new Map<CacheKey, A>()
      for (const [key, value] of Object.entries(items)) {
        map.set(toKey(key), value)
      }
      return store.putMany(map, ttl)
    },

    // Tagged cache
    tags: createTaggedCache,
  }
}

/**
 * Layer providing the Cache service
 * Requires a CacheStore to be provided
 */
export const CacheLive = Layer.effect(
  Cache,
  Effect.gen(function* () {
    const store = yield* CacheStoreTag
    return makeCacheService(store)
  })
)

/**
 * Create a complete cache layer with a specific store
 */
export const makeCacheLayer = (
  storeLayer: Layer.Layer<CacheStore>
) =>
  Layer.provide(CacheLive, storeLayer)
