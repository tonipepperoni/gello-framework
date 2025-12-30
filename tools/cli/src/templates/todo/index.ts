/**
 * TODO Application Template
 *
 * Generates a full CRUD todo application with:
 * - API routes for todos
 * - Database schema (Drizzle)
 * - Auth-guarded routes (when auth enabled)
 * - Frontend components (when frontend selected)
 */
import type { Template, GeneratedFiles, TemplateContext } from '../types.js';
import { generateApiFiles } from './api.js';
import { generateDatabaseFiles } from './database.js';
import { generateWebFiles } from './web.js';

/**
 * Generate type declaration stubs for @gello packages
 * This works around the bundled .d.ts files not having proper exports
 */
function generateTypeDeclarations(context: TemplateContext): Map<string, string> {
  const files = new Map<string, string>();

  // Platform-node declarations
  files.set('types/gello-platform-node.d.ts', `/**
 * Type declarations for @gello/platform-node
 * These provide types when the bundled package types aren't properly exported
 */
declare module '@gello/platform-node' {
  import { Effect, Layer, Context } from 'effect';
  import { HttpServerResponse, HttpServerRequest, HttpBody } from '@effect/platform';
  import { Schema } from '@effect/schema';

  // Application builder
  export interface AppConfig {
    name: string;
    port: number;
    host: string;
    logging?: boolean;
    timing?: boolean;
  }

  export interface App {
    use(middleware: Middleware): App;
    routes(routes: readonly RouteDefinition[]): App;
  }

  export type Middleware = (
    req: HttpServerRequest.HttpServerRequest
  ) => Effect.Effect<HttpServerRequest.HttpServerRequest, never, never>;

  export interface RouteDefinition {
    readonly method: string;
    readonly path: string;
    readonly handler: Effect.Effect<HttpServerResponse.HttpServerResponse, unknown, unknown>;
  }

  export function createApp(config: AppConfig): App;
  export function runApp(app: App, layer: Layer.Layer<any, any, any>): void;

  // Route builders
  export const route: {
    get(path: string, handler: Effect.Effect<HttpServerResponse.HttpServerResponse, unknown, unknown>): RouteDefinition;
    post(path: string, handler: Effect.Effect<HttpServerResponse.HttpServerResponse, unknown, unknown>): RouteDefinition;
    put(path: string, handler: Effect.Effect<HttpServerResponse.HttpServerResponse, unknown, unknown>): RouteDefinition;
    patch(path: string, handler: Effect.Effect<HttpServerResponse.HttpServerResponse, unknown, unknown>): RouteDefinition;
    delete(path: string, handler: Effect.Effect<HttpServerResponse.HttpServerResponse, unknown, unknown>): RouteDefinition;
  };

  // Response helpers
  export function json<T>(data: T): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError>;
  export function success<T>(data: T): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError>;
  export function created<T>(data: T, location?: string): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError>;
  export function noContent(): Effect.Effect<HttpServerResponse.HttpServerResponse, never>;
  export function badRequest(message: string, details?: unknown): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError>;
  export function unauthorized(message?: string): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError>;
  export function notFound(message?: string): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError>;
  export function internalError(message?: string): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError>;

  // Request helpers
  export function getJsonBody<S extends Schema.Schema.AnyNoContext>(
    schema: S
  ): Effect.Effect<Schema.Schema.Type<S>, ValidationError, HttpServerRequest.HttpServerRequest>;
}
`);

  // Core declarations
  files.set('types/gello-core.d.ts', `/**
 * Type declarations for @gello/core
 */
declare module '@gello/core' {
  import { Data, Context, Effect } from 'effect';

  // Errors
  export class HttpError extends Data.TaggedError('HttpError')<{
    readonly status: number;
    readonly message: string;
    readonly code: string;
    readonly cause?: unknown;
  }> {
    static BadRequest(message: string, code?: string): HttpError;
    static Unauthorized(message?: string): HttpError;
    static Forbidden(message?: string): HttpError;
    static NotFound(entity?: string): HttpError;
    static InternalServerError(cause?: unknown): HttpError;
  }

  export interface FieldError {
    readonly field: string;
    readonly message: string;
    readonly code: string;
  }

  export class ValidationError extends Data.TaggedError('ValidationError')<{
    readonly message: string;
    readonly errors: readonly FieldError[];
  }> {
    static fromFields(errors: readonly FieldError[]): ValidationError;
    static single(field: string, message: string, code?: string): ValidationError;
  }

  // Context Tags
  export class RouteParams extends Context.Tag('@gello/RouteParams')<
    RouteParams,
    Record<string, string>
  >() {}

  export class QueryParams extends Context.Tag('@gello/QueryParams')<
    QueryParams,
    URLSearchParams
  >() {}
}
`);

  // Common declarations
  files.set('types/gello-common.d.ts', `/**
 * Type declarations for @gello/common
 */
declare module '@gello/common' {
  import { Effect, Option } from 'effect';
  import { HttpServerRequest } from '@effect/platform';

  // CORS middleware
  export interface CorsOptions {
    origins?: string | string[];
    methods?: string[];
    headers?: string[];
    credentials?: boolean;
    maxAge?: number;
  }

  export function cors(options?: CorsOptions): (
    req: HttpServerRequest.HttpServerRequest
  ) => Effect.Effect<HttpServerRequest.HttpServerRequest, never, never>;

  // Parameter helpers
  export function getParam(name: string): Effect.Effect<string | undefined, never, RouteParams>;
  export function getQuery(name: string): Effect.Effect<string | undefined, never, QueryParams>;
  export function getQueryAsBoolean(name: string): Effect.Effect<Option.Option<boolean>, never, QueryParams>;

  import { RouteParams, QueryParams } from '@gello/core';
}
`);

  // Auth declarations (only if auth enabled)
  if (context.hasAuth) {
    files.set('types/gello-auth.d.ts', `/**
 * Type declarations for @gello/auth
 */
declare module '@gello/auth' {
  import { Effect, Context, Layer, Option, Brand } from 'effect';
  import { Data } from 'effect';

  // Branded types
  export type TokenId = string & Brand.Brand<'TokenId'>;
  export const TokenId: (value: string) => TokenId;

  export type PlainTextToken = string & Brand.Brand<'PlainTextToken'>;
  export const PlainTextToken: (value: string) => PlainTextToken;

  export type HashedToken = string & Brand.Brand<'HashedToken'>;
  export const HashedToken: (value: string) => HashedToken;

  export type UserId = string & Brand.Brand<'UserId'>;
  export const UserId: (value: string) => UserId;

  // Errors
  export class AuthenticationError extends Data.TaggedError('AuthenticationError')<{
    readonly message: string;
    readonly reason: string;
  }> {}

  // Personal Access Token
  export interface PersonalAccessToken {
    readonly id: TokenId;
    readonly userId: UserId;
    readonly name: string;
    readonly token: HashedToken;
    readonly scopes: readonly string[];
    readonly abilities: readonly string[];
    readonly lastUsedAt?: Date;
    readonly expiresAt?: Date;
    readonly createdAt: Date;
  }

  // New Access Token (with plaintext)
  export interface NewAccessToken {
    readonly accessToken: PersonalAccessToken;
    readonly plainTextToken: PlainTextToken;
  }

  // Authenticated User
  export interface AuthenticatedUser {
    readonly id: UserId;
    readonly email: string;
    readonly token?: {
      readonly id: TokenId;
      readonly name: string;
      readonly abilities: readonly string[];
      readonly lastUsedAt?: Date;
      readonly expiresAt?: Date;
    };
  }

  // Auth Provider User
  export interface AuthUser {
    readonly id: UserId;
    readonly email: string;
    readonly password: string;
  }

  // Service interfaces
  export interface TokenStore {
    store(token: PersonalAccessToken): Effect.Effect<void, unknown>;
    findByToken(hashedToken: HashedToken): Effect.Effect<Option.Option<PersonalAccessToken>, unknown>;
    findByUser(userId: UserId): Effect.Effect<readonly PersonalAccessToken[], unknown>;
    revoke(tokenId: TokenId): Effect.Effect<void, unknown>;
    revokeAllForUser(userId: UserId): Effect.Effect<void, unknown>;
    touch(tokenId: TokenId): Effect.Effect<void, unknown>;
  }

  export interface UserProvider {
    findById(id: string): Effect.Effect<Option.Option<AuthUser>, unknown>;
    findByEmail(email: string): Effect.Effect<Option.Option<AuthUser>, unknown>;
  }

  export interface PasswordHasher {
    hash(password: string): Effect.Effect<string, unknown>;
    verify(password: string, hash: string): Effect.Effect<boolean, unknown>;
  }

  export interface TokenHasher {
    hash(plaintext: PlainTextToken): Effect.Effect<HashedToken>;
    generate(): Effect.Effect<PlainTextToken>;
  }

  export interface AuthService {
    attempt(email: string, password: string): Effect.Effect<AuthUser, AuthenticationError>;
    createToken(userId: UserId, name: string, abilities?: readonly string[], expiresAt?: Date): Effect.Effect<NewAccessToken>;
    getTokens(userId: UserId): Effect.Effect<readonly PersonalAccessToken[]>;
    revokeToken(tokenId: TokenId): Effect.Effect<void>;
    revokeAllTokens(userId: UserId): Effect.Effect<number>;
    getUser(userId: UserId): Effect.Effect<AuthUser, AuthenticationError>;
    hashPassword(password: string): Effect.Effect<string>;
  }

  // Context Tags - simplified for compatibility
  export const TokenStoreTag: Context.Tag<any, TokenStore>;
  export type TokenStoreTag = Context.Tag.Identifier<typeof TokenStoreTag>;

  export const UserProviderTag: Context.Tag<any, UserProvider>;
  export type UserProviderTag = Context.Tag.Identifier<typeof UserProviderTag>;

  export const PasswordHasherTag: Context.Tag<any, PasswordHasher>;
  export type PasswordHasherTag = Context.Tag.Identifier<typeof PasswordHasherTag>;

  export const TokenHasherTag: Context.Tag<any, TokenHasher>;
  export type TokenHasherTag = Context.Tag.Identifier<typeof TokenHasherTag>;

  export const AuthTag: Context.Tag<any, AuthService>;
  export type AuthTag = Context.Tag.Identifier<typeof AuthTag>;

  export const AuthenticatedUserTag: Context.Tag<any, AuthenticatedUser>;
  export type AuthenticatedUserTag = Context.Tag.Identifier<typeof AuthenticatedUserTag>;

  // Layers (using any for complex requirements)
  export const TokenServiceLive: Layer.Layer<any>;
  export const AuthServiceLive: Layer.Layer<any, never, any>;

  // Middleware
  export function authenticate(): <R, E>(
    effect: Effect.Effect<unknown, E, R>
  ) => Effect.Effect<unknown, E | AuthenticationError, R | AuthenticatedUserTag>;

  export function currentUser(): Effect.Effect<AuthenticatedUser, never, AuthenticatedUserTag>;
}
`);
  }

  return files;
}

