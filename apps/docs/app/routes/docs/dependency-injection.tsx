import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock, Callout } from '../../components';

export const Route = createFileRoute('/docs/dependency-injection')({
  component: DependencyInjectionPage,
});

function DependencyInjectionPage() {
  return (
    <DocsContent
      title="Dependency Injection"
      description="Context.Tag + Layer — NestJS-style modularity with functional composition"
    >
      <h2>The Pattern</h2>
      <p>
        Gello's dependency injection takes inspiration from NestJS's service-oriented architecture,
        but implements it using Effect's functional primitives. Instead of decorators and a runtime
        container, you get <code>Context.Tag</code> to define service interfaces
        and <code>Layer</code> to provide implementations — all type-safe and composable.
      </p>

      <h2>Defining Services</h2>
      <CodeBlock code={`import { Context, Effect, Layer } from "effect"

// 1) Define the service interface with Context.Tag
class UserRepo extends Context.Tag("UserRepo")<
  UserRepo,
  {
    findById: (id: string) => Effect.Effect<User | null>
    create: (data: CreateUser) => Effect.Effect<User>
    list: (opts: ListOpts) => Effect.Effect<User[]>
  }
>() {}

// The tag IS the type — no separate interface needed`} />

      <h2>Implementing Layers</h2>
      <CodeBlock code={`// Layer.effect — sync/async implementation
const UserRepoLive = Layer.effect(
  UserRepo,
  Effect.gen(function* () {
    // Pull in dependencies
    const db = yield* Db
    const redis = yield* Redis

    return {
      findById: (id) =>
        Effect.tryPromise(async () => {
          // Check cache first
          const cached = await redis.get(\`user:\${id}\`)
          if (cached) return JSON.parse(cached) as User

          // Fall back to DB
          const [row] = await db.select().from(users).where(eq(users.id, id))
          if (row) await redis.set(\`user:\${id}\`, JSON.stringify(row), { EX: 60 })
          return row ?? null
        }),

      create: (data) =>
        Effect.tryPromise(async () => {
          const [row] = await db.insert(users).values(data).returning()
          await redis.set(\`user:\${row.id}\`, JSON.stringify(row), { EX: 60 })
          return row
        }),

      list: ({ page, limit }) =>
        Effect.tryPromise(() =>
          db.select().from(users).limit(limit).offset((page - 1) * limit)
        )
    }
  })
)

// Declare dependencies
const UserRepoWithDeps = UserRepoLive.pipe(
  Layer.provide(DbLive),
  Layer.provide(RedisLive)
)`} />

      <h2>Scoped Resources</h2>
      <Callout type="info" title="Resource Lifecycle">
        Use <code>Layer.scoped</code> with <code>acquireRelease</code> for resources that need cleanup,
        like database pools and Redis connections.
      </Callout>

      <CodeBlock code={`import { Pool } from "pg"

// Layer.scoped — for resources that need cleanup
class PgPool extends Context.Tag("PgPool")<PgPool, Pool>() {}

const PgPoolLive = Layer.scoped(
  PgPool,
  Effect.acquireRelease(
    // Acquire: create the pool
    Effect.gen(function* () {
      const cfg = yield* Config
      const pool = new Pool({ connectionString: cfg.DATABASE_URL })
      yield* Effect.log("PgPool connected")
      return pool
    }),
    // Release: close on shutdown
    (pool) =>
      Effect.tryPromise(() => pool.end()).pipe(
        Effect.tap(() => Effect.log("PgPool closed")),
        Effect.orDie
      )
  )
).pipe(Layer.provide(ConfigLive))`} />

      <h2>Drizzle on Top of Pool</h2>
      <CodeBlock code={`import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"

class Db extends Context.Tag("Db")<Db, NodePgDatabase>() {}

// Layer.effect — drizzle() is sync, pool lifecycle is handled by PgPoolLive
const DbLive = Layer.effect(
  Db,
  Effect.gen(function* () {
    const pool = yield* PgPool
    return drizzle(pool)
  })
).pipe(Layer.provide(PgPoolLive))`} />

      <h2>Using in Handlers</h2>
      <CodeBlock code={`HttpRouter.get("/users/:id", Effect.gen(function* () {
  // Just yield* the tag — Effect tracks what's needed
  const repo = yield* UserRepo

  const { id } = yield* HttpRouter.schemaPathParams(S.Struct({ id: S.String }))
  const user = yield* repo.findById(id)

  if (!user) return HttpServerResponse.empty({ status: 404 })
  return yield* HttpServerResponse.schemaJson(User)(user)
}))`} />

      <h2>Composing at the Edge</h2>
      <CodeBlock code={`// All layers merge at one point
const AppLayer = Layer.mergeAll(
  ConfigLive,
  PgPoolLive,
  DbLive,
  RedisLive,
  UserRepoLive
)

// Provide to your server
const MainLayer = pipe(
  HttpServer.serve(HttpApp),
  Layer.provide(AppLayer),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

// Launch — resources acquired, then released on shutdown
Layer.launch(MainLayer).pipe(NodeRuntime.runMain)`} />

      <h2>Testing with Mocks</h2>
      <CodeBlock code={`// Create a mock layer
const UserRepoTest = Layer.succeed(UserRepo, {
  findById: (id) => Effect.succeed({ id, name: "Test User", email: "test@test.com" }),
  create: (data) => Effect.succeed({ id: "123", ...data }),
  list: () => Effect.succeed([])
})

// Swap in tests
const testEffect = Effect.gen(function* () {
  const repo = yield* UserRepo
  const user = yield* repo.findById("1")
  expect(user?.name).toBe("Test User")
})

await Effect.runPromise(
  testEffect.pipe(Effect.provide(UserRepoTest))
)`} />

      <h2>Why No Modules?</h2>
      <p>
        A "Module" abstraction would add indirection without benefit. With plain Layers:
      </p>
      <ul>
        <li>Dependency graph is explicit in the type system</li>
        <li>No runtime container — just function composition</li>
        <li>Testing is trivial — swap any Layer</li>
        <li>Resource lifecycle is guaranteed by Effect</li>
      </ul>
    </DocsContent>
  );
}
