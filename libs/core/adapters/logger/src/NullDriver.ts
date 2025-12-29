/**
 * Null Driver
 *
 * A driver that discards all log entries (for testing or disabling logging)
 */

import { Effect } from "effect";
import type { LogDriverPort, LogEntry } from "@gello/core-contracts";

// ─── Null Driver ─────────────────────────────────────────────

export const nullDriver: LogDriverPort = {
  name: "null",
  write: (_entry: LogEntry): Effect.Effect<void> => Effect.void,
  flush: (): Effect.Effect<void> => Effect.void,
  close: (): Effect.Effect<void> => Effect.void,
};

// ─── Memory Driver (for testing) ─────────────────────────────

import { Ref } from "effect";

export interface MemoryDriverState {
  readonly entries: readonly LogEntry[];
}

export const memoryDriver = (): Effect.Effect<
  LogDriverPort & {
    readonly getEntries: () => Effect.Effect<readonly LogEntry[]>;
    readonly clear: () => Effect.Effect<void>;
  }
> =>
  Effect.gen(function* () {
    const state = yield* Ref.make<MemoryDriverState>({ entries: [] });

    return {
      name: "memory",

      write: (entry: LogEntry): Effect.Effect<void> =>
        Ref.update(state, (s) => ({
          entries: [...s.entries, entry],
        })),

      flush: (): Effect.Effect<void> => Effect.void,

      close: (): Effect.Effect<void> => Effect.void,

      getEntries: (): Effect.Effect<readonly LogEntry[]> =>
        Ref.get(state).pipe(Effect.map((s) => s.entries)),

      clear: (): Effect.Effect<void> =>
        Ref.set(state, { entries: [] }),
    };
  });

// ─── Counting Driver (for testing) ───────────────────────────

export const countingDriver = (): Effect.Effect<
  LogDriverPort & {
    readonly getCount: () => Effect.Effect<number>;
    readonly getCountByLevel: () => Effect.Effect<Record<string, number>>;
    readonly reset: () => Effect.Effect<void>;
  }
> =>
  Effect.gen(function* () {
    const count = yield* Ref.make(0);
    const byLevel = yield* Ref.make<Record<string, number>>({});

    return {
      name: "counting",

      write: (entry: LogEntry): Effect.Effect<void> =>
        Effect.all([
          Ref.update(count, (n) => n + 1),
          Ref.update(byLevel, (levels) => ({
            ...levels,
            [entry.level]: (levels[entry.level] ?? 0) + 1,
          })),
        ]).pipe(Effect.asVoid),

      flush: (): Effect.Effect<void> => Effect.void,

      close: (): Effect.Effect<void> => Effect.void,

      getCount: (): Effect.Effect<number> => Ref.get(count),

      getCountByLevel: (): Effect.Effect<Record<string, number>> => Ref.get(byLevel),

      reset: (): Effect.Effect<void> =>
        Effect.all([
          Ref.set(count, 0),
          Ref.set(byLevel, {}),
        ]).pipe(Effect.asVoid),
    };
  });
