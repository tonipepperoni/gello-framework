import type { PageTree } from 'fumadocs-core/server';

// Page tree for sidebar navigation
export const pageTree: PageTree.Root = {
  name: 'Documentation',
  children: [
    { type: 'page', name: 'Introduction', url: '/docs' },
    { type: 'page', name: 'Installation', url: '/docs/installation' },
    {
      type: 'separator',
      name: 'Getting Started',
    },
    { type: 'page', name: 'Your First App', url: '/docs/first-app' },
    { type: 'page', name: 'Configuration', url: '/docs/configuration' },
    { type: 'page', name: 'Directory Structure', url: '/docs/directory-structure' },
    {
      type: 'separator',
      name: 'The Basics',
    },
    { type: 'page', name: 'Routing', url: '/docs/routing' },
    { type: 'page', name: 'Middleware', url: '/docs/middleware' },
    { type: 'page', name: 'Requests', url: '/docs/requests' },
    { type: 'page', name: 'Responses', url: '/docs/responses' },
    { type: 'page', name: 'Validation', url: '/docs/validation' },
    { type: 'page', name: 'Error Handling', url: '/docs/error-handling' },
    {
      type: 'separator',
      name: 'Security',
    },
    { type: 'page', name: 'Authentication', url: '/docs/authentication' },
    { type: 'page', name: 'Authorization', url: '/docs/authorization' },
    { type: 'page', name: 'OAuth', url: '/docs/oauth' },
    {
      type: 'separator',
      name: 'Database',
    },
    { type: 'page', name: 'Getting Started', url: '/docs/database' },
    {
      type: 'separator',
      name: 'Features',
    },
    { type: 'page', name: 'Caching', url: '/docs/caching' },
    { type: 'page', name: 'Mail', url: '/docs/mail' },
    { type: 'page', name: 'Queues', url: '/docs/queues' },
    { type: 'page', name: 'Storage', url: '/docs/storage' },
    { type: 'page', name: 'Logging', url: '/docs/logging' },
    {
      type: 'separator',
      name: 'Testing',
    },
    { type: 'page', name: 'Getting Started', url: '/docs/testing' },
    {
      type: 'separator',
      name: 'Advanced',
    },
    { type: 'page', name: 'Effect Primer', url: '/docs/effect-primer' },
    { type: 'page', name: 'Services & Layers', url: '/docs/services' },
    { type: 'page', name: 'CLI', url: '/docs/cli' },
  ],
};

// Map slug to page info
export interface PageInfo {
  title: string;
  description?: string;
  slug: string;
}

// Get all page slugs for static generation
export function getPageSlugs(): string[] {
  return pageTree.children
    .filter((item): item is PageTree.Item & { type: 'page' } => item.type === 'page')
    .map((item) => {
      const slug = item.url.replace('/docs/', '').replace('/docs', '');
      return slug || 'index';
    });
}

// Get all pages (flatten tree, exclude separators)
export function getPages(): Array<{ name: string; url: string }> {
  return pageTree.children
    .filter((item): item is PageTree.Item & { type: 'page' } => item.type === 'page')
    .map((item) => ({ name: item.name, url: item.url }));
}

// Get prev/next pages for navigation
export function getPageNavigation(currentUrl: string): {
  previous?: { name: string; url: string };
  next?: { name: string; url: string };
} {
  const pages = getPages();
  const currentIndex = pages.findIndex((p) => p.url === currentUrl);

  if (currentIndex === -1) return {};

  return {
    previous: currentIndex > 0 ? pages[currentIndex - 1] : undefined,
    next: currentIndex < pages.length - 1 ? pages[currentIndex + 1] : undefined,
  };
}

// Get page title from URL
export function getPageTitle(url: string): string {
  const page = pageTree.children.find(
    (item): item is PageTree.Item & { type: 'page' } =>
      item.type === 'page' && item.url === url
  );
  return page?.name ?? 'Documentation';
}
