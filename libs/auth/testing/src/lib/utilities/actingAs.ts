/**
 * @gello/auth-testing - Acting As
 *
 * Test utilities for authenticating as a user.
 */

import { Effect, Layer } from "effect"
import {
  type AuthenticatedUser,
  type UserId,
  type PersonalAccessToken,
  AuthenticatedUserTag,
  TokenId,
  HashedToken,
} from "@gello/auth-core"

/**
 * Options for actingAs
 */
export interface ActingAsOptions {
  /**
   * Token scopes (default: ['*'])
   */
  scopes?: string[]

  /**
   * Token name
   */
  tokenName?: string
}

/**
 * Create an authenticated user for testing
 */
export const createAuthenticatedUser = (
  userId: UserId,
  options: ActingAsOptions = {}
): AuthenticatedUser => {
  const scopes = options.scopes ?? ["*"]
  const tokenName = options.tokenName ?? "test-token"

  const token: PersonalAccessToken = {
    id: TokenId(crypto.randomUUID()),
    userId,
    name: tokenName,
    token: HashedToken("test-hashed-token"),
    scopes,
    createdAt: new Date(),
  }

  return {
    id: userId,
    token,
  }
}

/**
 * Create a layer that provides an authenticated user
 *
 * @example
 * ```typescript
 * const testUser = createMockUser({ email: 'test@example.com' })
 *
 * const result = yield* myEffect.pipe(
 *   Effect.provide(actingAsLayer(testUser.id, { scopes: ['read'] }))
 * )
 * ```
 */
export const actingAsLayer = (
  userId: UserId,
  options: ActingAsOptions = {}
): Layer.Layer<AuthenticatedUserTag> => {
  const user = createAuthenticatedUser(userId, options)
  return Layer.succeed(AuthenticatedUserTag, user)
}

/**
 * Run an effect as an authenticated user
 *
 * @example
 * ```typescript
 * yield* actingAs(testUser.id, { scopes: ['read'] }, myEffect)
 * ```
 */
export const actingAs = <A, E, R>(
  userId: UserId,
  options: ActingAsOptions,
  effect: Effect.Effect<A, E, R>
): Effect.Effect<A, E, Exclude<R, AuthenticatedUserTag>> => {
  return effect.pipe(Effect.provide(actingAsLayer(userId, options))) as Effect.Effect<
    A,
    E,
    Exclude<R, AuthenticatedUserTag>
  >
}

/**
 * Auth testing utilities namespace
 */
export const Auth = {
  /**
   * Run an effect as an authenticated user
   */
  actingAs: <A, E, R>(
    userId: UserId,
    effect: Effect.Effect<A, E, R>,
    options: ActingAsOptions = {}
  ): Effect.Effect<A, E, Exclude<R, AuthenticatedUserTag>> => {
    return actingAs(userId, options, effect)
  },

  /**
   * Create a layer for authenticated user
   */
  actingAsLayer,
}
