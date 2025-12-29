/**
 * Accumulated Validation Library
 *
 * Provides Either-based validation that accumulates ALL errors instead of
 * failing fast. Inspired by Cats Validated and ZIO Validation.
 */
import { Either, pipe, Option } from 'effect';

// =============================================================================
// NonEmptyList - required for accumulating errors
// =============================================================================

/**
 * A non-empty list type (guaranteed at least one element)
 */
export type NonEmptyList<A> = readonly [A, ...A[]];

/**
 * Create a NonEmptyList with a single element
 */
export const of = <A>(head: A): NonEmptyList<A> => [head];

/**
 * Create a NonEmptyList from head and tail
 */
export const make = <A>(head: A, ...tail: A[]): NonEmptyList<A> => [head, ...tail];

/**
 * Append two NonEmptyLists
 */
export const concat = <A>(
  xs: NonEmptyList<A>,
  ys: NonEmptyList<A>
): NonEmptyList<A> => [...xs, ...ys];

/**
 * Get the first element (guaranteed to exist)
 */
export const head = <A>(nel: NonEmptyList<A>): A => nel[0];

/**
 * Get the tail (may be empty)
 */
export const tail = <A>(nel: NonEmptyList<A>): readonly A[] => nel.slice(1);

/**
 * Map over a NonEmptyList
 */
export const map = <A, B>(
  nel: NonEmptyList<A>,
  f: (a: A) => B
): NonEmptyList<B> => {
  const [h, ...t] = nel;
  return [f(h), ...t.map(f)];
};

/**
 * Flatten nested NonEmptyLists
 */
export const flatten = <A>(
  nel: NonEmptyList<NonEmptyList<A>>
): NonEmptyList<A> => {
  const result: A[] = [];
  for (const inner of nel) {
    result.push(...inner);
  }
  return result as unknown as NonEmptyList<A>;
};

/**
 * Check if an array is non-empty
 */
export const isNonEmpty = <A>(arr: readonly A[]): arr is NonEmptyList<A> =>
  arr.length > 0;

/**
 * Convert array to Option<NonEmptyList>
 */
export const fromArray = <A>(arr: readonly A[]): Option.Option<NonEmptyList<A>> =>
  isNonEmpty(arr) ? Option.some(arr) : Option.none();

// =============================================================================
// Validation Error Type
// =============================================================================

/**
 * A single validation error with field path and message
 */
export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly code?: string;
  readonly value?: unknown;
}

/**
 * Create a validation error
 */
export const error = (
  field: string,
  message: string,
  code?: string,
  value?: unknown
): ValidationError => ({ field, message, code, value });

// =============================================================================
// Validated Type - Either with accumulated errors
// =============================================================================

/**
 * Validated is an Either that accumulates errors in a NonEmptyList
 */
export type Validated<E, A> = Either.Either<A, NonEmptyList<E>>;

/**
 * Create a valid result
 */
export const valid = <E, A>(value: A): Validated<E, A> =>
  Either.right(value);

/**
 * Create an invalid result with a single error
 */
export const invalid = <E, A = never>(error: E): Validated<E, A> =>
  Either.left(of(error));

/**
 * Create an invalid result with multiple errors
 */
export const invalidAll = <E, A = never>(errors: NonEmptyList<E>): Validated<E, A> =>
  Either.left(errors);

/**
 * Check if valid
 */
export const isValid = <E, A>(v: Validated<E, A>): v is Either.Right<never, A> =>
  Either.isRight(v);

/**
 * Check if invalid
 */
export const isInvalid = <E, A>(
  v: Validated<E, A>
): v is Either.Left<NonEmptyList<E>, never> => Either.isLeft(v);

/**
 * Get the value or throw
 */
export const getOrThrow = <E, A>(v: Validated<E, A>): A => {
  if (Either.isRight(v)) return v.right;
  throw new Error(`Validation failed: ${JSON.stringify(v.left)}`);
};

/**
 * Get the errors or empty array
 */
export const getErrors = <E, A>(v: Validated<E, A>): readonly E[] =>
  Either.isLeft(v) ? v.left : [];

// =============================================================================
// Combining Validations (Applicative)
// =============================================================================

/**
 * Combine two validations, accumulating errors
 */
