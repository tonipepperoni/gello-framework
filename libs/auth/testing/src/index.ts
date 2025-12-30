/**
 * @gello/auth-testing
 *
 * Testing utilities for the Gello auth system.
 */

// Mocks
export {
  makeMockTokenStore,
  MockTokenStoreLive,
  makeMockPasswordHasher,
  MockPasswordHasherLive,
  makeMockTokenHasher,
  MockTokenHasherLive,
  makeMockUserProvider,
  MockUserProviderLive,
  createMockUser,
  type MockUser,
} from "./lib/mocks/index.js"

// Utilities
export {
  createAuthenticatedUser,
  actingAsLayer,
  actingAs,
  Auth,
  type ActingAsOptions,
  assertAuthenticated,
  assertGuest,
  assertCan,
  assertCannot,
  assertHasScope,
  assertLacksScope,
  TestAuthLayer,
  TestSessionLayer,
  FullTestAuthLayer,
} from "./lib/utilities/index.js"
