/**
 * @gello/auth-social - Social User
 *
 * Normalized user data from OAuth providers.
 */

/**
 * User data returned from an OAuth provider
 */
export interface SocialUser {
  /**
   * Unique identifier from the provider
   */
  readonly id: string

  /**
   * User's email address (may be null if not provided)
   */
  readonly email: string | null

  /**
   * User's display name
   */
  readonly name: string | null

  /**
   * User's first name (if available)
   */
  readonly firstName: string | null

  /**
   * User's last name (if available)
   */
  readonly lastName: string | null

  /**
   * URL to user's avatar/profile picture
   */
  readonly avatar: string | null

  /**
   * User's nickname/username on the provider
   */
  readonly nickname: string | null

  /**
   * The OAuth provider name
   */
  readonly provider: string

  /**
   * Raw response data from the provider
   */
  readonly raw: Record<string, unknown>
}

/**
 * Create a SocialUser from provider data
 */
export const SocialUser = {
  make: (
    provider: string,
    data: {
      id: string
      email?: string | null
      name?: string | null
      firstName?: string | null
      lastName?: string | null
      avatar?: string | null
      nickname?: string | null
      raw?: Record<string, unknown>
    }
  ): SocialUser => ({
    id: data.id,
    email: data.email ?? null,
    name: data.name ?? null,
    firstName: data.firstName ?? null,
    lastName: data.lastName ?? null,
    avatar: data.avatar ?? null,
    nickname: data.nickname ?? null,
    provider,
    raw: data.raw ?? {},
  }),
}
