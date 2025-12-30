/**
 * Effect Client Wrapper
 *
 * Wraps Hey API generated clients with Effect for type-safe error handling,
 * automatic retries, timeouts, and functional composition.
 */
import * as Effect from 'effect/Effect';
import * as Data from 'effect/Data';
import * as Context from 'effect/Context';
import * as Layer from 'effect/Layer';
import * as Schedule from 'effect/Schedule';
import * as Duration from 'effect/Duration';

// ============================================================================
// Error Types
// ============================================================================

/**
 * Base API error with status code and details
 */
export class ApiError extends Data.TaggedError('ApiError')<{
  readonly status: number;
  readonly statusText: string;
  readonly body?: unknown;
  readonly url: string;
  readonly method: string;
}> {}

/**
 * Network error (connection failed, timeout, etc.)
 */
export class NetworkError extends Data.TaggedError('NetworkError')<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

/**
 * Validation error from API response
 */
export class ValidationError extends Data.TaggedError('ValidationError')<{
  readonly status: 422;
  readonly errors: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}> {}

/**
 * Unauthorized error (401)
 */
export class UnauthorizedError extends Data.TaggedError('UnauthorizedError')<{
  readonly message: string;
}> {}

/**
 * Forbidden error (403)
 */
export class ForbiddenError extends Data.TaggedError('ForbiddenError')<{
  readonly message: string;
}> {}

/**
 * Not found error (404)
 */
export class NotFoundError extends Data.TaggedError('NotFoundError')<{
  readonly resource: string;
}> {}

export type ClientError =
  | ApiError
  | NetworkError
  | ValidationError
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError;

// ============================================================================
// Client Configuration
// ============================================================================

export interface ClientConfig {
  readonly baseUrl: string;
  readonly headers?: Record<string, string>;
  readonly timeout?: Duration.Duration;
  readonly retries?: number;
  readonly retryDelay?: Duration.Duration;
}

/**
 * API Client service tag
 */
export class ApiClient extends Context.Tag('@gello/ApiClient')<
  ApiClient,
  {
    readonly config: ClientConfig;
    readonly fetch: typeof globalThis.fetch;
  }
>() {}

// ============================================================================
// Client Wrapper
// ============================================================================

/**
 * Options for wrapped API calls
 */
export interface CallOptions {
  readonly timeout?: Duration.Duration;
  readonly retries?: number;
  readonly signal?: AbortSignal;
}

/**
 * Wrap a Promise-returning API function into an Effect
 */
export function wrapApiCall<T>(
  apiCall: () => Promise<{ data?: T; error?: unknown; response: Response }>
): Effect.Effect<T, ClientError> {
  return Effect.tryPromise({
    try: async () => {
      const result = await apiCall();

      if (result.error || !result.response.ok) {
        throw {
          status: result.response.status,
          statusText: result.response.statusText,
          body: result.error,
          url: result.response.url,
        };
      }

      return result.data as T;
    },
    catch: (error): ClientError => {
      if (error && typeof error === 'object' && 'status' in error) {
        const httpError = error as {
          status: number;
          statusText: string;
          body?: unknown;
          url: string;
        };

        // Map to specific error types
        switch (httpError.status) {
          case 401:
            return new UnauthorizedError({
              message: getErrorMessage(httpError.body) ?? 'Unauthorized',
            });
          case 403:
            return new ForbiddenError({
              message: getErrorMessage(httpError.body) ?? 'Forbidden',
            });
          case 404:
            return new NotFoundError({
              resource: httpError.url,
            });
          case 422:
            return new ValidationError({
              status: 422,
              errors: getValidationErrors(httpError.body),
            });
          default:
            return new ApiError({
              status: httpError.status,
              statusText: httpError.statusText,
              body: httpError.body,
              url: httpError.url,
              method: 'GET', // TODO: Extract method
            });
        }
      }

      return new NetworkError({
        message: error instanceof Error ? error.message : 'Network error',
        cause: error,
      });
    },
  });
}

/**
 * Create an Effect-wrapped API client from Hey API generated functions
 */
export function createEffectClient<T extends Record<string, (...args: any[]) => Promise<any>>>(
  client: T,
  options?: CallOptions
): { [K in keyof T]: (...args: Parameters<T[K]>) => Effect.Effect<Awaited<ReturnType<T[K]>>['data'], ClientError> } {
  const wrapped = {} as any;

  for (const key of Object.keys(client)) {
    const fn = client[key];
    if (typeof fn === 'function') {
      wrapped[key] = (...args: any[]) => {
        let effect: Effect.Effect<any, ClientError> = wrapApiCall(() => fn(...args));

        // Apply timeout if specified
        if (options?.timeout) {
          effect = Effect.timeoutFail(effect, {
            duration: options.timeout,
            onTimeout: () => new NetworkError({ message: 'Request timeout' }),
          });
        }

        // Apply retries if specified
        if (options?.retries && options.retries > 0) {
          effect = Effect.retry(
            effect,
            Schedule.recurs(options.retries).pipe(
              Schedule.intersect(
                Schedule.exponential(Duration.millis(100), 2)
              )
            )
          );
        }

        return effect;
      };
    }
  }

  return wrapped;
}

// ============================================================================
// Request Builder
// ============================================================================

/**
 * Fluent builder for configuring API requests
 */
export class RequestBuilder<T> {
  private _timeout?: Duration.Duration;
  private _retries?: number;
  private _headers: Record<string, string> = {};

  constructor(private readonly apiCall: () => Effect.Effect<T, ClientError>) {}

  /**
   * Set request timeout
   */
  timeout(duration: Duration.Duration): this {
    this._timeout = duration;
    return this;
  }