export const combine = <E, A, B>(
  va: Validated<E, A>,
  vb: Validated<E, B>
): Validated<E, readonly [A, B]> => {
  if (Either.isRight(va) && Either.isRight(vb)) {
    return Either.right([va.right, vb.right] as const);
  }
  if (Either.isLeft(va) && Either.isLeft(vb)) {
    return Either.left(concat(va.left, vb.left));
  }
  if (Either.isLeft(va)) {
    return Either.left(va.left);
  }
  return Either.left((vb as Either.Left<NonEmptyList<E>, never>).left);
};

/**
 * Combine three validations
 */
export const combine3 = <E, A, B, C>(
  va: Validated<E, A>,
  vb: Validated<E, B>,
  vc: Validated<E, C>
): Validated<E, readonly [A, B, C]> =>
  pipe(
    combine(va, vb),
    (vab) => combine(vab, vc),
    Either.map(([[a, b], c]) => [a, b, c] as const)
  );

/**
 * Combine four validations
 */
export const combine4 = <E, A, B, C, D>(
  va: Validated<E, A>,
  vb: Validated<E, B>,
  vc: Validated<E, C>,
  vd: Validated<E, D>
): Validated<E, readonly [A, B, C, D]> =>
  pipe(
    combine3(va, vb, vc),
    (vabc) => combine(vabc, vd),
    Either.map(([[a, b, c], d]) => [a, b, c, d] as const)
  );

/**
 * Combine five validations
 */
export const combine5 = <E, A, B, C, D, F>(
  va: Validated<E, A>,
  vb: Validated<E, B>,
  vc: Validated<E, C>,
  vd: Validated<E, D>,
  ve: Validated<E, F>
): Validated<E, readonly [A, B, C, D, F]> =>
  pipe(
    combine4(va, vb, vc, vd),
    (vabcd) => combine(vabcd, ve),
    Either.map(([[a, b, c, d], e]) => [a, b, c, d, e] as const)
  );

/**
 * Combine an array of validations
 */
export const combineAll = <E, A>(
  validations: readonly Validated<E, A>[]
): Validated<E, readonly A[]> => {
  if (validations.length === 0) {
    return valid([]);
  }

  const errors: E[] = [];
  const values: A[] = [];

  for (const v of validations) {
    if (Either.isLeft(v)) {
      errors.push(...v.left);
    } else {
      values.push(v.right);
    }
  }

  if (isNonEmpty(errors)) {
    return invalidAll(errors);
  }

  return valid(values);
};

/**
 * Map and then combine
 */
export const mapN = <E, A, B, R>(
  va: Validated<E, A>,
  vb: Validated<E, B>,
  f: (a: A, b: B) => R
): Validated<E, R> =>
  pipe(
    combine(va, vb),
    Either.map(([a, b]) => f(a, b))
  );

/**
 * Map 3 validations
 */
export const mapN3 = <E, A, B, C, R>(
  va: Validated<E, A>,
  vb: Validated<E, B>,
  vc: Validated<E, C>,
  f: (a: A, b: B, c: C) => R
): Validated<E, R> =>
  pipe(
    combine3(va, vb, vc),
    Either.map(([a, b, c]) => f(a, b, c))
  );

/**
 * Map 4 validations
 */
export const mapN4 = <E, A, B, C, D, R>(
  va: Validated<E, A>,
  vb: Validated<E, B>,
  vc: Validated<E, C>,
  vd: Validated<E, D>,
  f: (a: A, b: B, c: C, d: D) => R
): Validated<E, R> =>
  pipe(
    combine4(va, vb, vc, vd),
    Either.map(([a, b, c, d]) => f(a, b, c, d))
  );

// =============================================================================
// Validation Combinators
// =============================================================================

/**
 * Create a validator function
 */
export type Validator<A, E = ValidationError> = (value: A) => Validated<E, A>;

/**
 * Validate a value passes a predicate
 */
export const validate = <A>(
  predicate: (a: A) => boolean,
  error: ValidationError
): Validator<A> => (value: A) =>
  predicate(value) ? valid(value) : invalid(error);

/**
 * Chain validators (run second only if first passes)
 */
export const andThen = <A, E>(
  first: Validator<A, E>,
  second: Validator<A, E>
): Validator<A, E> => (value: A) => {
  const result = first(value);
  return Either.isRight(result) ? second(value) : result;
};

/**
 * Run all validators and accumulate errors
 */
