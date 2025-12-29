/**
 * Middleware composition utilities.
 *
 * Allows chaining multiple middleware together into a single middleware.
 */
import { Effect } from 'effect';
import type { Middleware } from './Middleware.js';

/**
 * Compose two middleware into one.
 * The first middleware wraps the second.
 */
export const compose = <R1, E1, R2, E2>(
  first: Middleware<R1, E1>,
  second: Middleware<R2, E2>
): Middleware<R1 | R2, E1 | E2> => ({
  name: `${first.name}+${second.name}`,
  apply: <A, E3, R3>(handler: Effect.Effect<A, E3, R3>) =>
    first.apply(second.apply(handler)),
});

/**
 * Compose multiple middleware into one.
 * Middleware are applied in order (first wraps second wraps third...).
 */
export const composeAll = <R, E>(
  ...middleware: readonly Middleware<R, E>[]
): Middleware<R, E> => {
  if (middleware.length === 0) {
    return {
      name: 'empty',
      apply: (handler) => handler,
    };
  }

  if (middleware.length === 1) {
    return middleware[0]!;
  }

  return middleware.reduce((acc, mw) => compose(acc, mw) as Middleware<R, E>);
};

/**
 * Apply middleware to a handler.
 */
export const applyMiddleware = <A, E, R, MW_R, MW_E>(
  handler: Effect.Effect<A, E, R>,
  middleware: Middleware<MW_R, MW_E>
): Effect.Effect<A, E | MW_E, R | MW_R> => middleware.apply(handler);

/**
 * Apply multiple middleware to a handler.
 */
export const applyAll = <A, E, R, MW_R, MW_E>(
  handler: Effect.Effect<A, E, R>,
  middleware: readonly Middleware<MW_R, MW_E>[]
): Effect.Effect<A, E | MW_E, R | MW_R> => {
  const composed = composeAll(...middleware);
  return composed.apply(handler);
};

/**
 * Create a middleware pipeline builder.
 */
export const pipeline = <R = never, E = never>() => {
  const middleware: Middleware<R, E>[] = [];

  return {
    /**
     * Add middleware to the pipeline.
     */
    use: <R2, E2>(mw: Middleware<R2, E2>) => {
      middleware.push(mw as unknown as Middleware<R, E>);
      return pipeline<R | R2, E | E2>();
    },

    /**
     * Build the composed middleware.
     */
    build: (): Middleware<R, E> => composeAll(...middleware),

    /**
     * Apply the pipeline to a handler.
     */
    apply: <A, E2, R2>(
      handler: Effect.Effect<A, E2, R2>
    ): Effect.Effect<A, E | E2, R | R2> => {
      const composed = composeAll(...middleware);
      return composed.apply(handler);
    },
  };
};

/**
 * Conditional middleware - only applies if condition is true.
 */
export const when = <R, E>(
  condition: boolean,
  middleware: Middleware<R, E>
): Middleware<R, E> => {
  if (condition) {
    return middleware;
  }
  return {
    name: `skip(${middleware.name})`,
    apply: (handler) => handler,
  } as Middleware<R, E>;
};

/**
 * Conditional middleware - applies based on Effect condition.
 */
export const whenEffect = <R, E, CR, CE>(
  condition: Effect.Effect<boolean, CE, CR>,
  middleware: Middleware<R, E>
): Middleware<R | CR, E | CE> => ({
  name: `whenEffect(${middleware.name})`,
  apply: <A, E2, R2>(handler: Effect.Effect<A, E2, R2>) =>
    Effect.flatMap(condition, (shouldApply) =>
      shouldApply ? middleware.apply(handler) : handler
    ) as Effect.Effect<A, E | E2 | CE, R | R2 | CR>,
});
