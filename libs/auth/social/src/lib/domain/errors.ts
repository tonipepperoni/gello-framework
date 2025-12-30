/**
 * @gello/auth-social - Error Types
 *
 * Tagged error types for the OAuth system.
 */

import { Data } from "effect"

/**
 * Base OAuth error
 */
export class OAuthError extends Data.TaggedError("OAuthError")<{
  readonly message: string
  readonly provider: string
  readonly cause?: unknown
}> {}

/**
 * OAuth provider configuration error
 */
export class OAuthConfigError extends Data.TaggedError("OAuthConfigError")<{
  readonly message: string
  readonly provider: string
  readonly field?: string
}> {}

/**
 * OAuth state mismatch (CSRF protection)
 */
export class OAuthStateMismatchError extends Data.TaggedError("OAuthStateMismatchError")<{
  readonly message: string
  readonly provider: string
}> {}

/**
 * OAuth token exchange failed
 */
export class OAuthTokenError extends Data.TaggedError("OAuthTokenError")<{
  readonly message: string
  readonly provider: string
  readonly error?: string
  readonly errorDescription?: string
}> {}

/**
 * Failed to fetch user from provider
 */
export class OAuthUserError extends Data.TaggedError("OAuthUserError")<{
  readonly message: string
  readonly provider: string
  readonly cause?: unknown
}> {}

/**
 * Provider not configured
 */
export class OAuthProviderNotFoundError extends Data.TaggedError("OAuthProviderNotFoundError")<{
  readonly message: string
  readonly provider: string
}> {}

/**
 * Union of all OAuth-related errors
 */
export type OAuthSystemError =
  | OAuthError
  | OAuthConfigError
  | OAuthStateMismatchError
  | OAuthTokenError
  | OAuthUserError
  | OAuthProviderNotFoundError
