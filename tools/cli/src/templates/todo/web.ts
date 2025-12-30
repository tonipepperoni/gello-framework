/**
 * TODO Template - Web Frontend Files (TanStack Router)
 *
 * Generates a modern React SPA with:
 * - TanStack Router for file-based routing
 * - Sidebar layout with Gruvbox theme
 * - Tailwind CSS styling
 * - shadcn-inspired components
 * - Auth forms when authentication is enabled
 */
import type { TemplateContext, GeneratedFiles } from '../types.js';

export function generateWebFiles(context: TemplateContext): GeneratedFiles {
  const files = new Map<string, string>();

  // ============================================================================
  // Project Configuration
  // ============================================================================
  files.set('apps/web/package.json', generatePackageJson(context));
  files.set('apps/web/tsconfig.json', generateTsConfig(context));
  files.set('apps/web/vite.config.ts', generateViteConfig(context));
  files.set('apps/web/tailwind.config.ts', generateTailwindConfig(context));
  files.set('apps/web/postcss.config.js', generatePostCssConfig(context));
  files.set('apps/web/index.html', generateIndexHtml(context));

  // ============================================================================
  // App Entry & Root
  // ============================================================================
  files.set('apps/web/src/main.tsx', generateMain(context));
  files.set('apps/web/src/styles/globals.css', generateGlobalStyles(context));

  // ============================================================================
  // TanStack Router Setup
  // ============================================================================
  files.set('apps/web/src/routeTree.gen.ts', generateRouteTree(context));
  files.set('apps/web/src/routes/__root.tsx', generateRootRoute(context));
  files.set('apps/web/src/routes/index.tsx', generateIndexRoute(context));

  // ============================================================================
  // Layout Components
  // ============================================================================
  files.set('apps/web/src/components/layout/Sidebar.tsx', generateSidebar(context));
  files.set('apps/web/src/components/layout/Header.tsx', generateHeader(context));
  files.set('apps/web/src/components/layout/AppLayout.tsx', generateAppLayout(context));
  files.set('apps/web/src/components/layout/index.ts', generateLayoutIndex(context));

  // ============================================================================
  // UI Components (shadcn-style)
  // ============================================================================
  files.set('apps/web/src/components/ui/Button.tsx', generateButton(context));
  files.set('apps/web/src/components/ui/Input.tsx', generateInput(context));
  files.set('apps/web/src/components/ui/Card.tsx', generateCard(context));
  files.set('apps/web/src/components/ui/Avatar.tsx', generateAvatar(context));
  files.set('apps/web/src/components/ui/index.ts', generateUiIndex(context));

  // ============================================================================
  // Todo Feature Components
  // ============================================================================
  files.set('apps/web/src/features/todos/TodoList.tsx', generateTodoList(context));
  files.set('apps/web/src/features/todos/TodoItem.tsx', generateTodoItem(context));
  files.set('apps/web/src/features/todos/TodoInput.tsx', generateTodoInput(context));
  files.set('apps/web/src/features/todos/useTodos.ts', generateUseTodos(context));
  files.set('apps/web/src/features/todos/index.ts', generateTodosIndex(context));

  // ============================================================================
  // API Client & Utils
  // ============================================================================
  files.set('apps/web/src/lib/api.ts', generateApiClient(context));
  files.set('apps/web/src/lib/config.ts', generateConfig(context));
  files.set('apps/web/src/lib/utils.ts', generateUtils(context));

  // ============================================================================
  // Auth (when enabled)
  // ============================================================================
  if (context.hasAuth) {
    files.set('apps/web/src/routes/login.tsx', generateLoginRoute(context));
    files.set('apps/web/src/routes/register.tsx', generateRegisterRoute(context));
    files.set('apps/web/src/features/auth/AuthForm.tsx', generateAuthForm(context));
    files.set('apps/web/src/features/auth/useAuth.ts', generateUseAuth(context));
    files.set('apps/web/src/features/auth/AuthProvider.tsx', generateAuthProvider(context));
    files.set('apps/web/src/features/auth/index.ts', generateAuthIndex(context));
    files.set('apps/web/src/lib/auth-api.ts', generateAuthApi(context));
  }

  const dependencies = [
    'react',
    'react-dom',
    '@tanstack/react-router',
    'clsx',
    'tailwind-merge',
  ];

  const devDependencies = [
    '@types/react',
    '@types/react-dom',
    '@vitejs/plugin-react',
    'vite',
    'typescript',
    'tailwindcss',
    '@tailwindcss/postcss',
    '@tanstack/router-plugin',
  ];

  return {
    files,
    dependencies,
    devDependencies,
  };
}

