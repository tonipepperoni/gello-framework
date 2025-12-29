# NX Generation Plan

## Libraries to Generate

### Core Domain (`libs/core/*`) - DDD + Hexagonal Architecture

> See [CORE_ARCHITECTURE.md](./CORE_ARCHITECTURE.md) for comprehensive design document.

#### Contracts Layer (Zero Dependencies)

| Name | Type | Bundler | Tags | Command |
|------|------|---------|------|---------|
| `core-contracts` | `@nx/js:lib` | vite | `core, type:lib, layer:contracts` | `nx g @nx/js:lib contracts --directory=libs/core --bundler=vite --unitTestRunner=vitest` |

#### Domain Layer (Business Logic)

| Name | Type | Bundler | Tags | Command |
|------|------|---------|------|---------|
| `core-domain-errors` | `@nx/js:lib` | vite | `core, type:lib, layer:domain` | `nx g @nx/js:lib errors --directory=libs/core/domain --bundler=vite --unitTestRunner=vitest` |
| `core-domain-routing` | `@nx/js:lib` | vite | `core, type:lib, layer:domain` | `nx g @nx/js:lib routing --directory=libs/core/domain --bundler=vite --unitTestRunner=vitest` |
| `core-domain-middleware` | `@nx/js:lib` | vite | `core, type:lib, layer:domain` | `nx g @nx/js:lib middleware --directory=libs/core/domain --bundler=vite --unitTestRunner=vitest` |

#### Application Layer (Services)

| Name | Type | Bundler | Tags | Command |
|------|------|---------|------|---------|
| `core-http` | `@nx/js:lib` | vite | `core, type:lib, layer:application` | `nx g @nx/js:lib http --directory=libs/core --bundler=vite --unitTestRunner=vitest` |
| `core-router` | `@nx/js:lib` | vite | `core, type:lib, layer:application` | `nx g @nx/js:lib router --directory=libs/core --bundler=vite --unitTestRunner=vitest` |
| `core-validation` | `@nx/js:lib` | vite | `core, type:lib, layer:application` | `nx g @nx/js:lib validation --directory=libs/core --bundler=vite --unitTestRunner=vitest` |
| `core-config` | `@nx/js:lib` | vite | `core, type:lib, layer:application` | `nx g @nx/js:lib config --directory=libs/core --bundler=vite --unitTestRunner=vitest` |

#### Infrastructure Layer (Adapters)

| Name | Type | Bundler | Tags | Command |
|------|------|---------|------|---------|
| `core-adapter-node` | `@nx/js:lib` | vite | `core, type:lib, layer:infrastructure` | `nx g @nx/js:lib node --directory=libs/core/adapters --bundler=vite --unitTestRunner=vitest` |
| `core-adapter-bun` | `@nx/js:lib` | vite | `core, type:lib, layer:infrastructure` | `nx g @nx/js:lib bun --directory=libs/core/adapters --bundler=vite --unitTestRunner=vitest` |

#### Testing Utilities

| Name | Type | Bundler | Tags | Command |
|------|------|---------|------|---------|
| `core-testing` | `@nx/js:lib` | vite | `core, type:lib, layer:testing` | `nx g @nx/js:lib testing --directory=libs/core --bundler=vite --unitTestRunner=vitest` |

> **Note:** `core-testing` provides TestServer, TestClient for **consumers**. Each core lib has its own tests in `src/*.test.ts`.

### Database Domain (`libs/database/*`)

| Name | Type | Bundler | Tags | Command |
|------|------|---------|------|---------|
| `database-drizzle` | `@nx/js:lib` | vite | `database, type:lib` | `nx g @nx/js:lib drizzle --directory=libs/database --bundler=vite --unitTestRunner=vitest` |
| `database-migrations` | `@nx/js:lib` | vite | `database, type:lib` | `nx g @nx/js:lib migrations --directory=libs/database --bundler=vite --unitTestRunner=vitest` |
| `database-repository` | `@nx/js:lib` | vite | `database, type:lib` | `nx g @nx/js:lib repository --directory=libs/database --bundler=vite --unitTestRunner=vitest` |

### Queue Domain (`libs/queue/*`) - HIGH PRIORITY - DDD + Hexagonal Architecture

> See [QUEUE_ARCHITECTURE.md](./QUEUE_ARCHITECTURE.md) for comprehensive design document.

#### Contracts Layer (Zero Dependencies)

