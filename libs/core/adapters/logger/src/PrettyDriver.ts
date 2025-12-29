/**
 * Pretty Driver
 *
 * Outputs log entries with Effect's pretty logger integration
 * - Colorized output with icons
 * - Multi-line support for context and errors
 * - Uses Effect's built-in logging annotations
 */

import { Effect, Logger as EffectLogger, LogLevel as EffectLogLevel } from "effect";
import type { LogDriverPort, LogEntry, PrettyDriverConfig, LogLevel } from "@gello/core-contracts";
import { prettyFormatter, prettyPrintError } from "@gello/domain-logger";

// ─── Pretty Driver Factory ───────────────────────────────────

export const prettyDriver = (
  config: PrettyDriverConfig = {}
): LogDriverPort => {
  const {
    colors = true,
    icons = true,
    timestamps = true,
    multiline = true,
  } = config;

  const formatter = prettyFormatter({
    colors,
    icons,
    timestamps,
    multiline,
  });

  return {
    name: "pretty",

    write: (entry: LogEntry): Effect.Effect<void> =>
      Effect.gen(function* () {
        // Format and output the main log line
        const output = formatter.format(entry);
        const method =
          entry.level === "error" || entry.level === "fatal"
            ? console.error
            : entry.level === "warning"
              ? console.warn
              : console.log;

        method(output);

        // Print detailed error if present and multiline is enabled
        if (entry.error && multiline && entry.level === "error") {
          const errorOutput = prettyPrintError(entry.error, { colors });
          console.error(errorOutput);
        }
      }),

    flush: (): Effect.Effect<void> => Effect.void,

    close: (): Effect.Effect<void> => Effect.void,
  };
};

// ─── Effect Logger Integration ───────────────────────────────

/**
 * Creates an Effect Logger that writes to the console with pretty formatting
 */
export const effectPrettyLogger = (
  config: PrettyDriverConfig = {}
): EffectLogger.Logger<unknown, void> => {
  const driver = prettyDriver(config);

  return EffectLogger.make(({ logLevel, message, annotations, date, fiberId }) => {
    const level = mapEffectLevelToLogLevel(logLevel);

    // Build context from annotations
    const context: Record<string, unknown> = {};
    for (const [key, value] of annotations) {
      context[key] = value;
    }

    const entry: LogEntry = {
      timestamp: date,
      level,
      message: String(message),
      context: Object.keys(context).length > 0 ? context : undefined,
      metadata: { fiberId: String(fiberId) },
    };

    // Run synchronously for Effect logger
    Effect.runSync(driver.write(entry));
  });
};

const mapEffectLevelToLogLevel = (level: EffectLogLevel.LogLevel): LogLevel => {
  if (EffectLogLevel.greaterThanEqual(level, EffectLogLevel.Fatal)) return "fatal";
  if (EffectLogLevel.greaterThanEqual(level, EffectLogLevel.Error)) return "error";
  if (EffectLogLevel.greaterThanEqual(level, EffectLogLevel.Warning)) return "warning";
  if (EffectLogLevel.greaterThanEqual(level, EffectLogLevel.Info)) return "info";
  if (EffectLogLevel.greaterThanEqual(level, EffectLogLevel.Debug)) return "debug";
  return "trace";
};

// ─── Effect Pretty Logger Layer ──────────────────────────────

export const effectPrettyLoggerLayer = (config: PrettyDriverConfig = {}) =>
  EffectLogger.replace(EffectLogger.defaultLogger, effectPrettyLogger(config));
