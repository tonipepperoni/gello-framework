/**
 * @gello/auth-core - Authenticate Middleware
 *
 * Middleware for requiring authentication on routes.
 */

import { Context, Effect } from "effect"
import { HttpServerRequest, HttpServerResponse } from "@effect/platform"
import type { Middleware } from "@gello/core-domain-middleware"
import type { AuthenticatedUser } from "../domain/types.js"
import { AuthenticationError } from "../domain/errors.js"
import { AuthTag } from "../services/Auth.js"

/**
 * Context tag for the authenticated user
 */
export class AuthenticatedUserTag extends Context.Tag("@gello/auth/AuthenticatedUser")<
  AuthenticatedUserTag,
  AuthenticatedUser
>() {}

/**
 * Extract bearer token from Authorization header
 */
const extractBearerToken = (header: string | undefined): string | null => {
  if (!header) return null
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match ? match[1] : null
}

/**
 * Authentication middleware options
 */
export interface AuthenticateOptions {
  /**
   * If true, allow unauthenticated requests to pass through
   * The AuthenticatedUser will not be available in context
   */
  readonly optional?: boolean
}

/**
 * Create an authentication middleware that validates bearer tokens
 */
export const authenticate = (options: AuthenticateOptions = {}): Middleware => ({
  name: "authenticate",
  apply: <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest
      const auth = yield* AuthTag
      const authHeader = request.headers["authorization"]
      const token = extractBearerToken(authHeader)

      if (!token) {
        if (options.optional) {
          // Optional auth - continue without user context
          return yield* effect
        }
        return HttpServerResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        ) as A
      }

      const authResult = yield* auth.authenticateWithToken(token).pipe(
        Effect.either
      )

      if (authResult._tag === "Left") {
        if (options.optional) {
          // Optional auth with invalid token - continue without user context
          return yield* effect
        }

        const error = authResult.left
        return HttpServerResponse.json(
          { error: error.message },
          { status: 401 }
        ) as A
      }

      const user = authResult.right

      // Provide authenticated user to downstream handlers
      return yield* effect.pipe(
        Effect.provideService(AuthenticatedUserTag, user)
      )
    }) as Effect.Effect<A, E, R>,
})

/**
 * Optional authentication - sets user if token present, continues otherwise
 */
authenticate.optional = (): Middleware => {
  const base = authenticate({ optional: true })
  return {
    ...base,
    name: "authenticate.optional",
  }
}

/**
 * Get the current authenticated user from context
 * Returns Effect that fails with AuthenticationError if not authenticated
 */
export const currentUser = (): Effect.Effect<
  AuthenticatedUser,
  AuthenticationError,
  AuthenticatedUserTag
> =>
  Effect.flatMap(
    Effect.either(AuthenticatedUserTag),
    (result) =>
      result._tag === "Right"
        ? Effect.succeed(result.right)
        : Effect.fail(
            new AuthenticationError({
              message: "Not authenticated",
              reason: "missing_token",
            })
          )
  )

/**
 * Check if current request is authenticated
 */
export const isAuthenticated = (): Effect.Effect<boolean, never, AuthenticatedUserTag> =>
  Effect.map(Effect.either(AuthenticatedUserTag), (result) => result._tag === "Right")
