/**
 * Todo Routes - Declarative route definitions
 */
import { Effect, pipe } from 'effect';
import { HttpServerResponse, HttpBody } from '@effect/platform';
import { route } from '@gello/core-adapter-node';
import { badRequest, notFound, internalError } from '@gello/core-adapter-node';
import { ValidationError, HttpError } from '@gello/core-contracts';

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

// ============================================================================
// Routes
// ============================================================================

export const routes = [
  // Static
  route.get('/', apiInfo),
  route.get('/health', healthCheck),

  // Todos
  route.get('/todos', handle(listTodos)),
  route.get('/todos/:id', handle(getTodoById)),
  route.post('/todos', handle(createTodoRoute)),
  route.patch('/todos/:id', handle(updateTodoRoute)),
  route.delete('/todos/:id', handle(deleteTodoRoute)),
  route.post('/todos/:id/toggle', handle(toggleTodoRoute)),
  route.delete('/todos', handle(deleteCompletedRoute)),
] as const;
