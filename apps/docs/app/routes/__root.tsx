import type { ReactNode } from 'react';
import { createRootRoute, Link, Outlet, HeadContent, Scripts } from '@tanstack/react-router';
import '../styles/global.css';

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Gello - Effect-Powered Backend Framework' },
      { name: 'description', content: 'A sophisticated TypeScript backend framework powered by Effect. Express-like HTTP, Laravel-like DI, Drizzle ORM, and more.' },
    ],
    links: [{ rel: 'icon', href: '/favicon.svg' }],
  }),
});

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <RootDocument>
      <header className="border-b border-zinc-800 sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-50">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <img src="/logo.svg" alt="Gello" className="w-8 h-8" />
            <span>Gello</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/docs" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Documentation
            </Link>
            <a
              href="https://github.com/gello/gello"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </nav>
      </header>
      <Outlet />
    </RootDocument>
  );
}
