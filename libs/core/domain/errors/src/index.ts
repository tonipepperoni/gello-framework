/**
 * @gello/core-domain-errors
 *
 * Extended error types with helper methods for HTTP error handling.
 * Re-exports base errors from contracts and adds utilities.
 */

// Re-export base errors from contracts
export {
  HttpError,
  ValidationError,
  ConfigError,
  RouteNotFoundError,
  MiddlewareError,
  type FieldError,
} from "@gello/core-contracts";

export * from "./HttpErrorHelpers.js";
export * from "./ErrorResponse.js";