// ============================================================================
// Project Configuration
// ============================================================================

function generatePackageJson(context: TemplateContext): string {
  return `{
  "name": "@${context.projectNameKebab}/web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
`;
}

function generateTsConfig(context: TemplateContext): string {
  return `{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
`;
}

function generateViteConfig(context: TemplateContext): string {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import path from 'path';

export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/api/, ''),
      },
    },
  },
});
`;
}

function generateTailwindConfig(context: TemplateContext): string {
  // Tailwind v4 uses CSS-based configuration via @theme directive in globals.css
  // This config file only needs content paths for class detection
  return `import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Theme is defined in src/styles/globals.css using @theme directive
} satisfies Config;
`;
}

function generatePostCssConfig(context: TemplateContext): string {
  return `export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
`;
}

function generateIndexHtml(context: TemplateContext): string {
  return `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${context.projectName}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-background text-foreground antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

// ============================================================================
// App Entry
// ============================================================================

function generateMain(context: TemplateContext): string {
  const authImport = context.hasAuth ? `import { AuthProvider } from '@/features/auth';` : '';
  const authWrapper = context.hasAuth ? ['<AuthProvider>', '</AuthProvider>'] : ['', ''];

  return `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
${authImport}
import '@/styles/globals.css';

// Create router instance
const router = createRouter({ routeTree });

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    ${authWrapper[0]}
      <RouterProvider router={router} />
    ${authWrapper[1]}
  </StrictMode>
);
`;
}

function generateGlobalStyles(context: TemplateContext): string {
  // Tailwind v4 uses CSS-first configuration with @theme
  // Using Fumadocs neutral theme to match docs site
  return `@import "tailwindcss";

/* Fumadocs Neutral Theme - CSS Variables for Tailwind v4 */
@theme {
  /* Background colors (dark mode) */
  --color-background: #0a0a0a;
  --color-background-soft: #171717;
  --color-background-1: #212121;
  --color-background-2: #272727;
  --color-background-3: #333333;
  --color-background-4: #404040;

  /* Foreground colors */
  --color-foreground: #fafafa;
  --color-foreground-muted: #a3a3a3;
  --color-foreground-subtle: #737373;

  /* Primary (blue) */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-primary-foreground: #ffffff;

  /* Border colors */
  --color-border: #272727;
  --color-border-hover: #404040;
  --color-border-subtle: #1a1a1a;

  /* Accent colors (modern palette) */
  --color-accent-success: #22c55e;
  --color-accent-success-dim: #16a34a;
  --color-accent-warning: #eab308;
  --color-accent-warning-dim: #ca8a04;
  --color-accent-info: #06b6d4;
  --color-accent-info-dim: #0891b2;
  --color-accent-purple: #a855f7;
  --color-accent-purple-dim: #9333ea;

  /* Destructive (red) */
  --color-destructive: #ef4444;
  --color-destructive-dim: #dc2626;
  --color-destructive-foreground: #fafafa;

  /* Gray */
  --color-gray: #737373;
  --color-gray-light: #a3a3a3;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

@layer base {
  * {
    border-color: var(--color-border);
  }

  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
  }

  /* Custom scrollbar - neutral style */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: var(--color-background);
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--color-background-3);
    border-radius: 9999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-background-4);
  }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
`;
}

// ============================================================================
// TanStack Router
// ============================================================================

function generateRouteTree(context: TemplateContext): string {
  const authImports = context.hasAuth
    ? `import { Route as LoginRoute } from './routes/login';
import { Route as RegisterRoute } from './routes/register';`
    : '';

  const authRouteTree = context.hasAuth
    ? ', LoginRoute, RegisterRoute'
    : '';

  return `// This file is auto-generated by TanStack Router
import { Route as rootRoute } from './routes/__root';
import { Route as IndexRoute } from './routes/index';
${authImports}

export const routeTree = rootRoute.addChildren([
  IndexRoute${authRouteTree}
]);
`;
}

