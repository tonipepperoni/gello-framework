/**
 * @gello/auth-core - Authenticatable Port
 *
 * Contract for user models that can be authenticated.
 */

import { Context, Effect, Option } from "effect"
import type { UserId } from "../domain/types.js"

/**
 * Minimal user interface for authentication.
 * Your user model should implement this interface.
 */
export interface Authenticatable {
  readonly id: UserId
  readonly email: string
  readonly password: string // hashed
}

/**
 * User provider port for retrieving users during authentication.
 */
export interface UserProvider<TUser extends Authenticatable = Authenticatable> {
  /**
   * Find a user by their unique identifier
   */
  readonly findById: (
    id: UserId
  ) => Effect.Effect<Option.Option<TUser>>

  /**
   * Find a user by their email address
   */
  readonly findByEmail: (
    email: string
  ) => Effect.Effect<Option.Option<TUser>>

  /**
   * Find a user by custom credentials (for API token auth)
   */
  readonly findByCredentials?: (
    credentials: Record<string, unknown>
  ) => Effect.Effect<Option.Option<TUser>>
}

/**
 * User provider service tag
 */
export class UserProviderTag extends Context.Tag("@gello/auth/UserProvider")<
  UserProviderTag,
  UserProvider
>() {}
