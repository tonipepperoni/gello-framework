/**
 * gello new command - Create a new Gello project
 *
 * Usage: gello new <project-name> [--template todo]
 */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { render, Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import * as fs from 'node:fs';
import * as path from 'node:path';

// React is needed at runtime for JSX
void React;

// Gruvbox dark palette
const gruvbox = {
  bg: '#282828',
  fg: '#ebdbb2',
  gray: '#928374',
  red: '#fb4934',
  green: '#b8bb26',
  yellow: '#fabd2f',
  blue: '#83a598',
  purple: '#d3869b',
  aqua: '#8ec07c',
  orange: '#fe8019',
  bg1: '#3c3836',
  bg2: '#504945',
  fg4: '#a89984',
};

export interface NewProjectOptions {
  name: string;
  template?: string;
}

type Step =
  | { type: 'creating'; message: string }
  | { type: 'complete'; projectPath: string }
  | { type: 'error'; message: string };

interface NewProjectProps {
  projectName: string;
  template: string;
}

const NewProject: React.FC<NewProjectProps> = ({ projectName, template }) => {
  const [steps, setSteps] = useState<Array<{ text: string; done: boolean }>>([]);
  const [currentStep, setCurrentStep] = useState<Step>({ type: 'creating', message: 'Initializing...' });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const run = async () => {
      const projectPath = path.resolve(process.cwd(), projectName);

      try {
        // Step 1: Create project directory
        addStep('Creating project directory');
        if (fs.existsSync(projectPath)) {
          throw new Error(`Directory "${projectName}" already exists`);
        }
        fs.mkdirSync(projectPath, { recursive: true });
        completeStep();

        // Step 2: Create package.json
        addStep('Creating package.json');
        await writePackageJson(projectPath, projectName);
        completeStep();

        // Step 3: Create tsconfig
        addStep('Creating TypeScript configuration');
        await writeTsConfig(projectPath);
        completeStep();

        // Step 4: Create vite config
        addStep('Creating Vite configuration');
        await writeViteConfig(projectPath);
        completeStep();

        // Step 5: Create source files
        addStep('Scaffolding source files');
        await writeSourceFiles(projectPath, template);
        completeStep();

        // Step 6: Create .env.example
        addStep('Creating environment configuration');
        await writeEnvExample(projectPath);
        completeStep();

        // Step 7: Create .gitignore
        addStep('Creating .gitignore');
        await writeGitIgnore(projectPath);
        completeStep();

        setCurrentStep({ type: 'complete', projectPath });
        setShowSuccess(true);
      } catch (error) {
        setCurrentStep({
          type: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };

    const addStep = (text: string) => {
      setSteps(prev => [...prev, { text, done: false }]);
    };

    const completeStep = () => {
      setSteps(prev => {
        const newSteps = [...prev];
        const lastIncomplete = newSteps.findIndex(s => !s.done);
        if (lastIncomplete !== -1) {
          newSteps[lastIncomplete] = { ...newSteps[lastIncomplete], done: true };
        }
        return newSteps;
      });
    };

    run();
  }, [projectName, template]);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color={gruvbox.orange} bold>
          ✨ Creating new Gello project: {projectName}
        </Text>
      </Box>

      {/* Template info */}
      <Box marginBottom={1}>
        <Text color={gruvbox.gray}>
          Template: <Text color={gruvbox.aqua}>{template}</Text>
        </Text>
      </Box>

      {/* Steps */}
      <Box flexDirection="column" marginBottom={1}>
        {steps.map((step, i) => (
          <Box key={i}>
            {step.done ? (
              <Text color={gruvbox.green}>✓ </Text>
            ) : (
              <Text color={gruvbox.yellow}>
                <Spinner type="dots" />
                {' '}
              </Text>
            )}
            <Text color={step.done ? gruvbox.fg4 : gruvbox.fg}>{step.text}</Text>
          </Box>
        ))}
      </Box>

      {/* Result */}
      {currentStep.type === 'complete' && showSuccess && (
        <Box flexDirection="column" marginTop={1} borderStyle="round" borderColor={gruvbox.green} paddingX={2} paddingY={1}>
          <Text color={gruvbox.green} bold>
            🎉 Project created successfully!
          </Text>
          <Box marginTop={1} flexDirection="column">
            <Text color={gruvbox.fg}>Get started:</Text>
            <Box marginLeft={2} flexDirection="column">
              <Text color={gruvbox.yellow}>cd {projectName}</Text>
              <Text color={gruvbox.yellow}>cp .env.example .env</Text>
              <Text color={gruvbox.yellow}>pnpm install</Text>
              <Text color={gruvbox.yellow}>pnpm dev</Text>
            </Box>
          </Box>
        </Box>
      )}

      {currentStep.type === 'error' && (
        <Box marginTop={1} borderStyle="round" borderColor={gruvbox.red} paddingX={2} paddingY={1}>
          <Text color={gruvbox.red}>✗ Error: {currentStep.message}</Text>
        </Box>
      )}
    </Box>
  );
};

// ============================================================================
// Template Files
// ============================================================================

async function writePackageJson(projectPath: string, projectName: string) {
  const pkg = {
    name: projectName,
    version: '0.0.1',
    private: true,
    type: 'module',
    scripts: {
      dev: 'tsx --watch src/main.ts',
      serve: 'tsx src/main.ts',
      build: 'vite build',
      start: 'node dist/main.js',
      lint: 'eslint src',
      typecheck: 'tsc --noEmit',
    },
    dependencies: {
      effect: '^3.19.13',
      '@gello/config': '^0.1.1',
      '@gello/cache': '^0.1.0',
      '@gello/cache-drivers': '^0.1.0',
    },
    devDependencies: {
      '@types/node': '^22.10.2',
      typescript: '^5.7.2',
      tsx: '^4.19.2',
      vite: '^6.0.5',
      eslint: '^9.17.0',
    },
  };
  fs.writeFileSync(
    path.join(projectPath, 'package.json'),
    JSON.stringify(pkg, null, 2) + '\n'
  );
}

async function writeTsConfig(projectPath: string) {
  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      lib: ['ES2022'],
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      outDir: './dist',
      rootDir: './src',
      exactOptionalPropertyTypes: true,
      noUncheckedIndexedAccess: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
    },
    include: ['src/**/*.ts'],
    exclude: ['node_modules', 'dist'],
  };
  fs.writeFileSync(
    path.join(projectPath, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2) + '\n'
  );
}

