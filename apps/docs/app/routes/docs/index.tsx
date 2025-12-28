import { createFileRoute } from '@tanstack/react-router';
import { CodeBlock } from '../../components/CodeBlock';

export const Route = createFileRoute('/docs/')({
  component: DocsIntroduction,
});

function DocsIntroduction() {
  return (
    <article className="prose">
      <h1>Introduction</h1>
      <p className="text-xl text-zinc-400 mb-8">
        Gello — FP-core backend framework built on Effect
      </p>

      <p>
        Gello is a non-modular, purely functional approach to backend development in TypeScript.
        Built on <a href="https://effect.website" target="_blank" rel="noopener noreferrer">Effect</a> and{' '}
        <a href="https://github.com/Effect-TS/effect/tree/main/packages/platform" target="_blank" rel="noopener noreferrer">@effect/platform</a>,
        it follows the principle: <strong>program = value, interpret at the edge</strong>.
      </p>

      <h2>Core Philosophy</h2>
      <ul>
        <li><strong>No Module Abstraction</strong>: Just compose Layers for dependencies and handlers that <code>yield*</code> from context</li>
        <li><strong>Scoped Resources</strong>: Database pools, Redis connections — all managed with <code>Layer.scoped</code> and <code>acquireRelease</code></li>
        <li><strong>Typed Boundaries</strong>: Use <code>@effect/schema</code> for request/response validation at the edge</li>
        <li><strong>Single Composition Point</strong>: All layers merge at one root, then <code>Layer.launch</code></li>
      </ul>

      <h2>Quick Example</h2>
      <CodeBlock code={`import { Context, Effect, Layer, pipe } from "effect"
import * as S from "@effect/schema/Schema"
import * as HttpRouter from "@effect/platform/HttpRouter"
import * as HttpServer from "@effect/platform/HttpServer"
import * as HttpServerResponse from "@effect/platform/HttpServerResponse"
import * as NodeHttpServer from "@effect/platform-node/NodeHttpServer"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import { createServer } from "node:http"

// 1) Define a service with Context.Tag
class UserRepo extends Context.Tag("UserRepo")<
  UserRepo,
  { getAll: () => Effect.Effect<User[]> }
>() {}

// 2) Implement as a Layer
const UserRepoLive = Layer.effect(
  UserRepo,
  Effect.gen(function* () {
    const db = yield* Db
    return {
      getAll: () => Effect.tryPromise(() => db.select().from(users))
    }
  })
).pipe(Layer.provide(DbLive))

// 3) Build routes that yield* dependencies
const AppRouter = pipe(
  HttpRouter.empty,
  HttpRouter.get("/users", Effect.gen(function* () {
    const repo = yield* UserRepo
    const users = yield* repo.getAll()
    return yield* HttpServerResponse.schemaJson(S.Array(User))(users)
  }))
)

// 4) Compose all layers at the edge
const AppLayer = Layer.mergeAll(ConfigLive, DbLive, UserRepoLive)

const MainLayer = pipe(
  HttpServer.serve(HttpRouter.toHttpApp(AppRouter)),
  Layer.provide(AppLayer),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

Layer.launch(MainLayer).pipe(NodeRuntime.runMain)`} />

      <h2>What This Gives You</h2>
      <ul>
        <li><strong>Resource Safety</strong>: Pools close on shutdown, connections release properly</li>
        <li><strong>Testability</strong>: Swap any Layer for a mock — no DI container ceremony</li>
        <li><strong>Type Inference</strong>: The compiler knows exactly what dependencies each handler needs</li>
        <li><strong>No Magic</strong>: It's just functions and values, all the way down</li>
      </ul>

      <h2>Requirements</h2>
      <ul>
        <li><strong>Node.js</strong> 20.0+</li>
        <li><strong>TypeScript</strong> 5.4+</li>
        <li><strong>Effect</strong> 3.x</li>
      </ul>
    </article>
  );
}
