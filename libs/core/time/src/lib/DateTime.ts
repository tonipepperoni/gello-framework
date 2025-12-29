/**
 * DateTime - Effect-based date/time utilities
 *
 * Provides testable date/time operations using Effect's DateTime module.
 * All operations that depend on "now" are Effects, allowing for
 * time manipulation in tests using TestClock.
 *
 * @module DateTime
 */
import { DateTime as EffectDateTime, Effect, Option } from "effect"
import { Duration as EffectDuration } from "effect"
import type { Duration } from "./Duration.js"

/**
 * Re-export Effect DateTime types
 */
export type DateTime = EffectDateTime.DateTime
export type Utc = EffectDateTime.Utc
export type Zoned = EffectDateTime.Zoned
export type TimeZone = EffectDateTime.TimeZone

/**
 * Re-export DateTime module for advanced use
 */
export const DateTime = EffectDateTime

// ─── Current Time ──────────────────────────────────────────────────────────────

/**
 * Get the current UTC time as an Effect
 * Uses Effect's Clock service, making it testable with TestClock
 */
export const now: Effect.Effect<Utc> = EffectDateTime.now

/**
 * Get the current time in a specific timezone
 */
export const nowIn = (zone: TimeZone): Effect.Effect<Zoned> =>
  Effect.map(EffectDateTime.now, (dt) => EffectDateTime.setZone(dt, zone))

/**
 * Get the current UTC time synchronously (not testable)
 * Use `now` for testable code
 */
export const unsafeNow = (): Utc => EffectDateTime.unsafeNow()

// ─── Creation ──────────────────────────────────────────────────────────────────

/**
 * Create a DateTime from a JavaScript Date
 */
export const fromDate = (date: Date): Utc =>
  EffectDateTime.unsafeMake(date.getTime())

/**
 * Create a DateTime from a Unix timestamp (milliseconds)
 */
export const fromMillis = (ms: number): Utc => EffectDateTime.unsafeMake(ms)

/**
 * Create a DateTime from a Unix timestamp (seconds)
 */
export const fromSeconds = (s: number): Utc =>
  EffectDateTime.unsafeMake(s * 1000)

/**
 * Create a DateTime from an ISO 8601 string
 * Returns Option.none() if the string is invalid
 */
export const fromString = (iso: string): Option.Option<Utc> =>
  EffectDateTime.make(iso) as Option.Option<Utc>

// ─── Conversion ────────────────────────────────────────────────────────────────

/**
 * Convert DateTime to JavaScript Date
 */
export const toDate = (dt: DateTime): Date => EffectDateTime.toDate(dt)

/**
 * Convert DateTime to Unix timestamp (milliseconds)
 */
export const toMillis = (dt: DateTime): number =>
  EffectDateTime.toEpochMillis(dt)

/**
 * Convert DateTime to Unix timestamp (seconds)
 */
export const toSeconds = (dt: DateTime): number =>
  Math.floor(EffectDateTime.toEpochMillis(dt) / 1000)

/**
 * Convert DateTime to ISO 8601 string
 */
export const toISOString = (dt: DateTime): string => EffectDateTime.format(dt)

// ─── Arithmetic ────────────────────────────────────────────────────────────────

/**
 * Add a duration to a DateTime
 */
export const addDuration = <A extends DateTime>(dt: A, d: Duration): A =>
  EffectDateTime.addDuration(dt, d) as A

/**
 * Subtract a duration from a DateTime
 */
export const subtractDuration = <A extends DateTime>(dt: A, d: Duration): A =>
  EffectDateTime.subtractDuration(dt, d) as A

/**
 * Get the duration between two DateTimes
 */
export const distance = (from: DateTime, to: DateTime): Duration =>
  EffectDateTime.distanceDuration(from, to)

// ─── Comparison ────────────────────────────────────────────────────────────────

/**
 * Check if DateTime a is before b
 */
export const isBefore = (a: DateTime, b: DateTime): boolean =>
  EffectDateTime.lessThan(a, b)

/**
 * Check if DateTime a is after b
 */
export const isAfter = (a: DateTime, b: DateTime): boolean =>
  EffectDateTime.greaterThan(a, b)

/**
 * Check if DateTime a is before or equal to b
 */
export const isBeforeOrEqual = (a: DateTime, b: DateTime): boolean =>
  EffectDateTime.lessThanOrEqualTo(a, b)

/**
 * Check if DateTime a is after or equal to b
 */
export const isAfterOrEqual = (a: DateTime, b: DateTime): boolean =>
  EffectDateTime.greaterThanOrEqualTo(a, b)

