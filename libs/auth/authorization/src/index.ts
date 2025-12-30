/**
 * @gello/auth-authorization
 *
 * CASL-style authorization for the Gello auth system.
 */

// Domain Types
export {
  type Action,
  type Subject,
  type Conditions,
  type Rule,
  type Abilities,
  getSubjectType,
  matchAction,
  matchSubject,
  matchConditions,
  createAbilities,
} from "./lib/domain/types.js"

// Errors
export {
  AuthorizationError,
  ForbiddenError,
  type AuthorizationSystemError,
} from "./lib/domain/errors.js"

// Services
export {
  defineAbilitiesFor,
  type AbilityBuilderContext,
  type AbilityDefiner,
  CommonAbilities,
} from "./lib/services/AbilityBuilder.js"

export {
  AbilitiesTag,
  AbilitiesLive,
  can,
  cannot,
  authorize,
  authorizeAll,
  authorizeAny,
} from "./lib/services/Abilities.js"

// Middleware
export {
  authorizeMiddleware,
  authorize as authorizeAction,
  requireAdmin,
  requireAny,
  type AuthorizeOptions,
} from "./lib/middleware/authorize.js"
