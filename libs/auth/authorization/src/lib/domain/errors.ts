/**
 * @gello/auth-authorization - Error Types
 *
 * Tagged error types for the authorization system.
 */

import { Data } from "effect"
import type { Action, Rule } from "./types.js"

/**
 * Base authorization error
 */
export class AuthorizationError extends Data.TaggedError("AuthorizationError")<{
  readonly message: string
  readonly action: Action
  readonly subject: string
  readonly reason?: string
}> {}

/**
 * Access denied - user cannot perform action
 */
export class ForbiddenError extends Data.TaggedError("ForbiddenError")<{
  readonly message: string
  readonly action: Action
  readonly subject: string
  readonly rule?: Rule
}> {}

/**
 * Union of all authorization-related errors
 */
export type AuthorizationSystemError = AuthorizationError | ForbiddenError