/**
 * Check if two DateTimes are equal
 */
export const equals = (a: DateTime, b: DateTime): boolean =>
  EffectDateTime.Equivalence(a, b)

/**
 * Get the minimum of two DateTimes
 */
export const min = <A extends DateTime>(a: A, b: A): A =>
  EffectDateTime.min(a, b) as A

/**
 * Get the maximum of two DateTimes
 */
export const max = <A extends DateTime>(a: A, b: A): A =>
  EffectDateTime.max(a, b) as A

// ─── Expiration Utilities ──────────────────────────────────────────────────────

/**
 * Calculate expiration DateTime from a duration
 *
 * @param ttl - The time-to-live duration
 * @returns Effect yielding Option of expiration DateTime (None for forever)
 */
export const expiresAt = (
  ttl: Duration
): Effect.Effect<Option.Option<Utc>> =>
  Effect.gen(function* () {
    if (!EffectDuration.isFinite(ttl)) {
      return Option.none()
    }

    const current = yield* EffectDateTime.now
    const expiration = EffectDateTime.addDuration(current, ttl)
    return Option.some(expiration)
  })

/**
 * Check if a DateTime has expired relative to current time
 *
 * @param expiresAt - The expiration DateTime
 * @returns Effect yielding true if expired
 */
export const isExpired = (expiresAt: Utc): Effect.Effect<boolean> =>
  Effect.gen(function* () {
    const current = yield* EffectDateTime.now
    return EffectDateTime.lessThan(expiresAt, current)
  })

/**
 * Check if an Optional DateTime has expired
 * Returns false for None (never expires)
 *
 * @param expiresAt - Optional expiration DateTime
 * @returns Effect yielding true if expired
 */
export const isOptionExpired = (
  expiresAt: Option.Option<Utc>
): Effect.Effect<boolean> =>
  Option.match(expiresAt, {
    onNone: () => Effect.succeed(false),
    onSome: isExpired,
  })

/**
 * Get remaining TTL as Duration from expiration DateTime
 *
 * @param expiresAt - The expiration DateTime
 * @returns Effect yielding remaining Duration (zero if expired)
 */
export const remainingTtl = (expiresAt: Utc): Effect.Effect<Duration> =>
  Effect.gen(function* () {
    const current = yield* EffectDateTime.now
    if (EffectDateTime.lessThanOrEqualTo(expiresAt, current)) {
      return EffectDuration.zero
    }
    return EffectDateTime.distanceDuration(current, expiresAt)
  })

/**
 * Get remaining TTL for an Optional expiration
 * Returns infinity for None (never expires)
 */
export const remainingOptionTtl = (
  expiresAt: Option.Option<Utc>
): Effect.Effect<Duration> =>
  Option.match(expiresAt, {
    onNone: () => Effect.succeed(EffectDuration.infinity),
    onSome: remainingTtl,
  })

// ─── Scheduling Utilities ──────────────────────────────────────────────────────

/**
 * Check if a scheduled time is in the past
 */
export const isPast = (scheduledAt: Utc): Effect.Effect<boolean> =>
  Effect.map(EffectDateTime.now, (current) =>
    EffectDateTime.lessThan(scheduledAt, current)
  )

/**
 * Check if a scheduled time is in the future
 */
export const isFuture = (scheduledAt: Utc): Effect.Effect<boolean> =>
  Effect.map(EffectDateTime.now, (current) =>
    EffectDateTime.greaterThan(scheduledAt, current)
  )

/**
 * Get the time until a scheduled DateTime
 * Returns zero if the time has passed
 */
export const timeUntil = (scheduledAt: Utc): Effect.Effect<Duration> =>
  Effect.gen(function* () {
    const current = yield* EffectDateTime.now
    if (EffectDateTime.lessThanOrEqualTo(scheduledAt, current)) {
      return EffectDuration.zero
    }
    return EffectDateTime.distanceDuration(current, scheduledAt)
  })

/**
 * Get the time since a DateTime
 * Returns zero if the time is in the future
 */
export const timeSince = (since: Utc): Effect.Effect<Duration> =>
  Effect.gen(function* () {
    const current = yield* EffectDateTime.now
    if (EffectDateTime.greaterThanOrEqualTo(since, current)) {
      return EffectDuration.zero
    }
    return EffectDateTime.distanceDuration(since, current)
  })

/**
 * Schedule a DateTime in the future by adding a duration to now
 */
export const scheduleIn = (d: Duration): Effect.Effect<Utc> =>
  Effect.map(EffectDateTime.now, (current) =>
    EffectDateTime.addDuration(current, d)
  )
