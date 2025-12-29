/**
 * Todo Domain Model
 *
 * Immutable domain model with refined types for type safety.
 * Uses @gello/refined for compile-time validated types.
 * Uses @gello/optics for immutable updates.
 */
import { Schema } from '@effect/schema';
import { Brand } from 'effect';
import { boundedString } from '@gello/refined';
import { prop, modify } from '@gello/optics';

// ============================================================================
// Refined Types using @gello/refined
// ============================================================================

/**
 * Todo ID - branded string type
 */
export type TodoId = string & Brand.Brand<'TodoId'>;
export const TodoId = Brand.nominal<TodoId>();

/**
 * Todo Title - bounded string (1-200 chars)
 */
export const TodoTitle = boundedString(1, 200, 'BoundedString_1_200');
export type TodoTitle = typeof TodoTitle extends { schema: Schema.Schema<infer A, unknown> } ? A : never;
/**
 * Todo Description - bounded string (0-1000 chars)
 */
export const TodoDescription = boundedString(0, 1000, 'BoundedString_0_1000');
export type TodoDescription = typeof TodoDescription extends { schema: Schema.Schema<infer A, unknown> } ? A : never;

// ============================================================================
// Domain Model - Immutable
// ============================================================================

export interface Todo {
  readonly id: TodoId;
  readonly title: string;
  readonly description: string | undefined;
  readonly completed: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ============================================================================
// Optics for Todo - Type-safe immutable updates
// ============================================================================

export const todoTitleLens = prop<Todo, 'title'>('title');
export const todoDescriptionLens = prop<Todo, 'description'>('description');
export const todoCompletedLens = prop<Todo, 'completed'>('completed');
export const todoUpdatedAtLens = prop<Todo, 'updatedAt'>('updatedAt');

// ============================================================================
// Smart Constructors - Total functions
// ============================================================================

export const makeTodo = (params: {
  readonly id: TodoId;
  readonly title: string;
  readonly description?: string;
  readonly completed?: boolean;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}): Todo => ({
  id: params.id,
  title: params.title,
  description: params.description,
  completed: params.completed ?? false,
  createdAt: params.createdAt ?? new Date(),
  updatedAt: params.updatedAt ?? new Date(),
});

// ============================================================================
// Optics-based Update Functions - Pure transformations using lenses
// ============================================================================

export const updateTodo = (
  todo: Todo,
  updates: {
    readonly title?: string;
    readonly description?: string;
    readonly completed?: boolean;
  }
): Todo => {
  let result = todo;

  if (updates.title !== undefined) {
    result = todoTitleLens.set(updates.title)(result);
  }
  if (updates.description !== undefined) {
    result = todoDescriptionLens.set(updates.description)(result);
  }
  if (updates.completed !== undefined) {
    result = todoCompletedLens.set(updates.completed)(result);
  }

  // Always update the updatedAt timestamp
  result = todoUpdatedAtLens.set(new Date())(result);

  return result;
};

export const toggleCompleted = (todo: Todo): Todo => {
  const toggled = modify(todoCompletedLens, (c) => !c)(todo);
  return todoUpdatedAtLens.set(new Date())(toggled);
};

// ============================================================================
// Schemas for Validation - Parse, don't validate
// ============================================================================

export const CreateTodoSchema = Schema.Struct({
  title: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'Title cannot be empty' }),
    Schema.maxLength(200, { message: () => 'Title cannot exceed 200 characters' })
  ),
  description: Schema.optional(
    Schema.String.pipe(
      Schema.maxLength(1000, { message: () => 'Description cannot exceed 1000 characters' })
    )
  ),
});

export type CreateTodo = Schema.Schema.Type<typeof CreateTodoSchema>;

export const UpdateTodoSchema = Schema.Struct({
  title: Schema.optional(
    Schema.String.pipe(
      Schema.minLength(1, { message: () => 'Title cannot be empty' }),
      Schema.maxLength(200, { message: () => 'Title cannot exceed 200 characters' })
    )
  ),
  description: Schema.optional(
    Schema.String.pipe(
      Schema.maxLength(1000, { message: () => 'Description cannot exceed 1000 characters' })
    )
  ),
  completed: Schema.optional(Schema.Boolean),
});

export type UpdateTodo = Schema.Schema.Type<typeof UpdateTodoSchema>;

// ============================================================================
// Filter Type
// ============================================================================

export interface TodoFilter {
  readonly completed?: boolean;
}

// ============================================================================
// List Result with Statistics
// ============================================================================

export interface TodoListResult {
  readonly todos: readonly Todo[];
  readonly total: number;
  readonly completed: number;
  readonly pending: number;
}

export const makeTodoListResult = (todos: readonly Todo[]): TodoListResult => ({
  todos,
  total: todos.length,
  completed: todos.filter((t) => t.completed).length,
  pending: todos.filter((t) => !t.completed).length,
});
