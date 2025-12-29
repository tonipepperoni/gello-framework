import type { PageTree } from 'fumadocs-core/server';

// Manual page tree since we're not using MDX content source
export const pageTree: PageTree.Root = {
  name: 'Docs',
  children: [
    {
      type: 'folder',
      name: 'Getting Started',
      children: [
        { type: 'page', name: 'Introduction', url: '/docs' },
        { type: 'page', name: 'Installation', url: '/docs/installation' },
        { type: 'page', name: 'Directory Structure', url: '/docs/directory-structure' },
        { type: 'page', name: 'Configuration', url: '/docs/configuration' },
      ],
    },
    {
      type: 'folder',
      name: 'Core Concepts',
      children: [
        { type: 'page', name: 'HTTP Server', url: '/docs/http' },
        { type: 'page', name: 'Routing', url: '/docs/routing' },
        { type: 'page', name: 'Middleware', url: '/docs/middleware' },
        { type: 'page', name: 'Dependency Injection', url: '/docs/dependency-injection' },
        { type: 'page', name: 'Validation', url: '/docs/validation' },
        { type: 'page', name: 'Error Handling', url: '/docs/error-handling' },
      ],
    },
    {
      type: 'folder',
      name: 'Database',
      children: [
        { type: 'page', name: 'Getting Started', url: '/docs/database' },
      ],
    },
    {
      type: 'folder',
      name: 'Caching',
      children: [
        { type: 'page', name: 'Introduction', url: '/docs/caching' },
      ],
    },
    {
      type: 'folder',
      name: 'Queues',
      children: [
        { type: 'page', name: 'Introduction', url: '/docs/queues' },
      ],
    },
    {
      type: 'folder',
      name: 'Observability',
      children: [
        { type: 'page', name: 'Logger', url: '/docs/logger' },
      ],
    },
    {
      type: 'folder',
      name: 'Utilities',
      children: [
        { type: 'page', name: 'Time', url: '/docs/time' },
      ],
    },
    {
      type: 'folder',
      name: 'CLI',
      children: [
        { type: 'page', name: 'Commands', url: '/docs/cli' },
      ],
    },
  ],
};