async function writeViteConfig(projectPath: string) {
  const content = `import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'node20',
    ssr: true,
    lib: {
      entry: 'src/main.ts',
      formats: ['es'],
      fileName: 'main',
    },
    rollupOptions: {
      external: [/^node:/, /^@effect/, /^@gello/, 'effect'],
    },
  },
});
`;
  fs.writeFileSync(path.join(projectPath, 'vite.config.ts'), content);
}

async function writeEnvExample(projectPath: string) {
  const content = `# ============================================================================
# Gello Application Configuration
# ============================================================================
# Copy this file to .env and modify as needed.
# Environment-specific overrides: .env.local, .env.production, .env.production.local

# ─── Application ─────────────────────────────────────────────────────────────

APP_NAME=my-app
APP_ENV=local
APP_DEBUG=true

# ─── Server ──────────────────────────────────────────────────────────────────

APP_HOST=0.0.0.0
APP_PORT=3000
APP_LOGGING=true
APP_TIMING=true

# ─── Database ────────────────────────────────────────────────────────────────
# PostgreSQL connection settings

DB_HOST=localhost
DB_PORT=5432
DB_NAME=gello
DB_USER=gello
DB_PASSWORD=secret
DB_SSL=false

# Connection pool
DB_POOL_MIN=2
DB_POOL_MAX=10

# ─── Redis ───────────────────────────────────────────────────────────────────
# Used for caching, sessions, and queue driver

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DATABASE=0
REDIS_TLS=false

# ─── Queue ───────────────────────────────────────────────────────────────────
# Queue driver: "memory" (default) or "redis"

QUEUE_DRIVER=memory
QUEUE_DEFAULT=default
QUEUE_PREFIX=gello:

# ─── Logging ─────────────────────────────────────────────────────────────────

LOG_LEVEL=debug
LOG_FORMAT=pretty

# ─── Security ────────────────────────────────────────────────────────────────

# CORS allowed origins (comma-separated, or * for all)
CORS_ORIGINS=*

# Rate limiting
RATE_LIMIT_ENABLED=false
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000

# ─── Cache ──────────────────────────────────────────────────────────────────
# Cache driver: "memory" (default), "redis", "file", "database", "null", "multi"

CACHE_DRIVER=memory
CACHE_PREFIX=app:
CACHE_TTL=3600

# File store (if CACHE_DRIVER=file)
CACHE_PATH=/tmp/cache

# Database store (if CACHE_DRIVER=database)
CACHE_TABLE=cache

# Multi-level cache (if CACHE_DRIVER=multi)
CACHE_L2_DRIVER=redis
CACHE_L1_TTL=300
`;
  fs.writeFileSync(path.join(projectPath, '.env.example'), content);
}

async function writeGitIgnore(projectPath: string) {
  const content = `# Dependencies
node_modules/

# Build
dist/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Environment
.env
.env.local
.env.*.local
`;
  fs.writeFileSync(path.join(projectPath, '.gitignore'), content);
}

async function writeSourceFiles(projectPath: string, template: string) {
  // Create directories
  const dirs = ['src', 'src/config', 'src/domain', 'src/routes', 'src/services'];
  for (const dir of dirs) {
    fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
  }

  // Always write config module
  await writeConfigModule(projectPath);

  // Always write cache setup
  await writeCacheModule(projectPath);

  if (template === 'todo') {
    await writeTodoTemplate(projectPath);
  } else {
    await writeMinimalTemplate(projectPath);
  }
}