  /**
   * Set number of retries
   */
  retries(count: number): this {
    this._retries = count;
    return this;
  }

  /**
   * Add a header to the request
   */
  header(key: string, value: string): this {
    this._headers[key] = value;
    return this;
  }

  /**
   * Add bearer token authentication
   */
  bearer(token: string): this {
    return this.header('Authorization', `Bearer ${token}`);
  }

  /**
   * Execute the request and return the Effect
   */
  execute(): Effect.Effect<T, ClientError> {
    let effect: Effect.Effect<T, ClientError> = this.apiCall();

    if (this._timeout) {
      effect = Effect.timeoutFail(effect, {
        duration: this._timeout,
        onTimeout: () => new NetworkError({ message: 'Request timeout' }),
      });
    }

    if (this._retries && this._retries > 0) {
      effect = Effect.retry(
        effect,
        Schedule.recurs(this._retries).pipe(
          Schedule.intersect(Schedule.exponential(Duration.millis(100), 2))
        )
      );
    }

    return effect;
  }
}

/**
 * Create a request builder for an API call
 */
export function request<T>(apiCall: () => Effect.Effect<T, ClientError>): RequestBuilder<T> {
  return new RequestBuilder(apiCall);
}

// ============================================================================
// Layer Factory
// ============================================================================

/**
 * Create an ApiClient layer with the given configuration
 */
export function makeApiClientLayer(config: ClientConfig): Layer.Layer<ApiClient> {
  return Layer.succeed(
    ApiClient,
    {
      config,
      fetch: globalThis.fetch,
    }
  );
}

/**
 * Create an ApiClient layer with test configuration
 */
export function makeTestApiClientLayer(config: Partial<ClientConfig> = {}): Layer.Layer<ApiClient> {
  return Layer.succeed(
    ApiClient,
    {
      config: {
        baseUrl: 'http://localhost:3000',
        timeout: Duration.seconds(5),
        ...config,
      },
      fetch: globalThis.fetch,
    }
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

function getErrorMessage(body: unknown): string | undefined {
  if (body && typeof body === 'object') {
    if ('message' in body && typeof (body as any).message === 'string') {
      return (body as any).message;
    }
    if ('error' in body && typeof (body as any).error === 'object') {
      const error = (body as any).error;
      if ('message' in error && typeof error.message === 'string') {
        return error.message;
      }
    }
  }
  return undefined;
}

function getValidationErrors(body: unknown): Array<{ field: string; message: string; code: string }> {
  if (body && typeof body === 'object' && 'error' in body) {
    const error = (body as any).error;
    if ('details' in error && Array.isArray(error.details)) {
      return error.details;
    }
  }
  return [];
}

// ============================================================================
// Combinators
// ============================================================================

/**
 * Run an Effect with automatic retry on transient errors
 */
export function withRetry<A, E extends ClientError>(
  effect: Effect.Effect<A, E>,
  maxRetries: number = 3
): Effect.Effect<A, E> {
  return Effect.retry(
    effect,
    Schedule.recurs(maxRetries).pipe(
      Schedule.intersect(Schedule.exponential(Duration.millis(100), 2)),
      // Only retry on network errors or 5xx status codes
      Schedule.whileInput((error: E) => {
        if (error._tag === 'NetworkError') return true;
        if (error._tag === 'ApiError' && error.status >= 500) return true;
        return false;
      })
    )
  );
}

/**
 * Run an Effect with a timeout
 */
export function withTimeout<A, E extends ClientError>(
  effect: Effect.Effect<A, E>,
  duration: Duration.Duration
): Effect.Effect<A, E | NetworkError> {
  return Effect.timeoutFail(effect, {
    duration,
    onTimeout: () => new NetworkError({ message: 'Request timeout' }),
  });
}

/**
 * Map API errors to a custom error type
 */
export function mapApiError<A, E extends ClientError, E2>(
  effect: Effect.Effect<A, E>,
  f: (error: E) => E2
): Effect.Effect<A, E2> {
  return Effect.mapError(effect, f);
}

/**
 * Handle specific error types
 */
export function catchApiError<A>(
  effect: Effect.Effect<A, ClientError>,
  handlers: {
    onNotFound?: (e: NotFoundError) => Effect.Effect<A, ClientError>;
    onUnauthorized?: (e: UnauthorizedError) => Effect.Effect<A, ClientError>;
    onForbidden?: (e: ForbiddenError) => Effect.Effect<A, ClientError>;
    onValidation?: (e: ValidationError) => Effect.Effect<A, ClientError>;
    onNetwork?: (e: NetworkError) => Effect.Effect<A, ClientError>;
    onApi?: (e: ApiError) => Effect.Effect<A, ClientError>;
  }
): Effect.Effect<A, ClientError> {
  return Effect.catchAll(effect, (error) => {
    switch (error._tag) {
      case 'NotFoundError':
        return handlers.onNotFound ? handlers.onNotFound(error) : Effect.fail(error);
      case 'UnauthorizedError':
        return handlers.onUnauthorized ? handlers.onUnauthorized(error) : Effect.fail(error);
      case 'ForbiddenError':
        return handlers.onForbidden ? handlers.onForbidden(error) : Effect.fail(error);
      case 'ValidationError':
        return handlers.onValidation ? handlers.onValidation(error) : Effect.fail(error);
      case 'NetworkError':
        return handlers.onNetwork ? handlers.onNetwork(error) : Effect.fail(error);
      case 'ApiError':
        return handlers.onApi ? handlers.onApi(error) : Effect.fail(error);
    }
  });
}
