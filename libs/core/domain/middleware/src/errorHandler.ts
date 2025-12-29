/**
 * Error handling middleware.
 *
 * Catches errors and converts them to HTTP responses.
 */
import { Effect, Cause, Chunk } from 'effect';
import { HttpError, MiddlewareError } from '@gello/core-contracts';
import type { Middleware } from './Middleware.js';

/**
 * Error handler configuration.
 */
export interface ErrorHandlerConfig {
  /**
   * Include stack traces in error responses (disable in production).
   */
  readonly includeStackTrace: boolean;

  /**
   * Include error cause chain in response.
   */
  readonly includeCause: boolean;

  /**
   * Log errors to console/logger.
   */
  readonly logErrors: boolean;

  /**
   * Custom error transformer.
   */
  readonly transform?: (error: unknown) => HttpError;
}

/**
 * Default error handler configuration.
 */
export const defaultErrorHandlerConfig: ErrorHandlerConfig = {
  includeStackTrace: false,
  includeCause: false,
  logErrors: true,
};

/**
 * Convert unknown error to HttpError.
 */
export const toHttpError = (error: unknown): HttpError => {
  // Already an HttpError
  if (
    error !== null &&
    typeof error === 'object' &&
    '_tag' in error &&
    error._tag === 'HttpError'
  ) {
    return error as HttpError;
  }

  // Standard Error
  if (error instanceof Error) {
    return new HttpError({
      status: 500,
      message: error.message,
      code: 'INTERNAL_ERROR',
      cause: error,
    });
  }

  // String error
  if (typeof error === 'string') {
    return new HttpError({
      status: 500,
      message: error,
      code: 'INTERNAL_ERROR',
    });
  }

  // Unknown error type
  return new HttpError({
    status: 500,
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    cause: error,
  });
};

/**
 * Extract error information from Cause.
 */
export const extractCauseInfo = (
  cause: Cause.Cause<unknown>
): { errors: readonly unknown[]; defects: readonly unknown[] } => {
  const errors = Chunk.toReadonlyArray(Cause.failures(cause));
  const defects = Chunk.toReadonlyArray(Cause.defects(cause));
  return { errors, defects };
};

/**
 * Create error handler middleware.
 *
 * Catches all errors and converts them to HttpError.
 */
export const errorHandler = (
  config: Partial<ErrorHandlerConfig> = {}
): Middleware<never, HttpError> => {
  const mergedConfig = { ...defaultErrorHandlerConfig, ...config };

  return {
    name: 'errorHandler',
    apply: <A, E, R>(handler: Effect.Effect<A, E, R>) =>
      Effect.gen(function* () {
        const result = yield* Effect.either(handler);

        if (result._tag === 'Left') {
          const error = result.left;

          // Log error if configured
          if (mergedConfig.logErrors) {
            yield* Effect.logError('Request error caught').pipe(
              Effect.annotateLogs({
                middleware: 'errorHandler',
                error: String(error),
              })
            );
          }

          // Transform to HttpError
          const httpError = mergedConfig.transform
            ? mergedConfig.transform(error)
            : toHttpError(error);

          return yield* Effect.fail(httpError);
        }

        return result.right;
      }) as Effect.Effect<A, HttpError | E, R>,
  };
};

/**
 * Create error handler that catches specific error types.
 */
export const catchError = <E>(
  predicate: (error: unknown) => error is E,
  handler: (error: E) => HttpError
): Middleware<never, HttpError> => ({
  name: 'catchError',
  apply: <A, E2, R>(handlerEffect: Effect.Effect<A, E2, R>) =>
    handlerEffect.pipe(
      Effect.catchAll((error) => {
        if (predicate(error)) {
          return Effect.fail(handler(error as E));
        }
        return Effect.fail(toHttpError(error));
      })
    ) as Effect.Effect<A, HttpError, R>,
});

/**
 * Catch all errors and convert to HttpError with a status code.
 */
export const catchAllAsHttpError = (
  status: number,
  code: string
): Middleware<never, HttpError> =>
  errorHandler({
    transform: (error) =>
      new HttpError({
        status,
        message: error instanceof Error ? error.message : String(error),
        code,
      }),
  });

/**
 * Create error boundary middleware.
 *
 * Catches defects (unexpected errors) and converts to MiddlewareError.
 */
export const errorBoundary = (name: string): Middleware<never, MiddlewareError> => ({
  name: `errorBoundary(${name})`,
  apply: <A, E, R>(handler: Effect.Effect<A, E, R>) =>
    handler.pipe(
      Effect.catchAllDefect((defect) =>
        Effect.fail(
          new MiddlewareError({
            middleware: name,
            message:
              defect instanceof Error
                ? defect.message
                : 'Unexpected error in middleware',
            cause: defect instanceof Error ? defect : undefined,
          })
        )
      )
    ) as Effect.Effect<A, E | MiddlewareError, R>,
});

/**
 * Development error handler with full details.
 */
export const developmentErrorHandler = (): Middleware<never, HttpError> =>
  errorHandler({
    includeStackTrace: true,
    includeCause: true,
    logErrors: true,
  });

/**
 * Production error handler with minimal details.
 */
export const productionErrorHandler = (): Middleware<never, HttpError> =>
  errorHandler({
    includeStackTrace: false,
    includeCause: false,
    logErrors: true,
  });