async function writeConfigModule(projectPath: string) {
  // src/config/index.ts - Application configuration
  const configIndex = `/**
 * Application Configuration
 *
 * Centralized configuration using @gello/config.
 * Reads from environment variables with sensible defaults.
 */
import { env } from '@gello/config';

/**
 * Application configuration object.
 * All values are read from environment variables at startup.
 */
export const config = {
  // ─── Application ─────────────────────────────────────────────────────────
  app: {
    name: env('APP_NAME', 'my-app'),
    env: env('APP_ENV', 'local') as 'local' | 'development' | 'staging' | 'production' | 'testing',
    debug: env('APP_DEBUG', 'true') === 'true',
  },

  // ─── Server ──────────────────────────────────────────────────────────────
  server: {
    host: env('APP_HOST', '0.0.0.0'),
    port: Number(env('APP_PORT', '3000')),
    logging: env('APP_LOGGING', 'true') === 'true',
    timing: env('APP_TIMING', 'true') === 'true',
  },

  // ─── Database ────────────────────────────────────────────────────────────
  database: {
    host: env('DB_HOST', 'localhost'),
    port: Number(env('DB_PORT', '5432')),
    name: env('DB_NAME', 'gello'),
    user: env('DB_USER', 'gello'),
    password: env('DB_PASSWORD', ''),
    ssl: env('DB_SSL', 'false') === 'true',
    pool: {
      min: Number(env('DB_POOL_MIN', '2')),
      max: Number(env('DB_POOL_MAX', '10')),
    },
  },

  // ─── Redis ───────────────────────────────────────────────────────────────
  redis: {
    host: env('REDIS_HOST', 'localhost'),
    port: Number(env('REDIS_PORT', '6379')),
    password: env('REDIS_PASSWORD', '') || undefined,
    database: Number(env('REDIS_DATABASE', '0')),
    tls: env('REDIS_TLS', 'false') === 'true',
  },

  // ─── Queue ───────────────────────────────────────────────────────────────
  queue: {
    driver: env('QUEUE_DRIVER', 'memory') as 'memory' | 'redis',
    defaultQueue: env('QUEUE_DEFAULT', 'default'),
    prefix: env('QUEUE_PREFIX', 'gello:'),
  },

  // ─── Logging ─────────────────────────────────────────────────────────────
  logging: {
    level: env('LOG_LEVEL', 'debug') as 'debug' | 'info' | 'warn' | 'error',
    format: env('LOG_FORMAT', 'pretty') as 'pretty' | 'json',
  },

  // ─── Security ────────────────────────────────────────────────────────────
  security: {
    corsOrigins: env('CORS_ORIGINS', '*'),
    rateLimit: {
      enabled: env('RATE_LIMIT_ENABLED', 'false') === 'true',
      max: Number(env('RATE_LIMIT_MAX', '100')),
      window: Number(env('RATE_LIMIT_WINDOW', '60000')),
    },
  },

  // ─── Cache ──────────────────────────────────────────────────────────────
  cache: {
    driver: env('CACHE_DRIVER', 'memory') as 'memory' | 'redis' | 'file' | 'database' | 'null' | 'multi',
    prefix: env('CACHE_PREFIX', 'app:'),
    ttl: Number(env('CACHE_TTL', '3600')),
    file: {
      directory: env('CACHE_PATH', '/tmp/cache'),
    },
    database: {
      table: env('CACHE_TABLE', 'cache'),
    },
    multi: {
      l2Driver: env('CACHE_L2_DRIVER', 'redis') as 'redis' | 'file' | 'database',
      l1TtlSeconds: Number(env('CACHE_L1_TTL', '300')),
    },
  },
} as const;

/**
 * Type for the full configuration object
 */
export type AppConfig = typeof config;

/**
 * Helper to check if we're in production
 */
export const isProduction = () => config.app.env === 'production';

/**
 * Helper to check if we're in local/development
 */
export const isDevelopment = () =>
  config.app.env === 'local' || config.app.env === 'development';

/**
 * Helper to check if debug mode is enabled
 */
export const isDebug = () => config.app.debug;

/**
 * Get the database connection URL
 */
export const getDatabaseUrl = () => {
  const { host, port, name, user, password, ssl } = config.database;
  const sslParam = ssl ? '?sslmode=require' : '';
  return \`postgresql://\${user}:\${password}@\${host}:\${port}/\${name}\${sslParam}\`;
};

/**
 * Get the Redis connection URL
 */
export const getRedisUrl = () => {
  const { host, port, password, database, tls } = config.redis;
  const protocol = tls ? 'rediss' : 'redis';
  const auth = password ? \`:\${password}@\` : '';
  return \`\${protocol}://\${auth}\${host}:\${port}/\${database}\`;
};
`;
  fs.writeFileSync(path.join(projectPath, 'src/config/index.ts'), configIndex);
}

