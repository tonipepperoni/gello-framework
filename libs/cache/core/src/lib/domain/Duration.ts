/**
 * Duration and DateTime helpers for cache TTL
 *
 * Re-exports from @gello/time with cache-specific aliases.
 *
 * @module domain/Duration
 */

// Re-export core types and factories from @gello/time
export {
  // Duration module for advanced use
  Duration,
  // Duration factories
  millis,
  seconds,
  minutes,
  hours,
  days,
  weeks,
  // Special values
  forever,
  zero,
  // Predicates
  isFinite,
  isForever,
  // Conversions
  toMillis,
  toSeconds,
  // Common presets
  Durations,
  // DateTime for testable time operations
  DateTime,
  // Expiration utilities (testable)
  expiresAt,
  isExpired,
  isOptionExpired,
  remainingTtl,
  remainingOptionTtl,
} from "@gello/time"

// Re-export types (use separate type-only imports to avoid conflicts)
export type { DurationType, Utc, Zoned } from "@gello/time"

// Cache-specific aliases
import { Durations as D, expiresAt as _expiresAt, isExpired as _isExpired, isOptionExpired as _isOptionExpired } from "@gello/time"

/**
 * Common cache durations - alias for backwards compatibility
 */
export const CacheDurations = D

/**
 * Calculate expiration DateTime from a duration
 * Alias for backwards compatibility
 */
export const expiresAtDateTime = _expiresAt

/**
 * Check if a DateTime has expired
 * Alias for backwards compatibility
 */
export const isDateTimeExpired = _isExpired

/**
 * Check if an Optional DateTime has expired
 * Alias for backwards compatibility
 */
export const isOptionDateTimeExpired = _isOptionExpired