export const todoTemplate: Template = {
  id: 'todo',
  name: 'TODO Application',
  description: 'Full CRUD example with todos (auth-guarded if auth enabled)',

  generate(context: TemplateContext): GeneratedFiles {
    const files = new Map<string, string>();
    const dependencies: string[] = [];
    const devDependencies: string[] = [];

    // Generate type declarations for @gello packages
    const typeDecls = generateTypeDeclarations(context);
    for (const [path, content] of typeDecls) {
      files.set(path, content);
    }

    // Generate API files (routes, handlers, services)
    const apiResult = generateApiFiles(context);
    for (const [path, content] of apiResult.files) {
      files.set(path, content);
    }
    dependencies.push(...apiResult.dependencies);
    devDependencies.push(...apiResult.devDependencies);

    // Generate database files if database is enabled
    if (context.hasDatabase) {
      const dbResult = generateDatabaseFiles(context);
      for (const [path, content] of dbResult.files) {
        files.set(path, content);
      }
      dependencies.push(...dbResult.dependencies);
      devDependencies.push(...dbResult.devDependencies);
    }

    // Generate web frontend files if frontend is included (and not mobile)
    if (context.hasFrontend && !context.isMobile) {
      const webResult = generateWebFiles(context);
      for (const [path, content] of webResult.files) {
        files.set(path, content);
      }
      dependencies.push(...webResult.dependencies);
      devDependencies.push(...webResult.devDependencies);
    }

    return {
      files,
      dependencies: [...new Set(dependencies)],
      devDependencies: [...new Set(devDependencies)],
    };
  },
};
