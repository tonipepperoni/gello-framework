/**
 * Port interfaces (Hexagonal Architecture)
 *
 * These define the contracts between layers.
 * Adapters implement these ports.
 */

import { Effect, Context, Duration } from "effect";
import type * as HttpServerResponse from "@effect/platform/HttpServerResponse";
import type { HttpError, ValidationError, ConfigError } from "./errors.js";
import type { HttpMethod } from "./schemas.js";

// ─── Middleware Port ──────────────────────────────────────────
export interface Middleware<R = never, E = never> {
  readonly name: string;
  readonly apply: <A, E2, R2>(
    handler: Effect.Effect<A, E2, R2>
  ) => Effect.Effect<A, E | E2, R | R2>;
}

// ─── Route Handler ────────────────────────────────────────────
export type RouteHandler<R = never> = Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  HttpError | ValidationError,
  R
>;

// ─── Route Definition ─────────────────────────────────────────
export interface RouteDefinition<R = never> {
  readonly method: HttpMethod;
  readonly path: string;
  readonly handler: RouteHandler<R>;
  readonly middleware?: readonly Middleware[];
}

// ─── Router Port ──────────────────────────────────────────────
export interface RouterPort<R = never> {
  readonly routes: readonly RouteDefinition<R>[];
  readonly handle: (
    request: Request
  ) => Effect.Effect<HttpServerResponse.HttpServerResponse, HttpError, R>;
}

// ─── Server Config ────────────────────────────────────────────
export interface ServerConfig {
  readonly port: number;
  readonly host: string;
  readonly shutdownTimeout: Duration.Duration;
}

// ─── Config Port ──────────────────────────────────────────────
export interface ConfigPort {
  readonly get: <A>(key: string) => Effect.Effect<A, ConfigError>;
  readonly getOptional: <A>(key: string, defaultValue: A) => Effect.Effect<A>;
  readonly getString: (key: string) => Effect.Effect<string, ConfigError>;
  readonly getNumber: (key: string) => Effect.Effect<number, ConfigError>;
  readonly getBoolean: (key: string) => Effect.Effect<boolean, ConfigError>;
}

// ─── Context Tags for Services ────────────────────────────────
// These are the primary service tags used throughout the application

/**
 * Route parameters extracted from the URL path
 * Example: /users/:id -> { id: "123" }
 */
export class RouteParams extends Context.Tag("@gello/RouteParams")<
  RouteParams,
  Record<string, string>
>() {}

/**
 * Query parameters from the URL
 * Example: /users?page=1&limit=10
 */
export class QueryParams extends Context.Tag("@gello/QueryParams")<
  QueryParams,
  URLSearchParams
>() {}

/**
 * Server configuration
 */
export class ServerConfigTag extends Context.Tag("@gello/ServerConfig")<
  ServerConfigTag,
  ServerConfig
>() {}

/**
 * Configuration service
 */
export class ConfigService extends Context.Tag("@gello/ConfigService")<
  ConfigService,
  ConfigPort
>() {}
