/**
 * TODO Template - API Files
 *
 * Generates API routes, handlers, and services for todos using proper Gello patterns:
 * - Effect-based error handling with typed errors
 * - Dependency injection via Context.Tag and Layers
 * - Type-safe routing with @gello/platform-node
 * - Authentication via @gello/auth
 */
import type { TemplateContext, GeneratedFiles } from '../types.js';

export function generateApiFiles(context: TemplateContext): GeneratedFiles {
  const files = new Map<string, string>();

  // Domain layer
  files.set('apps/api/src/domain/todo.ts', generateTodoDomain(context));
  files.set('apps/api/src/domain/errors.ts', generateDomainErrors(context));
  files.set('apps/api/src/domain/index.ts', generateDomainIndex(context));

  // Service layer
  files.set('apps/api/src/services/TodoRepository.ts', generateTodoService(context));
  files.set('apps/api/src/services/index.ts', generateServicesIndex(context));

  // Routes layer
  files.set('apps/api/src/routes/TodoRoutes.ts', generateTodoRouteHandlers(context));
  files.set('apps/api/src/routes/index.ts', generateRoutesIndex(context));

  // Auth routes when authentication is enabled
  if (context.hasAuth) {
    files.set('apps/api/src/domain/user.ts', generateUserDomain(context));
    files.set('apps/api/src/services/UserRepository.ts', generateUserService(context));
    files.set('apps/api/src/services/TokenStore.ts', generateTokenStore(context));
    files.set('apps/api/src/services/PasswordHasher.ts', generatePasswordHasher(context));
    files.set('apps/api/src/services/TokenHasher.ts', generateTokenHasher(context));
    files.set('apps/api/src/routes/AuthRoutes.ts', generateAuthRouteHandlers(context));
  }

  // Entry point
  files.set('apps/api/src/main.ts', generateMainTs(context));

  // Config
  files.set('apps/api/src/config/index.ts', generateConfig(context));

  const dependencies = [
    '@gello/platform-node',
    '@gello/core',
    '@gello/common',
    'effect',
    '@effect/platform',
    '@effect/schema',
  ];

  const devDependencies: string[] = [];

  if (context.hasAuth) {
    dependencies.push('@gello/auth');
    dependencies.push('@react-email/components');
    dependencies.push('react');
    dependencies.push('bcrypt');
    devDependencies.push('@types/bcrypt');
  }

  return {
    files,
    dependencies,
    devDependencies,
  };
}

function generateTodoDomain(context: TemplateContext): string {
  const userIdField = context.hasAuth ? '\n  readonly userId: string;' : '';
  const userIdImport = ''; // Use string for userId to avoid import conflicts
  const userIdCreate = context.hasAuth ? '\n  userId: string;' : '';

  return `/**
 * Todo Domain Types
 *
 * Defines the core domain model using Effect Schema for runtime validation.
 */
import * as S from '@effect/schema/Schema';
import { Brand } from 'effect';
${userIdImport}

// ============================================================================
// Branded Types - Type-safe IDs
// ============================================================================

export type TodoId = string & Brand.Brand<'TodoId'>;
export const TodoId = Brand.nominal<TodoId>();

// ============================================================================
// Domain Model
// ============================================================================

export interface Todo {
  readonly id: TodoId;
  readonly title: string;
  readonly description: string | null;
  readonly completed: boolean;${userIdField}
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ============================================================================
// Schemas - Runtime validation
// ============================================================================

export const CreateTodoSchema = S.Struct({
  title: S.String.pipe(S.minLength(1), S.maxLength(255)),
  description: S.optional(S.String.pipe(S.maxLength(1000))),
});

export type CreateTodo = S.Schema.Type<typeof CreateTodoSchema>;

export const UpdateTodoSchema = S.Struct({
  title: S.optional(S.String.pipe(S.minLength(1), S.maxLength(255))),
  description: S.optional(S.NullOr(S.String.pipe(S.maxLength(1000)))),
  completed: S.optional(S.Boolean),
});

export type UpdateTodo = S.Schema.Type<typeof UpdateTodoSchema>;

export interface TodoFilter {
  completed?: boolean;${context.hasAuth ? '\n  userId?: string;' : ''}
}

export interface TodoListResult {
  readonly items: ReadonlyArray<Todo>;
  readonly total: number;
}

// ============================================================================
// Domain Functions - Pure transformations
// ============================================================================

export const makeTodo = (params: {
  id: TodoId;
  title: string;
  description?: string;${userIdCreate}
}): Todo => ({
  id: params.id,
  title: params.title,
  description: params.description ?? null,
  completed: false,${context.hasAuth ? '\n  userId: params.userId,' : ''}
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const updateTodo = (
  todo: Todo,
  updates: { title?: string; description?: string | null; completed?: boolean }
): Todo => ({
  ...todo,
  ...(updates.title !== undefined && { title: updates.title }),
  ...(updates.description !== undefined && { description: updates.description }),
  ...(updates.completed !== undefined && { completed: updates.completed }),
  updatedAt: new Date(),
});

export const toggleCompleted = (todo: Todo): Todo => ({
  ...todo,
  completed: !todo.completed,
  updatedAt: new Date(),
});

export const makeTodoListResult = (items: ReadonlyArray<Todo>): TodoListResult => ({
  items,
  total: items.length,
});
`;
}

function generateDomainErrors(context: TemplateContext): string {
  return `/**
 * Domain Errors
 *
 * Typed errors using Effect's Data.TaggedError pattern.
 */
import { Data } from 'effect';
import type { TodoId } from './todo.js';

/**
 * Todo not found error
 */
export class TodoNotFound extends Data.TaggedError('TodoNotFound')<{
  readonly id: TodoId;
  readonly message: string;
}> {}

export const todoNotFound = (id: TodoId): TodoNotFound =>
  new TodoNotFound({
    id,
    message: \`Todo with id '\${id}' not found\`,
  });

/**
 * Invalid todo ID error
 */
export class InvalidTodoId extends Data.TaggedError('InvalidTodoId')<{
  readonly raw: string;
  readonly reason: string;
}> {}
`;
}

function generateDomainIndex(context: TemplateContext): string {
  const userExport = context.hasAuth ? `export * from './user.js';` : '';

  return `/**
 * Domain Layer Exports
 */
export * from './todo.js';
export * from './errors.js';
${userExport}
`;
}

