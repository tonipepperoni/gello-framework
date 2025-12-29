/**
 * Mock Logger for Testing
 *
 * Provides a logger that captures all log entries for assertions.
 */

import { Effect, Ref, Layer } from "effect";
import type {
  LoggerPort,
  LogEntry,
  LogLevel,
} from "@gello/core-contracts";
import { Logger, createLogEntry } from "@gello/core-contracts";

// ─── Mock Logger State ───────────────────────────────────────

export interface MockLoggerState {
  readonly entries: readonly LogEntry[];
  readonly byLevel: Record<LogLevel, readonly LogEntry[]>;
}

const emptyState: MockLoggerState = {
  entries: [],
  byLevel: {
    trace: [],
    debug: [],
    info: [],
    warning: [],
    error: [],
    fatal: [],
  },
};

// ─── Mock Logger Interface ───────────────────────────────────

export interface MockLogger {
  readonly logger: LoggerPort;
  readonly getState: () => Effect.Effect<MockLoggerState>;
  readonly getEntries: () => Effect.Effect<readonly LogEntry[]>;
  readonly getByLevel: (level: LogLevel) => Effect.Effect<readonly LogEntry[]>;
  readonly hasEntry: (predicate: (entry: LogEntry) => boolean) => Effect.Effect<boolean>;
  readonly hasMessage: (message: string) => Effect.Effect<boolean>;
  readonly hasMessageContaining: (substring: string) => Effect.Effect<boolean>;
  readonly getLastEntry: () => Effect.Effect<LogEntry | undefined>;
  readonly getLastByLevel: (level: LogLevel) => Effect.Effect<LogEntry | undefined>;
  readonly clear: () => Effect.Effect<void>;
  readonly count: () => Effect.Effect<number>;
  readonly countByLevel: (level: LogLevel) => Effect.Effect<number>;
}

// ─── Mock Logger Factory ─────────────────────────────────────

export const createMockLogger = (): Effect.Effect<MockLogger> =>
  Effect.gen(function* () {
    const state = yield* Ref.make<MockLoggerState>(emptyState);

    const addEntry = (entry: LogEntry) =>
      Ref.update(state, (s) => ({
        entries: [...s.entries, entry],
        byLevel: {
          ...s.byLevel,
          [entry.level]: [...s.byLevel[entry.level], entry],
        },
      }));

    const makeEntry = (
      level: LogLevel,
      message: string,
      context?: Record<string, unknown>,
      error?: unknown
    ): LogEntry =>
      createLogEntry(level, message, {
        context,
        error,
      });

    const logger: LoggerPort = {
      log: (entry) => addEntry(entry),

      trace: (msg, ctx) => addEntry(makeEntry("trace", msg, ctx)),
      debug: (msg, ctx) => addEntry(makeEntry("debug", msg, ctx)),
      info: (msg, ctx) => addEntry(makeEntry("info", msg, ctx)),
      warning: (msg, ctx) => addEntry(makeEntry("warning", msg, ctx)),
      error: (msg, err, ctx) => addEntry(makeEntry("error", msg, ctx, err)),
      fatal: (msg, err, ctx) => addEntry(makeEntry("fatal", msg, ctx, err)),

      child: () => logger,
      withRequestId: () => logger,
      withService: () => logger,
      withModule: () => logger,
      flush: () => Effect.void,
    };

    return {
      logger,

      getState: () => Ref.get(state),

      getEntries: () => Ref.get(state).pipe(Effect.map((s) => s.entries)),

      getByLevel: (level: LogLevel) =>
        Ref.get(state).pipe(Effect.map((s) => s.byLevel[level])),

      hasEntry: (predicate: (entry: LogEntry) => boolean) =>
        Ref.get(state).pipe(Effect.map((s) => s.entries.some(predicate))),

      hasMessage: (message: string) =>
        Ref.get(state).pipe(
          Effect.map((s) => s.entries.some((e) => e.message === message))
        ),

      hasMessageContaining: (substring: string) =>
        Ref.get(state).pipe(
          Effect.map((s) => s.entries.some((e) => e.message.includes(substring)))
        ),

      getLastEntry: () =>
        Ref.get(state).pipe(
          Effect.map((s) => s.entries[s.entries.length - 1])
        ),

      getLastByLevel: (level: LogLevel) =>
        Ref.get(state).pipe(
          Effect.map((s) => {
            const entries = s.byLevel[level];
            return entries[entries.length - 1];
          })
        ),

      clear: () => Ref.set(state, emptyState),

      count: () => Ref.get(state).pipe(Effect.map((s) => s.entries.length)),

      countByLevel: (level: LogLevel) =>
        Ref.get(state).pipe(Effect.map((s) => s.byLevel[level].length)),
    };
  });

