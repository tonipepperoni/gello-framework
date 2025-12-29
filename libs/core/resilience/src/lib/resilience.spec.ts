import { describe, it, expect } from 'vitest';
import { Effect, Duration, Either, Exit } from 'effect';
import {
  // Retry
  exponentialBackoff,
  fixedDelay,
  retry,
  retryWithBackoff,
  // Circuit Breaker
  makeCircuitBreaker,
  CircuitOpenError,
  // Timeout
  withTimeout,
  TimeoutError,
  // Rate Limiting
  makeRateLimiter,
  RateLimitExceededError,
  // Bulkhead
  makeBulkhead,
  BulkheadRejectedError,
} from './resilience';

describe('Retry', () => {
  describe('exponentialBackoff', () => {
    it('should create a valid schedule', () => {
      const schedule = exponentialBackoff({
        maxRetries: 3,
        initialDelay: '100 millis',
        jitter: false,
      });
      expect(schedule).toBeDefined();
    });
  });

  describe('fixedDelay', () => {
    it('should create a fixed delay schedule', () => {
      const schedule = fixedDelay('100 millis', 3);
      expect(schedule).toBeDefined();
    });
  });

  describe('retry', () => {
    it('should retry on failure', async () => {
      let attempts = 0;
      const effect = Effect.gen(function* () {
        attempts++;
        if (attempts < 3) {
          return yield* Effect.fail('error');
        }
        return 'success';
      });

      const result = await Effect.runPromise(
        retry(effect, fixedDelay('1 millis', 5))
      );

      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should fail after max retries', async () => {
      let attempts = 0;
      const effect = Effect.gen(function* () {
        attempts++;
        return yield* Effect.fail('error');
      });

      const exit = await Effect.runPromiseExit(
        retry(effect, fixedDelay('1 millis', 2))
      );

      expect(Exit.isFailure(exit)).toBe(true);
      expect(attempts).toBe(3); // initial + 2 retries
    });
  });

  describe('retryWithBackoff', () => {
    it('should retry with exponential backoff', async () => {
      let attempts = 0;
      const effect = Effect.gen(function* () {
        attempts++;
        if (attempts < 2) {
          return yield* Effect.fail('error');
        }
        return 'success';
      });

      const result = await Effect.runPromise(
        retryWithBackoff(effect, {
          maxRetries: 3,
          initialDelay: '1 millis',
          jitter: false,
        })
      );

      expect(result).toBe('success');
      expect(attempts).toBe(2);
    });
  });
});

describe('Circuit Breaker', () => {
  it('should start in closed state', async () => {
    const program = Effect.gen(function* () {
      const cb = yield* makeCircuitBreaker({
        maxFailures: 3,
        resetTimeout: '1 second',
      });
      return yield* cb.getState();
    });

    const state = await Effect.runPromise(program);
    expect(state._tag).toBe('Closed');
    expect(state._tag === 'Closed' && state.failures).toBe(0);
  });

  it('should count failures', async () => {
    const program = Effect.gen(function* () {
      const cb = yield* makeCircuitBreaker({
        maxFailures: 3,
        resetTimeout: '1 second',
      });

      // Fail twice
      yield* Effect.either(cb.protect(Effect.fail('error')));
      yield* Effect.either(cb.protect(Effect.fail('error')));

      return yield* cb.getState();
    });

    const state = await Effect.runPromise(program);
    expect(state._tag).toBe('Closed');
    expect(state._tag === 'Closed' && state.failures).toBe(2);
  });

  it('should open after max failures', async () => {
    const program = Effect.gen(function* () {
      const cb = yield* makeCircuitBreaker({
        maxFailures: 3,
        resetTimeout: '1 second',
      });

      // Fail 3 times
      yield* Effect.either(cb.protect(Effect.fail('error')));
      yield* Effect.either(cb.protect(Effect.fail('error')));
      yield* Effect.either(cb.protect(Effect.fail('error')));

      return yield* cb.getState();
    });

    const state = await Effect.runPromise(program);
    expect(state._tag).toBe('Open');
  });

  it('should reject when open', async () => {
    const program = Effect.gen(function* () {
      const cb = yield* makeCircuitBreaker({
        maxFailures: 1,
        resetTimeout: '1 second',
      });

      // Open the circuit
      yield* Effect.either(cb.protect(Effect.fail('error')));

      // Try again - should fail immediately
      return yield* cb.protect(Effect.succeed('value'));
    });

    const exit = await Effect.runPromiseExit(program);
    expect(Exit.isFailure(exit)).toBe(true);

    if (Exit.isFailure(exit)) {
      const error = exit.cause;
      // The error should be CircuitOpenError
      expect(error).toBeDefined();
    }
  });

  it('should reset failures on success', async () => {
    const program = Effect.gen(function* () {
      const cb = yield* makeCircuitBreaker({
        maxFailures: 3,
        resetTimeout: '1 second',
      });

      // Fail twice
      yield* Effect.either(cb.protect(Effect.fail('error')));
      yield* Effect.either(cb.protect(Effect.fail('error')));

      // Succeed
      yield* cb.protect(Effect.succeed('value'));

      return yield* cb.getState();
    });

    const state = await Effect.runPromise(program);
    expect(state._tag).toBe('Closed');
    expect(state._tag === 'Closed' && state.failures).toBe(0);
  });

  it('should allow manual reset', async () => {
    const program = Effect.gen(function* () {
      const cb = yield* makeCircuitBreaker({
        maxFailures: 1,
        resetTimeout: '1 hour', // Long timeout
      });

      // Open the circuit
      yield* Effect.either(cb.protect(Effect.fail('error')));

      // Manually reset
      yield* cb.reset();

      return yield* cb.getState();
    });

    const state = await Effect.runPromise(program);
    expect(state._tag).toBe('Closed');
  });
});