function generateTodoService(context: TemplateContext): string {
  const userIdParam = context.hasAuth ? 'userId: string,' : '';
  const userIdField = context.hasAuth ? '\n      userId,' : '';
  const userIdFilter = context.hasAuth
    ? `
        // Filter by user
        if (filter.userId !== undefined) {
          todos = todos.filter((t) => t.userId === filter.userId);
        }`
    : '';
  const userIdImport = ''; // Use string for userId to avoid import conflicts
  const userIdCheck = context.hasAuth
    ? `
          // Verify ownership
          if (existing.userId !== userId) {
            return [Option.none<Todo>(), state];
          }
`
    : '';

  return `/**
 * TodoRepository Service
 *
 * Repository pattern with Effect.Ref for pure, immutable state management.
 * Uses Context.Tag for dependency injection.
 */
import { Effect, Context, Ref, Layer, Option, pipe } from 'effect';
import {
  type Todo,
  type TodoId,
  type CreateTodo,
  type UpdateTodo,
  type TodoFilter,
  type TodoListResult,
  TodoId as TodoIdBrand,
  makeTodo,
  updateTodo,
  toggleCompleted,
  makeTodoListResult,
} from '../domain/todo.js';
import { InvalidTodoId } from '../domain/errors.js';
${userIdImport}

// ============================================================================
// Service Interface
// ============================================================================

export interface TodoRepository {
  readonly findAll: (filter: TodoFilter) => Effect.Effect<TodoListResult>;
  readonly findById: (id: TodoId) => Effect.Effect<Option.Option<Todo>>;
  readonly create: (${userIdParam} data: CreateTodo) => Effect.Effect<Todo>;
  readonly update: (${userIdParam} id: TodoId, data: UpdateTodo) => Effect.Effect<Option.Option<Todo>>;
  readonly delete: (${userIdParam} id: TodoId) => Effect.Effect<boolean>;
  readonly toggle: (${userIdParam} id: TodoId) => Effect.Effect<Option.Option<Todo>>;
  readonly deleteCompleted: (${context.hasAuth ? 'userId: string' : ''}) => Effect.Effect<number>;
}

// ============================================================================
// Service Tag
// ============================================================================

export class TodoRepositoryTag extends Context.Tag('TodoRepository')<
  TodoRepositoryTag,
  TodoRepository
>() {}

// ============================================================================
// In-Memory Implementation
// ============================================================================

interface RepositoryState {
  readonly todos: ReadonlyMap<TodoId, Todo>;
  readonly nextId: number;
}

const initialState: RepositoryState = {
  todos: new Map(),
  nextId: 1,
};

const makeInMemoryRepository = (
  stateRef: Ref.Ref<RepositoryState>
): TodoRepository => ({
  findAll: (filter) =>
    pipe(
      Ref.get(stateRef),
      Effect.map((state) => {
        let todos = Array.from(state.todos.values());
${userIdFilter}
        if (filter.completed !== undefined) {
          todos = todos.filter((t) => t.completed === filter.completed);
        }
        todos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return makeTodoListResult(todos);
      })
    ),

  findById: (id) =>
    pipe(
      Ref.get(stateRef),
      Effect.map((state) => Option.fromNullable(state.todos.get(id)))
    ),

  create: (${userIdParam} data) =>
    Ref.modify(stateRef, (state) => {
      const id = TodoIdBrand(String(state.nextId));
      const todo = makeTodo({
        id,
        title: data.title.trim(),
        description: data.description?.trim(),${userIdField}
      });
      const newTodos = new Map(state.todos);
      newTodos.set(id, todo);
      return [todo, { todos: newTodos, nextId: state.nextId + 1 }];
    }),

  update: (${userIdParam} id, data) =>
    Ref.modify(stateRef, (state) => {
      const existing = state.todos.get(id);
      if (!existing) {
        return [Option.none<Todo>(), state];
      }
${userIdCheck}
      const updated = updateTodo(existing, {
        title: data.title?.trim(),
        description: data.description === null ? null : data.description?.trim(),
        completed: data.completed,
      });
      const newTodos = new Map(state.todos);
      newTodos.set(id, updated);
      return [Option.some(updated), { ...state, todos: newTodos }];
    }),

  delete: (${userIdParam} id) =>
    Ref.modify(stateRef, (state) => {
      const existing = state.todos.get(id);
      if (!existing) {
        return [false, state];
      }
${context.hasAuth ? `      if (existing.userId !== userId) {
        return [false, state];
      }
` : ''}
      const newTodos = new Map(state.todos);
      newTodos.delete(id);
      return [true, { ...state, todos: newTodos }];
    }),

  toggle: (${userIdParam} id) =>
    Ref.modify(stateRef, (state) => {
      const existing = state.todos.get(id);
      if (!existing) {
        return [Option.none<Todo>(), state];
      }
${context.hasAuth ? `      if (existing.userId !== userId) {
        return [Option.none<Todo>(), state];
      }
` : ''}
      const toggled = toggleCompleted(existing);
      const newTodos = new Map(state.todos);
      newTodos.set(id, toggled);
      return [Option.some(toggled), { ...state, todos: newTodos }];
    }),

  deleteCompleted: (${context.hasAuth ? 'userId' : ''}) =>
    Ref.modify(stateRef, (state) => {
      let deletedCount = 0;
      const newTodos = new Map<TodoId, Todo>();
      for (const [id, todo] of state.todos) {
        if (todo.completed${context.hasAuth ? ' && todo.userId === userId' : ''}) {
          deletedCount++;
        } else {
          newTodos.set(id, todo);
        }
      }
      return [deletedCount, { ...state, todos: newTodos }];
    }),
});

// ============================================================================
// Layers
// ============================================================================

export const TodoRepositoryLive: Layer.Layer<TodoRepositoryTag> = Layer.effect(
  TodoRepositoryTag,
  pipe(
    Ref.make(initialState),
    Effect.map(makeInMemoryRepository)
  )
);

export const TodoRepositorySeeded: Layer.Layer<TodoRepositoryTag> = Layer.effect(
  TodoRepositoryTag,
  Effect.gen(function* () {
    const stateRef = yield* Ref.make(initialState);
    const repo = makeInMemoryRepository(stateRef);

    // Seed demo data
    yield* repo.create(${context.hasAuth ? "'user_demo', " : ''}{
      title: 'Learn Effect-TS',
      description: 'Study the Effect library and functional programming patterns',
    });

    const second = yield* repo.create(${context.hasAuth ? "'user_demo', " : ''}{
      title: 'Build a REST API',
      description: 'Create a todo list API using the Gello framework',
    });

    yield* repo.toggle(${context.hasAuth ? "'user_demo', " : ''}second.id);

    yield* repo.create(${context.hasAuth ? "'user_demo', " : ''}{
      title: 'Write tests',
      description: 'Add comprehensive test coverage',
    });

    return repo;
  })
);
// ============================================================================
// Service Accessors
// ============================================================================

export const findAllTodos = (filter: TodoFilter) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.findAll(filter));

export const findTodoById = (id: TodoId) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.findById(id));

export const createTodo = (${userIdParam} data: CreateTodo) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.create(${context.hasAuth ? 'userId, ' : ''}data));

export const updateTodoById = (${userIdParam} id: TodoId, data: UpdateTodo) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.update(${context.hasAuth ? 'userId, ' : ''}id, data));

export const deleteTodoById = (${userIdParam} id: TodoId) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.delete(${context.hasAuth ? 'userId, ' : ''}id));

export const toggleTodoById = (${userIdParam} id: TodoId) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.toggle(${context.hasAuth ? 'userId, ' : ''}id));

export const deleteCompletedTodos = (${context.hasAuth ? 'userId: string' : ''}) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.deleteCompleted(${context.hasAuth ? 'userId' : ''}));

// ============================================================================
// TodoId Parser
// ============================================================================

export const parseTodoId = (
  raw: string | undefined
): Effect.Effect<TodoId, InvalidTodoId> => {
  if (raw === undefined || raw.trim() === '') {
    return Effect.fail(new InvalidTodoId({ raw: raw ?? '', reason: 'ID is required' }));
  }
  const trimmed = raw.trim();
  if (!/^\\d+$/.test(trimmed)) {
    return Effect.fail(
      new InvalidTodoId({ raw: trimmed, reason: 'ID must be a numeric string' })
    );
  }
  return Effect.succeed(TodoIdBrand(trimmed));
};
`;
}