function generateRootRoute(context: TemplateContext): string {
  return `import { createRootRoute, Outlet } from '@tanstack/react-router';
import { AppLayout } from '@/components/layout';

export const Route = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
`;
}

function generateIndexRoute(context: TemplateContext): string {
  return `import { createFileRoute } from '@tanstack/react-router';
import { TodoList, TodoInput } from '@/features/todos';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex flex-col h-full">
      {/* Todo list - scrollable area */}
      <div className="flex-1 overflow-y-auto p-4">
        <TodoList />
      </div>

      {/* Input area - fixed at bottom */}
      <div className="border-t border-border p-4 bg-background-hard">
        <TodoInput />
      </div>
    </div>
  );
}
`;
}

// ============================================================================
// Layout Components
// ============================================================================

function generateSidebar(context: TemplateContext): string {
  const authSection = context.hasAuth
    ? `
  const { user, logout } = useAuth();
`
    : '';

  const authImport = context.hasAuth ? `import { useAuth } from '@/features/auth';` : '';

  const userSection = context.hasAuth
    ? `
        {/* User section */}
        <div className="border-t border-border p-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Avatar name={user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-foreground-muted truncate">{user.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/register" className="flex-1">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>`
    : '';

  const avatarImport = context.hasAuth ? `import { Avatar } from '@/components/ui';` : '';

  return `import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui';
${avatarImport}
${authImport}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
${authSection}
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={\`
          fixed top-0 left-0 z-50 h-full w-64
          bg-background-hard border-r border-border
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          \${isOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        \`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="font-semibold text-lg">${context.projectName}</span>
          </Link>
        </div>

        {/* New todo button */}
        <div className="p-3">
          <Button className="w-full justify-start gap-2" variant="outline">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Todo
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background-1 transition-colors"
          >
            <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>All Todos</span>
          </Link>
        </nav>
${userSection}
      </aside>
    </>
  );
}
`;
}

function generateHeader(context: TemplateContext): string {
  return `interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center gap-4 p-4 border-b border-border bg-background lg:hidden">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-background-1 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 className="font-semibold">Todos</h1>
    </header>
  );
}
`;
}

function generateAppLayout(context: TemplateContext): string {
  return `import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
`;
}

function generateLayoutIndex(context: TemplateContext): string {
  return `export { Sidebar } from './Sidebar';
export { Header } from './Header';
export { AppLayout } from './AppLayout';
`;
}

// ============================================================================
// UI Components
// ============================================================================

function generateButton(context: TemplateContext): string {
  return `import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variants
          {
            'bg-primary text-background hover:bg-primary-hover': variant === 'default',
            'border border-border bg-transparent hover:bg-background-1': variant === 'outline',
            'bg-transparent hover:bg-background-1': variant === 'ghost',
            'bg-destructive text-destructive-foreground hover:bg-destructive-dim': variant === 'destructive',
          },
          // Sizes
          {
            'h-10 px-4 py-2': size === 'default',
            'h-8 px-3 text-sm': size === 'sm',
            'h-12 px-6': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
`;
}

function generateInput(context: TemplateContext): string {
  return `import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-lg border border-border bg-background-1 px-3 py-2',
          'text-sm placeholder:text-foreground-muted',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
`;
}

function generateCard(context: TemplateContext): string {
  return `import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-background-1 p-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: CardProps) {
  return (
    <h3 className={cn('text-lg font-semibold', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}
`;
}

function generateAvatar(context: TemplateContext): string {
  return `import { cn } from '@/lib/utils';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={cn(
        'rounded-full bg-primary flex items-center justify-center text-white font-medium',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
      ) : (
        initials || '?'
      )}
    </div>
  );
}
`;
}

function generateUiIndex(context: TemplateContext): string {
  return `export { Button, type ButtonProps } from './Button';
export { Input, type InputProps } from './Input';
export { Card, CardHeader, CardTitle, CardContent } from './Card';
export { Avatar } from './Avatar';
`;
}

