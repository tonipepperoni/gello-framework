/**
 * Duration - Time duration utilities
 *
 * Provides convenient wrappers around Effect Duration for
 * creating and manipulating time durations.
 *
 * @module Duration
 */
import { Duration as EffectDuration } from "effect"

/**
 * Re-export Effect Duration type
 */
export type Duration = EffectDuration.Duration

/**
 * Re-export Duration module for advanced use
 */
export const Duration = EffectDuration

// ─── Factory Functions ─────────────────────────────────────────────────────────

/**
 * Create duration in nanoseconds
 */
export const nanos = (n: bigint): Duration => EffectDuration.nanos(n)

/**
 * Create duration in microseconds
 */
export const micros = (n: bigint): Duration => EffectDuration.micros(n)

/**
 * Create duration in milliseconds
 */
export const millis = (n: number): Duration => EffectDuration.millis(n)

/**
 * Create duration in seconds
 */
export const seconds = (n: number): Duration => EffectDuration.seconds(n)

/**
 * Create duration in minutes
 */
export const minutes = (n: number): Duration => EffectDuration.minutes(n)

/**
 * Create duration in hours
 */
export const hours = (n: number): Duration => EffectDuration.hours(n)

/**
 * Create duration in days
 */
export const days = (n: number): Duration => EffectDuration.days(n)

/**
 * Create duration in weeks
 */
export const weeks = (n: number): Duration => EffectDuration.weeks(n)

// ─── Special Values ────────────────────────────────────────────────────────────

/**
 * Infinite duration (no expiration / forever)
 */
export const forever: Duration = EffectDuration.infinity

/**
 * Zero duration (immediate)
 */
export const zero: Duration = EffectDuration.zero

// ─── Predicates ────────────────────────────────────────────────────────────────

/**
 * Check if duration is finite
 */
export const isFinite = (d: Duration): boolean => EffectDuration.isFinite(d)

/**
 * Check if duration represents "forever" (infinite)
 */
export const isForever = (d: Duration): boolean => !EffectDuration.isFinite(d)

/**
 * Check if duration is zero
 */
export const isZero = (d: Duration): boolean => EffectDuration.isZero(d)

// ─── Conversions ───────────────────────────────────────────────────────────────

/**
 * Convert duration to milliseconds (null for infinite)
 */
export const toMillis = (d: Duration): number | null =>
  EffectDuration.isFinite(d) ? EffectDuration.toMillis(d) : null

/**
 * Convert duration to seconds (null for infinite)
 */
export const toSeconds = (d: Duration): number | null =>
  EffectDuration.isFinite(d) ? EffectDuration.toSeconds(d) : null

/**
 * Convert duration to minutes (null for infinite)
 */
export const toMinutes = (d: Duration): number | null =>
  EffectDuration.isFinite(d) ? EffectDuration.toSeconds(d) / 60 : null

/**
 * Convert duration to hours (null for infinite)
 */
export const toHours = (d: Duration): number | null =>
  EffectDuration.isFinite(d) ? EffectDuration.toSeconds(d) / 3600 : null

/**
 * Convert duration to nanoseconds (null for infinite)
 */
export const toNanos = (d: Duration): bigint | null => {
  if (!EffectDuration.isFinite(d)) return null
  const result = EffectDuration.toNanos(d)
  // Handle Option<bigint> return type from newer Effect versions
  if (typeof result === "bigint") return result
  return null
}

// ─── Arithmetic ────────────────────────────────────────────────────────────────

/**
 * Add two durations
 */
export const add = (a: Duration, b: Duration): Duration =>
  EffectDuration.sum(a, b)

/**
 * Subtract duration b from a
 */
export const subtract = (a: Duration, b: Duration): Duration =>
  EffectDuration.subtract(a, b)

/**
 * Multiply duration by a factor
 */
export const multiply = (d: Duration, factor: number): Duration =>
  EffectDuration.times(d, factor)

/**
 * Divide duration by a divisor
 */
export const divide = (d: Duration, divisor: number): Duration =>
  EffectDuration.times(d, 1 / divisor)

/**
 * Get the minimum of two durations
 */
export const min = (a: Duration, b: Duration): Duration =>
  EffectDuration.min(a, b)

/**
 * Get the maximum of two durations
 */
export const max = (a: Duration, b: Duration): Duration =>
  EffectDuration.max(a, b)

// ─── Comparison ────────────────────────────────────────────────────────────────

/**
 * Check if duration a is less than b
 */
export const lessThan = (a: Duration, b: Duration): boolean =>
  EffectDuration.lessThan(a, b)

/**
 * Check if duration a is less than or equal to b
 */
export const lessThanOrEqual = (a: Duration, b: Duration): boolean =>
  EffectDuration.lessThanOrEqualTo(a, b)

/**
 * Check if duration a is greater than b
 */
export const greaterThan = (a: Duration, b: Duration): boolean =>
  EffectDuration.greaterThan(a, b)

/**
 * Check if duration a is greater than or equal to b
 */
export const greaterThanOrEqual = (a: Duration, b: Duration): boolean =>
  EffectDuration.greaterThanOrEqualTo(a, b)

/**
 * Check if two durations are equal
 */
export const equals = (a: Duration, b: Duration): boolean =>
  EffectDuration.equals(a, b)

// ─── Common Presets ────────────────────────────────────────────────────────────

/**
 * Common duration presets for convenience
 */
export const Durations = {
  /** 100 milliseconds */
  hundredMillis: millis(100),
  /** 500 milliseconds */
  halfSecond: millis(500),
  /** 1 second */
  oneSecond: seconds(1),
  /** 5 seconds */
  fiveSeconds: seconds(5),
  /** 10 seconds */
  tenSeconds: seconds(10),
  /** 30 seconds */
  thirtySeconds: seconds(30),
  /** 1 minute */
  oneMinute: minutes(1),
  /** 5 minutes */
  fiveMinutes: minutes(5),
  /** 15 minutes */
  fifteenMinutes: minutes(15),
  /** 30 minutes */
  thirtyMinutes: minutes(30),
  /** 1 hour */
  oneHour: hours(1),
  /** 6 hours */
  sixHours: hours(6),
  /** 12 hours */
  twelveHours: hours(12),
  /** 1 day */
  oneDay: days(1),
  /** 1 week */
  oneWeek: weeks(1),
  /** Forever (no expiration) */
  forever,
  /** Zero duration */
  zero,
} as const
