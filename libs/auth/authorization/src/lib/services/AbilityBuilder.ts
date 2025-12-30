/**
 * @gello/auth-authorization - Ability Builder
 *
 * CASL-style ability builder for defining permissions.
 */

import type { Action, Subject, Conditions, Rule, Abilities } from "../domain/types.js"
import { createAbilities } from "../domain/types.js"

/**
 * Ability builder context passed to the define function
 */
export interface AbilityBuilderContext<TUser> {
  /**
   * The user we're building abilities for
   */
  readonly user: TUser

  /**
   * Define what the user CAN do
   */
  readonly can: <TSubject extends Subject>(
    action: Action | Action[],
    subject: TSubject | TSubject[],
    conditions?: Conditions
  ) => void

  /**
   * Define what the user CANNOT do
   */
  readonly cannot: <TSubject extends Subject>(
    action: Action | Action[],
    subject: TSubject | TSubject[],
    conditions?: Conditions,
    reason?: string
  ) => void
}

/**
 * Define abilities for a user
 *
 * @example
 * ```typescript
 * const abilities = defineAbilitiesFor(user, ({ can, cannot }) => {
 *   // Everyone can read posts
 *   can('read', 'Post')
 *
 *   // Users can update their own posts
 *   can('update', 'Post', { authorId: user.id })
 *
 *   // Admins can do everything
 *   if (user.role === 'admin') {
 *     can('manage', 'all')
 *   }
 *
 *   // No one can delete published posts
 *   cannot('delete', 'Post', { published: true }, 'Cannot delete published posts')
 * })
 *
 * abilities.can('read', post)    // true
 * abilities.can('update', post)  // depends on post.authorId
 * ```
 */
export function defineAbilitiesFor<TUser>(
  user: TUser,
  define: (context: AbilityBuilderContext<TUser>) => void
): Abilities {
  const rules: Rule[] = []

  const context: AbilityBuilderContext<TUser> = {
    user,

    can: (action, subject, conditions) => {
      rules.push({
        action: Array.isArray(action) ? action : [action],
        subject: Array.isArray(subject) ? subject : [subject],
        conditions,
        inverted: false,
      })
    },

    cannot: (action, subject, conditions, reason) => {
      rules.push({
        action: Array.isArray(action) ? action : [action],
        subject: Array.isArray(subject) ? subject : [subject],
        conditions,
        inverted: true,
        reason,
      })
    },
  }

  define(context)

  return createAbilities(rules)
}

/**
 * Common ability patterns
 */
export const CommonAbilities = {
  /**
   * CRUD abilities for a resource
   */
  crud: (subject: string): Action[] => ["create", "read", "update", "delete"],

  /**
   * Full management (includes all actions)
   */
  manage: "manage" as const,

  /**
   * All subjects wildcard
   */
  all: "all" as const,
}

/**
 * Type helper for creating typed ability definitions
 */
export type AbilityDefiner<TUser> = (context: AbilityBuilderContext<TUser>) => void
