/**
 * Resilience Library
 *
 * Provides resilience patterns for Effect-based applications:
 * - Retry with configurable strategies
 * - Circuit breaker
 * - Timeout
 * - Rate limiting
 * - Bulkhead
 */
import { Effect, Schedule, Duration, Ref, Data, pipe } from 'effect';

// =============================================================================
// Retry Policies
// =============================================================================

/**
 * Retry configuration
 */
export interface RetryConfig {
  readonly maxRetries: number;
  readonly initialDelay: Duration.DurationInput;
  readonly maxDelay?: Duration.DurationInput;
  readonly backoffFactor?: number;
  readonly jitter?: boolean;
}

/**
 * Create a retry schedule with exponential backoff
 */
export const exponentialBackoff = (config: RetryConfig) => {
  const { maxRetries, initialDelay, maxDelay, backoffFactor = 2, jitter = true } = config;

  let schedule = pipe(
    Schedule.exponential(Duration.decode(initialDelay), backoffFactor),
    Schedule.intersect(Schedule.recurs(maxRetries))
  );

  if (maxDelay) {
    schedule = pipe(
      schedule,
      Schedule.delayed((d) =>
        Duration.lessThan(d, Duration.decode(maxDelay))
          ? d
          : Duration.decode(maxDelay)
      )
    );
  }

  if (jitter) {
    schedule = Schedule.jittered(schedule);
  }

  return schedule;
};

/**
 * Create a retry schedule with fixed delay
 */
export const fixedDelay = (
  delay: Duration.DurationInput,
  maxRetries: number
) =>
  pipe(
    Schedule.fixed(Duration.decode(delay)),
    Schedule.intersect(Schedule.recurs(maxRetries))
  );

/**
 * Create a retry schedule with linear backoff
 */
export const linearBackoff = (
  initialDelay: Duration.DurationInput,
  maxRetries: number
) =>
  pipe(
    Schedule.linear(Duration.decode(initialDelay)),
    Schedule.intersect(Schedule.recurs(maxRetries))
  );

/**
 * Retry an effect with the given schedule
 */
export const retry = <A, E, R, Out>(
  effect: Effect.Effect<A, E, R>,
  schedule: Schedule.Schedule<Out, E>
): Effect.Effect<A, E, R> => Effect.retry(effect, schedule);

/**
 * Retry with exponential backoff config
 */
export const retryWithBackoff = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  config: RetryConfig
): Effect.Effect<A, E, R> => retry(effect, exponentialBackoff(config));

/**
 * Retry only on specific errors
 */
export const retryWhen = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  schedule: Schedule.Schedule<number>,
  predicate: (error: E) => boolean
): Effect.Effect<A, E, R> =>
  Effect.retry(
    effect,
    Schedule.whileInput(schedule, (e) => predicate(e as E))
  );

// =============================================================================
// Circuit Breaker
// =============================================================================

/**
 * Circuit breaker state
 */
export type CircuitState =
  | { readonly _tag: 'Closed'; readonly failures: number }
  | { readonly _tag: 'Open'; readonly openedAt: number }
  | { readonly _tag: 'HalfOpen' };

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  readonly maxFailures: number;
  readonly resetTimeout: Duration.DurationInput;
  readonly halfOpenMaxCalls?: number;
}

/**
 * Circuit breaker errors
 */
export class CircuitOpenError extends Data.TaggedError('CircuitOpenError')<{
  readonly remainingMs: number;
}> {
  override get message() {
    return `Circuit breaker is open. Retry in ${this.remainingMs}ms`;
  }
}

/**
 * Create a circuit breaker
 */
