/**
 * route:list command - Display all registered routes
 */
import * as _React from 'react';
import { render } from 'ink';
import { RouteList, type RouteInfo } from '../components/RouteList.js';

// React is needed at runtime for JSX
void _React;

export interface RouteListOptions {
  json?: boolean;
  path?: string;
  method?: string;
}

/**
 * Discover routes from a Gello application
 *
 * In a real implementation, this would:
 * 1. Load the app's route configuration
 * 2. Parse the route definitions
 * 3. Return the route info
 */
export const discoverRoutes = async (appPath?: string): Promise<RouteInfo[]> => {
  // For now, return sample routes
  // TODO: Implement actual route discovery from app
  return [
    { method: 'GET', path: '/', handler: 'apiInfo' },
    { method: 'GET', path: '/health', handler: 'healthCheck' },
    { method: 'GET', path: '/todos', handler: 'listTodos' },
    { method: 'GET', path: '/todos/:id', handler: 'getTodoById' },
    { method: 'POST', path: '/todos', handler: 'createTodoRoute' },
    { method: 'PATCH', path: '/todos/:id', handler: 'updateTodoRoute' },
    { method: 'DELETE', path: '/todos/:id', handler: 'deleteTodoRoute' },
    { method: 'POST', path: '/todos/:id/toggle', handler: 'toggleTodoRoute' },
    { method: 'DELETE', path: '/todos', handler: 'deleteCompletedRoute' },
  ];
};

/**
 * Filter routes by method and/or path pattern
 */
const filterRoutes = (
  routes: RouteInfo[],
  options: RouteListOptions
): RouteInfo[] => {
  let filtered = routes;

  if (options.method) {
    const method = options.method.toUpperCase();
    filtered = filtered.filter((r) => r.method === method);
  }

  if (options.path) {
    const pattern = options.path.toLowerCase();
    filtered = filtered.filter((r) => r.path.toLowerCase().includes(pattern));
  }

  return filtered;
};

/**
 * Execute the route:list command
 */
export const routeListCommand = async (options: RouteListOptions = {}) => {
  const routes = await discoverRoutes();
  const filtered = filterRoutes(routes, options);

  if (options.json) {
    // Machine-readable JSON output
    console.log(JSON.stringify(filtered, null, 2));
    return;
  }

  // Beautiful TUI output
  const { waitUntilExit } = render(
    <RouteList routes={filtered} appName="Todo API" />
  );

  await waitUntilExit();
};

export default routeListCommand;
