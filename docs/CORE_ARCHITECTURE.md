# Core HTTP Architecture (DDD + Hexagonal)

## Overview

The Gello core HTTP system is built using **Domain-Driven Design** and **Hexagonal Architecture** (Ports & Adapters), split into granular sub-libs for optimal **NX caching**.

Built on `@effect/platform` with pure Effect patterns, Gello's HTTP layer is inspired by:
- **Laravel** - Elegant routing DSL, middleware pipeline, service providers
- **Ruby on Rails** - Convention over configuration, sensible defaults
- **NestJS** - Modular architecture, dependency injection, decorators (via services)

Unlike Express or Koa, Gello uses Effect's functional patterns for composable, type-safe HTTP handling with automatic resource management and structured concurrency.

---

## Hexagonal Architecture

```
                    ┌─────────────────────────────────────────────┐
                    │              APPLICATION LAYER              │
                    │                                             │
                    │  ┌─────────────┐     ┌─────────────────┐   │
                    │  │   Router    │     │   Middleware    │   │
                    │  │   Service   │     │    Pipeline     │   │
                    │  └──────┬──────┘     └────────┬────────┘   │
                    │         │                     │             │
                    │         └──────────┬──────────┘             │
                    │                    │                        │
                    │            ┌───────▼───────┐                │
                    │            │  HttpServer   │                │
                    │            │   Service     │                │
                    │            └───────┬───────┘                │
                    └────────────────────┼────────────────────────┘
                                         │
                    ┌────────────────────▼────────────────────────┐
                    │               DOMAIN LAYER                  │
                    │                                             │
                    │  ┌─────────┐  ┌─────────┐  ┌───────────┐   │
                    │  │ Request │  │ Response│  │  Route    │   │
                    │  │  Value  │  │  Value  │  │  Match    │   │
                    │  └─────────┘  └─────────┘  └───────────┘   │
                    │                                             │
                    │  ┌─────────────┐  ┌──────────────────────┐ │
                    │  │   Errors    │  │   Middleware Chain   │ │
                    │  └─────────────┘  └──────────────────────┘ │
                    │                                             │
                    └───────────────────┬─────────────────────────┘
                                        │
                              ┌─────────▼─────────┐
                              │      PORTS        │
                              │   (Interfaces)    │
                              └─────────┬─────────┘
                                        │
          ┌─────────────────────────────┼─────────────────────────┐
          │                             │                         │
    ┌─────▼─────┐               ┌───────▼───────┐         ┌───────▼───────┐
    │  Node.js  │               │     Bun       │         │    Config     │
    │  Adapter  │               │   Adapter     │         │   Adapter     │
    └───────────┘               └───────────────┘         └───────────────┘
          │                             │                         │
    ┌─────▼─────┐               ┌───────▼───────┐         ┌───────▼───────┐
    │ @effect/  │               │   Bun.serve   │         │  Environment  │
    │ platform  │               │     API       │         │   Variables   │
    │   -node   │               │               │         │               │
    └───────────┘               └───────────────┘         └───────────────┘
```

---

## NX Library Structure (Granular Sub-Libs)

```
libs/core/
├── contracts/           # Ports & shared types (zero deps)
│   └── src/*.test.ts
├── domain/              # Core domain logic
│   ├── errors/          # Tagged error types
│   │   └── src/*.test.ts
│   ├── routing/         # Route matching & path parsing
│   │   └── src/*.test.ts
│   └── middleware/      # Middleware chain logic
│       └── src/*.test.ts
├── http/                # HttpServer service
│   └── src/*.test.ts
├── router/              # Router service & composition
│   └── src/*.test.ts
├── validation/          # Request/response validation
│   └── src/*.test.ts
├── config/              # Configuration service
│   └── src/*.test.ts
├── adapters/            # Infrastructure adapters
│   ├── node/            # Node.js adapter
│   │   └── src/*.test.ts
│   └── bun/             # Bun adapter (future)
│       └── src/*.test.ts
└── testing/             # Test utilities for CONSUMERS
    └── src/             # TestServer, TestClient, fixtures
```

---

## Library Dependencies (NX Graph)

```
core-contracts (no deps)
       ↓
core-domain-errors ← core-domain-routing ← core-domain-middleware
       ↓                    ↓                      ↓
       └────────────────────┼──────────────────────┘
                            ↓
              ┌─────────────┼─────────────┐
              ↓             ↓             ↓
        core-http     core-router   core-validation
              │             │             │
              └─────────────┼─────────────┘
                            ↓
                      core-config
                            ↓
              ┌─────────────┼─────────────┐
              ↓             ↓             ↓
        adapter-node   adapter-bun   core-testing
```

---

## A) Architecture & Contracts (Ports)

### `libs/core/contracts/`

**Purpose:** Zero-dependency types, schemas, and interfaces (ports).