export const makeCircuitBreaker = (config: CircuitBreakerConfig) =>
  Effect.gen(function* () {
    const state = yield* Ref.make<CircuitState>({ _tag: 'Closed', failures: 0 });
    const halfOpenCalls = yield* Ref.make(0);
    const resetTimeoutMs = Duration.toMillis(Duration.decode(config.resetTimeout));

    const isOpen = (): Effect.Effect<boolean> =>
      Effect.gen(function* () {
        const current = yield* Ref.get(state);
        if (current._tag !== 'Open') return false;

        const elapsed = Date.now() - current.openedAt;
        if (elapsed >= resetTimeoutMs) {
          yield* Ref.set(state, { _tag: 'HalfOpen' });
          yield* Ref.set(halfOpenCalls, 0);
          return false;
        }
        return true;
      });

    const recordSuccess = (): Effect.Effect<void> =>
      Effect.gen(function* () {
        const current = yield* Ref.get(state);
        if (current._tag === 'HalfOpen') {
          yield* Ref.set(state, { _tag: 'Closed', failures: 0 });
        } else if (current._tag === 'Closed') {
          yield* Ref.set(state, { _tag: 'Closed', failures: 0 });
        }
      });

    const recordFailure = (): Effect.Effect<void> =>
      Effect.gen(function* () {
        const current = yield* Ref.get(state);
        if (current._tag === 'HalfOpen') {
          yield* Ref.set(state, { _tag: 'Open', openedAt: Date.now() });
        } else if (current._tag === 'Closed') {
          const newFailures = current.failures + 1;
          if (newFailures >= config.maxFailures) {
            yield* Ref.set(state, { _tag: 'Open', openedAt: Date.now() });
          } else {
            yield* Ref.set(state, { _tag: 'Closed', failures: newFailures });
          }
        }
      });

    const protect = <A, E, R>(
      effect: Effect.Effect<A, E, R>
    ): Effect.Effect<A, E | CircuitOpenError, R> =>
      Effect.gen(function* () {
        const open = yield* isOpen();
        if (open) {
          const current = yield* Ref.get(state);
          if (current._tag === 'Open') {
            const elapsed = Date.now() - current.openedAt;
            const remaining = Math.max(0, resetTimeoutMs - elapsed);
            return yield* Effect.fail(new CircuitOpenError({ remainingMs: remaining }));
          }
        }

        const current = yield* Ref.get(state);
        if (current._tag === 'HalfOpen' && config.halfOpenMaxCalls) {
          const calls = yield* Ref.get(halfOpenCalls);
          if (calls >= config.halfOpenMaxCalls) {
            return yield* Effect.fail(
              new CircuitOpenError({ remainingMs: resetTimeoutMs })
            );
          }
          yield* Ref.update(halfOpenCalls, (n) => n + 1);
        }

        return yield* pipe(
          effect,
          Effect.tap(() => recordSuccess()),
          Effect.tapError(() => recordFailure())
        );
      });

    const getState = (): Effect.Effect<CircuitState> => Ref.get(state);

    const reset = (): Effect.Effect<void> =>
      Ref.set(state, { _tag: 'Closed', failures: 0 });

    return {
      protect,
      getState,
      reset,
      isOpen,
    };
  });

export type CircuitBreaker = Effect.Effect.Success<ReturnType<typeof makeCircuitBreaker>>;

// =============================================================================
// Timeout
// =============================================================================

/**
 * Timeout error
 */
export class TimeoutError extends Data.TaggedError('TimeoutError')<{
  readonly durationMs: number;
}> {
  override get message() {
    return `Operation timed out after ${this.durationMs}ms`;
  }
}

/**
 * Add a timeout to an effect
 */
export const withTimeout = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  duration: Duration.DurationInput
): Effect.Effect<A, E | TimeoutError, R> =>
  pipe(
    Effect.timeoutTo(effect, {
      duration: Duration.decode(duration),
      onTimeout: () =>
        Effect.fail(
          new TimeoutError({ durationMs: Duration.toMillis(Duration.decode(duration)) })
        ),
      onSuccess: Effect.succeed,
    }),
    Effect.flatten
  );

// =============================================================================
// Rate Limiting
// =============================================================================

/**
 * Rate limiter configuration
 */
export interface RateLimiterConfig {
  readonly maxRequests: number;
  readonly window: Duration.DurationInput;
}

/**
 * Rate limit exceeded error
 */
export class RateLimitExceededError extends Data.TaggedError('RateLimitExceededError')<{
  readonly retryAfterMs: number;
}> {
  override get message() {
    return `Rate limit exceeded. Retry after ${this.retryAfterMs}ms`;
  }
}

/**
 * Create a rate limiter using sliding window
 */
export const makeRateLimiter = (config: RateLimiterConfig) =>
  Effect.gen(function* () {
    const timestamps = yield* Ref.make<readonly number[]>([]);
    const windowMs = Duration.toMillis(Duration.decode(config.window));

    const acquire = (): Effect.Effect<void, RateLimitExceededError> =>
      Effect.gen(function* () {
        const now = Date.now();
        const cutoff = now - windowMs;

        yield* Ref.update(timestamps, (ts) => ts.filter((t) => t > cutoff));

        const current = yield* Ref.get(timestamps);
        if (current.length >= config.maxRequests) {
          const oldestInWindow = current[0];
          const retryAfter = oldestInWindow + windowMs - now;
          return yield* Effect.fail(
            new RateLimitExceededError({ retryAfterMs: Math.max(0, retryAfter) })
          );
        }

        yield* Ref.update(timestamps, (ts) => [...ts, now]);
      });

    const protect = <A, E, R>(
      effect: Effect.Effect<A, E, R>
    ): Effect.Effect<A, E | RateLimitExceededError, R> =>
      pipe(acquire(), Effect.flatMap(() => effect));

    const getRemaining = (): Effect.Effect<number> =>
      Effect.gen(function* () {
        const now = Date.now();
        const cutoff = now - windowMs;
        yield* Ref.update(timestamps, (ts) => ts.filter((t) => t > cutoff));
        const current = yield* Ref.get(timestamps);
        return Math.max(0, config.maxRequests - current.length);
      });

    return {
      acquire,
      protect,
      getRemaining,
    };
  });

