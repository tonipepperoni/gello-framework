/**
 * Error Formatter - formats errors for logging
 *
 * Handles Effect tagged errors, FiberFailure, Cause, and standard errors
 */

import { Cause } from "effect";
import type { FormattedError, ErrorFormatterPort } from "@gello/core-contracts";

// ─── Type Guards ─────────────────────────────────────────────

const isTaggedError = (
  error: unknown
): error is { _tag: string; [key: string]: unknown } =>
  typeof error === "object" &&
  error !== null &&
  "_tag" in error &&
  typeof (error as { _tag: unknown })._tag === "string";

const isErrorWithCause = (
  error: unknown
): error is { cause?: unknown } =>
  typeof error === "object" && error !== null && "cause" in error;

// ─── Cause Formatting ────────────────────────────────────────

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
      message: `Fiber interrupted: ${String(cause.fiberId)}`,
    };
  }

  // Sequential or parallel causes
  if (Cause.isSequentialType(cause) || Cause.isParallelType(cause)) {
    const left = formatCause(cause.left);
    const right = formatCause(cause.right);
    if (left && right) {
      return {
        name: "MultipleCauses",
        message: `${left.message}; ${right.message}`,
        cause: right,
      };
    }
    return left ?? right;
  }

  return undefined;
};

// ─── Error Formatting ────────────────────────────────────────

export const formatUnknownError = (error: unknown): FormattedError => {
  // Effect tagged errors (HttpError, ValidationError, etc.)
  if (isTaggedError(error)) {
    const { _tag, ...rest } = error as {
      _tag: string;
      message?: string;
      cause?: unknown;
      [key: string]: unknown;
    };

    const context: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rest)) {
      if (key !== "message" && key !== "cause") {
        context[key] = value;
      }
    }

    return {
      name: _tag,
      message: rest.message ?? String(error),
      code: _tag,
      cause: rest.cause ? formatUnknownError(rest.cause) : undefined,
      context: Object.keys(context).length > 0 ? context : undefined,
    };
  }

  // Effect Cause
  if (Cause.isCause(error)) {
    const formatted = formatCause(error);
    return formatted ?? {
      name: "Cause",
      message: Cause.pretty(error),
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

  // Object with message
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return {
      name: "Error",
      message: (error as { message: string }).message,
    };
  }

  // Unknown
  return {
    name: "UnknownError",
    message: String(error),
  };
};

// ─── Stack Trace Formatting ──────────────────────────────────

export const formatStackTrace = (stack: string): string => {
  return stack
    .split("\n")
    .filter((line) => !line.includes("node_modules"))
    .filter((line) => !line.includes("internal/"))
    .filter((line) => !line.includes("node:internal"))
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
};

// ─── Extract Cause ───────────────────────────────────────────

export const extractCause = (error: unknown): unknown | undefined => {
  if (error instanceof Error && error.cause) return error.cause;
  if (isErrorWithCause(error) && error.cause) return error.cause;
  return undefined;
};

// ─── Error Formatter Implementation ──────────────────────────

export const errorFormatter: ErrorFormatterPort = {
  formatError: formatUnknownError,
  formatStack: formatStackTrace,
  extractCause,
};

// ─── Pretty Print Error ──────────────────────────────────────

const Colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
} as const;

export const prettyPrintError = (
  error: unknown,
  options: {
    colors?: boolean;
    indent?: number;
  } = {}
): string => {
  const { colors = true, indent = 0 } = options;
  const formatted = formatUnknownError(error);
  const prefix = "  ".repeat(indent);

  const red = colors ? Colors.red : "";
  const yellow = colors ? Colors.yellow : "";
  const dim = colors ? Colors.dim : "";
  const reset = colors ? Colors.reset : "";

  let output = `${prefix}${red}${formatted.name}${reset}: ${formatted.message}`;

  if (formatted.code && formatted.code !== formatted.name) {
    output += ` ${yellow}[${formatted.code}]${reset}`;
  }

  if (formatted.context && Object.keys(formatted.context).length > 0) {
    const contextStr = JSON.stringify(formatted.context, null, 2)
      .split("\n")
      .map((line) => `${prefix}  ${line}`)
      .join("\n");
    output += `\n${dim}${contextStr}${reset}`;
  }

  if (formatted.stack) {
    const cleanStack = formatStackTrace(formatted.stack)
      .split("\n")
      .map((line) => `${prefix}  ${line}`)
      .join("\n");
    output += `\n${dim}${cleanStack}${reset}`;
  }

  if (formatted.cause) {
    output += `\n${prefix}${dim}Caused by:${reset}`;
    output += `\n${prettyPrintError(formatted.cause, { colors, indent: indent + 1 })}`;
  }

  return output;
};
