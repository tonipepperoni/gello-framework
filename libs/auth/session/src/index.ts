/**
 * @gello/auth-session
 *
 * Session management for the Gello auth system.
 */

// Domain Types - Branded types (export both type and constructor)
export {
  SessionId,
  CsrfToken,
  Session,
  defaultSessionConfig,
} from "./lib/domain/types.js"

// Domain Types - Pure interfaces (type-only exports)
export type {
  SessionId as SessionIdType,
  CsrfToken as CsrfTokenType,
  Session as SessionType,
  SessionConfig,
} from "./lib/domain/types.js"

// Errors
export {
  SessionError,
  SessionNotFoundError,
  SessionExpiredError,
  CsrfMismatchError,
  JwtError,
  type SessionSystemError,
} from "./lib/domain/errors.js"

// Ports
export {
  type SessionStore,
  SessionStoreTag,
} from "./lib/ports/SessionStore.js"

// Drivers
export {
  makeMemorySessionStore,
  MemorySessionStoreLive,
} from "./lib/drivers/MemorySessionStore.js"

// Services
export {
  type JwtPayload,
  type JwtService,
  JwtServiceTag,
  makeJwtService,
  JwtServiceLive,
} from "./lib/services/JwtService.js"

// Middleware
export {
  session,
  CurrentSessionTag,
  startSession,
  endSession,
  getSessionData,
  setSessionData,
} from "./lib/middleware/session.js"

export {
  csrf,
  CsrfTokenTag,
  type CsrfConfig,
  defaultCsrfConfig,
  generateCsrfCookie,
  verifyCsrfToken,
} from "./lib/middleware/csrf.js"
