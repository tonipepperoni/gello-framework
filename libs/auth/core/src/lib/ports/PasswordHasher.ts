/**
 * @gello/auth-core - Password Hasher Port
 *
 * Port for password hashing operations.
 */

import { Context, Effect } from "effect"
import type { HashingError } from "../domain/errors.js"

/**
 * Password hasher port for secure password operations.
 */
export interface PasswordHasher {
  /**
   * Hash a plain text password
   */
  readonly hash: (
    password: string
  ) => Effect.Effect<string, HashingError>

  /**
   * Verify a plain text password against a hash
   */
  readonly verify: (
    password: string,
    hash: string
  ) => Effect.Effect<boolean, HashingError>

  /**
   * Check if a hash needs to be rehashed (e.g., cost changed)
   */
  readonly needsRehash: (hash: string) => boolean
}

/**
 * Password hasher service tag
 */
export class PasswordHasherTag extends Context.Tag("@gello/auth/PasswordHasher")<
  PasswordHasherTag,
  PasswordHasher
>() {}

/**
 * Token hasher for API tokens (SHA-256)
 */
export interface TokenHasher {
  /**
   * Hash a plain text token using SHA-256
   */
  readonly hash: (token: string) => string

  /**
   * Verify a plain text token against a hash
   */
  readonly verify: (token: string, hash: string) => boolean
}

/**
 * Token hasher service tag
 */
export class TokenHasherTag extends Context.Tag("@gello/auth/TokenHasher")<
  TokenHasherTag,
  TokenHasher
>() {}