export type RateLimiter = Effect.Effect.Success<ReturnType<typeof makeRateLimiter>>;

// =============================================================================
// Bulkhead
// =============================================================================

/**
 * Bulkhead configuration
 */
export interface BulkheadConfig {
  readonly maxConcurrent: number;
  readonly maxQueued?: number;
}

/**
 * Bulkhead rejection error
 */
export class BulkheadRejectedError extends Data.TaggedError('BulkheadRejectedError')<{
  readonly maxConcurrent: number;
  readonly maxQueued: number;
}> {
  override get message() {
    return `Bulkhead full: ${this.maxConcurrent} concurrent, ${this.maxQueued} queued`;
  }
}

/**
 * Create a bulkhead (concurrent execution limiter)
 */
export const makeBulkhead = (config: BulkheadConfig) =>
  Effect.gen(function* () {
    const currentConcurrent = yield* Ref.make(0);
    const currentQueued = yield* Ref.make(0);
    const maxQueued = config.maxQueued ?? 0;

    const acquire = (): Effect.Effect<void, BulkheadRejectedError> =>
      Effect.gen(function* () {
        const concurrent = yield* Ref.get(currentConcurrent);
        if (concurrent < config.maxConcurrent) {
          yield* Ref.update(currentConcurrent, (n) => n + 1);
          return;
        }

        const queued = yield* Ref.get(currentQueued);
        if (maxQueued > 0 && queued < maxQueued) {
          yield* Ref.update(currentQueued, (n) => n + 1);
          // Wait for a slot
          yield* Effect.sleep(Duration.millis(10));
          yield* Ref.update(currentQueued, (n) => n - 1);
          // Retry acquiring
          return yield* acquire();
        }

        return yield* Effect.fail(
          new BulkheadRejectedError({
            maxConcurrent: config.maxConcurrent,
            maxQueued,
          })
        );
      });

    const release = (): Effect.Effect<void> =>
      Ref.update(currentConcurrent, (n) => Math.max(0, n - 1));

    const protect = <A, E, R>(
      effect: Effect.Effect<A, E, R>
    ): Effect.Effect<A, E | BulkheadRejectedError, R> =>
      Effect.acquireUseRelease(acquire(), () => effect, release);

    const getStats = (): Effect.Effect<{ concurrent: number; queued: number }> =>
      Effect.gen(function* () {
        const concurrent = yield* Ref.get(currentConcurrent);
        const queued = yield* Ref.get(currentQueued);
        return { concurrent, queued };
      });

    return {
      acquire,
      release,
      protect,
      getStats,
    };
  });

export type Bulkhead = Effect.Effect.Success<ReturnType<typeof makeBulkhead>>;

// =============================================================================
// Combined Resilience Policies
// =============================================================================

/**
 * Combined resilience configuration
 */
export interface ResilienceConfig {
  readonly retry?: RetryConfig;
  readonly circuitBreaker?: CircuitBreakerConfig;
  readonly timeout?: Duration.DurationInput;
  readonly rateLimit?: RateLimiterConfig;
  readonly bulkhead?: BulkheadConfig;
}

/**
 * Apply multiple resilience policies to an effect
 * Order: bulkhead -> rate limit -> circuit breaker -> timeout -> retry
 */
export const withResilience = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  config: ResilienceConfig
): Effect.Effect<
  A,
  E | CircuitOpenError | TimeoutError | RateLimitExceededError | BulkheadRejectedError,
  R
> =>
  Effect.gen(function* () {
    let result: Effect.Effect<A, E | CircuitOpenError | TimeoutError | RateLimitExceededError | BulkheadRejectedError, R> = effect;

    // Apply retry (innermost)
    if (config.retry) {
      result = retryWithBackoff(result, config.retry);
    }

    // Apply timeout
    if (config.timeout) {
      result = withTimeout(result, config.timeout);
    }

    // Apply circuit breaker
    if (config.circuitBreaker) {
      const cb = yield* makeCircuitBreaker(config.circuitBreaker);
      result = cb.protect(result);
    }

    // Apply rate limiting
    if (config.rateLimit) {
      const rl = yield* makeRateLimiter(config.rateLimit);
      result = rl.protect(result);
    }

    // Apply bulkhead (outermost)
    if (config.bulkhead) {
      const bh = yield* makeBulkhead(config.bulkhead);
      result = bh.protect(result);
    }

    return yield* result;
  });
