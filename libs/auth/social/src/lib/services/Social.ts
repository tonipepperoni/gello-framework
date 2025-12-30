/**
 * @gello/auth-social - Social Service
 *
 * Main service for OAuth authentication.
 */

import { Context, Effect, Layer } from "effect"
import type { SocialProvider, SocialProviderConfig, SocialProviderBuilder } from "../ports/SocialProvider.js"
import { OAuthProviderNotFoundError } from "../domain/errors.js"
import { GithubProvider } from "../providers/GithubProvider.js"
import { GoogleProvider } from "../providers/GoogleProvider.js"

/**
 * Provider factory function type
 */
type ProviderFactory = (config: SocialProviderConfig) => SocialProvider

/**
 * Social service configuration
 */
export interface SocialConfig {
  readonly providers: Record<string, SocialProviderConfig>
}

/**
 * Social service interface
 */
export interface SocialService {
  /**
   * Get a configured provider by name
   */
  readonly driver: (name: string) => SocialProviderBuilder

  /**
   * Check if a provider is configured
   */
  readonly hasProvider: (name: string) => boolean

  /**
   * Get list of configured providers
   */
  readonly providers: () => string[]
}

/**
 * Social service tag
 */
export class SocialTag extends Context.Tag("@gello/auth/Social")<
  SocialTag,
  SocialService
>() {}

/**
 * Built-in provider factories
 */
const builtInProviders: Record<string, ProviderFactory> = {
  github: (config) => new GithubProvider(config),
  google: (config) => new GoogleProvider(config),
}

/**
 * Create the Social service
 */
export const makeSocialService = (
  config: SocialConfig,
  customProviders: Record<string, ProviderFactory> = {}
): SocialService => {
  const allFactories = { ...builtInProviders, ...customProviders }
  const providerInstances = new Map<string, SocialProvider>()

  const getProvider = (name: string): SocialProvider => {
    let provider = providerInstances.get(name)
    if (provider) return provider

    const providerConfig = config.providers[name]
    if (!providerConfig) {
      throw new OAuthProviderNotFoundError({
        message: `OAuth provider "${name}" is not configured`,
        provider: name,
      })
    }

    const factory = allFactories[name]
    if (!factory) {
      throw new OAuthProviderNotFoundError({
        message: `OAuth provider "${name}" is not supported`,
        provider: name,
      })
    }

    provider = factory(providerConfig)
    providerInstances.set(name, provider)
    return provider
  }

  return {
    driver: (name) => {
      const provider = getProvider(name)
      // AbstractProvider has a builder method
      if ("builder" in provider && typeof provider.builder === "function") {
        return (provider as any).builder()
      }
      // Fallback for custom providers
      throw new Error(`Provider "${name}" does not support the builder pattern`)
    },

    hasProvider: (name) => {
      return name in config.providers && name in allFactories
    },

    providers: () => {
      return Object.keys(config.providers).filter((name) => name in allFactories)
    },
  }
}

/**
 * Create Social service layer
 */
export const SocialLive = (
  config: SocialConfig,
  customProviders?: Record<string, ProviderFactory>
) =>
  Layer.succeed(SocialTag, makeSocialService(config, customProviders))

/**
 * Convenience access to Social service
 *
 * @example
 * ```typescript
 * // Redirect to GitHub
 * const url = yield* Social.driver('github')
 *   .scopes(['user:email'])
 *   .redirect()
 *
 * // Handle callback
 * const { user, token } = yield* Social.driver('github').user(code, state)
 * ```
 */
export const Social = {
  driver: (name: string) =>
    Effect.gen(function* () {
      const social = yield* SocialTag
      return social.driver(name)
    }),

  hasProvider: (name: string) =>
    Effect.gen(function* () {
      const social = yield* SocialTag
      return social.hasProvider(name)
    }),

  providers: () =>
    Effect.gen(function* () {
      const social = yield* SocialTag
      return social.providers()
    }),
}
