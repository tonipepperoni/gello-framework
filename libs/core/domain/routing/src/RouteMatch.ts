/**
 * Route matching logic
 */

import { Option } from "effect";
import type { HttpMethod, RouteDefinition } from "@gello/core-contracts";
import { parsePath, matchPath, extractPath, type PathPattern } from "./PathPattern.js";

// ─── Route Match Result ───────────────────────────────────────
export interface RouteMatch<R = never> {
  readonly route: RouteDefinition<R>;
  readonly params: Record<string, string>;
  readonly pattern: PathPattern;
}

// ─── Compiled Route ───────────────────────────────────────────
export interface CompiledRoute<R = never> {
  readonly route: RouteDefinition<R>;
  readonly pattern: PathPattern;
}

/**
 * Compile routes for faster matching
 */
export const compileRoutes = <R>(
  routes: readonly RouteDefinition<R>[]
): readonly CompiledRoute<R>[] =>
  routes.map((route) => ({
    route,
    pattern: parsePath(route.path),
  }));

/**
 * Find a matching route for a given method and path
 */
export const matchRoute = <R>(
  compiledRoutes: readonly CompiledRoute<R>[],
  method: HttpMethod,
  path: string
): Option.Option<RouteMatch<R>> => {
  const normalizedPath = extractPath(path);

  for (const compiled of compiledRoutes) {
    // Check method first (fast)
    if (compiled.route.method !== method) {
      continue;
    }

    // Check path pattern
    const result = matchPath(compiled.pattern, normalizedPath);
    if (result.matches) {
      return Option.some({
        route: compiled.route,
        params: result.params,
        pattern: compiled.pattern,
      });
    }
  }

  return Option.none();
};

/**
 * Find a matching route from raw routes (compiles on the fly)
 */
export const findRoute = <R>(
  routes: readonly RouteDefinition<R>[],
  method: HttpMethod,
  path: string
): Option.Option<RouteMatch<R>> => {
  const compiled = compileRoutes(routes);
  return matchRoute(compiled, method, path);
};

/**
 * Check if any route matches the path (regardless of method)
 * Useful for 405 Method Not Allowed responses
 */
export const hasRouteForPath = <R>(
  routes: readonly RouteDefinition<R>[],
  path: string
): boolean => {
  const normalizedPath = extractPath(path);

  for (const route of routes) {
    const pattern = parsePath(route.path);
    const result = matchPath(pattern, normalizedPath);
    if (result.matches) {
      return true;
    }
  }

  return false;
};

/**
 * Get allowed methods for a path
 */
export const getAllowedMethods = <R>(
  routes: readonly RouteDefinition<R>[],
  path: string
): readonly HttpMethod[] => {
  const normalizedPath = extractPath(path);
  const methods: HttpMethod[] = [];

  for (const route of routes) {
    const pattern = parsePath(route.path);
    const result = matchPath(pattern, normalizedPath);
    if (result.matches && !methods.includes(route.method)) {
      methods.push(route.method);
    }
  }

  return methods;
};
