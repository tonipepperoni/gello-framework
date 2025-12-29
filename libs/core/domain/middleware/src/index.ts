/**
 * @gello/core-domain-middleware
 *
 * Middleware primitives and built-in middleware for the Gello framework.
 *
 * This module provides:
 * - Middleware type definitions
 * - Middleware composition utilities
 * - Built-in middleware (CORS, logging, timing, error handling)
 */

// Core middleware types
export {
  type Middleware,
  type ConditionalMiddleware,
  type MiddlewareFactory,
  type ErrorMiddleware,
  createMiddleware,
  createWrapperMiddleware,
  identity,
} from './Middleware.js';

// Composition utilities
export {
  compose,
  composeAll,
  applyMiddleware,
  applyAll,
  pipeline,
  when,
  whenEffect,
} from './compose.js';

// CORS middleware
export {
  type CorsConfig,
  type CorsHeaders,
  type CorsContext,
  CorsConfigSchema,
  defaultCorsConfig,
  generateCorsHeaders,
  isOriginAllowed,
  cors,
  strictCors,
} from './cors.js';

// Logging middleware
export {
  type LogLevel,
  type LoggingConfig,
  type LogEntry,
  defaultLoggingConfig,
  redactHeaders,
  formatLogEntry,
  logging,
  debugLogging,
  productionLogging,
} from './logging.js';

// Timing middleware
export {
  type RequestTiming,
  type TimingConfig,
  TimingContext,
  defaultTimingConfig,
  createTiming,
  getElapsedMs,
  getElapsedNs,
  getStartTime,
  timing,
  timed,
  benchmark,
} from './timing.js';

// Error handling middleware
export {
  type ErrorHandlerConfig,
  defaultErrorHandlerConfig,
  toHttpError,
  extractCauseInfo,
  errorHandler,
  catchError,
  catchAllAsHttpError,
  errorBoundary,
  developmentErrorHandler,
  productionErrorHandler,
} from './errorHandler.js';
