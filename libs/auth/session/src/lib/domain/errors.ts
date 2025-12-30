/**
 * @gello/auth-session - Error Types
 *
 * Tagged error types for the session system.
 */

import { Data } from "effect"
import type { SessionId } from "./types.js"

/**
 * Base session error
 */
export class SessionError extends Data.TaggedError("SessionError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * Session not found
 */
export class SessionNotFoundError extends Data.TaggedError("SessionNotFoundError")<{
  readonly message: string
  readonly sessionId?: SessionId
}> {}

/**
 * Session expired
 */
export class SessionExpiredError extends Data.TaggedError("SessionExpiredError")<{
  readonly message: string
  readonly sessionId: SessionId
  readonly expiredAt: Date
}> {}

/**
 * Invalid CSRF token
 */
export class CsrfMismatchError extends Data.TaggedError("CsrfMismatchError")<{
  readonly message: string
}> {}

/**
 * JWT-related errors
 */
export class JwtError extends Data.TaggedError("JwtError")<{
  readonly message: string
  readonly reason: "invalid" | "expired" | "malformed"
  readonly cause?: unknown
}> {}

/**
 * Union of all session-related errors
 */
export type SessionSystemError =
  | SessionError
  | SessionNotFoundError
  | SessionExpiredError
  | CsrfMismatchError
  | JwtError