function generateServicesIndex(context: TemplateContext): string {
  const authExports = context.hasAuth
    ? `export * from './UserRepository.js';
export * from './TokenStore.js';
export * from './PasswordHasher.js';
export * from './TokenHasher.js';`
    : '';

  return `/**
 * Services Layer Exports
 */
export * from './TodoRepository.js';
${authExports}
`;
}

function generateTodoRouteHandlers(context: TemplateContext): string {
  const authImports = context.hasAuth
    ? `import { authenticate, currentUser, AuthenticatedUserTag } from '@gello/auth';`
    : '';
  const getUserId = context.hasAuth
    ? `
  // Get authenticated user
  const authUser = yield* currentUser();
  const userId = authUser.id;`
    : '';
  const userIdArg = context.hasAuth ? 'userId, ' : '';

  return `/**
 * Todo Routes - Pure route handlers using service pattern
 *
 * All handlers are pure functions that return Effects.
 * Dependencies are injected via the R channel.
 */
import { Effect, Option, pipe } from 'effect';
import { HttpServerRequest, HttpServerResponse, HttpBody } from '@effect/platform';
import {
  json,
  success,
  created,
  noContent,
  getJsonBody,
} from '@gello/platform-node';
import { ValidationError, RouteParams, QueryParams, HttpError } from '@gello/core';
import { getParam, getQueryAsBoolean } from '@gello/common';
import { CreateTodoSchema, UpdateTodoSchema } from '../domain/todo.js';
import { TodoNotFound, InvalidTodoId, todoNotFound } from '../domain/errors.js';
import {
  type TodoRepositoryTag,
  findAllTodos,
  findTodoById,
  createTodo,
  updateTodoById,
  deleteTodoById,
  toggleTodoById,
  deleteCompletedTodos,
  parseTodoId,
} from '../services/TodoRepository.js';
${authImports}

// ============================================================================
// Route Error Type
// ============================================================================

export type RouteError =
  | TodoNotFound
  | InvalidTodoId
  | ValidationError
  | HttpError
  | HttpBody.HttpBodyError;

// ============================================================================
// API Info
// ============================================================================

export const apiInfo = json({
  name: '${context.projectName} API',
  version: '1.0.0',
  description: 'Built with Gello Framework',
  endpoints: {
    'GET /todos': 'List all todos',
    'GET /todos/:id': 'Get a specific todo',
    'POST /todos': 'Create a new todo',
    'PATCH /todos/:id': 'Update a todo',
    'DELETE /todos/:id': 'Delete a todo',
    'POST /todos/:id/toggle': 'Toggle completion',
    'DELETE /todos': 'Delete completed todos',
  },
});

// ============================================================================
// Health Check
// ============================================================================

export const healthCheck = json({
  status: 'ok',
  service: '${context.projectNameKebab}-api',
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
});

// ============================================================================
// List Todos
// ============================================================================

export const listTodos: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  RouteError,
  TodoRepositoryTag | QueryParams${context.hasAuth ? ' | AuthenticatedUserTag' : ''}
> = Effect.gen(function* () {${getUserId}
  const maybeCompleted = yield* getQueryAsBoolean('completed');

  const filter = {
    completed: Option.getOrUndefined(maybeCompleted),${context.hasAuth ? '\n    userId,' : ''}
  };

  const result = yield* findAllTodos(filter);
  return yield* success(result);
});

// ============================================================================
// Get Todo By ID
// ============================================================================

export const getTodoById: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  RouteError,
  TodoRepositoryTag | RouteParams${context.hasAuth ? ' | AuthenticatedUserTag' : ''}
> = Effect.gen(function* () {${getUserId}
  const rawId = yield* getParam('id');
  const todoId = yield* parseTodoId(rawId);
  const maybeTodo = yield* findTodoById(todoId);

  const todo = yield* pipe(
    maybeTodo,
    Option.match({
      onNone: () => Effect.fail(todoNotFound(todoId)),
      onSome: Effect.succeed,
    })
  );
${context.hasAuth ? `
  // Verify ownership
  if (todo.userId !== userId) {
    return yield* Effect.fail(todoNotFound(todoId));
  }
` : ''}
  return yield* success(todo);
});

// ============================================================================
// Create Todo
// ============================================================================

export const createTodoRoute: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  RouteError,
  TodoRepositoryTag | HttpServerRequest.HttpServerRequest${context.hasAuth ? ' | AuthenticatedUserTag' : ''}
> = Effect.gen(function* () {${getUserId}
  const body = yield* getJsonBody(CreateTodoSchema);
  const todo = yield* createTodo(${userIdArg}body);

  yield* Effect.logInfo(\`Todo created: "\${todo.title}" (ID: \${todo.id})\`);

  return yield* created(todo, \`/todos/\${todo.id}\`);
});

// ============================================================================
// Update Todo
// ============================================================================

export const updateTodoRoute: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  RouteError,
  TodoRepositoryTag | RouteParams | HttpServerRequest.HttpServerRequest${context.hasAuth ? ' | AuthenticatedUserTag' : ''}
> = Effect.gen(function* () {${getUserId}
  const rawId = yield* getParam('id');
  const todoId = yield* parseTodoId(rawId);
  const updates = yield* getJsonBody(UpdateTodoSchema);
  const maybeUpdated = yield* updateTodoById(${userIdArg}todoId, updates);

  const updated = yield* pipe(
    maybeUpdated,
    Option.match({
      onNone: () => Effect.fail(todoNotFound(todoId)),
      onSome: Effect.succeed,
    })
  );

  yield* Effect.logInfo(\`Todo updated: "\${updated.title}" (ID: \${updated.id})\`);

  return yield* success(updated);
});

// ============================================================================
// Delete Todo
// ============================================================================

export const deleteTodoRoute: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  RouteError,
  TodoRepositoryTag | RouteParams${context.hasAuth ? ' | AuthenticatedUserTag' : ''}
> = Effect.gen(function* () {${getUserId}
  const rawId = yield* getParam('id');
  const todoId = yield* parseTodoId(rawId);
  const deleted = yield* deleteTodoById(${userIdArg}todoId);

  if (!deleted) {
    return yield* Effect.fail(todoNotFound(todoId));
  }

  yield* Effect.logInfo(\`Todo deleted: \${todoId}\`);

  return yield* noContent();
});

// ============================================================================
// Toggle Todo
// ============================================================================

export const toggleTodoRoute: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  RouteError,
  TodoRepositoryTag | RouteParams${context.hasAuth ? ' | AuthenticatedUserTag' : ''}
> = Effect.gen(function* () {${getUserId}
  const rawId = yield* getParam('id');
  const todoId = yield* parseTodoId(rawId);
  const maybeToggled = yield* toggleTodoById(${userIdArg}todoId);

  const toggled = yield* pipe(
    maybeToggled,
    Option.match({
      onNone: () => Effect.fail(todoNotFound(todoId)),
      onSome: Effect.succeed,
    })
  );

  yield* Effect.logInfo(
    \`Todo toggled: "\${toggled.title}" -> \${toggled.completed ? 'completed' : 'pending'}\`
  );

  return yield* success(toggled);
});

// ============================================================================
// Delete Completed Todos
// ============================================================================

export const deleteCompletedRoute: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  RouteError,
  TodoRepositoryTag${context.hasAuth ? ' | AuthenticatedUserTag' : ''}
> = Effect.gen(function* () {${getUserId}
  const count = yield* deleteCompletedTodos(${context.hasAuth ? 'userId' : ''});

  yield* Effect.logInfo(\`Deleted \${count} completed todos\`);

  return yield* success({
    deleted: count,
    message: \`\${count} completed todo(s) deleted\`,
  });
});
`;
}

