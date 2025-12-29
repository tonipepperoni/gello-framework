/**
 * Middleware type definitions for the Gello framework.
 *
 * Middleware wraps request handlers to add cross-cutting concerns
 * like logging, authentication, validation, etc.
 */
import { Effect } from 'effect';
import type { HttpError } from '@gello/core-contracts';

/**
 * Core middleware interface.
 * Wraps a handler Effect to add behavior before/after execution.
 */
export interface Middleware<R = never, E = never> {
  readonly name: string;
  readonly apply: <A, E2, R2>(
    handler: Effect.Effect<A, E2, R2>
  ) => Effect.Effect<A, E | E2, R | R2>;
}

/**
 * Middleware that can short-circuit the request pipeline.
 * Returns Either the response or continues to the next handler.
 */
export interface ConditionalMiddleware<R = never, E = never, A = unknown> {
  readonly name: string;
  readonly apply: <E2, R2>(
    handler: Effect.Effect<A, E2, R2>
  ) => Effect.Effect<A, E | E2, R | R2>;
}

/**
 * Middleware factory function type.
 * Creates middleware with configuration options.
 */
export type MiddlewareFactory<Config, R = never, E = never> = (
  config: Config
) => Middleware<R, E>;

/**
 * Error-handling middleware type.
 * Catches errors and transforms them.
 */
export interface ErrorMiddleware<R = never> {
  readonly name: string;
  readonly catch: <A, E, R2>(
    handler: Effect.Effect<A, E, R2>
  ) => Effect.Effect<A, HttpError, R | R2>;
}

/**
 * Create a simple middleware from before/after hooks.
 */
export const createMiddleware = <R = never, E = never>(
  name: string,
  options: {
    readonly before?: Effect.Effect<void, E, R>;
    readonly after?: Effect.Effect<void, E, R>;
  }
): Middleware<R, E> => ({
  name,
  apply: <A, E2, R2>(handler: Effect.Effect<A, E2, R2>) =>
    Effect.gen(function* () {
      if (options.before) {
        yield* options.before;
      }
      const result = yield* handler;
      if (options.after) {
        yield* options.after;
      }
      return result;
    }) as Effect.Effect<A, E | E2, R | R2>,
});

/**
 * Create middleware that wraps the handler with a function.
 */
export const createWrapperMiddleware = <R = never, E = never>(
  name: string,
  wrapper: <A, E2, R2>(
    handler: Effect.Effect<A, E2, R2>
  ) => Effect.Effect<A, E | E2, R | R2>
): Middleware<R, E> => ({
  name,
  apply: wrapper,
});

/**
 * Identity middleware - does nothing, passes through.
 */
export const identity: Middleware = {
  name: 'identity',
  apply: (handler) => handler,
};
