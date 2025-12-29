/**
 * Domain layer exports
 *
 * @module domain
 */

// CacheKey
export {
  CacheKey,
  makeCacheKey,
  unsafeMakeCacheKey,
  prefixedKey,
  compositeKey,
  InvalidCacheKeyError,
  MAX_KEY_LENGTH,
  MIN_KEY_LENGTH,
} from "./CacheKey.js"
export type { CacheKey as CacheKeyType } from "./CacheKey.js"

// CacheTag
export {
  CacheTag,
  makeCacheTag,
  unsafeMakeCacheTag,
  makeCacheTags,
  InvalidCacheTagError,
  MAX_TAG_LENGTH,
} from "./CacheTag.js"
export type { CacheTag as CacheTagType } from "./CacheTag.js"

// CacheEntry
export {
  makeCacheEntry,
  isExpired,
  isValid,
  getTtlMillis,
  hasTag,
  hasAllTags,
  hasAnyTag,
} from "./CacheEntry.js"
export type { CacheEntry } from "./CacheEntry.js"

// Duration and DateTime
export {
  Duration,
  DateTime,
  seconds,
  minutes,
  hours,
  days,
  weeks,
  forever,
  zero,
  millis,
  isFinite,
  isForever,
  toMillis,
  toSeconds,
  expiresAt,
  expiresAtDateTime,
  isDateTimeExpired,
  isOptionDateTimeExpired,
  remainingTtl,
  remainingOptionTtl,
  CacheDurations,
  Durations,
} from "./Duration.js"
export type { DurationType, Utc, Zoned } from "./Duration.js"
