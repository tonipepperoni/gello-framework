/**
 * @gello/auth-social
 *
 * OAuth social authentication for the Gello auth system.
 */

// Domain - Value exports with type constructors
export {
  SocialUser,
} from "./lib/domain/SocialUser.js"

export {
  SocialToken,
} from "./lib/domain/SocialToken.js"

// Domain - Type-only exports
export type {
  SocialUser as SocialUserType,
} from "./lib/domain/SocialUser.js"

export type {
  SocialToken as SocialTokenType,
} from "./lib/domain/SocialToken.js"

export {
  OAuthError,
  OAuthConfigError,
  OAuthStateMismatchError,
  OAuthTokenError,
  OAuthUserError,
  OAuthProviderNotFoundError,
  type OAuthSystemError,
} from "./lib/domain/errors.js"

// Ports
export {
  type SocialProvider,
  type SocialProviderConfig,
  type SocialProviderBuilder,
} from "./lib/ports/SocialProvider.js"

// Providers
export { AbstractProvider } from "./lib/providers/AbstractProvider.js"
export { GithubProvider, createGithubProvider } from "./lib/providers/GithubProvider.js"
export { GoogleProvider, createGoogleProvider } from "./lib/providers/GoogleProvider.js"

// Services
export {
  type SocialConfig,
  type SocialService,
  SocialTag,
  makeSocialService,
  SocialLive,
  Social,
} from "./lib/services/Social.js"