| Name | Type | Bundler | Tags | Command |
|------|------|---------|------|---------|
| `queue-contracts` | `@nx/js:lib` | vite | `queue, type:lib, layer:contracts` | `nx g @nx/js:lib contracts --directory=libs/queue --bundler=vite --unitTestRunner=vitest` |

#### Domain Layer (Business Logic)

| Name | Type | Bundler | Tags | Command |
|------|------|---------|------|---------|
| `queue-domain-job` | `@nx/js:lib` | vite | `queue, type:lib, layer:domain` | `nx g @nx/js:lib job --directory=libs/queue/domain --bundler=vite --unitTestRunner=vitest` |
| `queue-domain-retry` | `@nx/js:lib` | vite | `queue, type:lib, layer:domain` | `nx g @nx/js:lib retry --directory=libs/queue/domain --bundler=vite --unitTestRunner=vitest` |
| `queue-domain-failure` | `@nx/js:lib` | vite | `queue, type:lib, layer:domain` | `nx g @nx/js:lib failure --directory=libs/queue/domain --bundler=vite --unitTestRunner=vitest` |
| `queue-domain-idempotency` | `@nx/js:lib` | vite | `queue, type:lib, layer:domain` | `nx g @nx/js:lib idempotency --directory=libs/queue/domain --bundler=vite --unitTestRunner=vitest` |

#### Application Layer (Use Cases)

| Name | Type | Bundler | Tags | Command |
|------|------|---------|------|---------|
| `queue-producer` | `@nx/js:lib` | vite | `queue, type:lib, layer:application` | `nx g @nx/js:lib producer --directory=libs/queue --bundler=vite --unitTestRunner=vitest` |
| `queue-worker-core` | `@nx/js:lib` | vite | `queue, type:lib, layer:application` | `nx g @nx/js:lib core --directory=libs/queue/worker --bundler=vite --unitTestRunner=vitest` |
| `queue-worker-pool` | `@nx/js:lib` | vite | `queue, type:lib, layer:application` | `nx g @nx/js:lib pool --directory=libs/queue/worker --bundler=vite --unitTestRunner=vitest` |
| `queue-worker-signals` | `@nx/js:lib` | vite | `queue, type:lib, layer:application` | `nx g @nx/js:lib signals --directory=libs/queue/worker --bundler=vite --unitTestRunner=vitest` |

#### Infrastructure Layer (Adapters)

| Name | Type | Bundler | Tags | Command |
|------|------|---------|------|---------|
| `queue-adapter-memory` | `@nx/js:lib` | vite | `queue, type:lib, layer:infrastructure` | `nx g @nx/js:lib memory --directory=libs/queue/adapters --bundler=vite --unitTestRunner=vitest` |
| `queue-adapter-redis` | `@nx/js:lib` | vite | `queue, type:lib, layer:infrastructure` | `nx g @nx/js:lib redis --directory=libs/queue/adapters --bundler=vite --unitTestRunner=vitest` |
| `queue-adapter-postgres` | `@nx/js:lib` | vite | `queue, type:lib, layer:infrastructure` | `nx g @nx/js:lib postgres --directory=libs/queue/adapters --bundler=vite --unitTestRunner=vitest` |

#### Supporting Libraries

| Name | Type | Bundler | Tags | Command |
|------|------|---------|------|---------|
| `queue-dlq` | `@nx/js:lib` | vite | `queue, type:lib, layer:infrastructure` | `nx g @nx/js:lib dlq --directory=libs/queue --bundler=vite --unitTestRunner=vitest` |
| `queue-observability` | `@nx/js:lib` | vite | `queue, type:lib, layer:infrastructure` | `nx g @nx/js:lib observability --directory=libs/queue --bundler=vite --unitTestRunner=vitest` |
| `queue-ops` | `@nx/js:lib` | vite | `queue, type:lib, layer:infrastructure` | `nx g @nx/js:lib ops --directory=libs/queue --bundler=vite --unitTestRunner=vitest` |
| `queue-testing` | `@nx/js:lib` | vite | `queue, type:lib, layer:testing` | `nx g @nx/js:lib testing --directory=libs/queue --bundler=vite --unitTestRunner=vitest` |

> **Note:** `queue-testing` provides test utilities (TestQueue, TestWorker, fixtures) for **consumers** of the queue system. Each queue lib has its own tests colocated in `src/*.test.ts`.

### Testing Domain (`libs/testing/*`)

