/**
 * Todo Domain Errors - Algebraic Data Types
 *
 * Domain-specific errors for the Todo bounded context.
 * Generic errors (ValidationError, etc.) come from @gello/core-contracts.
 */
import { Data } from 'effect';
import type { TodoId } from './Todo.js';

// Re-export generic errors from core-contracts for convenience
export { ValidationError, HttpError } from '@gello/core-contracts';

// ============================================================================
// Domain-Specific Errors - Tagged Union (Sum Type)
// ============================================================================

/**
 * TodoNotFound - Domain-specific "not found" error
 */
export class TodoNotFound extends Data.TaggedError('TodoNotFound')<{
  readonly id: TodoId;
}> {
  override get message(): string {
    return `Todo with ID "${this.id}" not found`;
  }
}

/**
 * InvalidTodoId - Failed to parse todo ID from path/input
 */
export class InvalidTodoId extends Data.TaggedError('InvalidTodoId')<{
  readonly raw: string;
  readonly reason: string;
}> {
  override get message(): string {
    return `Invalid todo ID "${this.raw}": ${this.reason}`;
  }
}

// ============================================================================
// Union Type - Domain-specific Todo errors
// ============================================================================

export type TodoError = TodoNotFound | InvalidTodoId;

// ============================================================================
// Smart Constructors
// ============================================================================

export const todoNotFound = (id: TodoId): TodoNotFound =>
  new TodoNotFound({ id });

export const invalidTodoId = (raw: string, reason: string): InvalidTodoId =>
  new InvalidTodoId({ raw, reason });
