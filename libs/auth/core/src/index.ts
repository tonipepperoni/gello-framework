/**
 * @gello/auth-core
 *
 * Core authentication types, ports, and services for the Gello auth system.
 */

// Domain Types - Branded types (export both type and constructor)
export {
  TokenId,
  PlainTextToken,
  HashedToken,
  UserId,
  PersonalAccessToken,
  AuthGuard,
} from "./lib/domain/types.js"

// Domain Types - Pure interfaces (type-only exports)
export type {
  PersonalAccessToken as PersonalAccessTokenType,
  NewAccessToken,
  AuthenticatedUser,
  AuthGuard as AuthGuardType,
} from "./lib/domain/types.js"

// Errors
export {
  AuthError,
  AuthenticationError,
  TokenNotFoundError,
  TokenExpiredError,
  InsufficientScopeError,
  UserNotFoundError,
  HashingError,
  InvalidPasswordError,
  RateLimitError,
  type AuthSystemError,
} from "./lib/domain/errors.js"

// Ports
export {
  type TokenStore,
  TokenStoreTag,
} from "./lib/ports/TokenStore.js"

export {
  type PasswordHasher,
  PasswordHasherTag,
  type TokenHasher,
  TokenHasherTag,
} from "./lib/ports/PasswordHasher.js"

export {
  type Authenticatable,
  type UserProvider,
  UserProviderTag,
} from "./lib/ports/Authenticatable.js"

// Services
export {
  type TokenService,
  TokenServiceTag,
  TokenServiceLive,
} from "./lib/services/TokenService.js"

export {
  type AuthService,
  AuthTag,
  AuthServiceLive,
} from "./lib/services/Auth.js"

// Mixins
export {
  type HasApiTokens,
  withApiTokens,
  hasApiTokens,
} from "./lib/mixins/HasApiTokens.js"

// Middleware
export {
  authenticate,
  AuthenticatedUserTag,
  currentUser,
  isAuthenticated,
} from "./lib/middleware/authenticate.js"

export {
  tokenScopes,
  tokenScope,
  hasScope,
  requireScope,
} from "./lib/middleware/scopes.js"
