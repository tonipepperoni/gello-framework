/**
 * @gello/auth-core - Token Store Port
 *
 * Port for token persistence operations.
 */

import { Context, Effect, Option } from "effect"
import type {
  TokenId,
  UserId,
  PersonalAccessToken,
  HashedToken,
} from "../domain/types.js"
import type { TokenNotFoundError } from "../domain/errors.js"

/**
 * Token store port for persisting personal access tokens.
 */
export interface TokenStore {
  /**
   * Create a new token
   */
  readonly create: (
    token: PersonalAccessToken
  ) => Effect.Effect<PersonalAccessToken>

  /**
   * Find a token by its hashed value
   */
  readonly findByToken: (
    hashedToken: HashedToken
  ) => Effect.Effect<Option.Option<PersonalAccessToken>>

  /**
   * Find a token by its ID
   */
  readonly findById: (
    id: TokenId
  ) => Effect.Effect<Option.Option<PersonalAccessToken>>

  /**
   * Get all tokens for a user
   */
  readonly findByUser: (
    userId: UserId
  ) => Effect.Effect<ReadonlyArray<PersonalAccessToken>>

  /**
   * Update token's last used timestamp
   */
  readonly updateLastUsed: (
    id: TokenId,
    lastUsedAt: Date
  ) => Effect.Effect<void, TokenNotFoundError>

  /**
   * Delete a token by ID
   */
  readonly delete: (
    id: TokenId
  ) => Effect.Effect<void, TokenNotFoundError>

  /**
   * Delete all tokens for a user
   */
  readonly deleteByUser: (
    userId: UserId
  ) => Effect.Effect<number>

  /**
   * Delete expired tokens (garbage collection)
   */
  readonly deleteExpired: () => Effect.Effect<number>
}

/**
 * Token store service tag
 */
export class TokenStoreTag extends Context.Tag("@gello/auth/TokenStore")<
  TokenStoreTag,
  TokenStore
>() {}