```typescript
// libs/core/contracts/src/index.ts

import * as S from "@effect/schema/Schema"
import { Effect, Context } from "effect"

// ─── Request/Response Schemas ─────────────────────────────────
export const HttpMethod = S.Literal("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD")
export type HttpMethod = S.Schema.Type<typeof HttpMethod>

export const HttpStatus = S.Number.pipe(S.int(), S.between(100, 599))
export type HttpStatus = S.Schema.Type<typeof HttpStatus>

export const Headers = S.Record({ key: S.String, value: S.String })
export type Headers = S.Schema.Type<typeof Headers>

export const RequestMeta = S.Struct({
  method: HttpMethod,
  url: S.String,
  path: S.String,
  query: S.Record({ key: S.String, value: S.String }),
  headers: Headers,
  params: S.Record({ key: S.String, value: S.String }),
})
export type RequestMeta = S.Schema.Type<typeof RequestMeta>

// ─── Port Interfaces ──────────────────────────────────────────
export interface HttpServerPort {
  readonly serve: <E, R>(
    app: Effect.Effect<Response, E, R>
  ) => Effect.Effect<void, E, R>
  readonly shutdown: () => Effect.Effect<void>
}

export interface RouterPort<R = never> {
  readonly handle: (request: Request) => Effect.Effect<Response, HttpError, R>
  readonly routes: readonly RouteDefinition[]
}

export interface MiddlewarePort {
  readonly apply: <A, E, R>(
    handler: Effect.Effect<A, E, R>
  ) => Effect.Effect<A, E, R>
}

export interface ConfigPort {
  readonly get: <A>(key: string, schema: S.Schema<A>) => Effect.Effect<A, ConfigError>
  readonly getOptional: <A>(key: string, schema: S.Schema<A>, defaultValue: A) => Effect.Effect<A>
}

// ─── Route Definition ─────────────────────────────────────────
export interface RouteDefinition<R = never> {
  readonly method: HttpMethod
  readonly path: string
  readonly handler: Effect.Effect<Response, HttpError, R>
  readonly middleware?: readonly MiddlewarePort[]
}

// ─── Error Types ──────────────────────────────────────────────
export class HttpError extends Data.TaggedError("HttpError")<{
  readonly status: number
  readonly message: string
  readonly cause?: unknown
}> {
  static NotFound = (message = "Not Found") =>
    new HttpError({ status: 404, message })
  static BadRequest = (message: string) =>
    new HttpError({ status: 400, message })
  static Unauthorized = (message = "Unauthorized") =>
    new HttpError({ status: 401, message })
  static Forbidden = (message = "Forbidden") =>
    new HttpError({ status: 403, message })
  static InternalServerError = (cause?: unknown) =>
    new HttpError({ status: 500, message: "Internal Server Error", cause })
}

export class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly message: string
  readonly errors: readonly FieldError[]
}> {}

export interface FieldError {
  readonly field: string
  readonly message: string
  readonly code: string
}

export class ConfigError extends Data.TaggedError("ConfigError")<{
  readonly key: string
  readonly message: string
}> {}
```

**NX Config:**
```json
{
  "name": "@gello/core-contracts",
  "tags": ["core", "type:lib", "layer:contracts"],
  "implicitDependencies": []
}
```

---

## B) Domain Layer

### `libs/core/domain/errors/`

Tagged error types with factory methods.

```typescript
// libs/core/domain/errors/src/index.ts

import { Data } from "effect"

export class HttpError extends Data.TaggedError("HttpError")<{
  readonly status: number
  readonly message: string
  readonly code?: string
  readonly cause?: unknown
}> {
  // Factory methods for common errors
  static NotFound = (resource?: string) =>
    new HttpError({
      status: 404,
      message: resource ? `${resource} not found` : "Not Found",
      code: "NOT_FOUND",
    })

  static BadRequest = (message: string, code = "BAD_REQUEST") =>
    new HttpError({ status: 400, message, code })

  static Unauthorized = (message = "Unauthorized") =>
    new HttpError({ status: 401, message, code: "UNAUTHORIZED" })

  static Forbidden = (message = "Forbidden") =>
    new HttpError({ status: 403, message, code: "FORBIDDEN" })

  static Conflict = (message: string) =>
    new HttpError({ status: 409, message, code: "CONFLICT" })

  static UnprocessableEntity = (message: string) =>
    new HttpError({ status: 422, message, code: "UNPROCESSABLE_ENTITY" })

  static TooManyRequests = (retryAfter?: number) =>
    new HttpError({
      status: 429,
      message: "Too Many Requests",
      code: "RATE_LIMITED",
    })

  static InternalServerError = (cause?: unknown) =>
    new HttpError({
      status: 500,
      message: "Internal Server Error",
      code: "INTERNAL_ERROR",
      cause,
    })

  static ServiceUnavailable = (message = "Service Unavailable") =>
    new HttpError({ status: 503, message, code: "SERVICE_UNAVAILABLE" })
}

export class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly message: string
  readonly errors: readonly FieldError[]
}> {
  static fromSchemaError = (error: ParseError): ValidationError =>
    new ValidationError({
      message: "Validation failed",
      errors: extractFieldErrors(error),
    })
}

export interface FieldError {
  readonly field: string
  readonly message: string
  readonly code: string
}

export class RouteNotFoundError extends Data.TaggedError("RouteNotFoundError")<{
  readonly method: string
  readonly path: string
}> {}

export class MiddlewareError extends Data.TaggedError("MiddlewareError")<{
  readonly middleware: string
  readonly message: string
  readonly cause?: unknown
}> {}
```

