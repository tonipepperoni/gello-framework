/**
 * Log Formatter - formats log entries for output
 *
 * Provides multiple formatters: simple, JSON, and pretty
 */

import type { LogEntry, LogFormatterPort } from "@gello/core-contracts";

// ─── ANSI Colors ─────────────────────────────────────────────

export const Colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  // Foreground
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",

  // Background
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
} as const;

export const LevelColors: Record<string, string> = {
  trace: Colors.gray,
  debug: Colors.cyan,
  info: Colors.green,
  warning: Colors.yellow,
  error: Colors.red,
  fatal: `${Colors.bright}${Colors.red}`,
};

export const LevelIcons: Record<string, string> = {
  trace: "◌",
  debug: "◉",
  info: "●",
  warning: "⚠",
  error: "✖",
  fatal: "💀",
};

// ─── Simple Formatter ────────────────────────────────────────

export const simpleFormatter: LogFormatterPort = {
  format: (entry: LogEntry): string => {
    const timestamp = entry.timestamp.toISOString();
    const level = entry.level.toUpperCase().padEnd(7);
    const service = entry.service ? `[${entry.service}] ` : "";
    const requestId = entry.requestId ? `(${entry.requestId}) ` : "";
    const context =
      entry.context && Object.keys(entry.context).length > 0
        ? ` ${JSON.stringify(entry.context)}`
        : "";
    const duration = entry.duration !== undefined ? ` (${entry.duration}ms)` : "";

    return `[${timestamp}] ${level} ${service}${requestId}${entry.message}${duration}${context}`;
  },
};

// ─── JSON Formatter ──────────────────────────────────────────

export interface JsonFormatterOptions {
  pretty?: boolean;
  includeStack?: boolean;
}

export const jsonFormatter = (
  options: JsonFormatterOptions = {}
): LogFormatterPort => ({
  format: (entry: LogEntry): string => {
    const data: Record<string, unknown> = {
      timestamp: entry.timestamp.toISOString(),
      level: entry.level,
      message: entry.message,
    };

    if (entry.service) data["service"] = entry.service;
    if (entry.module) data["module"] = entry.module;
    if (entry.requestId) data["requestId"] = entry.requestId;
    if (entry.duration !== undefined) data["duration"] = entry.duration;
    if (entry.context && Object.keys(entry.context).length > 0) {
      data["context"] = entry.context;
    }
    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      data["metadata"] = entry.metadata;
    }
    if (entry.error) data["error"] = entry.error;
    if (options.includeStack && entry.stack) data["stack"] = entry.stack;

    return options.pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  },
});

// ─── Pretty Formatter ────────────────────────────────────────

export interface PrettyFormatterOptions {
  colors?: boolean;
  icons?: boolean;
  timestamps?: boolean;
  multiline?: boolean;
}

export const prettyFormatter = (
  options: PrettyFormatterOptions = {}
): LogFormatterPort => ({
  format: (entry: LogEntry): string => {
    const {
      colors = true,
      icons = true,
      timestamps = true,
      multiline = false,
    } = options;

    const parts: string[] = [];

    // Timestamp (HH:MM:SS.mmm)
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
        : `${levelIcon} ${levelText}`.trim()
    );

    // Service/module prefix
    if (entry.service || entry.module) {
      const prefix = [entry.service, entry.module].filter(Boolean).join("/");
      parts.push(colors ? `${Colors.magenta}[${prefix}]${Colors.reset}` : `[${prefix}]`);
    }

    // Request ID
    if (entry.requestId) {
      parts.push(
        colors
          ? `${Colors.dim}(${entry.requestId})${Colors.reset}`
          : `(${entry.requestId})`
      );
    }

    // Message
    parts.push(entry.message);

    // Duration
    if (entry.duration !== undefined) {
      const durationText = `${entry.duration}ms`;
      parts.push(colors ? `${Colors.cyan}${durationText}${Colors.reset}` : durationText);
    }

    let result = parts.join(" ");

    // Context
    if (entry.context && Object.keys(entry.context).length > 0) {
      if (multiline) {
        const contextStr = JSON.stringify(entry.context, null, 2);
        const indented = contextStr
          .split("\n")
          .map((line) => `    ${line}`)
          .join("\n");
        result += `\n${colors ? Colors.dim : ""}${indented}${colors ? Colors.reset : ""}`;
      } else {
        const contextStr = JSON.stringify(entry.context);
        result += ` ${colors ? Colors.dim : ""}${contextStr}${colors ? Colors.reset : ""}`;
      }
    }

    // Stack trace
    if (entry.stack) {
      const stackLines = entry.stack
        .split("\n")
        .map((line) => `    ${line}`)
        .join("\n");
      result += `\n${colors ? Colors.red : ""}${stackLines}${colors ? Colors.reset : ""}`;
    }

    return result;
  },
});

// ─── Minimal Formatter (for production JSON logging) ─────────

export const minimalFormatter: LogFormatterPort = {
  format: (entry: LogEntry): string => {
    const data: Record<string, unknown> = {
      t: entry.timestamp.getTime(),
      l: entry.level[0], // First letter: t/d/i/w/e/f
      m: entry.message,
    };

    if (entry.service) data["s"] = entry.service;
    if (entry.requestId) data["r"] = entry.requestId;
    if (entry.duration !== undefined) data["d"] = entry.duration;
    if (entry.context) data["c"] = entry.context;
    if (entry.error) data["e"] = entry.error;

    return JSON.stringify(data);
  },
};