function generateRoutesIndex(context: TemplateContext): string {
  const authImports = context.hasAuth
    ? `import { authenticate, AuthenticationError } from '@gello/auth';
import {
  register,
  login,
  logout,
  me,
  listTokens,
  createToken,
  revokeToken,
  revokeAllTokens,${context.hasOAuth ? '\n  oauthRedirect,\n  oauthCallback,' : ''}
  type AuthRouteError,
} from './AuthRoutes.js';
`
    : '';

  const authErrorHandler = context.hasAuth
    ? `
const handleAuthError = (
  error: AuthRouteError
): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError> => {
  if (error instanceof ValidationError) {
    return badRequest(error.message, { errors: error.errors });
  }
  if (error instanceof AuthenticationError) {
    return unauthorized(error.message);
  }
  if (error instanceof HttpError) {
    return badRequest(error.message);
  }
  return internalError('An unexpected error occurred');
};

const handleAuth = <R>(
  handler: Effect.Effect<HttpServerResponse.HttpServerResponse, AuthRouteError, R>
) => pipe(handler, Effect.catchAll(handleAuthError));
`
    : '';

  const authRoutes = context.hasAuth
    ? `
  // Auth - Public
  route.post('/auth/register', handleAuth(register)),
  route.post('/auth/login', handleAuth(login)),${context.hasOAuth ? `

  // OAuth
  route.get('/auth/:provider/redirect', handleAuth(oauthRedirect)),
  route.get('/auth/:provider/callback', handleAuth(oauthCallback)),` : ''}

  // Auth - Protected (require authentication)
  route.post('/auth/logout', handleAuth(logout)),
  route.get('/auth/me', handleAuth(me)),
  route.get('/auth/tokens', handleAuth(listTokens)),
  route.post('/auth/tokens', handleAuth(createToken)),
  route.delete('/auth/tokens/:tokenId', handleAuth(revokeToken)),
  route.delete('/auth/tokens', handleAuth(revokeAllTokens)),
`
    : '';

  return `/**
 * Routes - Declarative route definitions
 */
import { Effect, pipe } from 'effect';
import { HttpServerResponse, HttpBody } from '@effect/platform';
import { route } from '@gello/platform-node';
import { badRequest, notFound, internalError, unauthorized } from '@gello/platform-node';
import { ValidationError, HttpError } from '@gello/core';
${authImports}
import { TodoNotFound, InvalidTodoId } from '../domain/errors.js';
import {
  apiInfo,
  healthCheck,
  listTodos,
  getTodoById,
  createTodoRoute,
  updateTodoRoute,
  deleteTodoRoute,
  toggleTodoRoute,
  deleteCompletedRoute,
  type RouteError,
} from './TodoRoutes.js';

// ============================================================================
// Error Handler
// ============================================================================

const handleError = (
  error: RouteError
): Effect.Effect<HttpServerResponse.HttpServerResponse, HttpBody.HttpBodyError> => {
  if (error instanceof TodoNotFound) {
    return notFound(error.message);
  }
  if (error instanceof InvalidTodoId) {
    return badRequest(error.message, { raw: error.raw, reason: error.reason });
  }
  if (error instanceof ValidationError) {
    return badRequest(error.message, { errors: error.errors });
  }
  if (error instanceof HttpError) {
    return badRequest(error.message);
  }
  return internalError('An unexpected error occurred');
};

const handle = <R>(
  handler: Effect.Effect<HttpServerResponse.HttpServerResponse, RouteError, R>
) => pipe(handler, Effect.catchAll(handleError));
${authErrorHandler}
// ============================================================================
// Routes
// ============================================================================

export const routes = [
  // Public
  route.get('/', apiInfo),
  route.get('/health', healthCheck),
${authRoutes}
  // Todos${context.hasAuth ? ' (authenticated)' : ''}
  route.get('/todos', handle(listTodos)),
  route.get('/todos/:id', handle(getTodoById)),
  route.post('/todos', handle(createTodoRoute)),
  route.patch('/todos/:id', handle(updateTodoRoute)),
  route.delete('/todos/:id', handle(deleteTodoRoute)),
  route.post('/todos/:id/toggle', handle(toggleTodoRoute)),
  route.delete('/todos', handle(deleteCompletedRoute)),
] as const;
`;
}