### `libs/core/domain/routing/`

Route matching algorithm and path parameter extraction.

```typescript
// libs/core/domain/routing/src/index.ts

import { Effect, Option } from "effect"
import type { HttpMethod, RouteDefinition } from "@gello/core-contracts"

// ─── Path Pattern ─────────────────────────────────────────────
export interface PathPattern {
  readonly segments: readonly PathSegment[]
  readonly regex: RegExp
  readonly paramNames: readonly string[]
}

export type PathSegment =
  | { readonly _tag: "Literal"; readonly value: string }
  | { readonly _tag: "Param"; readonly name: string }
  | { readonly _tag: "Wildcard" }

export const parsePath = (path: string): PathPattern => {
  const segments: PathSegment[] = []
  const paramNames: string[] = []
  let regexStr = "^"

  const parts = path.split("/").filter(Boolean)

  for (const part of parts) {
    if (part.startsWith(":")) {
      const name = part.slice(1)
      segments.push({ _tag: "Param", name })
      paramNames.push(name)
      regexStr += "/([^/]+)"
    } else if (part === "*") {
      segments.push({ _tag: "Wildcard" })
      regexStr += "/(.*)"
    } else {
      segments.push({ _tag: "Literal", value: part })
      regexStr += `/${escapeRegex(part)}`
    }
  }

  regexStr += "/?$"

  return {
    segments,
    regex: new RegExp(regexStr),
    paramNames,
  }
}

// ─── Route Matching ───────────────────────────────────────────
export interface RouteMatch<R> {
  readonly route: RouteDefinition<R>
  readonly params: Record<string, string>
}

export const matchRoute = <R>(
  routes: readonly RouteDefinition<R>[],
  method: HttpMethod,
  path: string
): Option.Option<RouteMatch<R>> => {
  for (const route of routes) {
    if (route.method !== method) continue

    const pattern = parsePath(route.path)
    const match = pattern.regex.exec(path)

    if (match) {
      const params: Record<string, string> = {}
      pattern.paramNames.forEach((name, i) => {
        params[name] = match[i + 1]
      })
      return Option.some({ route, params })
    }
  }

  return Option.none()
}

// ─── Route Params Context ─────────────────────────────────────
export class RouteParams extends Context.Tag("RouteParams")<
  RouteParams,
  Record<string, string>
>() {}

export const getParam = (name: string) =>
  Effect.gen(function* () {
    const params = yield* RouteParams
    const value = params[name]
    if (!value) {
      return yield* Effect.fail(
        HttpError.BadRequest(`Missing route parameter: ${name}`)
      )
    }
    return value
  })

export const getParamAs = <A>(name: string, schema: S.Schema<A>) =>
  Effect.gen(function* () {
    const value = yield* getParam(name)
    return yield* S.decode(schema)(value).pipe(
      Effect.mapError(() =>
        HttpError.BadRequest(`Invalid route parameter: ${name}`)
      )
    )
  })

// ─── Query Params ─────────────────────────────────────────────
export class QueryParams extends Context.Tag("QueryParams")<
  QueryParams,
  URLSearchParams
>() {}

export const getQuery = (name: string) =>
  Effect.gen(function* () {
    const params = yield* QueryParams
    return Option.fromNullable(params.get(name))
  })

export const getQueryAs = <A>(name: string, schema: S.Schema<A>) =>
  Effect.gen(function* () {
    const params = yield* QueryParams
    const value = params.get(name)
    if (!value) return Option.none()
    return yield* S.decode(schema)(value).pipe(
      Effect.map(Option.some),
      Effect.mapError(() =>
        HttpError.BadRequest(`Invalid query parameter: ${name}`)
      )
    )
  })
```

### `libs/core/domain/middleware/`

Middleware chain composition.

