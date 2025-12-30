/**
 * @gello/auth-core - Auth Service
 *
 * Main authentication service facade.
 */

import { Context, Effect, Layer, Option } from "effect"
import type { UserId, PersonalAccessToken, NewAccessToken, AuthenticatedUser } from "../domain/types.js"
import {
  AuthenticationError,
  UserNotFoundError,
} from "../domain/errors.js"
import { UserProviderTag, type Authenticatable } from "../ports/Authenticatable.js"
import { PasswordHasherTag } from "../ports/PasswordHasher.js"
import { TokenServiceTag } from "./TokenService.js"

/**
 * Authentication service interface
 */
export interface AuthService {
  /**
   * Attempt to authenticate a user with email and password
   */
  readonly attempt: (
    email: string,
    password: string
  ) => Effect.Effect<Authenticatable, AuthenticationError>

  /**
   * Authenticate using a bearer token
   */
  readonly authenticateWithToken: (
    token: string
  ) => Effect.Effect<AuthenticatedUser, AuthenticationError>

  /**
   * Get a user by their ID
   */
  readonly getUser: (
    userId: UserId
  ) => Effect.Effect<Authenticatable, UserNotFoundError>

  /**
   * Create a new API token for a user
   */
  readonly createToken: (
    userId: UserId,
    name: string,
    scopes?: string[],
    expiresAt?: Date
  ) => Effect.Effect<NewAccessToken>

  /**
   * Get all tokens for a user
   */
  readonly getTokens: (
    userId: UserId
  ) => Effect.Effect<ReadonlyArray<PersonalAccessToken>>

  /**
   * Revoke a specific token
   */
  readonly revokeToken: (
    tokenId: string
  ) => Effect.Effect<void>

  /**
   * Revoke all tokens for a user
   */
  readonly revokeAllTokens: (
    userId: UserId
  ) => Effect.Effect<number>

  /**
   * Hash a password
   */
  readonly hashPassword: (
    password: string
  ) => Effect.Effect<string, never, never>

  /**
   * Check if password needs rehashing
   */
  readonly needsRehash: (hash: string) => boolean
}

/**
 * Auth service tag
 */
export class AuthTag extends Context.Tag("@gello/auth/Auth")<
  AuthTag,
  AuthService
>() {}

/**
 * Live implementation of AuthService
 */
export const AuthServiceLive = Layer.effect(
  AuthTag,
  Effect.gen(function* () {
    const userProvider = yield* UserProviderTag
    const passwordHasher = yield* PasswordHasherTag
    const tokenService = yield* TokenServiceTag

    const service: AuthService = {
      attempt: (email, password) =>
        Effect.gen(function* () {
          const maybeUser = yield* userProvider.findByEmail(email)

          if (Option.isNone(maybeUser)) {
            return yield* Effect.fail(
              new AuthenticationError({
                message: "Invalid credentials",
                reason: "invalid_credentials",
              })
            )
          }

          const user = maybeUser.value
          const isValid = yield* passwordHasher.verify(password, user.password).pipe(
            Effect.mapError(() =>
              new AuthenticationError({
                message: "Invalid credentials",
                reason: "invalid_credentials",
              })
            )
          )

          if (!isValid) {
            return yield* Effect.fail(
              new AuthenticationError({
                message: "Invalid credentials",
                reason: "invalid_credentials",
              })
            )
          }

          return user
        }),

      authenticateWithToken: (token) =>
        Effect.gen(function* () {
          const accessToken = yield* tokenService.verifyToken(token).pipe(
            Effect.mapError(
              (e) =>
                new AuthenticationError({
                  message: e.message,
                  reason: e._tag === "TokenExpiredError" ? "expired_token" : "invalid_token",
                })
            )
          )

          const maybeUser = yield* userProvider.findById(accessToken.userId)

          if (Option.isNone(maybeUser)) {
            return yield* Effect.fail(
              new AuthenticationError({
                message: "User not found",
                reason: "invalid_token",
              })
            )
          }

          return {
            id: accessToken.userId,
            token: accessToken,
          }
        }),

      getUser: (userId) =>
        Effect.gen(function* () {
          const maybeUser = yield* userProvider.findById(userId)

          if (Option.isNone(maybeUser)) {
            return yield* Effect.fail(
              new UserNotFoundError({
                message: "User not found",
                userId,
              })
            )
          }

          return maybeUser.value
        }),

      createToken: (userId, name, scopes, expiresAt) =>
        tokenService.createToken(userId, name, scopes, expiresAt),

      getTokens: (userId) => tokenService.getUserTokens(userId),

      revokeToken: (tokenId) =>
        tokenService.revokeToken(tokenId as any).pipe(
          Effect.catchAll(() => Effect.void)
        ),

      revokeAllTokens: (userId) => tokenService.revokeAllTokens(userId),

      hashPassword: (password) => passwordHasher.hash(password).pipe(
        Effect.catchAll(() => Effect.succeed(""))
      ),

      needsRehash: (hash) => passwordHasher.needsRehash(hash),
    }

    return service
  })
)
