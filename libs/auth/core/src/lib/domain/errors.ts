/**
 * @gello/auth-core - Error Types
 *
 * Tagged error types for the authentication system.
 */

import { Data } from "effect"
import type { TokenId, UserId } from "./types.js"

/**
 * Base authentication error
 */
export class AuthError extends Data.TaggedError("AuthError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * Authentication failed (invalid credentials, token, or session)
 */
export class AuthenticationError extends Data.TaggedError("AuthenticationError")<{
  readonly message: string
  readonly reason: "invalid_credentials" | "invalid_token" | "expired_token" | "missing_token" | "session_expired"
}> {}

/**
 * Token not found in store
 */
export class TokenNotFoundError extends Data.TaggedError("TokenNotFoundError")<{
  readonly message: string
  readonly tokenId?: TokenId
}> {}

/**
 * Token has expired
 */
export class TokenExpiredError extends Data.TaggedError("TokenExpiredError")<{
  readonly message: string
  readonly tokenId: TokenId
  readonly expiredAt: Date
}> {}

/**
 * Token lacks required scope
 */
export class InsufficientScopeError extends Data.TaggedError("InsufficientScopeError")<{
  readonly message: string
  readonly required: ReadonlyArray<string>
  readonly provided: ReadonlyArray<string>
}> {}

/**
 * User not found
 */
export class UserNotFoundError extends Data.TaggedError("UserNotFoundError")<{
  readonly message: string
  readonly userId?: UserId
}> {}

/**
 * Password hashing error
 */
export class HashingError extends Data.TaggedError("HashingError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * Invalid password format or mismatch
 */
export class InvalidPasswordError extends Data.TaggedError("InvalidPasswordError")<{
  readonly message: string
}> {}

/**
 * Rate limit exceeded for auth attempts
 */
export class RateLimitError extends Data.TaggedError("RateLimitError")<{
  readonly message: string
  readonly retryAfter: number // seconds
}> {}

/**
 * Union of all auth-related errors
 */
export type AuthSystemError =
  | AuthError
  | AuthenticationError
  | TokenNotFoundError
  | TokenExpiredError
  | InsufficientScopeError
  | UserNotFoundError
  | HashingError
  | InvalidPasswordError
  | RateLimitError
