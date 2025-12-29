/**
 * File Driver
 *
 * Outputs log entries to a file with:
 * - Size-based rotation
 * - Optional compression of old files
 * - Buffered writes for performance
 */

import { Effect, Queue, Fiber, Schedule, Scope } from "effect";
import * as fs from "node:fs";
import * as path from "node:path";
import * as zlib from "node:zlib";
import { pipeline } from "node:stream/promises";
import type { LogDriverPort, LogEntry, FileDriverConfig } from "@gello/core-contracts";
import { jsonFormatter } from "@gello/domain-logger";

// ─── File Driver State ───────────────────────────────────────

interface FileDriverState {
  stream: fs.WriteStream;
  currentSize: number;
}

// ─── File Driver Factory ─────────────────────────────────────

export const fileDriver = (
  config: FileDriverConfig
): Effect.Effect<LogDriverPort, Error, Scope.Scope> =>
  Effect.gen(function* () {
    const {
      path: logPath,
      maxSize = 10 * 1024 * 1024, // 10MB
      maxFiles = 5,
      compress = true,
    } = config;

    const formatter = jsonFormatter({ includeStack: true });

    // Ensure directory exists
    const dir = path.dirname(logPath);
    yield* Effect.try({
      try: () => fs.mkdirSync(dir, { recursive: true }),
      catch: (error) => new Error(`Failed to create log directory: ${error}`),
    });

    // Get initial file size
    const getFileSize = Effect.sync(() => {
      try {
        return fs.statSync(logPath).size;
      } catch {
        return 0;
      }
    });

    // Create state ref
    const initialSize = yield* getFileSize;
    let state: FileDriverState = {
      stream: fs.createWriteStream(logPath, { flags: "a" }),
      currentSize: initialSize,
    };

    // Buffer for batching writes
    const buffer = yield* Queue.unbounded<string>();

    // Rotate log file
    const rotate = Effect.gen(function* () {
      // Close current stream
      yield* Effect.async<void>((resume) => {
        state.stream.end(() => resume(Effect.void));
      });

      // Shift existing files
      for (let i = maxFiles - 1; i >= 1; i--) {
        const ext = compress ? ".gz" : "";
        const oldPath = `${logPath}.${i}${ext}`;
        const newPath = `${logPath}.${i + 1}${ext}`;

        yield* Effect.try({
          try: () => {
            if (fs.existsSync(oldPath)) {
              if (i + 1 >= maxFiles) {
                fs.unlinkSync(oldPath);
              } else {
                fs.renameSync(oldPath, newPath);
              }
            }
          },
          catch: () => undefined,
        });
      }

      // Compress and move current file
      if (compress && fs.existsSync(logPath)) {
        const gzPath = `${logPath}.1.gz`;
        yield* Effect.tryPromise({
          try: async () => {
            const source = fs.createReadStream(logPath);
            const destination = fs.createWriteStream(gzPath);
            const gzip = zlib.createGzip();
            await pipeline(source, gzip, destination);
            fs.unlinkSync(logPath);
          },
          catch: (error) => new Error(`Failed to compress log file: ${error}`),
        });
      } else if (fs.existsSync(logPath)) {
        yield* Effect.try({
          try: () => fs.renameSync(logPath, `${logPath}.1`),
          catch: (error) => new Error(`Failed to rotate log file: ${error}`),
        });
      }

      // Create new stream
      state = {
        stream: fs.createWriteStream(logPath, { flags: "a" }),
        currentSize: 0,
      };
    });

    // Flush buffer to file
    const flushBuffer = Effect.gen(function* () {
      const entries = yield* Queue.takeAll(buffer);
      if (entries.length === 0) return;

      const data = Array.from(entries).join("");
      const dataSize = Buffer.byteLength(data, "utf8");

      // Check if rotation needed
      if (state.currentSize + dataSize > maxSize) {
        yield* rotate;
      }

      // Write to file
      yield* Effect.async<void>((resume) => {
        state.stream.write(data, (error) => {
          if (error) {
            console.error("Failed to write to log file:", error);
          }
          resume(Effect.void);
        });
      });

      state.currentSize += dataSize;
    });

    // Background flush fiber
    const flushFiber = yield* flushBuffer.pipe(
      Effect.schedule(Schedule.spaced("100 millis")),
      Effect.forever,
      Effect.forkScoped
    );

    // Cleanup on scope close
    yield* Effect.addFinalizer(() =>
      Effect.gen(function* () {
        yield* Fiber.interrupt(flushFiber);
        yield* flushBuffer.pipe(Effect.catchAll(() => Effect.void));
        yield* Effect.async<void>((resume) => {
          state.stream.end(() => resume(Effect.void));
        });
      }).pipe(Effect.orDie)
    );

    return {
      name: "file",

      write: (entry: LogEntry): Effect.Effect<void> =>
        Effect.gen(function* () {
          const line = formatter.format(entry) + "\n";
          yield* Queue.offer(buffer, line);
        }),

      flush: (): Effect.Effect<void> => flushBuffer.pipe(Effect.catchAll(() => Effect.void)),

      close: (): Effect.Effect<void> =>
        Effect.gen(function* () {
          yield* Fiber.interrupt(flushFiber);
          yield* flushBuffer.pipe(Effect.catchAll(() => Effect.void));
          yield* Effect.async<void>((resume) => {
            state.stream.end(() => resume(Effect.void));
          });
        }).pipe(Effect.orDie),
    };
  });

// ─── Simple File Driver (no rotation) ────────────────────────

export const simpleFileDriver = (logPath: string): LogDriverPort => {
  const formatter = jsonFormatter({ includeStack: true });
  const stream = fs.createWriteStream(logPath, { flags: "a" });

  return {
    name: "file-simple",

    write: (entry: LogEntry): Effect.Effect<void> =>
      Effect.async<void>((resume) => {
        const line = formatter.format(entry) + "\n";
        stream.write(line, () => resume(Effect.void));
      }),

    flush: (): Effect.Effect<void> =>
      Effect.async<void>((resume) => {
        stream.write("", () => resume(Effect.void));
      }),

    close: (): Effect.Effect<void> =>
      Effect.async<void>((resume) => {
        stream.end(() => resume(Effect.void));
      }),
  };
};
