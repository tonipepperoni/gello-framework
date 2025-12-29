/**
 * Timestamp - Unix timestamp utilities
 *
 * Simple helpers for working with Unix timestamps in both
 * milliseconds and seconds.
 *
 * @module Timestamp
 */

/**
 * Timestamp in milliseconds since Unix epoch
 */
export type TimestampMs = number & { readonly _brand: unique symbol }

/**
 * Timestamp in seconds since Unix epoch
 */
export type TimestampSec = number & { readonly _brand: unique symbol }

// ─── Current Time ──────────────────────────────────────────────────────────────

/**
 * Get current timestamp in milliseconds
 */
export const nowMs = (): TimestampMs => Date.now() as TimestampMs

/**
 * Get current timestamp in seconds
 */
export const nowSec = (): TimestampSec =>
  Math.floor(Date.now() / 1000) as TimestampSec

// ─── Creation ──────────────────────────────────────────────────────────────────

/**
 * Create a millisecond timestamp from a number
 */
export const fromMs = (ms: number): TimestampMs => ms as TimestampMs

/**
 * Create a second timestamp from a number
 */
export const fromSec = (sec: number): TimestampSec => sec as TimestampSec

/**
 * Create a millisecond timestamp from a Date
 */
export const fromDate = (date: Date): TimestampMs =>
  date.getTime() as TimestampMs

/**
 * Create a timestamp from an ISO string
 */
export const fromISOString = (iso: string): TimestampMs =>
  new Date(iso).getTime() as TimestampMs

// ─── Conversion ────────────────────────────────────────────────────────────────

/**
 * Convert millisecond timestamp to seconds
 */
export const msToSec = (ms: TimestampMs): TimestampSec =>
  Math.floor((ms as number) / 1000) as TimestampSec

/**
 * Convert second timestamp to milliseconds
 */
export const secToMs = (sec: TimestampSec): TimestampMs =>
  ((sec as number) * 1000) as TimestampMs

/**
 * Convert timestamp to Date
 */
export const toDate = (ts: TimestampMs): Date => new Date(ts as number)

/**
 * Convert timestamp to ISO string
 */
export const toISOString = (ts: TimestampMs): string =>
  new Date(ts as number).toISOString()

// ─── Arithmetic ────────────────────────────────────────────────────────────────

/**
 * Add milliseconds to a timestamp
 */
export const addMs = (ts: TimestampMs, ms: number): TimestampMs =>
  ((ts as number) + ms) as TimestampMs

/**
 * Add seconds to a timestamp
 */
export const addSec = (ts: TimestampMs, sec: number): TimestampMs =>
  ((ts as number) + sec * 1000) as TimestampMs

/**
 * Add minutes to a timestamp
 */
export const addMinutes = (ts: TimestampMs, min: number): TimestampMs =>
  ((ts as number) + min * 60 * 1000) as TimestampMs

/**
 * Add hours to a timestamp
 */
export const addHours = (ts: TimestampMs, hours: number): TimestampMs =>
  ((ts as number) + hours * 60 * 60 * 1000) as TimestampMs

/**
 * Add days to a timestamp
 */
export const addDays = (ts: TimestampMs, d: number): TimestampMs =>
  ((ts as number) + d * 24 * 60 * 60 * 1000) as TimestampMs

/**
 * Get the difference between two timestamps in milliseconds
 */
export const diffMs = (from: TimestampMs, to: TimestampMs): number =>
  (to as number) - (from as number)

/**
 * Get the difference between two timestamps in seconds
 */
export const diffSec = (from: TimestampMs, to: TimestampMs): number =>
  Math.floor(((to as number) - (from as number)) / 1000)

// ─── Comparison ────────────────────────────────────────────────────────────────

/**
 * Check if timestamp a is before b
 */
export const isBefore = (a: TimestampMs, b: TimestampMs): boolean =>
  (a as number) < (b as number)

/**
 * Check if timestamp a is after b
 */
export const isAfter = (a: TimestampMs, b: TimestampMs): boolean =>
  (a as number) > (b as number)

/**
 * Check if a timestamp is in the past
 */
export const isPast = (ts: TimestampMs): boolean =>
  (ts as number) < Date.now()

/**
 * Check if a timestamp is in the future
 */
export const isFuture = (ts: TimestampMs): boolean =>
  (ts as number) > Date.now()

// ─── Expiration ────────────────────────────────────────────────────────────────

/**
 * Calculate expiration timestamp given TTL in milliseconds
 * Returns null for infinite TTL
 */
export const expiresAtMs = (
  ttlMs: number | null
): TimestampMs | null =>
  ttlMs === null ? null : ((Date.now() + ttlMs) as TimestampMs)

/**
 * Calculate expiration timestamp given TTL in seconds
 * Returns null for infinite TTL
 */
export const expiresAtSec = (
  ttlSec: number | null
): TimestampMs | null =>
  ttlSec === null ? null : ((Date.now() + ttlSec * 1000) as TimestampMs)

/**
 * Check if an expiration timestamp has passed
 * Returns false for null (never expires)
 */
export const isExpired = (expiresAt: TimestampMs | null): boolean =>
  expiresAt !== null && (expiresAt as number) < Date.now()

/**
 * Get remaining TTL in milliseconds
 * Returns 0 if expired, null if never expires
 */
export const remainingTtlMs = (expiresAt: TimestampMs | null): number | null => {
  if (expiresAt === null) return null
  const remaining = (expiresAt as number) - Date.now()
  return remaining > 0 ? remaining : 0
}

/**
 * Get remaining TTL in seconds
 * Returns 0 if expired, null if never expires
 */
export const remainingTtlSec = (
  expiresAt: TimestampMs | null
): number | null => {
  const ms = remainingTtlMs(expiresAt)
  return ms === null ? null : Math.ceil(ms / 1000)
}
