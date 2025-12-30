/**
 * @gello/auth-core - Token Scopes Middleware
 *
 * Middleware for checking token scopes on routes.
 */

import { Effect } from "effect"
import { HttpServerResponse } from "@effect/platform"
import type { Middleware } from "@gello/core-domain-middleware"
import { PersonalAccessToken } from "../domain/types.js"
import { InsufficientScopeError } from "../domain/errors.js"
import { AuthenticatedUserTag } from "./authenticate.js"

/**
 * Middleware that requires ALL specified scopes (AND logic)
 *
 * @example
 * ```typescript
 * // Require both read and write scopes
 * Route.group({
 *   middleware: [authenticate(), tokenScopes('posts:read', 'posts:write')]
 * }, [...])
 * ```
 */
export const tokenScopes = (...requiredScopes: string[]): Middleware => ({
  name: "tokenScopes",
  apply: <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    Effect.gen(function* () {
      const user = yield* AuthenticatedUserTag

      // If no token (session auth), allow through
      if (!user.token) {
        return yield* effect
      }

      const hasAll = PersonalAccessToken.hasAllScopes(user.token, requiredScopes)

      if (!hasAll) {
        return HttpServerResponse.json(
          {
            error: "Insufficient scope",
            required: requiredScopes,
            provided: user.token.scopes,
          },
          { status: 403 }
        ) as A
      }

      return yield* effect
    }) as Effect.Effect<A, E, R>,
})

/**
 * Middleware that requires ANY of the specified scopes (OR logic)
 *
 * @example
 * ```typescript
 * // Require either admin or moderator scope
 * Route.group({
 *   middleware: [authenticate(), tokenScope('admin', 'moderator')]
 * }, [...])
 * ```
 */
export const tokenScope = (...allowedScopes: string[]): Middleware => ({
  name: "tokenScope",
  apply: <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    Effect.gen(function* () {
      const user = yield* AuthenticatedUserTag

      // If no token (session auth), allow through
      if (!user.token) {
        return yield* effect
      }

      const hasAny = PersonalAccessToken.hasAnyScope(user.token, allowedScopes)

      if (!hasAny) {
        return HttpServerResponse.json(
          {
            error: "Insufficient scope",
            required: `One of: ${allowedScopes.join(", ")}`,
            provided: user.token.scopes,
          },
          { status: 403 }
        ) as A
      }

      return yield* effect
    }) as Effect.Effect<A, E, R>,
})

/**
 * Check if current token has a specific scope
 * Use this in route handlers for fine-grained scope checks
 */
export const hasScope = (scope: string): Effect.Effect<boolean, never, AuthenticatedUserTag> =>
  Effect.gen(function* () {
    const user = yield* AuthenticatedUserTag
    if (!user.token) return true // Session auth has all scopes
    return PersonalAccessToken.hasScope(user.token, scope)
  })

/**
 * Require a scope or fail with InsufficientScopeError
 * Use this in route handlers for scope assertions
 */
export const requireScope = (scope: string): Effect.Effect<void, InsufficientScopeError, AuthenticatedUserTag> =>
  Effect.gen(function* () {
    const user = yield* AuthenticatedUserTag
    if (!user.token) return // Session auth has all scopes

    if (!PersonalAccessToken.hasScope(user.token, scope)) {
      return yield* Effect.fail(
        new InsufficientScopeError({
          message: `Token lacks required scope: ${scope}`,
          required: [scope],
          provided: user.token.scopes,
        })
      )
    }
  })
