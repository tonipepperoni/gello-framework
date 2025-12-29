/**
 * Todo Routes - Pure route handlers using service pattern
 *
 * All handlers are pure functions that return Effects.
 * Dependencies are injected via the R channel (TodoRepositoryTag).
 *
 * Route params and query params are automatically provided by the router
 * and accessed via helpers from @gello/core-domain-routing.
 */
import { Effect, Option, pipe } from 'effect';
import { HttpServerRequest, HttpServerResponse, HttpBody } from '@effect/platform';
import {
  json,
  success,
  created,
  noContent,
  getJsonBody,
} from '@gello/core-adapter-node';
import { ValidationError, RouteParams, QueryParams, HttpError } from '@gello/core-contracts';
import { getParam, getQueryAsBoolean } from '@gello/core-domain-routing';
import { CreateTodoSchema, UpdateTodoSchema } from '../domain/Todo.js';
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

// ============================================================================
// Route Error Type - Union of all possible route errors
// ============================================================================

export type RouteError =
  | TodoNotFound
  | InvalidTodoId
  | ValidationError
  | HttpError
  | HttpBody.HttpBodyError;

// ============================================================================
// API Info Route
// ============================================================================

export const apiInfo = json({
  name: 'Todo List API',
  version: '1.0.0',
  description: 'A demo todo list API built with Gello framework (FP style)',
  endpoints: {
    'GET /todos': 'List all todos (supports ?completed=true|false filter)',
    'GET /todos/:id': 'Get a specific todo by ID',
    'POST /todos': 'Create a new todo',
    'PATCH /todos/:id': 'Update a todo',
    'DELETE /todos/:id': 'Delete a todo',
    'POST /todos/:id/toggle': 'Toggle todo completion status',
    'DELETE /todos': 'Delete all completed todos',
  },
});

// ============================================================================
// Health Check Route
// ============================================================================

export const healthCheck = json({
  status: 'ok',
  service: 'todo-api',
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
});

// ============================================================================
// List Todos Route
// ============================================================================

export const listTodos: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  RouteError,
  TodoRepositoryTag | QueryParams
> = Effect.gen(function* () {
  // Get optional completed filter from query params
  const maybeCompleted = yield* getQueryAsBoolean('completed');

  const filter = {
    completed: Option.getOrUndefined(maybeCompleted),
  };

  const result = yield* findAllTodos(filter);
  return yield* success(result);
});

// ============================================================================
// Get Todo By ID Route
// ============================================================================

export const getTodoById: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  RouteError,
  TodoRepositoryTag | RouteParams
> = Effect.gen(function* () {
  // Get :id from route params
  const rawId = yield* getParam('id');
  const todoId = yield* parseTodoId(rawId);
  const maybeTodo = yield* findTodoById(todoId);

  // Convert Option to error or success
  const todo = yield* pipe(
    maybeTodo,
    Option.match({
      onNone: () => Effect.fail(todoNotFound(todoId)),
      onSome: Effect.succeed,
    })
  );

  return yield* success(todo);
});

// ============================================================================
// Create Todo Route
// ============================================================================

export const createTodoRoute: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  RouteError,
  TodoRepositoryTag | HttpServerRequest.HttpServerRequest
> = Effect.gen(function* () {
  const body = yield* getJsonBody(CreateTodoSchema);
  const todo = yield* createTodo(body);

  yield* Effect.logInfo(`Todo created: "${todo.title}" (ID: ${todo.id})`);

  return yield* created(todo, `/todos/${todo.id}`);
});

// ============================================================================
// Update Todo Route
// ============================================================================

export const updateTodoRoute: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  RouteError,
  TodoRepositoryTag | RouteParams | HttpServerRequest.HttpServerRequest
> = Effect.gen(function* () {
  const rawId = yield* getParam('id');
  const todoId = yield* parseTodoId(rawId);
  const updates = yield* getJsonBody(UpdateTodoSchema);
  const maybeUpdated = yield* updateTodoById(todoId, updates);

  const updated = yield* pipe(
    maybeUpdated,
    Option.match({
      onNone: () => Effect.fail(todoNotFound(todoId)),
      onSome: Effect.succeed,
    })
  );

  yield* Effect.logInfo(`Todo updated: "${updated.title}" (ID: ${updated.id})`);

  return yield* success(updated);
});

// ============================================================================
// Delete Todo Route
// ============================================================================

export const deleteTodoRoute: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  RouteError,
  TodoRepositoryTag | RouteParams
> = Effect.gen(function* () {
  const rawId = yield* getParam('id');
  const todoId = yield* parseTodoId(rawId);
  const deleted = yield* deleteTodoById(todoId);

  if (!deleted) {
    return yield* Effect.fail(todoNotFound(todoId));
  }

  yield* Effect.logInfo(`Todo deleted: ${todoId}`);

  return yield* noContent();
});

// ============================================================================
// Toggle Todo Route
// ============================================================================

export const toggleTodoRoute: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  RouteError,
  TodoRepositoryTag | RouteParams
> = Effect.gen(function* () {
  // Get :id from route params (router matches /todos/:id/toggle)
  const rawId = yield* getParam('id');
  const todoId = yield* parseTodoId(rawId);
  const maybeToggled = yield* toggleTodoById(todoId);

  const toggled = yield* pipe(
    maybeToggled,
    Option.match({
      onNone: () => Effect.fail(todoNotFound(todoId)),
      onSome: Effect.succeed,
    })
  );

  yield* Effect.logInfo(
    `Todo toggled: "${toggled.title}" -> ${toggled.completed ? 'completed' : 'pending'}`
  );

  return yield* success(toggled);
});

// ============================================================================
// Delete Completed Todos Route
// ============================================================================

export const deleteCompletedRoute: Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  RouteError,
  TodoRepositoryTag
> = Effect.gen(function* () {
  const count = yield* deleteCompletedTodos();

  yield* Effect.logInfo(`Deleted ${count} completed todos`);

  return yield* success({
    deleted: count,
    message: `${count} completed todo(s) deleted`,
  });
});
