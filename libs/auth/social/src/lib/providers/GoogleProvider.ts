/**
 * @gello/auth-social - Google Provider
 *
 * OAuth implementation for Google.
 */

import { AbstractProvider } from "./AbstractProvider.js"
import type { SocialProviderConfig } from "../ports/SocialProvider.js"
import { SocialUser } from "../domain/SocialUser.js"

/**
 * Google OAuth provider
 */
export class GoogleProvider extends AbstractProvider {
  readonly name = "google"

  protected get authorizationUrl(): string {
    return "https://accounts.google.com/o/oauth2/v2/auth"
  }

  protected get tokenUrl(): string {
    return "https://oauth2.googleapis.com/token"
  }

  protected get userInfoUrl(): string {
    return "https://www.googleapis.com/oauth2/v2/userinfo"
  }

  protected get defaultScopes(): string[] {
    return ["openid", "email", "profile"]
  }

  protected override parseUser(data: Record<string, unknown>): SocialUser {
    return SocialUser.make("google", {
      id: data["id"] as string,
      email: data["email"] as string | null,
      name: data["name"] as string | null,
      firstName: data["given_name"] as string | null,
      lastName: data["family_name"] as string | null,
      avatar: data["picture"] as string | null,
      raw: data,
    })
  }

  /**
   * Override to add Google-specific parameters
   */
  override getAuthorizationUrl(scopes: string[], state: string): string {
    const allScopes = [...new Set([...this.defaultScopes, ...scopes])]
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: allScopes.join(" "),
      state,
      access_type: "offline", // Get refresh token
      prompt: "consent", // Force consent screen
    })

    return `${this.authorizationUrl}?${params.toString()}`
  }
}

/**
 * Create a Google provider instance
 */
export const createGoogleProvider = (config: SocialProviderConfig): GoogleProvider => {
  return new GoogleProvider(config)
}
