/**
 * @gello/auth-social - Social Provider Port
 *
 * Contract for OAuth provider implementations.
 */

import { Effect } from "effect"
import type { SocialUser } from "../domain/SocialUser.js"
import type { SocialToken } from "../domain/SocialToken.js"
import type { OAuthTokenError, OAuthUserError, OAuthStateMismatchError } from "../domain/errors.js"

/**
 * OAuth provider configuration
 */
export interface SocialProviderConfig {
  /**
   * OAuth client ID
   */
  readonly clientId: string

  /**
   * OAuth client secret
   */
  readonly clientSecret: string

  /**
   * Redirect URI for OAuth callback
   */
  readonly redirectUri: string

  /**
   * Additional provider-specific options
   */
  readonly options?: Record<string, unknown>
}

/**
 * OAuth provider interface
 */
export interface SocialProvider {
  /**
   * Provider name (e.g., 'github', 'google')
   */
  readonly name: string

  /**
   * Get the authorization URL for redirecting the user
   */
  readonly getAuthorizationUrl: (
    scopes: string[],
    state: string
  ) => string

  /**
   * Exchange authorization code for tokens
   */
  readonly getAccessToken: (
    code: string
  ) => Effect.Effect<SocialToken, OAuthTokenError>

  /**
   * Refresh an access token
   */
  readonly refreshToken: (
    refreshToken: string
  ) => Effect.Effect<SocialToken, OAuthTokenError>

  /**
   * Get user information using access token
   */
  readonly getUser: (
    token: SocialToken
  ) => Effect.Effect<SocialUser, OAuthUserError>
}

/**
 * Social provider builder for fluent API
 */
export interface SocialProviderBuilder {
  /**
   * Set additional scopes
   */
  readonly scopes: (scopes: string[]) => SocialProviderBuilder

  /**
   * Enable stateless mode (skip state verification)
   */
  readonly stateless: () => SocialProviderBuilder

  /**
   * Get redirect URL for OAuth flow
   */
  readonly redirect: () => Effect.Effect<string>

  /**
   * Exchange code for user (full flow)
   */
  readonly user: (
    code: string,
    state?: string
  ) => Effect.Effect<{ user: SocialUser; token: SocialToken }, OAuthTokenError | OAuthUserError | OAuthStateMismatchError>
}
