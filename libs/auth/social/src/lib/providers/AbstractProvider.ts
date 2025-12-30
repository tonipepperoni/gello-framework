/**
 * @gello/auth-social - Abstract Provider
 *
 * Base implementation for OAuth providers.
 */

import { Effect } from "effect"
import type { SocialProvider, SocialProviderConfig, SocialProviderBuilder } from "../ports/SocialProvider.js"
import type { SocialUser } from "../domain/SocialUser.js"
import type { SocialToken } from "../domain/SocialToken.js"
import { SocialToken as SocialTokenUtils } from "../domain/SocialToken.js"
import {
  OAuthTokenError,
  OAuthUserError,
  OAuthStateMismatchError,
} from "../domain/errors.js"

/**
 * Abstract base class for OAuth providers
 */
export abstract class AbstractProvider implements SocialProvider {
  protected config: SocialProviderConfig
  abstract readonly name: string

  constructor(config: SocialProviderConfig) {
    this.config = config
  }

  /**
   * Authorization endpoint URL
   */
  protected abstract get authorizationUrl(): string

  /**
   * Token endpoint URL
   */
  protected abstract get tokenUrl(): string

  /**
   * User info endpoint URL
   */
  protected abstract get userInfoUrl(): string

  /**
   * Default scopes for this provider
   */
  protected abstract get defaultScopes(): string[]

  /**
   * Parse user data from API response
   */
  protected abstract parseUser(data: Record<string, unknown>): SocialUser

  /**
   * Build the authorization URL
   */
  getAuthorizationUrl(scopes: string[], state: string): string {
    const allScopes = [...new Set([...this.defaultScopes, ...scopes])]
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: allScopes.join(" "),
      state,
    })

    return `${this.authorizationUrl}?${params.toString()}`
  }

  /**
   * Exchange code for access token
   */
  getAccessToken(code: string): Effect.Effect<SocialToken, OAuthTokenError> {
    return Effect.tryPromise({
      try: async () => {
        const response = await fetch(this.tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: new URLSearchParams({
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            code,
            redirect_uri: this.config.redirectUri,
            grant_type: "authorization_code",
          }),
        })

        if (!response.ok) {
          const error = await response.json().catch(() => ({})) as Record<string, unknown>
          throw new OAuthTokenError({
            message: "Failed to exchange code for token",
            provider: this.name,
            error: error["error"] as string | undefined,
            errorDescription: error["error_description"] as string | undefined,
          })
        }

        const data = await response.json() as Record<string, unknown>
        return SocialTokenUtils.make({
          accessToken: data["access_token"] as string,
          refreshToken: data["refresh_token"] as string | undefined,
          expiresIn: data["expires_in"] as number | undefined,
          tokenType: data["token_type"] as string | undefined,
          scope: data["scope"] as string | undefined,
        })
      },
      catch: (e) => {
        if (e instanceof OAuthTokenError) return e
        return new OAuthTokenError({
          message: "Failed to exchange code for token",
          provider: this.name,
          error: String(e),
        })
      },
    })
  }

  /**
   * Refresh access token
   */
  refreshToken(refreshToken: string): Effect.Effect<SocialToken, OAuthTokenError> {
    return Effect.tryPromise({
      try: async () => {
        const response = await fetch(this.tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: new URLSearchParams({
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
          }),
        })

        if (!response.ok) {
          const error = await response.json().catch(() => ({})) as Record<string, unknown>
          throw new OAuthTokenError({
            message: "Failed to refresh token",
            provider: this.name,
            error: error["error"] as string | undefined,
            errorDescription: error["error_description"] as string | undefined,
          })
        }

        const data = await response.json() as Record<string, unknown>
        return SocialTokenUtils.make({
          accessToken: data["access_token"] as string,
          refreshToken: (data["refresh_token"] as string | undefined) ?? refreshToken,
          expiresIn: data["expires_in"] as number | undefined,
          tokenType: data["token_type"] as string | undefined,
          scope: data["scope"] as string | undefined,
        })
      },
      catch: (e) => {
        if (e instanceof OAuthTokenError) return e
        return new OAuthTokenError({
          message: "Failed to refresh token",
          provider: this.name,
          error: String(e),
        })
      },
    })
  }

  /**
   * Get user information
   */
  getUser(token: SocialToken): Effect.Effect<SocialUser, OAuthUserError> {
    return Effect.tryPromise({
      try: async () => {
        const response = await fetch(this.userInfoUrl, {
          headers: {
            Authorization: `${token.tokenType} ${token.accessToken}`,
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          throw new OAuthUserError({
            message: "Failed to fetch user info",
            provider: this.name,
          })
        }

        const data = await response.json() as Record<string, unknown>
        return this.parseUser(data)
      },
      catch: (e) => {
        if (e instanceof OAuthUserError) return e
        return new OAuthUserError({
          message: "Failed to fetch user info",
          provider: this.name,
          cause: e,
        })
      },
    })
  }

  /**
   * Create a builder for fluent API
   */
  builder(): SocialProviderBuilder {
    let additionalScopes: string[] = []
    let isStateless = false
    let storedState: string | null = null

    const provider = this

    const builder: SocialProviderBuilder = {
      scopes: (scopes) => {
        additionalScopes = scopes
        return builder
      },

      stateless: () => {
        isStateless = true
        return builder
      },

      redirect: () =>
        Effect.sync(() => {
          storedState = crypto.randomUUID()
          return provider.getAuthorizationUrl(additionalScopes, storedState)
        }),

      user: (code, state) =>
        Effect.gen(function* () {
          // Verify state unless stateless
          if (!isStateless && storedState && state !== storedState) {
            return yield* Effect.fail(
              new OAuthStateMismatchError({
                message: "OAuth state mismatch",
                provider: provider.name,
              })
            )
          }

          const token = yield* provider.getAccessToken(code)
          const user = yield* provider.getUser(token)

          return { user, token }
        }),
    }

    return builder
  }
}
