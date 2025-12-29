/**
 * Error response formatting for HTTP responses
 */

import { HttpError, ValidationError, type FieldError } from "@gello/core-contracts";

export interface ErrorResponseBody {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: unknown;
  };
}

export interface ValidationErrorResponseBody {
  readonly success: false;
  readonly error: {
    readonly code: "VALIDATION_ERROR";
    readonly message: string;
    readonly errors: readonly FieldError[];
  };
}

/**
 * Format an HttpError as a JSON response body
 */
export const formatHttpError = (error: HttpError): ErrorResponseBody => ({
  success: false,
  error: {
    code: error.code ?? "ERROR",
    message: error.message,
    ...(error.cause && process.env.NODE_ENV !== "production"
      ? { details: String(error.cause) }
      : {}),
  },
});

/**
 * Format a ValidationError as a JSON response body
 */
export const formatValidationError = (
  error: ValidationError
): ValidationErrorResponseBody => ({
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: error.message,
    errors: error.errors,
  },
});

/**
 * Format any error as a JSON response body
 */
export const formatError = (
  error: HttpError | ValidationError
): ErrorResponseBody | ValidationErrorResponseBody => {
  if (error._tag === "ValidationError") {
    return formatValidationError(error);
  }
  return formatHttpError(error);
};