async function writeCacheModule(projectPath: string) {
  // src/services/cache.ts - Cache service setup
  const cacheService = `/**
 * Cache Service Setup
 *
 * Provides a configured cache layer using @gello/cache.
 * Supports multiple drivers: memory, redis, file, database, and multi-level.
 */
import { Effect, Layer, Duration } from 'effect';
import { Cache, makeCacheLayer, type CacheService } from '@gello/cache';
import { makeMemoryStore, makeFileStore } from '@gello/cache-drivers';
import { config } from '../config/index.js';

// ============================================================================
// Cache Store Factory
// ============================================================================

/**
 * Create a cache store based on the configured driver.
 * For production Redis/Database, import the appropriate driver.
 */
const createStore = () => {
  switch (config.cache.driver) {
    case 'memory':
    case 'null':
      // In-memory cache (default)
      return Effect.runSync(makeMemoryStore({
        maxSize: 1000,
        prefix: config.cache.prefix,
      }));

    case 'file':
      // File-based cache
      return Effect.runSync(makeFileStore({
        directory: config.cache.file.directory,
        prefix: config.cache.prefix,
      }));

    case 'redis':
    case 'database':
    case 'multi':
      // For Redis/Database/Multi, use memory as fallback
      // In production, you would import and configure these drivers:
      //
      // import { makeRedisStore } from '@gello/cache-drivers';
      // import { createClient } from 'redis';
      //
      // const redis = createClient({ url: getRedisUrl() });
      // return makeRedisStore(redis, { prefix: config.cache.prefix });
      //
      console.warn(\`Cache driver "\${config.cache.driver}" not fully configured, using memory\`);
      return Effect.runSync(makeMemoryStore({
        maxSize: 1000,
        prefix: config.cache.prefix,
      }));

    default:
      return Effect.runSync(makeMemoryStore({
        maxSize: 1000,
        prefix: config.cache.prefix,
      }));
  }
};

// ============================================================================
// Cache Layer
// ============================================================================

/**
 * The configured cache layer for dependency injection.
 *
 * @example
 * \`\`\`typescript
 * const program = Effect.gen(function* () {
 *   const cache = yield* Cache;
 *   yield* cache.put('user:1', { name: 'John' }, Duration.minutes(30));
 *   const user = yield* cache.get('user:1');
 *   console.log(user);
 * });
 *
 * Effect.runPromise(program.pipe(Effect.provide(CacheLive)));
 * \`\`\`
 */
export const CacheLive: Layer.Layer<CacheService> = makeCacheLayer(createStore());

// ============================================================================
// Cache Helpers
// ============================================================================

/**
 * Get a value from cache with default TTL from config.
 */
export const cacheGet = <A>(key: string) =>
  Effect.gen(function* () {
    const cache = yield* Cache;
    return yield* cache.get<A>(key);
  });

/**
 * Set a value in cache with optional TTL (defaults to config.cache.ttl).
 */
export const cacheSet = <A>(key: string, value: A, ttlSeconds?: number) =>
  Effect.gen(function* () {
    const cache = yield* Cache;
    const ttl = Duration.seconds(ttlSeconds ?? config.cache.ttl);
    yield* cache.put(key, value, ttl);
  });

/**
 * Remember pattern - get from cache or compute and store.
 */
export const cacheRemember = <A, E>(
  key: string,
  compute: Effect.Effect<A, E>,
  ttlSeconds?: number
) =>
  Effect.gen(function* () {
    const cache = yield* Cache;
    const ttl = Duration.seconds(ttlSeconds ?? config.cache.ttl);
    return yield* cache.remember(key, ttl, compute);
  });

/**
 * Forget (delete) a cache key.
 */
export const cacheForget = (key: string) =>
  Effect.gen(function* () {
    const cache = yield* Cache;
    yield* cache.forget(key);
  });

/**
 * Clear all cache entries.
 */
export const cacheFlush = () =>
  Effect.gen(function* () {
    const cache = yield* Cache;
    yield* cache.flush();
  });
`;
  fs.writeFileSync(path.join(projectPath, 'src/services/cache.ts'), cacheService);
}

async function writeMinimalTemplate(projectPath: string) {
  // Main entry with config
  const main = `/**
 * Gello Application - Getting Started
 */
import * as http from 'node:http';
import { config, isProduction, getDatabaseUrl, getRedisUrl } from './config/index.js';

// ============================================================================
// HTTP Helpers
// ============================================================================

const json = (res: http.ServerResponse, data: unknown, status = 200) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// ============================================================================
// Request Handler
// ============================================================================

const handleRequest = (req: http.IncomingMessage, res: http.ServerResponse) => {
  const url = req.url ?? '/';
  const method = req.method ?? 'GET';

  // CORS
  res.setHeader('Access-Control-Allow-Origin', config.security.corsOrigins);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Logging
  if (config.server.logging) {
    console.log(\`\${method} \${url}\`);
  }

  // Routes
  if (method === 'GET' && url === '/') {
    return json(res, {
      message: 'Hello from Gello!',
      app: config.app.name,
      environment: config.app.env,
      timestamp: new Date().toISOString(),
    });
  }

  if (method === 'GET' && url === '/health') {
    return json(res, {
      status: 'ok',
      uptime: process.uptime(),
      environment: config.app.env,
    });
  }

  if (method === 'GET' && url === '/config' && !isProduction()) {
    // Only expose config in non-production (for debugging)
    return json(res, {
      app: config.app,
      server: config.server,
      database: { ...config.database, password: '***' },
      redis: { ...config.redis, password: config.redis.password ? '***' : undefined },
      queue: config.queue,
    });
  }

  // 404
  return json(res, { error: 'Not found' }, 404);
};

// ============================================================================
// Server
// ============================================================================

const server = http.createServer(handleRequest);

server.listen(config.server.port, config.server.host, () => {
  console.log(\`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 \${config.app.name.padEnd(20)}                         ║
║                                                               ║
║   Server: http://\${config.server.host}:\${String(config.server.port).padEnd(5)}                          ║
║   Environment: \${config.app.env.padEnd(12)}                                 ║
║   Debug: \${String(config.app.debug).padEnd(5)}                                        ║
║                                                               ║
║   Database: \${config.database.host}:\${config.database.port}                              ║
║   Redis: \${config.redis.host}:\${config.redis.port}                                  ║
║   Queue Driver: \${config.queue.driver.padEnd(10)}                               ║
║                                                               ║
║   Endpoints:                                                  ║
║     GET /        - Application info                           ║
║     GET /health  - Health check                               ║
║     GET /config  - Config (dev only)                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
\`);
});
`;
  fs.writeFileSync(path.join(projectPath, 'src/main.ts'), main);
}

