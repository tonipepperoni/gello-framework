/**
 * Request helpers for extracting data from HTTP requests.
 *
 * Provides Effect-based utilities for parsing request data.
 */
import { Effect } from 'effect';
import { HttpServerRequest } from '@effect/platform';
import { Schema } from '@effect/schema';
import { ValidationError } from '@gello/core-contracts';

/**
 * Get the current request from context.
 */
export const getRequest = HttpServerRequest.HttpServerRequest;

/**
 * Get the request URL.
 */
export const getUrl = Effect.map(
  HttpServerRequest.HttpServerRequest,
  (req) => new URL(req.url, `http://${req.headers.host ?? 'localhost'}`)
);

/**
 * Get the request method.
 */
export const getMethod = Effect.map(
  HttpServerRequest.HttpServerRequest,
  (req) => req.method
);

/**
 * Get the request path.
 */
export const getPath = Effect.map(getUrl, (url) => url.pathname);

/**
 * Get a specific header value.
 */
export const getHeader = (
  name: string
): Effect.Effect<string | undefined, never, HttpServerRequest.HttpServerRequest> =>
  Effect.map(HttpServerRequest.HttpServerRequest, (req) =>
    req.headers[name.toLowerCase()]
  );

/**
 * Get a required header or fail.
 */
export const getRequiredHeader = (
  name: string
): Effect.Effect<string, ValidationError, HttpServerRequest.HttpServerRequest> =>
  Effect.flatMap(getHeader(name), (value) =>
    value !== undefined
      ? Effect.succeed(value)
      : Effect.fail(
          ValidationError.single(
            `headers.${name}`,
            `Missing required header: ${name}`,
            'REQUIRED'
          )
        )
  );

/**
 * Get all headers.
 */
export const getHeaders = Effect.map(
  HttpServerRequest.HttpServerRequest,
  (req) => req.headers
);

/**
 * Get query parameters.
 */
export const getQueryParams = Effect.map(
  getUrl,
  (url) => Object.fromEntries(url.searchParams.entries())
);

/**
 * Get a specific query parameter.
 */
export const getQueryParam = (
  name: string
): Effect.Effect<string | undefined, never, HttpServerRequest.HttpServerRequest> =>
  Effect.map(getUrl, (url) => url.searchParams.get(name) ?? undefined);

/**
 * Get a required query parameter or fail.
 */
export const getRequiredQueryParam = (
  name: string
): Effect.Effect<string, ValidationError, HttpServerRequest.HttpServerRequest> =>
  Effect.flatMap(getQueryParam(name), (value) =>
    value !== undefined
      ? Effect.succeed(value)
      : Effect.fail(
          ValidationError.single(
            `query.${name}`,
            `Missing required query parameter: ${name}`,
            'REQUIRED'
          )
        )
  );

/**
 * Parse request body as JSON.
 */
export const getJsonBody = <A>(
  schema?: Schema.Schema<A>
): Effect.Effect<A, ValidationError, HttpServerRequest.HttpServerRequest> =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest;

    // Get body as text from the request
    const bodyText = yield* request.text.pipe(
      Effect.mapError(() =>
        ValidationError.single('body', 'Failed to read request body', 'READ_ERROR')
      )
    );

    if (!bodyText || bodyText.trim() === '') {
      return yield* Effect.fail(
        ValidationError.single('body', 'Request body is empty', 'REQUIRED')
      );
    }

    // Parse JSON
    const parsed = yield* Effect.try({
      try: () => JSON.parse(bodyText),
      catch: () =>
        ValidationError.single('body', 'Invalid JSON in request body', 'INVALID_JSON'),
    });

    // Validate with schema if provided
    if (schema) {
      const decode = Schema.decodeUnknown(schema);
      const result = yield* decode(parsed).pipe(
        Effect.mapError(() =>
          ValidationError.single('body', 'Request body validation failed', 'VALIDATION')
        )
      );
      return result;
    }

    return parsed as A;
  });

/**
 * Get content type header.
 */
export const getContentType = getHeader('content-type');

/**
 * Check if request has JSON content type.
 */
export const isJsonRequest = Effect.map(getContentType, (ct) =>
  ct?.includes('application/json') ?? false
);

/**
 * Get authorization header.
 */
export const getAuthorization = getHeader('authorization');

/**
 * Get bearer token from authorization header.
 */
export const getBearerToken = Effect.flatMap(getAuthorization, (auth) => {
  if (!auth || !auth.startsWith('Bearer ')) {
    return Effect.succeed(undefined as string | undefined);
  }
  return Effect.succeed(auth.slice(7));
});

/**
 * Get required bearer token or fail.
 */
export const getRequiredBearerToken = Effect.flatMap(
  getBearerToken,
  (token) =>
    token !== undefined
      ? Effect.succeed(token)
      : Effect.fail(
          ValidationError.single(
            'headers.authorization',
            'Missing or invalid Authorization header',
            'UNAUTHORIZED'
          )
        )
);

/**
 * Get request ID from headers (X-Request-Id or X-Correlation-Id).
 */
export const getRequestId = Effect.flatMap(
  getHeader('x-request-id'),
  (id) =>
    id !== undefined
      ? Effect.succeed(id)
      : getHeader('x-correlation-id').pipe(
          Effect.map((id) => id ?? crypto.randomUUID())
        )
);
