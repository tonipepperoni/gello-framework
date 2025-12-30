/**
 * @gello/auth-testing - Mock User Provider
 *
 * In-memory user provider for testing.
 */

import { Effect, Layer, Option } from "effect"
import {
  type UserProvider,
  type Authenticatable,
  UserProviderTag,
  UserId,
} from "@gello/auth-core"

/**
 * Mock user for testing
 */
export interface MockUser extends Authenticatable {
  readonly id: ReturnType<typeof UserId>
  readonly email: string
  readonly password: string
  readonly name?: string
  readonly role?: string
}

/**
 * Create a mock user provider for testing
 */
export const makeMockUserProvider = (
  users: MockUser[] = []
): UserProvider<MockUser> => {
  const userMap = new Map<string, MockUser>()
  const emailMap = new Map<string, MockUser>()

  for (const user of users) {
    userMap.set(user.id, user)
    emailMap.set(user.email.toLowerCase(), user)
  }

  return {
    findById: (id) =>
      Effect.sync(() => {
        const user = userMap.get(id)
        return user ? Option.some(user) : Option.none()
      }),

    findByEmail: (email) =>
      Effect.sync(() => {
        const user = emailMap.get(email.toLowerCase())
        return user ? Option.some(user) : Option.none()
      }),

    findByCredentials: (credentials) =>
      Effect.sync(() => {
        // Simple lookup by any matching field
        for (const user of userMap.values()) {
          const userObj = user as unknown as Record<string, unknown>
          const matches = Object.entries(credentials).every(
            ([key, value]) => userObj[key] === value
          )
          if (matches) {
            return Option.some(user)
          }
        }
        return Option.none()
      }),
  }
}

/**
 * Create a mock user provider layer
 */
export const MockUserProviderLive = (users: MockUser[] = []) =>
  Layer.succeed(UserProviderTag, makeMockUserProvider(users))

/**
 * Create a mock user for testing
 */
export const createMockUser = (
  overrides: Partial<MockUser> & { email: string }
): MockUser => ({
  id: UserId(crypto.randomUUID()),
  password: "mock:dGVzdA==", // "test" encoded
  ...overrides,
})
