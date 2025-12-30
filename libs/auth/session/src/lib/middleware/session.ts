/**
 * @gello/auth-session - Session Middleware
 *
 * Middleware for session management.
 */

import { Context, Effect, Option, Duration } from "effect"
import { HttpServerRequest, HttpServerResponse } from "@effect/platform"
import type { Middleware } from "@gello/core-domain-middleware"
import type { Session, SessionConfig } from "../domain/types.js"
import { Session as SessionUtils, defaultSessionConfig, SessionId } from "../domain/types.js"
import { SessionStoreTag } from "../ports/SessionStore.js"
import type { AuthenticatedUser } from "@gello/auth-core"

/**
 * Context tag for the current session
 */
export class CurrentSessionTag extends Context.Tag("@gello/auth/CurrentSession")<
  CurrentSessionTag,
  Session
>() {}

/**
 * Parse cookies from header
 */
const parseCookies = (header: string | undefined): Map<string, string> => {
  const cookies = new Map<string, string>()
  if (!header) return cookies

  header.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split("=")
    if (name) {
      cookies.set(name, rest.join("="))
    }
  })

  return cookies
}

/**
 * Session middleware options
 */
export interface SessionMiddlewareOptions extends Partial<SessionConfig> {
  /**
   * If true, allow requests without a session
   */
  readonly optional?: boolean
}

/**
 * Create a session middleware
 */
export const session = (options: SessionMiddlewareOptions = {}): Middleware => {
  const config = { ...defaultSessionConfig, ...options }

  return {
    name: "session",
    apply: <A, E, R>(effect: Effect.Effect<A, E, R>) =>
      Effect.gen(function* () {
        const request = yield* HttpServerRequest.HttpServerRequest
        const store = yield* SessionStoreTag

        const cookies = parseCookies(request.headers["cookie"])
        const sessionId = cookies.get(config.cookieName)

        let currentSession: Session | null = null

        if (sessionId) {
          const maybeSession = yield* store.get(SessionId(sessionId))
          if (Option.isSome(maybeSession)) {
            const sess = maybeSession.value

            if (!SessionUtils.isExpired(sess)) {
              // Touch session to extend lifetime
              yield* store.touch(sess.id, config.lifetime).pipe(
                Effect.catchAll(() => Effect.void)
              )
              currentSession = SessionUtils.touch(sess, config.lifetime)
            }
          }
        }

        if (!currentSession && !options.optional) {
          return HttpServerResponse.json(
            { error: "Session required" },
            { status: 401 }
          ) as A
        }

        if (currentSession) {
          return yield* effect.pipe(
            Effect.provideService(CurrentSessionTag, currentSession)
          )
        }

        return yield* effect
      }) as Effect.Effect<A, E, R>,
  }
}

/**
 * Optional session middleware
 */
session.optional = (): Middleware => {
  const base = session({ optional: true })
  return {
    ...base,
    name: "session.optional",
  }
}

/**
 * Start a new session for a user
 */
export const startSession = (
  user: AuthenticatedUser,
  config: SessionConfig = defaultSessionConfig,
  data: Record<string, unknown> = {}
): Effect.Effect<
  { session: Session; cookie: string },
  never,
  SessionStoreTag | HttpServerRequest.HttpServerRequest
> =>
  Effect.gen(function* () {
    const store = yield* SessionStoreTag
    const request = yield* HttpServerRequest.HttpServerRequest

    const newSession = SessionUtils.make(user.id, {
      data,
      ipAddress: request.headers["x-forwarded-for"] ?? request.headers["x-real-ip"],
      userAgent: request.headers["user-agent"],
      lifetime: config.lifetime,
    })

    yield* store.put(newSession)

    const cookieParts = [
      `${config.cookieName}=${newSession.id}`,
      `Path=${config.path}`,
      `Max-Age=${Math.floor(Duration.toSeconds(config.lifetime))}`,
      config.httpOnly ? "HttpOnly" : "",
      config.secure ? "Secure" : "",
      `SameSite=${config.sameSite}`,
      config.domain ? `Domain=${config.domain}` : "",
    ].filter(Boolean)

    return {
      session: newSession,
      cookie: cookieParts.join("; "),
    }
  })

/**
 * End the current session
 */
export const endSession = (
  config: SessionConfig = defaultSessionConfig
): Effect.Effect<string, never, CurrentSessionTag | SessionStoreTag> =>
  Effect.gen(function* () {
    const session = yield* CurrentSessionTag
    const store = yield* SessionStoreTag

    yield* store.destroy(session.id).pipe(Effect.catchAll(() => Effect.void))

    // Return a cookie that expires immediately
    const cookieParts = [
      `${config.cookieName}=`,
      `Path=${config.path}`,
      `Max-Age=0`,
      config.httpOnly ? "HttpOnly" : "",
      config.secure ? "Secure" : "",
      `SameSite=${config.sameSite}`,
    ].filter(Boolean)

    return cookieParts.join("; ")
  })

/**
 * Get session data
 */
export const getSessionData = <T = unknown>(
  key: string
): Effect.Effect<T | undefined, never, CurrentSessionTag> =>
  Effect.gen(function* () {
    const session = yield* CurrentSessionTag
    return session.data[key] as T | undefined
  })

/**
 * Set session data
 */
export const setSessionData = (
  key: string,
  value: unknown
): Effect.Effect<void, never, CurrentSessionTag | SessionStoreTag> =>
  Effect.gen(function* () {
    const session = yield* CurrentSessionTag
    const store = yield* SessionStoreTag

    const updatedSession = {
      ...session,
      data: { ...session.data, [key]: value },
    }

    yield* store.put(updatedSession)
  })
