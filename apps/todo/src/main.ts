/**
 * Todo List API - Gello Framework Demo
 *
 * Demonstrates proper FP patterns:
 * - Effect-based error handling with typed errors (ADTs)
 * - Dependency injection via Layers
 * - Immutable state with Effect.Ref
 * - Type-safe routing with automatic param injection
 * - Configuration via Config service
 */
import { Effect, Layer, Console } from 'effect';
import { createApp, runApp } from '@gello/core-adapter-node';
import { cors } from '@gello/core-domain-middleware';
import {
  Config,
  layer as configLayer,
  string,
  number,
  boolean,
  environment,
  isProduction,
  env,
} from '@gello/config';

import { TodoRepositorySeeded } from './services/TodoRepository.js';
import { routes } from './routes/index.js';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Application configuration loaded from environment variables.
 * Supports .env files with cascading priority.
 */
const appConfig = {
  // App
  name: env('APP_NAME', 'todo-api'),

  // Server
  port: Number(env('APP_PORT', '3000')),
  host: env('APP_HOST', '0.0.0.0'),

  // Features
  logging: env('APP_LOGGING', 'true') === 'true',
  timing: env('APP_TIMING', 'true') === 'true',

  // Database (for future use)
  database: {
    host: env('DB_HOST', 'localhost'),
    port: Number(env('DB_PORT', '5432')),
    name: env('DB_NAME', 'gello'),
    user: env('DB_USER', 'gello'),
    password: env('DB_PASSWORD', ''),
    ssl: env('DB_SSL', 'false') === 'true',
    poolMin: Number(env('DB_POOL_MIN', '2')),
    poolMax: Number(env('DB_POOL_MAX', '10')),
  },

  // Redis (for future use)
  redis: {
    host: env('REDIS_HOST', 'localhost'),
    port: Number(env('REDIS_PORT', '6379')),
    password: env('REDIS_PASSWORD', ''),
    database: Number(env('REDIS_DATABASE', '0')),
    tls: env('REDIS_TLS', 'false') === 'true',
  },

  // Queue
  queue: {
    driver: env('QUEUE_DRIVER', 'memory') as 'memory' | 'redis',
    defaultQueue: env('QUEUE_DEFAULT', 'default'),
    prefix: env('QUEUE_PREFIX', 'gello:'),
  },
} as const;

// Create Config layer from the loaded config
const AppConfigLayer = configLayer({
  app: {
    name: appConfig.name,
    port: appConfig.port,
    host: appConfig.host,
    logging: appConfig.logging,
    timing: appConfig.timing,
  },
  database: appConfig.database,
  redis: appConfig.redis,
  queue: appConfig.queue,
});

// ============================================================================
// Application
// ============================================================================

const app = createApp({
  name: appConfig.name,
  port: appConfig.port,
  host: appConfig.host,
  logging: appConfig.logging,
  timing: appConfig.timing,
})
  .use(cors({ origins: '*' }))
  .routes(routes);

// ============================================================================
// Startup Banner
// ============================================================================

const banner = Effect.gen(function* () {
  const envName = yield* environment;
  const isProd = yield* isProduction;

  yield* Console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   📝 Todo List API - Gello Framework Demo                    ║
║                                                               ║
║   Server: http://${appConfig.host}:${String(appConfig.port).padEnd(5)}                          ║
║   Environment: ${envName.padEnd(12)}                                 ║
║                                                               ║
║   Database: ${appConfig.database.host}:${appConfig.database.port}                              ║
║   Redis: ${appConfig.redis.host}:${appConfig.redis.port}                                  ║
║   Queue Driver: ${appConfig.queue.driver.padEnd(10)}                               ║
║                                                               ║
║   Endpoints:                                                  ║
║     GET    /              - API info                          ║
║     GET    /health        - Health check                      ║
║     GET    /todos         - List todos (?completed=bool)      ║
║     GET    /todos/:id     - Get todo                          ║
║     POST   /todos         - Create todo                       ║
║     PATCH  /todos/:id     - Update todo                       ║
║     DELETE /todos/:id     - Delete todo                       ║
║     POST   /todos/:id/toggle - Toggle completion              ║
║     DELETE /todos         - Clear completed                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);
});

Effect.runPromise(banner);

// ============================================================================
// Run
// ============================================================================

runApp(app, Layer.mergeAll(
  TodoRepositorySeeded,
  AppConfigLayer,
));
