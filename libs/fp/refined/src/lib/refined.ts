/**
 * Refined Types Library
 *
 * Compile-time and runtime validated types using Effect's Brand and Schema.
 * Inspired by refined (Scala) and io-ts-types.
 */
import { Brand, Schema, Either, pipe, ParseResult } from 'effect';

// =============================================================================
// Core Refined Type Infrastructure
// =============================================================================

/**
 * A refined type is a branded type with a schema for validation
 */
export interface RefinedType<A, BrandKey extends string> {
  readonly brandKey: BrandKey;
  readonly schema: Schema.Schema<A & Brand.Brand<BrandKey>, A>;
  readonly make: (value: A) => Either.Either<A & Brand.Brand<BrandKey>, ParseResult.ParseError>;
  readonly unsafeMake: (value: A) => A & Brand.Brand<BrandKey>;
  readonly is: (value: unknown) => value is A & Brand.Brand<BrandKey>;
}

/**
 * Create a refined type with a predicate
 */
export const refined = <A, const BrandKey extends string>(
  base: Schema.Schema<A, A>,
  brandKey: BrandKey,
  predicate: (a: A) => boolean,
  message: () => string
): RefinedType<A, BrandKey> => {
  type Branded = A & Brand.Brand<BrandKey>;

  const schema = pipe(
    base,
    Schema.filter(predicate, { message }),
    Schema.brand(brandKey)
  ) as unknown as Schema.Schema<Branded, A>;

  const make = (value: A): Either.Either<Branded, ParseResult.ParseError> =>
    Schema.decodeEither(schema)(value);

  const unsafeMake = (value: A): Branded =>
    Schema.decodeSync(schema)(value);

  const is = (value: unknown): value is Branded => {
    try {
      Schema.decodeSync(base)(value as A);
      return predicate(value as A);
    } catch {
      return false;
    }
  };

  return {
    brandKey,
    schema,
    make,
    unsafeMake,
    is,
  };
};

// =============================================================================
// String Refined Types
// =============================================================================

/**
 * Non-empty string - a string with at least one character
 */
export const NonEmptyString = refined(
  Schema.String,
  'NonEmptyString',
  (s) => s.length > 0,
  () => 'String must not be empty'
);
export type NonEmptyString = Schema.Schema.Type<typeof NonEmptyString.schema>;

/**
 * Trimmed string - a string with no leading/trailing whitespace
 */
export const TrimmedString = refined(
  Schema.String,
  'TrimmedString',
  (s) => s === s.trim(),
  () => 'String must not have leading or trailing whitespace'
);
export type TrimmedString = Schema.Schema.Type<typeof TrimmedString.schema>;

/**
 * Create a bounded string type with min and max length
 */
export const boundedString = <const Min extends number, const Max extends number>(
  min: Min,
  max: Max,
  brandKey: `BoundedString_${Min}_${Max}` = `BoundedString_${min}_${max}` as `BoundedString_${Min}_${Max}`
) =>
  refined(
    Schema.String,
    brandKey,
    (s) => s.length >= min && s.length <= max,
    () => `String length must be between ${min} and ${max}`
  );

/**
 * Create a min length string type
 */
export const minLengthString = <const Min extends number>(
  min: Min,
  brandKey: `MinLengthString_${Min}` = `MinLengthString_${min}` as `MinLengthString_${Min}`
) =>
  refined(
    Schema.String,
    brandKey,
    (s) => s.length >= min,
    () => `String length must be at least ${min}`
  );

/**
 * Create a max length string type
 */
export const maxLengthString = <const Max extends number>(
  max: Max,
  brandKey: `MaxLengthString_${Max}` = `MaxLengthString_${max}` as `MaxLengthString_${Max}`
) =>
  refined(
    Schema.String,
    brandKey,
    (s) => s.length <= max,
    () => `String length must be at most ${max}`
  );

// =============================================================================
// Number Refined Types
// =============================================================================

/**
 * Positive integer (> 0)
 */
export const PositiveInt = refined(
  Schema.Number,
  'PositiveInt',
  (n) => Number.isInteger(n) && n > 0,
  () => 'Value must be a positive integer'
);
export type PositiveInt = Schema.Schema.Type<typeof PositiveInt.schema>;

/**
 * Non-negative integer (>= 0)
 */
export const NonNegativeInt = refined(
  Schema.Number,
  'NonNegativeInt',
  (n) => Number.isInteger(n) && n >= 0,
  () => 'Value must be a non-negative integer'
);
export type NonNegativeInt = Schema.Schema.Type<typeof NonNegativeInt.schema>;

/**
 * Positive number (> 0, can be floating point)
 */
export const PositiveNumber = refined(
  Schema.Number,
  'PositiveNumber',
  (n) => n > 0,
  () => 'Value must be positive'
);
export type PositiveNumber = Schema.Schema.Type<typeof PositiveNumber.schema>;

