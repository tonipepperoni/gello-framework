import { describe, it, expect } from 'vitest';
import { Effect, Option } from 'effect';
import { QueryParams } from '@gello/core-contracts';
import {
  getQuery,
  getQueryRequired,
  getQueryWithDefault,
  getQueryAsNumber,
  getQueryAsBoolean,
  getQueryAll,
  getAllQueries,
  getPagination,
} from './QueryParams.js';

describe('QueryParams', () => {
  const createParams = (params: Record<string, string | string[]>) => {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.set(key, value);
      }
    }
    return searchParams;
  };

  const runWithQuery = <A, E>(
    effect: Effect.Effect<A, E, QueryParams>,
    params: Record<string, string | string[]>
  ) =>
    Effect.runPromise(
      Effect.provideService(effect, QueryParams, createParams(params))
    );

  const runWithQueryExit = <A, E>(
    effect: Effect.Effect<A, E, QueryParams>,
    params: Record<string, string | string[]>
  ) =>
    Effect.runPromiseExit(
      Effect.provideService(effect, QueryParams, createParams(params))
    );

  describe('getQuery', () => {
    it('should return Some for existing query param', async () => {
      const result = await runWithQuery(getQuery('page'), { page: '1' });
      expect(Option.isSome(result)).toBe(true);
      expect(Option.getOrNull(result)).toBe('1');
    });

    it('should return None for missing query param', async () => {
      const result = await runWithQuery(getQuery('page'), {});
      expect(Option.isNone(result)).toBe(true);
    });
  });

  describe('getQueryRequired', () => {
    it('should return value for existing query param', async () => {
      const result = await runWithQuery(getQueryRequired('page'), { page: '1' });
      expect(result).toBe('1');
    });

    it('should fail for missing query param', async () => {
      const exit = await runWithQueryExit(getQueryRequired('page'), {});
      expect(exit._tag).toBe('Failure');
    });
  });

  describe('getQueryWithDefault', () => {
    it('should return value when present', async () => {
      const result = await runWithQuery(getQueryWithDefault('page', '1'), {
        page: '5',
      });
      expect(result).toBe('5');
    });

    it('should return default when missing', async () => {
      const result = await runWithQuery(getQueryWithDefault('page', '1'), {});
      expect(result).toBe('1');
    });
  });

  describe('getQueryAsNumber', () => {
    it('should parse valid number', async () => {
      const result = await runWithQuery(getQueryAsNumber('page'), { page: '42' });
      expect(Option.isSome(result)).toBe(true);
      expect(Option.getOrNull(result)).toBe(42);
    });

    it('should return None for missing param', async () => {
      const result = await runWithQuery(getQueryAsNumber('page'), {});
      expect(Option.isNone(result)).toBe(true);
    });

    it('should fail for invalid number', async () => {
      const exit = await runWithQueryExit(getQueryAsNumber('page'), {
        page: 'not-a-number',
      });
      expect(exit._tag).toBe('Failure');
    });
  });

  describe('getQueryAsBoolean', () => {
    it('should parse "true"', async () => {
      const result = await runWithQuery(getQueryAsBoolean('active'), {
        active: 'true',
      });
      expect(Option.getOrElse(result, () => false)).toBe(true);
    });

    it('should parse "1"', async () => {
      const result = await runWithQuery(getQueryAsBoolean('active'), {
        active: '1',
      });
      expect(Option.getOrElse(result, () => false)).toBe(true);
    });

    it('should parse "yes"', async () => {
      const result = await runWithQuery(getQueryAsBoolean('active'), {
        active: 'yes',
      });
      expect(Option.getOrElse(result, () => false)).toBe(true);
    });

    it('should parse "false" as false', async () => {
      const result = await runWithQuery(getQueryAsBoolean('active'), {
        active: 'false',
      });
      expect(Option.getOrElse(result, () => true)).toBe(false);
    });

    it('should return None for missing param', async () => {
      const result = await runWithQuery(getQueryAsBoolean('active'), {});
      expect(Option.isNone(result)).toBe(true);
    });
  });

  describe('getQueryAll', () => {
    it('should return all values for array param', async () => {
      const result = await runWithQuery(getQueryAll('tags'), {
        tags: ['a', 'b', 'c'],
      });
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should return empty array for missing param', async () => {
      const result = await runWithQuery(getQueryAll('tags'), {});
      expect(result).toEqual([]);
    });
  });

  describe('getAllQueries', () => {
    it('should return all query params as record', async () => {
      const result = await runWithQuery(getAllQueries(), {
        page: '1',
        limit: '10',
      });
      expect(result).toEqual({ page: '1', limit: '10' });
    });
  });

  describe('getPagination', () => {
    it('should return default pagination', async () => {
      const result = await runWithQuery(getPagination(), {});
      expect(result).toEqual({ page: 1, limit: 20 });
    });

    it('should parse page and limit', async () => {
      const result = await runWithQuery(getPagination(), {
        page: '2',
        limit: '50',
      });
      expect(result).toEqual({ page: 2, limit: 50 });
    });

    it('should use custom defaults', async () => {
      const result = await runWithQuery(
        getPagination({ defaultPage: 5, defaultLimit: 10 }),
        {}
      );
      expect(result).toEqual({ page: 5, limit: 10 });
    });

    it('should cap limit at maxLimit', async () => {
      const result = await runWithQuery(
        getPagination({ maxLimit: 50 }),
        { limit: '100' }
      );
      expect(result.limit).toBe(50);
    });

    it('should fail for page < 1', async () => {
      const exit = await runWithQueryExit(getPagination(), { page: '0' });
      expect(exit._tag).toBe('Failure');
    });

    it('should fail for limit < 1', async () => {
      const exit = await runWithQueryExit(getPagination(), { limit: '0' });
      expect(exit._tag).toBe('Failure');
    });
  });
});