```typescript
// libs/core/domain/middleware/src/index.ts

import { Effect, pipe } from "effect"
import type { MiddlewarePort, HttpError } from "@gello/core-contracts"

// ─── Middleware Definition ────────────────────────────────────
export interface Middleware<R = never, E = never> {
  readonly name: string
  readonly apply: <A, E2, R2>(
    handler: Effect.Effect<A, E2, R2>
  ) => Effect.Effect<A, E | E2, R | R2>
}

// ─── Middleware Composition ───────────────────────────────────
export const compose = <R1, E1, R2, E2>(
  first: Middleware<R1, E1>,
  second: Middleware<R2, E2>
): Middleware<R1 | R2, E1 | E2> => ({
  name: `${first.name} -> ${second.name}`,
  apply: (handler) => first.apply(second.apply(handler)),
})

export const composeAll = <R, E>(
  middlewares: readonly Middleware<R, E>[]
): Middleware<R, E> => {
  if (middlewares.length === 0) {
    return { name: "identity", apply: (handler) => handler }
  }
  return middlewares.reduce((acc, m) => compose(acc, m))
}

// ─── Built-in Middleware ──────────────────────────────────────
export const logging = (logger?: (msg: string) => void): Middleware => ({
  name: "logging",
  apply: (handler) =>
    Effect.gen(function* () {
      const start = Date.now()
      const request = yield* HttpServerRequest.HttpServerRequest
      const method = request.method
      const url = request.url

      yield* Effect.sync(() => logger?.(`--> ${method} ${url}`))

      const result = yield* handler

      const duration = Date.now() - start
      yield* Effect.sync(() => logger?.(`<-- ${method} ${url} ${duration}ms`))

      return result
    }),
})

export const timing: Middleware = {
  name: "timing",
  apply: (handler) =>
    Effect.gen(function* () {
      const start = Date.now()
      const result = yield* handler
      const duration = Date.now() - start

      // Add X-Response-Time header
      return yield* Effect.succeed(result).pipe(
        Effect.tap(() =>
          Effect.annotateCurrentSpan("http.response_time_ms", duration)
        )
      )
    }),
}

export const cors = (options: CorsOptions = {}): Middleware => ({
  name: "cors",
  apply: (handler) =>
    Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest

      // Handle preflight
      if (request.method === "OPTIONS") {
        return yield* HttpServerResponse.empty({ status: 204 }).pipe(
          HttpServerResponse.setHeaders({
            "Access-Control-Allow-Origin": options.origin ?? "*",
            "Access-Control-Allow-Methods": options.methods?.join(", ") ?? "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": options.headers?.join(", ") ?? "Content-Type, Authorization",
            "Access-Control-Max-Age": String(options.maxAge ?? 86400),
          })
        )
      }

      const response = yield* handler

      return response // Headers added by response middleware
    }),
})

export interface CorsOptions {
  readonly origin?: string
  readonly methods?: readonly string[]
  readonly headers?: readonly string[]
  readonly maxAge?: number
}

export const errorHandler: Middleware = {
  name: "errorHandler",
  apply: (handler) =>
    handler.pipe(
      Effect.catchTag("HttpError", (error) =>
        HttpServerResponse.json(
          { error: error.message, code: error.code },
          { status: error.status }
        )
      ),
      Effect.catchTag("ValidationError", (error) =>
        HttpServerResponse.json(
          { error: error.message, errors: error.errors },
          { status: 400 }
        )
      ),
      Effect.catchAll((error) =>
        Effect.gen(function* () {
          yield* Effect.logError("Unhandled error", error)
          return yield* HttpServerResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
          )
        })
      )
    ),
}
```

---

## C) Application Layer

### `libs/core/http/`

HttpServer service wrapping @effect/platform.

```typescript
// libs/core/http/src/index.ts

import { Context, Effect, Layer } from "effect"
import * as HttpServer from "@effect/platform/HttpServer"
import * as HttpServerResponse from "@effect/platform/HttpServerResponse"
import type { RouterPort } from "@gello/core-contracts"

// ─── HttpServer Service ───────────────────────────────────────
export class GelloHttpServer extends Context.Tag("GelloHttpServer")<
  GelloHttpServer,
  {
    readonly serve: () => Effect.Effect<void, never, never>
    readonly isRunning: () => Effect.Effect<boolean>
  }
>() {}

export const GelloHttpServerLive = Layer.scoped(
  GelloHttpServer,
  Effect.gen(function* () {
    const router = yield* Router
    const config = yield* ServerConfig
    const middleware = yield* GlobalMiddleware

    const running = yield* Ref.make(false)

    const app = middleware.apply(router.handle)

    yield* Effect.addFinalizer(() =>
      Effect.gen(function* () {
        yield* Ref.set(running, false)
        yield* Effect.log("HTTP server shutting down...")
      })
    )

    return {
      serve: () =>
        Effect.gen(function* () {
          yield* Ref.set(running, true)
          yield* Effect.log(`HTTP server listening on port ${config.port}`)
          yield* HttpServer.serve(app)
        }),

      isRunning: () => Ref.get(running),
    }
  })
)

// ─── Server Config ────────────────────────────────────────────
export class ServerConfig extends Context.Tag("ServerConfig")<
  ServerConfig,
  {
    readonly port: number
    readonly host: string
    readonly shutdownTimeout: Duration
  }
>() {}

export const ServerConfigLive = (config: {
  port?: number
  host?: string
  shutdownTimeout?: Duration
}) =>
  Layer.succeed(ServerConfig, {
    port: config.port ?? 3000,
    host: config.host ?? "0.0.0.0",
    shutdownTimeout: config.shutdownTimeout ?? Duration.seconds(30),
  })

// ─── Global Middleware ────────────────────────────────────────
export class GlobalMiddleware extends Context.Tag("GlobalMiddleware")<
  GlobalMiddleware,
  Middleware
>() {}

export const GlobalMiddlewareLive = (middlewares: readonly Middleware[]) =>
  Layer.succeed(GlobalMiddleware, composeAll(middlewares))

export const DefaultMiddleware = GlobalMiddlewareLive([
  logging(),
  timing,
  errorHandler,
])
```

