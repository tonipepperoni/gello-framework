/**
 * CacheStore - Port interface for cache storage backends
 *
 * @module ports/CacheStore
 */
import { Context, Effect, Option } from "effect"
import type { CacheKey } from "../domain/CacheKey.js"
import type { Duration } from "../domain/Duration.js"
import type { CacheError } from "../errors/CacheError.js"

/**
 * Core cache store interface (port)
 *
 * All cache drivers must implement this interface.
 * This follows the hexagonal architecture pattern where
 * the port defines the contract and adapters implement it.
 */
export interface CacheStore {
  /**
   * Get a value from the cache
   *
   * @param key - The cache key
   * @returns Effect with Option.Some(value) if found, Option.None if not found
   */
  readonly get: <A>(key: CacheKey) => Effect.Effect<Option.Option<A>, CacheError>

  /**
   * Store a value in the cache
   *
   * @param key - The cache key
   * @param value - The value to store
   * @param ttl - Optional time-to-live duration
   */
  readonly put: <A>(
    key: CacheKey,
    value: A,
    ttl?: Duration
  ) => Effect.Effect<void, CacheError>

  /**
   * Check if a key exists in the cache
   *
   * @param key - The cache key
   * @returns Effect with true if key exists, false otherwise
   */
  readonly has: (key: CacheKey) => Effect.Effect<boolean, CacheError>

  /**
   * Remove a key from the cache
   *
   * @param key - The cache key
   * @returns Effect with true if key was removed, false if not found
   */
  readonly forget: (key: CacheKey) => Effect.Effect<boolean, CacheError>

  /**
   * Clear all items from the cache
   */
  readonly flush: () => Effect.Effect<void, CacheError>

  /**
   * Increment a numeric value in the cache
   *
   * If the key doesn't exist, it's initialized to 0 before incrementing.
   *
   * @param key - The cache key
   * @param value - Amount to increment (default: 1)
   * @returns Effect with the new value
   */
  readonly increment: (
    key: CacheKey,
    value?: number
  ) => Effect.Effect<number, CacheError>

  /**
   * Decrement a numeric value in the cache
   *
   * If the key doesn't exist, it's initialized to 0 before decrementing.
   *
   * @param key - The cache key
   * @param value - Amount to decrement (default: 1)
   * @returns Effect with the new value
   */
  readonly decrement: (
    key: CacheKey,
    value?: number
  ) => Effect.Effect<number, CacheError>

  /**
   * Get multiple values at once
   *
   * @param keys - Array of cache keys
   * @returns Effect with a map of key to value (null for missing keys)
   */
  readonly many: <A>(
    keys: readonly CacheKey[]
  ) => Effect.Effect<Map<CacheKey, A | null>, CacheError>

  /**
   * Store multiple values at once
   *
   * @param items - Map of key to value
   * @param ttl - Optional time-to-live duration (applied to all items)
   */
  readonly putMany: <A>(
    items: ReadonlyMap<CacheKey, A>,
    ttl?: Duration
  ) => Effect.Effect<void, CacheError>
}

/**
 * CacheStore service tag for dependency injection
 */
export class CacheStoreTag extends Context.Tag("@gello/cache/CacheStore")<
  CacheStoreTag,
  CacheStore
>() {}