| Name | Type | Bundler | Tags | Command |
|------|------|---------|------|---------|
| `testing-utilities` | `@nx/js:lib` | vite | `testing, type:lib` | `nx g @nx/js:lib utilities --directory=libs/testing --bundler=vite --unitTestRunner=vitest` |
| `testing-mocks` | `@nx/js:lib` | vite | `testing, type:lib` | `nx g @nx/js:lib mocks --directory=libs/testing --bundler=vite --unitTestRunner=vitest` |

## Tools to Generate

| Name | Type | Bundler | Tags | Command |
|------|------|---------|------|---------|
| `cli` | `@nx/js:lib` | esbuild | `tools, type:cli` | `nx g @nx/js:lib cli --directory=tools --bundler=esbuild --unitTestRunner=vitest` |
| `db-seeder` | `@nx/js:lib` | esbuild | `tools, type:cli` | `nx g @nx/js:lib db-seeder --directory=tools --bundler=esbuild --unitTestRunner=vitest` |

## Applications to Generate

| Name | Type | Bundler | Tags | Command |
|------|------|---------|------|---------|
| `todo-app` | `@nx/node:app` | vite | `app, type:app` | `nx g @nx/node:application todo-app --directory=apps --bundler=esbuild` |

## Generation Order

1. Install dependencies first
2. Generate libs in dependency order:
   - **Core Domain (DDD + Hexagonal - 11 libs)**:
     - core-contracts (no deps - ports & schemas)
     - core-domain-errors (depends on contracts)
     - core-domain-routing (depends on contracts, errors)
     - core-domain-middleware (depends on contracts, errors)
     - core-http (depends on contracts, domain-*)
     - core-router (depends on contracts, domain-routing)
     - core-validation (depends on contracts, domain-errors)
     - core-config (depends on contracts)
     - core-adapter-node (depends on http, router)
     - core-adapter-bun (depends on http, router) [future]
     - core-testing (depends on contracts, router)
   - database-drizzle (depends on core-config)
   - database-migrations (depends on drizzle)
   - database-repository (depends on drizzle)
   - **Queue Domain (DDD + Hexagonal - 16 libs)**:
     - queue-contracts (no deps - ports & schemas)
     - queue-domain-job (depends on contracts)
     - queue-domain-retry (depends on contracts)
     - queue-domain-failure (depends on contracts)
     - queue-domain-idempotency (depends on contracts)
     - queue-producer (depends on contracts, domain-job)
     - queue-worker-core (depends on contracts, domain-*)
     - queue-worker-pool (depends on worker-core)
     - queue-worker-signals (depends on worker-core)
     - queue-adapter-memory (depends on contracts)
     - queue-adapter-redis (depends on contracts)
     - queue-adapter-postgres (depends on contracts, database)
     - queue-dlq (depends on contracts, adapters)
     - queue-observability (depends on contracts)
     - queue-ops (depends on worker, dlq)
     - queue-testing (depends on contracts, adapter-memory)
   - testing-utilities
   - testing-mocks
3. Generate tools
4. Generate apps

## Core Domain Dependency Graph

```
core-contracts (no deps)
       ↓
core-domain-errors ← core-domain-routing ← core-domain-middleware
       ↓                    ↓                      ↓
       └────────────────────┼──────────────────────┘
                            ↓
              ┌─────────────┼─────────────┐
              ↓             ↓             ↓
        core-http     core-router   core-validation
              │             │             │
              └─────────────┼─────────────┘
                            ↓
                      core-config
                            ↓
              ┌─────────────┼─────────────┐
              ↓             ↓             ↓
        adapter-node   adapter-bun   core-testing
```

## Queue Domain Dependency Graph

```
queue-contracts (no deps)
       ↓
queue-domain-job ← queue-domain-retry ← queue-domain-failure
       ↓                    ↓                    ↓
       └────────────────────┼────────────────────┘
                            ↓
              queue-domain-idempotency
                            ↓
       ┌────────────────────┼────────────────────┐
       ↓                    ↓                    ↓
queue-producer      queue-worker-core    queue-adapters/*
       │                    │                    │
       │            ┌───────┼───────┐           │
       │            ↓       ↓       ↓           │
       │      pool    signals    dlq ←──────────┘
       │            └───────┼───────┘
       │                    ↓
       └────────────> queue-observability
                            ↓
                       queue-ops
                            ↓
                      queue-testing
```
