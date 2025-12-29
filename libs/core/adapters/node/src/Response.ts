/**
 * Response helpers for building HTTP responses.
 *
 * Provides convenient functions for common response patterns.
 */
import { Effect } from 'effect';
import { HttpServerResponse, HttpBody } from '@effect/platform';
import type { HttpError } from '@gello/core-contracts';

/**
 * JSON response with automatic serialization.
 */
export const json = <A>(
  data: A,
  options: {
    readonly status?: number;
    readonly headers?: Record<string, string>;
  } = {}
): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError> =>
  HttpServerResponse.json(data, {
    status: options.status ?? 200,
    headers: {
      ...options.headers,
    },
  });

/**
 * Text response.
 */
export const text = (
  content: string,
  options: {
    readonly status?: number;
    readonly headers?: Record<string, string>;
  } = {}
): Effect.Effect<HttpServerResponse.HttpServerResponse> =>
  Effect.succeed(
    HttpServerResponse.text(content, {
      status: options.status ?? 200,
      headers: {
        ...options.headers,
      },
    })
  );

/**
 * HTML response.
 */
export const html = (
  content: string,
  options: {
    readonly status?: number;
    readonly headers?: Record<string, string>;
  } = {}
): Effect.Effect<HttpServerResponse.HttpServerResponse> =>
  Effect.succeed(
    HttpServerResponse.text(content, {
      status: options.status ?? 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        ...options.headers,
      },
    })
  );

/**
 * Empty response (204 No Content).
 */
export const noContent = (): Effect.Effect<HttpServerResponse.HttpServerResponse> =>
  Effect.succeed(HttpServerResponse.empty({ status: 204 }));

/**
 * Redirect response.
 */
export const redirect = (
  url: string,
  options: {
    readonly permanent?: boolean;
  } = {}
): Effect.Effect<HttpServerResponse.HttpServerResponse> =>
  Effect.succeed(
    HttpServerResponse.empty({
      status: options.permanent ? 301 : 302,
      headers: { Location: url },
    })
  );

/**
 * Created response (201) with location header.
 */
export const created = <A>(
  data: A,
  location?: string
): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError> =>
  HttpServerResponse.json(data, {
    status: 201,
    headers: location ? { Location: location } : {},
  });

/**
 * Accepted response (202).
 */
export const accepted = <A>(
  data?: A
): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError | never> =>
  data
    ? HttpServerResponse.json(data, { status: 202 })
    : Effect.succeed(HttpServerResponse.empty({ status: 202 }));

/**
 * Error response from HttpError.
 */
export const error = (
  err: HttpError
): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError> =>
  HttpServerResponse.json(
    {
      error: {
        code: err.code,
        message: err.message,
      },
    },
    { status: err.status }
  );

/**
 * Bad Request (400) response.
 */
export const badRequest = (
  message: string,
  details?: Record<string, unknown>
): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError> =>
  HttpServerResponse.json(
    { error: { code: 'BAD_REQUEST', message, details } },
    { status: 400 }
  );

/**
 * Unauthorized (401) response.
 */
export const unauthorized = (
  message = 'Unauthorized'
): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError> =>
  HttpServerResponse.json(
    { error: { code: 'UNAUTHORIZED', message } },
    { status: 401 }
  );

/**
 * Forbidden (403) response.
 */
export const forbidden = (
  message = 'Forbidden'
): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError> =>
  HttpServerResponse.json(
    { error: { code: 'FORBIDDEN', message } },
    { status: 403 }
  );

/**
 * Not Found (404) response.
 */
export const notFound = (
  message = 'Not Found'
): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError> =>
  HttpServerResponse.json(
    { error: { code: 'NOT_FOUND', message } },
    { status: 404 }
  );

/**
 * Internal Server Error (500) response.
 */
export const internalError = (
  message = 'Internal Server Error'
): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError> =>
  HttpServerResponse.json(
    { error: { code: 'INTERNAL_ERROR', message } },
    { status: 500 }
  );

/**
 * API response wrapper with standard structure.
 */
export interface ApiResponseData<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: {
    readonly code: string;
    readonly message: string;
    readonly details?: Record<string, unknown>;
  };
  readonly meta?: {
    readonly requestId?: string;
    readonly timestamp?: string;
    readonly pagination?: {
      readonly page: number;
      readonly limit: number;
      readonly total: number;
      readonly hasMore: boolean;
    };
  };
}

/**
 * Create a success API response.
 */
export const success = <T>(
  data: T,
  meta?: ApiResponseData<T>['meta']
): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError> => {
  const response: ApiResponseData<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };

  return json(response);
};

/**
 * Create a paginated API response.
 */
export const paginated = <T>(
  data: readonly T[],
  pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
  }
): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError> =>
  success(data, {
    pagination: {
      ...pagination,
      hasMore: pagination.page * pagination.limit < pagination.total,
    },
  });
