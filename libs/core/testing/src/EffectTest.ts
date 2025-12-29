/**
 * Effect testing utilities for Vitest.
 *
 * Provides helpers for running Effect tests.
 */
import { Effect, Exit, Layer, Scope, Schedule } from 'effect';

/**
 * Run an Effect and return the result.
 * Throws if the effect fails.
 */
export const runEffect = <A, E>(
  effect: Effect.Effect<A, E, never>
): Promise<A> =>
  Effect.runPromise(effect);

/**
 * Run an Effect with a layer and return the result.
 */
export const runEffectWith = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  layer: Layer.Layer<R, never, never>
): Promise<A> =>
  Effect.runPromise(Effect.provide(effect, layer));

/**
 * Run an Effect and expect it to succeed.
 * Returns the success value.
 */
export const expectSuccess = <A, E>(
  effect: Effect.Effect<A, E, never>
): Promise<A> =>
  Effect.runPromise(effect);

/**
 * Run an Effect and expect it to fail.
 * Returns the failure value.
 */
export const expectFailure = <A, E>(
  effect: Effect.Effect<A, E, never>
): Promise<E> =>
  Effect.runPromise(Effect.flip(effect));

/**
 * Run an Effect and expect it to fail with a specific error tag.
 */
export const expectFailureTag = <A, E extends { _tag: string }>(
  effect: Effect.Effect<A, E, never>,
  tag: E['_tag']
): Promise<E> =>
  Effect.runPromise(
    effect.pipe(
      Effect.flip,
      Effect.filterOrFail(
        (error) => error._tag === tag,
        () => new Error(`Expected error with tag "${tag}"`)
      )
    )
  );

/**
 * Run an Effect and get the Exit.
 */
export const runToExit = <A, E>(
  effect: Effect.Effect<A, E, never>
): Promise<Exit.Exit<A, E>> =>
  Effect.runPromise(Effect.exit(effect));

/**
 * Assert that an effect succeeds with a specific value.
 */
export const assertSucceeds = <A, E>(
  effect: Effect.Effect<A, E, never>,
  expected: A
): Promise<void> =>
  Effect.runPromise(
    effect.pipe(
      Effect.flatMap((actual) =>
        JSON.stringify(actual) === JSON.stringify(expected)
          ? Effect.void
          : Effect.fail(
              new Error(
                `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
              )
            )
      )
    )
  );

/**
 * Assert that an effect fails with a specific error.
 */
export const assertFails = <A, E>(
  effect: Effect.Effect<A, E, never>,
  expected: E
): Promise<void> =>
  Effect.runPromise(
    effect.pipe(
      Effect.flip,
      Effect.flatMap((actual) =>
        JSON.stringify(actual) === JSON.stringify(expected)
          ? Effect.void
          : Effect.fail(
              new Error(
                `Expected error ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
              )
            )
      )
    )
  );

/**
 * Create a test layer that provides a mock implementation.
 */
export const mockLayer = <I, S>(
  tag: { readonly Service: I },
  implementation: S
): Layer.Layer<I, never, never> =>
  Layer.succeed(tag as any, implementation as any);

/**
 * Create a scoped test environment.
 */
export const withTestScope = <A, E, R>(
  effect: Effect.Effect<A, E, R | Scope.Scope>
): Effect.Effect<A, E, R> =>
  Effect.scoped(effect);

/**
 * Run a test with timeout.
 */
export const withTimeout = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  ms: number
): Effect.Effect<A, E | Error, R> =>
  Effect.timeoutFail(effect, {
    duration: ms,
    onTimeout: () => new Error(`Test timed out after ${ms}ms`),
  });

/**
 * Collect multiple effects into an array of results.
 */
export const collectAll = <A, E>(
  effects: readonly Effect.Effect<A, E, never>[]
): Promise<readonly A[]> =>
  Effect.runPromise(Effect.all(effects));

/**
 * Test that an effect eventually succeeds.
 */
export const eventually = <A, E>(
  effect: Effect.Effect<A, E, never>,
  options: {
    readonly maxRetries?: number;
    readonly delay?: number;
  } = {}
): Promise<A> => {
  const maxRetries = options.maxRetries ?? 10;
  const delay = options.delay ?? 100;

  const schedule = Schedule.recurs(maxRetries).pipe(
    Schedule.addDelay(() => delay)
  );

  return Effect.runPromise(Effect.retry(effect, schedule));
};
