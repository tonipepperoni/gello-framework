/**
 * JSON Driver
 *
 * Outputs log entries as JSON to stdout (for log aggregators)
 */

import { Effect } from "effect";
import type { LogDriverPort, LogEntry, JsonDriverConfig } from "@gello/core-contracts";
import { jsonFormatter } from "@gello/domain-logger";

// ─── JSON Driver Factory ─────────────────────────────────────

export const jsonDriver = (config: JsonDriverConfig = {}): LogDriverPort => {
  const formatter = jsonFormatter({
    pretty: config.pretty ?? false,
    includeStack: config.includeStack ?? true,
  });

  return {
    name: "json",

    write: (entry: LogEntry): Effect.Effect<void> =>
      Effect.sync(() => {
        const output = formatter.format(entry);
        // Write to stdout for log aggregators
        process.stdout.write(output + "\n");
      }),

    flush: (): Effect.Effect<void> =>
      Effect.async<void>((resume) => {
        process.stdout.write("", () => resume(Effect.void));
      }),

    close: (): Effect.Effect<void> => Effect.void,
  };
};

// ─── NDJSON Driver (newline-delimited JSON) ──────────────────

export const ndjsonDriver = (config: Omit<JsonDriverConfig, "pretty"> = {}): LogDriverPort =>
  jsonDriver({ ...config, pretty: false });

// ─── Pretty JSON Driver (for debugging) ──────────────────────

export const prettyJsonDriver = (config: Omit<JsonDriverConfig, "pretty"> = {}): LogDriverPort =>
  jsonDriver({ ...config, pretty: true });
