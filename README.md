<p align="center">
  <img src="https://gello.net/logo.svg" alt="Gello" width="200" />
</p>

<p align="center">
  <strong>The Effect-powered backend framework</strong><br/>
  Laravel's elegance meets Effect's type safety. No decorators, no magic—just functions.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gello/core"><img src="https://img.shields.io/npm/v/@gello/core?style=flat-square&color=8B5CF6" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/gello"><img src="https://img.shields.io/npm/dm/gello?style=flat-square&color=6D28D9" alt="npm downloads"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-8B5CF6?style=flat-square" alt="license"></a>
  <a href="https://effect.website"><img src="https://img.shields.io/badge/powered%20by-Effect-black?style=flat-square" alt="Effect"></a>
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
route.get("/users/:id", Effect.gen(function* () {
  const { id } = yield* Route.params
  const repo = yield* UserRepo
  const user = yield* repo.findById(id)
  return Response.json(user)
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
| **Mail** | Email sending with React templates |
| **Auth** | Authentication, authorization, OAuth providers |
| **CLI** | Project scaffolding, dev server, route inspection |

## Packages

```bash
# Core framework
pnpm add @gello/core @gello/common @gello/platform-node

# Optional
pnpm add @gello/queue      # Job queues
pnpm add @gello/mail       # Email sending
pnpm add @gello/auth       # Authentication
pnpm add @gello/fp         # Optics, refined types
pnpm add -D @gello/testing # Test utilities
```

| Package | Description |
|---------|-------------|
| `@gello/core` | Contracts, errors, base types |
| `@gello/common` | Middleware, routing, validation |
| `@gello/platform-node` | Node.js HTTP adapter |
| `@gello/queue` | Effect-native queue system |
| `@gello/mail` | Email with React templates |
| `@gello/auth` | Authentication & authorization |
| `@gello/fp` | Optics, refined types |
| `@gello/testing` | Mocks and test utilities |

## Example

```typescript
import { Effect, Layer } from "effect"
import { NodeServer, route, Route, Response } from "@gello/platform-node"

// Define routes
const routes = Route.group({ prefix: "/api" }, [
  route.get("/", Effect.succeed(Response.json({ status: "ok" }))),

  route.get("/users/:id", Effect.gen(function* () {
    const { id } = yield* Route.params
    return Response.json({ id })
  }))
])

// Start server
NodeServer.make({ port: 3000 })
  .pipe(
    Layer.provide(routes),
    Layer.launch,
    Effect.runPromise
  )
```

## CLI

```bash
npx gello new my-app      # Create new project
npx gello serve           # Start dev server with hot reload
npx gello route:list      # Display registered routes
```

## Documentation

Full documentation at **[gello.net/docs](https://gello.net/docs)**

- [Installation](https://gello.net/docs/installation)
- [Your First App](https://gello.net/docs/first-app)
- [Routing](https://gello.net/docs/routing)
- [Middleware](https://gello.net/docs/middleware)
- [Validation](https://gello.net/docs/validation)
- [Authentication](https://gello.net/docs/authentication)
- [Database](https://gello.net/docs/database)
- [Queues](https://gello.net/docs/queues)
- [CLI](https://gello.net/docs/cli)

## Contributing

Contributions welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License. See [LICENSE](LICENSE) for details.
