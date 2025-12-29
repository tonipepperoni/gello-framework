/**
 * Logger contracts (Hexagonal Architecture)
 *
 * These define the logging ports and types.
 * Adapters (drivers) implement these ports.
 */

import { Context, Effect, Schema as S } from "effect";

// ─── Log Levels ──────────────────────────────────────────────
export type LogLevel = "trace" | "debug" | "info" | "warning" | "error" | "fatal";

export const LogLevelValue: Record<LogLevel, number> = {
  trace: 0,
  debug: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

export const isLevelEnabled = (current: LogLevel, minimum: LogLevel): boolean =>
  LogLevelValue[current] >= LogLevelValue[minimum];

export const LogLevelSchema = S.Literal("trace", "debug", "info", "warning", "error", "fatal");

// ─── Log Entry ───────────────────────────────────────────────
export interface LogEntry {
  readonly timestamp: Date;
  readonly level: LogLevel;
  readonly message: string;
  readonly context?: Record<string, unknown>;
  readonly requestId?: string;
  readonly service?: string;
  readonly module?: string;
  readonly error?: unknown;
  readonly stack?: string;
  readonly duration?: number;
  readonly metadata?: Record<string, unknown>;
}

export const LogEntrySchema = S.Struct({
  timestamp: S.Date,
  level: LogLevelSchema,
  message: S.String,
  context: S.optional(S.Record({ key: S.String, value: S.Unknown })),
  requestId: S.optional(S.String),
  service: S.optional(S.String),
  module: S.optional(S.String),
  error: S.optional(S.Unknown),
  stack: S.optional(S.String),
  duration: S.optional(S.Number),
  metadata: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});

export const createLogEntry = (
  level: LogLevel,
  message: string,
  options: Partial<Omit<LogEntry, "timestamp" | "level" | "message">> = {}
): LogEntry => ({
  timestamp: new Date(),
  level,
  message,
  ...options,
});

// ─── Formatted Error ─────────────────────────────────────────
export interface FormattedError {
  readonly name: string;
  readonly message: string;
  readonly code?: string;
  readonly stack?: string;
  readonly cause?: FormattedError;
  readonly context?: Record<string, unknown>;
}

// ─── Logger Port ─────────────────────────────────────────────
export interface LoggerPort {
  readonly log: (entry: LogEntry) => Effect.Effect<void>;
  readonly trace: (message: string, context?: Record<string, unknown>) => Effect.Effect<void>;
  readonly debug: (message: string, context?: Record<string, unknown>) => Effect.Effect<void>;
  readonly info: (message: string, context?: Record<string, unknown>) => Effect.Effect<void>;
  readonly warning: (message: string, context?: Record<string, unknown>) => Effect.Effect<void>;
  readonly error: (message: string, error?: unknown, context?: Record<string, unknown>) => Effect.Effect<void>;
  readonly fatal: (message: string, error?: unknown, context?: Record<string, unknown>) => Effect.Effect<void>;
  readonly child: (context: Record<string, unknown>) => LoggerPort;
  readonly withRequestId: (requestId: string) => LoggerPort;
  readonly withService: (service: string) => LoggerPort;
  readonly withModule: (module: string) => LoggerPort;
  readonly flush: () => Effect.Effect<void>;
}

// ─── Log Driver Port ─────────────────────────────────────────
export interface LogDriverPort {
  readonly name: string;
  readonly write: (entry: LogEntry) => Effect.Effect<void>;
  readonly flush: () => Effect.Effect<void>;
  readonly close: () => Effect.Effect<void>;
}

// ─── Log Formatter Port ──────────────────────────────────────
export interface LogFormatterPort {
  readonly format: (entry: LogEntry) => string;
}

// ─── Error Formatter Port ────────────────────────────────────
export interface ErrorFormatterPort {
  readonly formatError: (error: unknown) => FormattedError;
  readonly formatStack: (stack: string) => string;
  readonly extractCause: (error: unknown) => unknown | undefined;
}

// ─── Driver Configurations ───────────────────────────────────
export interface ConsoleDriverConfig {
  readonly colors?: boolean;
  readonly timestamps?: boolean;
  readonly icons?: boolean;
}

export interface FileDriverConfig {
  readonly path: string;
  readonly maxSize?: number;
  readonly maxFiles?: number;
  readonly compress?: boolean;
}

export interface JsonDriverConfig {
  readonly pretty?: boolean;
  readonly includeStack?: boolean;
}

export interface PrettyDriverConfig {
  readonly colors?: boolean;
  readonly icons?: boolean;
  readonly timestamps?: boolean;
  readonly multiline?: boolean;
}

// ─── Logger Configuration ────────────────────────────────────
export interface LoggerConfig {
  readonly level: LogLevel;
  readonly service?: string;
  readonly defaultContext?: Record<string, unknown>;
  readonly redactKeys?: readonly string[];
  readonly timestampFormat?: "iso" | "unix" | "relative";
}

// ─── Context Tags ────────────────────────────────────────────
export class Logger extends Context.Tag("@gello/Logger")<
  Logger,
  LoggerPort
>() {}

export class LogDriver extends Context.Tag("@gello/LogDriver")<
  LogDriver,
  LogDriverPort
>() {}
