<p align="center">
  <img src="apps/docs/public/logo.svg" width="120" alt="Gello Logo">
</p>

<p align="center">
  <a href="https://github.com/gello/gello/actions"><img src="https://img.shields.io/github/actions/workflow/status/gello/gello/tests.yml?branch=main&style=flat-square" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/@gello/core-http"><img src="https://img.shields.io/npm/v/@gello/core-http?style=flat-square" alt="Latest Version"></a>
  <a href="https://www.npmjs.com/package/@gello/core-http"><img src="https://img.shields.io/npm/dm/@gello/core-http?style=flat-square" alt="Downloads"></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/@gello/core-http?style=flat-square" alt="License"></a>
</p>

## About Gello

Gello is a sophisticated TypeScript backend framework powered by [Effect](https://effect.website). It combines the developer experience of Laravel with the type safety and composability of functional programming.

- **Effect-Powered Architecture**: Built on Effect for type-safe error handling, dependency injection, and composable design.
- **Express-like Routing**: Familiar HTTP API with full TypeScript inference.
- **Laravel-like DI**: Service providers and dependency injection using Effect's Layer system.
- **Type-Safe Database**: Drizzle ORM integration with Effect for fully typed queries.
- **Background Jobs**: Queue system with multiple drivers, retries, and job chaining.
- **CLI Tooling**: Artisan-style commands for scaffolding and migrations.

## Learning Gello

Gello has extensive [documentation](https://gello.dev/docs) covering every aspect of the framework. Whether you're new to Effect or an experienced TypeScript developer, you'll find everything you need to get started.

You may also try the [Gello Bootcamp](https://bootcamp.gello.dev), which guides you through building a modern application with Gello from scratch.

## Installation

```bash
npm create gello@latest my-app
cd my-app
npm run dev
```

## Quick Example

```typescript
import { Gello, Route } from '@gello/core-http'
import { Effect } from 'effect'

// Define routes with full type inference
const hello = Route.get('/hello/:name', (req) =>
  Effect.succeed({ message: `Hello, ${req.params.name}!` })
)

// Create and start the application
const app = Gello.create().use(hello)

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
```

## Dependency Injection

```typescript
import { Effect, Layer } from 'effect'

// Define a service
export class UserService extends Effect.Service<UserService>()('UserService', {
  effect: Effect.gen(function* () {
    const db = yield* DrizzleService
    return {
      findById: (id: string) => db.query(/* ... */),
      create: (data: CreateUserDto) => db.query(/* ... */),
    }
  }),
}) {}

// Use in routes
const getUser = Route.get('/users/:id', (req) =>
  Effect.gen(function* () {
    const userService = yield* UserService
    return yield* userService.findById(req.params.id)
  })
)
```

## Background Jobs

```typescript
import { Job, Queue } from '@gello/queue-core'

// Define a job
export const SendWelcomeEmail = Job.define(
  'send-welcome-email',
  (payload: { userId: string; email: string }) =>
    Effect.gen(function* () {
      const emailService = yield* EmailService
      yield* emailService.sendWelcome(payload)
    })
)

// Dispatch from a route
const createUser = Route.post('/users', (req) =>
  Effect.gen(function* () {
    const queue = yield* Queue
    const user = yield* createUserInDb(req.body)
    yield* queue.dispatch(SendWelcomeEmail, { userId: user.id, email: user.email })
    return user
  })
)
```

## CLI Commands

```bash
# Scaffolding
pnpm gello make:controller UserController
pnpm gello make:service UserService
pnpm gello make:job SendNotification

# Database
pnpm gello migrate:make create_users_table
pnpm gello migrate

# Queue
pnpm gello queue:work
pnpm gello queue:status
```

## Contributing

Thank you for considering contributing to Gello! The contribution guide can be found in the [documentation](https://gello.dev/docs/contributing).

## Code of Conduct

In order to ensure that the Gello community is welcoming to all, please review and abide by the [Code of Conduct](https://gello.dev/docs/code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Gello, please send an e-mail to security@gello.dev. All security vulnerabilities will be promptly addressed.

## License

The Gello framework is open-sourced software licensed under the [MIT license](LICENSE).
