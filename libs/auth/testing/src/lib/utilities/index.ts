/**
 * @gello/auth-testing - Utilities
 *
 * Test utilities for auth.
 */

export {
  createAuthenticatedUser,
  actingAsLayer,
  actingAs,
  Auth,
  type ActingAsOptions,
} from "./actingAs.js"

export {
  assertAuthenticated,
  assertGuest,
  assertCan,
  assertCannot,
  assertHasScope,
  assertLacksScope,
} from "./assertions.js"

export {
  TestAuthLayer,
  TestSessionLayer,
  FullTestAuthLayer,
} from "./layers.js"
