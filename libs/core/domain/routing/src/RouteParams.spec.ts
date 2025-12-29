import { describe, it, expect } from 'vitest';
import { Effect, Option } from 'effect';
import { RouteParams } from '@gello/core-contracts';
import {
  getParam,
  getParamOptional,
  getParamAsNumber,
  getParamAsUUID,
  getAllParams,
} from './RouteParams.js';

describe('RouteParams', () => {
  const runWithParams = <A, E>(
    effect: Effect.Effect<A, E, RouteParams>,
    params: Record<string, string>
  ) => Effect.runPromise(Effect.provideService(effect, RouteParams, params));

  const runWithParamsExit = <A, E>(
    effect: Effect.Effect<A, E, RouteParams>,
    params: Record<string, string>
  ) => Effect.runPromiseExit(Effect.provideService(effect, RouteParams, params));

  describe('getParam', () => {
    it('should get existing param', async () => {
      const result = await runWithParams(getParam('id'), { id: '123' });
      expect(result).toBe('123');
    });

    it('should fail for missing param', async () => {
      const exit = await runWithParamsExit(getParam('id'), {});
      expect(exit._tag).toBe('Failure');
    });

    it('should fail for empty param', async () => {
      const exit = await runWithParamsExit(getParam('id'), { id: '' });
      expect(exit._tag).toBe('Failure');
    });
  });

  describe('getParamOptional', () => {
    it('should return Some for existing param', async () => {
      const result = await runWithParams(getParamOptional('id'), { id: '123' });
      expect(Option.isSome(result)).toBe(true);
      expect(Option.getOrNull(result)).toBe('123');
    });

    it('should return None for missing param', async () => {
      const result = await runWithParams(getParamOptional('id'), {});
      expect(Option.isNone(result)).toBe(true);
    });
  });

  describe('getParamAsNumber', () => {
    it('should parse valid number', async () => {
      const result = await runWithParams(getParamAsNumber('page'), { page: '42' });
      expect(result).toBe(42);
    });

    it('should fail for invalid number', async () => {
      const exit = await runWithParamsExit(getParamAsNumber('page'), {
        page: 'not-a-number',
      });
      expect(exit._tag).toBe('Failure');
    });
  });

  describe('getParamAsUUID', () => {
    it('should accept valid UUID v4', async () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const result = await runWithParams(getParamAsUUID('id'), { id: uuid });
      expect(result).toBe(uuid);
    });

    it('should fail for invalid UUID', async () => {
      const exit = await runWithParamsExit(getParamAsUUID('id'), {
        id: 'not-a-uuid',
      });
      expect(exit._tag).toBe('Failure');
    });

    it('should fail for UUID v1', async () => {
      // UUID v1 has a different format in the version position
      const exit = await runWithParamsExit(getParamAsUUID('id'), {
        id: '550e8400-e29b-11d4-a716-446655440000',
      });
      expect(exit._tag).toBe('Failure');
    });
  });

  describe('getAllParams', () => {
    it('should return all params', async () => {
      const params = { id: '123', name: 'test' };
      const result = await runWithParams(getAllParams(), params);
      expect(result).toEqual(params);
    });

    it('should return empty object when no params', async () => {
      const result = await runWithParams(getAllParams(), {});
      expect(result).toEqual({});
    });
  });
});