// ─── Test Helpers ────────────────────────────────────────────

/**
 * Run an effect with a mock logger and return both result and logs
 */
export const withMockLogger = <A, E, R>(
  effect: Effect.Effect<A, E, R>
): Effect.Effect<
  { result: A; logs: MockLoggerState },
  E,
  Exclude<R, Logger>
> =>
  Effect.gen(function* () {
    const mock = yield* createMockLogger();
    const result = yield* effect.pipe(Effect.provideService(Logger, mock.logger));
    const logs = yield* mock.getState();
    return { result, logs };
  });

/**
 * Create a mock logger layer
 */
export const mockLoggerLayer = (): Effect.Effect<
  Layer.Layer<Logger> & { getMock: () => Effect.Effect<MockLogger> }
> =>
  Effect.gen(function* () {
    const mock = yield* createMockLogger();
    const layer = Layer.succeed(Logger, mock.logger);
    return Object.assign(layer, {
      getMock: () => Effect.succeed(mock),
    });
  });

/**
 * Silent logger layer (no output, no capture)
 */
const createSilentLogger = (): LoggerPort => {
  const self: LoggerPort = {
    log: () => Effect.void,
    trace: () => Effect.void,
    debug: () => Effect.void,
    info: () => Effect.void,
    warning: () => Effect.void,
    error: () => Effect.void,
    fatal: () => Effect.void,
    child: () => self,
    withRequestId: () => self,
    withService: () => self,
    withModule: () => self,
    flush: () => Effect.void,
  };
  return self;
};

export const silentLoggerLayer: Layer.Layer<Logger> =
  Layer.succeed(Logger, createSilentLogger());

// ─── Assertion Helpers ───────────────────────────────────────

export const expectLogEntry = (
  logs: MockLoggerState,
  options: {
    level?: LogLevel;
    message?: string;
    messageContains?: string;
    context?: Record<string, unknown>;
  }
): void => {
  const { level, message, messageContains, context } = options;

  const entries = level ? logs.byLevel[level] : logs.entries;

  const found = entries.some((entry) => {
    if (message && entry.message !== message) return false;
    if (messageContains && !entry.message.includes(messageContains)) return false;
    if (context) {
      for (const [key, value] of Object.entries(context)) {
        if (entry.context?.[key] !== value) return false;
      }
    }
    return true;
  });

  if (!found) {
    throw new Error(
      `Expected log entry not found. Options: ${JSON.stringify(options)}\n` +
        `Entries: ${JSON.stringify(entries.map((e) => ({ level: e.level, message: e.message })))}`
    );
  }
};

export const expectNoErrors = (logs: MockLoggerState): void => {
  const errorEntries = [...logs.byLevel.error, ...logs.byLevel.fatal];
  if (errorEntries.length > 0) {
    throw new Error(
      `Expected no error logs, but found ${errorEntries.length}:\n` +
        errorEntries.map((e) => `  - ${e.level}: ${e.message}`).join("\n")
    );
  }
};

export const expectErrorLog = (
  logs: MockLoggerState,
  messageContains?: string
): void => {
  const errorEntries = [...logs.byLevel.error, ...logs.byLevel.fatal];

  if (errorEntries.length === 0) {
    throw new Error("Expected at least one error log, but found none");
  }

  if (messageContains) {
    const found = errorEntries.some((e) => e.message.includes(messageContains));
    if (!found) {
      throw new Error(
        `Expected error log containing "${messageContains}", but found:\n` +
          errorEntries.map((e) => `  - ${e.message}`).join("\n")
      );
    }
  }
};
