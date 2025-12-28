import { n as jsxRuntimeExports } from "../server.js";
import { C as CodeBlock } from "./CodeBlock-1L53za-Z.js";
import "node:async_hooks";
import "node:stream";
import "stream";
import "util";
import "node:stream/web";
function DependencyInjectionPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "prose", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Dependency Injection" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-zinc-400 mb-8", children: "Context.Tag + Layer — no container, no decorators, just composition" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "The Pattern" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "Effect's DI is based on two primitives: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "Context.Tag" }),
      " to define service interfaces, and ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "Layer" }),
      " to provide implementations. No magic — just types."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Defining Services" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `import { Context, Effect, Layer } from "effect"

// 1) Define the service interface with Context.Tag
class UserRepo extends Context.Tag("UserRepo")<
  UserRepo,
  {
    findById: (id: string) => Effect.Effect<User | null>
    create: (data: CreateUser) => Effect.Effect<User>
    list: (opts: ListOpts) => Effect.Effect<User[]>
  }
>() {}

// The tag IS the type — no separate interface needed` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Implementing Layers" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// Layer.effect — sync/async implementation
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
)` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Scoped Resources" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `import { Pool } from "pg"

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
).pipe(Layer.provide(ConfigLive))` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Drizzle on Top of Pool" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"

class Db extends Context.Tag("Db")<Db, NodePgDatabase>() {}

// Layer.effect — drizzle() is sync, pool lifecycle is handled by PgPoolLive
const DbLive = Layer.effect(
  Db,
  Effect.gen(function* () {
    const pool = yield* PgPool
    return drizzle(pool)
  })
).pipe(Layer.provide(PgPoolLive))` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Using in Handlers" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `HttpRouter.get("/users/:id", Effect.gen(function* () {
  // Just yield* the tag — Effect tracks what's needed
  const repo = yield* UserRepo

  const { id } = yield* HttpRouter.schemaPathParams(S.Struct({ id: S.String }))
  const user = yield* repo.findById(id)

  if (!user) return HttpServerResponse.empty({ status: 404 })
  return yield* HttpServerResponse.schemaJson(User)(user)
}))` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Composing at the Edge" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// All layers merge at one point
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
Layer.launch(MainLayer).pipe(NodeRuntime.runMain)` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Testing with Mocks" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// Create a mock layer
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
)` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Why No Modules?" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: 'A "Module" abstraction would add indirection without benefit. With plain Layers:' }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Dependency graph is explicit in the type system" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "No runtime container — just function composition" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Testing is trivial — swap any Layer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Resource lifecycle is guaranteed by Effect" })
    ] })
  ] });
}
export {
  DependencyInjectionPage as component
};