### `libs/core/router/`

Router service with fluent API.

```typescript
// libs/core/router/src/index.ts

import { Context, Effect, Layer, pipe } from "effect"
import * as HttpServerRequest from "@effect/platform/HttpServerRequest"
import * as HttpServerResponse from "@effect/platform/HttpServerResponse"
import type { HttpMethod, RouteDefinition, HttpError } from "@gello/core-contracts"
import { matchRoute, RouteParams, QueryParams } from "@gello/core-domain-routing"

// ─── Router Service ───────────────────────────────────────────
export class Router extends Context.Tag("Router")<
  Router,
  {
    readonly handle: (
      request: HttpServerRequest.HttpServerRequest
    ) => Effect.Effect<HttpServerResponse.HttpServerResponse, HttpError>
    readonly routes: readonly RouteDefinition[]
  }
>() {}

// ─── Router Builder ───────────────────────────────────────────
export interface RouterBuilder<R = never> {
  readonly routes: readonly RouteDefinition<R>[]
  readonly prefix: string

  readonly get: <R2>(
    path: string,
    handler: Effect.Effect<HttpServerResponse.HttpServerResponse, HttpError, R2>
  ) => RouterBuilder<R | R2>

  readonly post: <R2>(
    path: string,
    handler: Effect.Effect<HttpServerResponse.HttpServerResponse, HttpError, R2>
  ) => RouterBuilder<R | R2>

  readonly put: <R2>(
    path: string,
    handler: Effect.Effect<HttpServerResponse.HttpServerResponse, HttpError, R2>
  ) => RouterBuilder<R | R2>

  readonly patch: <R2>(
    path: string,
    handler: Effect.Effect<HttpServerResponse.HttpServerResponse, HttpError, R2>
  ) => RouterBuilder<R | R2>

  readonly delete: <R2>(
    path: string,
    handler: Effect.Effect<HttpServerResponse.HttpServerResponse, HttpError, R2>
  ) => RouterBuilder<R | R2>

  readonly group: (prefix: string, builder: RouterBuilder<R>) => RouterBuilder<R>

  readonly use: (middleware: Middleware) => RouterBuilder<R>

  readonly build: () => Router
}

export const createRouter = <R = never>(prefix = ""): RouterBuilder<R> => {
  const routes: RouteDefinition<R>[] = []
  const middlewares: Middleware[] = []

  const addRoute = <R2>(
    method: HttpMethod,
    path: string,
    handler: Effect.Effect<HttpServerResponse.HttpServerResponse, HttpError, R2>
  ): RouterBuilder<R | R2> => {
    routes.push({
      method,
      path: prefix + path,
      handler: handler as any,
      middleware: [...middlewares],
    })
    return builder as RouterBuilder<R | R2>
  }

  const builder: RouterBuilder<R> = {
    routes,
    prefix,

    get: (path, handler) => addRoute("GET", path, handler),
    post: (path, handler) => addRoute("POST", path, handler),
    put: (path, handler) => addRoute("PUT", path, handler),
    patch: (path, handler) => addRoute("PATCH", path, handler),
    delete: (path, handler) => addRoute("DELETE", path, handler),

    group: (groupPrefix, groupBuilder) => {
      for (const route of groupBuilder.routes) {
        routes.push({
          ...route,
          path: prefix + groupPrefix + route.path,
        })
      }
      return builder
    },

    use: (middleware) => {
      middlewares.push(middleware)
      return builder
    },

    build: () => ({
      routes,
      handle: (request) =>
        Effect.gen(function* () {
          const url = new URL(request.url, "http://localhost")
          const method = request.method as HttpMethod
          const path = url.pathname

          const match = matchRoute(routes, method, path)

          if (Option.isNone(match)) {
            return yield* Effect.fail(HttpError.NotFound())
          }

          const { route, params } = match.value

          // Apply route-specific middleware
          const middlewareChain = composeAll(route.middleware ?? [])

          return yield* middlewareChain.apply(route.handler).pipe(
            Effect.provideService(RouteParams, params),
            Effect.provideService(QueryParams, url.searchParams)
          )
        }),
    }),
  }

  return builder
}

// ─── Response Helpers ─────────────────────────────────────────
export const json = <A>(data: A, options?: { status?: number }) =>
  HttpServerResponse.json(data, { status: options?.status ?? 200 })

export const text = (body: string, options?: { status?: number }) =>
  HttpServerResponse.text(body, { status: options?.status ?? 200 })

export const empty = (options?: { status?: number }) =>
  HttpServerResponse.empty({ status: options?.status ?? 204 })

export const redirect = (location: string, status: 301 | 302 | 307 | 308 = 302) =>
  HttpServerResponse.empty({ status }).pipe(
    HttpServerResponse.setHeader("Location", location)
  )
```

