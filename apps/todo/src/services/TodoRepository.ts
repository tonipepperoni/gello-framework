/**
 * TodoRepository Service
 *
 * Repository pattern with Effect.Ref for pure, immutable state management.
 * Uses Context.Tag for dependency injection (ZLayer-style).
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
} from '../domain/Todo.js';
import { InvalidTodoId } from '../domain/errors.js';

// ============================================================================
// Service Interface - Tagless Final style
// ============================================================================

export interface TodoRepository {
  /**
   * Get all todos with optional filtering
   */
  readonly findAll: (filter: TodoFilter) => Effect.Effect<TodoListResult>;

  /**
   * Find a todo by ID - Returns Option for totality
   */
  readonly findById: (id: TodoId) => Effect.Effect<Option.Option<Todo>>;

  /**
   * Create a new todo
   */
  readonly create: (data: CreateTodo) => Effect.Effect<Todo>;

  /**
   * Update an existing todo - Returns Option (None if not found)
   */
  readonly update: (
    id: TodoId,
    data: UpdateTodo
  ) => Effect.Effect<Option.Option<Todo>>;

  /**
   * Delete a todo by ID - Returns boolean (false if not found)
   */
  readonly delete: (id: TodoId) => Effect.Effect<boolean>;

  /**
   * Toggle todo completion status - Returns Option (None if not found)
   */
  readonly toggle: (id: TodoId) => Effect.Effect<Option.Option<Todo>>;

  /**
   * Delete all completed todos - Returns count of deleted
   */
  readonly deleteCompleted: () => Effect.Effect<number>;
}

// ============================================================================
// Service Tag - For dependency injection
// ============================================================================

export class TodoRepositoryTag extends Context.Tag('TodoRepository')<
  TodoRepositoryTag,
  TodoRepository
>() {}

// ============================================================================
// In-Memory Implementation - Pure with Ref
// ============================================================================

interface RepositoryState {
  readonly todos: ReadonlyMap<TodoId, Todo>;
  readonly nextId: number;
}

const initialState: RepositoryState = {
  todos: new Map(),
  nextId: 1,
};

/**
 * Create an in-memory TodoRepository backed by Effect.Ref
 * All operations are pure - state changes happen through Ref
 */
const makeInMemoryRepository = (
  stateRef: Ref.Ref<RepositoryState>
): TodoRepository => ({
  findAll: (filter) =>
    pipe(
      Ref.get(stateRef),
      Effect.map((state) => {
        let todos = Array.from(state.todos.values());

        // Apply filter if specified
        if (filter.completed !== undefined) {
          todos = todos.filter((t) => t.completed === filter.completed);
        }

        // Sort by createdAt descending (newest first)
        todos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return makeTodoListResult(todos);
      })
    ),

  findById: (id) =>
    pipe(
      Ref.get(stateRef),
      Effect.map((state) => Option.fromNullable(state.todos.get(id)))
    ),

  create: (data) =>
    Ref.modify(stateRef, (state) => {
      const id = TodoIdBrand(String(state.nextId));
      const todo = makeTodo({
        id,
        title: data.title.trim(),
        description: data.description?.trim(),
      });

      const newTodos = new Map(state.todos);
      newTodos.set(id, todo);

      return [
        todo,
        {
          todos: newTodos,
          nextId: state.nextId + 1,
        },
      ];
    }),

  update: (id, data) =>
    Ref.modify(stateRef, (state) => {
      const existing = state.todos.get(id);

      if (!existing) {
        return [Option.none<Todo>(), state];
      }

      const updated = updateTodo(existing, {
        title: data.title?.trim(),
        description: data.description?.trim(),
        completed: data.completed,
      });

      const newTodos = new Map(state.todos);
      newTodos.set(id, updated);

      return [Option.some(updated), { ...state, todos: newTodos }];
    }),

  delete: (id) =>
    Ref.modify(stateRef, (state) => {
      if (!state.todos.has(id)) {
        return [false, state];
      }

      const newTodos = new Map(state.todos);
      newTodos.delete(id);

      return [true, { ...state, todos: newTodos }];
    }),

  toggle: (id) =>
    Ref.modify(stateRef, (state) => {
      const existing = state.todos.get(id);

      if (!existing) {
        return [Option.none<Todo>(), state];
      }

      const toggled = toggleCompleted(existing);
      const newTodos = new Map(state.todos);
      newTodos.set(id, toggled);

      return [Option.some(toggled), { ...state, todos: newTodos }];
    }),

  deleteCompleted: () =>
    Ref.modify(stateRef, (state) => {
      let deletedCount = 0;
      const newTodos = new Map<TodoId, Todo>();

      for (const [id, todo] of state.todos) {
        if (todo.completed) {
          deletedCount++;
        } else {
          newTodos.set(id, todo);
        }
      }

      return [deletedCount, { ...state, todos: newTodos }];
    }),
});

// ============================================================================
// Layers - ZLayer-style dependency injection
// ============================================================================

/**
 * Live layer with empty initial state
 */
export const TodoRepositoryLive: Layer.Layer<TodoRepositoryTag> = Layer.effect(
  TodoRepositoryTag,
  pipe(
    Ref.make(initialState),
    Effect.map(makeInMemoryRepository)
  )
);

/**
 * Layer with seed data for development/demo
 */
export const TodoRepositorySeeded: Layer.Layer<TodoRepositoryTag> = Layer.effect(
  TodoRepositoryTag,
  Effect.gen(function* () {
    const stateRef = yield* Ref.make(initialState);
    const repo = makeInMemoryRepository(stateRef);

    // Seed initial data - all pure operations
    yield* repo.create({
      title: 'Learn Effect-TS',
      description: 'Study the Effect library and functional programming patterns',
    });

    const second = yield* repo.create({
      title: 'Build a REST API',
      description: 'Create a todo list API using the Gello framework',
    });

    // Mark second one as completed
    yield* repo.toggle(second.id);

    yield* repo.create({
      title: 'Write tests',
      description: 'Add comprehensive test coverage',
    });

    return repo;
  })
);

// ============================================================================
// Service Accessor Functions - For ergonomic usage in routes
// ============================================================================

export const findAllTodos = (filter: TodoFilter) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.findAll(filter));

export const findTodoById = (id: TodoId) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.findById(id));

export const createTodo = (data: CreateTodo) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.create(data));

export const updateTodoById = (id: TodoId, data: UpdateTodo) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.update(id, data));

export const deleteTodoById = (id: TodoId) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.delete(id));

export const toggleTodoById = (id: TodoId) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.toggle(id));

export const deleteCompletedTodos = () =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.deleteCompleted());

// ============================================================================
// TodoId Parser - Total function returning Effect
// ============================================================================

export const parseTodoId = (
  raw: string | undefined
): Effect.Effect<TodoId, InvalidTodoId> => {
  if (raw === undefined || raw.trim() === '') {
    return Effect.fail(new InvalidTodoId({ raw: raw ?? '', reason: 'ID is required' }));
  }

  const trimmed = raw.trim();

  // Validate it looks like a valid ID (numeric string in our case)
  if (!/^\d+$/.test(trimmed)) {
    return Effect.fail(
      new InvalidTodoId({ raw: trimmed, reason: 'ID must be a numeric string' })
    );
  }

  return Effect.succeed(TodoIdBrand(trimmed));
};