function generateConfig(context: TemplateContext): string {
  return `/**
 * Application Configuration
 */

/**
 * Get environment variable with fallback
 */
function env(key: string, defaultValue: string = ''): string {
  return process.env[key] ?? defaultValue;
}

export const config = {
  app: {
    name: env('APP_NAME', '${context.projectName}'),
    env: env('APP_ENV', 'development'),
  },
  server: {
    port: Number(env('APP_PORT', '3000')),
    host: env('APP_HOST', '0.0.0.0'),
    logging: env('APP_LOGGING', 'true') === 'true',
    timing: env('APP_TIMING', 'true') === 'true',
  },
  security: {
    corsOrigins: env('CORS_ORIGINS', '*'),
  },
  database: {
    host: env('DB_HOST', 'localhost'),
    port: Number(env('DB_PORT', '5432')),
    name: env('DB_NAME', '${context.projectNameKebab}'),
    user: env('DB_USER', 'postgres'),
    password: env('DB_PASSWORD', ''),
  },
  redis: {
    host: env('REDIS_HOST', 'localhost'),
    port: Number(env('REDIS_PORT', '6379')),
    password: env('REDIS_PASSWORD', ''),
  },
  queue: {
    driver: env('QUEUE_DRIVER', '${context.infrastructure.queue}') as 'memory' | 'redis',
    defaultQueue: env('QUEUE_DEFAULT', 'default'),
  },
} as const;
`;
}

function generateMainTs(context: TemplateContext): string {
  const authImports = context.hasAuth
    ? `import { TokenServiceLive, AuthServiceLive } from '@gello/auth';
import { UserRepositoryLive, UserProviderLive } from './services/UserRepository.js';
import { TokenStoreLive } from './services/TokenStore.js';
import { PasswordHasherLive } from './services/PasswordHasher.js';
import { TokenHasherLive } from './services/TokenHasher.js';`
    : '';

  // When auth is enabled, we need to compose layers properly
  const runAppCall = context.hasAuth
    ? `// Step 1: Infrastructure layers (database implementations)
const InfrastructureLayer = Layer.mergeAll(
  UserProviderLive,
  TokenStoreLive,
  TokenHasherLive,
  PasswordHasherLive,
);

// Step 2: TokenService depends on TokenStore + TokenHasher
const TokenLayer = TokenServiceLive.pipe(
  Layer.provide(InfrastructureLayer)
);

// Step 3: AuthService depends on UserProvider + PasswordHasher + TokenService
const AuthLayer = AuthServiceLive.pipe(
  Layer.provide(InfrastructureLayer),
  Layer.provide(TokenLayer)
);

// Step 4: Application layer (all services)
const AppLayer = Layer.mergeAll(
  TodoRepositoryLive,
  UserRepositoryLive,
  InfrastructureLayer,
  TokenLayer,
  AuthLayer,
);

runApp(app, AppLayer);`
    : `runApp(app, Layer.mergeAll(
  TodoRepositoryLive,
));`;

  return `/**
 * ${context.projectName} API Server
 *
 * Built with Gello Framework - Effect-powered backend
 *
 * Demonstrates:
 * - Effect-based error handling with typed errors
 * - Dependency injection via Layers
 * - Pure functional route handlers
 * - Type-safe configuration${context.hasAuth ? '\n * - Token-based authentication' : ''}
 */
import { Effect, Layer } from 'effect';
import { createApp, runApp } from '@gello/platform-node';
import { cors } from '@gello/common';
${authImports}
import { TodoRepositoryLive } from './services/TodoRepository.js';
import { routes } from './routes/index.js';
import { config } from './config/index.js';

// ============================================================================
// Application
// ============================================================================

const app = createApp({
  name: config.app.name,
  port: config.server.port,
  host: config.server.host,
  logging: config.server.logging,
  timing: config.server.timing,
})
  .use(cors({ origins: config.security.corsOrigins }))
  .routes(routes);

// ============================================================================
// Startup
// ============================================================================

// Use proper Effect logging (run \`gello route:list\` to see all routes)
Effect.runPromise(
  Effect.logInfo(\`\${config.app.name} starting on http://\${config.server.host}:\${config.server.port} [env: \${config.app.env}]\`)
);

// ============================================================================
// Run Application
// ============================================================================

${runAppCall}
`;
}

// ============================================================================
// Auth Domain & Routes (when authentication is enabled)
// ============================================================================

function generateUserDomain(context: TemplateContext): string {
  return `/**
 * User Domain Types
 *
 * Defines the user model and authentication schemas.
 */
import * as S from '@effect/schema/Schema';
import { Brand } from 'effect';

// ============================================================================
// Branded Types
// ============================================================================

export type UserId = string & Brand.Brand<'UserId'>;
export const UserId = Brand.nominal<UserId>();

// ============================================================================
// Domain Model
// ============================================================================

export interface User {
  readonly id: UserId;
  readonly email: string;
  readonly name: string;
  readonly password: string; // Hashed
  readonly emailVerifiedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Public user info (without password)
export interface PublicUser {
  readonly id: UserId;
  readonly email: string;
  readonly name: string;
  readonly emailVerifiedAt: Date | null;
  readonly createdAt: Date;
}

// ============================================================================
// Schemas
// ============================================================================

export const RegisterSchema = S.Struct({
  email: S.String.pipe(S.pattern(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/)),
  password: S.String.pipe(S.minLength(8), S.maxLength(100)),
  name: S.String.pipe(S.minLength(1), S.maxLength(100)),
});

export type RegisterInput = S.Schema.Type<typeof RegisterSchema>;

export const LoginSchema = S.Struct({
  email: S.String.pipe(S.pattern(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/)),
  password: S.String.pipe(S.minLength(1)),
});

export type LoginInput = S.Schema.Type<typeof LoginSchema>;

export const CreateTokenSchema = S.Struct({
  name: S.String.pipe(S.minLength(1), S.maxLength(100)),
  scopes: S.optional(S.Array(S.String)),
  expiresInDays: S.optional(S.Number.pipe(S.int(), S.positive())),
});

export type CreateTokenInput = S.Schema.Type<typeof CreateTokenSchema>;

// ============================================================================
// Domain Functions
// ============================================================================

export const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  emailVerifiedAt: user.emailVerifiedAt,
  createdAt: user.createdAt,
});

export const makeUser = (params: {
  id: UserId;
  email: string;
  name: string;
  password: string;
}): User => ({
  id: params.id,
  email: params.email.toLowerCase().trim(),
  name: params.name.trim(),
  password: params.password,
  emailVerifiedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});
`;
}

