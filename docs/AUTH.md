# Gello Authentication & Authorization PRD

> **Version:** 1.0
> **Status:** Draft
> **Last Updated:** 2025-01-XX

## Executive Summary

This document specifies a comprehensive authentication and authorization system for Gello, designed with:

- **Laravel's simplicity** for common auth patterns
- **Supabase's flexibility** for token and session management
- **NestJS CASL's power** for fine-grained authorization
- **Effect-native patterns** for type safety and composability

The system follows Gello's hexagonal DDD architecture with Effect-based services.

---

## Table of Contents

1. [Goals & Non-Goals](#1-goals--non-goals)
2. [Core Architecture](#2-core-architecture)
3. [Authentication System](#3-authentication-system)
4. [Authorization System](#4-authorization-system)
5. [Social Authentication (OAuth)](#5-social-authentication-oauth)
6. [Email Integration](#6-email-integration)
7. [API Reference](#7-api-reference)
8. [Security Considerations](#8-security-considerations)
9. [Implementation Phases](#9-implementation-phases)
10. [Migration Guide](#10-migration-guide)

---

## 1. Goals & Non-Goals

### Goals

1. **Simplicity First**: Common auth patterns (login, register, password reset) should require minimal code
2. **Type Safety**: All auth operations typed with Effect, branded types for tokens/IDs
3. **Flexibility**: Support session-based (web), token-based (API), and OAuth flows
4. **Fine-Grained Authorization**: CASL-inspired abilities with Laravel's gates/policies simplicity
5. **Mail Integration**: Seamless integration with `@gello/mail` for verification and reset flows
6. **Driver Pattern**: Swappable session stores (memory, Redis, database)
7. **Composable Middleware**: Auth guards compose naturally with existing middleware

### Non-Goals

1. **Full OAuth2 Server**: No authorization code grants, refresh token rotation (defer to v2)
2. **Multi-Tenancy**: Single-tenant focus for v1
3. **SSO/SAML**: Enterprise features deferred
4. **Biometric/WebAuthn**: Modern auth methods deferred

---

## 2. Core Architecture

### 2.1 Package Structure

```
libs/
├── auth/
│   ├── core/                    # @gello/auth-core
│   │   ├── contracts/           # Ports and interfaces
│   │   │   ├── ports.ts         # AuthService, SessionStore, TokenService
│   │   │   ├── errors.ts        # All auth error types
│   │   │   └── types.ts         # User, Session, Token types
│   │   └── domain/
│   │       ├── user.ts          # AuthUser, Credentials
│   │       ├── session.ts       # Session management
│   │       └── token.ts         # Token generation/verification
│   │
│   ├── authorization/           # @gello/auth-authorization
│   │   ├── abilities/           # CASL-inspired abilities
│   │   ├── gates/               # Laravel-inspired gates
│   │   ├── policies/            # Resource-based policies
│   │   └── middleware/          # Authorization guards
│   │
│   ├── oauth/                   # @gello/auth-oauth
│   │   ├── core/                # Provider abstraction
│   │   ├── providers/           # GitHub, Google, etc.
│   │   └── state/               # CSRF state management
│   │
│   ├── session/                 # @gello/auth-session
│   │   ├── stores/              # Memory, Redis, Database
│   │   ├── jwt/                 # JWT utilities
│   │   └── middleware/          # Session middleware
│   │
│   ├── templates/               # @gello/auth-templates
│   │   ├── email/               # Pre-built email templates
│   │   └── pages/               # Optional UI templates
│   │
│   └── testing/                 # @gello/auth-testing
│       ├── mocks/               # Mock auth services
│       └── helpers/             # actingAs(), withAbilities()
│
└── publishable/
    └── auth/                    # @gello/auth (aggregator)
```

### 2.2 Dependency Graph

```
contracts (zero-dep)
    ↓
authorization ← core/domain
    ↓           ↓
  oauth ← session
    ↓       ↓
templates → mail integration
```

### 2.3 Effect Service Pattern

All auth services follow Gello's Context.Tag pattern:

```typescript
// Service definition
export class AuthService extends Context.Tag("@gello/AuthService")<
  AuthService,
  AuthServicePort
>() {}

// Implementation layer
export const AuthServiceLive: Layer.Layer<AuthService, never, UserRepository | SessionStore> =
  Layer.effect(AuthService, makeAuthService);

// Usage in handlers
const loginHandler = Effect.gen(function* () {
  const auth = yield* AuthService;
  const session = yield* auth.attempt(email, password);
  return Response.json({ token: session.token });
});
```

---

## 3. Authentication System

### 3.1 Core Types

```typescript
// libs/auth/core/contracts/types.ts

import { Brand, Schema } from "@gello/fp";

// Branded types for compile-time safety
export type UserId = Brand.Branded<string, "UserId">;
export const UserId = Brand.nominal<UserId>();

export type SessionId = Brand.Branded<string, "SessionId">;
export const SessionId = Brand.nominal<SessionId>();

export type AccessToken = Brand.Branded<string, "AccessToken">;
export const AccessToken = Brand.nominal<AccessToken>();

export type RefreshToken = Brand.Branded<string, "RefreshToken">;
export const RefreshToken = Brand.nominal<RefreshToken>();

// Auth user (minimal identity)
export interface AuthUser {
  readonly id: UserId;
  readonly email: string;
  readonly emailVerifiedAt: Option.Option<Date>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const AuthUser = Schema.Struct({
  id: Schema.String.pipe(Schema.fromBrand(UserId)),
  email: Schema.String,
  emailVerifiedAt: Schema.OptionFromNullOr(Schema.Date),
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
});

// Credentials
export interface Credentials {
  readonly email: string;
  readonly password: string;
  readonly remember?: boolean;
}

export const Credentials = Schema.Struct({
  email: Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
  password: Schema.String.pipe(Schema.minLength(8)),
  remember: Schema.optional(Schema.Boolean),
});

// Session
export interface Session {
  readonly id: SessionId;
  readonly userId: UserId;
  readonly token: AccessToken;
  readonly refreshToken: Option.Option<RefreshToken>;
  readonly expiresAt: Date;
  readonly ipAddress: Option.Option<string>;
  readonly userAgent: Option.Option<string>;
  readonly lastActivityAt: Date;
  readonly createdAt: Date;
}

// Token payload (JWT claims)
export interface TokenPayload {
  readonly sub: UserId;           // Subject (user ID)
  readonly iat: number;           // Issued at
  readonly exp: number;           // Expiration
  readonly jti: SessionId;        // JWT ID (session ID)
  readonly aud?: string;          // Audience
  readonly abilities?: string[];  // Token scopes
}
```

### 3.2 Error Types

```typescript
// libs/auth/core/contracts/errors.ts

import { Data } from "effect";

// Authentication errors
export class InvalidCredentialsError extends Data.TaggedError("InvalidCredentialsError")<{
  readonly message: string;
}> {
  static make = () => new InvalidCredentialsError({
    message: "Invalid email or password"
  });
}

export class UserNotFoundError extends Data.TaggedError("UserNotFoundError")<{
  readonly email: string;
}> {
  get message() {
    return `User not found: ${this.email}`;
  }
}

export class EmailNotVerifiedError extends Data.TaggedError("EmailNotVerifiedError")<{
  readonly userId: UserId;
}> {
  get message() {
    return "Email address has not been verified";
  }
}

export class AccountDisabledError extends Data.TaggedError("AccountDisabledError")<{
  readonly userId: UserId;
  readonly reason?: string;
}> {
  get message() {
    return this.reason ?? "Account has been disabled";
  }
}

// Token errors
export class TokenExpiredError extends Data.TaggedError("TokenExpiredError")<{
  readonly expiredAt: Date;
}> {
  get message() {
    return `Token expired at ${this.expiredAt.toISOString()}`;
  }
}

export class InvalidTokenError extends Data.TaggedError("InvalidTokenError")<{
  readonly reason: "malformed" | "invalid_signature" | "not_found" | "revoked";
}> {
  get message() {
    return `Invalid token: ${this.reason}`;
  }
}

export class TokenRevokedError extends Data.TaggedError("TokenRevokedError")<{
  readonly revokedAt: Date;
}> {}

// Session errors
export class SessionExpiredError extends Data.TaggedError("SessionExpiredError")<{
  readonly sessionId: SessionId;
}> {}

export class SessionNotFoundError extends Data.TaggedError("SessionNotFoundError")<{
  readonly sessionId: SessionId;
}> {}

// Authorization errors
export class UnauthorizedError extends Data.TaggedError("UnauthorizedError")<{
  readonly message: string;
  readonly action?: string;
  readonly resource?: string;
}> {
  static make = (message = "Unauthorized") => new UnauthorizedError({ message });

  static forAction = (action: string, resource?: string) =>
    new UnauthorizedError({
      message: resource
        ? `Not authorized to ${action} ${resource}`
        : `Not authorized to ${action}`,
      action,
      resource,
    });
}

export class ForbiddenError extends Data.TaggedError("ForbiddenError")<{
  readonly message: string;
  readonly requiredAbility?: string;
}> {
  static make = (message = "Forbidden") => new ForbiddenError({ message });

  static missingAbility = (ability: string) =>
    new ForbiddenError({
      message: `Missing required ability: ${ability}`,
      requiredAbility: ability,
    });
}

// Password errors
export class PasswordResetExpiredError extends Data.TaggedError("PasswordResetExpiredError")<{
  readonly token: string;
}> {}

export class PasswordMismatchError extends Data.TaggedError("PasswordMismatchError")<{}> {
  get message() {
    return "Passwords do not match";
  }
}

export class WeakPasswordError extends Data.TaggedError("WeakPasswordError")<{
  readonly violations: string[];
}> {
  get message() {
    return `Password too weak: ${this.violations.join(", ")}`;
  }
}

// OAuth errors
export class OAuthStateError extends Data.TaggedError("OAuthStateError")<{
  readonly reason: "missing" | "invalid" | "expired";
}> {}

export class OAuthProviderError extends Data.TaggedError("OAuthProviderError")<{
  readonly provider: string;
  readonly message: string;
  readonly cause?: unknown;
}> {}

// Union type for all auth errors
export type AuthError =
  | InvalidCredentialsError
  | UserNotFoundError
  | EmailNotVerifiedError
  | AccountDisabledError
  | TokenExpiredError
  | InvalidTokenError
  | TokenRevokedError
  | SessionExpiredError
  | SessionNotFoundError
  | UnauthorizedError
  | ForbiddenError
  | PasswordResetExpiredError
  | PasswordMismatchError
  | WeakPasswordError
  | OAuthStateError
  | OAuthProviderError;
```

### 3.3 Auth Service Port

```typescript
// libs/auth/core/contracts/ports.ts

export interface AuthServicePort {
  /**
   * Authenticate with email/password
   * Returns session on success
   */
  attempt(
    credentials: Credentials
  ): Effect.Effect<Session, InvalidCredentialsError | AccountDisabledError>;

  /**
   * Register a new user
   * Optionally sends verification email
   */
  register(
    data: RegisterData,
    options?: { sendVerificationEmail?: boolean }
  ): Effect.Effect<AuthUser, UserAlreadyExistsError | ValidationError>;

  /**
   * Logout - invalidate session
   */
  logout(
    sessionId: SessionId
  ): Effect.Effect<void, SessionNotFoundError>;

  /**
   * Logout all sessions for user
   */
  logoutAll(
    userId: UserId
  ): Effect.Effect<number>; // Returns count of invalidated sessions

  /**
   * Verify access token
   * Returns user if valid
   */
  verify(
    token: AccessToken
  ): Effect.Effect<AuthUser, TokenExpiredError | InvalidTokenError>;

  /**
   * Refresh session with refresh token
   */
  refresh(
    refreshToken: RefreshToken
  ): Effect.Effect<Session, TokenExpiredError | InvalidTokenError>;

  /**
   * Get current authenticated user
   * Fails if not authenticated
   */
  user(): Effect.Effect<AuthUser, UnauthorizedError>;

  /**
   * Check if request is authenticated
   */
  check(): Effect.Effect<boolean>;

  /**
   * Get user's active sessions
   */
  sessions(
    userId: UserId
  ): Effect.Effect<ReadonlyArray<Session>>;
}

export class AuthService extends Context.Tag("@gello/AuthService")<
  AuthService,
  AuthServicePort
>() {}
```

### 3.4 Session Store Port

```typescript
// libs/auth/session/contracts.ts

export interface SessionStorePort {
  /**
   * Create a new session
   */
  create(
    userId: UserId,
    options?: SessionOptions
  ): Effect.Effect<Session, SessionError>;

  /**
   * Find session by ID
   */
  find(
    sessionId: SessionId
  ): Effect.Effect<Option.Option<Session>>;

  /**
   * Find session by token
   */
  findByToken(
    token: AccessToken
  ): Effect.Effect<Option.Option<Session>>;

  /**
   * Update session (extend expiry, update activity)
   */
  touch(
    sessionId: SessionId
  ): Effect.Effect<Session, SessionNotFoundError>;

  /**
   * Destroy session
   */
  destroy(
    sessionId: SessionId
  ): Effect.Effect<void>;

  /**
   * Destroy all sessions for user
   */
  destroyForUser(
    userId: UserId
  ): Effect.Effect<number>;

  /**
   * Get all sessions for user
   */
  forUser(
    userId: UserId
  ): Effect.Effect<ReadonlyArray<Session>>;

  /**
   * Garbage collect expired sessions
   */
  gc(): Effect.Effect<number>;
}

export class SessionStore extends Context.Tag("@gello/SessionStore")<
  SessionStore,
  SessionStorePort
>() {}
```

### 3.5 Token Service

```typescript
// libs/auth/session/jwt/token-service.ts

export interface TokenServicePort {
  /**
   * Generate access token
   */
  generateAccessToken(
    payload: Omit<TokenPayload, "iat" | "exp">,
    options?: { expiresIn?: Duration.Duration }
  ): Effect.Effect<AccessToken, TokenError>;

  /**
   * Generate refresh token
   */
  generateRefreshToken(
    userId: UserId
  ): Effect.Effect<RefreshToken, TokenError>;

  /**
   * Verify and decode access token
   */
  verifyAccessToken(
    token: AccessToken
  ): Effect.Effect<TokenPayload, TokenExpiredError | InvalidTokenError>;

  /**
   * Verify refresh token
   */
  verifyRefreshToken(
    token: RefreshToken
  ): Effect.Effect<UserId, TokenExpiredError | InvalidTokenError>;

  /**
   * Revoke token
   */
  revoke(
    token: AccessToken | RefreshToken
  ): Effect.Effect<void>;

  /**
   * Check if token is revoked
   */
  isRevoked(
    token: AccessToken | RefreshToken
  ): Effect.Effect<boolean>;
}

export class TokenService extends Context.Tag("@gello/TokenService")<
  TokenService,
  TokenServicePort
>() {}

// JWT configuration
export interface JwtConfig {
  readonly secret: string;
  readonly issuer?: string;
  readonly audience?: string;
  readonly accessTokenTtl: Duration.Duration;  // Default: 15 minutes
  readonly refreshTokenTtl: Duration.Duration; // Default: 7 days
  readonly algorithm: "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512";
}

export const JwtConfig = Schema.Struct({
  secret: Schema.String.pipe(Schema.minLength(32)),
  issuer: Schema.optional(Schema.String),
  audience: Schema.optional(Schema.String),
  accessTokenTtl: Schema.DurationFromMillis.pipe(Schema.propertySignature, Schema.withDefault(() => Duration.minutes(15))),
  refreshTokenTtl: Schema.DurationFromMillis.pipe(Schema.propertySignature, Schema.withDefault(() => Duration.days(7))),
  algorithm: Schema.Literal("HS256", "HS384", "HS512", "RS256", "RS384", "RS512").pipe(
    Schema.propertySignature,
    Schema.withDefault(() => "HS256" as const)
  ),
});
```

### 3.6 Password Service

```typescript
// libs/auth/core/domain/password.ts

export interface PasswordServicePort {
  /**
   * Hash password
   */
  hash(password: string): Effect.Effect<string>;

  /**
   * Verify password against hash
   */
  verify(password: string, hash: string): Effect.Effect<boolean>;

  /**
   * Check password strength
   */
  checkStrength(password: string): Effect.Effect<void, WeakPasswordError>;

  /**
   * Generate secure random password
   */
  generate(length?: number): Effect.Effect<string>;
}

export class PasswordService extends Context.Tag("@gello/PasswordService")<
  PasswordService,
  PasswordServicePort
>() {}

// Default implementation using bcrypt
export const PasswordServiceLive = Layer.succeed(
  PasswordService,
  PasswordService.of({
    hash: (password) =>
      Effect.promise(() => bcrypt.hash(password, 12)),

    verify: (password, hash) =>
      Effect.promise(() => bcrypt.compare(password, hash)),

    checkStrength: (password) =>
      Effect.gen(function* () {
        const violations: string[] = [];

        if (password.length < 8) violations.push("minimum 8 characters");
        if (!/[A-Z]/.test(password)) violations.push("at least one uppercase letter");
        if (!/[a-z]/.test(password)) violations.push("at least one lowercase letter");
        if (!/[0-9]/.test(password)) violations.push("at least one number");

        if (violations.length > 0) {
          return yield* Effect.fail(new WeakPasswordError({ violations }));
        }
      }),

    generate: (length = 16) =>
      Effect.sync(() => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        return Array.from(
          { length },
          () => chars[Math.floor(Math.random() * chars.length)]
        ).join("");
      }),
  })
);
```

### 3.7 Auth Middleware

```typescript
// libs/auth/core/middleware/auth.ts

/**
 * Require authentication
 * Fails with UnauthorizedError if not authenticated
 */
export const requireAuth: Middleware<AuthService | SessionStore, UnauthorizedError> = {
  name: "requireAuth",
  apply: <A, E, R>(handler: Effect.Effect<A, E, R>) =>
    Effect.gen(function* () {
      const auth = yield* AuthService;
      const isAuthenticated = yield* auth.check();

      if (!isAuthenticated) {
        return yield* Effect.fail(UnauthorizedError.make("Authentication required"));
      }

      return yield* handler;
    }),
};

/**
 * Optional authentication
 * Sets user in context if authenticated, continues otherwise
 */
export const optionalAuth: Middleware<AuthService | SessionStore, never> = {
  name: "optionalAuth",
  apply: <A, E, R>(handler: Effect.Effect<A, E, R>) =>
    Effect.gen(function* () {
      const auth = yield* AuthService;
      yield* auth.check().pipe(Effect.ignore);
      return yield* handler;
    }),
};

/**
 * Require email verification
 */
export const requireVerifiedEmail: Middleware<AuthService, UnauthorizedError | EmailNotVerifiedError> = {
  name: "requireVerifiedEmail",
  apply: <A, E, R>(handler: Effect.Effect<A, E, R>) =>
    Effect.gen(function* () {
      const auth = yield* AuthService;
      const user = yield* auth.user();

      if (Option.isNone(user.emailVerifiedAt)) {
        return yield* Effect.fail(new EmailNotVerifiedError({ userId: user.id }));
      }

      return yield* handler;
    }),
};

/**
 * Extract bearer token from Authorization header
 */
export const extractBearerToken = (
  request: HttpServerRequest.HttpServerRequest
): Effect.Effect<AccessToken, InvalidTokenError> =>
  Effect.gen(function* () {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return yield* Effect.fail(new InvalidTokenError({ reason: "not_found" }));
    }

    if (!authHeader.startsWith("Bearer ")) {
      return yield* Effect.fail(new InvalidTokenError({ reason: "malformed" }));
    }

    return AccessToken(authHeader.substring(7));
  });
```

---

## 4. Authorization System

### 4.1 Design Philosophy

The authorization system balances power with simplicity:

| Use Case | Mechanism | Complexity |
|----------|-----------|------------|
| Simple yes/no checks | **Gates** | Low |
| Resource ownership | **Policies** | Medium |
| Complex permissions | **Abilities** | Medium-High |

### 4.2 Abilities (CASL-Inspired)

```typescript
// libs/auth/authorization/abilities/types.ts

// Action types as branded strings
export type Action =
  | Brand.Branded<"create", "Action">
  | Brand.Branded<"read", "Action">
  | Brand.Branded<"update", "Action">
  | Brand.Branded<"delete", "Action">
  | Brand.Branded<"manage", "Action">; // Super-permission

export const Action = {
  Create: Brand.nominal<Brand.Branded<"create", "Action">>()("create"),
  Read: Brand.nominal<Brand.Branded<"read", "Action">>()("read"),
  Update: Brand.nominal<Brand.Branded<"update", "Action">>()("update"),
  Delete: Brand.nominal<Brand.Branded<"delete", "Action">>()("delete"),
  Manage: Brand.nominal<Brand.Branded<"manage", "Action">>()("manage"),
} as const;

// Subject types
export type Subject = string; // Resource name like "Todo", "User", "all"

// Ability rule
export interface AbilityRule<TSubject = unknown> {
  readonly action: Action | Action[];
  readonly subject: Subject;
  readonly conditions?: (resource: TSubject, user: AuthUser) => boolean;
  readonly fields?: string[];
  readonly inverted?: boolean; // For "cannot" rules
  readonly reason?: string;    // Error message for denials
}

// Ability checker interface
export interface AbilityChecker {
  can(action: Action, subject: Subject, resource?: unknown): boolean;
  cannot(action: Action, subject: Subject, resource?: unknown): boolean;
  relevantRulesFor(action: Action, subject: Subject): AbilityRule[];
}

// Ability builder
export interface AbilityBuilder {
  can<T>(
    action: Action | Action[],
    subject: Subject,
    conditionOrFields?: ((resource: T, user: AuthUser) => boolean) | string[]
  ): AbilityBuilder;

  cannot<T>(
    action: Action | Action[],
    subject: Subject,
    conditionOrFields?: ((resource: T, user: AuthUser) => boolean) | string[]
  ): AbilityBuilder;

  build(): AbilityChecker;
}
```

### 4.3 Ability Definition

```typescript
// libs/auth/authorization/abilities/define.ts

/**
 * Define abilities for a user
 *
 * @example
 * ```typescript
 * const abilities = defineAbilitiesFor(user, ({ can, cannot }) => {
 *   // Everyone can read todos
 *   can(Action.Read, "Todo");
 *
 *   // Users can update their own todos
 *   can(Action.Update, "Todo", (todo) => todo.authorId === user.id);
 *
 *   // Admins can manage everything
 *   if (user.role === "admin") {
 *     can(Action.Manage, "all");
 *   }
 *
 *   // No one can delete archived todos
 *   cannot(Action.Delete, "Todo", (todo) => todo.archivedAt !== null);
 * });
 * ```
 */
export const defineAbilitiesFor = (
  user: AuthUser,
  define: (builder: AbilityBuilder, user: AuthUser) => void
): AbilityChecker => {
  const rules: AbilityRule[] = [];

  const builder: AbilityBuilder = {
    can: (action, subject, conditionOrFields) => {
      const actions = Array.isArray(action) ? action : [action];

      for (const a of actions) {
        rules.push({
          action: a,
          subject,
          conditions: typeof conditionOrFields === "function" ? conditionOrFields : undefined,
          fields: Array.isArray(conditionOrFields) ? conditionOrFields : undefined,
          inverted: false,
        });
      }

      return builder;
    },

    cannot: (action, subject, conditionOrFields) => {
      const actions = Array.isArray(action) ? action : [action];

      for (const a of actions) {
        rules.push({
          action: a,
          subject,
          conditions: typeof conditionOrFields === "function" ? conditionOrFields : undefined,
          fields: Array.isArray(conditionOrFields) ? conditionOrFields : undefined,
          inverted: true,
        });
      }

      return builder;
    },

    build: () => createAbilityChecker(rules, user),
  };

  define(builder, user);
  return builder.build();
};

const createAbilityChecker = (
  rules: AbilityRule[],
  user: AuthUser
): AbilityChecker => ({
  can: (action, subject, resource) => {
    // Check inverted rules first (cannot)
    const denyRule = rules.find(
      (r) =>
        r.inverted &&
        matchesAction(r.action, action) &&
        matchesSubject(r.subject, subject) &&
        (!r.conditions || r.conditions(resource, user))
    );

    if (denyRule) return false;

    // Check allow rules
    return rules.some(
      (r) =>
        !r.inverted &&
        matchesAction(r.action, action) &&
        matchesSubject(r.subject, subject) &&
        (!r.conditions || r.conditions(resource, user))
    );
  },

  cannot: (action, subject, resource) => {
    return !this.can(action, subject, resource);
  },

  relevantRulesFor: (action, subject) =>
    rules.filter(
      (r) => matchesAction(r.action, action) && matchesSubject(r.subject, subject)
    ),
});

const matchesAction = (ruleAction: Action | Action[], action: Action): boolean => {
  if (Array.isArray(ruleAction)) {
    return ruleAction.some((a) => a === action || a === Action.Manage);
  }
  return ruleAction === action || ruleAction === Action.Manage;
};

const matchesSubject = (ruleSubject: Subject, subject: Subject): boolean =>
  ruleSubject === subject || ruleSubject === "all";
```

### 4.4 Gates (Laravel-Inspired)

```typescript
// libs/auth/authorization/gates/types.ts

/**
 * Gate function type
 * Returns Effect<boolean> for async authorization logic
 */
export type Gate<TResource = void> = TResource extends void
  ? (user: AuthUser) => Effect.Effect<boolean>
  : (user: AuthUser, resource: TResource) => Effect.Effect<boolean>;

export interface GateRegistryPort {
  /**
   * Define a gate
   */
  define<T = void>(name: string, gate: Gate<T>): Effect.Effect<void>;

  /**
   * Check if gate allows action
   */
  allows<T>(name: string, resource?: T): Effect.Effect<boolean, GateNotFoundError, CurrentUser>;

  /**
   * Check if gate denies action
   */
  denies<T>(name: string, resource?: T): Effect.Effect<boolean, GateNotFoundError, CurrentUser>;

  /**
   * Check gate, fail with UnauthorizedError if denied
   */
  authorize<T>(name: string, resource?: T): Effect.Effect<void, GateNotFoundError | UnauthorizedError, CurrentUser>;

  /**
   * Get all defined gate names
   */
  gates(): Effect.Effect<ReadonlyArray<string>>;
}

export class GateRegistry extends Context.Tag("@gello/GateRegistry")<
  GateRegistry,
  GateRegistryPort
>() {}
```

```typescript
// libs/auth/authorization/gates/registry.ts

export const GateRegistryLive = Layer.effect(
  GateRegistry,
  Effect.gen(function* () {
    const gates = new Map<string, Gate<unknown>>();

    return GateRegistry.of({
      define: (name, gate) =>
        Effect.sync(() => {
          gates.set(name, gate as Gate<unknown>);
        }),

      allows: (name, resource) =>
        Effect.gen(function* () {
          const gate = gates.get(name);
          if (!gate) {
            return yield* Effect.fail(new GateNotFoundError({ gate: name }));
          }

          const user = yield* CurrentUser;
          return yield* gate(user, resource);
        }),

      denies: (name, resource) =>
        Effect.gen(function* () {
          const result = yield* GateRegistry.allows(name, resource);
          return !result;
        }),

      authorize: (name, resource) =>
        Effect.gen(function* () {
          const allowed = yield* GateRegistry.allows(name, resource);
          if (!allowed) {
            return yield* Effect.fail(UnauthorizedError.forAction(name));
          }
        }),

      gates: () => Effect.succeed(Array.from(gates.keys())),
    });
  })
);

// Gate definition DSL
export const defineGates = (
  definitions: Record<string, Gate<any>>
): Effect.Effect<void, never, GateRegistry> =>
  Effect.gen(function* () {
    const registry = yield* GateRegistry;
    for (const [name, gate] of Object.entries(definitions)) {
      yield* registry.define(name, gate);
    }
  });

// Usage example
const registerAppGates = defineGates({
  "view-dashboard": (user) => Effect.succeed(true),

  "edit-settings": (user) =>
    Effect.succeed(user.role === "admin" || user.role === "manager"),

  "delete-user": (user, targetUser: User) =>
    Effect.succeed(user.role === "admin" && user.id !== targetUser.id),

  "manage-team": (user, team: Team) =>
    Effect.succeed(team.ownerId === user.id),
});
```

### 4.5 Policies (Resource-Based)

```typescript
// libs/auth/authorization/policies/types.ts

/**
 * Policy for a specific resource type
 */
export interface Policy<TResource> {
  /**
   * Resource name (e.g., "Todo", "User")
   */
  readonly resource: string;

  /**
   * Before hook - runs before any policy method
   * Return Some(true) to allow, Some(false) to deny, None to continue
   */
  before?(
    user: AuthUser,
    action: string
  ): Effect.Effect<Option.Option<boolean>>;

  /**
   * Can view any resource of this type
   */
  viewAny?(user: AuthUser): Effect.Effect<boolean>;

  /**
   * Can view specific resource
   */
  view?(user: AuthUser, resource: TResource): Effect.Effect<boolean>;

  /**
   * Can create new resource
   */
  create?(user: AuthUser): Effect.Effect<boolean>;

  /**
   * Can update resource
   */
  update?(user: AuthUser, resource: TResource): Effect.Effect<boolean>;

  /**
   * Can delete resource
   */
  delete?(user: AuthUser, resource: TResource): Effect.Effect<boolean>;

  /**
   * Can restore soft-deleted resource
   */
  restore?(user: AuthUser, resource: TResource): Effect.Effect<boolean>;

  /**
   * Can permanently delete resource
   */
  forceDelete?(user: AuthUser, resource: TResource): Effect.Effect<boolean>;
}

export interface PolicyRegistryPort {
  /**
   * Register a policy
   */
  register<T>(policy: Policy<T>): Effect.Effect<void>;

  /**
   * Authorize action on resource
   */
  authorize<T>(
    action: keyof Policy<T>,
    resource?: T
  ): Effect.Effect<void, PolicyNotFoundError | UnauthorizedError, CurrentUser>;

  /**
   * Check if action is allowed
   */
  allows<T>(
    action: keyof Policy<T>,
    resource?: T
  ): Effect.Effect<boolean, PolicyNotFoundError, CurrentUser>;

  /**
   * Get policy for resource
   */
  forResource<T>(resourceName: string): Effect.Effect<Policy<T>, PolicyNotFoundError>;
}

export class PolicyRegistry extends Context.Tag("@gello/PolicyRegistry")<
  PolicyRegistry,
  PolicyRegistryPort
>() {}
```

```typescript
// Example policy implementation
// app/policies/todo.policy.ts

export const TodoPolicy: Policy<Todo> = {
  resource: "Todo",

  // Admins bypass all checks
  before: (user, action) =>
    user.role === "admin"
      ? Effect.succeed(Option.some(true))
      : Effect.succeed(Option.none()),

  viewAny: (user) => Effect.succeed(true),

  view: (user, todo) =>
    Effect.succeed(todo.isPublic || todo.authorId === user.id),

  create: (user) => Effect.succeed(true),

  update: (user, todo) =>
    Effect.succeed(todo.authorId === user.id),

  delete: (user, todo) =>
    Effect.succeed(todo.authorId === user.id),

  restore: (user, todo) =>
    Effect.succeed(todo.authorId === user.id),

  forceDelete: (user) => Effect.succeed(false), // Only admins (handled by before)
};
```

### 4.6 Authorization Middleware

```typescript
// libs/auth/authorization/middleware/authorize.ts

/**
 * Require specific ability
 */
export const requireAbility = (
  action: Action,
  subject: Subject
): Middleware<AbilityService | CurrentUser, ForbiddenError> => ({
  name: `requireAbility:${action}:${subject}`,
  apply: <A, E, R>(handler: Effect.Effect<A, E, R>) =>
    Effect.gen(function* () {
      const abilities = yield* AbilityService;
      const user = yield* CurrentUser;
      const checker = yield* abilities.forUser(user);

      if (!checker.can(action, subject)) {
        return yield* Effect.fail(
          ForbiddenError.missingAbility(`${action}:${subject}`)
        );
      }

      return yield* handler;
    }),
});

/**
 * Require gate authorization
 */
export const requireGate = <T = void>(
  gate: string,
  getResource?: (req: HttpServerRequest.HttpServerRequest) => Effect.Effect<T, any>
): Middleware<GateRegistry | CurrentUser, GateNotFoundError | UnauthorizedError> => ({
  name: `requireGate:${gate}`,
  apply: <A, E, R>(handler: Effect.Effect<A, E, R>) =>
    Effect.gen(function* () {
      const registry = yield* GateRegistry;
      const resource = getResource
        ? yield* Effect.flatMap(HttpServerRequest.HttpServerRequest, getResource)
        : undefined;

      yield* registry.authorize(gate, resource);
      return yield* handler;
    }),
});

/**
 * Require policy authorization
 */
export const requirePolicy = <T>(
  action: keyof Policy<T>,
  getResource?: (req: HttpServerRequest.HttpServerRequest) => Effect.Effect<T, any>
): Middleware<PolicyRegistry | CurrentUser, PolicyNotFoundError | UnauthorizedError> => ({
  name: `requirePolicy:${String(action)}`,
  apply: <A, E, R>(handler: Effect.Effect<A, E, R>) =>
    Effect.gen(function* () {
      const registry = yield* PolicyRegistry;
      const resource = getResource
        ? yield* Effect.flatMap(HttpServerRequest.HttpServerRequest, getResource)
        : undefined;

      yield* registry.authorize(action, resource);
      return yield* handler;
    }),
});

/**
 * Check ownership of resource
 */
export const requireOwnership = <T extends { authorId: UserId }>(
  getResource: (req: HttpServerRequest.HttpServerRequest) => Effect.Effect<T, any>
): Middleware<CurrentUser, UnauthorizedError> => ({
  name: "requireOwnership",
  apply: <A, E, R>(handler: Effect.Effect<A, E, R>) =>
    Effect.gen(function* () {
      const user = yield* CurrentUser;
      const request = yield* HttpServerRequest.HttpServerRequest;
      const resource = yield* getResource(request);

      if (resource.authorId !== user.id) {
        return yield* Effect.fail(
          UnauthorizedError.forAction("access", "this resource")
        );
      }

      return yield* handler;
    }),
});
```

---

## 5. Social Authentication (OAuth)

### 5.1 Provider Abstraction

```typescript
// libs/auth/oauth/core/types.ts

/**
 * OAuth user profile from provider
 */
export interface OAuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: Option.Option<string>;
  readonly avatar: Option.Option<string>;
  readonly raw: Record<string, unknown>; // Full provider response
}

/**
 * OAuth token response
 */
export interface OAuthToken {
  readonly accessToken: string;
  readonly refreshToken: Option.Option<string>;
  readonly expiresIn: Option.Option<number>;
  readonly tokenType: string;
  readonly scope: Option.Option<string>;
}

/**
 * OAuth provider configuration
 */
export interface OAuthProviderConfig {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly redirectUri: string;
  readonly scopes: string[];
}

/**
 * OAuth provider interface
 */
export interface OAuthProvider {
  readonly name: string;

  /**
   * Generate authorization URL
   */
  getAuthorizationUrl(
    config: OAuthProviderConfig,
    state: string
  ): Effect.Effect<URL>;

  /**
   * Exchange authorization code for tokens
   */
  exchangeCode(
    config: OAuthProviderConfig,
    code: string
  ): Effect.Effect<OAuthToken, OAuthProviderError>;

  /**
   * Fetch user profile with access token
   */
  fetchUser(
    token: OAuthToken
  ): Effect.Effect<OAuthUser, OAuthProviderError>;

  /**
   * Refresh access token (if supported)
   */
  refreshToken?(
    config: OAuthProviderConfig,
    refreshToken: string
  ): Effect.Effect<OAuthToken, OAuthProviderError>;
}
```

### 5.2 Provider Registry

```typescript
// libs/auth/oauth/core/registry.ts

export interface OAuthRegistryPort {
  /**
   * Register a provider
   */
  register(provider: OAuthProvider): Effect.Effect<void>;

  /**
   * Get provider by name
   */
  driver(name: string): Effect.Effect<OAuthProvider, ProviderNotFoundError>;

  /**
   * List registered providers
   */
  providers(): Effect.Effect<ReadonlyArray<string>>;
}

export class OAuthRegistry extends Context.Tag("@gello/OAuthRegistry")<
  OAuthRegistry,
  OAuthRegistryPort
>() {}

// Socialite-like facade
export interface SocialitePort {
  /**
   * Start OAuth flow - returns redirect URL
   */
  redirect(
    provider: string,
    options?: { scopes?: string[] }
  ): Effect.Effect<URL, ProviderNotFoundError | ConfigError>;

  /**
   * Handle OAuth callback - exchange code for user
   */
  user(
    provider: string,
    code: string,
    state: string
  ): Effect.Effect<OAuthUser, OAuthProviderError | OAuthStateError>;

  /**
   * Stateless mode - no state verification
   */
  stateless(): SocialitePort;
}

export class Socialite extends Context.Tag("@gello/Socialite")<
  Socialite,
  SocialitePort
>() {}
```

### 5.3 Built-in Providers

```typescript
// libs/auth/oauth/providers/github.ts

export const GitHubProvider: OAuthProvider = {
  name: "github",

  getAuthorizationUrl: (config, state) =>
    Effect.sync(() => {
      const url = new URL("https://github.com/login/oauth/authorize");
      url.searchParams.set("client_id", config.clientId);
      url.searchParams.set("redirect_uri", config.redirectUri);
      url.searchParams.set("scope", config.scopes.join(" "));
      url.searchParams.set("state", state);
      return url;
    }),

  exchangeCode: (config, code) =>
    Effect.gen(function* () {
      const response = yield* HttpClient.post(
        "https://github.com/login/oauth/access_token",
        {
          body: {
            client_id: config.clientId,
            client_secret: config.clientSecret,
            code,
          },
          headers: { Accept: "application/json" },
        }
      ).pipe(
        Effect.mapError(
          (e) => new OAuthProviderError({ provider: "github", message: String(e) })
        )
      );

      return yield* Schema.decodeUnknown(OAuthTokenSchema)(response.json);
    }),

  fetchUser: (token) =>
    Effect.gen(function* () {
      const response = yield* HttpClient.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }).pipe(
        Effect.mapError(
          (e) => new OAuthProviderError({ provider: "github", message: String(e) })
        )
      );

      const data = response.json as GitHubUserResponse;

      return {
        id: String(data.id),
        email: data.email,
        name: Option.fromNullable(data.name),
        avatar: Option.fromNullable(data.avatar_url),
        raw: data,
      };
    }),
};

// libs/auth/oauth/providers/google.ts
export const GoogleProvider: OAuthProvider = {
  name: "google",
  // ... implementation
};

// libs/auth/oauth/providers/twitter.ts
export const TwitterProvider: OAuthProvider = {
  name: "twitter",
  // ... implementation (OAuth 2.0)
};
```

### 5.4 State Management

```typescript
// libs/auth/oauth/state/types.ts

export interface OAuthStateData {
  readonly provider: string;
  readonly returnUrl?: string;
  readonly createdAt: Date;
}

export interface OAuthStateStorePort {
  /**
   * Generate and store state token
   */
  generate(data: OAuthStateData): Effect.Effect<string>;

  /**
   * Verify and consume state token
   */
  verify(token: string): Effect.Effect<OAuthStateData, OAuthStateError>;

  /**
   * Cleanup expired states
   */
  gc(): Effect.Effect<number>;
}

export class OAuthStateStore extends Context.Tag("@gello/OAuthStateStore")<
  OAuthStateStore,
  OAuthStateStorePort
>() {}

// Memory implementation
export const MemoryOAuthStateStoreLive = Layer.effect(
  OAuthStateStore,
  Effect.gen(function* () {
    const states = new Map<string, { data: OAuthStateData; expiresAt: Date }>();
    const TTL = Duration.minutes(10);

    return OAuthStateStore.of({
      generate: (data) =>
        Effect.sync(() => {
          const token = crypto.randomUUID();
          states.set(token, {
            data,
            expiresAt: new Date(Date.now() + Duration.toMillis(TTL)),
          });
          return token;
        }),

      verify: (token) =>
        Effect.gen(function* () {
          const entry = states.get(token);

          if (!entry) {
            return yield* Effect.fail(new OAuthStateError({ reason: "invalid" }));
          }

          states.delete(token); // Consume token

          if (entry.expiresAt < new Date()) {
            return yield* Effect.fail(new OAuthStateError({ reason: "expired" }));
          }

          return entry.data;
        }),

      gc: () =>
        Effect.sync(() => {
          const now = new Date();
          let count = 0;
          for (const [token, entry] of states) {
            if (entry.expiresAt < now) {
              states.delete(token);
              count++;
            }
          }
          return count;
        }),
    });
  })
);
```

### 5.5 OAuth Routes

```typescript
// Example OAuth routes setup
// app/routes/auth/oauth.ts

const oauthRoutes = [
  // Initiate OAuth flow
  Route.get("/auth/:provider/redirect")
    .handle((req) =>
      Effect.gen(function* () {
        const { provider } = req.params;
        const socialite = yield* Socialite;

        const url = yield* socialite.redirect(provider);

        return Response.redirect(url.toString());
      })
    ),

  // OAuth callback
  Route.get("/auth/:provider/callback")
    .handle((req) =>
      Effect.gen(function* () {
        const { provider } = req.params;
        const { code, state } = req.query;

        const socialite = yield* Socialite;
        const auth = yield* AuthService;

        // Get OAuth user
        const oauthUser = yield* socialite.user(provider, code, state);

        // Find or create user
        const user = yield* findOrCreateFromOAuth(provider, oauthUser);

        // Create session
        const session = yield* auth.loginAs(user);

        // Redirect to app
        return Response.redirect("/dashboard")
          .pipe(Response.setCookie("session", session.token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
          }));
      })
    ),
];
```

---

## 6. Email Integration

### 6.1 Pre-Built Email Templates

```typescript
// libs/auth/templates/email/types.ts

export interface AuthEmailTemplates {
  /**
   * Email verification
   */
  verification: Mailable<{ user: AuthUser; verificationUrl: string }>;

  /**
   * Password reset
   */
  passwordReset: Mailable<{ user: AuthUser; resetUrl: string; expiresIn: string }>;

  /**
   * Welcome email (after registration)
   */
  welcome: Mailable<{ user: AuthUser }>;

  /**
   * Password changed notification
   */
  passwordChanged: Mailable<{ user: AuthUser; changedAt: Date }>;

  /**
   * New login from unknown device
   */
  newLogin: Mailable<{
    user: AuthUser;
    ipAddress: string;
    userAgent: string;
    location?: string;
  }>;

  /**
   * Account locked notification
   */
  accountLocked: Mailable<{ user: AuthUser; reason: string; unlockUrl?: string }>;
}
```

### 6.2 Verification Email

```typescript
// libs/auth/templates/email/verification.ts

export class VerificationEmail extends BaseMailable<{
  user: AuthUser;
  verificationUrl: string;
}> {
  getSubject(): string {
    return "Verify your email address";
  }

  getContent(data: { user: AuthUser; verificationUrl: string }) {
    return Effect.succeed({
      subject: this.getSubject(),
      template: {
        name: "auth/verification",
        data: {
          userName: data.user.email.split("@")[0],
          verificationUrl: data.verificationUrl,
          appName: process.env.APP_NAME ?? "App",
        },
      },
    });
  }
}

// Factory function
export const verificationEmail = (data: {
  user: AuthUser;
  verificationUrl: string;
}) =>
  new VerificationEmail()
    .to(data.user.email)
    .with(data);
```

### 6.3 Password Reset Email

```typescript
// libs/auth/templates/email/password-reset.ts

export class PasswordResetEmail extends BaseMailable<{
  user: AuthUser;
  resetUrl: string;
  expiresIn: string;
}> {
  getSubject(): string {
    return "Reset your password";
  }

  getContent(data: { user: AuthUser; resetUrl: string; expiresIn: string }) {
    return Effect.succeed({
      subject: this.getSubject(),
      template: {
        name: "auth/password-reset",
        data: {
          userName: data.user.email.split("@")[0],
          resetUrl: data.resetUrl,
          expiresIn: data.expiresIn,
          appName: process.env.APP_NAME ?? "App",
        },
      },
    });
  }
}

export const passwordResetEmail = (data: {
  user: AuthUser;
  resetUrl: string;
  expiresIn: string;
}) =>
  new PasswordResetEmail()
    .to(data.user.email)
    .with(data);
```

### 6.4 React Email Templates

```tsx
// libs/auth/templates/email/react/VerificationEmail.tsx

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  userName: string;
  verificationUrl: string;
  appName: string;
}

export const VerificationEmailTemplate = ({
  userName,
  verificationUrl,
  appName,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address for {appName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verify your email</Heading>

        <Text style={text}>Hi {userName},</Text>

        <Text style={text}>
          Thanks for signing up for {appName}! Please click the button below to
          verify your email address.
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={verificationUrl}>
            Verify Email Address
          </Button>
        </Section>

        <Text style={text}>
          If you didn't create an account, you can safely ignore this email.
        </Text>

        <Text style={footer}>
          If the button doesn't work, copy and paste this link into your browser:
          <br />
          <Link href={verificationUrl} style={link}>
            {verificationUrl}
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px",
  borderRadius: "8px",
  maxWidth: "600px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  marginBottom: "24px",
};

const text = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "1.5",
  marginBottom: "16px",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#5046e5",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "12px 24px",
  textDecoration: "none",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "1.5",
  marginTop: "32px",
};

const link = {
  color: "#5046e5",
  textDecoration: "underline",
};

export default VerificationEmailTemplate;
```

### 6.5 Password Flow Service

```typescript
// libs/auth/core/domain/password-reset.ts

export interface PasswordResetPort {
  /**
   * Request password reset - sends email
   */
  requestReset(
    email: string
  ): Effect.Effect<void, UserNotFoundError, Mail | PasswordResetTokenStore>;

  /**
   * Verify reset token is valid
   */
  verifyToken(
    token: string
  ): Effect.Effect<UserId, PasswordResetExpiredError | InvalidTokenError>;

  /**
   * Reset password with token
   */
  reset(
    token: string,
    newPassword: string
  ): Effect.Effect<void, PasswordResetExpiredError | InvalidTokenError | WeakPasswordError>;
}

export class PasswordReset extends Context.Tag("@gello/PasswordReset")<
  PasswordReset,
  PasswordResetPort
>() {}

// Implementation
const makePasswordReset = Effect.gen(function* () {
  const mail = yield* MailTag;
  const tokenStore = yield* PasswordResetTokenStore;
  const userRepo = yield* UserRepository;
  const passwordService = yield* PasswordService;
  const config = yield* ConfigService;

  return PasswordReset.of({
    requestReset: (email) =>
      Effect.gen(function* () {
        const user = yield* userRepo.findByEmail(email);

        if (Option.isNone(user)) {
          // Don't reveal if user exists
          return;
        }

        // Generate token
        const token = yield* tokenStore.create(user.value.id);

        // Build reset URL
        const baseUrl = yield* config.getString("app.url");
        const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

        // Send email
        yield* mail.send(
          passwordResetEmail({
            user: user.value,
            resetUrl,
            expiresIn: "1 hour",
          })
        );
      }),

    verifyToken: (token) =>
      tokenStore.verify(token),

    reset: (token, newPassword) =>
      Effect.gen(function* () {
        // Verify token
        const userId = yield* tokenStore.verify(token);

        // Check password strength
        yield* passwordService.checkStrength(newPassword);

        // Hash new password
        const hash = yield* passwordService.hash(newPassword);

        // Update user
        yield* userRepo.updatePassword(userId, hash);

        // Invalidate token
        yield* tokenStore.consume(token);

        // Optionally send confirmation email
        const user = yield* userRepo.findById(userId);
        if (Option.isSome(user)) {
          yield* mail.send(
            passwordChangedEmail({ user: user.value, changedAt: new Date() })
          );
        }
      }),
  });
});

export const PasswordResetLive = Layer.effect(PasswordReset, makePasswordReset);
```

### 6.6 Email Verification Service

```typescript
// libs/auth/core/domain/email-verification.ts

export interface EmailVerificationPort {
  /**
   * Send verification email
   */
  send(userId: UserId): Effect.Effect<void, UserNotFoundError, Mail>;

  /**
   * Verify email with token
   */
  verify(
    token: string
  ): Effect.Effect<AuthUser, InvalidTokenError | TokenExpiredError>;

  /**
   * Check if user's email is verified
   */
  isVerified(userId: UserId): Effect.Effect<boolean>;

  /**
   * Resend verification (with rate limiting)
   */
  resend(
    userId: UserId
  ): Effect.Effect<void, RateLimitError | UserNotFoundError, Mail>;
}

export class EmailVerification extends Context.Tag("@gello/EmailVerification")<
  EmailVerification,
  EmailVerificationPort
>() {}
```

---

## 7. API Reference

### 7.1 Auth Service API

```typescript
// High-level usage examples

// Login
const session = yield* AuthService.attempt({
  email: "user@example.com",
  password: "password123",
});

// Register
const user = yield* AuthService.register({
  email: "user@example.com",
  password: "password123",
  name: "John Doe",
}, { sendVerificationEmail: true });

// Get current user
const user = yield* AuthService.user();

// Logout
yield* AuthService.logout(sessionId);

// Logout all sessions
yield* AuthService.logoutAll(userId);

// Verify token
const user = yield* AuthService.verify(accessToken);

// Refresh session
const newSession = yield* AuthService.refresh(refreshToken);
```

### 7.2 Authorization API

```typescript
// Gates
yield* GateRegistry.authorize("edit-settings");
yield* GateRegistry.authorize("delete-user", targetUser);

const canEdit = yield* GateRegistry.allows("edit-settings");

// Policies
yield* PolicyRegistry.authorize("update", todo);
yield* PolicyRegistry.authorize("delete", todo);

const canDelete = yield* PolicyRegistry.allows("delete", todo);

// Abilities
const abilities = yield* AbilityService.forUser(user);
abilities.can(Action.Update, "Todo", todo); // boolean

// Middleware
const routes = [
  Route.delete("/todos/:id")
    .pipe(
      Route.use(requireAuth),
      Route.use(requirePolicy("delete", (req) => TodoRepo.findById(req.params.id))),
      Route.handle(deleteTodoHandler)
    ),
];
```

### 7.3 OAuth API

```typescript
// Initiate OAuth
const url = yield* Socialite.redirect("github", { scopes: ["user:email"] });

// Handle callback
const oauthUser = yield* Socialite.user("github", code, state);

// Stateless mode (no CSRF state)
const stateless = Socialite.stateless();
const user = yield* stateless.user("github", code, "");
```

### 7.4 Password Reset API

```typescript
// Request reset
yield* PasswordReset.requestReset("user@example.com");

// Verify token
const userId = yield* PasswordReset.verifyToken(token);

// Reset password
yield* PasswordReset.reset(token, "newPassword123");
```

### 7.5 Email Verification API

```typescript
// Send verification
yield* EmailVerification.send(userId);

// Verify
const user = yield* EmailVerification.verify(token);

// Check status
const isVerified = yield* EmailVerification.isVerified(userId);

// Resend (rate limited)
yield* EmailVerification.resend(userId);
```

---

## 8. Security Considerations

### 8.1 Token Security

| Concern | Mitigation |
|---------|------------|
| Token leakage | Short-lived access tokens (15 min default) |
| Token theft | HTTP-only cookies for web, secure storage for mobile |
| Token forgery | HMAC or RSA signing with strong secrets |
| Replay attacks | JTI (JWT ID) for single-use tracking |

### 8.2 Password Security

| Concern | Mitigation |
|---------|------------|
| Weak passwords | Strength validation (min length, complexity) |
| Rainbow tables | bcrypt with cost factor 12 |
| Brute force | Rate limiting, account lockout |
| Timing attacks | Constant-time comparison |

### 8.3 OAuth Security

| Concern | Mitigation |
|---------|------------|
| CSRF | State parameter validation |
| Token interception | HTTPS only, short-lived codes |
| Open redirect | Whitelist redirect URIs |
| Scope creep | Minimal required scopes |

### 8.4 Session Security

| Concern | Mitigation |
|---------|------------|
| Session hijacking | Regenerate ID on privilege change |
| Session fixation | Generate new session on login |
| Concurrent sessions | Optional single-session enforcement |
| Stale sessions | Automatic expiration, sliding window |

### 8.5 Configuration

Following Laravel's approach: minimal `.env` variables, sensible defaults in config files.

```bash
# .env - Only secrets and environment-specific values
APP_KEY=base64:your-32-char-key    # Required
APP_URL=http://localhost:3000
SESSION_DRIVER=redis               # Optional: memory | redis | database

# OAuth (only if using social auth)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

```typescript
// config/auth.ts - Sensible defaults, env vars only for secrets
import { env } from "@gello/core-config";

export const authConfig = {
  jwt: {
    secret: env("APP_KEY"),        // Reuse APP_KEY
    algorithm: "HS256",
    ttl: "15m",
    refreshTtl: "7d",
  },
  session: {
    driver: env("SESSION_DRIVER", "memory"),
    lifetime: "7d",
    cookie: {
      name: "__session",
      httpOnly: true,
      secure: env("APP_ENV") === "production",
      sameSite: "lax",
    },
  },
  password: {
    bcryptRounds: 12,
    rules: { minLength: 8, requireUppercase: true, requireLowercase: true, requireNumbers: true },
    resetExpire: "1h",
  },
  throttle: {
    login: { attempts: 5, decay: "15m" },
    passwordReset: { attempts: 3, decay: "1h" },
  },
  lockout: { enabled: true, maxAttempts: 10, duration: "1h" },
};

// Access via dot notation
const secret = yield* Config.string("auth.jwt.secret");
const driver = yield* Config.string("auth.session.driver");
```

---

## 9. Implementation Phases

### Phase 1: Core Authentication (Week 1-2)

- [ ] Core types and errors
- [ ] Password service (hash, verify, strength)
- [ ] JWT token service
- [ ] Session store (memory driver)
- [ ] Auth service (attempt, register, logout, verify)
- [ ] Auth middleware (requireAuth, optionalAuth)
- [ ] Basic tests

### Phase 2: Authorization (Week 2-3)

- [ ] Ability system (define, check)
- [ ] Gate registry
- [ ] Policy registry
- [ ] Authorization middleware
- [ ] Integration with auth middleware

### Phase 3: Password Flows (Week 3)

- [ ] Password reset token store
- [ ] Password reset service
- [ ] Email verification service
- [ ] Rate limiting for sensitive operations
- [ ] Email templates

### Phase 4: OAuth (Week 4)

- [ ] OAuth provider interface
- [ ] State store
- [ ] GitHub provider
- [ ] Google provider
- [ ] Socialite facade
- [ ] OAuth routes example

### Phase 5: Production Hardening (Week 5)

- [ ] Redis session store
- [ ] Database session store
- [ ] Comprehensive test suite
- [ ] Security audit
- [ ] Documentation
- [ ] Example application

### Phase 6: Additional Providers & Features (Future)

- [ ] Twitter/X provider
- [ ] Apple provider
- [ ] Microsoft provider
- [ ] Multi-factor authentication (MFA)
- [ ] Passkey/WebAuthn support
- [ ] Account linking

---

## 10. Migration Guide

### 10.1 From Custom Auth

```typescript
// Before: Custom auth
const user = await db.users.findByEmail(email);
if (!user || !bcrypt.compare(password, user.passwordHash)) {
  throw new Error("Invalid credentials");
}
const token = jwt.sign({ userId: user.id }, secret);

// After: Gello Auth
const session = yield* AuthService.attempt({ email, password });
// session.token is the JWT
```

### 10.2 Adding Auth to Existing App

```typescript
// 1. Install
// pnpm add @gello/auth

// 2. Configure layers
const AppLayers = Layer.mergeAll(
  AuthServiceLive,
  SessionStoreLive,
  PasswordServiceLive,
  TokenServiceLive,
  // Your existing layers...
);

// 3. Add middleware to routes
const protectedRoutes = routes.map((route) =>
  route.pipe(Route.use(requireAuth))
);

// 4. Add auth routes
const authRoutes = [
  Route.post("/auth/login").handle(loginHandler),
  Route.post("/auth/register").handle(registerHandler),
  Route.post("/auth/logout").handle(logoutHandler),
  // ...
];
```

### 10.3 Custom User Model

```typescript
// Extend AuthUser for your domain
interface AppUser extends AuthUser {
  readonly name: string;
  readonly role: "user" | "admin" | "moderator";
  readonly organizationId: OrganizationId;
}

// Provide custom user repository
export const AppUserRepositoryLive = Layer.succeed(
  UserRepository,
  {
    findById: (id) => db.users.findUnique({ where: { id } }),
    findByEmail: (email) => db.users.findUnique({ where: { email } }),
    // ...
  }
);
```

---

## Appendix A: Configuration Reference

### Environment Variables (Minimal)

Following Laravel's pattern - only secrets and environment-specific values in `.env`:

```bash
# .env - Only essential environment variables

APP_KEY=base64:your-32-char-app-key          # Required - used for encryption
APP_URL=http://localhost:3000

# Session driver (optional - defaults to memory)
SESSION_DRIVER=redis                          # memory | redis | database

# OAuth providers (only if using social auth)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Config File (Sensible Defaults)

```typescript
// config/auth.ts - Laravel-style config with sensible defaults

import { env } from "@gello/core-config";

export const authConfig = {
  /*
  |--------------------------------------------------------------------------
  | Authentication Defaults
  |--------------------------------------------------------------------------
  */
  defaults: {
    guard: "session",
  },

  /*
  |--------------------------------------------------------------------------
  | JWT Configuration
  |--------------------------------------------------------------------------
  */
  jwt: {
    secret: env("APP_KEY"),
    algorithm: "HS256",
    ttl: "15m",           // Access token lifetime
    refreshTtl: "7d",     // Refresh token lifetime
  },

  /*
  |--------------------------------------------------------------------------
  | Session Configuration
  |--------------------------------------------------------------------------
  */
  session: {
    driver: env("SESSION_DRIVER", "memory"),
    lifetime: "7d",
    cookie: {
      name: "__session",
      httpOnly: true,
      secure: env("APP_ENV") === "production",
      sameSite: "lax" as const,
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Password Configuration
  |--------------------------------------------------------------------------
  */
  password: {
    bcryptRounds: 12,
    rules: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: false,
    },
    // Password reset link expires after this duration
    resetExpire: "1h",
  },

  /*
  |--------------------------------------------------------------------------
  | Rate Limiting
  |--------------------------------------------------------------------------
  */
  throttle: {
    login: { attempts: 5, decay: "15m" },
    passwordReset: { attempts: 3, decay: "1h" },
    verification: { attempts: 3, decay: "1h" },
  },

  /*
  |--------------------------------------------------------------------------
  | Account Lockout
  |--------------------------------------------------------------------------
  */
  lockout: {
    enabled: true,
    maxAttempts: 10,
    duration: "1h",
  },

  /*
  |--------------------------------------------------------------------------
  | OAuth Providers
  |--------------------------------------------------------------------------
  */
  providers: {
    github: {
      clientId: env("GITHUB_CLIENT_ID"),
      clientSecret: env("GITHUB_CLIENT_SECRET"),
      redirectUri: `${env("APP_URL")}/auth/github/callback`,
      scopes: ["read:user", "user:email"],
    },
    google: {
      clientId: env("GOOGLE_CLIENT_ID"),
      clientSecret: env("GOOGLE_CLIENT_SECRET"),
      redirectUri: `${env("APP_URL")}/auth/google/callback`,
      scopes: ["openid", "email", "profile"],
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Email Verification
  |--------------------------------------------------------------------------
  */
  verification: {
    expire: "24h",
  },
};
```

### Config Layer Setup

```typescript
// config/index.ts
import { Config } from "@gello/core-config";
import { authConfig } from "./auth";

export const AppConfigLayer = Config.layer({
  app: {
    name: env("APP_NAME", "Gello"),
    env: env("APP_ENV", "local"),
    url: env("APP_URL", "http://localhost:3000"),
    key: env("APP_KEY"),
  },
  auth: authConfig,
});
```

### Accessing Config

```typescript
// Dot notation access in services
const secret = yield* Config.string("auth.jwt.secret");
const bcryptRounds = yield* Config.number("auth.password.bcryptRounds");
const sessionDriver = yield* Config.string("auth.session.driver");

// Get nested objects
const githubConfig = yield* Config.get("auth.providers.github");
const throttleConfig = yield* Config.get("auth.throttle.login");
```

---

## Appendix B: Error Codes

| Error | Code | HTTP Status |
|-------|------|-------------|
| InvalidCredentialsError | AUTH_INVALID_CREDENTIALS | 401 |
| UserNotFoundError | AUTH_USER_NOT_FOUND | 404 |
| EmailNotVerifiedError | AUTH_EMAIL_NOT_VERIFIED | 403 |
| AccountDisabledError | AUTH_ACCOUNT_DISABLED | 403 |
| TokenExpiredError | AUTH_TOKEN_EXPIRED | 401 |
| InvalidTokenError | AUTH_TOKEN_INVALID | 401 |
| TokenRevokedError | AUTH_TOKEN_REVOKED | 401 |
| SessionExpiredError | AUTH_SESSION_EXPIRED | 401 |
| SessionNotFoundError | AUTH_SESSION_NOT_FOUND | 401 |
| UnauthorizedError | AUTH_UNAUTHORIZED | 401 |
| ForbiddenError | AUTH_FORBIDDEN | 403 |
| PasswordResetExpiredError | AUTH_RESET_EXPIRED | 400 |
| WeakPasswordError | AUTH_WEAK_PASSWORD | 400 |
| OAuthStateError | AUTH_OAUTH_STATE | 400 |
| OAuthProviderError | AUTH_OAUTH_PROVIDER | 502 |

---

## Appendix C: Example Routes

```typescript
// app/routes/auth.ts

import { Route, Response } from "@gello/core";
import { AuthService, PasswordReset, EmailVerification, Socialite } from "@gello/auth";

export const authRoutes = [
  // Authentication
  Route.post("/auth/login")
    .validate({ body: CredentialsSchema })
    .handle((req) =>
      Effect.gen(function* () {
        const session = yield* AuthService.attempt(req.body);
        return Response.json({ token: session.token, expiresAt: session.expiresAt });
      })
    ),

  Route.post("/auth/register")
    .validate({ body: RegisterSchema })
    .handle((req) =>
      Effect.gen(function* () {
        const user = yield* AuthService.register(req.body, {
          sendVerificationEmail: true,
        });
        return Response.json(user).status(201);
      })
    ),

  Route.post("/auth/logout")
    .pipe(Route.use(requireAuth))
    .handle((req) =>
      Effect.gen(function* () {
        yield* AuthService.logout(req.session.id);
        return Response.noContent();
      })
    ),

  Route.post("/auth/refresh")
    .validate({ body: Schema.Struct({ refreshToken: Schema.String }) })
    .handle((req) =>
      Effect.gen(function* () {
        const session = yield* AuthService.refresh(RefreshToken(req.body.refreshToken));
        return Response.json({ token: session.token, expiresAt: session.expiresAt });
      })
    ),

  // Password Reset
  Route.post("/auth/forgot-password")
    .validate({ body: Schema.Struct({ email: Schema.String }) })
    .handle((req) =>
      Effect.gen(function* () {
        yield* PasswordReset.requestReset(req.body.email);
        return Response.json({ message: "If the email exists, a reset link has been sent." });
      })
    ),

  Route.post("/auth/reset-password")
    .validate({
      body: Schema.Struct({
        token: Schema.String,
        password: Schema.String,
        passwordConfirmation: Schema.String,
      }),
    })
    .handle((req) =>
      Effect.gen(function* () {
        if (req.body.password !== req.body.passwordConfirmation) {
          return yield* Effect.fail(new PasswordMismatchError({}));
        }
        yield* PasswordReset.reset(req.body.token, req.body.password);
        return Response.json({ message: "Password has been reset." });
      })
    ),

  // Email Verification
  Route.post("/auth/email/verify")
    .validate({ body: Schema.Struct({ token: Schema.String }) })
    .handle((req) =>
      Effect.gen(function* () {
        const user = yield* EmailVerification.verify(req.body.token);
        return Response.json({ message: "Email verified.", user });
      })
    ),

  Route.post("/auth/email/resend")
    .pipe(Route.use(requireAuth))
    .handle((req) =>
      Effect.gen(function* () {
        const user = yield* AuthService.user();
        yield* EmailVerification.resend(user.id);
        return Response.json({ message: "Verification email sent." });
      })
    ),

  // OAuth
  Route.get("/auth/:provider/redirect").handle((req) =>
    Effect.gen(function* () {
      const url = yield* Socialite.redirect(req.params.provider);
      return Response.redirect(url.toString());
    })
  ),

  Route.get("/auth/:provider/callback")
    .validate({
      query: Schema.Struct({ code: Schema.String, state: Schema.String }),
    })
    .handle((req) =>
      Effect.gen(function* () {
        const oauthUser = yield* Socialite.user(
          req.params.provider,
          req.query.code,
          req.query.state
        );

        // Find or create user, create session
        const user = yield* findOrCreateFromOAuth(req.params.provider, oauthUser);
        const session = yield* AuthService.loginAs(user);

        return Response.redirect("/dashboard").setCookie("session", session.token, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });
      })
    ),

  // Current User
  Route.get("/auth/me")
    .pipe(Route.use(requireAuth))
    .handle(() =>
      Effect.gen(function* () {
        const user = yield* AuthService.user();
        return Response.json(user);
      })
    ),

  // Sessions
  Route.get("/auth/sessions")
    .pipe(Route.use(requireAuth))
    .handle(() =>
      Effect.gen(function* () {
        const user = yield* AuthService.user();
        const sessions = yield* AuthService.sessions(user.id);
        return Response.json(sessions);
      })
    ),

  Route.delete("/auth/sessions/:id")
    .pipe(Route.use(requireAuth))
    .handle((req) =>
      Effect.gen(function* () {
        yield* AuthService.logout(SessionId(req.params.id));
        return Response.noContent();
      })
    ),

  Route.delete("/auth/sessions")
    .pipe(Route.use(requireAuth))
    .handle(() =>
      Effect.gen(function* () {
        const user = yield* AuthService.user();
        const count = yield* AuthService.logoutAll(user.id);
        return Response.json({ message: `Logged out of ${count} sessions.` });
      })
    ),
];
```

---

*This PRD is a living document. Updates will be tracked via version control.*
