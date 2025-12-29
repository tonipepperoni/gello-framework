/**
 * Logger Configuration
 *
 * Factory functions for creating logger layers from config.
 * Supports environment-based presets and runtime configuration.
 */

import { Effect, Layer, Scope } from "effect";
import type { LoggerConfig, LogLevel, LogDriverPort, LoggerPort } from "@gello/core-contracts";
import { Logger } from "@gello/core-contracts";
import { makeLogger, defaultConfig } from "@gello/domain-logger";
import {
  consoleDriver,
  jsonDriver,
  prettyDriver,
  fileDriver,
  multiDriver,
  nullDriver,
  filteredDriver,
} from "@gello/adapters-logger";
import { Config } from "./Config.js";
import { environment } from "./Environment.js";

// ─── Logger Layer from Config ────────────────────────────────

/**
 * Create a logger layer from the Config service
 */
export const loggerFromConfig = () =>
  Effect.gen(function* () {
    const config = yield* Config;

    // Read configuration values
    const level = (yield* config.string("logging.level", "info")) as LogLevel;
    const service = yield* config.string("app.name", "gello");
    const driver = yield* config.string("logging.driver", "pretty");

    const loggerConfig: LoggerConfig = {
      ...defaultConfig,
      level,
      service,
    };

    // Select driver based on config
    const selectedDriver = selectDriver(driver);

    return Layer.succeed(Logger, makeLogger(selectedDriver, loggerConfig));
  });

// ─── Driver Selection ────────────────────────────────────────

const selectDriver = (driverName: string): LogDriverPort => {
  switch (driverName.toLowerCase()) {
    case "console":
      return consoleDriver({ colors: true, timestamps: true });

    case "json":
      return jsonDriver({ includeStack: true });

    case "pretty":
    default:
      return prettyDriver({ colors: true, icons: true, multiline: true });
  }
};

// ─── Environment Presets ─────────────────────────────────────

/**
 * Development logger - pretty output with debug level
 */
export const developmentLogger = (): Layer.Layer<Logger> =>
  Layer.succeed(
    Logger,
    makeLogger(
      prettyDriver({ colors: true, icons: true, multiline: true }),
      { ...defaultConfig, level: "debug" }
    )
  );

/**
 * Production logger - JSON output to stdout + file
 */
export const productionLogger = (
  logPath = "./logs/app.log"
): Effect.Effect<Layer.Layer<Logger>, Error, Scope.Scope> =>
  Effect.gen(function* () {
    // Create file driver with rotation
    const file = yield* fileDriver({
      path: logPath,
      maxSize: 50 * 1024 * 1024, // 50MB
      maxFiles: 10,
      compress: true,
    });

    // JSON to stdout (for log aggregators) + file backup
    const driver = multiDriver([
      jsonDriver({ includeStack: true }),
      file,
    ]);

    return Layer.succeed(
      Logger,
      makeLogger(driver, { ...defaultConfig, level: "info" })
    );
  });

/**
 * Test logger - null driver (no output)
 */
export const testLogger = (): Layer.Layer<Logger> =>
  Layer.succeed(
    Logger,
    makeLogger(nullDriver, { ...defaultConfig, level: "fatal" })
  );

/**
 * Staging logger - JSON output with warning level minimum
 */
export const stagingLogger = (): Layer.Layer<Logger> =>
  Layer.succeed(
    Logger,
    makeLogger(
      filteredDriver(jsonDriver({ includeStack: true }), "warning"),
      { ...defaultConfig, level: "info" }
    )
  );

// ─── Environment-Aware Logger ────────────────────────────────

/**
 * Creates a logger based on the current environment
 */
export const environmentLogger = () =>
  Effect.gen(function* () {
    const env = yield* environment;

    switch (env) {
      case "production":
        return yield* productionLogger();

      case "staging":
        return stagingLogger();

      case "testing":
        return testLogger();

      case "development":
      case "local":
      default:
        return developmentLogger();
    }
  });

// ─── Custom Logger Builder ───────────────────────────────────

export interface LoggerBuilderOptions {
  readonly level?: LogLevel;
  readonly service?: string;
  readonly driver?: "console" | "json" | "pretty" | "null";
  readonly colors?: boolean;
  readonly timestamps?: boolean;
  readonly redactKeys?: readonly string[];
}

/**
 * Build a custom logger layer from options
 */
export const buildLogger = (options: LoggerBuilderOptions = {}): Layer.Layer<Logger> => {
  const {
    level = "info",
    service = "gello",
    driver = "pretty",
    colors = true,
    timestamps = true,
    redactKeys = defaultConfig.redactKeys,
  } = options;

  const selectedDriver = (() => {
    switch (driver) {
      case "console":
        return consoleDriver({ colors, timestamps });
      case "json":
        return jsonDriver({ includeStack: true });
      case "null":
        return nullDriver;
      case "pretty":
      default:
        return prettyDriver({ colors, timestamps, icons: true, multiline: true });
    }
  })();

  const config: LoggerConfig = {
    level,
    service,
    redactKeys,
  };

  return Layer.succeed(Logger, makeLogger(selectedDriver, config));
};

// ─── Quick Logger Access ─────────────────────────────────────

/**
 * Get the logger from context
 */
export const getLogger = Effect.flatMap(Logger, (logger) => Effect.succeed(logger));

/**
 * Log at info level
 */
export const logInfo = (
  message: string,
  context?: Record<string, unknown>
): Effect.Effect<void, never, Logger> =>
  Effect.flatMap(Logger, (logger) => logger.info(message, context));

/**
 * Log at debug level
 */
export const logDebug = (
  message: string,
  context?: Record<string, unknown>
): Effect.Effect<void, never, Logger> =>
  Effect.flatMap(Logger, (logger) => logger.debug(message, context));

/**
 * Log at warning level
 */
export const logWarning = (
  message: string,
  context?: Record<string, unknown>
): Effect.Effect<void, never, Logger> =>
  Effect.flatMap(Logger, (logger) => logger.warning(message, context));

/**
 * Log at error level
 */
export const logError = (
  message: string,
  error?: unknown,
  context?: Record<string, unknown>
): Effect.Effect<void, never, Logger> =>
  Effect.flatMap(Logger, (logger) => logger.error(message, error, context));

/**
 * Create a child logger with additional context
 */
export const withContext = (
  context: Record<string, unknown>
): Effect.Effect<LoggerPort, never, Logger> =>
  Effect.map(Logger, (logger) => logger.child(context));
