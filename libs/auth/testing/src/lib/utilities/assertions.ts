/**
 * @gello/auth-testing - Assertions
 *
 * Test assertions for auth.
 */

import { Effect } from "effect"
import {
  AuthenticatedUserTag,
  AuthenticationError,
  type AuthenticatedUser,
} from "@gello/auth-core"
import { AbilitiesTag, type Subject, type Action } from "@gello/auth-authorization"

/**
 * Assert that the current request is authenticated
 */
export const assertAuthenticated = (): Effect.Effect<
  AuthenticatedUser,
  AuthenticationError,
  AuthenticatedUserTag
> =>
  Effect.gen(function* () {
    const result = yield* Effect.either(AuthenticatedUserTag)

    if (result._tag === "Left") {
      return yield* Effect.fail(
        new AuthenticationError({
          message: "Expected to be authenticated, but was not",
          reason: "missing_token",
        })
      )
    }

    return result.right
  })

/**
 * Assert that the current request is NOT authenticated (guest)
 */
export const assertGuest = (): Effect.Effect<void, Error, AuthenticatedUserTag> =>
  Effect.gen(function* () {
    const result = yield* Effect.either(AuthenticatedUserTag)

    if (result._tag === "Right") {
      return yield* Effect.fail(
        new Error("Expected to be guest, but was authenticated")
      )
    }
  })

/**
 * Assert that the current user can perform an action
 */
export const assertCan = (
  action: Action,
  subject: Subject
): Effect.Effect<void, Error, AbilitiesTag> =>
  Effect.gen(function* () {
    const abilities = yield* AbilitiesTag
    const canDo = abilities.can(action, subject)

    if (!canDo) {
      return yield* Effect.fail(
        new Error(`Expected to be able to ${action} ${String(subject)}, but cannot`)
      )
    }
  })

/**
 * Assert that the current user cannot perform an action
 */
export const assertCannot = (
  action: Action,
  subject: Subject
): Effect.Effect<void, Error, AbilitiesTag> =>
  Effect.gen(function* () {
    const abilities = yield* AbilitiesTag
    const canDo = abilities.can(action, subject)

    if (canDo) {
      return yield* Effect.fail(
        new Error(`Expected NOT to be able to ${action} ${String(subject)}, but can`)
      )
    }
  })

/**
 * Assert that the current user has a specific scope
 */
export const assertHasScope = (
  scope: string
): Effect.Effect<void, Error, AuthenticatedUserTag> =>
  Effect.gen(function* () {
    const user = yield* AuthenticatedUserTag

    if (!user.token) {
      return yield* Effect.fail(
        new Error("No token present to check scope")
      )
    }

    const hasScope =
      user.token.scopes.includes("*") || user.token.scopes.includes(scope)

    if (!hasScope) {
      return yield* Effect.fail(
        new Error(`Expected token to have scope "${scope}", but it doesn't`)
      )
    }
  })

/**
 * Assert that the current user lacks a specific scope
 */
export const assertLacksScope = (
  scope: string
): Effect.Effect<void, Error, AuthenticatedUserTag> =>
  Effect.gen(function* () {
    const user = yield* AuthenticatedUserTag

    if (!user.token) {
      // No token means no scopes, so this passes
      return
    }

    const hasScope =
      user.token.scopes.includes("*") || user.token.scopes.includes(scope)

    if (hasScope) {
      return yield* Effect.fail(
        new Error(`Expected token NOT to have scope "${scope}", but it does`)
      )
    }
  })
