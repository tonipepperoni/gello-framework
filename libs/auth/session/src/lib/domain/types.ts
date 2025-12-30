/**
 * @gello/auth-session - Domain Types
 *
 * Core domain types for the session system.
 */

import { Brand, Duration } from "effect"
import type { UserId } from "@gello/auth-core"

// =============================================================================
// Branded Types
// =============================================================================

/**
 * Unique session identifier
 */
export type SessionId = Brand.Branded<string, "SessionId">
export const SessionId = Brand.nominal<SessionId>()

/**
 * CSRF token
 */
export type CsrfToken = Brand.Branded<string, "CsrfToken">
export const CsrfToken = Brand.nominal<CsrfToken>()

// =============================================================================
// Session
// =============================================================================

/**
 * Session data stored in the session store
 */
export interface Session {
  readonly id: SessionId
  readonly userId: UserId
  readonly data: Record<string, unknown>
  readonly ipAddress?: string
  readonly userAgent?: string
  readonly lastActivity: Date
  readonly createdAt: Date
  readonly expiresAt: Date
}

/**
 * Session constructors and utilities
 */
export const Session = {
  /**
   * Generate a new SessionId
   */
  generateId: (): SessionId => SessionId(crypto.randomUUID()),

  /**
   * Generate a CSRF token
   */
  generateCsrfToken: (): CsrfToken => {
    const bytes = new Uint8Array(32)
    crypto.getRandomValues(bytes)
    return CsrfToken(
      Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    )
  },

  /**
   * Create a new session
   */
  make: (
    userId: UserId,
    options?: {
      data?: Record<string, unknown>
      ipAddress?: string
      userAgent?: string
      lifetime?: Duration.Duration
    }
  ): Session => {
    const now = new Date()
    const lifetime = options?.lifetime ?? Duration.hours(2)
    const expiresAt = new Date(now.getTime() + Duration.toMillis(lifetime))

    return {
      id: Session.generateId(),
      userId,
      data: options?.data ?? {},
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
      lastActivity: now,
      createdAt: now,
      expiresAt,
    }
  },

  /**
   * Check if session is expired
   */
  isExpired: (session: Session): boolean => {
    return new Date() > session.expiresAt
  },

  /**
   * Extend session expiration
   */
  touch: (session: Session, lifetime: Duration.Duration): Session => {
    const now = new Date()
    return {
      ...session,
      lastActivity: now,
      expiresAt: new Date(now.getTime() + Duration.toMillis(lifetime)),
    }
  },
}

// =============================================================================
// Session Configuration
// =============================================================================

/**
 * Session configuration
 */
export interface SessionConfig {
  /**
   * Cookie name for the session
   */
  readonly cookieName: string

  /**
   * Session lifetime
   */
  readonly lifetime: Duration.Duration

  /**
   * Cookie path
   */
  readonly path: string

  /**
   * Cookie domain
   */
  readonly domain?: string

  /**
   * Secure cookie (HTTPS only)
   */
  readonly secure: boolean

  /**
   * HTTP only cookie
   */
  readonly httpOnly: boolean

  /**
   * Same-site cookie policy
   */
  readonly sameSite: "strict" | "lax" | "none"
}

/**
 * Default session configuration
 */
export const defaultSessionConfig: SessionConfig = {
  cookieName: "gello_session",
  lifetime: Duration.hours(2),
  path: "/",
  secure: true,
  httpOnly: true,
  sameSite: "lax",
}