/**
 * Non-negative number (>= 0, can be floating point)
 */
export const NonNegativeNumber = refined(
  Schema.Number,
  'NonNegativeNumber',
  (n) => n >= 0,
  () => 'Value must be non-negative'
);
export type NonNegativeNumber = Schema.Schema.Type<typeof NonNegativeNumber.schema>;

/**
 * Create a bounded integer type
 */
export const boundedInt = <const Min extends number, const Max extends number>(
  min: Min,
  max: Max,
  brandKey: `BoundedInt_${Min}_${Max}` = `BoundedInt_${min}_${max}` as `BoundedInt_${Min}_${Max}`
) =>
  refined(
    Schema.Number,
    brandKey,
    (n) => Number.isInteger(n) && n >= min && n <= max,
    () => `Integer must be between ${min} and ${max}`
  );

/**
 * Percentage (0-100)
 */
export const Percentage = boundedInt(0, 100, 'BoundedInt_0_100');
export type Percentage = Schema.Schema.Type<typeof Percentage.schema>;

// =============================================================================
// Common Format Refined Types
// =============================================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valid email address
 */
export const Email = refined(
  Schema.String,
  'Email',
  (s) => EMAIL_REGEX.test(s),
  () => 'Invalid email format'
);
export type Email = Schema.Schema.Type<typeof Email.schema>;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Valid UUID v1-5
 */
export const UUID = refined(
  Schema.String,
  'UUID',
  (s) => UUID_REGEX.test(s),
  () => 'Invalid UUID format'
);
export type UUID = Schema.Schema.Type<typeof UUID.schema>;

const URL_REGEX = /^https?:\/\/.+/;

/**
 * Valid URL (http or https)
 */
export const Url = refined(
  Schema.String,
  'Url',
  (s) => URL_REGEX.test(s),
  () => 'Invalid URL format'
);
export type Url = Schema.Schema.Type<typeof Url.schema>;

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * URL-safe slug (lowercase alphanumeric with hyphens)
 */
export const Slug = refined(
  Schema.String,
  'Slug',
  (s) => SLUG_REGEX.test(s),
  () => 'Invalid slug format'
);
export type Slug = Schema.Schema.Type<typeof Slug.schema>;

// =============================================================================
// Collection Refined Types
// =============================================================================

/**
 * Non-empty array type
 */
export type NonEmptyArray<A> = readonly [A, ...A[]];

/**
 * Check if array is non-empty (type guard)
 */
export const isNonEmptyArray = <A>(arr: readonly A[]): arr is NonEmptyArray<A> =>
  arr.length > 0;

/**
 * Create a non-empty array schema
 */
export const nonEmptyArraySchema = <A, I, R>(
  itemSchema: Schema.Schema<A, I, R>
) => Schema.NonEmptyArray(itemSchema);

/**
 * Create a bounded array schema
 */
export const boundedArraySchema = <A, I, R>(
  itemSchema: Schema.Schema<A, I, R>,
  min: number,
  max: number
): Schema.Schema<readonly A[], readonly I[], R> =>
  pipe(
    Schema.Array(itemSchema),
    Schema.filter(
      (arr) => arr.length >= min && arr.length <= max,
      { message: () => `Array length must be between ${min} and ${max}` }
    )
  );

// =============================================================================
// Date/Time Refined Types
// =============================================================================

/**
 * Timestamp in milliseconds (number-based, not Date)
 */
export const Timestamp = refined(
  Schema.Number,
  'Timestamp',
  (n) => Number.isInteger(n) && n > 0,
  () => 'Value must be a valid timestamp'
);
export type Timestamp = Schema.Schema.Type<typeof Timestamp.schema>;

/**
 * Future timestamp (after now)
 */
export const FutureTimestamp = refined(
  Schema.Number,
  'FutureTimestamp',
  (n) => Number.isInteger(n) && n > Date.now(),
  () => 'Timestamp must be in the future'
);
export type FutureTimestamp = Schema.Schema.Type<typeof FutureTimestamp.schema>;

/**
 * Past timestamp (before now)
 */
export const PastTimestamp = refined(
  Schema.Number,
  'PastTimestamp',
  (n) => Number.isInteger(n) && n < Date.now(),
  () => 'Timestamp must be in the past'
);
export type PastTimestamp = Schema.Schema.Type<typeof PastTimestamp.schema>;

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Combine multiple predicates with AND
 */
export const and =
  <A>(...predicates: Array<(a: A) => boolean>) =>
  (a: A): boolean =>
    predicates.every((p) => p(a));

/**
 * Combine multiple predicates with OR
 */
export const or =
  <A>(...predicates: Array<(a: A) => boolean>) =>
  (a: A): boolean =>
    predicates.some((p) => p(a));

/**
 * Negate a predicate
 */
export const not =
  <A>(predicate: (a: A) => boolean) =>
  (a: A): boolean =>
    !predicate(a);
