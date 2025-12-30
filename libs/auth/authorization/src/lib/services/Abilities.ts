/**
 * @gello/auth-authorization - Abilities Service
 *
 * Effect-based ability checking and authorization.
 */

import { Context, Effect, Layer } from "effect"
import type { Abilities, Action, Subject } from "../domain/types.js"
import { getSubjectType } from "../domain/types.js"
import { ForbiddenError } from "../domain/errors.js"

/**
 * Context for user abilities in the current request
 */
export class AbilitiesTag extends Context.Tag("@gello/auth/Abilities")<
  AbilitiesTag,
  Abilities
>() {}

/**
 * Check if the current user can perform an action
 */
export const can = (
  action: Action,
  subject: Subject
): Effect.Effect<boolean, never, AbilitiesTag> =>
  Effect.gen(function* () {
    const abilities = yield* AbilitiesTag
    return abilities.can(action, subject)
  })

/**
 * Check if the current user cannot perform an action
 */
export const cannot = (
  action: Action,
  subject: Subject
): Effect.Effect<boolean, never, AbilitiesTag> =>
  Effect.gen(function* () {
    const abilities = yield* AbilitiesTag
    return abilities.cannot(action, subject)
  })

/**
 * Authorize an action - fails with ForbiddenError if not allowed
 *
 * @example
 * ```typescript
 * // In a route handler
 * Effect.gen(function* () {
 *   const post = yield* getPost(postId)
 *   yield* authorize('update', post)
 *   // ... update the post
 * })
 * ```
 */
export const authorize = (
  action: Action,
  subject: Subject
): Effect.Effect<void, ForbiddenError, AbilitiesTag> =>
  Effect.gen(function* () {
    const abilities = yield* AbilitiesTag
    const allowed = abilities.can(action, subject)

    if (!allowed) {
      const rule = abilities.relevantRuleFor(action, subject)
      return yield* Effect.fail(
        new ForbiddenError({
          message: rule?.reason ?? `You are not authorized to ${action} this ${getSubjectType(subject)}`,
          action,
          subject: getSubjectType(subject),
          rule,
        })
      )
    }
  })

/**
 * Authorize multiple actions at once (all must be allowed)
 */
export const authorizeAll = (
  actions: Action[],
  subject: Subject
): Effect.Effect<void, ForbiddenError, AbilitiesTag> =>
  Effect.gen(function* () {
    for (const action of actions) {
      yield* authorize(action, subject)
    }
  })

/**
 * Authorize if any action is allowed (OR logic)
 */
export const authorizeAny = (
  actions: Action[],
  subject: Subject
): Effect.Effect<void, ForbiddenError, AbilitiesTag> =>
  Effect.gen(function* () {
    const abilities = yield* AbilitiesTag

    const hasAny = actions.some((action) => abilities.can(action, subject))

    if (!hasAny) {
      return yield* Effect.fail(
        new ForbiddenError({
          message: `You are not authorized to perform any of [${actions.join(", ")}] on this ${getSubjectType(subject)}`,
          action: actions[0],
          subject: getSubjectType(subject),
        })
      )
    }
  })

/**
 * Create a layer that provides abilities for a user
 */
export const AbilitiesLive = (abilities: Abilities) =>
  Layer.succeed(AbilitiesTag, abilities)
