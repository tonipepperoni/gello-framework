import type { ReactNode } from 'react';
import { createRootRoute, Outlet, HeadContent, Scripts } from '@tanstack/react-router';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import '../styles/app.css';

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Gello - FP-Core Backend Framework' },
      { name: 'description', content: 'Non-modular, purely functional backend development with Effect. Context.Tag + Layer, @effect/platform HTTP, type-safe everything.' },
      { property: 'og:title', content: 'Gello - FP-Core Backend Framework' },
      { property: 'og:description', content: 'Non-modular, purely functional backend development with Effect.' },
      { property: 'og:url', content: 'https://gello.net' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg' },
      { rel: 'canonical', href: 'https://gello.net' },
    ],
  }),
});

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}
