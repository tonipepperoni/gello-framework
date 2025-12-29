/**
 * NullStore - No-op cache store adapter
 *
 * Useful for testing or disabling cache entirely.
 * All operations succeed but nothing is stored.
 *
 * @module adapters/NullStore
 */
import { Effect, Layer, Option } from "effect"
import {
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
 * Null cache store implementation
 *
 * All gets return None, all puts succeed silently.
 */
export const NullStore: TaggableStore = {
  get: <A>(_key: CacheKey): Effect.Effect<Option.Option<A>, CacheError> =>
    Effect.succeed(Option.none()),

  put: <A>(
    _key: CacheKey,
    _value: A,
    _ttl?: Duration
  ): Effect.Effect<void, CacheError> => Effect.void,

  has: (_key: CacheKey): Effect.Effect<boolean, CacheError> =>
    Effect.succeed(false),

  forget: (_key: CacheKey): Effect.Effect<boolean, CacheError> =>
    Effect.succeed(false),

  flush: (): Effect.Effect<void, CacheError> => Effect.void,

  increment: (
    _key: CacheKey,
    value = 1
  ): Effect.Effect<number, CacheError> => Effect.succeed(value),

  decrement: (
    _key: CacheKey,
    value = 1
  ): Effect.Effect<number, CacheError> => Effect.succeed(-value),

  many: <A>(
    keys: readonly CacheKey[]
  ): Effect.Effect<Map<CacheKey, A | null>, CacheError> => {
    const result = new Map<CacheKey, A | null>()
    for (const key of keys) {
      result.set(key, null)
    }
    return Effect.succeed(result)
  },

  putMany: <A>(
    _items: ReadonlyMap<CacheKey, A>,
    _ttl?: Duration
  ): Effect.Effect<void, CacheError> => Effect.void,

  // TaggableStore methods

  getTagged: <A>(
    _tags: readonly CacheTag[],
    _key: CacheKey
  ): Effect.Effect<Option.Option<A>, CacheError> =>
    Effect.succeed(Option.none()),

  putTagged: <A>(
    _tags: readonly CacheTag[],
    _key: CacheKey,
    _value: A,
    _ttl?: Duration
  ): Effect.Effect<void, CacheError> => Effect.void,

  flushTags: (
    _tags: readonly CacheTag[]
  ): Effect.Effect<void, CacheError> => Effect.void,

  getTaggedKeys: (
    _tag: CacheTag
  ): Effect.Effect<readonly CacheKey[], CacheError> =>
    Effect.succeed([]),
}

/**
 * Layer providing NullStore as CacheStore
 */
export const NullStoreLive: Layer.Layer<CacheStore> = Layer.succeed(
  CacheStoreTag,
  NullStore as CacheStore
)

/**
 * Layer providing NullStore as TaggableStore
 */
export const NullTaggableStoreLive: Layer.Layer<TaggableStore> = Layer.succeed(
  TaggableStoreTag,
  NullStore
)