describe('Timeout', () => {
  it('should succeed before timeout', async () => {
    const effect = Effect.delay(Effect.succeed('value'), Duration.millis(10));
    const result = await Effect.runPromise(withTimeout(effect, '100 millis'));
    expect(result).toBe('value');
  });

  it('should fail on timeout', async () => {
    const effect = Effect.delay(Effect.succeed('value'), Duration.millis(100));
    const exit = await Effect.runPromiseExit(withTimeout(effect, '10 millis'));

    expect(Exit.isFailure(exit)).toBe(true);
  });

  it('should return TimeoutError', async () => {
    const effect = Effect.delay(Effect.succeed('value'), Duration.millis(100));

    const program = Effect.gen(function* () {
      return yield* withTimeout(effect, '10 millis');
    });

    const result = await Effect.runPromise(Effect.either(program));
    expect(Either.isLeft(result)).toBe(true);
    if (Either.isLeft(result)) {
      expect(result.left).toBeInstanceOf(TimeoutError);
    }
  });
});

describe('Rate Limiter', () => {
  it('should allow requests within limit', async () => {
    const program = Effect.gen(function* () {
      const rl = yield* makeRateLimiter({
        maxRequests: 5,
        window: '1 second',
      });

      // Should succeed for first 5 requests
      yield* rl.acquire();
      yield* rl.acquire();
      yield* rl.acquire();
      yield* rl.acquire();
      yield* rl.acquire();

      return yield* rl.getRemaining();
    });

    const remaining = await Effect.runPromise(program);
    expect(remaining).toBe(0);
  });

  it('should reject when limit exceeded', async () => {
    const program = Effect.gen(function* () {
      const rl = yield* makeRateLimiter({
        maxRequests: 2,
        window: '1 second',
      });

      yield* rl.acquire();
      yield* rl.acquire();

      // This should fail
      return yield* rl.acquire();
    });

    const exit = await Effect.runPromiseExit(program);
    expect(Exit.isFailure(exit)).toBe(true);
  });

  it('should protect effects', async () => {
    const program = Effect.gen(function* () {
      const rl = yield* makeRateLimiter({
        maxRequests: 1,
        window: '1 second',
      });

      yield* rl.protect(Effect.succeed('first'));

      // This should fail
      return yield* rl.protect(Effect.succeed('second'));
    });

    const exit = await Effect.runPromiseExit(program);
    expect(Exit.isFailure(exit)).toBe(true);
  });
});

describe('Bulkhead', () => {
  it('should allow concurrent requests within limit', async () => {
    const program = Effect.gen(function* () {
      const bh = yield* makeBulkhead({ maxConcurrent: 3 });

      // Run 3 concurrent effects
      const results = yield* Effect.all([
        bh.protect(Effect.succeed(1)),
        bh.protect(Effect.succeed(2)),
        bh.protect(Effect.succeed(3)),
      ], { concurrency: 'unbounded' });

      return results;
    });

    const results = await Effect.runPromise(program);
    expect(results).toEqual([1, 2, 3]);
  });

  it('should reject when full and no queue', async () => {
    const program = Effect.gen(function* () {
      const bh = yield* makeBulkhead({ maxConcurrent: 1, maxQueued: 0 });

      // Acquire the slot but don't release
      yield* bh.acquire();

      // This should fail
      return yield* bh.acquire();
    });

    const exit = await Effect.runPromiseExit(program);
    expect(Exit.isFailure(exit)).toBe(true);
  });

  it('should return stats', async () => {
    const program = Effect.gen(function* () {
      const bh = yield* makeBulkhead({ maxConcurrent: 5 });

      yield* bh.acquire();
      yield* bh.acquire();

      const stats = yield* bh.getStats();

      yield* bh.release();
      yield* bh.release();

      return stats;
    });

    const stats = await Effect.runPromise(program);
    expect(stats.concurrent).toBe(2);
    expect(stats.queued).toBe(0);
  });
});

describe('Error types', () => {
  describe('CircuitOpenError', () => {
    it('should have correct message', () => {
      const error = new CircuitOpenError({ remainingMs: 5000 });
      expect(error.message).toContain('5000ms');
      expect(error._tag).toBe('CircuitOpenError');
    });
  });

  describe('TimeoutError', () => {
    it('should have correct message', () => {
      const error = new TimeoutError({ durationMs: 3000 });
      expect(error.message).toContain('3000ms');
      expect(error._tag).toBe('TimeoutError');
    });
  });

  describe('RateLimitExceededError', () => {
    it('should have correct message', () => {
      const error = new RateLimitExceededError({ retryAfterMs: 1000 });
      expect(error.message).toContain('1000ms');
      expect(error._tag).toBe('RateLimitExceededError');
    });
  });

  describe('BulkheadRejectedError', () => {
    it('should have correct message', () => {
      const error = new BulkheadRejectedError({ maxConcurrent: 5, maxQueued: 10 });
      expect(error.message).toContain('5');
      expect(error.message).toContain('10');
      expect(error._tag).toBe('BulkheadRejectedError');
    });
  });
});
