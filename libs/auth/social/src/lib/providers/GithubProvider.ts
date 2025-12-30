/**
 * @gello/auth-social - GitHub Provider
 *
 * OAuth implementation for GitHub.
 */

import { AbstractProvider } from "./AbstractProvider.js"
import type { SocialProviderConfig } from "../ports/SocialProvider.js"
import { SocialUser } from "../domain/SocialUser.js"

/**
 * GitHub OAuth provider
 */
export class GithubProvider extends AbstractProvider {
  readonly name = "github"

  protected get authorizationUrl(): string {
    return "https://github.com/login/oauth/authorize"
  }

  protected get tokenUrl(): string {
    return "https://github.com/login/oauth/access_token"
  }

  protected get userInfoUrl(): string {
    return "https://api.github.com/user"
  }

  protected get defaultScopes(): string[] {
    return ["user:email"]
  }

  protected override parseUser(data: Record<string, unknown>): SocialUser {
    return SocialUser.make("github", {
      id: String(data["id"]),
      email: data["email"] as string | null,
      name: data["name"] as string | null,
      nickname: data["login"] as string | null,
      avatar: data["avatar_url"] as string | null,
      raw: data,
    })
  }
}

/**
 * Create a GitHub provider instance
 */
export const createGithubProvider = (config: SocialProviderConfig): GithubProvider => {
  return new GithubProvider(config)
}
