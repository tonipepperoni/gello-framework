/**
 * Console Driver
 *
 * Outputs log entries to the console with optional colors
 */

import { Effect } from "effect";
import type { LogDriverPort, LogEntry, ConsoleDriverConfig } from "@gello/core-contracts";
import { prettyFormatter } from "@gello/domain-logger";

// ─── Console Method Selection ────────────────────────────────

const consoleMethod = (level: string): typeof console.log => {
  switch (level) {
    case "trace":
      return console.trace;
    case "debug":
      return console.debug;
    case "info":
      return console.info;
    case "warning":
      return console.warn;
    case "error":
    case "fatal":
      return console.error;
    default:
      return console.log;
  }
};

// ─── Console Driver Factory ──────────────────────────────────

export const consoleDriver = (
  config: ConsoleDriverConfig = {}
): LogDriverPort => {
  const {
    colors = true,
    timestamps = true,
    icons = true,
  } = config;

  const formatter = prettyFormatter({
    colors,
    timestamps,
    icons,
    multiline: false,
  });

  return {
    name: "console",

    write: (entry: LogEntry): Effect.Effect<void> =>
      Effect.sync(() => {
        const output = formatter.format(entry);
        consoleMethod(entry.level)(output);
      }),

    flush: (): Effect.Effect<void> => Effect.void,

    close: (): Effect.Effect<void> => Effect.void,
  };
};

// ─── Simple Console Driver (no colors) ───────────────────────

export const simpleConsoleDriver = (): LogDriverPort =>
  consoleDriver({
    colors: false,
    timestamps: true,
    icons: false,
  });
