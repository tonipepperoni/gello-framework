# Gello Framework - Project Overview

## Vision

Gello is a sophisticated backend framework for TypeScript that draws inspiration from the best web frameworks:

- **Laravel's Developer Experience** - Elegant APIs, powerful CLI, convention over configuration
- **Ruby on Rails' Philosophy** - Sensible defaults, developer productivity, batteries included
- **NestJS's Modularity** - Service-oriented architecture, dependency injection, testability
- **Effect's Type Safety** - Functional programming, compile-time error handling, composability
- **Drizzle's Performance** - Type-safe SQL, minimal overhead, excellent DX

---

## MVP Scope (v0.1.0)

### Timeline: 4 Sprints (8 weeks)

| Sprint | Epic | Package | Story Points |
|--------|------|---------|--------------|
| Sprint 1 | Core HTTP Framework | `@gello/core` | 21 |
| Sprint 2 | Database Integration | `@gello/database` | 18 |
| Sprint 3 | Queue System (HIGH PRIORITY) | `@gello/queue` | 24 |
| Sprint 4 | CLI + Example App | `@gello/cli`, `examples/` | 28 |

**Total: 91 story points**

---

## Package Structure

```
gello/
├── packages/
│   ├── core/           # HTTP server, routing, DI, middleware
│   ├── database/       # Drizzle integration, migrations
│   ├── queue/          # Job queue system (HIGH PRIORITY)
│   └── cli/            # Artisan-like CLI commands
├── examples/
│   └── todo-app/       # Reference implementation
├── docs/
│   └── sprints/        # Sprint backlogs
├── nx.json             # NX workspace config
├── package.json        # Root package.json
└── tsconfig.base.json  # Base TypeScript config
```

---

## Technology Stack

### Core
- **Effect** v3.12+ - Functional programming foundation
- **TypeScript** 5.7+ - Type safety
- **Node.js** 20+ - Runtime

### HTTP
- **@effect/platform** - Platform-agnostic HTTP
- **@effect/platform-node** - Node.js adapter
- **@effect/schema** - Validation

### Database
- **Drizzle ORM** - Type-safe queries
- **@effect/sql-drizzle** - Effect integration
- **PostgreSQL** - Primary database

### Queue
- **Custom implementation** - Effect-based
- **Redis** (optional) - Production driver
- **PostgreSQL** - Database driver

### CLI
- **@effect/cli** - CLI framework
- **NX generators** - Code scaffolding

### Testing
- **Vitest** - Test runner
- **@effect/vitest** - Effect integration

---

## Key Patterns (from platform library analysis)

### 1. Service Definition
```typescript
export class HttpServer extends Context.Tag("HttpServer")<
  HttpServer,
  { readonly serve: Effect.Effect<void> }
>() {
  static readonly Default = Layer.effect(HttpServer, implementation)
}
```

### 2. Layer Composition
```typescript
const AppLive = Layer.mergeAll(
  HttpServer.Default,
  Database.layer,
  QueueService.layer
).pipe(
  Layer.provide(ConfigService.Default)
)
```

### 3. Effect-based Handlers
```typescript
const getUser = Effect.gen(function* () {
  const { id } = yield* RouteParams
  const db = yield* Database
  return yield* db.query.users.findFirst({ where: eq(users.id, id) })
})
```

---

## Developer Experience Goals

### CLI Commands
```bash
# Project
gello new my-app           # Create new project
gello dev                  # Development server

# Database
gello make:migration       # Create migration
gello migrate              # Run migrations
gello migrate:rollback     # Rollback

# Queue
gello queue:work           # Start worker
gello queue:status         # Show status

# Generators
gello make:controller      # Create controller
gello make:job             # Create job class
```

### Example Usage
```typescript
// routes/api.ts
import { Router } from "@gello/core"
import { UserController } from "./controllers/UserController"

export const routes = Router.group("/api", [
  Router.resource("/users", UserController)
])

// controllers/UserController.ts
export class UserController {
  static index = Effect.gen(function* () {
    const users = yield* UserService.findAll()
    return Response.json(users)
  })

  static store = Effect.gen(function* () {
    const data = yield* Request.validate(CreateUserSchema)
    const user = yield* UserService.create(data)
    return Response.json(user, { status: 201 })
  })
}
```

---

## Success Criteria

### Technical
- [ ] Test coverage > 80%
- [ ] Zero `any` types in public APIs
- [ ] Request latency p95 < 10ms
- [ ] Queue throughput > 100 jobs/second

### Developer Experience
- [ ] Time to "Hello World" < 5 minutes
- [ ] Time to CRUD API < 30 minutes
- [ ] Clear error messages
- [ ] Comprehensive documentation

---

## Sprint Deliverables

### Sprint 1: Core Foundation
- HTTP server with graceful shutdown
- Type-safe routing system
- Dependency injection via Layers
- Middleware pipeline
- Configuration management

### Sprint 2: Data Persistence
- Drizzle ORM integration
- Migration generation and running
- Repository pattern
- Transaction support
- Connection pooling

### Sprint 3: Background Processing (HIGH PRIORITY)
- Job definition DSL
- Queue dispatching
- Worker implementation
- Retry and failure handling
- Memory, Database, Redis drivers

### Sprint 4: Developer Tooling
- CLI framework with @effect/cli
- Code generators
- Development server
- Example todo application
- Documentation site

---

## Next Steps

1. **Initialize NX workspace** with package structure
2. **Install Effect dependencies** across packages
3. **Begin Sprint 1** - Core HTTP framework
4. **Establish patterns** that will be used throughout

---

## References

- [Effect Documentation](https://effect.website)
- [Drizzle ORM](https://orm.drizzle.team)
- [Laravel Documentation](https://laravel.com/docs) (DX inspiration)
- [Ruby on Rails Guides](https://guides.rubyonrails.org) (philosophy inspiration)
- [NestJS Documentation](https://docs.nestjs.com) (modularity inspiration)
- [@effect/platform](https://github.com/Effect-TS/effect/tree/main/packages/platform) (HTTP foundation)
