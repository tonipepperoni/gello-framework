/**
 * @gello/auth-authorization - Authorize Middleware
 *
 * Middleware for authorization checks on routes.
 */

import { Effect } from "effect"
import { HttpServerResponse } from "@effect/platform"
import type { Middleware } from "@gello/core-domain-middleware"
import type { Action, Subject } from "../domain/types.js"
import { getSubjectType } from "../domain/types.js"
import { AbilitiesTag } from "../services/Abilities.js"

/**
 * Authorization middleware options
 */
export interface AuthorizeOptions {
  /**
   * Custom error message when forbidden
   */
  readonly message?: string

  /**
   * HTTP status code for forbidden (default: 403)
   */
  readonly status?: number
}

/**
 * Middleware that requires the user to have permission to perform an action.
 *
 * For simple action checks (no resource):
 * ```typescript
 * Route.group({
 *   middleware: [authenticate(), authorize('access-admin')]
 * }, [...])
 * ```
 *
 * For resource-based checks, use the authorize() function in route handlers:
 * ```typescript
 * const updatePost = Effect.gen(function* () {
 *   const post = yield* getPost(postId)
 *   yield* authorize('update', post)
 *   // ... update logic
 * })
 * ```
 */
export const authorizeMiddleware = (
  action: Action,
  getSubject?: () => Effect.Effect<Subject, unknown, unknown>,
  options: AuthorizeOptions = {}
): Middleware => ({
  name: "authorize",
  apply: <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    Effect.gen(function* () {
      const abilities = yield* AbilitiesTag

      // Get the subject if provided
      const subject: Subject = getSubject
        ? yield* getSubject().pipe(Effect.catchAll(() => Effect.succeed(action)))
        : action

      const allowed = abilities.can(action, subject)

      if (!allowed) {
        const subjectType = getSubjectType(subject)
        const message = options.message ?? `You are not authorized to ${action} ${subjectType}`
        const status = options.status ?? 403

        return HttpServerResponse.json({ error: message }, { status }) as A
      }

      return yield* effect
    }) as Effect.Effect<A, E, R>,
})

/**
 * Alias for cleaner imports
 */
export { authorizeMiddleware as authorize }

/**
 * Require admin abilities
 */
export const requireAdmin = (options: AuthorizeOptions = {}): Middleware => {
  const base = authorizeMiddleware("manage", () => Effect.succeed("all"), options)
  return {
    ...base,
    name: "requireAdmin",
  }
}

/**
 * Require any of the specified actions to be allowed
 */
export const requireAny = (
  actions: Action[],
  getSubject?: () => Effect.Effect<Subject, unknown, unknown>,
  options: AuthorizeOptions = {}
): Middleware => ({
  name: "requireAny",
  apply: <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    Effect.gen(function* () {
      const abilities = yield* AbilitiesTag

      const subject: Subject = getSubject
        ? yield* getSubject().pipe(Effect.catchAll(() => Effect.succeed(actions[0])))
        : actions[0]

      const hasAny = actions.some((action) => abilities.can(action, subject))

      if (!hasAny) {
        const message = options.message ?? `You are not authorized to perform this action`
        const status = options.status ?? 403

        return HttpServerResponse.json({ error: message }, { status }) as A
      }

      return yield* effect
    }) as Effect.Effect<A, E, R>,
})
