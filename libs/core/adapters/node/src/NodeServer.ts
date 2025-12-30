/**
 * Node.js HTTP Server adapter using @effect/platform-node.
 *
 * This is the main entry point for running Gello applications on Node.js.
 */
import { Effect, Layer } from 'effect';
import { HttpServer, HttpServerRequest, HttpServerResponse, HttpBody } from '@effect/platform';
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node';
import * as Http from 'node:http';
import { HttpError, RouteParams, QueryParams } from '@gello/core-contracts';
import type { Middleware } from '@gello/core-domain-middleware';
import { composeAll, errorHandler, timing, logging } from '@gello/core-domain-middleware';
import { parsePath, matchPath, extractPath } from '@gello/core-domain-routing';

/**
 * Gello application configuration.
 */
export interface GelloAppConfig {
  readonly name?: string;
  readonly port?: number;
  readonly host?: string;
  readonly logging?: boolean;
  readonly timing?: boolean;
  readonly middleware?: readonly Middleware[];
}

/**
 * Default application configuration.
 */
export const defaultAppConfig: Required<GelloAppConfig> = {
  name: 'gello-app',
  host: '0.0.0.0',
  port: 3000,
  logging: true,
  timing: true,
  middleware: [],
};

/**
 * Route handler - an Effect that returns an HTTP response.
 */
export type RouteHandler<R = never> = Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  HttpError | HttpBody.HttpBodyError,
  R
>;

/**
 * Route definition.
 */
export interface Route<R = never> {
  readonly method: string;
  readonly path: string;
  readonly handler: RouteHandler<R>;
  readonly middleware?: readonly Middleware[];
}

// ============================================================================
// Route Builders - Define routes as data
// ============================================================================

export const route = {
  get: <R>(path: string, handler: RouteHandler<R>): Route<R> => ({
    method: 'GET',
    path,
    handler,
  }),

  post: <R>(path: string, handler: RouteHandler<R>): Route<R> => ({
    method: 'POST',
    path,
    handler,
  }),

  put: <R>(path: string, handler: RouteHandler<R>): Route<R> => ({
    method: 'PUT',
    path,
    handler,
  }),

  patch: <R>(path: string, handler: RouteHandler<R>): Route<R> => ({
    method: 'PATCH',
    path,
    handler,
  }),

  delete: <R>(path: string, handler: RouteHandler<R>): Route<R> => ({
    method: 'DELETE',
    path,
    handler,
  }),
};

// ============================================================================
// Route Groups - Apply prefix and middleware to multiple routes
// ============================================================================

/**
 * Route group configuration.
 */
export interface RouteGroupConfig {
  readonly prefix?: string;
  readonly middleware?: readonly Middleware[];
}

/**
 * A route group item - can be a route or nested group.
 */
export type RouteGroupItem<R = never> = Route<R> | readonly Route<R>[];

/**
 * Flatten nested route arrays into a single array.
 */
const flattenRoutes = <R>(items: readonly RouteGroupItem<R>[]): Route<R>[] => {
  const result: Route<R>[] = [];
  for (const item of items) {
    if (Array.isArray(item)) {
      result.push(...item);
    } else {
      result.push(item as Route<R>);
    }
  }
  return result;
};

/**
 * Normalize path by removing trailing slashes and ensuring leading slash.
 */
const normalizePath = (path: string): string => {
  if (path === '/') return '';
  return path.startsWith('/') ? path.replace(/\/+$/, '') : `/${path}`.replace(/\/+$/, '');
};

/**
 * Create a route group with shared prefix and/or middleware.
 *
 * @example
 * ```typescript
 * // Simple prefix
 * const apiRoutes = Route.group({ prefix: '/api' }, [
 *   route.get('/users', listUsers),
 *   route.post('/users', createUser),
 * ]);
 *
 * // With middleware
 * const authRoutes = Route.group({
 *   prefix: '/api',
 *   middleware: [authenticate()]
 * }, [
 *   route.get('/me', getCurrentUser),
 *   route.get('/tokens', listTokens),
 * ]);
 *
 * // Nested groups
 * const adminRoutes = Route.group({ prefix: '/admin', middleware: [requireAdmin()] }, [
 *   Route.group({ prefix: '/users' }, [
 *     route.get('/', listUsers),
 *     route.post('/', createUser),
 *   ]),
 *   Route.group({ prefix: '/posts' }, [
 *     route.get('/', listPosts),
 *     route.delete('/:id', deletePost),
 *   ]),
 * ]);
 * ```
 */
export const Route = {
  group: <R>(
    config: RouteGroupConfig,
    routes: readonly RouteGroupItem<R>[]
  ): Route<R>[] => {
    const prefix = config.prefix ? normalizePath(config.prefix) : '';
    const groupMiddleware = config.middleware ?? [];
    const flatRoutes = flattenRoutes(routes);

    return flatRoutes.map((r) => ({
      ...r,
      path: `${prefix}${normalizePath(r.path)}` || '/',
      middleware: [...groupMiddleware, ...(r.middleware ?? [])],
    }));
  },
};

/**
 * Compiled route for efficient matching.
 */
interface CompiledRoute<R = never> {
  readonly route: Route<R>;
  readonly pattern: ReturnType<typeof parsePath>;
}

/**
 * Types provided by the router (excluded from Layer requirements)
 */
type RouterProvided = RouteParams | QueryParams | HttpServerRequest.HttpServerRequest;

/**
 * Extract the R type from a Route, excluding router-provided types
 */
type RouteRequirements<T> = T extends Route<infer R> ? Exclude<R, RouterProvided> : never;

