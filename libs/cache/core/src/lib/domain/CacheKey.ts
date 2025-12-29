/**
 * CacheKey - Branded type for validated cache keys
 *
 * @module domain/CacheKey
 */
import { Brand, Effect } from "effect"

/**
 * Branded type for cache keys
 * Ensures keys are validated before use
 */
export type CacheKey = string & Brand.Brand<"CacheKey">

/**
 * Constructor for CacheKey brand
 */
export const CacheKey = Brand.nominal<CacheKey>()

/**
 * Maximum allowed key length
 */
export const MAX_KEY_LENGTH = 250

/**
 * Minimum allowed key length
 */
export const MIN_KEY_LENGTH = 1

/**
 * Validate and create a CacheKey
 * Keys must be 1-250 characters and non-empty
 */
export const makeCacheKey = (
  key: string
): Effect.Effect<CacheKey, InvalidCacheKeyError> =>
  key.length >= MIN_KEY_LENGTH && key.length <= MAX_KEY_LENGTH
    ? Effect.succeed(CacheKey(key))
    : Effect.fail(
        new InvalidCacheKeyError({
          key,
          reason:
            key.length === 0
              ? "Key cannot be empty"
              : `Key length ${key.length} exceeds maximum of ${MAX_KEY_LENGTH}`,
        })
      )

/**
 * Create a CacheKey without validation (unsafe)
 * Use only when you're certain the key is valid
 */
export const unsafeMakeCacheKey = (key: string): CacheKey => CacheKey(key)

/**
 * Create a prefixed cache key for namespacing
 */
export const prefixedKey = (prefix: string, key: CacheKey): CacheKey =>
  CacheKey(`${prefix}:${key}`)

/**
 * Create a composite key from multiple parts
 */
export const compositeKey = (...parts: string[]): CacheKey =>
  CacheKey(parts.join(":"))

/**
 * Error for invalid cache key
 */
export class InvalidCacheKeyError extends Error {
  readonly _tag = "InvalidCacheKeyError" as const
  readonly key: string
  readonly reason: string

  constructor({ key, reason }: { key: string; reason: string }) {
    super(`Invalid cache key "${key}": ${reason}`)
    this.name = "InvalidCacheKeyError"
    this.key = key
    this.reason = reason
  }
}