### `libs/core/validation/`

Request body and schema validation.

```typescript
// libs/core/validation/src/index.ts

import { Effect } from "effect"
import * as S from "@effect/schema/Schema"
import * as HttpServerRequest from "@effect/platform/HttpServerRequest"
import { ValidationError, HttpError } from "@gello/core-domain-errors"

// ─── Body Validation ──────────────────────────────────────────
export const validateBody = <A>(schema: S.Schema<A>) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest
    const body = yield* request.json.pipe(
      Effect.catchAll(() =>
        Effect.fail(HttpError.BadRequest("Invalid JSON body"))
      )
    )

    return yield* S.decodeUnknown(schema)(body).pipe(
      Effect.mapError((error) => ValidationError.fromSchemaError(error))
    )
  })

export const validateBodyJson = <A>(schema: S.Schema<A>) =>
  HttpServerRequest.schemaBodyJson(schema).pipe(
    Effect.mapError((error) => ValidationError.fromSchemaError(error))
  )

// ─── Query Validation ─────────────────────────────────────────
export const validateQuery = <A>(schema: S.Schema<A>) =>
  Effect.gen(function* () {
    const params = yield* QueryParams
    const obj: Record<string, string> = {}
    params.forEach((value, key) => {
      obj[key] = value
    })

    return yield* S.decodeUnknown(schema)(obj).pipe(
      Effect.mapError((error) => ValidationError.fromSchemaError(error))
    )
  })

// ─── Path Params Validation ───────────────────────────────────
export const validateParams = <A>(schema: S.Schema<A>) =>
  Effect.gen(function* () {
    const params = yield* RouteParams

    return yield* S.decodeUnknown(schema)(params).pipe(
      Effect.mapError((error) => ValidationError.fromSchemaError(error))
    )
  })

// ─── Combined Validation ──────────────────────────────────────
export interface RequestData<P, Q, B> {
  readonly params: P
  readonly query: Q
  readonly body: B
}

export const validateRequest = <P, Q, B>(schemas: {
  params?: S.Schema<P>
  query?: S.Schema<Q>
  body?: S.Schema<B>
}) =>
  Effect.gen(function* () {
    const params = schemas.params
      ? yield* validateParams(schemas.params)
      : ({} as P)
    const query = schemas.query
      ? yield* validateQuery(schemas.query)
      : ({} as Q)
    const body = schemas.body
      ? yield* validateBody(schemas.body)
      : ({} as B)

    return { params, query, body } as RequestData<P, Q, B>
  })
```

### `libs/core/config/`

Configuration service.

```typescript
// libs/core/config/src/index.ts

import { Context, Effect, Layer, Config } from "effect"
import * as S from "@effect/schema/Schema"
import { ConfigError } from "@gello/core-contracts"

// ─── Config Service ───────────────────────────────────────────
export class ConfigService extends Context.Tag("ConfigService")<
  ConfigService,
  {
    readonly get: <A>(key: string, schema: S.Schema<A>) => Effect.Effect<A, ConfigError>
    readonly getOptional: <A>(
      key: string,
      schema: S.Schema<A>,
      defaultValue: A
    ) => Effect.Effect<A>
    readonly getString: (key: string) => Effect.Effect<string, ConfigError>
    readonly getNumber: (key: string) => Effect.Effect<number, ConfigError>
    readonly getBoolean: (key: string) => Effect.Effect<boolean, ConfigError>
  }
>() {}

export const ConfigServiceLive = Layer.succeed(
  ConfigService,
  {
    get: (key, schema) =>
      Effect.gen(function* () {
        const value = yield* Config.string(key).pipe(
          Effect.mapError(() =>
            new ConfigError({ key, message: `Missing config: ${key}` })
          )
        )
        return yield* S.decodeUnknown(schema)(value).pipe(
          Effect.mapError(() =>
            new ConfigError({ key, message: `Invalid config value for: ${key}` })
          )
        )
      }),

    getOptional: (key, schema, defaultValue) =>
      Effect.gen(function* () {
        const value = yield* Config.string(key).pipe(
          Effect.catchAll(() => Effect.succeed(null))
        )
        if (value === null) return defaultValue
        return yield* S.decodeUnknown(schema)(value).pipe(
          Effect.catchAll(() => Effect.succeed(defaultValue))
        )
      }),

    getString: (key) =>
      Config.string(key).pipe(
        Effect.mapError(() =>
          new ConfigError({ key, message: `Missing config: ${key}` })
        )
      ),

    getNumber: (key) =>
      Config.number(key).pipe(
        Effect.mapError(() =>
          new ConfigError({ key, message: `Missing or invalid number: ${key}` })
        )
      ),

    getBoolean: (key) =>
      Config.boolean(key).pipe(
        Effect.mapError(() =>
          new ConfigError({ key, message: `Missing or invalid boolean: ${key}` })
        )
      ),
  }
)

// ─── App Config Schema ────────────────────────────────────────
export const AppConfigSchema = S.Struct({
  NODE_ENV: S.optional(S.Literal("development", "production", "test")).pipe(
    S.withDefault(() => "development" as const)
  ),
  PORT: S.optional(S.NumberFromString).pipe(S.withDefault(() => 3000)),
  HOST: S.optional(S.String).pipe(S.withDefault(() => "0.0.0.0")),
  LOG_LEVEL: S.optional(S.Literal("debug", "info", "warn", "error")).pipe(
    S.withDefault(() => "info" as const)
  ),
})

export type AppConfig = S.Schema.Type<typeof AppConfigSchema>

export const loadAppConfig = () =>
  Effect.gen(function* () {
    const env = process.env
    return yield* S.decodeUnknown(AppConfigSchema)(env)
  })
```

