import { describe, it, expect } from 'vitest';
import { Either } from 'effect';
import {
  // NonEmptyList
  of,
  make,
  concat,
  head,
  tail,
  isNonEmpty,
  // Validated
  valid,
  invalid,
  invalidAll,
  isValid,
  isInvalid,
  combine,
  combine3,
  combineAll,
  mapN,
  // Validators
  validate,
  validateAll,
  error,
  required,
  nonEmpty,
  minLength,
  maxLength,
  email,
  positive,
  range,
  type ValidationError,
} from './validation';

describe('NonEmptyList', () => {
  describe('of', () => {
    it('should create a single-element list', () => {
      const nel = of(1);
      expect(nel).toEqual([1]);
    });
  });

  describe('make', () => {
    it('should create a list from head and tail', () => {
      const nel = make(1, 2, 3);
      expect(nel).toEqual([1, 2, 3]);
    });
  });

  describe('concat', () => {
    it('should concatenate two lists', () => {
      const result = concat(make(1, 2), make(3, 4));
      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe('head', () => {
    it('should return the first element', () => {
      expect(head(make(1, 2, 3))).toBe(1);
    });
  });

  describe('tail', () => {
    it('should return the rest of the elements', () => {
      expect(tail(make(1, 2, 3))).toEqual([2, 3]);
    });
  });

  describe('isNonEmpty', () => {
    it('should return true for non-empty arrays', () => {
      expect(isNonEmpty([1])).toBe(true);
    });

    it('should return false for empty arrays', () => {
      expect(isNonEmpty([])).toBe(false);
    });
  });
});

describe('Validated', () => {
  describe('valid/invalid', () => {
    it('should create valid results', () => {
      const result = valid<string, number>(42);
      expect(isValid(result)).toBe(true);
      expect(Either.isRight(result) && result.right).toBe(42);
    });

    it('should create invalid results with single error', () => {
      const result = invalid<string, number>('error');
      expect(isInvalid(result)).toBe(true);
      expect(Either.isLeft(result) && result.left).toEqual(['error']);
    });

    it('should create invalid results with multiple errors', () => {
      const result = invalidAll<string, number>(make('e1', 'e2'));
      expect(isInvalid(result)).toBe(true);
      expect(Either.isLeft(result) && result.left).toEqual(['e1', 'e2']);
    });
  });

  describe('combine', () => {
    it('should combine two valid results', () => {
      const va = valid<string, number>(1);
      const vb = valid<string, string>('a');
      const result = combine(va, vb);
      expect(isValid(result)).toBe(true);
      expect(Either.isRight(result) && result.right).toEqual([1, 'a']);
    });

    it('should accumulate errors from both invalid results', () => {
      const va = invalid<string, number>('e1');
      const vb = invalid<string, string>('e2');
      const result = combine(va, vb);
      expect(isInvalid(result)).toBe(true);
      expect(Either.isLeft(result) && result.left).toEqual(['e1', 'e2']);
    });

    it('should return errors if first is invalid', () => {
      const va = invalid<string, number>('e1');
      const vb = valid<string, string>('a');
      const result = combine(va, vb);
      expect(isInvalid(result)).toBe(true);
      expect(Either.isLeft(result) && result.left).toEqual(['e1']);
    });

    it('should return errors if second is invalid', () => {
      const va = valid<string, number>(1);
      const vb = invalid<string, string>('e2');
      const result = combine(va, vb);
      expect(isInvalid(result)).toBe(true);
      expect(Either.isLeft(result) && result.left).toEqual(['e2']);
    });
  });

  describe('combine3', () => {
    it('should combine three valid results', () => {
      const result = combine3(
        valid<string, number>(1),
        valid<string, string>('a'),
        valid<string, boolean>(true)
      );
      expect(isValid(result)).toBe(true);
      expect(Either.isRight(result) && result.right).toEqual([1, 'a', true]);
    });

    it('should accumulate all errors', () => {
      const result = combine3(
        invalid<string, number>('e1'),
        invalid<string, string>('e2'),
        invalid<string, boolean>('e3')
      );
      expect(isInvalid(result)).toBe(true);
      expect(Either.isLeft(result) && result.left).toEqual(['e1', 'e2', 'e3']);
    });
  });

  describe('combineAll', () => {
    it('should combine array of validations', () => {
      const validations = [
        valid<string, number>(1),
        valid<string, number>(2),
        valid<string, number>(3),
      ];
      const result = combineAll(validations);
      expect(isValid(result)).toBe(true);
      expect(Either.isRight(result) && result.right).toEqual([1, 2, 3]);
    });

    it('should accumulate all errors from array', () => {
      const validations = [
        valid<string, number>(1),
        invalid<string, number>('e1'),
        invalid<string, number>('e2'),
      ];
      const result = combineAll(validations);
      expect(isInvalid(result)).toBe(true);
      expect(Either.isLeft(result) && result.left).toEqual(['e1', 'e2']);
    });

    it('should handle empty array', () => {
      const result = combineAll<string, number>([]);
      expect(isValid(result)).toBe(true);
      expect(Either.isRight(result) && result.right).toEqual([]);
    });
  });

  describe('mapN', () => {
    it('should map over combined validations', () => {
      const result = mapN(
        valid<string, number>(1),
        valid<string, number>(2),
        (a, b) => a + b
      );
      expect(isValid(result)).toBe(true);
      expect(Either.isRight(result) && result.right).toBe(3);
    });
  });
});

describe('Validators', () => {
  describe('validate', () => {
    it('should create a validator from predicate', () => {
      const isPositive = validate<number>(
        (n) => n > 0,
        error('value', 'must be positive')
      );
      expect(isValid(isPositive(1))).toBe(true);
      expect(isInvalid(isPositive(-1))).toBe(true);
    });
  });

  describe('validateAll', () => {
    it('should accumulate errors from multiple validators', () => {
      const validators = [
        minLength('name', 3),
        maxLength('name', 10),
      ];
      const validator = validateAll(validators);

      expect(isValid(validator('hello'))).toBe(true);
      expect(isInvalid(validator('hi'))).toBe(true);
      expect(isInvalid(validator('this is too long'))).toBe(true);
    });
  });

  describe('required', () => {
    it('should pass for non-null values', () => {
      expect(isValid(required('field')(42))).toBe(true);
      expect(isValid(required('field')(''))).toBe(true);
      expect(isValid(required('field')(0))).toBe(true);
    });

    it('should fail for null/undefined', () => {
      expect(isInvalid(required('field')(null))).toBe(true);
      expect(isInvalid(required('field')(undefined))).toBe(true);
    });
  });

  describe('nonEmpty', () => {
    it('should pass for non-empty strings', () => {
      expect(isValid(nonEmpty('field')('hello'))).toBe(true);
    });

    it('should fail for empty strings', () => {
      expect(isInvalid(nonEmpty('field')(''))).toBe(true);
    });
  });

  describe('minLength', () => {
    it('should pass for strings >= min length', () => {
      expect(isValid(minLength('field', 3)('hello'))).toBe(true);
      expect(isValid(minLength('field', 3)('abc'))).toBe(true);
    });

    it('should fail for strings < min length', () => {
      expect(isInvalid(minLength('field', 3)('ab'))).toBe(true);
    });
  });

  describe('maxLength', () => {
    it('should pass for strings <= max length', () => {
      expect(isValid(maxLength('field', 5)('hello'))).toBe(true);
      expect(isValid(maxLength('field', 5)('hi'))).toBe(true);
    });

    it('should fail for strings > max length', () => {
      expect(isInvalid(maxLength('field', 5)('toolong'))).toBe(true);
    });
  });

  describe('email', () => {
    it('should pass for valid emails', () => {
      expect(isValid(email('email')('test@example.com'))).toBe(true);
    });

    it('should fail for invalid emails', () => {
      expect(isInvalid(email('email')('notanemail'))).toBe(true);
      expect(isInvalid(email('email')('missing@domain'))).toBe(true);
    });
  });

  describe('positive', () => {
    it('should pass for positive numbers', () => {
      expect(isValid(positive('value')(1))).toBe(true);
      expect(isValid(positive('value')(0.1))).toBe(true);
    });

    it('should fail for non-positive numbers', () => {
      expect(isInvalid(positive('value')(0))).toBe(true);
      expect(isInvalid(positive('value')(-1))).toBe(true);
    });
  });

  describe('range', () => {
    it('should pass for numbers in range', () => {
      expect(isValid(range('value', 1, 10)(5))).toBe(true);
      expect(isValid(range('value', 1, 10)(1))).toBe(true);
      expect(isValid(range('value', 1, 10)(10))).toBe(true);
    });

    it('should fail for numbers out of range', () => {
      expect(isInvalid(range('value', 1, 10)(0))).toBe(true);
      expect(isInvalid(range('value', 1, 10)(11))).toBe(true);
    });
  });
});

describe('Real-world validation example', () => {
  interface CreateUserInput {
    name: string;
    email: string;
    age: number;
  }

  const validateName = validateAll([
    nonEmpty('name'),
    minLength('name', 2),
    maxLength('name', 50),
  ]);

  const validateEmail = email('email');

  const validateAge = validateAll([
    positive('age'),
    range('age', 1, 150),
  ]);

  const validateCreateUser = (input: CreateUserInput) =>
    mapN(
      validateName(input.name),
      mapN(
        validateEmail(input.email),
        validateAge(input.age),
        (e, a) => ({ email: e, age: a })
      ),
      (name, rest) => ({ name, ...rest })
    );

  it('should validate correct input', () => {
    const input: CreateUserInput = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
    };
    const result = validateCreateUser(input);
    expect(isValid(result)).toBe(true);
  });

  it('should accumulate multiple field errors', () => {
    const input: CreateUserInput = {
      name: '',
      email: 'invalid',
      age: -5,
    };
    const result = validateCreateUser(input);
    expect(isInvalid(result)).toBe(true);

    if (Either.isLeft(result)) {
      const errorFields = result.left.map((e: ValidationError) => e.field);
      expect(errorFields).toContain('name');
      expect(errorFields).toContain('email');
      expect(errorFields).toContain('age');
    }
  });
});
