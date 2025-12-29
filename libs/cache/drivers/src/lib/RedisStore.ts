/**
 * RedisStore - Redis/Valkey cache store adapter
 *
 * Production-ready cache driver with support for distributed caching,
 * atomic operations, and optional tagging.
 *
 * @module adapters/RedisStore
 */
import { Effect, Layer, Option } from "effect"
import {
  toMillis,
  CacheStoreTag,
  TaggableStoreTag,
  CacheStoreError,
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
 * Redis store configuration
 */
export interface RedisStoreConfig {
  /**
   * Redis host
   */
  readonly host: string

  /**
   * Redis port (default: 6379)
   */
  readonly port?: number

  /**
   * Redis password (optional)
   */
  readonly password?: string

  /**
   * Redis database number (default: 0)
   */
  readonly database?: number

  /**
   * Key prefix for namespacing (default: "cache:")
   */
  readonly prefix?: string

  /**
   * Enable TLS connection
   */
  readonly tls?: boolean

  /**
   * Connection timeout in milliseconds
   */
  readonly connectTimeout?: number

  /**
   * Command timeout in milliseconds
   */
  readonly commandTimeout?: number
}

/**
 * Redis client interface (subset of ioredis)
 * This allows us to work with any Redis client that implements these methods
 */
export interface RedisClient {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<"OK">
  setex(key: string, seconds: number, value: string): Promise<"OK">
  psetex(key: string, milliseconds: number, value: string): Promise<"OK">
  exists(...keys: string[]): Promise<number>
  del(...keys: string[]): Promise<number>
  flushdb(): Promise<"OK">
  incrby(key: string, increment: number): Promise<number>
  decrby(key: string, decrement: number): Promise<number>
  mget(...keys: string[]): Promise<(string | null)[]>
  keys(pattern: string): Promise<string[]>
  sadd(key: string, ...members: string[]): Promise<number>
  smembers(key: string): Promise<string[]>
  srem(key: string, ...members: string[]): Promise<number>
  quit(): Promise<"OK">
}

/**
 * Create a Redis-based cache store
 *
 * @param client - Redis client instance
 * @param config - Store configuration
 */
export const makeRedisStore = (
  client: RedisClient,
  config: RedisStoreConfig
): TaggableStore => {
  const prefix = config.prefix ?? "cache:"
  const tagPrefix = `${prefix}tags:`

  const prefixKey = (key: CacheKey): string => `${prefix}${key}`
  const prefixTag = (tag: CacheTag): string => `${tagPrefix}${tag}`

  const wrapError = <A>(
    operation: string,
    promise: Promise<A>
  ): Effect.Effect<A, CacheError> =>
    Effect.tryPromise({
      try: () => promise,
      catch: (cause) =>
        new CacheStoreError({
          operation,
          driver: "redis",
          cause,
        }),
    })

  const store: TaggableStore = {
    get: <A>(key: CacheKey): Effect.Effect<Option.Option<A>, CacheError> =>
      Effect.gen(function* () {
        const value = yield* wrapError("get", client.get(prefixKey(key)))

        if (value === null) {
          return Option.none()
        }

        try {
          return Option.some(JSON.parse(value) as A)
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
        const prefixedKey = prefixKey(key)

        if (ttl) {
          const ms = toMillis(ttl)
          if (ms !== null) {
            yield* wrapError("put", client.psetex(prefixedKey, ms, serialized))
            return
          }
        }

        yield* wrapError("put", client.set(prefixedKey, serialized))
      }),

    has: (key: CacheKey): Effect.Effect<boolean, CacheError> =>
      wrapError("has", client.exists(prefixKey(key))).pipe(
        Effect.map((n) => n > 0)
      ),

    forget: (key: CacheKey): Effect.Effect<boolean, CacheError> =>
      wrapError("forget", client.del(prefixKey(key))).pipe(
        Effect.map((n) => n > 0)
      ),

    flush: (): Effect.Effect<void, CacheError> =>
      Effect.gen(function* () {
        // Get all keys with our prefix and delete them
        const keys = yield* wrapError("flush", client.keys(`${prefix}*`))
        if (keys.length > 0) {
          yield* wrapError("flush", client.del(...keys))
        }
      }),

    increment: (
      key: CacheKey,
      value = 1
    ): Effect.Effect<number, CacheError> =>
      wrapError("increment", client.incrby(prefixKey(key), value)),

    decrement: (
      key: CacheKey,
      value = 1
    ): Effect.Effect<number, CacheError> =>
      wrapError("decrement", client.decrby(prefixKey(key), value)),

    many: <A>(
      keys: readonly CacheKey[]
    ): Effect.Effect<Map<CacheKey, A | null>, CacheError> =>
      Effect.gen(function* () {
        const prefixedKeys = keys.map(prefixKey)
        const values = yield* wrapError("many", client.mget(...prefixedKeys))

        const result = new Map<CacheKey, A | null>()
        keys.forEach((key, index) => {
          const value = values[index]
          if (value === null) {
            result.set(key, null)
          } else {
            try {
              result.set(key, JSON.parse(value) as A)
            } catch {
              result.set(key, null)
            }
          }
        })

        return result
      }),

    putMany: <A>(
      items: ReadonlyMap<CacheKey, A>,
      ttl?: Duration
    ): Effect.Effect<void, CacheError> =>
      Effect.forEach(
        Array.from(items),
        ([key, value]: [CacheKey, A]) => store.put(key, value, ttl)
      ).pipe(Effect.asVoid),

    // TaggableStore methods

    getTagged: <A>(
      tags: readonly CacheTag[],
      key: CacheKey
    ): Effect.Effect<Option.Option<A>, CacheError> =>
      // For Redis, we just get the key - tags are managed separately
      store.get<A>(key),

    putTagged: <A>(
      tags: readonly CacheTag[],
      key: CacheKey,
      value: A,
      ttl?: Duration
    ): Effect.Effect<void, CacheError> =>
      store.put(key, value, ttl).pipe(
        Effect.flatMap(() =>
          Effect.forEach(tags, (tag) =>
            wrapError("putTagged", client.sadd(prefixTag(tag), key as string))
          )
        ),
        Effect.asVoid
      ),

    flushTags: (
      tags: readonly CacheTag[]
    ): Effect.Effect<void, CacheError> =>
      Effect.gen(function* () {
        const keysToDelete = new Set<string>()

        // Get all keys for each tag
        for (const tag of tags) {
          const tagKey = prefixTag(tag)
          const keys = yield* wrapError("flushTags", client.smembers(tagKey))
          keys.forEach((k) => keysToDelete.add(k))

          // Delete the tag set itself
          yield* wrapError("flushTags", client.del(tagKey))
        }

        // Delete all the keys
        if (keysToDelete.size > 0) {
          const prefixedKeys = Array.from(keysToDelete).map(
            (k) => `${prefix}${k}`
          )
          yield* wrapError("flushTags", client.del(...prefixedKeys))
        }
      }),

    getTaggedKeys: (
      tag: CacheTag
    ): Effect.Effect<readonly CacheKey[], CacheError> =>
      wrapError("getTaggedKeys", client.smembers(prefixTag(tag))).pipe(
        Effect.map((keys) => keys as CacheKey[])
      ),
  }

  return store
}

/**
 * Create a managed Redis store that handles connection lifecycle
 *
 * @example
 * ```typescript
 * import Redis from 'ioredis';
 *
 * const RedisStoreLive = RedisStoreLiveScoped({
 *   host: 'localhost',
 *   port: 6379,
 * }, () => new Redis({ host: 'localhost', port: 6379 }));
 * ```
 */
export const RedisStoreLiveScoped = (
  config: RedisStoreConfig,
  createClient: () => RedisClient
): Layer.Layer<TaggableStore, CacheError> =>
  Layer.scoped(
    TaggableStoreTag,
    Effect.gen(function* () {
      const client = createClient()

      // Register finalizer to close connection
      yield* Effect.addFinalizer(() =>
        Effect.promise(() => client.quit()).pipe(Effect.orDie)
      )

      return makeRedisStore(client, config)
    })
  )

/**
 * Create a Redis store layer from an existing client
 * (caller is responsible for connection lifecycle)
 */
export const RedisStoreLive = (
  client: RedisClient,
  config: RedisStoreConfig
): Layer.Layer<TaggableStore> =>
  Layer.succeed(TaggableStoreTag, makeRedisStore(client, config))

/**
 * Create a basic CacheStore layer (without tagging) from Redis
 */
export const RedisBasicStoreLive = (
  client: RedisClient,
  config: RedisStoreConfig
): Layer.Layer<CacheStore> =>
  Layer.succeed(CacheStoreTag, makeRedisStore(client, config) as CacheStore)