---

## D) Infrastructure Adapters

### `libs/core/adapters/node/`

Node.js HTTP adapter.

```typescript
// libs/core/adapters/node/src/index.ts

import { Layer, Effect } from "effect"
import * as NodeHttpServer from "@effect/platform-node/NodeHttpServer"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import { createServer } from "node:http"
import type { ServerConfig } from "@gello/core-http"

// ─── Node.js Server Layer ─────────────────────────────────────
export const NodeServerLive = (config: { port: number; host?: string }) =>
  NodeHttpServer.layer(createServer, {
    port: config.port,
    host: config.host ?? "0.0.0.0",
  })

// ─── Main Entry Point ─────────────────────────────────────────
export const runMain = <E, A>(
  program: Effect.Effect<A, E, never>
) => NodeRuntime.runMain(program)

// ─── Composed Layer ───────────────────────────────────────────
export const createNodeApp = (config: {
  port?: number
  host?: string
  router: Layer.Layer<Router>
  middleware?: readonly Middleware[]
}) => {
  const port = config.port ?? 3000
  const host = config.host ?? "0.0.0.0"

  return pipe(
    GelloHttpServerLive,
    Layer.provide(config.router),
    Layer.provide(GlobalMiddlewareLive(config.middleware ?? [errorHandler, logging(), timing])),
    Layer.provide(ServerConfigLive({ port, host })),
    Layer.provide(NodeServerLive({ port, host })),
    Layer.provide(ConfigServiceLive)
  )
}

// ─── Usage Example ────────────────────────────────────────────
// const router = createRouter()
//   .get("/health", json({ status: "ok" }))
//   .get("/users/:id", Effect.gen(function* () {
//     const id = yield* getParam("id")
//     return json({ id })
//   }))
//
// const AppLayer = createNodeApp({
//   port: 3000,
//   router: Layer.succeed(Router, router.build()),
// })
//
// Layer.launch(AppLayer).pipe(runMain)
```

---

## E) Testing Utilities

### `libs/core/testing/`

Test utilities for consumers.

```typescript
// libs/core/testing/src/index.ts

import { Effect, Layer, Ref } from "effect"
import type { Router, GelloHttpServer } from "@gello/core-http"

// ─── Test Server ──────────────────────────────────────────────
export interface TestServer {
  readonly request: (
    method: string,
    path: string,
    options?: RequestOptions
  ) => Effect.Effect<TestResponse>
  readonly get: (path: string, options?: RequestOptions) => Effect.Effect<TestResponse>
  readonly post: (path: string, body?: unknown, options?: RequestOptions) => Effect.Effect<TestResponse>
  readonly put: (path: string, body?: unknown, options?: RequestOptions) => Effect.Effect<TestResponse>
  readonly delete: (path: string, options?: RequestOptions) => Effect.Effect<TestResponse>
}

export interface RequestOptions {
  readonly headers?: Record<string, string>
  readonly query?: Record<string, string>
}

export interface TestResponse {
  readonly status: number
  readonly headers: Record<string, string>
  readonly body: unknown
  readonly text: () => string
  readonly json: <A>() => A
}

export const createTestServer = (router: Router): TestServer => ({
  request: (method, path, options = {}) =>
    Effect.gen(function* () {
      const url = new URL(path, "http://localhost")
      if (options.query) {
        Object.entries(options.query).forEach(([k, v]) =>
          url.searchParams.set(k, v)
        )
      }

      const request = new Request(url.toString(), {
        method,
        headers: options.headers,
      })

      const mockRequest = {
        method,
        url: url.toString(),
        headers: new Headers(options.headers),
        json: Effect.succeed({}),
      } as any

      const response = yield* router.handle(mockRequest).pipe(
        Effect.catchAll((error) =>
          Effect.succeed({
            status: error.status ?? 500,
            body: { error: error.message },
          })
        )
      )

      const body = yield* Effect.tryPromise(() => response.json())

      return {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body,
        text: () => JSON.stringify(body),
        json: <A>() => body as A,
      }
    }),

  get: (path, options) => createTestServer(router).request("GET", path, options),
  post: (path, body, options) =>
    createTestServer(router).request("POST", path, { ...options }),
  put: (path, body, options) =>
    createTestServer(router).request("PUT", path, { ...options }),
  delete: (path, options) =>
    createTestServer(router).request("DELETE", path, options),
})

// ─── Test Layers ──────────────────────────────────────────────
export const TestConfigLayer = Layer.succeed(ConfigService, {
  get: () => Effect.fail(new ConfigError({ key: "test", message: "Not configured" })),
  getOptional: (_, __, defaultValue) => Effect.succeed(defaultValue),
  getString: (key) => Effect.succeed(`test-${key}`),
  getNumber: () => Effect.succeed(0),
  getBoolean: () => Effect.succeed(false),
})

// ─── Assertions ───────────────────────────────────────────────
export const expectStatus = (response: TestResponse, status: number) => {
  if (response.status !== status) {
    throw new Error(`Expected status ${status}, got ${response.status}`)
  }
}

export const expectJson = <A>(response: TestResponse, expected: A) => {
  const actual = response.json<A>()
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    )
  }
}
```