export const validateAll = <A, E>(
  validators: readonly Validator<A, E>[]
): Validator<A, E> => (value: A) => {
  const results = validators.map((v) => v(value));
  const errors: E[] = [];

  for (const result of results) {
    if (Either.isLeft(result)) {
      errors.push(...result.left);
    }
  }

  if (isNonEmpty(errors)) {
    return invalidAll(errors);
  }

  return valid(value);
};

// =============================================================================
// Common Validators
// =============================================================================

/**
 * Validate value is not null or undefined
 */
export const required = (field: string): Validator<unknown> => (value) =>
  value != null
    ? valid(value)
    : invalid(error(field, `${field} is required`, 'REQUIRED'));

/**
 * Validate string is not empty
 */
export const nonEmpty = (field: string): Validator<string> => (value) =>
  value.length > 0
    ? valid(value)
    : invalid(error(field, `${field} must not be empty`, 'EMPTY', value));

/**
 * Validate string has minimum length
 */
export const minLength = (field: string, min: number): Validator<string> => (value) =>
  value.length >= min
    ? valid(value)
    : invalid(
        error(field, `${field} must be at least ${min} characters`, 'MIN_LENGTH', value)
      );

/**
 * Validate string has maximum length
 */
export const maxLength = (field: string, max: number): Validator<string> => (value) =>
  value.length <= max
    ? valid(value)
    : invalid(
        error(field, `${field} must be at most ${max} characters`, 'MAX_LENGTH', value)
      );

/**
 * Validate string matches pattern
 */
export const pattern = (
  field: string,
  regex: RegExp,
  message?: string
): Validator<string> => (value) =>
  regex.test(value)
    ? valid(value)
    : invalid(
        error(field, message ?? `${field} has invalid format`, 'PATTERN', value)
      );

/**
 * Validate email format
 */
export const email = (field: string): Validator<string> =>
  pattern(field, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, `${field} must be a valid email`);

/**
 * Validate number is positive
 */
export const positive = (field: string): Validator<number> => (value) =>
  value > 0
    ? valid(value)
    : invalid(error(field, `${field} must be positive`, 'POSITIVE', value));

/**
 * Validate number is non-negative
 */
export const nonNegative = (field: string): Validator<number> => (value) =>
  value >= 0
    ? valid(value)
    : invalid(error(field, `${field} must be non-negative`, 'NON_NEGATIVE', value));

/**
 * Validate number is within range
 */
export const range = (field: string, min: number, max: number): Validator<number> => (value) =>
  value >= min && value <= max
    ? valid(value)
    : invalid(
        error(field, `${field} must be between ${min} and ${max}`, 'RANGE', value)
      );

/**
 * Validate array is not empty
 */
export const nonEmptyArray = <A>(field: string): Validator<readonly A[]> => (value) =>
  value.length > 0
    ? valid(value)
    : invalid(error(field, `${field} must not be empty`, 'EMPTY_ARRAY'));

/**
 * Validate each element in an array
 */
export const eachElement = <A>(
  field: string,
  validator: Validator<A>
): Validator<readonly A[]> => (values) => {
  const results = values.map((value, index) => {
    const result = validator(value);
    if (Either.isLeft(result)) {
      return invalidAll(
        map(result.left, (e) => ({
          ...e,
          field: `${field}[${index}].${e.field}`,
        }))
      );
    }
    return result;
  });

  return combineAll(results);
};

// =============================================================================
// Form Validation Builder
// =============================================================================

/**
 * Schema for validating an object with typed fields
 */
export type ValidationSchema<T> = {
  readonly [K in keyof T]?: readonly Validator<T[K]>[];
};

/**
 * Validate an object against a schema
 */
export const validateObject = <T extends Record<string, unknown>>(
  schema: ValidationSchema<T>
) => (obj: T): Validated<ValidationError, T> => {
  const errors: ValidationError[] = [];

  for (const key of Object.keys(schema) as Array<keyof T>) {
    const validators = schema[key];
    if (!validators) continue;

    const value = obj[key];
    const validator = validateAll(validators as readonly Validator<T[keyof T], ValidationError>[]);
    const result = validator(value);

    if (Either.isLeft(result)) {
      errors.push(...result.left);
    }
  }

  if (isNonEmpty(errors)) {
    return invalidAll(errors);
  }

  return valid(obj);
};
