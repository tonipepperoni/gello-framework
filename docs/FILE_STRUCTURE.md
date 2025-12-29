# Gello Framework - File Structure (Platform-Aligned)

Based on the `../platform` architecture with:
- **Vite** for libs (fast builds, HMR, dts generation)
- **esbuild** for tools (ultra-fast CLI bundling)
- **Vitest** for testing (Vite-native, fast)
- **NX** for orchestration (caching, task graph)

---

```
gello/
│
├── apps/
│   └── todo-app/                         # Example application
│       ├── src/
│       │   ├── main.ts                   # Application entry
│       │   ├── app.ts                    # App composition
│       │   ├── routes/
│       │   │   ├── index.ts
│       │   │   └── api.ts
│       │   ├── controllers/
│       │   │   ├── TodoController.ts
│       │   │   └── UserController.ts
│       │   ├── services/
│       │   │   ├── TodoService.ts
│       │   │   └── UserService.ts
│       │   ├── jobs/
│       │   │   ├── SendWelcomeEmail.ts
│       │   │   └── CleanupOldTodos.ts
│       │   └── schema/
│       │       ├── index.ts
│       │       ├── users.ts
│       │       └── todos.ts
│       ├── migrations/
│       │   ├── 0001_create_users.sql
│       │   └── 0002_create_todos.sql
│       ├── test/
│       │   └── app.test.ts
│       ├── .env.example
│       ├── drizzle.config.ts
│       ├── package.json
│       ├── project.json
│       ├── tsconfig.json
│       ├── tsconfig.app.json
│       └── vite.config.ts
│
├── libs/
│   │
│   ├── core/                             # @gello/core domain
│   │   │                                 # DDD + Hexagonal Architecture (11 libs)
│   │   │                                 # See docs/CORE_ARCHITECTURE.md
│   │   │
│   │   ├── contracts/                    # Ports & shared types (zero deps)
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── HttpPort.ts           # HttpServer port interface
│   │   │   │   ├── RouterPort.ts         # Router port interface
│   │   │   │   ├── MiddlewarePort.ts     # Middleware port interface
│   │   │   │   ├── ConfigPort.ts         # Config port interface
│   │   │   │   ├── Request.schema.ts     # Request/Response schemas
│   │   │   │   └── errors.ts             # Tagged error types
│   │   │   └── vite.config.ts
│   │   │
│   │   ├── domain/                       # Domain layer (business logic)
│   │   │   │
│   │   │   ├── errors/                   # Tagged error types
│   │   │   │   ├── src/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── HttpError.ts      # HTTP error factories
│   │   │   │   │   ├── ValidationError.ts
│   │   │   │   │   └── ConfigError.ts
│   │   │   │   └── vite.config.ts
│   │   │   │
│   │   │   ├── routing/                  # Route matching & path parsing
│   │   │   │   ├── src/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── PathPattern.ts    # Path parsing
│   │   │   │   │   ├── RouteMatch.ts     # Route matching algorithm
│   │   │   │   │   ├── RouteParams.ts    # Path params Context.Tag
│   │   │   │   │   └── QueryParams.ts    # Query params Context.Tag
│   │   │   │   └── vite.config.ts
│   │   │   │
│   │   │   └── middleware/               # Middleware chain logic
│   │   │       ├── src/
│   │   │       │   ├── index.ts
│   │   │       │   ├── Middleware.ts     # Middleware type
│   │   │       │   ├── compose.ts        # Chain composition
│   │   │       │   ├── cors.ts           # CORS middleware
│   │   │       │   ├── logging.ts        # Logging middleware
│   │   │       │   ├── timing.ts         # Request timing
│   │   │       │   └── errorHandler.ts   # Error handler
│   │   │       └── vite.config.ts
│   │   │
│   │   ├── http/                         # HttpServer service
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── GelloHttpServer.ts    # Main server service
│   │   │   │   ├── ServerConfig.ts       # Server configuration
│   │   │   │   └── GlobalMiddleware.ts   # Global middleware Layer
│   │   │   └── vite.config.ts
│   │   │
│   │   ├── router/                       # Router service
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── Router.ts             # Router Context.Tag
│   │   │   │   ├── RouterBuilder.ts      # Fluent builder API
│   │   │   │   └── responses.ts          # json(), text(), redirect()
│   │   │   └── vite.config.ts
│   │   │
│   │   ├── validation/                   # Request validation
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── validateBody.ts       # Body validation
│   │   │   │   ├── validateQuery.ts      # Query params validation
│   │   │   │   ├── validateParams.ts     # Path params validation
│   │   │   │   └── validateRequest.ts    # Combined validation
│   │   │   └── vite.config.ts
│   │   │
│   │   ├── config/                       # Configuration service
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── ConfigService.ts      # Config Context.Tag
│   │   │   │   └── AppConfig.schema.ts   # App config schema
│   │   │   └── vite.config.ts
│   │   │
│   │   ├── adapters/                     # Infrastructure adapters
│   │   │   │
│   │   │   ├── node/                     # Node.js adapter
│   │   │   │   ├── src/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── NodeServerLive.ts # @effect/platform-node
│   │   │   │   │   ├── createNodeApp.ts  # App composition helper
│   │   │   │   │   └── runMain.ts        # Entry point helper
│   │   │   │   └── vite.config.ts
│   │   │   │
│   │   │   └── bun/                      # Bun adapter (future)
│   │   │       ├── src/
│   │   │       │   ├── index.ts
│   │   │       │   └── BunServerLive.ts
│   │   │       └── vite.config.ts
│   │   │
│   │   └── testing/                      # Test utilities for CONSUMERS
│   │       ├── src/                      # NOT tests for core libs
│   │       │   ├── index.ts              # Each lib has own tests in src/*.test.ts
│   │       │   ├── TestServer.ts         # In-memory test server
│   │       │   ├── TestClient.ts         # HTTP test client
│   │       │   ├── TestConfigLayer.ts    # Mock config Layer
│   │       │   └── assertions.ts         # expectStatus(), expectJson()
│   │       └── vite.config.ts
│   │
│   ├── database/                         # @gello/database domain
│   │   │
│   │   ├── drizzle/                      # Drizzle integration
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── DatabaseService.ts
│   │   │   │   ├── DrizzleClient.ts
│   │   │   │   └── types.ts
│   │   │   ├── package.json
│   │   │   ├── project.json
│   │   │   ├── tsconfig.json
│   │   │   ├── tsconfig.lib.json
│   │   │   └── vite.config.ts
│   │   │
│   │   ├── migrations/                   # Migration system
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── MigrationRunner.ts
│   │   │   │   ├── MigrationTable.ts
│   │   │   │   └── types.ts
│   │   │   ├── package.json
│   │   │   ├── project.json
│   │   │   ├── tsconfig.json
│   │   │   ├── tsconfig.lib.json
│   │   │   └── vite.config.ts
│   │   │
│   │   └── repository/                   # Repository pattern
│   │       ├── src/
│   │       │   ├── index.ts
│   │       │   ├── Repository.ts
│   │       │   └── BaseRepo.ts
│   │       ├── package.json
│   │       ├── project.json
│   │       ├── tsconfig.json
│   │       ├── tsconfig.lib.json
│   │       └── vite.config.ts
│   │
│   ├── queue/                            # @gello/queue domain (HIGH PRIORITY)
│   │   │                                 # DDD + Hexagonal Architecture (16 libs)
│   │   │                                 # See docs/QUEUE_ARCHITECTURE.md
│   │   │
│   │   ├── contracts/                    # Ports & shared types (zero deps)
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── Job.schema.ts         # Job schemas with @effect/schema
│   │   │   │   ├── QueuePort.ts          # Queue port interface
│   │   │   │   ├── IdempotencyPort.ts    # Idempotency port interface
│   │   │   │   ├── DLQPort.ts            # DLQ port interface
│   │   │   │   ├── ObservabilityPort.ts  # Metrics/tracing port
│   │   │   │   └── errors.ts             # Tagged error types
│   │   │   ├── package.json
│   │   │   ├── project.json
│   │   │   └── vite.config.ts
│   │   │
│   │   ├── domain/                       # Domain layer (business logic)
│   │   │   │
│   │   │   ├── job/                      # Job entity & value objects
│   │   │   │   ├── src/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── JobDefinition.ts  # defineJob() API
│   │   │   │   │   ├── JobMeta.ts        # Job metadata
│   │   │   │   │   └── JobId.ts          # Job ID generation
│   │   │   │   └── vite.config.ts
│   │   │   │
│   │   │   ├── retry/                    # Retry policies & backoff
│   │   │   │   ├── src/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── RetryPolicy.ts    # Backoff strategies
│   │   │   │   │   └── BackoffStrategy.ts
│   │   │   │   └── vite.config.ts
│   │   │   │
│   │   │   ├── failure/                  # Failure classification
│   │   │   │   ├── src/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── FailureClassifier.ts
│   │   │   │   │   └── FailureType.ts    # transient/permanent/fatal
│   │   │   │   └── vite.config.ts
│   │   │   │
│   │   │   └── idempotency/              # Exactly-once guarantees
│   │   │       ├── src/
│   │   │       │   ├── index.ts
│   │   │       │   ├── IdempotencyKey.ts
│   │   │       │   └── IdempotencyState.ts
│   │   │       └── vite.config.ts
│   │   │
│   │   ├── producer/                     # Producer SDK
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── QueueProducer.ts      # dispatch(), dispatchAfter()
│   │   │   │   ├── DispatchOptions.ts
│   │   │   │   └── BatchDispatch.ts
│   │   │   └── vite.config.ts
│   │   │
│   │   ├── worker/                       # Worker runtime
│   │   │   │
│   │   │   ├── core/                     # Worker loop & lifecycle
│   │   │   │   ├── src/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── Worker.ts         # Main worker loop
│   │   │   │   │   ├── WorkerConfig.ts
│   │   │   │   │   └── JobProcessor.ts
│   │   │   │   └── vite.config.ts
│   │   │   │
│   │   │   ├── pool/                     # Worker pool management
│   │   │   │   ├── src/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── WorkerPool.ts     # N workers in parallel
│   │   │   │   │   └── Concurrency.ts    # Semaphore control
│   │   │   │   └── vite.config.ts
│   │   │   │
│   │   │   └── signals/                  # Graceful shutdown
│   │   │       ├── src/
│   │   │       │   ├── index.ts
│   │   │       │   ├── SignalHandler.ts  # SIGTERM/SIGINT
│   │   │       │   └── GracefulShutdown.ts
│   │   │       └── vite.config.ts
│   │   │
│   │   ├── adapters/                     # Infrastructure adapters
│   │   │   │
│   │   │   ├── memory/                   # In-memory (dev/test)
│   │   │   │   ├── src/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── MemoryAdapter.ts
│   │   │   │   └── vite.config.ts
│   │   │   │
│   │   │   ├── redis/                    # Redis driver (production)
│   │   │   │   ├── src/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── RedisAdapter.ts   # BRPOPLPUSH for reliability
│   │   │   │   └── vite.config.ts
│   │   │   │
│   │   │   └── postgres/                 # PostgreSQL driver
│   │   │       ├── src/
│   │   │       │   ├── index.ts
│   │   │       │   ├── PostgresAdapter.ts
│   │   │       │   └── schema.ts         # Drizzle job tables
│   │   │       └── vite.config.ts
│   │   │
│   │   ├── dlq/                          # Dead letter queue
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── DLQ.ts
│   │   │   │   └── FailedJob.ts
│   │   │   └── vite.config.ts
│   │   │
│   │   ├── observability/                # Metrics, tracing, logging
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── QueueMetrics.ts       # Effect Metrics
│   │   │   │   ├── QueueTracing.ts       # OpenTelemetry
│   │   │   │   └── QueueLogging.ts       # Structured logs
│   │   │   └── vite.config.ts
│   │   │
│   │   ├── ops/                          # Operator tooling & CLI
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── commands/
│   │   │   │   │   ├── work.ts           # queue:work
│   │   │   │   │   ├── status.ts         # queue:status
│   │   │   │   │   ├── retry.ts          # queue:retry
│   │   │   │   │   ├── failed.ts         # queue:failed
│   │   │   │   │   └── purge.ts          # queue:purge
│   │   │   │   └── HealthCheck.ts        # K8s probes
│   │   │   └── vite.config.ts
│   │   │
│   │   └── testing/                      # Test utilities for CONSUMERS
│   │       ├── src/                      # NOT tests for queue libs
│   │       │   ├── index.ts              # Each lib has own tests in src/*.test.ts
│   │       │   ├── TestQueue.ts          # In-memory test queue Layer
│   │       │   ├── TestWorker.ts         # Synchronous test worker Layer
│   │       │   ├── TestDLQ.ts            # In-memory DLQ Layer
│   │       │   └── arbitraries.ts        # Property-based test generators
│   │       └── vite.config.ts
│   │
│   └── testing/                          # @gello/testing domain
│       │
│       ├── utilities/                    # Test utilities
│       │   ├── src/
│       │   │   ├── index.ts
│       │   │   ├── TestServer.ts
│       │   │   ├── TestDatabase.ts
│       │   │   └── factories.ts
│       │   ├── package.json
│       │   ├── project.json
│       │   ├── tsconfig.json
│       │   ├── tsconfig.lib.json
│       │   └── vite.config.ts
│       │
│       └── mocks/                        # Mock implementations
│           ├── src/
│           │   ├── index.ts
│           │   ├── MockQueue.ts
│           │   └── MockDatabase.ts
│           ├── package.json
│           ├── project.json
│           ├── tsconfig.json
│           ├── tsconfig.lib.json
│           └── vite.config.ts
│
├── tools/
│   │
│   ├── cli/                              # gello CLI (esbuild)
│   │   ├── src/
│   │   │   ├── index.ts                  # CLI entry
│   │   │   ├── commands/
│   │   │   │   ├── dev.ts
│   │   │   │   ├── serve.ts
│   │   │   │   ├── make/
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── migration.ts
│   │   │   │   │   └── job.ts
│   │   │   │   ├── migrate/
│   │   │   │   │   ├── run.ts
│   │   │   │   │   ├── rollback.ts
│   │   │   │   │   └── status.ts
│   │   │   │   └── queue/
│   │   │   │       ├── work.ts
│   │   │   │       ├── status.ts
│   │   │   │       └── retry.ts
│   │   │   └── templates/
│   │   │       ├── controller.ts.template
│   │   │       ├── migration.ts.template
│   │   │       └── job.ts.template
│   │   ├── bin/
│   │   │   └── gello.ts
│   │   ├── esbuild.config.mjs            # esbuild for fast CLI bundling
│   │   ├── package.json
│   │   ├── project.json
│   │   └── tsconfig.json
│   │
│   ├── db-seeder/                        # Database seeder (esbuild)
│   │   ├── src/
│   │   │   └── seed.ts
│   │   ├── esbuild.config.mjs
│   │   ├── package.json
│   │   ├── project.json
│   │   └── tsconfig.json
│   │
│   └── generators/                       # NX generators
│       ├── src/
│       │   ├── lib/
│       │   │   └── generator.ts
│       │   └── generators.json
│       ├── package.json
│       ├── project.json
│       └── tsconfig.json
│
├── docs/
│   ├── PROJECT_OVERVIEW.md
│   ├── FILE_STRUCTURE.md
│   └── sprints/
│       ├── SPRINT_1_BACKLOG.md
│       ├── SPRINT_2_BACKLOG.md
│       └── SPRINT_3_BACKLOG.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
│
├── .env.example
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── nx.json                               # NX workspace config
├── package.json                          # Root package.json
├── pnpm-workspace.yaml                   # PNPM workspaces
├── tsconfig.base.json                    # Base TypeScript config
├── vitest.workspace.ts                   # Vitest workspace
└── README.md
```