function generateUserService(context: TemplateContext): string {
  return `/**
 * UserRepository Service
 *
 * Drizzle-backed user storage with Effect patterns.
 * Implements both local UserRepository and auth UserProvider.
 */
import { Effect, Context, Layer, Option } from 'effect';
import { eq } from 'drizzle-orm';
import { UserProviderTag, UserId as AuthUserId } from '@gello/auth';
import { db, schema } from '../db/index.js';
import {
  type User,
  type UserId,
  type RegisterInput,
  UserId as UserIdBrand,
  makeUser,
} from '../domain/user.js';

// ============================================================================
// Service Interface
// ============================================================================

export interface UserRepository {
  readonly findById: (id: UserId) => Effect.Effect<Option.Option<User>, unknown>;
  readonly findByEmail: (email: string) => Effect.Effect<Option.Option<User>, unknown>;
  readonly create: (input: RegisterInput, hashedPassword: string) => Effect.Effect<User, unknown>;
  readonly emailExists: (email: string) => Effect.Effect<boolean, unknown>;
}

// ============================================================================
// Service Tag
// ============================================================================

export class UserRepositoryTag extends Context.Tag('UserRepository')<
  UserRepositoryTag,
  UserRepository
>() {}

// ============================================================================
// Drizzle Implementation
// ============================================================================

const makeDrizzleRepository = (): UserRepository => ({
  findById: (id) =>
    Effect.tryPromise({
      try: () => db.query.users.findFirst({ where: eq(schema.users.id, id) }),
      catch: (error) => new Error(\`Failed to find user: \${error}\`),
    }).pipe(
      Effect.map((row) =>
        row
          ? Option.some(makeUser({
              id: UserIdBrand(row.id),
              email: row.email,
              name: row.name,
              password: row.password,
            }))
          : Option.none()
      )
    ),

  findByEmail: (email) =>
    Effect.tryPromise({
      try: () =>
        db.query.users.findFirst({
          where: eq(schema.users.email, email.toLowerCase().trim()),
        }),
      catch: (error) => new Error(\`Failed to find user: \${error}\`),
    }).pipe(
      Effect.map((row) =>
        row
          ? Option.some(makeUser({
              id: UserIdBrand(row.id),
              email: row.email,
              name: row.name,
              password: row.password,
            }))
          : Option.none()
      )
    ),

  create: (input, hashedPassword) =>
    Effect.tryPromise({
      try: async () => {
        const id = \`user_\${crypto.randomUUID().slice(0, 8)}\`;
        const [row] = await db
          .insert(schema.users)
          .values({
            id,
            email: input.email.toLowerCase().trim(),
            name: input.name,
            password: hashedPassword,
          })
          .returning();
        return row;
      },
      catch: (error) => new Error(\`Failed to create user: \${error}\`),
    }).pipe(
      Effect.map((row) =>
        makeUser({
          id: UserIdBrand(row.id),
          email: row.email,
          name: row.name,
          password: row.password,
        })
      )
    ),

  emailExists: (email) =>
    Effect.tryPromise({
      try: () =>
        db.query.users.findFirst({
          where: eq(schema.users.email, email.toLowerCase().trim()),
          columns: { id: true },
        }),
      catch: (error) => new Error(\`Failed to check email: \${error}\`),
    }).pipe(Effect.map((row) => !!row)),
});

// ============================================================================
// Layers
// ============================================================================

export const UserRepositoryLive: Layer.Layer<UserRepositoryTag> = Layer.succeed(
  UserRepositoryTag,
  makeDrizzleRepository()
);

// UserProvider layer (bridges to @gello/auth)
export const UserProviderLive: Layer.Layer<typeof UserProviderTag> = Layer.succeed(
  UserProviderTag,
  {
    findById: (id: string) =>
      makeDrizzleRepository().findById(id as UserId).pipe(
        Effect.map((opt) =>
          Option.map(opt, (u) => ({
            id: AuthUserId(u.id),
            email: u.email,
            password: u.password,
          }))
        )
      ),
    findByEmail: (email: string) =>
      makeDrizzleRepository().findByEmail(email).pipe(
        Effect.map((opt) =>
          Option.map(opt, (u) => ({
            id: AuthUserId(u.id),
            email: u.email,
            password: u.password,
          }))
        )
      ),
  }
);

// ============================================================================
// Service Accessors
// ============================================================================

export const findUserById = (id: UserId) =>
  Effect.flatMap(UserRepositoryTag, (repo) => repo.findById(id));

export const findUserByEmail = (email: string) =>
  Effect.flatMap(UserRepositoryTag, (repo) => repo.findByEmail(email));

export const createUser = (input: RegisterInput, hashedPassword: string) =>
  Effect.flatMap(UserRepositoryTag, (repo) => repo.create(input, hashedPassword));

export const emailExists = (email: string) =>
  Effect.flatMap(UserRepositoryTag, (repo) => repo.emailExists(email));
`;
}

function generateTokenStore(context: TemplateContext): string {
  return `/**
 * TokenStore Service
 *
 * Drizzle-backed personal access token storage.
 */
import { Effect, Layer, Option } from 'effect';
import { eq, and, gt, lt, isNull, or } from 'drizzle-orm';
import {
  TokenStoreTag,
  TokenId,
  HashedToken,
  UserId,
  type PersonalAccessToken,
} from '@gello/auth';
import { db, schema } from '../db/index.js';

// ============================================================================
// Drizzle Token Store Implementation
// ============================================================================

const makeDrizzleTokenStore = () => ({
  // Create a new token
  create: (token: PersonalAccessToken) =>
    Effect.tryPromise({
      try: () =>
        db.insert(schema.personalAccessTokens).values({
          id: token.id,
          userId: token.userId,
          name: token.name,
          token: token.token,
          scopes: token.scopes as string[],
          lastUsedAt: token.lastUsedAt,
          expiresAt: token.expiresAt,
          createdAt: token.createdAt,
        }),
      catch: (error) => new Error(\`Failed to store token: \${error}\`),
    }).pipe(Effect.map(() => token)),

  // Find token by hashed value
  findByToken: (hashedToken: HashedToken) =>
    Effect.tryPromise({
      try: () =>
        db.query.personalAccessTokens.findFirst({
          where: and(
            eq(schema.personalAccessTokens.token, hashedToken),
            or(
              isNull(schema.personalAccessTokens.expiresAt),
              gt(schema.personalAccessTokens.expiresAt, new Date())
            )
          ),
        }),
      catch: (error) => new Error(\`Failed to find token: \${error}\`),
    }).pipe(
      Effect.map((row) =>
        row
          ? Option.some({
              id: TokenId(row.id),
              userId: UserId(row.userId),
              name: row.name,
              token: HashedToken(row.token),
              scopes: row.scopes as readonly string[],
              lastUsedAt: row.lastUsedAt ?? undefined,
              expiresAt: row.expiresAt ?? undefined,
              createdAt: row.createdAt,
            } as PersonalAccessToken)
          : Option.none()
      )
    ),

  // Find token by ID
  findById: (id: TokenId) =>
    Effect.tryPromise({
      try: () =>
        db.query.personalAccessTokens.findFirst({
          where: eq(schema.personalAccessTokens.id, id),
        }),
      catch: (error) => new Error(\`Failed to find token: \${error}\`),
    }).pipe(
      Effect.map((row) =>
        row
          ? Option.some({
              id: TokenId(row.id),
              userId: UserId(row.userId),
              name: row.name,
              token: HashedToken(row.token),
              scopes: row.scopes as readonly string[],
              lastUsedAt: row.lastUsedAt ?? undefined,
              expiresAt: row.expiresAt ?? undefined,
              createdAt: row.createdAt,
            } as PersonalAccessToken)
          : Option.none()
      )
    ),

  // Get all tokens for a user
  findByUser: (userId: UserId) =>
    Effect.tryPromise({
      try: () =>
        db.query.personalAccessTokens.findMany({
          where: eq(schema.personalAccessTokens.userId, userId),
          orderBy: (t, { desc }) => desc(t.createdAt),
        }),
      catch: (error) => new Error(\`Failed to find tokens: \${error}\`),
    }).pipe(
      Effect.map((rows) =>
        rows.map(
          (row) =>
            ({
              id: TokenId(row.id),
              userId: UserId(row.userId),
              name: row.name,
              token: HashedToken(row.token),
              scopes: row.scopes as readonly string[],
              lastUsedAt: row.lastUsedAt ?? undefined,
              expiresAt: row.expiresAt ?? undefined,
              createdAt: row.createdAt,
            }) as PersonalAccessToken
        )
      )
    ),

  // Update last used timestamp
  updateLastUsed: (id: TokenId, lastUsedAt: Date) =>
    Effect.tryPromise({
      try: () =>
        db
          .update(schema.personalAccessTokens)
          .set({ lastUsedAt })
          .where(eq(schema.personalAccessTokens.id, id)),
      catch: (error) => new Error(\`Failed to update token: \${error}\`),
    }).pipe(Effect.asVoid),

  // Delete a token by ID
  delete: (id: TokenId) =>
    Effect.tryPromise({
      try: () =>
        db.delete(schema.personalAccessTokens).where(eq(schema.personalAccessTokens.id, id)),
      catch: (error) => new Error(\`Failed to delete token: \${error}\`),
    }).pipe(Effect.asVoid),

  // Delete all tokens for a user (returns count)
  deleteByUser: (userId: UserId) =>
    Effect.tryPromise({
      try: async () => {
        const result = await db.delete(schema.personalAccessTokens)
          .where(eq(schema.personalAccessTokens.userId, userId));
        return result.rowCount ?? 0;
      },
      catch: (error) => new Error(\`Failed to delete tokens: \${error}\`),
    }),

  // Delete expired tokens (garbage collection)
  deleteExpired: () =>
    Effect.tryPromise({
      try: async () => {
        const result = await db.delete(schema.personalAccessTokens)
          .where(lt(schema.personalAccessTokens.expiresAt, new Date()));
        return result.rowCount ?? 0;
      },
      catch: (error) => new Error(\`Failed to delete expired tokens: \${error}\`),
    }),
});

// ============================================================================
// Layer
// ============================================================================

export const TokenStoreLive = Layer.succeed(TokenStoreTag, makeDrizzleTokenStore());
`;
}

