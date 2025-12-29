/**
 * Helper functions for working with HTTP errors
 */

import { Effect } from "effect";
import { HttpError, ValidationError } from "@gello/core-contracts";

/**
 * Check if an error is an HttpError
 */
export const isHttpError = (error: unknown): error is HttpError =>
  error instanceof HttpError ||
  (typeof error === "object" &&
    error !== null &&
    "_tag" in error &&
    (error as { _tag: string })._tag === "HttpError");

/**
 * Check if an error is a ValidationError
 */
export const isValidationError = (error: unknown): error is ValidationError =>
  error instanceof ValidationError ||
  (typeof error === "object" &&
    error !== null &&
    "_tag" in error &&
    (error as { _tag: string })._tag === "ValidationError");

/**
 * Convert any error to an HttpError
 */
export const toHttpError = (error: unknown): HttpError => {
  if (isHttpError(error)) {
    return error;
  }

  if (isValidationError(error)) {
    return HttpError.BadRequest(error.message);
  }

  if (error instanceof Error) {
    return HttpError.InternalServerError(error);
  }

  return HttpError.InternalServerError(error);
};

/**
 * Get HTTP status code from an error
 */
export const getStatusCode = (error: unknown): number => {
  if (isHttpError(error)) {
    return error.status;
  }
  if (isValidationError(error)) {
    return 400;
  }
  return 500;
};

/**
 * Catch all errors and convert to HttpError
 */
export const catchAllAsHttpError = <A, R>(
  effect: Effect.Effect<A, unknown, R>
): Effect.Effect<A, HttpError, R> =>
  effect.pipe(Effect.catchAll((error) => Effect.fail(toHttpError(error))));

/**
 * Catch specific error tag and convert to HttpError
 */
export const catchTagAsHttpError = <A, E extends { _tag: string }, R>(
  effect: Effect.Effect<A, E, R>,
  tag: E["_tag"],
  toHttp: (error: E) => HttpError
): Effect.Effect<A, HttpError, R> =>
  effect.pipe(
    Effect.catchAll((error) => {
      if (error._tag === tag) {
        return Effect.fail(toHttp(error));
      }
      return Effect.fail(toHttp(error));
    })
  );