/**
 * Extract union of R types from an array of Routes
 */
type RoutesRequirements<T extends readonly Route<unknown>[]> = RouteRequirements<T[number]>;

/**
 * Gello application builder.
 */
export interface GelloApp<R = never> {
  readonly route: <R2>(route: Route<R2>) => GelloApp<R | Exclude<R2, RouterProvided>>;
  readonly routes: <T extends readonly Route<unknown>[]>(routes: T) => GelloApp<R | RoutesRequirements<T>>;
  readonly get: <R2>(path: string, handler: RouteHandler<R2>) => GelloApp<R | Exclude<R2, RouterProvided>>;
  readonly post: <R2>(path: string, handler: RouteHandler<R2>) => GelloApp<R | Exclude<R2, RouterProvided>>;
  readonly put: <R2>(path: string, handler: RouteHandler<R2>) => GelloApp<R | Exclude<R2, RouterProvided>>;
  readonly patch: <R2>(path: string, handler: RouteHandler<R2>) => GelloApp<R | Exclude<R2, RouterProvided>>;
  readonly delete: <R2>(path: string, handler: RouteHandler<R2>) => GelloApp<R | Exclude<R2, RouterProvided>>;
  readonly use: <R2, E2>(middleware: Middleware<R2, E2>) => GelloApp<R | R2>;
  readonly build: () => Layer.Layer<never, Error, R>;
  readonly run: () => Effect.Effect<never, Error, R>;
}

/**
 * Create a new Gello application.
 */
export const createApp = (config: Partial<GelloAppConfig> = {}): GelloApp => {
  const appConfig = { ...defaultAppConfig, ...config };
  const routeList: Route[] = [];
  const globalMiddleware: Middleware[] = [];

  // Add default middleware
  if (appConfig.logging) {
    globalMiddleware.push(logging());
  }
  if (appConfig.timing) {
    globalMiddleware.push(timing());
  }
  globalMiddleware.push(errorHandler());

  const app: GelloApp = {
    route: (r) => {
      routeList.push(r as Route);
      return app as GelloApp<never>;
    },

    routes: (rs) => {
      for (const r of rs) {
        routeList.push(r as Route);
      }
      return app as GelloApp<never>;
    },

    get: (path, handler) =>
      app.route({ method: 'GET', path, handler: handler as RouteHandler }),

    post: (path, handler) =>
      app.route({ method: 'POST', path, handler: handler as RouteHandler }),

    put: (path, handler) =>
      app.route({ method: 'PUT', path, handler: handler as RouteHandler }),

    patch: (path, handler) =>
      app.route({ method: 'PATCH', path, handler: handler as RouteHandler }),

    delete: (path, handler) =>
      app.route({ method: 'DELETE', path, handler: handler as RouteHandler }),

    use: (middleware) => {
      globalMiddleware.push(middleware as Middleware);
      return app as GelloApp<never>;
    },

    build: () => {
      // Compile routes using the routing library
      const compiledRoutes: CompiledRoute[] = routeList.map((r) => ({
        route: r,
        pattern: parsePath(r.path),
      }));

      // Create the HTTP app
      const httpApp = HttpServer.serve(
        Effect.gen(function* () {
          const request = yield* HttpServerRequest.HttpServerRequest;
          const url = new URL(request.url, `http://${appConfig.host}`);
          const method = request.method;
          const pathname = extractPath(request.url);

          // Find matching route
          let matchedRoute: Route | undefined;
          let matchedParams: Record<string, string> = {};

          for (const compiled of compiledRoutes) {
            if (compiled.route.method !== method) {
              continue;
            }

            const result = matchPath(compiled.pattern, pathname);
            if (result.matches) {
              matchedRoute = compiled.route;
              matchedParams = result.params;
              break;
            }
          }

          if (!matchedRoute) {
            return yield* Effect.succeed(
              HttpServerResponse.text('Not Found', { status: 404 })
            );
          }

          // Build middleware chain
          const routeMiddleware = matchedRoute.middleware ?? [];
          const allMiddleware = [...globalMiddleware, ...routeMiddleware];
          const composed = composeAll(...allMiddleware);

          // Execute handler with RouteParams and QueryParams in context
          const handlerEffect = matchedRoute.handler.pipe(
            Effect.provideService(RouteParams, matchedParams),
            Effect.provideService(QueryParams, url.searchParams)
          );

          return yield* composed.apply(handlerEffect);
        })
      );

      // Create the server layer
      const ServerLive = NodeHttpServer.layer(() => Http.createServer(), {
        port: appConfig.port,
        host: appConfig.host,
      });

      return httpApp.pipe(Layer.provide(ServerLive)) as Layer.Layer<
        never,
        Error,
        never
      >;
    },

    run: () =>
      Effect.gen(function* () {
        yield* Effect.logInfo(`🚀 ${appConfig.name} starting...`);
        yield* Effect.logInfo(
          `   Listening on http://${appConfig.host}:${appConfig.port}`
        );

        const layer = app.build();
        yield* Layer.launch(layer);
      }) as Effect.Effect<never, Error, never>,
  };

  return app;
};

/**
 * Run a Gello application with Node runtime.
 */
export const runApp = <R>(
  app: GelloApp<R>,
  layer: Layer.Layer<R, never, never>
): void => {
  const program = app.run().pipe(Effect.provide(layer));
  NodeRuntime.runMain(program);
};

/**
 * Simple run without additional requirements.
 */
export const run = (app: GelloApp<never>): void => {
  NodeRuntime.runMain(app.run());
};
