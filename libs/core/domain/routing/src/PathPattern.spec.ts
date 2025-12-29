import { describe, it, expect } from 'vitest';
import { parsePath, matchPath, extractPath } from './PathPattern.js';

describe('PathPattern', () => {
  describe('parsePath', () => {
    it('should parse literal path', () => {
      const pattern = parsePath('/users');

      expect(pattern.original).toBe('/users');
      expect(pattern.segments).toHaveLength(1);
      expect(pattern.segments[0]).toEqual({ _tag: 'Literal', value: 'users' });
      expect(pattern.paramNames).toHaveLength(0);
    });

    it('should parse path with single param', () => {
      const pattern = parsePath('/users/:id');

      expect(pattern.original).toBe('/users/:id');
      expect(pattern.segments).toHaveLength(2);
      expect(pattern.segments[0]).toEqual({ _tag: 'Literal', value: 'users' });
      expect(pattern.segments[1]).toEqual({ _tag: 'Param', name: 'id' });
      expect(pattern.paramNames).toEqual(['id']);
    });

    it('should parse path with multiple params', () => {
      const pattern = parsePath('/users/:userId/posts/:postId');

      expect(pattern.segments).toHaveLength(4);
      expect(pattern.segments[1]).toEqual({ _tag: 'Param', name: 'userId' });
      expect(pattern.segments[3]).toEqual({ _tag: 'Param', name: 'postId' });
      expect(pattern.paramNames).toEqual(['userId', 'postId']);
    });

    it('should parse path with wildcard', () => {
      const pattern = parsePath('/files/*');

      expect(pattern.segments).toHaveLength(2);
      expect(pattern.segments[1]).toEqual({ _tag: 'Wildcard' });
    });

    it('should normalize path without leading slash', () => {
      const pattern = parsePath('users/:id');

      expect(pattern.original).toBe('/users/:id');
    });
  });

  describe('matchPath', () => {
    it('should match literal path', () => {
      const pattern = parsePath('/users');
      const result = matchPath(pattern, '/users');

      expect(result.matches).toBe(true);
      expect(result.params).toEqual({});
    });

    it('should match path with param', () => {
      const pattern = parsePath('/users/:id');
      const result = matchPath(pattern, '/users/123');

      expect(result.matches).toBe(true);
      expect(result.params).toEqual({ id: '123' });
    });

    it('should match path with multiple params', () => {
      const pattern = parsePath('/users/:userId/posts/:postId');
      const result = matchPath(pattern, '/users/42/posts/99');

      expect(result.matches).toBe(true);
      expect(result.params).toEqual({ userId: '42', postId: '99' });
    });

    it('should match path with trailing slash', () => {
      const pattern = parsePath('/users/:id');
      const result = matchPath(pattern, '/users/123/');

      expect(result.matches).toBe(true);
      expect(result.params).toEqual({ id: '123' });
    });

    it('should not match different path', () => {
      const pattern = parsePath('/users');
      const result = matchPath(pattern, '/posts');

      expect(result.matches).toBe(false);
      expect(result.params).toEqual({});
    });

    it('should not match path with extra segments', () => {
      const pattern = parsePath('/users/:id');
      const result = matchPath(pattern, '/users/123/extra');

      expect(result.matches).toBe(false);
    });

    it('should not match path with missing segments', () => {
      const pattern = parsePath('/users/:id/posts');
      const result = matchPath(pattern, '/users/123');

      expect(result.matches).toBe(false);
    });

    it('should decode URL-encoded params', () => {
      const pattern = parsePath('/search/:query');
      const result = matchPath(pattern, '/search/hello%20world');

      expect(result.matches).toBe(true);
      expect(result.params).toEqual({ query: 'hello world' });
    });

    it('should be case insensitive', () => {
      const pattern = parsePath('/users/:id');
      const result = matchPath(pattern, '/USERS/123');

      expect(result.matches).toBe(true);
      expect(result.params).toEqual({ id: '123' });
    });
  });

  describe('extractPath', () => {
    it('should extract path from URL', () => {
      expect(extractPath('http://localhost:3000/users/123')).toBe('/users/123');
    });

    it('should extract path from URL with query string', () => {
      expect(extractPath('http://localhost:3000/users?page=1')).toBe('/users');
    });

    it('should extract path from URL with hash', () => {
      expect(extractPath('http://localhost:3000/users#section')).toBe('/users');
    });

    it('should handle relative path', () => {
      expect(extractPath('/users/123?foo=bar')).toBe('/users/123');
    });

    it('should handle path with only query string', () => {
      expect(extractPath('/users?page=1&limit=10')).toBe('/users');
    });
  });
});