---

## Build Tool Matrix

| Location | Build Tool | Purpose |
|----------|------------|---------|
| `libs/**/*` | **Vite** | Fast HMR, dts generation, ES/CJS output |
| `tools/**/*` | **esbuild** | Ultra-fast CLI bundling |
| `apps/**/*` | **Vite** | Dev server, HMR, production builds |
| Testing | **Vitest** | Vite-native, fast, watch mode |

---

## Path Aliases (tsconfig.base.json)

```json
{
  "paths": {
    "@gello/core-contracts": ["libs/core/contracts/src/index.ts"],
    "@gello/core-domain-errors": ["libs/core/domain/errors/src/index.ts"],
    "@gello/core-domain-routing": ["libs/core/domain/routing/src/index.ts"],
    "@gello/core-domain-middleware": ["libs/core/domain/middleware/src/index.ts"],
    "@gello/core-http": ["libs/core/http/src/index.ts"],
    "@gello/core-router": ["libs/core/router/src/index.ts"],
    "@gello/core-validation": ["libs/core/validation/src/index.ts"],
    "@gello/core-config": ["libs/core/config/src/index.ts"],
    "@gello/core-adapter-node": ["libs/core/adapters/node/src/index.ts"],
    "@gello/core-adapter-bun": ["libs/core/adapters/bun/src/index.ts"],
    "@gello/core-testing": ["libs/core/testing/src/index.ts"],

    "@gello/database-drizzle": ["libs/database/drizzle/src/index.ts"],
    "@gello/database-migrations": ["libs/database/migrations/src/index.ts"],
    "@gello/database-repository": ["libs/database/repository/src/index.ts"],

    "@gello/queue-contracts": ["libs/queue/contracts/src/index.ts"],
    "@gello/queue-domain-job": ["libs/queue/domain/job/src/index.ts"],
    "@gello/queue-domain-retry": ["libs/queue/domain/retry/src/index.ts"],
    "@gello/queue-domain-failure": ["libs/queue/domain/failure/src/index.ts"],
    "@gello/queue-domain-idempotency": ["libs/queue/domain/idempotency/src/index.ts"],
    "@gello/queue-producer": ["libs/queue/producer/src/index.ts"],
    "@gello/queue-worker-core": ["libs/queue/worker/core/src/index.ts"],
    "@gello/queue-worker-pool": ["libs/queue/worker/pool/src/index.ts"],
    "@gello/queue-worker-signals": ["libs/queue/worker/signals/src/index.ts"],
    "@gello/queue-adapter-memory": ["libs/queue/adapters/memory/src/index.ts"],
    "@gello/queue-adapter-redis": ["libs/queue/adapters/redis/src/index.ts"],
    "@gello/queue-adapter-postgres": ["libs/queue/adapters/postgres/src/index.ts"],
    "@gello/queue-dlq": ["libs/queue/dlq/src/index.ts"],
    "@gello/queue-observability": ["libs/queue/observability/src/index.ts"],
    "@gello/queue-ops": ["libs/queue/ops/src/index.ts"],
    "@gello/queue-testing": ["libs/queue/testing/src/index.ts"],

    "@gello/testing-utilities": ["libs/testing/utilities/src/index.ts"],
    "@gello/testing-mocks": ["libs/testing/mocks/src/index.ts"]
  }
}
```

