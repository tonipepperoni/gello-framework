/**
 * @gello/auth-core - Domain Types
 *
 * Core domain types for the authentication system.
 */

import { Brand } from "effect"

// =============================================================================
// Branded Types
// =============================================================================

/**
 * Unique identifier for a personal access token
 */
export type TokenId = Brand.Branded<string, "TokenId">
export const TokenId = Brand.nominal<TokenId>()

/**
 * Plain text token (returned once on creation, never stored)
 */
export type PlainTextToken = Brand.Branded<string, "PlainTextToken">
export const PlainTextToken = Brand.nominal<PlainTextToken>()

/**
 * Hashed token (stored in database)
 */
export type HashedToken = Brand.Branded<string, "HashedToken">
export const HashedToken = Brand.nominal<HashedToken>()

/**
 * User identifier (generic, matches your user model)
 */
export type UserId = Brand.Branded<string, "UserId">
export const UserId = Brand.nominal<UserId>()

// =============================================================================
// Personal Access Token
// =============================================================================

/**
 * Personal Access Token stored in the database.
 * The token field is a SHA-256 hash of the plain text token.
 */
export interface PersonalAccessToken {
  readonly id: TokenId
  readonly userId: UserId
  readonly name: string
  readonly token: HashedToken
  readonly scopes: ReadonlyArray<string>
  readonly lastUsedAt?: Date
  readonly expiresAt?: Date
  readonly createdAt: Date
}

/**
 * Result of creating a new token (includes plain text token)
 */
export interface NewAccessToken {
  readonly accessToken: PersonalAccessToken
  readonly plainTextToken: PlainTextToken
}

// =============================================================================
// Token Constructors
// =============================================================================

export const PersonalAccessToken = {
  /**
   * Generate a new TokenId
   */
  generateId: (): TokenId => TokenId(crypto.randomUUID()),

  /**
   * Generate a random plain text token
   */
  generatePlainText: (): PlainTextToken => {
    const bytes = new Uint8Array(32)
    crypto.getRandomValues(bytes)
    const token = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
    return PlainTextToken(token)
  },

  /**
   * Check if token has a specific scope
   */
  hasScope: (token: PersonalAccessToken, scope: string): boolean => {
    // Wildcard scope grants everything
    if (token.scopes.includes("*")) return true
    return token.scopes.includes(scope)
  },

  /**
   * Check if token has all specified scopes
   */
  hasAllScopes: (token: PersonalAccessToken, scopes: string[]): boolean => {
    return scopes.every((scope) => PersonalAccessToken.hasScope(token, scope))
  },

  /**
   * Check if token has any of the specified scopes
   */
  hasAnyScope: (token: PersonalAccessToken, scopes: string[]): boolean => {
    return scopes.some((scope) => PersonalAccessToken.hasScope(token, scope))
  },

  /**
   * Check if token is expired
   */
  isExpired: (token: PersonalAccessToken): boolean => {
    if (!token.expiresAt) return false
    return new Date() > token.expiresAt
  },
}

// =============================================================================
// Authenticated User Context
// =============================================================================

/**
 * The authenticated user in the current request context.
 * This is set by the authenticate middleware.
 */
export interface AuthenticatedUser {
  readonly id: UserId
  readonly token?: PersonalAccessToken
}

/**
 * Authentication guard result
 */
export type AuthGuard =
  | { readonly _tag: "Authenticated"; readonly user: AuthenticatedUser }
  | { readonly _tag: "Guest" }

export const AuthGuard = {
  authenticated: (user: AuthenticatedUser): AuthGuard => ({
    _tag: "Authenticated",
    user,
  }),

  guest: (): AuthGuard => ({
    _tag: "Guest",
  }),

  isAuthenticated: (guard: AuthGuard): guard is { readonly _tag: "Authenticated"; readonly user: AuthenticatedUser } =>
    guard._tag === "Authenticated",

  isGuest: (guard: AuthGuard): guard is { readonly _tag: "Guest" } =>
    guard._tag === "Guest",
}
