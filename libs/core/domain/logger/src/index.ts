/**
 * @gello/domain-logger
 *
 * Domain layer for logging containing:
 * - Error formatting with Effect Cause support
 * - Log formatters (simple, JSON, pretty)
 * - Logger implementation
 */

// Error Formatter
export {
  errorFormatter,
  formatUnknownError,
  formatStackTrace,
  extractCause,
  prettyPrintError,
} from "./ErrorFormatter.js";

// Log Formatter
export {
  Colors,
  LevelColors,
  LevelIcons,
  simpleFormatter,
  jsonFormatter,
  prettyFormatter,
  minimalFormatter,
  type JsonFormatterOptions,
  type PrettyFormatterOptions,
} from "./LogFormatter.js";

// Logger
export {
  makeLogger,
  layer,
  defaultConfig,
  withLevel,
  withService,
  withRedactKeys,
  withDefaultContext,
} from "./Logger.js";