function generatePasswordHasher(context: TemplateContext): string {
  return `/**
 * PasswordHasher Service
 *
 * Real bcrypt-based password hashing.
 */
import { Effect, Layer } from 'effect';
import bcrypt from 'bcrypt';
import { PasswordHasherTag } from '@gello/auth';

const SALT_ROUNDS = 12;

// ============================================================================
// Bcrypt Password Hasher Implementation
// ============================================================================

const makeBcryptHasher = () => ({
  hash: (password: string) =>
    Effect.tryPromise({
      try: () => bcrypt.hash(password, SALT_ROUNDS),
      catch: (error) => new Error(\`Failed to hash password: \${error}\`),
    }),

  verify: (password: string, hash: string) =>
    Effect.tryPromise({
      try: () => bcrypt.compare(password, hash),
      catch: (error) => new Error(\`Failed to verify password: \${error}\`),
    }),
});

// ============================================================================
// Layer
// ============================================================================

export const PasswordHasherLive = Layer.succeed(PasswordHasherTag, makeBcryptHasher());
`;
}

function generateTokenHasher(context: TemplateContext): string {
  return `/**
 * TokenHasher Service
 *
 * Real SHA-256 token hashing for secure token storage.
 */
import { Effect, Layer } from 'effect';
import { createHash, randomBytes } from 'crypto';
import { TokenHasherTag, PlainTextToken, HashedToken } from '@gello/auth';

// ============================================================================
// SHA-256 Token Hasher Implementation
// ============================================================================

const makeSha256Hasher = () => ({
  hash: (plaintext: PlainTextToken) =>
    Effect.sync(() =>
      HashedToken(createHash('sha256').update(plaintext).digest('hex'))
    ),

  generate: () =>
    Effect.sync(() => PlainTextToken(randomBytes(32).toString('base64url'))),
});

// ============================================================================
// Layer
// ============================================================================

export const TokenHasherLive = Layer.succeed(TokenHasherTag, makeSha256Hasher());
`;
}

