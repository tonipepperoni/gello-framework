/**
 * @gello/auth-testing - Mock Password Hasher
 *
 * Fast password hasher for testing (no bcrypt).
 */

import { Effect, Layer } from "effect"
import {
  type PasswordHasher,
  PasswordHasherTag,
  type TokenHasher,
  TokenHasherTag,
} from "@gello/auth-core"

/**
 * Create a mock password hasher for testing
 * Uses simple Base64 encoding instead of bcrypt for speed
 */
export const makeMockPasswordHasher = (): PasswordHasher => ({
  hash: (password) =>
    Effect.sync(() => {
      // Simple Base64 encoding with a marker prefix
      return `mock:${Buffer.from(password).toString("base64")}`
    }),

  verify: (password, hash) =>
    Effect.sync(() => {
      if (!hash.startsWith("mock:")) {
        return false
      }
      const decoded = Buffer.from(hash.slice(5), "base64").toString("utf-8")
      return password === decoded
    }),

  needsRehash: (hash) => !hash.startsWith("mock:"),
})

/**
 * Mock password hasher layer
 */
export const MockPasswordHasherLive = Layer.succeed(
  PasswordHasherTag,
  makeMockPasswordHasher()
)

/**
 * Create a mock token hasher for testing
 * Uses simple hash that's reversible for easier testing
 */
export const makeMockTokenHasher = (): TokenHasher => ({
  hash: (token) => {
    // Simple reversible hash for testing
    return `hash:${Buffer.from(token).toString("base64")}`
  },

  verify: (token, hash) => {
    if (!hash.startsWith("hash:")) {
      return false
    }
    const decoded = Buffer.from(hash.slice(5), "base64").toString("utf-8")
    return token === decoded
  },
})

/**
 * Mock token hasher layer
 */
export const MockTokenHasherLive = Layer.succeed(
  TokenHasherTag,
  makeMockTokenHasher()
)
