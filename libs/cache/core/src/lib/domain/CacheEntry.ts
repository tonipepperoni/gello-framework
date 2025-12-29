/**
 * CacheEntry - Full cache entry with metadata
 *
 * @module domain/CacheEntry
 */
import { Option } from "effect"
import type { CacheKey } from "./CacheKey.js"
import type { CacheTag } from "./CacheTag.js"

/**
 * A complete cache entry with value and metadata
 */
export interface CacheEntry<A> {
  /**
   * The cache key
   */
  readonly key: CacheKey

  /**
   * The cached value
   */
  readonly value: A

  /**
   * When this entry expires (None for no expiration)
   */
  readonly expiresAt: Option.Option<Date>

  /**
   * Tags associated with this entry
   */
  readonly tags: readonly CacheTag[]

  /**
   * When this entry was created
   */
  readonly createdAt: Date
}

/**
 * Create a cache entry
 */
export const makeCacheEntry = <A>(params: {
  key: CacheKey
  value: A
  expiresAt?: Date | null
  tags?: readonly CacheTag[]
}): CacheEntry<A> => ({
  key: params.key,
  value: params.value,
  expiresAt: params.expiresAt ? Option.some(params.expiresAt) : Option.none(),
  tags: params.tags ?? [],
  createdAt: new Date(),
})

/**
 * Check if a cache entry has expired
 */
export const isExpired = (entry: CacheEntry<unknown>): boolean =>
  Option.match(entry.expiresAt, {
    onNone: () => false,
    onSome: (exp) => exp.getTime() < Date.now(),
  })

/**
 * Check if a cache entry is still valid (not expired)
 */
export const isValid = (entry: CacheEntry<unknown>): boolean => !isExpired(entry)

/**
 * Get the TTL remaining in milliseconds (None if expired or no expiration)
 */
export const getTtlMillis = (
  entry: CacheEntry<unknown>
): Option.Option<number> =>
  Option.flatMap(entry.expiresAt, (exp) => {
    const remaining = exp.getTime() - Date.now()
    return remaining > 0 ? Option.some(remaining) : Option.none()
  })

/**
 * Check if an entry has a specific tag
 */
export const hasTag = (entry: CacheEntry<unknown>, tag: CacheTag): boolean =>
  entry.tags.includes(tag)

/**
 * Check if an entry has all specified tags
 */
export const hasAllTags = (
  entry: CacheEntry<unknown>,
  tags: readonly CacheTag[]
): boolean => tags.every((tag) => entry.tags.includes(tag))

/**
 * Check if an entry has any of the specified tags
 */
export const hasAnyTag = (
  entry: CacheEntry<unknown>,
  tags: readonly CacheTag[]
): boolean => tags.some((tag) => entry.tags.includes(tag))
