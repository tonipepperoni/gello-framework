import type { PageTree } from 'fumadocs-core/server';

// Page tree aligned with content/docs/meta.json
export const pageTree: PageTree.Root = {
  name: 'Documentation',
  children: [
    { type: 'page', name: 'Introduction', url: '/docs' },
    { type: 'page', name: 'Installation', url: '/docs/installation' },
    {
      type: 'separator',
      name: 'Getting Started',
    },
    { type: 'page', name: 'Configuration', url: '/docs/configuration' },
    { type: 'page', name: 'Directory Structure', url: '/docs/directory-structure' },
    {
      type: 'separator',
      name: 'Core Concepts',
    },
    { type: 'page', name: 'Dependency Injection', url: '/docs/dependency-injection' },
    { type: 'page', name: 'HTTP Server', url: '/docs/http' },
    { type: 'page', name: 'Routing', url: '/docs/routing' },
    { type: 'page', name: 'Middleware', url: '/docs/middleware' },
    { type: 'page', name: 'Validation', url: '/docs/validation' },
    { type: 'page', name: 'Error Handling', url: '/docs/error-handling' },
    {
      type: 'separator',
      name: 'Features',
    },
    { type: 'page', name: 'Database', url: '/docs/database' },
    { type: 'page', name: 'Queues', url: '/docs/queues' },
    { type: 'page', name: 'Caching', url: '/docs/caching' },
    { type: 'page', name: 'Logger', url: '/docs/logger' },
    { type: 'page', name: 'Time Utilities', url: '/docs/time' },
    {
      type: 'separator',
      name: 'Tools',
    },
    { type: 'page', name: 'CLI', url: '/docs/cli' },
  ],
};
