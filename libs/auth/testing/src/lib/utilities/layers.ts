/**
 * @gello/auth-testing - Test Layers
 *
 * Pre-configured layers for testing.
 */

import { Layer } from "effect"
import {
  TokenServiceLive,
  AuthServiceLive,
} from "@gello/auth-core"
import {
  MockTokenStoreLive,
  MockPasswordHasherLive,
  MockTokenHasherLive,
  MockUserProviderLive,
  type MockUser,
} from "../mocks/index.js"
import { MemorySessionStoreLive } from "@gello/auth-session"

/**
 * Create a test auth layer with mock implementations
 *
 * @example
 * ```typescript
 * const testUsers = [
 *   createMockUser({ email: 'admin@example.com', role: 'admin' }),
 *   createMockUser({ email: 'user@example.com', role: 'user' }),
 * ]
 *
 * const result = yield* myAuthEffect.pipe(
 *   Effect.provide(TestAuthLayer(testUsers))
 * )
 * ```
 */
export const TestAuthLayer = (users: MockUser[] = []) =>
  Layer.mergeAll(
    MockTokenStoreLive,
    MockPasswordHasherLive,
    MockTokenHasherLive,
    MockUserProviderLive(users)
  ).pipe(
    Layer.provideMerge(TokenServiceLive),
    Layer.provideMerge(AuthServiceLive)
  )

/**
 * Test session layer with in-memory store
 */
export const TestSessionLayer = MemorySessionStoreLive

/**
 * Full test layer combining auth and session
 */
export const FullTestAuthLayer = (users: MockUser[] = []) =>
  Layer.mergeAll(TestAuthLayer(users), TestSessionLayer)
