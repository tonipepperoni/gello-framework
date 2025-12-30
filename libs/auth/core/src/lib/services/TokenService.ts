/**
 * @gello/auth-core - Token Service
 *
 * Service for managing personal access tokens.
 */

import { Context, Effect, Layer, Option } from "effect"
import {
  TokenId,
  UserId,
  HashedToken,
  PersonalAccessToken,
  type NewAccessToken,
} from "../domain/types.js"
import {
  TokenNotFoundError,
  TokenExpiredError,
  AuthenticationError,
} from "../domain/errors.js"
import { TokenStoreTag } from "../ports/TokenStore.js"
import { TokenHasherTag } from "../ports/PasswordHasher.js"

/**
 * Token service interface
 */
export interface TokenService {
  /**
   * Create a new personal access token for a user
   */
  readonly createToken: (
    userId: UserId,
    name: string,
    scopes?: string[],
    expiresAt?: Date
  ) => Effect.Effect<NewAccessToken>

  /**
   * Verify a plain text token and return the token record
   */
  readonly verifyToken: (
    plainTextToken: string
  ) => Effect.Effect<PersonalAccessToken, AuthenticationError | TokenExpiredError>

  /**
   * Get all tokens for a user
   */
  readonly getUserTokens: (
    userId: UserId
  ) => Effect.Effect<ReadonlyArray<PersonalAccessToken>>

  /**
   * Revoke a specific token
   */
  readonly revokeToken: (
    tokenId: TokenId
  ) => Effect.Effect<void, TokenNotFoundError>

  /**
   * Revoke all tokens for a user
   */
  readonly revokeAllTokens: (
    userId: UserId
  ) => Effect.Effect<number>

  /**
   * Clean up expired tokens
   */
  readonly pruneExpiredTokens: () => Effect.Effect<number>
}

/**
 * Token service tag
 */
export class TokenServiceTag extends Context.Tag("@gello/auth/TokenService")<
  TokenServiceTag,
  TokenService
>() {}

/**
 * Live implementation of TokenService
 */
export const TokenServiceLive = Layer.effect(
  TokenServiceTag,
  Effect.gen(function* () {
    const store = yield* TokenStoreTag
    const hasher = yield* TokenHasherTag

    const service: TokenService = {
      createToken: (userId, name, scopes = ["*"], expiresAt) =>
        Effect.gen(function* () {
          const plainTextToken = PersonalAccessToken.generatePlainText()
          const hashedToken = HashedToken(hasher.hash(plainTextToken))

          const token: PersonalAccessToken = {
            id: PersonalAccessToken.generateId(),
            userId,
            name,
            token: hashedToken,
            scopes,
            expiresAt,
            createdAt: new Date(),
          }

          const savedToken = yield* store.create(token)

          return {
            accessToken: savedToken,
            plainTextToken,
          }
        }),

      verifyToken: (plainTextToken) =>
        Effect.gen(function* () {
          const hashedToken = HashedToken(hasher.hash(plainTextToken))
          const maybeToken = yield* store.findByToken(hashedToken)

          if (Option.isNone(maybeToken)) {
            return yield* Effect.fail(
              new AuthenticationError({
                message: "Invalid token",
                reason: "invalid_token",
              })
            )
          }

          const token = maybeToken.value

          if (PersonalAccessToken.isExpired(token)) {
            return yield* Effect.fail(
              new TokenExpiredError({
                message: "Token has expired",
                tokenId: token.id,
                expiredAt: token.expiresAt!,
              })
            )
          }

          // Update last used timestamp (fire and forget)
          yield* store
            .updateLastUsed(token.id, new Date())
            .pipe(Effect.catchAll(() => Effect.void))

          return token
        }),

      getUserTokens: (userId) => store.findByUser(userId),

      revokeToken: (tokenId) => store.delete(tokenId),

      revokeAllTokens: (userId) => store.deleteByUser(userId),

      pruneExpiredTokens: () => store.deleteExpired(),
    }

    return service
  })
)
