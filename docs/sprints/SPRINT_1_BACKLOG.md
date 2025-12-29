# Sprint 1: Core Foundation
**Duration:** Weeks 1-2
**Epic:** Epic 1 - Core HTTP Framework
**Story Points:** 26 (expanded for DDD + Hexagonal)
**Package:** `@gello/core-*` (11 sub-libs)

---

## Sprint Goal

Deliver a working HTTP server with type-safe routing and Effect-based dependency injection that enables developers to build basic REST APIs.

> **Architecture Reference:** See [CORE_ARCHITECTURE.md](../CORE_ARCHITECTURE.md) for comprehensive design document with:
> - Hexagonal architecture diagram
> - All 11 sub-lib definitions
> - Complete code examples
> - Definition of Done checklist

---

## User Stories

### US-1.1: HTTP Server Foundation
**As a** developer
**I want** to start an HTTP server using Effect
**So that** I can handle incoming requests with type safety

**Acceptance Criteria:**
- [ ] Server starts on configurable port (default 3000)
- [ ] Graceful shutdown on SIGTERM/SIGINT
- [ ] Health check endpoint at `/health`
- [ ] Request logging with timing
- [ ] Error handling returns proper HTTP status codes

**Story Points:** 5

**Technical Tasks:**
1. Create `HttpServer` service using `@effect/platform`
2. Implement `NodeServer` layer for Node.js runtime
3. Add graceful shutdown using Effect's resource management
4. Create request logging middleware
5. Add global error handler with formatted responses

---

### US-1.2: Type-Safe Routing System
**As a** developer
**I want** to define routes with type-safe parameters
**So that** I get compile-time safety for my API endpoints

**Acceptance Criteria:**
- [ ] Routes support GET, POST, PUT, PATCH, DELETE methods
- [ ] Path parameters are type-safe (e.g., `/users/:id`)
- [ ] Query parameters can be validated
- [ ] Routes can be grouped with prefixes
- [ ] 404 handling for undefined routes

**Story Points:** 5

**Technical Tasks:**
1. Create `Router` class with route registration
2. Implement path parameter extraction with Effect Schema
3. Add route matching algorithm
4. Create route grouping utilities
5. Implement 404 handler

---

### US-1.3: Dependency Injection via Layers
**As a** developer
**I want** to inject services into my route handlers
**So that** I can write testable, modular code

**Acceptance Criteria:**
- [ ] Services defined as Effect Tags
- [ ] Layers compose services automatically
- [ ] Type errors when dependencies missing
- [ ] Services accessible in route handlers
- [ ] Example service (e.g., ConfigService) works end-to-end

**Story Points:** 5

**Technical Tasks:**
1. Create service definition patterns (Context.Tag)
2. Implement Layer composition utilities
3. Create ConfigService as example
4. Wire services into router context
5. Add tests for DI resolution

---

### US-1.4: Basic Middleware Pipeline
**As a** developer
**I want** to apply middleware to routes
**So that** I can handle cross-cutting concerns

**Acceptance Criteria:**
- [ ] Middleware can be applied globally
- [ ] Middleware can be applied per-route
- [ ] Execution order is deterministic
- [ ] Middleware can short-circuit (e.g., auth failure)
- [ ] Built-in: CORS, body parsing, logging

**Story Points:** 4

**Technical Tasks:**
1. Create Middleware type definition
2. Implement middleware pipeline execution
3. Add global middleware registration
4. Add per-route middleware support
5. Create CORS and body parsing middleware

---

### US-1.5: Configuration Management
**As a** developer
**I want** environment-based configuration
**So that** I can manage settings across environments

**Acceptance Criteria:**
- [ ] Load config from environment variables
- [ ] Type-safe configuration with defaults
- [ ] Validation at startup
- [ ] Secrets redacted in logs
- [ ] Example .env.example file

**Story Points:** 2

**Technical Tasks:**
1. Create ConfigService using Effect Config
2. Add environment variable parsing
3. Implement config validation
4. Add secret redaction for logging
5. Create .env.example template

---

## Technical Specifications

### Package Structure (DDD + Hexagonal - 11 libs)

```
libs/core/
├── contracts/           # Ports & shared types (zero deps)
│   └── src/
│       ├── HttpPort.ts
│       ├── RouterPort.ts
│       ├── MiddlewarePort.ts
│       └── errors.ts
├── domain/              # Core domain logic
│   ├── errors/          # Tagged error types
│   ├── routing/         # Route matching & path parsing
│   └── middleware/      # Middleware chain composition
├── http/                # HttpServer service
│   └── src/
│       ├── GelloHttpServer.ts
│       └── ServerConfig.ts
├── router/              # Router service
│   └── src/
│       ├── Router.ts
│       └── RouterBuilder.ts
├── validation/          # Request validation
├── config/              # Configuration service
├── adapters/            # Infrastructure adapters
│   ├── node/            # Node.js adapter
│   └── bun/             # Bun adapter (future)
└── testing/             # Test utilities for consumers
```

> **Full Details:** See [CORE_ARCHITECTURE.md](../CORE_ARCHITECTURE.md)

### Key Dependencies

```json
{
  "dependencies": {
    "effect": "^3.12.5",
    "@effect/platform": "^0.74.4",
    "@effect/platform-node": "^0.69.4",
    "@effect/schema": "^0.77.0"
  },
  "devDependencies": {
    "@effect/vitest": "^0.16.0",
    "vitest": "^2.1.8",
    "typescript": "~5.7.2"
  }
}
```

### Core Patterns (from platform analysis)

**Service Definition:**
```typescript
import { Context, Effect, Layer } from "effect"

export class HttpServer extends Context.Tag("HttpServer")<
  HttpServer,
  { readonly serve: Effect.Effect<void, never, never> }
>() {
  static readonly Default = Layer.effect(
    HttpServer,
    Effect.gen(function* () {
      const config = yield* ConfigService
      // Implementation
    })
  )
}
```

**Router Pattern:**
```typescript
export const router = Router.empty.pipe(
  Router.get("/health", Effect.succeed({ status: "ok" })),
  Router.get("/users/:id", Effect.gen(function* () {
    const { id } = yield* RouteParams
    return { id }
  }))
)
```

---

## Definition of Done

> **Complete Checklist:** See [CORE_ARCHITECTURE.md - Definition of Done](../CORE_ARCHITECTURE.md#definition-of-done-checklist)

### Summary Checklist

- [ ] **A) Contracts** - Ports, schemas, error types (zero deps)
- [ ] **B) Domain Layer** - errors, routing, middleware
- [ ] **C) Application Layer** - http, router, validation, config
- [ ] **D) Infrastructure** - adapter-node, adapter-bun (future)
- [ ] **E) Testing** - TestServer, TestClient, assertions

### Technical Metrics
- [ ] All user stories complete with acceptance criteria met
- [ ] Test coverage > 80%
- [ ] No TypeScript errors in strict mode
- [ ] Server starts in < 1 second
- [ ] Request latency p95 < 5ms
- [ ] Example "Hello World" application works

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Effect learning curve slows development | High | Medium | Pair programming, reference platform library |
| Router performance issues | Medium | Low | Early benchmarking, optimize hot paths |
| Middleware composition complexity | Medium | Medium | Keep initial implementation simple |

---

## Sprint Ceremonies

- **Sprint Planning:** Day 1
- **Daily Standups:** Daily, 15 min
- **Sprint Review:** Day 10
- **Sprint Retrospective:** Day 10

---

## Success Metrics

- HTTP server starts in < 1 second
- Request latency p95 < 5ms for simple routes
- Zero `any` types in public APIs
- 100% of acceptance criteria met
