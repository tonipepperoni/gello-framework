/**
 * Shared schemas for HTTP primitives
 */

import * as S from "@effect/schema/Schema";

// ─── HTTP Method ──────────────────────────────────────────────
export const HttpMethod = S.Literal(
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD"
);
export type HttpMethod = S.Schema.Type<typeof HttpMethod>;

// ─── HTTP Status ──────────────────────────────────────────────
export const HttpStatus = S.Number.pipe(S.int(), S.between(100, 599));
export type HttpStatus = S.Schema.Type<typeof HttpStatus>;

// ─── Headers ──────────────────────────────────────────────────
export const Headers = S.Record({ key: S.String, value: S.String });
export type Headers = S.Schema.Type<typeof Headers>;

// ─── Route Definition ─────────────────────────────────────────
export const RouteDefinitionSchema = S.Struct({
  method: HttpMethod,
  path: S.String,
});
export type RouteDefinitionSchema = S.Schema.Type<typeof RouteDefinitionSchema>;

// ─── Job Priority (shared with queue) ─────────────────────────
export const Priority = S.Literal("low", "normal", "high", "critical");
export type Priority = S.Schema.Type<typeof Priority>;

// ─── Pagination ───────────────────────────────────────────────
export const PaginationParams = S.Struct({
  page: S.optionalWith(S.NumberFromString, { default: () => 1 }),
  limit: S.optionalWith(S.NumberFromString, { default: () => 20 }),
});
export type PaginationParams = S.Schema.Type<typeof PaginationParams>;

export const PaginatedResponse = <A, I, R>(itemSchema: S.Schema<A, I, R>) =>
  S.Struct({
    data: S.Array(itemSchema),
    meta: S.Struct({
      page: S.Number,
      limit: S.Number,
      total: S.Number,
      totalPages: S.Number,
    }),
  });

// ─── API Response ─────────────────────────────────────────────
export const ApiResponse = <A, I, R>(dataSchema: S.Schema<A, I, R>) =>
  S.Struct({
    success: S.Boolean,
    data: dataSchema,
  });

export const ApiError = S.Struct({
  success: S.Literal(false),
  error: S.Struct({
    code: S.String,
    message: S.String,
    details: S.optional(S.Unknown),
  }),
});
export type ApiError = S.Schema.Type<typeof ApiError>;
