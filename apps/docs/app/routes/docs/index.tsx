import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock, Callout } from '../../components';

export const Route = createFileRoute('/docs/')({
  component: DocsIntroduction,
});

function DocsIntroduction() {
  return (
    <DocsContent
      title="Introduction"
      description="Gello — A TypeScript backend framework built on Effect, inspired by Laravel, Rails, and NestJS"
    >
      <p>
        Gello is a sophisticated backend framework that combines the best ideas from established frameworks
        with Effect's functional programming paradigm:
      </p>

      <ul>
        <li><strong>Laravel's Developer Experience</strong> — Elegant APIs, powerful CLI, sensible defaults</li>
        <li><strong>Ruby on Rails' Philosophy</strong> — Convention over configuration, developer productivity</li>
        <li><strong>NestJS's Modularity</strong> — Service-oriented architecture, clean dependency injection</li>
        <li><strong>Effect's Type Safety</strong> — Functional programming, compile-time error handling</li>
      </ul>

      <p>
        Built on <a href="https://effect.website" target="_blank" rel="noopener noreferrer">Effect</a> and{' '}
        <a href="https://github.com/Effect-TS/effect/tree/main/packages/platform" target="_blank" rel="noopener noreferrer">@effect/platform</a>,
        Gello follows the principle: <strong>program = value, interpret at the edge</strong>.
      </p>

      <h2>Core Philosophy</h2>

      <Callout type="info" title="The Gello Way">
        Build applications as pure values, compose them with Layers, and interpret at the edge.
        No magic, no hidden state, just functions and types.
      </Callout>

      <ul>
        <li><strong>No Module Abstraction</strong>: Just compose Layers for dependencies and handlers that <code>yield*</code> from context</li>
        <li><strong>Scoped Resources</strong>: Database pools, Redis connections — all managed with <code>Layer.scoped</code> and <code>acquireRelease</code></li>
        <li><strong>Typed Boundaries</strong>: Use <code>@effect/schema</code> for request/response validation at the edge</li>
        <li><strong>Single Composition Point</strong>: All layers merge at one root, then <code>Layer.launch</code></li>
      </ul>

      <h2>Quick Example</h2>
      <CodeBlock lang="typescript" code={`import { Context, Effect, Layer, pipe } from "effect"
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

      <h2>Quick Start</h2>
      <CodeBlock lang="bash" code={`npx gello new my-app
cd my-app
pnpm install
pnpm dev`} />

      <h2>Packages</h2>
      <p>Gello is organized into focused packages:</p>
      <ul>
        <li><code>@gello/core</code> — Core contracts, errors, and base types</li>
        <li><code>@gello/common</code> — Middleware, routing, validation utilities</li>
        <li><code>@gello/platform-node</code> — Node.js HTTP adapter</li>
        <li><code>@gello/queue</code> — Effect-native queue system</li>
        <li><code>@gello/fp</code> — Optics, refined types, FP utilities</li>
        <li><code>@gello/testing</code> — Testing utilities and mocks</li>
      </ul>

      <h2>Requirements</h2>
      <ul>
        <li><strong>Node.js</strong> 20.0+</li>
        <li><strong>TypeScript</strong> 5.4+</li>
        <li><strong>Effect</strong> 3.x</li>
      </ul>
    </DocsContent>
  );
}
