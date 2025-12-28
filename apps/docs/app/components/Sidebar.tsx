import { Link, useLocation } from '@tanstack/react-router';
import clsx from 'clsx';

interface NavItem {
  title: string;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Configuration', href: '/docs/configuration' },
      { title: 'Directory Structure', href: '/docs/directory-structure' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'HTTP Server', href: '/docs/http' },
      { title: 'Routing', href: '/docs/routing' },
      { title: 'Middleware', href: '/docs/middleware' },
      { title: 'Dependency Injection', href: '/docs/dependency-injection' },
      { title: 'Validation', href: '/docs/validation' },
      { title: 'Error Handling', href: '/docs/error-handling' },
    ],
  },
  {
    title: 'Database',
    items: [
      { title: 'Introduction', href: '/docs/database' },
      { title: 'Drizzle ORM', href: '/docs/drizzle' },
      { title: 'Migrations', href: '/docs/migrations' },
      { title: 'Repositories', href: '/docs/repositories' },
    ],
  },
  {
    title: 'Queues',
    items: [
      { title: 'Introduction', href: '/docs/queues' },
      { title: 'Creating Jobs', href: '/docs/jobs' },
      { title: 'Workers', href: '/docs/workers' },
      { title: 'Drivers', href: '/docs/queue-drivers' },
    ],
  },
  {
    title: 'CLI',
    items: [
      { title: 'Introduction', href: '/docs/cli' },
      { title: 'Commands', href: '/docs/commands' },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-800 overflow-y-auto h-[calc(100vh-4rem)] sticky top-16">
      <nav className="p-4 space-y-6">
        {navigation.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={clsx(
                      'block px-3 py-2 text-sm rounded-lg transition-colors',
                      currentPath === item.href
                        ? 'bg-violet-500/10 text-violet-400 font-medium'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