// ============================================================================
// Todo Feature
// ============================================================================

function generateTodoList(context: TemplateContext): string {
  return `import { useTodos } from './useTodos';
import { TodoItem } from './TodoItem';

export function TodoList() {
  const { todos, isLoading, error, toggleTodo, deleteTodo } = useTodos();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        <p>Error loading todos: {error}</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-foreground-muted">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-lg font-medium">No todos yet</p>
        <p className="text-sm">Add your first todo below to get started</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => toggleTodo(todo.id)}
          onDelete={() => deleteTodo(todo.id)}
        />
      ))}
    </div>
  );
}
`;
}

function generateTodoItem(context: TemplateContext): string {
  return `import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      className={cn(
        'group flex items-start gap-4 p-4 rounded-xl border border-border bg-background-1',
        'hover:border-border-hover transition-colors',
        todo.completed && 'opacity-60'
      )}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          'flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 transition-colors',
          todo.completed
            ? 'bg-primary border-primary'
            : 'border-foreground-muted hover:border-primary'
        )}
      >
        {todo.completed && (
          <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium',
          todo.completed && 'line-through text-foreground-muted'
        )}>
          {todo.title}
        </p>
        {todo.description && (
          <p className="text-sm text-foreground-muted mt-1 line-clamp-2">
            {todo.description}
          </p>
        )}
      </div>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground-muted hover:text-destructive"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </Button>
    </div>
  );
}
`;
}

function generateTodoInput(context: TemplateContext): string {
  return `import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui';
import { useTodos } from './useTodos';

export function TodoInput() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { createTodo, isCreating } = useTodos();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [title]);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    await createTodo({
      title: title.trim(),
      description: description.trim() || undefined,
    });

    setTitle('');
    setDescription('');
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-background-1 rounded-xl border border-border focus-within:border-border-hover transition-colors">
        {/* Main input */}
        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new todo..."
            rows={1}
            className="w-full bg-transparent resize-none outline-none placeholder:text-foreground-muted"
            disabled={isCreating}
          />

          {/* Description (when expanded) */}
          {isExpanded && (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              rows={2}
              className="w-full mt-2 bg-transparent resize-none outline-none text-sm text-foreground-muted placeholder:text-foreground-muted"
              disabled={isCreating}
            />
          )}
        </div>

        {/* Actions */}
        {isExpanded && (
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="text-xs text-foreground-muted">
              Press Enter to submit
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTitle('');
                  setDescription('');
                  setIsExpanded(false);
                }}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!title.trim() || isCreating}
              >
                {isCreating ? 'Adding...' : 'Add Todo'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
`;
}

function generateUseTodos(context: TemplateContext): string {
  const authHeader = context.hasAuth
    ? `
import { useAuth } from '@/features/auth';
`
    : '';

  const authToken = context.hasAuth
    ? `
  const { token } = useAuth();
  const headers = token ? { Authorization: \`Bearer \${token}\` } : {};
`
    : `
  const headers = {};
`;

  return `import { useState, useEffect, useCallback } from 'react';
import { config } from '@/lib/config';
${authHeader}

interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateTodoInput {
  title: string;
  description?: string;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
${authToken}
  // Fetch todos
  const fetchTodos = useCallback(async () => {
    try {
      const response = await fetch(\`\${config.apiUrl}/todos\`, { headers });
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data.items || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [${context.hasAuth ? 'token' : ''}]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Create todo
  const createTodo = useCallback(async (input: CreateTodoInput) => {
    setIsCreating(true);
    try {
      const response = await fetch(\`\${config.apiUrl}/todos\`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error('Failed to create todo');
      const newTodo = await response.json();
      setTodos((prev) => [newTodo, ...prev]);
    } finally {
      setIsCreating(false);
    }
  }, [${context.hasAuth ? 'token' : ''}]);

  // Toggle todo
  const toggleTodo = useCallback(async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    try {
      await fetch(\`\${config.apiUrl}/todos/\${id}/toggle\`, {
        method: 'POST',
        headers,
      });
    } catch {
      // Revert on error
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: todo.completed } : t))
      );
    }
  }, [todos${context.hasAuth ? ', token' : ''}]);

  // Delete todo
  const deleteTodo = useCallback(async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    // Optimistic update
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await fetch(\`\${config.apiUrl}/todos/\${id}\`, {
        method: 'DELETE',
        headers,
      });
    } catch {
      // Revert on error
      setTodos((prev) => [...prev, todo].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    }
  }, [todos${context.hasAuth ? ', token' : ''}]);

  return {
    todos,
    isLoading,
    isCreating,
    error,
    createTodo,
    toggleTodo,
    deleteTodo,
    refetch: fetchTodos,
  };
}
`;
}

