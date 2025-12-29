<p align="center">
  <pre align="center">
 ██████╗ ███████╗██╗     ██╗      ██████╗
██╔════╝ ██╔════╝██║     ██║     ██╔═══██╗
██║  ███╗█████╗  ██║     ██║     ██║   ██║
██║   ██║██╔══╝  ██║     ██║     ██║   ██║
╚██████╔╝███████╗███████╗███████╗╚██████╔╝
 ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝
  </pre>
</p>

<p align="center">
  <strong>A TypeScript backend framework built on Effect</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gello/core"><img src="https://img.shields.io/npm/v/@gello/core?style=flat-square" alt="Latest Version"></a>
  <a href="https://www.npmjs.com/package/gello"><img src="https://img.shields.io/npm/dm/gello?style=flat-square" alt="Downloads"></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/@gello/core?style=flat-square" alt="License"></a>
</p>

<p align="center">
  <a href="https://gello.net/docs">Documentation</a> •
  <a href="https://gello.net/docs/installation">Installation</a> •
  <a href="https://gello.net/docs/cli">CLI</a>
</p>

---

## Why Gello?

Gello combines the **developer experience of Laravel** with the **type safety of Effect**. No decorators, no magic—just functions and values.

```typescript
// Define a service
class UserRepo extends Context.Tag("UserRepo")<UserRepo, {
  findById: (id: string) => Effect.Effect<User, NotFoundError>
}>() {}

// Use it in a route
HttpRouter.get("/users/:id", Effect.gen(function* () {
  const { id } = yield* HttpRouter.params
  const repo = yield* UserRepo
  const user = yield* repo.findById(id)
  return yield* HttpServerResponse.json(user)
}))
```

**What you get:**
- Compile-time error tracking — know exactly what can fail
- Automatic dependency injection — `yield*` from context
- Resource safety — connections close, pools drain
- Testability — swap any Layer for a mock

## Quick Start

```bash
npx gello new my-app
cd my-app
pnpm install
pnpm dev
```

Your server is running at `http://localhost:3000`.

## Features

| Feature | Description |
|---------|-------------|
| **Effect Core** | Type-safe errors, dependency injection, resource management |
| **HTTP Server** | Built on `@effect/platform` with typed routing and middleware |
| **Validation** | Schema validation with `@effect/schema` at boundaries |
| **Database** | Drizzle ORM with Effect-managed connection pools |
| **Queues** | Pure Effect job queues — no Redis required |
| **FP Utilities** | Optics (lenses), refined types, branded values |
| **CLI** | Project scaffolding, dev server, route inspection |

## Packages

```bash
# Core framework
pnpm add @gello/core @gello/common @gello/platform-node

# Optional
pnpm add @gello/queue      # Job queues
pnpm add @gello/fp         # Optics, refined types
pnpm add -D @gello/testing # Test utilities
```

| Package | Description |
|---------|-------------|
| `@gello/core` | Contracts, errors, base types |
| `@gello/common` | Middleware, routing, validation |
| `@gello/platform-node` | Node.js HTTP adapter |
| `@gello/queue` | Effect-native queue system |
| `@gello/fp` | Optics, refined types |
| `@gello/testing` | Mocks and test utilities |

## Example

```typescript
import { Effect, Layer, pipe } from "effect"
import * as HttpRouter from "@effect/platform/HttpRouter"
import * as HttpServer from "@effect/platform/HttpServer"
import * as HttpServerResponse from "@effect/platform/HttpServerResponse"
import * as NodeHttpServer from "@effect/platform-node/NodeHttpServer"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import { createServer } from "node:http"

// Routes as values
const routes = pipe(
  HttpRouter.empty,
  HttpRouter.get("/", Effect.succeed(HttpServerResponse.json({ status: "ok" }))),
  HttpRouter.get("/users/:id", Effect.gen(function* () {
    const { id } = yield* HttpRouter.params
    return yield* HttpServerResponse.json({ id })
  }))
)

// Compose and launch
const server = pipe(
  HttpServer.serve(HttpRouter.toHttpApp(routes)),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

Layer.launch(server).pipe(NodeRuntime.runMain)
```

## CLI

```bash
npx gello new my-app      # Create new project
npx gello serve           # Start dev server with hot reload
npx gello route:list      # Display registered routes
```

The `route:list` command shows a beautiful TUI:

```
 ██████╗ ███████╗██╗     ██╗      ██████╗
██╔════╝ ██╔════╝██║     ██║     ██╔═══██╗
██║  ███╗█████╗  ██║     ██║     ██║   ██║
██║   ██║██╔══╝  ██║     ██║     ██║   ██║
╚██████╔╝███████╗███████╗███████╗╚██████╔╝
 ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝

Route List • My App

Total: 5 routes  │  GET: 3  POST: 1  DELETE: 1

METHOD    PATH              HANDLER
────────────────────────────────────
GET       /                 index
GET       /users            listUsers
GET       /users/:id        getUser
POST      /users            createUser
DELETE    /users/:id        deleteUser
```

## Architecture

Gello follows **hexagonal architecture** with Effect's Layer system:

```
┌─────────────────────────────────────┐
│            Your App                 │
│  (Routes, Handlers, Business Logic) │
└──────────────┬──────────────────────┘
               │ yield*
┌──────────────▼──────────────────────┐
│           Services                  │
│  (UserRepo, EmailService, etc.)     │
│  Context.Tag + Layer                │
└──────────────┬──────────────────────┘
               │ Layer.provide
┌──────────────▼──────────────────────┐
│          Infrastructure             │
│  (Database, Cache, Queue, HTTP)     │
│  Layer.scoped + acquireRelease      │
└─────────────────────────────────────┘
               │
         Layer.launch
```

Everything composes at the edge. No hidden state, no runtime surprises.

## Documentation

Full documentation at **[gello.net/docs](https://gello.net/docs)**

- [Installation](https://gello.net/docs/installation)
- [HTTP Server](https://gello.net/docs/http)
- [Routing](https://gello.net/docs/routing)
- [Middleware](https://gello.net/docs/middleware)
- [Dependency Injection](https://gello.net/docs/dependency-injection)
- [Validation](https://gello.net/docs/validation)
- [Database](https://gello.net/docs/database)
- [Queues](https://gello.net/docs/queues)
- [CLI](https://gello.net/docs/cli)

## Contributing

Contributions welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License. See [LICENSE](LICENSE) for details.
