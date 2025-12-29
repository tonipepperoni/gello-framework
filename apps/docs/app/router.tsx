import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // Preload routes on hover to reduce flash
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    // Enable View Transitions API for smooth page transitions
    defaultViewTransition: true,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