function generateTodosIndex(context: TemplateContext): string {
  return `export { TodoList } from './TodoList';
export { TodoItem } from './TodoItem';
export { TodoInput } from './TodoInput';
export { useTodos } from './useTodos';
`;
}

// ============================================================================
// API Client & Utils
// ============================================================================

function generateApiClient(context: TemplateContext): string {
  return `import { config } from './config';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = \`Bearer \${token}\`;
  }

  const response = await fetch(\`\${config.apiUrl}\${endpoint}\`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(
      data?.message || 'Request failed',
      response.status,
      data
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
`;
}

function generateConfig(context: TemplateContext): string {
  return `export const config = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  appName: '${context.projectName}',
} as const;
`;
}

function generateUtils(context: TemplateContext): string {
  return `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
}

// ============================================================================
// Auth Feature (when enabled)
// ============================================================================

function generateLoginRoute(context: TemplateContext): string {
  return `import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AuthForm } from '@/features/auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-foreground-muted mt-2">Sign in to your account</p>
        </div>
        <AuthForm
          mode="login"
          onSuccess={() => navigate({ to: '/' })}
        />
      </div>
    </div>
  );
}
`;
}

function generateRegisterRoute(context: TemplateContext): string {
  return `import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AuthForm } from '@/features/auth';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-foreground-muted mt-2">Get started with ${context.projectName}</p>
        </div>
        <AuthForm
          mode="register"
          onSuccess={() => navigate({ to: '/' })}
        />
      </div>
    </div>
  );
}
`;
}

function generateAuthForm(context: TemplateContext): string {
  return `import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { useAuth } from './useAuth';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-foreground-muted">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
`;
}

function generateUseAuth(context: TemplateContext): string {
  return `import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
`;
}

function generateAuthProvider(context: TemplateContext): string {
  return `import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi, type User, type AuthResponse } from '@/lib/auth-api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = '${context.projectNameKebab}_token';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.me(token);
        setUser(response.user);
      } catch {
        // Token invalid, clear it
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const handleAuthResponse = useCallback((response: AuthResponse) => {
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem(TOKEN_KEY, response.token);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    handleAuthResponse(response);
  }, [handleAuthResponse]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const response = await authApi.register(email, password, name);
    handleAuthResponse(response);
  }, [handleAuthResponse]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
`;
}

function generateAuthIndex(context: TemplateContext): string {
  return `export { AuthForm } from './AuthForm';
export { useAuth } from './useAuth';
export { AuthProvider, AuthContext } from './AuthProvider';
`;
}

function generateAuthApi(context: TemplateContext): string {
  return `import { config } from './config';
import { ApiError } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  tokenType: string;
}

export interface MeResponse {
  user: User;
  token: {
    id: string;
    name: string;
    scopes: string[];
    lastUsedAt: string | null;
    expiresAt: string | null;
  } | null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(
      data?.message || data?.error || 'Request failed',
      response.status,
      data
    );
  }
  return response.json();
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(\`\${config.apiUrl}/auth/login\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(response);
  },

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await fetch(\`\${config.apiUrl}/auth/register\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return handleResponse<AuthResponse>(response);
  },

  async me(token: string): Promise<MeResponse> {
    const response = await fetch(\`\${config.apiUrl}/auth/me\`, {
      headers: { Authorization: \`Bearer \${token}\` },
    });
    return handleResponse<MeResponse>(response);
  },

  async logout(token: string): Promise<void> {
    await fetch(\`\${config.apiUrl}/auth/logout\`, {
      method: 'POST',
      headers: { Authorization: \`Bearer \${token}\` },
    });
  },
};
`;
}