---

## Key Configuration Files

### vite.config.ts (Library Pattern)

```typescript
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/libs/core/http',

  plugins: [
    nxViteTsPaths(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],

  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
    ssr: true,
    lib: {
      entry: path.join(__dirname, 'src/index.ts'),
      name: 'gello-core-http',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [/^node:/, /^effect/, /^@effect/, 'tslib'],
    },
  },

  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
    },
  },
});
```

### esbuild.config.mjs (Tools Pattern)

```javascript
import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/gello.js',
  format: 'esm',
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
  external: ['effect', '@effect/*'],
});

console.log('CLI built successfully');
```

### project.json (Library Pattern)

```json
{
  "name": "@gello/core-http",
  "$schema": "../../../../node_modules/nx/schemas/project-schema.json",
  "tags": ["core", "type:lib", "layer:infrastructure"],
  "sourceRoot": "libs/core/http/src",
  "projectType": "library",
  "targets": {
    "build": {
      "command": "vite build",
      "options": { "cwd": "libs/core/http" },
      "dependsOn": ["^build"],
      "cache": true,
      "inputs": ["production", "^production"],
      "outputs": ["{projectRoot}/dist"]
    },
    "test": {
      "command": "vitest run",
      "options": { "cwd": "libs/core/http" },
      "cache": true
    },
    "test:watch": {
      "command": "vitest",
      "options": { "cwd": "libs/core/http" }
    },
    "typecheck": {
      "command": "tsc --build --emitDeclarationOnly",
      "options": { "cwd": "libs/core/http" },
      "dependsOn": ["build", "^typecheck"],
      "cache": true
    },
    "lint": {
      "executor": "@nx/eslint:lint"
    }
  }
}
```

