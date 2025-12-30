/**
 * @gello/auth-core - HasApiTokens Mixin
 *
 * Mixin for user models to add token management capabilities.
 */

import { Effect } from "effect"
import type { UserId, PersonalAccessToken, NewAccessToken, TokenId } from "../domain/types.js"
import { TokenServiceTag } from "../services/TokenService.js"

/**
 * Interface for objects that have API tokens
 */
export interface HasApiTokens {
  readonly id: UserId

  /**
   * Create a new API token for this user
   */
  createToken(
    name: string,
    scopes?: string[],
    expiresAt?: Date
  ): Effect.Effect<NewAccessToken, never, TokenServiceTag>

  /**
   * Get all tokens for this user
   */
  tokens(): Effect.Effect<ReadonlyArray<PersonalAccessToken>, never, TokenServiceTag>

  /**
   * Revoke a specific token
   */
  revokeToken(tokenId: TokenId): Effect.Effect<void, never, TokenServiceTag>

  /**
   * Revoke all tokens for this user
   */
  revokeAllTokens(): Effect.Effect<number, never, TokenServiceTag>
}

/**
 * Add HasApiTokens methods to a user object
 */
export function withApiTokens<T extends { id: UserId }>(user: T): T & HasApiTokens {
  return {
    ...user,

    createToken(name: string, scopes?: string[], expiresAt?: Date) {
      return Effect.gen(function* () {
        const tokenService = yield* TokenServiceTag
        return yield* tokenService.createToken(user.id, name, scopes, expiresAt)
      })
    },

    tokens() {
      return Effect.gen(function* () {
        const tokenService = yield* TokenServiceTag
        return yield* tokenService.getUserTokens(user.id)
      })
    },

    revokeToken(tokenId: TokenId) {
      return Effect.gen(function* () {
        const tokenService = yield* TokenServiceTag
        return yield* tokenService.revokeToken(tokenId).pipe(
          Effect.catchAll(() => Effect.void)
        )
      })
    },

    revokeAllTokens() {
      return Effect.gen(function* () {
        const tokenService = yield* TokenServiceTag
        return yield* tokenService.revokeAllTokens(user.id)
      })
    },
  }
}

/**
 * Type guard to check if an object has API tokens capability
 */
export function hasApiTokens(obj: unknown): obj is HasApiTokens {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "createToken" in obj &&
    "tokens" in obj
  )
}
