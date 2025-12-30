/**
 * @gello/auth-authorization - Domain Types
 *
 * CASL-style ability types for authorization.
 */

// =============================================================================
// Core Types
// =============================================================================

/**
 * An action that can be performed (e.g., 'read', 'create', 'update', 'delete', 'manage')
 */
export type Action = string

/**
 * A subject that an action can be performed on.
 * Can be a string (type name) or an object instance.
 */
export type Subject = string | object

/**
 * Conditions for a rule - partial object matching
 */
export type Conditions<T = Record<string, unknown>> = Partial<T>

/**
 * A single ability rule
 */
export interface Rule<TSubject extends Subject = Subject> {
  readonly action: Action | ReadonlyArray<Action>
  readonly subject: TSubject | ReadonlyArray<TSubject>
  readonly conditions?: Conditions
  readonly inverted: boolean // true for 'cannot'
  readonly reason?: string
}

/**
 * Subject type extractor - gets the type name from a subject
 */
export const getSubjectType = (subject: Subject): string => {
  if (typeof subject === "string") return subject
  return subject.constructor.name
}

/**
 * Check if an action matches
 */
export const matchAction = (
  ruleAction: Action | ReadonlyArray<Action>,
  action: Action
): boolean => {
  const actions = Array.isArray(ruleAction) ? ruleAction : [ruleAction]
  return actions.includes(action) || actions.includes("manage")
}

/**
 * Check if a subject matches
 */
export const matchSubject = (
  ruleSubject: Subject | ReadonlyArray<Subject>,
  subject: Subject
): boolean => {
  const subjects = Array.isArray(ruleSubject) ? ruleSubject : [ruleSubject]
  const subjectType = getSubjectType(subject)

  return subjects.some((s) => {
    if (s === "all") return true
    if (typeof s === "string") return s === subjectType
    return s === subject
  })
}

/**
 * Check if conditions match a subject
 */
export const matchConditions = (
  conditions: Conditions | undefined,
  subject: Subject
): boolean => {
  if (!conditions) return true
  if (typeof subject === "string") return true

  return Object.entries(conditions).every(([key, value]) => {
    return (subject as Record<string, unknown>)[key] === value
  })
}

// =============================================================================
// Ability Set
// =============================================================================

/**
 * A set of abilities for a user
 */
export interface Abilities {
  /**
   * The rules in this ability set
   */
  readonly rules: ReadonlyArray<Rule>

  /**
   * Check if an action can be performed on a subject
   */
  readonly can: (action: Action, subject: Subject) => boolean

  /**
   * Check if an action cannot be performed on a subject
   */
  readonly cannot: (action: Action, subject: Subject) => boolean

  /**
   * Get the reason why an action is forbidden (if any)
   */
  readonly relevantRuleFor: (action: Action, subject: Subject) => Rule | undefined
}

/**
 * Create an Abilities instance from rules
 */
export const createAbilities = (rules: ReadonlyArray<Rule>): Abilities => {
  const can = (action: Action, subject: Subject): boolean => {
    // Find all matching rules
    const matchingRules = rules.filter(
      (rule) =>
        matchAction(rule.action, action) &&
        matchSubject(rule.subject, subject) &&
        matchConditions(rule.conditions, subject)
    )

    if (matchingRules.length === 0) return false

    // If any inverted rule matches, it's forbidden
    const hasInverted = matchingRules.some((r) => r.inverted)
    const hasPositive = matchingRules.some((r) => !r.inverted)

    // Inverted rules take precedence
    if (hasInverted) return false
    return hasPositive
  }

  const cannot = (action: Action, subject: Subject): boolean => !can(action, subject)

  const relevantRuleFor = (action: Action, subject: Subject): Rule | undefined => {
    return rules.find(
      (rule) =>
        matchAction(rule.action, action) &&
        matchSubject(rule.subject, subject) &&
        matchConditions(rule.conditions, subject)
    )
  }

  return {
    rules,
    can,
    cannot,
    relevantRuleFor,
  }
}
