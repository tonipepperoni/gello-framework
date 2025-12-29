/**
 * Tagged error types for the core domain
 */

import { Data } from "effect";

// ─── HTTP Errors ──────────────────────────────────────────────
export class HttpError extends Data.TaggedError("HttpError")<{
  readonly status: number;
  readonly message: string;
  readonly code?: string;
  readonly cause?: unknown;
}> {
  // 4xx Client Errors
  static BadRequest = (message: string, code = "BAD_REQUEST") =>
    new HttpError({ status: 400, message, code });

  static Unauthorized = (message = "Unauthorized") =>
    new HttpError({ status: 401, message, code: "UNAUTHORIZED" });

  static Forbidden = (message = "Forbidden") =>
    new HttpError({ status: 403, message, code: "FORBIDDEN" });

  static NotFound = (resource?: string) =>
    new HttpError({
      status: 404,
      message: resource ? `${resource} not found` : "Not Found",
      code: "NOT_FOUND",
    });

  static MethodNotAllowed = (method: string) =>
    new HttpError({
      status: 405,
      message: `Method ${method} not allowed`,
      code: "METHOD_NOT_ALLOWED",
    });

  static Conflict = (message: string) =>
    new HttpError({ status: 409, message, code: "CONFLICT" });

  static UnprocessableEntity = (message: string) =>
    new HttpError({ status: 422, message, code: "UNPROCESSABLE_ENTITY" });

  static TooManyRequests = (retryAfter?: number) =>
    new HttpError({
      status: 429,
      message: retryAfter
        ? `Too many requests. Retry after ${retryAfter} seconds`
        : "Too Many Requests",
      code: "RATE_LIMITED",
    });

  // 5xx Server Errors
  static InternalServerError = (cause?: unknown) =>
    new HttpError({
      status: 500,
      message: "Internal Server Error",
      code: "INTERNAL_ERROR",
      cause,
    });

  static BadGateway = (message = "Bad Gateway") =>
    new HttpError({ status: 502, message, code: "BAD_GATEWAY" });

  static ServiceUnavailable = (message = "Service Unavailable") =>
    new HttpError({ status: 503, message, code: "SERVICE_UNAVAILABLE" });

  static GatewayTimeout = (message = "Gateway Timeout") =>
    new HttpError({ status: 504, message, code: "GATEWAY_TIMEOUT" });
}

// ─── Validation Errors ────────────────────────────────────────
export interface FieldError {
  readonly field: string;
  readonly message: string;
  readonly code: string;
}

export class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly message: string;
  readonly errors: readonly FieldError[];
}> {
  static fromFields = (errors: readonly FieldError[]) =>
    new ValidationError({
      message: "Validation failed",
      errors,
    });

  static single = (field: string, message: string, code = "INVALID") =>
    new ValidationError({
      message: `Validation failed: ${message}`,
      errors: [{ field, message, code }],
    });
}

// ─── Route Errors ─────────────────────────────────────────────
export class RouteNotFoundError extends Data.TaggedError("RouteNotFoundError")<{
  readonly method: string;
  readonly path: string;
}> {}

// ─── Config Errors ────────────────────────────────────────────
export class ConfigError extends Data.TaggedError("ConfigError")<{
  readonly key: string;
  readonly message: string;
}> {
  static missing = (key: string) =>
    new ConfigError({ key, message: `Missing required config: ${key}` });

  static invalid = (key: string, reason: string) =>
    new ConfigError({ key, message: `Invalid config for ${key}: ${reason}` });
}

// ─── Middleware Errors ────────────────────────────────────────
export class MiddlewareError extends Data.TaggedError("MiddlewareError")<{
  readonly middleware: string;
  readonly message: string;
  readonly cause?: unknown;
}> {}
