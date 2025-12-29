/**
 * Logging middleware for request/response logging.
 *
 * Provides structured logging for HTTP requests.
 */
import { Effect } from 'effect';
import type { Middleware } from './Middleware.js';

/**
 * Log level type.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Logging configuration.
 */
export interface LoggingConfig {
  /**
   * Log level for request logs.
   */
  readonly level: LogLevel;

  /**
   * Include request headers in logs.
   */
  readonly includeHeaders: boolean;

  /**
   * Include request body in logs (be careful with sensitive data).
   */
  readonly includeBody: boolean;

  /**
   * Include response body in logs.
   */
  readonly includeResponseBody: boolean;

  /**
   * Headers to redact from logs.
   */
  readonly redactHeaders: readonly string[];

  /**
   * Custom log formatter.
   */
  readonly formatter?: (entry: LogEntry) => string;
}

/**
 * Log entry structure.
 */
export interface LogEntry {
  readonly timestamp: Date;
  readonly requestId?: string;
  readonly method: string;
  readonly path: string;
  readonly statusCode?: number;
  readonly durationMs?: number;
  readonly headers?: Record<string, string>;
  readonly error?: unknown;
}

/**
 * Default logging configuration.
 */
export const defaultLoggingConfig: LoggingConfig = {
  level: 'info',
  includeHeaders: false,
  includeBody: false,
  includeResponseBody: false,
  redactHeaders: ['authorization', 'cookie', 'x-api-key'],
};

/**
 * Redact sensitive headers from log entry.
 */
export const redactHeaders = (
  headers: Record<string, string>,
  redactList: readonly string[]
): Record<string, string> => {
  const redacted: Record<string, string> = {};
  const lowerRedactList = redactList.map((h) => h.toLowerCase());

  for (const [key, value] of Object.entries(headers)) {
    if (lowerRedactList.includes(key.toLowerCase())) {
      redacted[key] = '[REDACTED]';
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
};

/**
 * Format log entry to string.
 */
export const formatLogEntry = (entry: LogEntry): string => {
  const parts = [
    `[${entry.timestamp.toISOString()}]`,
    entry.method,
    entry.path,
  ];

  if (entry.statusCode !== undefined) {
    parts.push(`-> ${entry.statusCode}`);
  }

  if (entry.durationMs !== undefined) {
    parts.push(`(${entry.durationMs}ms)`);
  }

  if (entry.requestId) {
    parts.push(`[${entry.requestId}]`);
  }

  return parts.join(' ');
};

/**
 * Create logging middleware.
 *
 * Logs request start and completion with timing.
 */
export const logging = (
  config: Partial<LoggingConfig> = {}
): Middleware => {
  const mergedConfig = { ...defaultLoggingConfig, ...config };
  const _format = mergedConfig.formatter ?? formatLogEntry;
  void _format; // Reserved for future use

  return {
    name: 'logging',
    apply: <A, E, R>(handler: Effect.Effect<A, E, R>) =>
      Effect.gen(function* () {
        const startTime = Date.now();

        // Log request start
        yield* Effect.logInfo('Request started').pipe(
          Effect.annotateLogs({
            middleware: 'logging',
            phase: 'start',
          })
        );

        // Execute handler and measure time
        const result = yield* Effect.either(handler);
        const durationMs = Date.now() - startTime;

        // Log based on success/failure
        if (result._tag === 'Left') {
          yield* Effect.logError('Request failed').pipe(
            Effect.annotateLogs({
              middleware: 'logging',
              phase: 'error',
              durationMs,
              error: String(result.left),
            })
          );
          return yield* Effect.fail(result.left);
        }

        yield* Effect.logInfo('Request completed').pipe(
          Effect.annotateLogs({
            middleware: 'logging',
            phase: 'complete',
            durationMs,
          })
        );

        return result.right;
      }),
  };
};

/**
 * Create debug logging middleware with verbose output.
 */
export const debugLogging = (): Middleware =>
  logging({
    level: 'debug',
    includeHeaders: true,
    includeBody: true,
    includeResponseBody: true,
  });

/**
 * Create production logging middleware with minimal output.
 */
export const productionLogging = (): Middleware =>
  logging({
    level: 'info',
    includeHeaders: false,
    includeBody: false,
    includeResponseBody: false,
    redactHeaders: [
      'authorization',
      'cookie',
      'x-api-key',
      'x-auth-token',
      'set-cookie',
    ],
  });
