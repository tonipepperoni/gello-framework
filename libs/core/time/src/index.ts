/**
 * @gello/time - Time and duration utilities for Effect-TS
 *
 * Provides testable time operations using Effect's DateTime and Duration modules,
 * plus simple timestamp utilities for non-Effect code.
 *
 * @module @gello/time
 */

// Duration utilities
export {
  Duration,
  type Duration as DurationType,
  // Factories
  nanos,
  micros,
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
  isZero,
  // Conversions
  toMillis,
  toSeconds,
  toMinutes,
  toHours,
  toNanos,
  // Arithmetic
  add,
  subtract,
  multiply,
  divide,
  min as minDuration,
  max as maxDuration,
  // Comparison
  lessThan as durationLessThan,
  lessThanOrEqual as durationLessThanOrEqual,
  greaterThan as durationGreaterThan,
  greaterThanOrEqual as durationGreaterThanOrEqual,
  equals as durationEquals,
  // Presets
  Durations,
} from "./lib/Duration.js"

// DateTime utilities (testable with Effect)
export {
  DateTime,
  type DateTime as DateTimeType,
  type Utc,
  type Zoned,
  type TimeZone,
  // Current time
  now,
  nowIn,
  unsafeNow,
  // Creation
  fromDate,
  fromMillis as dateTimeFromMillis,
  fromSeconds as dateTimeFromSeconds,
  fromString,
  // Conversion
  toDate,
  toMillis as dateTimeToMillis,
  toSeconds as dateTimeToSeconds,
  toISOString,
  // Arithmetic
  addDuration,
  subtractDuration,
  distance,
  // Comparison
  isBefore,
  isAfter,
  isBeforeOrEqual,
  isAfterOrEqual,
  equals as dateTimeEquals,
  min as minDateTime,
  max as maxDateTime,
  // Expiration
  expiresAt,
  isExpired,
  isOptionExpired,
  remainingTtl,
  remainingOptionTtl,
  // Scheduling
  isPast,
  isFuture,
  timeUntil,
  timeSince,
  scheduleIn,
} from "./lib/DateTime.js"

// Timestamp utilities (simple, not Effect-based)
export {
  type TimestampMs,
  type TimestampSec,
  // Current time
  nowMs,
  nowSec,
  // Creation
  fromMs,
  fromSec,
  fromDate as timestampFromDate,
  fromISOString,
  // Conversion
  msToSec,
  secToMs,
  toDate as timestampToDate,
  toISOString as timestampToISOString,
  // Arithmetic
  addMs,
  addSec,
  addMinutes,
  addHours,
  addDays,
  diffMs,
  diffSec,
  // Comparison
  isBefore as timestampIsBefore,
  isAfter as timestampIsAfter,
  isPast as timestampIsPast,
  isFuture as timestampIsFuture,
  // Expiration
  expiresAtMs,
  expiresAtSec,
  isExpired as timestampIsExpired,
  remainingTtlMs,
  remainingTtlSec,
} from "./lib/Timestamp.js"
