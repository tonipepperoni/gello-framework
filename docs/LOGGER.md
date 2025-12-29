# Gello Logger - Comprehensive Logging Solution

A fully type-safe, Effect-native logging system following hexagonal DDD architecture with multiple driver support.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Core Concepts](#core-concepts)
- [Contracts (Ports)](#contracts-ports)
- [Domain Logic](#domain-logic)
- [Adapters (Drivers)](#adapters-drivers)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Effect Integration](#effect-integration)
- [Error Formatting](#error-formatting)
- [Testing](#testing)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Application Layer                             │
│   Effect.logInfo() → Effect.logWarning() → Effect.logError()        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Domain Layer (Core)                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────────┐ │
│  │ LoggerPort  │  │ LogFormatter │  │ ErrorFormatter              │ │
│  │ (Contract)  │  │ (Domain)     │  │ (Domain)                    │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Adapters Layer (Drivers)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Console  │  │   File   │  │   JSON   │  │  Pretty  │  │ Multi  ││
│  │ Driver   │  │  Driver  │  │  Driver  │  │  Driver  │  │ Driver ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Core Concepts

### Log Levels

```typescript
// libs/core/contracts/src/logger/LogLevel.ts
import { Data } from "effect";

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
```

### Log Entry Structure

```typescript
// libs/core/contracts/src/logger/LogEntry.ts
import { Schema as S } from "effect";

export const LogEntrySchema = S.Struct({
  timestamp: S.Date,
  level: S.Literal("trace", "debug", "info", "warning", "error", "fatal"),
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

export type LogEntry = S.Schema.Type<typeof LogEntrySchema>;

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
```

---

## Contracts (Ports)

### Logger Port

```typescript
// libs/core/contracts/src/logger/LoggerPort.ts
import { Context, Effect, Layer } from "effect";
import type { LogEntry, LogLevel } from "./LogEntry";

// Core logging operations
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
  readonly flush: () => Effect.Effect<void>;
}

// Context Tag for DI
export class Logger extends Context.Tag("@gello/Logger")<Logger, LoggerPort>() {}

// Logger configuration
export interface LoggerConfig {
  readonly level: LogLevel;
  readonly service?: string;
  readonly defaultContext?: Record<string, unknown>;
  readonly redactKeys?: readonly string[];
  readonly timestampFormat?: "iso" | "unix" | "relative";
}
```

### Log Driver Port

```typescript
// libs/core/contracts/src/logger/LogDriverPort.ts
import { Effect } from "effect";
import type { LogEntry } from "./LogEntry";

// Abstract driver interface - each driver implements this
export interface LogDriverPort {
  readonly name: string;
  readonly write: (entry: LogEntry) => Effect.Effect<void>;
  readonly flush: () => Effect.Effect<void>;
  readonly close: () => Effect.Effect<void>;
}

// Driver factory configuration
export interface DriverConfig {
  readonly console?: ConsoleDriverConfig;
  readonly file?: FileDriverConfig;
  readonly json?: JsonDriverConfig;
  readonly pretty?: PrettyDriverConfig;
}

export interface ConsoleDriverConfig {
  readonly colors?: boolean;
  readonly timestamps?: boolean;
}

export interface FileDriverConfig {
  readonly path: string;
  readonly maxSize?: number;       // bytes, default 10MB
  readonly maxFiles?: number;      // rotation count, default 5
  readonly compress?: boolean;     // gzip old files
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
```

### Log Formatter Port

```typescript
// libs/core/contracts/src/logger/LogFormatterPort.ts
import type { LogEntry } from "./LogEntry";

export interface LogFormatterPort {
  readonly format: (entry: LogEntry) => string;
}

export interface ErrorFormatterPort {
  readonly formatError: (error: unknown) => FormattedError;
  readonly formatStack: (stack: string) => string;
  readonly extractCause: (error: unknown) => unknown | undefined;
}

export interface FormattedError {
  readonly name: string;
  readonly message: string;
  readonly code?: string;
  readonly stack?: string;
  readonly cause?: FormattedError;
  readonly context?: Record<string, unknown>;
}
```

---

## Domain Logic

### Log Formatter

```typescript
// libs/core/domain/logger/src/LogFormatter.ts
import { Effect, Cause, FiberFailure } from "effect";
import type { LogEntry, LogFormatterPort, FormattedError } from "@gello/contracts";

// ANSI color codes
const Colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
} as const;

const LevelColors: Record<string, string> = {
  trace: Colors.gray,
  debug: Colors.cyan,
  info: Colors.green,
  warning: Colors.yellow,
  error: Colors.red,
  fatal: `${Colors.bright}${Colors.red}`,
};

const LevelIcons: Record<string, string> = {
  trace: "◌",
  debug: "◉",
  info: "●",
  warning: "⚠",
  error: "✖",
  fatal: "💀",
};

// Simple formatter - single line output
export const simpleFormatter: LogFormatterPort = {
  format: (entry: LogEntry): string => {
    const timestamp = entry.timestamp.toISOString();
    const level = entry.level.toUpperCase().padEnd(7);
    const context = entry.context ? ` ${JSON.stringify(entry.context)}` : "";
    return `[${timestamp}] ${level} ${entry.message}${context}`;
  },
};

// JSON formatter - structured output
export const jsonFormatter: LogFormatterPort = {
  format: (entry: LogEntry): string => JSON.stringify({
    ...entry,
    timestamp: entry.timestamp.toISOString(),
  }),
};

// Pretty formatter - colorized multi-line output
export const prettyFormatter = (options: {
  colors?: boolean;
  icons?: boolean;
  timestamps?: boolean;
} = {}): LogFormatterPort => ({
  format: (entry: LogEntry): string => {
    const { colors = true, icons = true, timestamps = true } = options;
    const parts: string[] = [];

    // Timestamp
    if (timestamps) {
      const time = entry.timestamp.toISOString().split("T")[1]?.slice(0, 12) ?? "";
      parts.push(colors ? `${Colors.dim}${time}${Colors.reset}` : time);
    }

    // Level with color/icon
    const levelColor = colors ? LevelColors[entry.level] ?? "" : "";
    const levelIcon = icons ? LevelIcons[entry.level] ?? "" : "";
    const levelText = entry.level.toUpperCase().padEnd(7);
    parts.push(
      colors
        ? `${levelColor}${levelIcon} ${levelText}${Colors.reset}`
        : `${levelIcon} ${levelText}`
    );

    // Service/module prefix
    if (entry.service || entry.module) {
      const prefix = [entry.service, entry.module].filter(Boolean).join("/");
      parts.push(colors ? `${Colors.magenta}[${prefix}]${Colors.reset}` : `[${prefix}]`);
    }

    // Request ID
    if (entry.requestId) {
      parts.push(colors ? `${Colors.dim}(${entry.requestId})${Colors.reset}` : `(${entry.requestId})`);
    }

    // Message
    parts.push(entry.message);

    // Duration
    if (entry.duration !== undefined) {
      const durationText = `${entry.duration}ms`;
      parts.push(colors ? `${Colors.cyan}${durationText}${Colors.reset}` : durationText);
    }

    // Context on new line if present
    let result = parts.join(" ");
    if (entry.context && Object.keys(entry.context).length > 0) {
      const contextStr = JSON.stringify(entry.context, null, 2);
      const indented = contextStr.split("\n").map(line => `    ${line}`).join("\n");
      result += `\n${colors ? Colors.dim : ""}${indented}${colors ? Colors.reset : ""}`;
    }

    // Stack trace if present
    if (entry.stack) {
      const stackLines = entry.stack.split("\n").map(line => `    ${line}`).join("\n");
      result += `\n${colors ? Colors.red : ""}${stackLines}${colors ? Colors.reset : ""}`;
    }

    return result;
  },
});
```

### Error Formatter

```typescript
// libs/core/domain/logger/src/ErrorFormatter.ts
import { Cause, FiberFailure, Data } from "effect";
import type { ErrorFormatterPort, FormattedError } from "@gello/contracts";

// Check if value is an Effect tagged error
const isTaggedError = (error: unknown): error is Data.TaggedError<string, Record<string, unknown>> =>
  typeof error === "object" &&
  error !== null &&
  "_tag" in error &&
  typeof (error as { _tag: unknown })._tag === "string";

// Extract error info from Effect Cause
const formatCause = (cause: Cause.Cause<unknown>): FormattedError | undefined => {
  if (Cause.isEmpty(cause)) return undefined;

  if (Cause.isFailType(cause)) {
    return formatUnknownError(cause.error);
  }

  if (Cause.isDieType(cause)) {
    const defect = cause.defect;
    return {
      name: "Defect",
      message: defect instanceof Error ? defect.message : String(defect),
      stack: defect instanceof Error ? defect.stack : undefined,
    };
  }

  if (Cause.isInterruptType(cause)) {
    return {
      name: "Interrupt",
      message: `Fiber interrupted: ${cause.fiberId}`,
    };
  }

  return undefined;
};

// Format any error type into structured object
const formatUnknownError = (error: unknown): FormattedError => {
  // Effect tagged errors (HttpError, ValidationError, etc.)
  if (isTaggedError(error)) {
    const { _tag, ...rest } = error as { _tag: string; message?: string; cause?: unknown };
    return {
      name: _tag,
      message: rest.message ?? String(error),
      code: _tag,
      cause: rest.cause ? formatUnknownError(rest.cause) : undefined,
      context: Object.keys(rest).length > 0 ? rest : undefined,
    };
  }

  // FiberFailure from Effect runtime
  if (error instanceof FiberFailure) {
    const cause = formatCause(error[FiberFailure.symbolId] as Cause.Cause<unknown>);
    return cause ?? {
      name: "FiberFailure",
      message: "Effect fiber failed",
    };
  }

  // Standard Error
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause ? formatUnknownError(error.cause) : undefined,
    };
  }

  // String error
  if (typeof error === "string") {
    return {
      name: "Error",
      message: error,
    };
  }

  // Unknown
  return {
    name: "UnknownError",
    message: JSON.stringify(error),
  };
};

// Clean up stack traces for readability
const formatStackTrace = (stack: string): string => {
  return stack
    .split("\n")
    .filter(line => !line.includes("node_modules"))
    .filter(line => !line.includes("internal/"))
    .map(line => line.trim())
    .join("\n");
};

export const errorFormatter: ErrorFormatterPort = {
  formatError: formatUnknownError,
  formatStack: formatStackTrace,
  extractCause: (error: unknown): unknown | undefined => {
    if (error instanceof Error && error.cause) return error.cause;
    if (isTaggedError(error) && "cause" in error) return (error as { cause?: unknown }).cause;
    return undefined;
  },
};

// Pretty print errors for console output
export const prettyPrintError = (error: unknown, options: {
  colors?: boolean;
  indent?: number;
} = {}): string => {
  const { colors = true, indent = 0 } = options;
  const formatted = formatUnknownError(error);
  const prefix = "  ".repeat(indent);

  const red = colors ? "\x1b[31m" : "";
  const yellow = colors ? "\x1b[33m" : "";
  const dim = colors ? "\x1b[2m" : "";
  const reset = colors ? "\x1b[0m" : "";

  let output = `${prefix}${red}${formatted.name}${reset}: ${formatted.message}`;

  if (formatted.code && formatted.code !== formatted.name) {
    output += ` ${yellow}[${formatted.code}]${reset}`;
  }

  if (formatted.context) {
    output += `\n${prefix}${dim}Context: ${JSON.stringify(formatted.context, null, 2)}${reset}`;
  }

  if (formatted.stack) {
    const cleanStack = formatStackTrace(formatted.stack);
    output += `\n${prefix}${dim}${cleanStack}${reset}`;
  }

  if (formatted.cause) {
    output += `\n${prefix}${dim}Caused by:${reset}`;
    output += `\n${prettyPrintError(formatted.cause, { colors, indent: indent + 1 })}`;
  }

  return output;
};
```

### Logger Implementation

```typescript
// libs/core/domain/logger/src/Logger.ts
import { Effect, Context, Layer, FiberRef, FiberRefs } from "effect";
import type { LoggerPort, LoggerConfig, LogDriverPort, LogEntry, LogLevel } from "@gello/contracts";
import { isLevelEnabled, createLogEntry } from "@gello/contracts";
import { errorFormatter, prettyPrintError } from "./ErrorFormatter";

const makeLogger = (
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
    for (const key of config.redactKeys) {
      if (key in redacted) {
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

  const logAtLevel = (level: LogLevel) => (
    message: string,
    context?: Record<string, unknown>
  ): Effect.Effect<void> =>
    shouldLog(level)
      ? driver.write(createEntry(level, message, context))
      : Effect.void;

  const logError = (level: "error" | "fatal") => (
    message: string,
    error?: unknown,
    context?: Record<string, unknown>
  ): Effect.Effect<void> =>
    shouldLog(level)
      ? driver.write(createEntry(level, message, context, error))
      : Effect.void;

  const self: LoggerPort = {
    log: (entry) => shouldLog(entry.level) ? driver.write(entry) : Effect.void,
    trace: logAtLevel("trace"),
    debug: logAtLevel("debug"),
    info: logAtLevel("info"),
    warning: logAtLevel("warning"),
    error: logError("error"),
    fatal: logError("fatal"),

    child: (context) => makeLogger(driver, config, { ...baseContext, ...context }),

    withRequestId: (requestId) => makeLogger(driver, config, { ...baseContext, requestId }),

    withService: (service) => makeLogger(driver, { ...config, service }, baseContext),

    flush: () => driver.flush(),
  };

  return self;
};

// Layer factory
export const layer = (driver: LogDriverPort, config: LoggerConfig): Layer.Layer<LoggerPort> =>
  Layer.succeed(Logger, makeLogger(driver, config));
```

---

## Adapters (Drivers)

### Console Driver

```typescript
// libs/core/adapters/logger/src/ConsoleDriver.ts
import { Effect } from "effect";
import type { LogDriverPort, LogEntry, ConsoleDriverConfig } from "@gello/contracts";
import { prettyFormatter } from "@gello/domain/logger";

export const consoleDriver = (config: ConsoleDriverConfig = {}): LogDriverPort => {
  const formatter = prettyFormatter({
    colors: config.colors ?? true,
    timestamps: config.timestamps ?? true,
  });

  const consoleMethod = (level: string): typeof console.log => {
    switch (level) {
      case "trace":
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

  return {
    name: "console",

    write: (entry: LogEntry) =>
      Effect.sync(() => {
        const output = formatter.format(entry);
        consoleMethod(entry.level)(output);
      }),

    flush: () => Effect.void,

    close: () => Effect.void,
  };
};
```

### JSON Driver

```typescript
// libs/core/adapters/logger/src/JsonDriver.ts
import { Effect } from "effect";
import type { LogDriverPort, LogEntry, JsonDriverConfig } from "@gello/contracts";

export const jsonDriver = (config: JsonDriverConfig = {}): LogDriverPort => {
  const serialize = (entry: LogEntry): string => {
    const data = {
      ...entry,
      timestamp: entry.timestamp.toISOString(),
      // Omit stack if not configured
      stack: config.includeStack ? entry.stack : undefined,
    };

    return config.pretty
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);
  };

  return {
    name: "json",

    write: (entry: LogEntry) =>
      Effect.sync(() => {
        const output = serialize(entry);
        // Write to stdout for log aggregators
        process.stdout.write(output + "\n");
      }),

    flush: () => Effect.void,

    close: () => Effect.void,
  };
};
```

### File Driver

```typescript
// libs/core/adapters/logger/src/FileDriver.ts
import { Effect, Queue, Fiber, Schedule } from "effect";
import * as fs from "node:fs";
import * as path from "node:path";
import * as zlib from "node:zlib";
import type { LogDriverPort, LogEntry, FileDriverConfig } from "@gello/contracts";
import { jsonFormatter } from "@gello/domain/logger";

export const fileDriver = (config: FileDriverConfig): Effect.Effect<LogDriverPort> =>
  Effect.gen(function* () {
    const {
      path: logPath,
      maxSize = 10 * 1024 * 1024, // 10MB
      maxFiles = 5,
      compress = true,
    } = config;

    // Ensure directory exists
    const dir = path.dirname(logPath);
    yield* Effect.sync(() => fs.mkdirSync(dir, { recursive: true }));

    // Buffer for batching writes
    const buffer = yield* Queue.unbounded<string>();

    // Current file stream
    let stream = fs.createWriteStream(logPath, { flags: "a" });
    let currentSize = yield* Effect.sync(() => {
      try {
        return fs.statSync(logPath).size;
      } catch {
        return 0;
      }
    });

    // Rotate log file
    const rotate = Effect.gen(function* () {
      stream.end();

      // Shift existing files
      for (let i = maxFiles - 1; i >= 1; i--) {
        const oldPath = `${logPath}.${i}${compress ? ".gz" : ""}`;
        const newPath = `${logPath}.${i + 1}${compress ? ".gz" : ""}`;
        yield* Effect.sync(() => {
          if (fs.existsSync(oldPath)) {
            if (i + 1 >= maxFiles) {
              fs.unlinkSync(oldPath);
            } else {
              fs.renameSync(oldPath, newPath);
            }
          }
        });
      }

      // Compress and move current file
      if (compress) {
        yield* Effect.async<void>((resume) => {
          const gzip = zlib.createGzip();
          const source = fs.createReadStream(logPath);
          const destination = fs.createWriteStream(`${logPath}.1.gz`);

          source.pipe(gzip).pipe(destination);
          destination.on("finish", () => {
            fs.unlinkSync(logPath);
            resume(Effect.void);
          });
        });
      } else {
        yield* Effect.sync(() => fs.renameSync(logPath, `${logPath}.1`));
      }

      // Create new file
      stream = fs.createWriteStream(logPath, { flags: "a" });
      currentSize = 0;
    });

    // Flush buffer to file
    const flushBuffer = Effect.gen(function* () {
      const entries = yield* Queue.takeAll(buffer);
      if (entries.length === 0) return;

      const data = entries.join("");
      const dataSize = Buffer.byteLength(data);

      // Check if rotation needed
      if (currentSize + dataSize > maxSize) {
        yield* rotate;
      }

      yield* Effect.async<void>((resume) => {
        stream.write(data, () => resume(Effect.void));
      });

      currentSize += dataSize;
    });

    // Background flush fiber
    const flushFiber = yield* flushBuffer.pipe(
      Effect.schedule(Schedule.spaced("100 millis")),
      Effect.forever,
      Effect.fork
    );

    return {
      name: "file",

      write: (entry: LogEntry) =>
        Effect.gen(function* () {
          const line = jsonFormatter.format(entry) + "\n";
          yield* Queue.offer(buffer, line);
        }),

      flush: () => flushBuffer,

      close: () =>
        Effect.gen(function* () {
          yield* Fiber.interrupt(flushFiber);
          yield* flushBuffer;
          yield* Effect.sync(() => stream.end());
        }),
    };
  });
```

### Pretty Driver (Effect's Pretty Logger)

```typescript
// libs/core/adapters/logger/src/PrettyDriver.ts
import { Effect, Logger as EffectLogger, LogLevel as EffectLogLevel } from "effect";
import type { LogDriverPort, LogEntry, PrettyDriverConfig } from "@gello/contracts";
import { prettyFormatter, prettyPrintError } from "@gello/domain/logger";

// Map our log levels to Effect's
const toEffectLevel = (level: string): EffectLogLevel.LogLevel => {
  switch (level) {
    case "trace": return EffectLogLevel.Trace;
    case "debug": return EffectLogLevel.Debug;
    case "info": return EffectLogLevel.Info;
    case "warning": return EffectLogLevel.Warning;
    case "error": return EffectLogLevel.Error;
    case "fatal": return EffectLogLevel.Fatal;
    default: return EffectLogLevel.Info;
  }
};

export const prettyDriver = (config: PrettyDriverConfig = {}): LogDriverPort => {
  const formatter = prettyFormatter({
    colors: config.colors ?? true,
    icons: config.icons ?? true,
    timestamps: config.timestamps ?? true,
  });

  return {
    name: "pretty",

    write: (entry: LogEntry) =>
      Effect.gen(function* () {
        // Use Effect's built-in logging with annotations
        const logFn = entry.level === "error" || entry.level === "fatal"
          ? Effect.logError
          : entry.level === "warning"
            ? Effect.logWarning
            : entry.level === "debug" || entry.level === "trace"
              ? Effect.logDebug
              : Effect.logInfo;

        yield* logFn(entry.message).pipe(
          Effect.annotateLogs({
            service: entry.service,
            module: entry.module,
            requestId: entry.requestId,
            duration: entry.duration,
            ...entry.context,
          }),
          // Use Effect's pretty logger
          Effect.provide(EffectLogger.pretty)
        );

        // Print error details separately if present
        if (entry.error && config.multiline) {
          const errorOutput = prettyPrintError(entry.error, { colors: config.colors });
          console.error(errorOutput);
        }
      }),

    flush: () => Effect.void,

    close: () => Effect.void,
  };
};
```

### Multi Driver (Composite)

```typescript
// libs/core/adapters/logger/src/MultiDriver.ts
import { Effect } from "effect";
import type { LogDriverPort, LogEntry } from "@gello/contracts";

export const multiDriver = (drivers: readonly LogDriverPort[]): LogDriverPort => ({
  name: `multi(${drivers.map(d => d.name).join(", ")})`,

  write: (entry: LogEntry) =>
    Effect.all(
      drivers.map(driver => driver.write(entry)),
      { concurrency: "unbounded" }
    ).pipe(Effect.asVoid),

  flush: () =>
    Effect.all(
      drivers.map(driver => driver.flush()),
      { concurrency: "unbounded" }
    ).pipe(Effect.asVoid),

  close: () =>
    Effect.all(
      drivers.map(driver => driver.close()),
      { concurrency: "unbounded" }
    ).pipe(Effect.asVoid),
});
```

---

## Configuration

### Logger Configuration Layer

```typescript
// libs/core/config/src/logger.ts
import { Effect, Layer, Config as EffectConfig } from "effect";
import { Config } from "@gello/config";
import { Logger, type LoggerConfig, type LogLevel } from "@gello/contracts";
import { consoleDriver, jsonDriver, fileDriver, prettyDriver, multiDriver } from "@gello/adapters/logger";
import { layer as loggerLayer } from "@gello/domain/logger";

// Default configuration
const defaultConfig: LoggerConfig = {
  level: "info",
  service: "gello",
  redactKeys: ["password", "secret", "token", "apiKey", "authorization"],
  timestampFormat: "iso",
};

// Create logger layer from config
export const createLoggerLayer = (
  overrides: Partial<LoggerConfig> = {}
): Effect.Effect<Layer.Layer<typeof Logger>, never, typeof Config> =>
  Effect.gen(function* () {
    const config = yield* Config;

    // Read configuration
    const level = yield* config.string("logging.level", "info") as Effect.Effect<LogLevel>;
    const service = yield* config.string("app.name", "gello");
    const driver = yield* config.string("logging.driver", "pretty");
    const logPath = yield* config.string("logging.path", "./logs/app.log").pipe(
      Effect.orElseSucceed(() => undefined)
    );

    const loggerConfig: LoggerConfig = {
      ...defaultConfig,
      level,
      service,
      ...overrides,
    };

    // Select driver based on config
    const selectedDriver = yield* Effect.gen(function* () {
      switch (driver) {
        case "console":
          return consoleDriver({ colors: true });

        case "json":
          return jsonDriver({ includeStack: true });

        case "file":
          if (!logPath) {
            return yield* Effect.fail(new Error("logging.path required for file driver"));
          }
          return yield* fileDriver({ path: logPath });

        case "pretty":
        default:
          return prettyDriver({ colors: true, icons: true, multiline: true });
      }
    });

    return loggerLayer(selectedDriver, loggerConfig);
  });

// Environment-based presets
export const developmentLogger = (): Layer.Layer<typeof Logger> =>
  loggerLayer(
    prettyDriver({ colors: true, icons: true, multiline: true }),
    { ...defaultConfig, level: "debug" }
  );

export const productionLogger = (): Effect.Effect<Layer.Layer<typeof Logger>> =>
  Effect.gen(function* () {
    const fileLog = yield* fileDriver({
      path: "./logs/app.log",
      maxSize: 50 * 1024 * 1024, // 50MB
      maxFiles: 10,
      compress: true,
    });

    const driver = multiDriver([
      jsonDriver({ includeStack: true }), // stdout for log aggregators
      fileLog,                             // file backup
    ]);

    return loggerLayer(driver, { ...defaultConfig, level: "info" });
  });

export const testLogger = (): Layer.Layer<typeof Logger> =>
  loggerLayer(
    { name: "null", write: () => Effect.void, flush: () => Effect.void, close: () => Effect.void },
    { ...defaultConfig, level: "fatal" } // Suppress logs in tests
  );
```

---

## Usage Examples

### Basic Logging

```typescript
import { Effect } from "effect";
import { Logger } from "@gello/contracts";

const myHandler = Effect.gen(function* () {
  const logger = yield* Logger;

  yield* logger.info("Processing request");

  yield* logger.debug("Fetching user", { userId: 123 });

  const result = yield* someOperation().pipe(
    Effect.tapError((error) =>
      logger.error("Operation failed", error, { operation: "someOperation" })
    )
  );

  yield* logger.info("Request completed", {
    resultCount: result.length,
    duration: 150,
  });

  return result;
});
```

### Child Loggers

```typescript
import { Effect } from "effect";
import { Logger } from "@gello/contracts";

const userService = Effect.gen(function* () {
  const rootLogger = yield* Logger;

  // Create scoped logger for this service
  const logger = rootLogger.withService("UserService");

  yield* logger.info("Service started");

  // Create request-scoped logger
  const requestId = "req-abc-123";
  const reqLogger = logger.withRequestId(requestId);

  yield* reqLogger.info("Processing user request");

  // Child logger with additional context
  const userLogger = reqLogger.child({ userId: 42, action: "update" });
  yield* userLogger.debug("Updating user profile");

  return { success: true };
});
```

### Middleware Integration

```typescript
// libs/core/domain/middleware/src/loggingMiddleware.ts
import { Effect } from "effect";
import { Logger } from "@gello/contracts";
import type { Middleware } from "@gello/contracts";
import { TimingContext } from "./timing";

export const loggingMiddleware = (): Middleware => ({
  name: "logging",

  apply: <A, E, R>(handler: Effect.Effect<A, E, R>) =>
    Effect.gen(function* () {
      const logger = yield* Logger;
      const timing = yield* TimingContext;
      const requestId = crypto.randomUUID().slice(0, 8);

      // Request-scoped logger
      const reqLogger = logger.withRequestId(requestId);

      yield* reqLogger.info("Request started");

      const result = yield* handler.pipe(
        Effect.tapBoth({
          onSuccess: () =>
            reqLogger.info("Request completed", {
              duration: timing.getElapsedMs(),
            }),
          onFailure: (error) =>
            reqLogger.error("Request failed", error, {
              duration: timing.getElapsedMs(),
            }),
        })
      );

      return result;
    }) as Effect.Effect<A, E, R | typeof Logger | typeof TimingContext>,
});
```

### Error Logging with Full Context

```typescript
import { Effect, Data } from "effect";
import { Logger, HttpError, ValidationError } from "@gello/contracts";

class DatabaseError extends Data.TaggedError("DatabaseError")<{
  readonly query: string;
  readonly message: string;
  readonly cause?: unknown;
}> {}

const processOrder = (orderId: string) =>
  Effect.gen(function* () {
    const logger = yield* Logger;

    yield* logger.info("Processing order", { orderId });

    const order = yield* fetchOrder(orderId).pipe(
      Effect.tapError((error) =>
        logger.error("Failed to fetch order", error, { orderId })
      )
    );

    const validated = yield* validateOrder(order).pipe(
      Effect.tapError((error: ValidationError) =>
        logger.warning("Order validation failed", undefined, {
          orderId,
          errors: error.errors,
        })
      )
    );

    yield* saveOrder(validated).pipe(
      Effect.tapError((error: DatabaseError) =>
        logger.fatal("Critical: Failed to save order", error, {
          orderId,
          query: error.query,
        })
      )
    );

    yield* logger.info("Order processed successfully", { orderId });
  });
```

---

## Effect Integration

### Using Effect's Built-in Logger

```typescript
import { Effect, Logger, LogLevel } from "effect";

// Effect's built-in logging (recommended for simple cases)
const simpleLogging = Effect.gen(function* () {
  yield* Effect.logTrace("Trace message");
  yield* Effect.logDebug("Debug message");
  yield* Effect.logInfo("Info message");
  yield* Effect.logWarning("Warning message");
  yield* Effect.logError("Error message");
  yield* Effect.logFatal("Fatal message");

  // With annotations
  yield* Effect.logInfo("User action").pipe(
    Effect.annotateLogs({
      userId: 123,
      action: "login",
      ip: "192.168.1.1",
    })
  );

  // With spans for timing
  yield* Effect.logInfo("Database query").pipe(
    Effect.withSpan("db.query", { attributes: { table: "users" } })
  );
});

// Configure Effect's logger
const withPrettyLogger = simpleLogging.pipe(
  Effect.provide(Logger.pretty),
  Logger.withMinimumLogLevel(LogLevel.Debug)
);

// Custom Effect logger that uses our driver
const withCustomLogger = (driver: LogDriverPort) =>
  Logger.make<unknown, void>(({ logLevel, message, annotations, date }) => {
    const entry = createLogEntry(
      mapEffectLevel(logLevel),
      String(message),
      {
        context: Object.fromEntries(annotations),
        timestamp: date,
      }
    );
    return driver.write(entry);
  });
```

### Structured Logging with Annotations

```typescript
import { Effect, FiberRef } from "effect";
import { Logger } from "@gello/contracts";

// Create a FiberRef for request context
const RequestContext = FiberRef.unsafeMake<{
  requestId: string;
  userId?: number;
  traceId?: string;
}>({ requestId: "unknown" });

// Middleware to set request context
const withRequestContext = <A, E, R>(
  context: { requestId: string; userId?: number; traceId?: string }
) => (effect: Effect.Effect<A, E, R>): Effect.Effect<A, E, R> =>
  Effect.locally(RequestContext, context)(effect);

// Logger that automatically includes request context
const contextAwareLog = (level: LogLevel, message: string, extra?: Record<string, unknown>) =>
  Effect.gen(function* () {
    const logger = yield* Logger;
    const context = yield* FiberRef.get(RequestContext);

    yield* logger.log({
      timestamp: new Date(),
      level,
      message,
      requestId: context.requestId,
      context: {
        userId: context.userId,
        traceId: context.traceId,
        ...extra,
      },
    });
  });

// Usage in handlers
const handler = Effect.gen(function* () {
  yield* contextAwareLog("info", "Handler started");

  // ... do work

  yield* contextAwareLog("info", "Handler completed", { result: "success" });
}).pipe(
  withRequestContext({
    requestId: "req-123",
    userId: 42,
    traceId: "trace-abc",
  })
);
```

---

## Error Formatting

### Formatting Effect Errors

```typescript
import { Effect, Cause, Exit } from "effect";
import { prettyPrintError, errorFormatter } from "@gello/domain/logger";

// Format any error for logging
const logFormattedError = (error: unknown) =>
  Effect.gen(function* () {
    const logger = yield* Logger;
    const formatted = errorFormatter.formatError(error);

    yield* logger.error(formatted.message, error, {
      errorName: formatted.name,
      errorCode: formatted.code,
    });
  });

// Pretty print for debugging
const debugError = (error: unknown): void => {
  console.error(prettyPrintError(error, { colors: true }));
};

// Handle Effect failures with full error chain
const handleExit = <A, E>(exit: Exit.Exit<A, E>): Effect.Effect<void> =>
  Effect.gen(function* () {
    const logger = yield* Logger;

    if (Exit.isFailure(exit)) {
      const cause = exit.cause;

      // Log based on cause type
      if (Cause.isFailType(cause)) {
        yield* logger.error("Effect failed", cause.error);
      } else if (Cause.isDieType(cause)) {
        yield* logger.fatal("Effect died (defect)", cause.defect);
      } else if (Cause.isInterruptType(cause)) {
        yield* logger.warning("Effect interrupted", undefined, {
          fiberId: String(cause.fiberId),
        });
      }

      // Log full cause for debugging
      yield* logger.debug("Full cause", undefined, {
        cause: Cause.pretty(cause),
      });
    }
  });
```

### Custom Error Types with Logging

```typescript
import { Data, Effect } from "effect";
import { Logger } from "@gello/contracts";

// Domain error with rich context
class OrderError extends Data.TaggedError("OrderError")<{
  readonly code: "NOT_FOUND" | "INVALID_STATUS" | "PAYMENT_FAILED";
  readonly orderId: string;
  readonly message: string;
  readonly cause?: unknown;
}> {
  // Factory methods that automatically log
  static notFound = (orderId: string) =>
    Effect.gen(function* () {
      const logger = yield* Logger;
      const error = new OrderError({
        code: "NOT_FOUND",
        orderId,
        message: `Order ${orderId} not found`,
      });
      yield* logger.warning("Order not found", error, { orderId });
      return yield* Effect.fail(error);
    });

  static invalidStatus = (orderId: string, currentStatus: string, requiredStatus: string) =>
    Effect.gen(function* () {
      const logger = yield* Logger;
      const error = new OrderError({
        code: "INVALID_STATUS",
        orderId,
        message: `Order ${orderId} has status ${currentStatus}, required ${requiredStatus}`,
      });
      yield* logger.error("Invalid order status", error, {
        orderId,
        currentStatus,
        requiredStatus,
      });
      return yield* Effect.fail(error);
    });

  static paymentFailed = (orderId: string, cause: unknown) =>
    Effect.gen(function* () {
      const logger = yield* Logger;
      const error = new OrderError({
        code: "PAYMENT_FAILED",
        orderId,
        message: `Payment failed for order ${orderId}`,
        cause,
      });
      yield* logger.error("Payment processing failed", error, { orderId });
      return yield* Effect.fail(error);
    });
}
```

---

## Testing

### Mock Logger for Tests

```typescript
// libs/testing/mocks/src/MockLogger.ts
import { Effect, Ref } from "effect";
import type { LoggerPort, LogEntry, LogLevel } from "@gello/contracts";
import { Logger } from "@gello/contracts";

export interface MockLoggerState {
  readonly entries: readonly LogEntry[];
  readonly byLevel: Record<LogLevel, readonly LogEntry[]>;
}

export const createMockLogger = () =>
  Effect.gen(function* () {
    const state = yield* Ref.make<MockLoggerState>({
      entries: [],
      byLevel: {
        trace: [],
        debug: [],
        info: [],
        warning: [],
        error: [],
        fatal: [],
      },
    });

    const addEntry = (entry: LogEntry) =>
      Ref.update(state, (s) => ({
        entries: [...s.entries, entry],
        byLevel: {
          ...s.byLevel,
          [entry.level]: [...s.byLevel[entry.level], entry],
        },
      }));

    const makeEntry = (level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry => ({
      timestamp: new Date(),
      level,
      message,
      context,
    });

    const logger: LoggerPort = {
      log: (entry) => addEntry(entry),
      trace: (msg, ctx) => addEntry(makeEntry("trace", msg, ctx)),
      debug: (msg, ctx) => addEntry(makeEntry("debug", msg, ctx)),
      info: (msg, ctx) => addEntry(makeEntry("info", msg, ctx)),
      warning: (msg, ctx) => addEntry(makeEntry("warning", msg, ctx)),
      error: (msg, err, ctx) => addEntry({ ...makeEntry("error", msg, ctx), error: err }),
      fatal: (msg, err, ctx) => addEntry({ ...makeEntry("fatal", msg, ctx), error: err }),
      child: () => logger,
      withRequestId: () => logger,
      withService: () => logger,
      flush: () => Effect.void,
    };

    return {
      logger,
      getState: () => Ref.get(state),
      getEntries: () => Ref.get(state).pipe(Effect.map((s) => s.entries)),
      getByLevel: (level: LogLevel) => Ref.get(state).pipe(Effect.map((s) => s.byLevel[level])),
      hasEntry: (predicate: (entry: LogEntry) => boolean) =>
        Ref.get(state).pipe(Effect.map((s) => s.entries.some(predicate))),
      clear: () => Ref.set(state, { entries: [], byLevel: { trace: [], debug: [], info: [], warning: [], error: [], fatal: [] } }),
    };
  });

// Test helper
export const withMockLogger = <A, E, R>(
  effect: Effect.Effect<A, E, R>
): Effect.Effect<
  { result: A; logs: MockLoggerState },
  E,
  Exclude<R, typeof Logger>
> =>
  Effect.gen(function* () {
    const mock = yield* createMockLogger();
    const result = yield* effect.pipe(
      Effect.provideService(Logger, mock.logger)
    );
    const logs = yield* mock.getState();
    return { result, logs };
  });
```

### Test Examples

```typescript
import { describe, it, expect } from "vitest";
import { Effect } from "effect";
import { withMockLogger } from "@gello/testing/mocks";

describe("UserService", () => {
  it("logs user creation", async () => {
    const createUser = Effect.gen(function* () {
      const logger = yield* Logger;
      yield* logger.info("Creating user", { email: "test@example.com" });
      return { id: 1, email: "test@example.com" };
    });

    const { result, logs } = await Effect.runPromise(
      withMockLogger(createUser)
    );

    expect(result.id).toBe(1);
    expect(logs.byLevel.info).toHaveLength(1);
    expect(logs.byLevel.info[0].message).toBe("Creating user");
    expect(logs.byLevel.info[0].context?.email).toBe("test@example.com");
  });

  it("logs errors on failure", async () => {
    const failingOperation = Effect.gen(function* () {
      const logger = yield* Logger;
      yield* logger.error("Database connection failed", new Error("ECONNREFUSED"));
      return yield* Effect.fail(new Error("Operation failed"));
    });

    const { logs } = await Effect.runPromise(
      withMockLogger(failingOperation).pipe(Effect.either)
    );

    expect(logs.byLevel.error).toHaveLength(1);
    expect(logs.byLevel.error[0].message).toBe("Database connection failed");
  });
});
```

---

## Summary

This logging solution provides:

1. **Hexagonal Architecture**: Clear separation between ports (contracts), domain logic, and adapters (drivers)
2. **Multiple Drivers**: Console, File, JSON, Pretty, and Multi (composite) drivers
3. **Effect Integration**: Native support for Effect's logging, annotations, and spans
4. **Error Formatting**: Comprehensive error formatting for Effect's tagged errors, Cause, and standard errors
5. **Type Safety**: Full TypeScript types throughout
6. **Testing Support**: Mock logger for unit testing with assertion helpers
7. **Configuration**: Environment-based presets and runtime configuration
8. **Middleware Integration**: Request-scoped logging with context propagation

The architecture follows the same patterns as the rest of the Gello framework:
- `Context.Tag` for dependency injection
- `Layer` for service composition
- `Effect.gen` for effectful operations
- Tagged errors for domain-specific failures