async function writeTodoTemplate(projectPath: string) {
  // Domain - Todo.ts
  const todoModel = `/**
 * Todo Domain Model
 */
import { Schema } from 'effect';
import { Brand } from 'effect';

// ============================================================================
// Types
// ============================================================================

export type TodoId = string & Brand.Brand<'TodoId'>;
export const TodoId = Brand.nominal<TodoId>();

export interface Todo {
  readonly id: TodoId;
  readonly title: string;
  readonly description: string | undefined;
  readonly completed: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ============================================================================
// Smart Constructors
// ============================================================================

export const makeTodo = (params: {
  readonly id: TodoId;
  readonly title: string;
  readonly description?: string | undefined;
  readonly completed?: boolean | undefined;
}): Todo => ({
  id: params.id,
  title: params.title,
  description: params.description,
  completed: params.completed ?? false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const updateTodo = (
  todo: Todo,
  updates: { title?: string | undefined; description?: string | undefined; completed?: boolean | undefined }
): Todo => ({
  ...todo,
  ...(updates.title !== undefined && { title: updates.title }),
  ...(updates.description !== undefined && { description: updates.description }),
  ...(updates.completed !== undefined && { completed: updates.completed }),
  updatedAt: new Date(),
});

export const toggleCompleted = (todo: Todo): Todo => ({
  ...todo,
  completed: !todo.completed,
  updatedAt: new Date(),
});

// ============================================================================
// Schemas
// ============================================================================

export const CreateTodoSchema = Schema.Struct({
  title: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'Title cannot be empty' }),
    Schema.maxLength(200, { message: () => 'Title cannot exceed 200 characters' })
  ),
  description: Schema.optional(Schema.String.pipe(
    Schema.maxLength(1000, { message: () => 'Description cannot exceed 1000 characters' })
  )),
});

export type CreateTodo = typeof CreateTodoSchema.Type;

export const UpdateTodoSchema = Schema.Struct({
  title: Schema.optional(Schema.String.pipe(
    Schema.minLength(1),
    Schema.maxLength(200)
  )),
  description: Schema.optional(Schema.String.pipe(Schema.maxLength(1000))),
  completed: Schema.optional(Schema.Boolean),
});

export type UpdateTodo = typeof UpdateTodoSchema.Type;

export interface TodoFilter {
  readonly completed?: boolean | undefined;
}

export interface TodoListResult {
  readonly todos: readonly Todo[];
  readonly total: number;
  readonly completed: number;
  readonly pending: number;
}

export const makeTodoListResult = (todos: readonly Todo[]): TodoListResult => ({
  todos,
  total: todos.length,
  completed: todos.filter((t) => t.completed).length,
  pending: todos.filter((t) => !t.completed).length,
});
`;
  fs.writeFileSync(path.join(projectPath, 'src/domain/Todo.ts'), todoModel);

  // Domain - errors.ts
  const errors = `/**
 * Todo Domain Errors
 */
import { Data } from 'effect';
import type { TodoId } from './Todo.js';

export class TodoNotFound extends Data.TaggedError('TodoNotFound')<{
  readonly id: TodoId;
}> {
  override get message(): string {
    return \`Todo with ID "\${this.id}" not found\`;
  }
}

export class InvalidTodoId extends Data.TaggedError('InvalidTodoId')<{
  readonly raw: string;
  readonly reason: string;
}> {
  override get message(): string {
    return \`Invalid todo ID "\${this.raw}": \${this.reason}\`;
  }
}

export type TodoError = TodoNotFound | InvalidTodoId;

export const todoNotFound = (id: TodoId): TodoNotFound =>
  new TodoNotFound({ id });

export const invalidTodoId = (raw: string, reason: string): InvalidTodoId =>
  new InvalidTodoId({ raw, reason });
`;
  fs.writeFileSync(path.join(projectPath, 'src/domain/errors.ts'), errors);

  // Domain - index.ts
  fs.writeFileSync(
    path.join(projectPath, 'src/domain/index.ts'),
    `export * from './Todo.js';\nexport * from './errors.js';\n`
  );

  // Services - TodoRepository.ts
  const repository = `/**
 * TodoRepository Service
 */
import { Effect, Context, Ref, Layer, Option, pipe } from 'effect';
import {
  type Todo,
  type TodoId,
  type CreateTodo,
  type UpdateTodo,
  type TodoFilter,
  type TodoListResult,
  TodoId as TodoIdBrand,
  makeTodo,
  updateTodo,
  toggleCompleted,
  makeTodoListResult,
} from '../domain/Todo.js';
import { InvalidTodoId } from '../domain/errors.js';

// ============================================================================
// Service Interface
// ============================================================================

export interface TodoRepository {
  readonly findAll: (filter: TodoFilter) => Effect.Effect<TodoListResult>;
  readonly findById: (id: TodoId) => Effect.Effect<Option.Option<Todo>>;
  readonly create: (data: CreateTodo) => Effect.Effect<Todo>;
  readonly update: (id: TodoId, data: UpdateTodo) => Effect.Effect<Option.Option<Todo>>;
  readonly delete: (id: TodoId) => Effect.Effect<boolean>;
  readonly toggle: (id: TodoId) => Effect.Effect<Option.Option<Todo>>;
  readonly deleteCompleted: () => Effect.Effect<number>;
}

// ============================================================================
// Service Tag
// ============================================================================

export class TodoRepositoryTag extends Context.Tag('TodoRepository')<
  TodoRepositoryTag,
  TodoRepository
>() {}

// ============================================================================
// In-Memory Implementation
// ============================================================================

interface RepositoryState {
  readonly todos: ReadonlyMap<TodoId, Todo>;
  readonly nextId: number;
}

const initialState: RepositoryState = {
  todos: new Map(),
  nextId: 1,
};

const makeInMemoryRepository = (
  stateRef: Ref.Ref<RepositoryState>
): TodoRepository => ({
  findAll: (filter) =>
    pipe(
      Ref.get(stateRef),
      Effect.map((state) => {
        let todos = Array.from(state.todos.values());
        if (filter.completed !== undefined) {
          todos = todos.filter((t) => t.completed === filter.completed);
        }
        todos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return makeTodoListResult(todos);
      })
    ),

  findById: (id) =>
    pipe(
      Ref.get(stateRef),
      Effect.map((state) => Option.fromNullable(state.todos.get(id)))
    ),

  create: (data) =>
    Ref.modify(stateRef, (state) => {
      const id = TodoIdBrand(String(state.nextId));
      const todo = makeTodo({ id, title: data.title.trim(), description: data.description?.trim() });
      const newTodos = new Map(state.todos);
      newTodos.set(id, todo);
      return [todo, { todos: newTodos, nextId: state.nextId + 1 }];
    }),

  update: (id, data) =>
    Ref.modify(stateRef, (state) => {
      const existing = state.todos.get(id);
      if (!existing) return [Option.none<Todo>(), state];
      const updated = updateTodo(existing, {
        title: data.title?.trim(),
        description: data.description?.trim(),
        completed: data.completed,
      });
      const newTodos = new Map(state.todos);
      newTodos.set(id, updated);
      return [Option.some(updated), { ...state, todos: newTodos }];
    }),

  delete: (id) =>
    Ref.modify(stateRef, (state) => {
      if (!state.todos.has(id)) return [false, state];
      const newTodos = new Map(state.todos);
      newTodos.delete(id);
      return [true, { ...state, todos: newTodos }];
    }),

  toggle: (id) =>
    Ref.modify(stateRef, (state) => {
      const existing = state.todos.get(id);
      if (!existing) return [Option.none<Todo>(), state];
      const toggled = toggleCompleted(existing);
      const newTodos = new Map(state.todos);
      newTodos.set(id, toggled);
      return [Option.some(toggled), { ...state, todos: newTodos }];
    }),

  deleteCompleted: () =>
    Ref.modify(stateRef, (state) => {
      let deletedCount = 0;
      const newTodos = new Map<TodoId, Todo>();
      for (const [id, todo] of state.todos) {
        if (todo.completed) {
          deletedCount++;
        } else {
          newTodos.set(id, todo);
        }
      }
      return [deletedCount, { ...state, todos: newTodos }];
    }),
});

// ============================================================================
// Layers
// ============================================================================

export const TodoRepositoryLive: Layer.Layer<TodoRepositoryTag> = Layer.effect(
  TodoRepositoryTag,
  pipe(Ref.make(initialState), Effect.map(makeInMemoryRepository))
);

export const TodoRepositorySeeded: Layer.Layer<TodoRepositoryTag> = Layer.effect(
  TodoRepositoryTag,
  Effect.gen(function* () {
    const stateRef = yield* Ref.make(initialState);
    const repo = makeInMemoryRepository(stateRef);

    yield* repo.create({
      title: 'Learn Effect-TS',
      description: 'Study the Effect library and functional programming patterns',
    });

    const second = yield* repo.create({
      title: 'Build a REST API',
      description: 'Create a todo list API using Gello',
    });
    yield* repo.toggle(second.id);

    yield* repo.create({
      title: 'Write tests',
      description: 'Add comprehensive test coverage',
    });

    return repo;
  })
);

// ============================================================================
// Service Accessors
// ============================================================================

export const findAllTodos = (filter: TodoFilter) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.findAll(filter));

export const findTodoById = (id: TodoId) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.findById(id));

export const createTodo = (data: CreateTodo) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.create(data));

export const updateTodoById = (id: TodoId, data: UpdateTodo) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.update(id, data));

export const deleteTodoById = (id: TodoId) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.delete(id));

export const toggleTodoById = (id: TodoId) =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.toggle(id));

export const deleteCompletedTodos = () =>
  Effect.flatMap(TodoRepositoryTag, (repo) => repo.deleteCompleted());

// ============================================================================
// Helpers
// ============================================================================

export const parseTodoId = (
  raw: string | undefined
): Effect.Effect<TodoId, InvalidTodoId> => {
  if (raw === undefined || raw.trim() === '') {
    return Effect.fail(new InvalidTodoId({ raw: raw ?? '', reason: 'ID is required' }));
  }
  const trimmed = raw.trim();
  if (!/^\\d+$/.test(trimmed)) {
    return Effect.fail(
      new InvalidTodoId({ raw: trimmed, reason: 'ID must be a numeric string' })
    );
  }
  return Effect.succeed(TodoIdBrand(trimmed));
};
`;
  fs.writeFileSync(path.join(projectPath, 'src/services/TodoRepository.ts'), repository);

  // Services - index.ts
  fs.writeFileSync(
    path.join(projectPath, 'src/services/index.ts'),
    `export * from './TodoRepository.js';\n`
  );

  // Routes - index.ts
  fs.writeFileSync(
    path.join(projectPath, 'src/routes/index.ts'),
    `// Routes are defined inline in main.ts for simplicity\nexport {};\n`
  );

  // Main entry with config integration
  const main = `/**
 * Todo List API - Built with Effect
 *
 * A simple, functional todo API using Effect for typed error handling
 * and dependency injection.
 */
import * as http from 'node:http';
import { Effect, Option, pipe, Schema, ParseResult } from 'effect';

import { config, isProduction, getDatabaseUrl, getRedisUrl } from './config/index.js';
import { TodoRepositorySeeded, findAllTodos, findTodoById, createTodo, updateTodoById, deleteTodoById, toggleTodoById, deleteCompletedTodos, parseTodoId } from './services/TodoRepository.js';
import { CreateTodoSchema, UpdateTodoSchema } from './domain/Todo.js';
import { TodoNotFound, InvalidTodoId, todoNotFound } from './domain/errors.js';

// ============================================================================
// HTTP Helpers
// ============================================================================

const json = (res: http.ServerResponse, data: unknown, status = 200) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const parseBody = (req: http.IncomingMessage): Promise<unknown> =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });

const getPathId = (url: string): string | undefined => {
  const match = url.match(/\\/todos\\/([^\\/]+)/);
  return match?.[1];
};

// ============================================================================
// Route Handler Type
// ============================================================================

type RouteError = TodoNotFound | InvalidTodoId | ParseResult.ParseError | Error;

const handleError = (res: http.ServerResponse, error: RouteError) => {
  if (error instanceof TodoNotFound) {
    return json(res, { error: error.message }, 404);
  }
  if (error instanceof InvalidTodoId) {
    return json(res, { error: error.message }, 400);
  }
  if (ParseResult.isParseError(error)) {
    return json(res, { error: 'Validation error' }, 400);
  }
  return json(res, { error: 'Internal server error' }, 500);
};

// ============================================================================
// Routes
// ============================================================================

const handleRequest = (req: http.IncomingMessage, res: http.ServerResponse) => {
  const url = req.url ?? '/';
  const method = req.method ?? 'GET';

  // CORS
  res.setHeader('Access-Control-Allow-Origin', config.security.corsOrigins);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Logging
  if (config.server.logging) {
    console.log(\`\${method} \${url}\`);
  }

  const program = Effect.gen(function* () {
    // GET /
    if (method === 'GET' && url === '/') {
      return json(res, {
        name: config.app.name,
        version: '1.0.0',
        environment: config.app.env,
        endpoints: {
          'GET /todos': 'List all todos',
          'GET /todos/:id': 'Get a todo',
          'POST /todos': 'Create a todo',
          'PATCH /todos/:id': 'Update a todo',
          'DELETE /todos/:id': 'Delete a todo',
          'POST /todos/:id/toggle': 'Toggle completion',
          'DELETE /todos': 'Clear completed',
        },
      });
    }

    // GET /health
    if (method === 'GET' && url === '/health') {
      return json(res, {
        status: 'ok',
        uptime: process.uptime(),
        environment: config.app.env,
      });
    }

    // GET /config (dev only)
    if (method === 'GET' && url === '/config' && !isProduction()) {
      return json(res, {
        app: config.app,
        server: config.server,
        database: { ...config.database, password: '***' },
        redis: { ...config.redis, password: config.redis.password ? '***' : undefined },
        queue: config.queue,
      });
    }

    // GET /todos
    if (method === 'GET' && url.startsWith('/todos') && !url.includes('/todos/')) {
      const result = yield* findAllTodos({});
      return json(res, result);
    }

    // GET /todos/:id
    if (method === 'GET' && url.match(/^\\/todos\\/[^\\/]+$/)) {
      const rawId = getPathId(url);
      const todoId = yield* parseTodoId(rawId);
      const maybeTodo = yield* findTodoById(todoId);
      const todo = yield* pipe(
        maybeTodo,
        Option.match({
          onNone: () => Effect.fail(todoNotFound(todoId)),
          onSome: Effect.succeed,
        })
      );
      return json(res, todo);
    }

    // POST /todos
    if (method === 'POST' && url === '/todos') {
      const body = yield* Effect.promise(() => parseBody(req));
      const data = yield* Schema.decodeUnknown(CreateTodoSchema)(body);
      const todo = yield* createTodo(data);
      return json(res, todo, 201);
    }

    // PATCH /todos/:id
    if (method === 'PATCH' && url.match(/^\\/todos\\/[^\\/]+$/)) {
      const rawId = getPathId(url);
      const todoId = yield* parseTodoId(rawId);
      const body = yield* Effect.promise(() => parseBody(req));
      const data = yield* Schema.decodeUnknown(UpdateTodoSchema)(body);
      const maybeUpdated = yield* updateTodoById(todoId, data);
      const updated = yield* pipe(
        maybeUpdated,
        Option.match({
          onNone: () => Effect.fail(todoNotFound(todoId)),
          onSome: Effect.succeed,
        })
      );
      return json(res, updated);
    }

    // DELETE /todos/:id
    if (method === 'DELETE' && url.match(/^\\/todos\\/[^\\/]+$/) && !url.includes('/toggle')) {
      const rawId = getPathId(url);
      const todoId = yield* parseTodoId(rawId);
      const deleted = yield* deleteTodoById(todoId);
      if (!deleted) {
        return yield* Effect.fail(todoNotFound(todoId));
      }
      res.writeHead(204);
      res.end();
      return;
    }

    // POST /todos/:id/toggle
    if (method === 'POST' && url.match(/^\\/todos\\/[^\\/]+\\/toggle$/)) {
      const rawId = getPathId(url);
      const todoId = yield* parseTodoId(rawId);
      const maybeToggled = yield* toggleTodoById(todoId);
      const toggled = yield* pipe(
        maybeToggled,
        Option.match({
          onNone: () => Effect.fail(todoNotFound(todoId)),
          onSome: Effect.succeed,
        })
      );
      return json(res, toggled);
    }

    // DELETE /todos (clear completed)
    if (method === 'DELETE' && url === '/todos') {
      const count = yield* deleteCompletedTodos();
      return json(res, { deleted: count });
    }

    // 404
    return json(res, { error: 'Not found' }, 404);
  });

  Effect.runPromise(
    program.pipe(
      Effect.provide(TodoRepositorySeeded),
      Effect.catchAll((error) => Effect.sync(() => handleError(res, error)))
    )
  );
};

// ============================================================================
// Server
// ============================================================================

const server = http.createServer(handleRequest);

server.listen(config.server.port, config.server.host, () => {
  console.log(\`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   📝 \${config.app.name.padEnd(20)}                         ║
║                                                               ║
║   Server: http://\${config.server.host}:\${String(config.server.port).padEnd(5)}                          ║
║   Environment: \${config.app.env.padEnd(12)}                                 ║
║   Debug: \${String(config.app.debug).padEnd(5)}                                        ║
║                                                               ║
║   Database: \${config.database.host}:\${config.database.port}                              ║
║   Redis: \${config.redis.host}:\${config.redis.port}                                  ║
║   Queue Driver: \${config.queue.driver.padEnd(10)}                               ║
║                                                               ║
║   Endpoints:                                                  ║
║     GET    /              - API info                          ║
║     GET    /health        - Health check                      ║
║     GET    /config        - Config (dev only)                 ║
║     GET    /todos         - List todos                        ║
║     GET    /todos/:id     - Get todo                          ║
║     POST   /todos         - Create todo                       ║
║     PATCH  /todos/:id     - Update todo                       ║
║     DELETE /todos/:id     - Delete todo                       ║
║     POST   /todos/:id/toggle - Toggle completion              ║
║     DELETE /todos         - Clear completed                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
\`);
});
`;
  fs.writeFileSync(path.join(projectPath, 'src/main.ts'), main);
}

// ============================================================================
// Command Entry Point
// ============================================================================

export const newCommand = async (options: NewProjectOptions) => {
  const template = options.template || 'todo';

  const { waitUntilExit } = render(
    <NewProject projectName={options.name} template={template} />
  );

  await waitUntilExit();
};

export default newCommand;
