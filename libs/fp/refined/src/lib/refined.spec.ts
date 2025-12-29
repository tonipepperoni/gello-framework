import { describe, it, expect } from 'vitest';
import { Either } from 'effect';
import {
  NonEmptyString,
  TrimmedString,
  boundedString,
  PositiveInt,
  NonNegativeInt,
  boundedInt,
  Email,
  UUID,
  Url,
  Slug,
  Timestamp,
  isNonEmptyArray,
  and,
  or,
  not,
} from './refined';

describe('refined', () => {
  describe('NonEmptyString', () => {
    it('should accept non-empty strings', () => {
      const result = NonEmptyString.make('hello');
      expect(Either.isRight(result)).toBe(true);
    });

    it('should reject empty strings', () => {
      const result = NonEmptyString.make('');
      expect(Either.isLeft(result)).toBe(true);
    });

    it('should work with unsafeMake for valid input', () => {
      expect(NonEmptyString.unsafeMake('hello')).toBe('hello');
    });

    it('should throw with unsafeMake for invalid input', () => {
      expect(() => NonEmptyString.unsafeMake('')).toThrow();
    });
  });

  describe('TrimmedString', () => {
    it('should accept trimmed strings', () => {
      const result = TrimmedString.make('hello');
      expect(Either.isRight(result)).toBe(true);
    });

    it('should reject strings with leading whitespace', () => {
      const result = TrimmedString.make('  hello');
      expect(Either.isLeft(result)).toBe(true);
    });

    it('should reject strings with trailing whitespace', () => {
      const result = TrimmedString.make('hello  ');
      expect(Either.isLeft(result)).toBe(true);
    });
  });

  describe('boundedString', () => {
    const Title = boundedString(1, 100);

    it('should accept strings within bounds', () => {
      const result = Title.make('Valid Title');
      expect(Either.isRight(result)).toBe(true);
    });

    it('should reject empty strings when min > 0', () => {
      const result = Title.make('');
      expect(Either.isLeft(result)).toBe(true);
    });

    it('should reject strings exceeding max length', () => {
      const result = Title.make('x'.repeat(101));
      expect(Either.isLeft(result)).toBe(true);
    });
  });

  describe('PositiveInt', () => {
    it('should accept positive integers', () => {
      expect(Either.isRight(PositiveInt.make(1))).toBe(true);
      expect(Either.isRight(PositiveInt.make(100))).toBe(true);
    });

    it('should reject zero', () => {
      expect(Either.isLeft(PositiveInt.make(0))).toBe(true);
    });

    it('should reject negative integers', () => {
      expect(Either.isLeft(PositiveInt.make(-1))).toBe(true);
    });

    it('should reject floating point numbers', () => {
      expect(Either.isLeft(PositiveInt.make(1.5))).toBe(true);
    });
  });

  describe('NonNegativeInt', () => {
    it('should accept zero', () => {
      expect(Either.isRight(NonNegativeInt.make(0))).toBe(true);
    });

    it('should accept positive integers', () => {
      expect(Either.isRight(NonNegativeInt.make(1))).toBe(true);
    });

    it('should reject negative integers', () => {
      expect(Either.isLeft(NonNegativeInt.make(-1))).toBe(true);
    });
  });

  describe('boundedInt', () => {
    const Port = boundedInt(1, 65535);

    it('should accept integers within bounds', () => {
      expect(Either.isRight(Port.make(80))).toBe(true);
      expect(Either.isRight(Port.make(443))).toBe(true);
      expect(Either.isRight(Port.make(1))).toBe(true);
      expect(Either.isRight(Port.make(65535))).toBe(true);
    });

    it('should reject integers outside bounds', () => {
      expect(Either.isLeft(Port.make(0))).toBe(true);
      expect(Either.isLeft(Port.make(65536))).toBe(true);
    });
  });

  describe('Email', () => {
    it('should accept valid emails', () => {
      expect(Either.isRight(Email.make('user@example.com'))).toBe(true);
      expect(Either.isRight(Email.make('user.name@domain.co.uk'))).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(Either.isLeft(Email.make('notanemail'))).toBe(true);
      expect(Either.isLeft(Email.make('missing@domain'))).toBe(true);
      expect(Either.isLeft(Email.make('@nodomain.com'))).toBe(true);
    });
  });

  describe('UUID', () => {
    it('should accept valid UUIDs', () => {
      expect(Either.isRight(UUID.make('123e4567-e89b-12d3-a456-426614174000'))).toBe(true);
      expect(Either.isRight(UUID.make('550e8400-e29b-41d4-a716-446655440000'))).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(Either.isLeft(UUID.make('not-a-uuid'))).toBe(true);
      expect(Either.isLeft(UUID.make('123e4567-e89b-12d3-a456'))).toBe(true);
    });
  });

  describe('Url', () => {
    it('should accept valid URLs', () => {
      expect(Either.isRight(Url.make('https://example.com'))).toBe(true);
      expect(Either.isRight(Url.make('http://localhost:3000/path'))).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(Either.isLeft(Url.make('not-a-url'))).toBe(true);
      expect(Either.isLeft(Url.make('ftp://example.com'))).toBe(true);
    });
  });

  describe('Slug', () => {
    it('should accept valid slugs', () => {
      expect(Either.isRight(Slug.make('hello-world'))).toBe(true);
      expect(Either.isRight(Slug.make('my-awesome-post'))).toBe(true);
      expect(Either.isRight(Slug.make('post123'))).toBe(true);
    });

    it('should reject invalid slugs', () => {
      expect(Either.isLeft(Slug.make('Hello-World'))).toBe(true); // uppercase
      expect(Either.isLeft(Slug.make('hello_world'))).toBe(true); // underscore
      expect(Either.isLeft(Slug.make('-hello'))).toBe(true); // leading hyphen
    });
  });

  describe('Timestamp', () => {
    it('should accept valid timestamps', () => {
      expect(Either.isRight(Timestamp.make(Date.now()))).toBe(true);
      expect(Either.isRight(Timestamp.make(1000000000000))).toBe(true);
    });

    it('should reject zero', () => {
      expect(Either.isLeft(Timestamp.make(0))).toBe(true);
    });

    it('should reject negative values', () => {
      expect(Either.isLeft(Timestamp.make(-1))).toBe(true);
    });

    it('should reject floating point values', () => {
      expect(Either.isLeft(Timestamp.make(1000.5))).toBe(true);
    });
  });

  describe('isNonEmptyArray', () => {
    it('should return true for non-empty arrays', () => {
      expect(isNonEmptyArray([1])).toBe(true);
      expect(isNonEmptyArray([1, 2, 3])).toBe(true);
    });

    it('should return false for empty arrays', () => {
      expect(isNonEmptyArray([])).toBe(false);
    });
  });

  describe('predicate combinators', () => {
    const isPositive = (n: number) => n > 0;
    const isEven = (n: number) => n % 2 === 0;
    const isLessThan10 = (n: number) => n < 10;

    describe('and', () => {
      it('should combine predicates with AND logic', () => {
        const isPositiveAndEven = and(isPositive, isEven);
        expect(isPositiveAndEven(4)).toBe(true);
        expect(isPositiveAndEven(-4)).toBe(false);
        expect(isPositiveAndEven(3)).toBe(false);
      });
    });

    describe('or', () => {
      it('should combine predicates with OR logic', () => {
        const isPositiveOrEven = or(isPositive, isEven);
        expect(isPositiveOrEven(4)).toBe(true);
        expect(isPositiveOrEven(-4)).toBe(true);
        expect(isPositiveOrEven(-3)).toBe(false);
      });
    });

    describe('not', () => {
      it('should negate a predicate', () => {
        const isNotPositive = not(isPositive);
        expect(isNotPositive(-1)).toBe(true);
        expect(isNotPositive(1)).toBe(false);
      });
    });

    it('should compose complex predicates', () => {
      const isPositiveEvenUnder10 = and(isPositive, isEven, isLessThan10);
      expect(isPositiveEvenUnder10(4)).toBe(true);
      expect(isPositiveEvenUnder10(12)).toBe(false);
    });
  });
});
