/**
 * @gello/auth-session - Session Store Port
 *
 * Port for session persistence operations.
 */

import { Context, Effect, Option, Duration } from "effect"
import type { SessionId, Session } from "../domain/types.js"
import type { SessionNotFoundError } from "../domain/errors.js"
import type { UserId } from "@gello/auth-core"

/**
 * Session store port for persisting sessions.
 */
export interface SessionStore {
  /**
   * Get a session by ID
   */
  readonly get: (
    id: SessionId
  ) => Effect.Effect<Option.Option<Session>>

  /**
   * Store a session
   */
  readonly put: (
    session: Session
  ) => Effect.Effect<void>

  /**
   * Destroy a session
   */
  readonly destroy: (
    id: SessionId
  ) => Effect.Effect<void, SessionNotFoundError>

  /**
   * Destroy all sessions for a user
   */
  readonly destroyByUser: (
    userId: UserId
  ) => Effect.Effect<number>

  /**
   * Touch a session (update last activity)
   */
  readonly touch: (
    id: SessionId,
    lifetime: Duration.Duration
  ) => Effect.Effect<void, SessionNotFoundError>

  /**
   * Garbage collect expired sessions
   */
  readonly gc: (
    maxLifetime: Duration.Duration
  ) => Effect.Effect<number>
}

/**
 * Session store service tag
 */
export class SessionStoreTag extends Context.Tag("@gello/auth/SessionStore")<
  SessionStoreTag,
  SessionStore
>() {}
