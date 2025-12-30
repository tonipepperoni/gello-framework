/**
 * @gello/auth-testing - Mock Token Store
 *
 * In-memory token store for testing.
 */

import { Effect, Layer, Option } from "effect"
import type { TokenStore, PersonalAccessTokenType } from "@gello/auth-core"
import {
  TokenStoreTag,
  TokenNotFoundError,
} from "@gello/auth-core"

/**
 * Create a mock token store for testing
 */
export const makeMockTokenStore = (): TokenStore => {
  const tokens = new Map<string, PersonalAccessTokenType>()

  return {
    create: (token) =>
      Effect.sync(() => {
        tokens.set(token.id, token)
        return token
      }),

    findByToken: (hashedToken) =>
      Effect.sync(() => {
        for (const token of tokens.values()) {
          if (token.token === hashedToken) {
            return Option.some(token)
          }
        }
        return Option.none()
      }),

    findById: (id) =>
      Effect.sync(() => {
        const token = tokens.get(id)
        return token ? Option.some(token) : Option.none()
      }),

    findByUser: (userId) =>
      Effect.sync(() => {
        return Array.from(tokens.values()).filter((t) => t.userId === userId)
      }),

    updateLastUsed: (id, lastUsedAt) =>
      Effect.sync(() => {
        const token = tokens.get(id)
        if (!token) {
          throw new TokenNotFoundError({
            message: "Token not found",
            tokenId: id,
          })
        }
        tokens.set(id, { ...token, lastUsedAt })
      }),

    delete: (id) =>
      Effect.sync(() => {
        if (!tokens.has(id)) {
          throw new TokenNotFoundError({
            message: "Token not found",
            tokenId: id,
          })
        }
        tokens.delete(id)
      }),

    deleteByUser: (userId) =>
      Effect.sync(() => {
        let count = 0
        for (const [id, token] of tokens) {
          if (token.userId === userId) {
            tokens.delete(id)
            count++
          }
        }
        return count
      }),

    deleteExpired: () =>
      Effect.sync(() => {
        const now = new Date()
        let count = 0
        for (const [id, token] of tokens) {
          if (token.expiresAt && token.expiresAt < now) {
            tokens.delete(id)
            count++
          }
        }
        return count
      }),
  }
}

/**
 * Mock token store layer
 */
export const MockTokenStoreLive = Layer.succeed(
  TokenStoreTag,
  makeMockTokenStore()
)
