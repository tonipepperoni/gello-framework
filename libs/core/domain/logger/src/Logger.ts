/**
 * Logger Implementation
 *
 * Core logger that uses a driver for output and supports:
 * - Child loggers with inherited context
 * - Request ID and service scoping
 * - Key redaction
 * - Configurable log levels
 */

import { Effect, Layer } from "effect";
import type {
  LoggerPort,
  LoggerConfig,
  LogDriverPort,
  LogEntry,
  LogLevel,
} from "@gello/core-contracts";
import { Logger, isLevelEnabled, createLogEntry } from "@gello/core-contracts";
import { errorFormatter } from "./ErrorFormatter.js";

// ─── Logger Factory ──────────────────────────────────────────

export const makeLogger = (
  driver: LogDriverPort,
  config: LoggerConfig,
  parentContext: Record<string, unknown> = {}
): LoggerPort => {
  const baseContext = { ...config.defaultContext, ...parentContext };

  const shouldLog = (level: LogLevel): boolean =>
    isLevelEnabled(level, config.level);

  const redact = (context: Record<string, unknown>): Record<string, unknown> => {
    if (!config.redactKeys?.length) return context;

    const redacted = { ...context };
    const redactSet = new Set(config.redactKeys.map((k) => k.toLowerCase()));

    for (const key of Object.keys(redacted)) {
      if (redactSet.has(key.toLowerCase())) {
        redacted[key] = "[REDACTED]";
      }
    }
    return redacted;
  };

  const createEntry = (
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: unknown
  ): LogEntry => {
    const formatted = error ? errorFormatter.formatError(error) : undefined;

    return createLogEntry(level, message, {
      service: config.service,
      context: redact({ ...baseContext, ...context }),
      error: formatted,
      stack: formatted?.stack,
    });
  };

  const logAtLevel =
    (level: LogLevel) =>
    (message: string, context?: Record<string, unknown>): Effect.Effect<void> =>
      shouldLog(level) ? driver.write(createEntry(level, message, context)) : Effect.void;

  const logError =
    (level: "error" | "fatal") =>
    (
      message: string,
      error?: unknown,
      context?: Record<string, unknown>
    ): Effect.Effect<void> =>
      shouldLog(level)
        ? driver.write(createEntry(level, message, context, error))
        : Effect.void;

  const self: LoggerPort = {
    log: (entry) => (shouldLog(entry.level) ? driver.write(entry) : Effect.void),

    trace: logAtLevel("trace"),
    debug: logAtLevel("debug"),
    info: logAtLevel("info"),
    warning: logAtLevel("warning"),
    error: logError("error"),
    fatal: logError("fatal"),

    child: (context) =>
      makeLogger(driver, config, { ...baseContext, ...context }),

    withRequestId: (requestId) =>
      makeLogger(driver, config, { ...baseContext, requestId }),

    withService: (service) =>
      makeLogger(driver, { ...config, service }, baseContext),

    withModule: (module) =>
      makeLogger(driver, config, { ...baseContext, module }),

    flush: () => driver.flush(),
  };

  return self;
};

// ─── Layer Factory ───────────────────────────────────────────

export const layer = (
  driver: LogDriverPort,
  config: LoggerConfig
): Layer.Layer<Logger> =>
  Layer.succeed(Logger, makeLogger(driver, config));

// ─── Default Configuration ───────────────────────────────────

export const defaultConfig: LoggerConfig = {
  level: "info",
  service: "gello",
  redactKeys: [
    "password",
    "secret",
    "token",
    "apiKey",
    "authorization",
    "cookie",
    "x-api-key",
  ],
  timestampFormat: "iso",
};

// ─── Config Helpers ──────────────────────────────────────────

export const withLevel = (level: LogLevel) => (config: LoggerConfig): LoggerConfig => ({
  ...config,
  level,
});

export const withService = (service: string) => (config: LoggerConfig): LoggerConfig => ({
  ...config,
  service,
});

export const withRedactKeys = (keys: readonly string[]) => (config: LoggerConfig): LoggerConfig => ({
  ...config,
  redactKeys: [...(config.redactKeys ?? []), ...keys],
});

export const withDefaultContext = (context: Record<string, unknown>) => (config: LoggerConfig): LoggerConfig => ({
  ...config,
  defaultContext: { ...config.defaultContext, ...context },
});