function generateAuthRouteHandlers(context: TemplateContext): string {
  const oauthImports = context.hasOAuth
    ? `import { Social, GithubProvider, GoogleProvider } from '@gello/auth';`
    : '';

  const oauthRoutes = context.hasOAuth
    ? `
// ============================================================================
// OAuth Routes
// ============================================================================

export const oauthRedirect: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  AuthRouteError,
  RouteParams
> = Effect.gen(function* () {
  const provider = yield* getParam('provider');

  // Get the appropriate provider
  const social = provider === 'github'
    ? yield* Social.driver('github')
    : yield* Social.driver('google');

  const url = yield* social.redirect();

  return HttpServerResponse.redirect(url, { status: 302 });
});

export const oauthCallback: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  AuthRouteError,
  RouteParams | QueryParams | AuthTag | UserRepositoryTag
> = Effect.gen(function* () {
  const provider = yield* getParam('provider');
  const code = yield* getQuery('code');
  const state = yield* getQuery('state');

  if (!code) {
    return yield* badRequest('Missing authorization code');
  }

  const social = provider === 'github'
    ? yield* Social.driver('github')
    : yield* Social.driver('google');

  const socialUser = yield* social.user(code, state ?? undefined).pipe(
    Effect.mapError((e) => new AuthenticationError({
      message: 'OAuth authentication failed',
      reason: 'oauth_error',
    }))
  );

  // Find or create user
  const existingUser = yield* findUserByEmail(socialUser.email);

  let user: User;
  if (Option.isNone(existingUser)) {
    // Create new user from OAuth
    user = yield* createUser(
      {
        email: socialUser.email,
        name: socialUser.name ?? socialUser.email.split('@')[0],
        password: '', // OAuth users don't have passwords
      },
      '' // No password hash
    );
  } else {
    user = existingUser.value;
  }

  // Create token
  const auth = yield* AuthTag;
  const token = yield* auth.createToken(user.id, 'oauth_session', ['*']);

  return yield* success({
    user: toPublicUser(user),
    token: token.plainTextToken,
    tokenType: 'Bearer',
  });
});
`
    : '';

  return `/**
 * Auth Routes - Authentication endpoints
 *
 * Provides registration, login, logout, and token management.
 */
import { Effect, Option, pipe } from 'effect';
import { HttpServerRequest, HttpServerResponse, HttpBody } from '@effect/platform';
import {
  json,
  success,
  created,
  noContent,
  badRequest,
  unauthorized,
  getJsonBody,
} from '@gello/platform-node';
import { ValidationError, RouteParams, QueryParams, HttpError } from '@gello/core';
import { getParam, getQuery } from '@gello/common';
import {
  AuthTag,
  authenticate,
  currentUser,
  AuthenticatedUserTag,
  AuthenticationError,
  TokenId,
} from '@gello/auth';
import {
  RegisterSchema,
  LoginSchema,
  CreateTokenSchema,
  toPublicUser,
  type User,
} from '../domain/user.js';
import {
  UserRepositoryTag,
  findUserByEmail,
  createUser,
  emailExists,
} from '../services/UserRepository.js';
${oauthImports}

// ============================================================================
// Route Error Type
// ============================================================================

export type AuthRouteError =
  | ValidationError
  | AuthenticationError
  | HttpError
  | HttpBody.HttpBodyError;

// ============================================================================
// Register
// ============================================================================

export const register: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  AuthRouteError,
  AuthTag | UserRepositoryTag | HttpServerRequest.HttpServerRequest
> = Effect.gen(function* () {
  const body = yield* getJsonBody(RegisterSchema);
  const auth = yield* AuthTag;

  // Check if email exists
  const exists = yield* emailExists(body.email);
  if (exists) {
    return yield* badRequest('Email already registered');
  }

  // Hash password
  const hashedPassword = yield* auth.hashPassword(body.password);

  // Create user
  const user = yield* createUser(body, hashedPassword);

  // Create initial token
  const token = yield* auth.createToken(user.id, 'default', ['*']);

  yield* Effect.logInfo(\`User registered: \${user.email}\`);

  return yield* created({
    user: toPublicUser(user),
    token: token.plainTextToken,
    tokenType: 'Bearer',
  });
});

// ============================================================================
// Login
// ============================================================================

export const login: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  AuthRouteError,
  AuthTag | HttpServerRequest.HttpServerRequest
> = Effect.gen(function* () {
  const body = yield* getJsonBody(LoginSchema);
  const auth = yield* AuthTag;

  // Attempt authentication
  const user = yield* auth.attempt(body.email, body.password).pipe(
    Effect.mapError((e) => e)
  );

  // Create token
  const token = yield* auth.createToken(user.id, 'login', ['*']);

  yield* Effect.logInfo(\`User logged in: \${user.email}\`);

  return yield* success({
    user: toPublicUser(user as User),
    token: token.plainTextToken,
    tokenType: 'Bearer',
  });
});

// ============================================================================
// Logout (Revoke Current Token)
// ============================================================================

export const logout: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  AuthRouteError,
  AuthTag | AuthenticatedUserTag
> = Effect.gen(function* () {
  const authUser = yield* currentUser();
  const auth = yield* AuthTag;

  // Revoke current token
  if (authUser.token) {
    yield* auth.revokeToken(authUser.token.id);
  }

  yield* Effect.logInfo(\`User logged out: \${authUser.id}\`);

  return yield* success({ message: 'Logged out successfully' });
});

// ============================================================================
// Get Current User
// ============================================================================

export const me: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  AuthRouteError,
  AuthTag | AuthenticatedUserTag | UserRepositoryTag
> = Effect.gen(function* () {
  const authUser = yield* currentUser();
  const auth = yield* AuthTag;

  const user = yield* auth.getUser(authUser.id).pipe(
    Effect.mapError((e) => new AuthenticationError({
      message: e.message,
      reason: 'user_not_found',
    }))
  );

  return yield* success({
    user: toPublicUser(user as User),
    token: authUser.token ? {
      id: authUser.token.id,
      name: authUser.token.name,
      scopes: authUser.token.abilities,
      lastUsedAt: authUser.token.lastUsedAt,
      expiresAt: authUser.token.expiresAt,
    } : null,
  });
});

// ============================================================================
// List Tokens
// ============================================================================

export const listTokens: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  AuthRouteError,
  AuthTag | AuthenticatedUserTag
> = Effect.gen(function* () {
  const authUser = yield* currentUser();
  const auth = yield* AuthTag;

  const tokens = yield* auth.getTokens(authUser.id);

  return yield* success({
    tokens: tokens.map((t) => ({
      id: t.id,
      name: t.name,
      scopes: t.abilities,
      lastUsedAt: t.lastUsedAt,
      expiresAt: t.expiresAt,
      createdAt: t.createdAt,
    })),
  });
});

// ============================================================================
// Create Token
// ============================================================================

export const createToken: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  AuthRouteError,
  AuthTag | AuthenticatedUserTag | HttpServerRequest.HttpServerRequest
> = Effect.gen(function* () {
  const authUser = yield* currentUser();
  const auth = yield* AuthTag;
  const body = yield* getJsonBody(CreateTokenSchema);

  const expiresAt = body.expiresInDays
    ? new Date(Date.now() + body.expiresInDays * 24 * 60 * 60 * 1000)
    : undefined;

  const token = yield* auth.createToken(
    authUser.id,
    body.name,
    body.scopes,
    expiresAt
  );

  yield* Effect.logInfo(\`Token created: \${body.name} for user \${authUser.id}\`);

  return yield* created({
    token: token.plainTextToken,
    tokenType: 'Bearer',
    expiresAt,
    message: 'Store this token securely - it will not be shown again',
  });
});

// ============================================================================
// Revoke Token
// ============================================================================

export const revokeToken: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  AuthRouteError,
  AuthTag | AuthenticatedUserTag | RouteParams
> = Effect.gen(function* () {
  const authUser = yield* currentUser();
  const auth = yield* AuthTag;
  const tokenId = yield* getParam('tokenId');

  if (!tokenId) {
    return yield* badRequest('Token ID is required');
  }

  yield* auth.revokeToken(TokenId(tokenId));

  yield* Effect.logInfo(\`Token revoked: \${tokenId} by user \${authUser.id}\`);

  return yield* success({ message: 'Token revoked successfully' });
});

// ============================================================================
// Revoke All Tokens
// ============================================================================

export const revokeAllTokens: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  AuthRouteError,
  AuthTag | AuthenticatedUserTag
> = Effect.gen(function* () {
  const authUser = yield* currentUser();
  const auth = yield* AuthTag;

  const count = yield* auth.revokeAllTokens(authUser.id);

  yield* Effect.logInfo(\`All tokens revoked (\${count}) for user \${authUser.id}\`);

  return yield* success({
    message: \`\${count} token(s) revoked\`,
    revokedCount: count,
  });
});
${oauthRoutes}
`;
}
