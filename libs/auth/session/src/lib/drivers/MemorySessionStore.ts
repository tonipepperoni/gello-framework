/**
 * @gello/auth-session - Memory Session Store
 *
 * In-memory session store for development and testing.
 */

import { Effect, Layer, Option, Duration } from "effect"
import type { SessionStore } from "../ports/SessionStore.js"
import { SessionStoreTag } from "../ports/SessionStore.js"
import type { Session } from "../domain/types.js"
import { SessionNotFoundError } from "../domain/errors.js"

/**
 * Create an in-memory session store
 */
export const makeMemorySessionStore = (): SessionStore => {
  const sessions = new Map<string, Session>()

  return {
    get: (id) =>
      Effect.sync(() => {
        const session = sessions.get(id)
        if (!session) return Option.none()
        if (new Date() > session.expiresAt) {
          sessions.delete(id)
          return Option.none()
        }
        return Option.some(session)
      }),

    put: (session) =>
      Effect.sync(() => {
        sessions.set(session.id, session)
      }),

    destroy: (id) =>
      Effect.sync(() => {
        if (!sessions.has(id)) {
          throw new SessionNotFoundError({
            message: "Session not found",
            sessionId: id,
          })
        }
        sessions.delete(id)
      }),

    destroyByUser: (userId) =>
      Effect.sync(() => {
        let count = 0
        for (const [id, session] of sessions) {
          if (session.userId === userId) {
            sessions.delete(id)
            count++
          }
        }
        return count
      }),

    touch: (id, lifetime) =>
      Effect.sync(() => {
        const session = sessions.get(id)
        if (!session) {
          throw new SessionNotFoundError({
            message: "Session not found",
            sessionId: id,
          })
        }
        const now = new Date()
        sessions.set(id, {
          ...session,
          lastActivity: now,
          expiresAt: new Date(now.getTime() + Duration.toMillis(lifetime)),
        })
      }),

    gc: (maxLifetime) =>
      Effect.sync(() => {
        const now = new Date()
        const cutoff = new Date(now.getTime() - Duration.toMillis(maxLifetime))
        let count = 0
        for (const [id, session] of sessions) {
          if (session.expiresAt < now || session.lastActivity < cutoff) {
            sessions.delete(id)
            count++
          }
        }
        return count
      }),
  }
}

/**
 * In-memory session store layer
 */
export const MemorySessionStoreLive = Layer.succeed(
  SessionStoreTag,
  makeMemorySessionStore()
)
