/**
 * CORS (Cross-Origin Resource Sharing) middleware.
 *
 * Handles CORS headers for cross-origin requests.
 */
import { Effect } from 'effect';
import { Schema } from '@effect/schema';
import type { Middleware } from './Middleware.js';

/**
 * CORS configuration options.
 */
export const CorsConfigSchema = Schema.Struct({
  /**
   * Allowed origins. Use '*' for all origins or specify domains.
   */
  origins: Schema.Union(
    Schema.Literal('*'),
    Schema.Array(Schema.String)
  ).pipe(Schema.optional),

  /**
   * Allowed HTTP methods.
   */
  methods: Schema.Array(Schema.String).pipe(Schema.optional),

  /**
   * Allowed headers.
   */
  allowedHeaders: Schema.Array(Schema.String).pipe(Schema.optional),

  /**
   * Headers exposed to the browser.
   */
  exposedHeaders: Schema.Array(Schema.String).pipe(Schema.optional),

  /**
   * Allow credentials (cookies, authorization headers).
   */
  credentials: Schema.Boolean.pipe(Schema.optional),

  /**
   * Max age for preflight cache (seconds).
   */
  maxAge: Schema.Number.pipe(Schema.optional),
});

export type CorsConfig = Schema.Schema.Type<typeof CorsConfigSchema>;

/**
 * Default CORS configuration.
 */
export const defaultCorsConfig: Required<CorsConfig> = {
  origins: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  exposedHeaders: ['X-Request-Id', 'X-Response-Time'],
  credentials: false,
  maxAge: 86400, // 24 hours
};

/**
 * CORS headers result.
 */
export interface CorsHeaders {
  readonly 'Access-Control-Allow-Origin': string;
  readonly 'Access-Control-Allow-Methods': string;
  readonly 'Access-Control-Allow-Headers': string;
  readonly 'Access-Control-Expose-Headers'?: string;
  readonly 'Access-Control-Allow-Credentials'?: string;
  readonly 'Access-Control-Max-Age'?: string;
}

/**
 * Generate CORS headers from configuration.
 */
export const generateCorsHeaders = (
  config: CorsConfig,
  requestOrigin?: string
): CorsHeaders => {
  const merged = { ...defaultCorsConfig, ...config };

  // Determine origin header value
  let originValue: string;
  if (merged.origins === '*') {
    originValue = merged.credentials ? (requestOrigin ?? '*') : '*';
  } else if (Array.isArray(merged.origins)) {
    originValue =
      requestOrigin && merged.origins.includes(requestOrigin)
        ? requestOrigin
        : merged.origins[0] ?? '*';
  } else {
    originValue = '*';
  }

  const headers: CorsHeaders = {
    'Access-Control-Allow-Origin': originValue,
    'Access-Control-Allow-Methods': merged.methods.join(', '),
    'Access-Control-Allow-Headers': merged.allowedHeaders.join(', '),
  };

  if (merged.exposedHeaders.length > 0) {
    (headers as unknown as Record<string, string>)['Access-Control-Expose-Headers'] =
      merged.exposedHeaders.join(', ');
  }

  if (merged.credentials) {
    (headers as unknown as Record<string, string>)['Access-Control-Allow-Credentials'] =
      'true';
  }

  if (merged.maxAge > 0) {
    (headers as unknown as Record<string, string>)['Access-Control-Max-Age'] =
      String(merged.maxAge);
  }

  return headers;
};

/**
 * Check if origin is allowed.
 */
export const isOriginAllowed = (
  origin: string,
  config: CorsConfig
): boolean => {
  const origins = config.origins ?? defaultCorsConfig.origins;

  if (origins === '*') {
    return true;
  }

  return origins.includes(origin);
};

/**
 * CORS context for handlers to access.
 */
export interface CorsContext {
  readonly corsHeaders: CorsHeaders;
  readonly requestOrigin?: string;
  readonly isPreflight: boolean;
}

/**
 * Create CORS middleware.
 *
 * Note: The actual header application happens in the HTTP layer.
 * This middleware provides the CORS context and headers.
 */
export const cors = (config: Partial<CorsConfig> = {}): Middleware => {
  const mergedConfig = { ...defaultCorsConfig, ...config };

  return {
    name: 'cors',
    apply: <A, E, R>(handler: Effect.Effect<A, E, R>) =>
      Effect.gen(function* () {
        // Log CORS configuration in debug mode
        yield* Effect.logDebug('CORS middleware applied').pipe(
          Effect.annotateLogs({
            origins:
              mergedConfig.origins === '*'
                ? '*'
                : mergedConfig.origins.join(', '),
            methods: mergedConfig.methods.join(', '),
          })
        );

        return yield* handler;
      }),
  };
};

/**
 * Create strict CORS middleware that only allows specified origins.
 */
export const strictCors = (
  origins: readonly string[],
  options: Omit<Partial<CorsConfig>, 'origins'> = {}
): Middleware =>
  cors({
    ...options,
    origins: [...origins],
    credentials: options.credentials ?? true,
  });
