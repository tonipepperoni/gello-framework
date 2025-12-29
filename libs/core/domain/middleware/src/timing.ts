/**
 * Request timing middleware.
 *
 * Measures request execution time and provides timing context.
 */
import { Effect, Context } from 'effect';
import type { Middleware } from './Middleware.js';

/**
 * Timing information for a request.
 */
export interface RequestTiming {
  readonly startTime: number;
  readonly startHrTime: readonly [number, number];
  readonly getElapsedMs: () => number;
  readonly getElapsedNs: () => bigint;
}

/**
 * Context tag for request timing.
 */
export class TimingContext extends Context.Tag('TimingContext')<
  TimingContext,
  RequestTiming
>() {}

/**
 * Create timing context for the current request.
 */
export const createTiming = (): RequestTiming => {
  const startTime = Date.now();
  const startHrTime = process.hrtime() as readonly [number, number];

  return {
    startTime,
    startHrTime,
    getElapsedMs: () => Date.now() - startTime,
    getElapsedNs: () => {
      const [seconds, nanoseconds] = process.hrtime(
        startHrTime as [number, number]
      );
      return BigInt(seconds) * BigInt(1e9) + BigInt(nanoseconds);
    },
  };
};

/**
 * Get elapsed time in milliseconds.
 */
export const getElapsedMs = Effect.map(
  TimingContext,
  (timing) => timing.getElapsedMs()
);

/**
 * Get elapsed time in nanoseconds (for high precision).
 */
export const getElapsedNs = Effect.map(
  TimingContext,
  (timing) => timing.getElapsedNs()
);

/**
 * Get the start timestamp.
 */
export const getStartTime = Effect.map(
  TimingContext,
  (timing) => timing.startTime
);

/**
 * Timing configuration.
 */
export interface TimingConfig {
  /**
   * Header name for response time (set by HTTP layer).
   */
  readonly headerName: string;

  /**
   * Log slow requests above this threshold (ms).
   */
  readonly slowThresholdMs: number;

  /**
   * Whether to log timing information.
   */
  readonly logTiming: boolean;
}

/**
 * Default timing configuration.
 */
export const defaultTimingConfig: TimingConfig = {
  headerName: 'X-Response-Time',
  slowThresholdMs: 1000,
  logTiming: true,
};

/**
 * Create timing middleware.
 *
 * Provides timing context and logs slow requests.
 */
export const timing = (
  config: Partial<TimingConfig> = {}
): Middleware<TimingContext> => {
  const mergedConfig = { ...defaultTimingConfig, ...config };

  return {
    name: 'timing',
    apply: <A, E, R>(handler: Effect.Effect<A, E, R>) =>
      Effect.gen(function* () {
        const timingCtx = createTiming();

        // Execute handler with timing context
        const result = yield* handler.pipe(
          Effect.provideService(TimingContext, timingCtx)
        );

        const elapsedMs = timingCtx.getElapsedMs();

        // Log timing if enabled
        if (mergedConfig.logTiming) {
          if (elapsedMs >= mergedConfig.slowThresholdMs) {
            yield* Effect.logWarning('Slow request detected').pipe(
              Effect.annotateLogs({
                middleware: 'timing',
                elapsedMs,
                threshold: mergedConfig.slowThresholdMs,
              })
            );
          } else {
            yield* Effect.logDebug('Request timing').pipe(
              Effect.annotateLogs({
                middleware: 'timing',
                elapsedMs,
              })
            );
          }
        }

        return result;
      }) as Effect.Effect<A, E, R | TimingContext>,
  };
};

/**
 * Create a timed effect that logs its duration.
 */
export const timed = <A, E, R>(
  name: string,
  effect: Effect.Effect<A, E, R>
): Effect.Effect<A, E, R> =>
  Effect.gen(function* () {
    const start = Date.now();
    const result = yield* effect;
    const elapsed = Date.now() - start;

    yield* Effect.logDebug(`${name} completed`).pipe(
      Effect.annotateLogs({
        operation: name,
        elapsedMs: elapsed,
      })
    );

    return result;
  });

/**
 * Benchmark an effect, running it multiple times.
 */
export const benchmark = <A, E, R>(
  name: string,
  effect: Effect.Effect<A, E, R>,
  iterations = 100
): Effect.Effect<
  { readonly mean: number; readonly min: number; readonly max: number },
  E,
  R
> =>
  Effect.gen(function* () {
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      yield* effect;
      times.push(Date.now() - start);
    }

    const sum = times.reduce((a, b) => a + b, 0);
    const mean = sum / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    yield* Effect.logInfo(`Benchmark: ${name}`).pipe(
      Effect.annotateLogs({
        iterations,
        meanMs: mean.toFixed(2),
        minMs: min,
        maxMs: max,
      })
    );

    return { mean, min, max };
  });