---

## Definition of Done Checklist

### A) Contracts
- [ ] `@gello/core-contracts` published with zero deps
- [ ] All port interfaces defined with Effect types
- [ ] Request/Response schemas with @effect/schema
- [ ] Error types using Data.TaggedError

### B) Domain Layer
- [ ] **errors** - HttpError, ValidationError, RouteNotFoundError
- [ ] **routing** - Path parsing, route matching, params extraction
- [ ] **middleware** - Composition, built-in (cors, logging, timing, errorHandler)

### C) Application Layer
- [ ] **http** - GelloHttpServer service with graceful shutdown
- [ ] **router** - Fluent RouterBuilder API
- [ ] **validation** - validateBody, validateQuery, validateParams
- [ ] **config** - ConfigService with Effect.Config

### D) Infrastructure
- [ ] **adapter-node** - Node.js server with @effect/platform-node
- [ ] **adapter-bun** - (Future) Bun.serve adapter

### E) Testing
- [ ] **testing** - TestServer, TestClient, assertions

### Technical Metrics
- [ ] Test coverage > 80%
- [ ] Server starts in < 1 second
- [ ] Request latency p95 < 5ms
- [ ] Zero `any` types in public APIs

---

## NX Generation Commands

```bash
# Contracts (zero deps)
nx g @nx/js:lib contracts --directory=libs/core --bundler=vite --unitTestRunner=vitest

# Domain libs
nx g @nx/js:lib errors --directory=libs/core/domain --bundler=vite --unitTestRunner=vitest
nx g @nx/js:lib routing --directory=libs/core/domain --bundler=vite --unitTestRunner=vitest
nx g @nx/js:lib middleware --directory=libs/core/domain --bundler=vite --unitTestRunner=vitest

# Application libs
nx g @nx/js:lib http --directory=libs/core --bundler=vite --unitTestRunner=vitest
nx g @nx/js:lib router --directory=libs/core --bundler=vite --unitTestRunner=vitest
nx g @nx/js:lib validation --directory=libs/core --bundler=vite --unitTestRunner=vitest
nx g @nx/js:lib config --directory=libs/core --bundler=vite --unitTestRunner=vitest

# Adapters
nx g @nx/js:lib node --directory=libs/core/adapters --bundler=vite --unitTestRunner=vitest
nx g @nx/js:lib bun --directory=libs/core/adapters --bundler=vite --unitTestRunner=vitest

# Testing utilities
nx g @nx/js:lib testing --directory=libs/core --bundler=vite --unitTestRunner=vitest
```

---

## Path Aliases

```json
{
  "paths": {
    "@gello/core-contracts": ["libs/core/contracts/src/index.ts"],
    "@gello/core-domain-errors": ["libs/core/domain/errors/src/index.ts"],
    "@gello/core-domain-routing": ["libs/core/domain/routing/src/index.ts"],
    "@gello/core-domain-middleware": ["libs/core/domain/middleware/src/index.ts"],
    "@gello/core-http": ["libs/core/http/src/index.ts"],
    "@gello/core-router": ["libs/core/router/src/index.ts"],
    "@gello/core-validation": ["libs/core/validation/src/index.ts"],
    "@gello/core-config": ["libs/core/config/src/index.ts"],
    "@gello/core-adapter-node": ["libs/core/adapters/node/src/index.ts"],
    "@gello/core-adapter-bun": ["libs/core/adapters/bun/src/index.ts"],
    "@gello/core-testing": ["libs/core/testing/src/index.ts"]
  }
}
```