### vitest.workspace.ts

```typescript
export default [
  'libs/**/vite.config.ts',
  'apps/**/vite.config.ts'
];
```

---

## Package Dependencies

```
┌──────────────────────────────────────────────────────────────────┐
│ Core Domain (DDD + Hexagonal - 11 libs)                         │
│                                                                  │
│ core/contracts (no deps - ports & schemas)                      │
│        ↓                                                        │
│ core/domain/* (errors, routing, middleware)                     │
│        ↓                                                        │
│ ┌──────┼──────┬───────────────────────┐                         │
│ ↓      ↓      ↓                       ↓                         │
│ http   router validation           config                       │
│ │         │         │                 │                         │
│ └─────────┼─────────┘                 │                         │
│           ↓                           │                         │
│    ┌──────┴──────┐                    │                         │
│    ↓             ↓                    ↓                         │
│ adapter-node  adapter-bun       core-testing                    │
└──────────────────────────────────────────────────────────────────┘
       ↓
libs/database/drizzle ← libs/database/migrations ← libs/database/repository
       ↓
┌──────────────────────────────────────────────────────────────────┐
│ Queue Domain (DDD + Hexagonal - 16 libs)                        │
│                                                                  │
│ queue/contracts (no deps - ports & schemas)                     │
│        ↓                                                        │
│ queue/domain/* (job, retry, failure, idempotency)               │
│        ↓                                                        │
│ ┌──────┼──────┬───────────────────────┐                         │
│ ↓      ↓      ↓                       ↓                         │
│ producer  worker/*        adapters/* (memory, redis, postgres)  │
│ │         (core, pool,         │                                │
│ │          signals)            │                                │
│ │              ↓               ↓                                │
│ │           dlq ←──────────────┘                                │
│ │              ↓                                                │
│ └──────> observability                                          │
│              ↓                                                  │
│           ops (CLI)                                             │
│              ↓                                                  │
│          testing                                                │
└──────────────────────────────────────────────────────────────────┘
       ↓
tools/cli (depends on all libs)
       ↓
apps/todo-app (depends on all libs)
```

---

## DX Features

### Fast Development
- **Vite HMR** - Instant hot module replacement
- **esbuild** - Sub-second CLI builds
- **Vitest** - Lightning-fast tests with watch mode
- **NX caching** - Never rebuild unchanged code

### Commands
```bash
# Development
pnpm dev                    # Start todo-app with HMR
pnpm test                   # Run all tests
pnpm test:watch             # Watch mode

# Build
pnpm build                  # Build all packages
nx build @gello/core-http   # Build single package

# CLI (after build)
pnpm gello dev              # Start dev server
pnpm gello make:controller  # Generate controller
pnpm gello migrate          # Run migrations
pnpm gello queue:work       # Start worker
```
