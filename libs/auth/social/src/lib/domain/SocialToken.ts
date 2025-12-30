/**
 * @gello/auth-social - Social Token
 *
 * OAuth access and refresh tokens from providers.
 */

/**
 * OAuth tokens from a provider
 */
export interface SocialToken {
  /**
   * The access token
   */
  readonly accessToken: string

  /**
   * The refresh token (if provided)
   */
  readonly refreshToken: string | null

  /**
   * Token expiration timestamp (if provided)
   */
  readonly expiresAt: Date | null

  /**
   * Token type (usually "Bearer")
   */
  readonly tokenType: string

  /**
   * Scopes granted by the token
   */
  readonly scopes: ReadonlyArray<string>
}

/**
 * Create a SocialToken from provider response
 */
export const SocialToken = {
  make: (data: {
    accessToken: string
    refreshToken?: string | null
    expiresIn?: number | null
    expiresAt?: Date | null
    tokenType?: string
    scope?: string | string[]
  }): SocialToken => ({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? null,
    expiresAt: data.expiresAt ?? (data.expiresIn
      ? new Date(Date.now() + data.expiresIn * 1000)
      : null),
    tokenType: data.tokenType ?? "Bearer",
    scopes: typeof data.scope === "string"
      ? data.scope.split(" ")
      : data.scope ?? [],
  }),

  /**
   * Check if token is expired
   */
  isExpired: (token: SocialToken): boolean => {
    if (!token.expiresAt) return false
    return new Date() > token.expiresAt
  },

  /**
   * Check if token can be refreshed
   */
  canRefresh: (token: SocialToken): boolean => {
    return token.refreshToken !== null
  },
}
