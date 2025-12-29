/**
 * Multi Driver
 *
 * Composite driver that writes to multiple drivers simultaneously
 * - Parallel writes for performance
 * - Aggregates flush and close operations
 */

import { Effect } from "effect";
import type { LogDriverPort, LogEntry } from "@gello/core-contracts";

// ─── Multi Driver Factory ────────────────────────────────────

export const multiDriver = (
  drivers: readonly LogDriverPort[]
): LogDriverPort => ({
  name: `multi(${drivers.map((d) => d.name).join(", ")})`,

  write: (entry: LogEntry): Effect.Effect<void> =>
    Effect.all(
      drivers.map((driver) => driver.write(entry)),
      { concurrency: "unbounded" }
    ).pipe(Effect.asVoid),

  flush: (): Effect.Effect<void> =>
    Effect.all(
      drivers.map((driver) => driver.flush()),
      { concurrency: "unbounded" }
    ).pipe(Effect.asVoid),

  close: (): Effect.Effect<void> =>
    Effect.all(
      drivers.map((driver) => driver.close()),
      { concurrency: "unbounded" }
    ).pipe(Effect.asVoid),
});

// ─── Level-Filtered Driver ───────────────────────────────────

import type { LogLevel } from "@gello/core-contracts";
import { isLevelEnabled } from "@gello/core-contracts";

/**
 * Creates a driver that only writes logs at or above a certain level
 */
export const filteredDriver = (
  driver: LogDriverPort,
  minLevel: LogLevel
): LogDriverPort => ({
  name: `filtered(${driver.name}, >=${minLevel})`,

  write: (entry: LogEntry): Effect.Effect<void> =>
    isLevelEnabled(entry.level, minLevel) ? driver.write(entry) : Effect.void,

  flush: () => driver.flush(),

  close: () => driver.close(),
});

// ─── Tee Driver ──────────────────────────────────────────────

/**
 * Creates a driver that writes to two drivers (useful for stdout + file)
 */
export const teeDriver = (
  primary: LogDriverPort,
  secondary: LogDriverPort
): LogDriverPort => multiDriver([primary, secondary]);

// ─── Conditional Driver ──────────────────────────────────────

/**
 * Creates a driver that conditionally routes to different drivers
 */
export const conditionalDriver = (
  condition: (entry: LogEntry) => boolean,
  ifTrue: LogDriverPort,
  ifFalse: LogDriverPort
): LogDriverPort => ({
  name: `conditional(${ifTrue.name}, ${ifFalse.name})`,

  write: (entry: LogEntry): Effect.Effect<void> =>
    condition(entry) ? ifTrue.write(entry) : ifFalse.write(entry),

  flush: (): Effect.Effect<void> =>
    Effect.all([ifTrue.flush(), ifFalse.flush()], { concurrency: "unbounded" }).pipe(
      Effect.asVoid
    ),

  close: (): Effect.Effect<void> =>
    Effect.all([ifTrue.close(), ifFalse.close()], { concurrency: "unbounded" }).pipe(
      Effect.asVoid
    ),
});

// ─── Async Driver ────────────────────────────────────────────

/**
 * Wraps a driver to make writes non-blocking (fire and forget)
 */
export const asyncDriver = (driver: LogDriverPort): LogDriverPort => ({
  name: `async(${driver.name})`,

  write: (entry: LogEntry): Effect.Effect<void> =>
    driver.write(entry).pipe(Effect.fork, Effect.asVoid),

  flush: () => driver.flush(),

  close: () => driver.close(),
});
