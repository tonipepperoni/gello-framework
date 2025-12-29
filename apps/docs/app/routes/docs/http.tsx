import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock, Callout } from '../../components';

export const Route = createFileRoute('/docs/http')({
  component: HttpPage,
});

function HttpPage() {
  return (
    <DocsContent
      title="HTTP Server"
      description="Functional HTTP layer with @effect/platform — type-safe, composable, resource-managed"
    >
      <Callout type="info">
        Unlike Express or Koa, Gello's HTTP layer is built on Effect's functional patterns.
        Routes are values, handlers return Effects, and resources are automatically managed.
      </Callout>

      <h2>Setup</h2>
      <CodeBlock lang="bash" code={`pnpm add effect @effect/schema @effect/platform @effect/platform-node`} />

      <h2>Basic Router</h2>
      <CodeBlock code={`import { pipe } from "effect"
import * as HttpRouter from "@effect/platform/HttpRouter"
import * as HttpServerResponse from "@effect/platform/HttpServerResponse"

const AppRouter = pipe(
  HttpRouter.empty,

  HttpRouter.get("/health",
    HttpServerResponse.json({ status: "ok" })
  ),

  HttpRouter.get("/hello/:name", Effect.gen(function* () {
    const { name } = yield* HttpRouter.schemaPathParams(
      S.Struct({ name: S.String })
    )
    return HttpServerResponse.json({ message: \`Hello, \${name}!\` })
  }))
)`} />

      <h2>Typed Request Bodies</h2>
      <CodeBlock code={`import * as S from "@effect/schema/Schema"
import * as HttpServerRequest from "@effect/platform/HttpServerRequest"

const CreateUser = S.Struct({
  name: S.String,
  email: S.String.pipe(S.filter((s) => s.includes("@")))
})

HttpRouter.post("/users", Effect.gen(function* () {
  // Validates and decodes — fails with 400 on bad input
  const body = yield* HttpServerRequest.schemaBodyJson(CreateUser)

  const repo = yield* UserRepo
  const user = yield* repo.create(body)

  return yield* HttpServerResponse.schemaJson(User)(user)
}))`} />

      <h2>Typed Responses</h2>
      <CodeBlock code={`// Schema for response — ensures you return the right shape
const UserResponse = S.Struct({
  id: S.String,
  name: S.String,
  email: S.String,
  createdAt: S.Date
})

HttpRouter.get("/users/:id", Effect.gen(function* () {
  const { id } = yield* HttpRouter.schemaPathParams(S.Struct({ id: S.String }))
  const repo = yield* UserRepo
  const user = yield* repo.findById(id)

  if (!user) {
    return HttpServerResponse.empty({ status: 404 })
  }

  // Type-checked: must match UserResponse schema
  return yield* HttpServerResponse.schemaJson(UserResponse)(user)
}))`} />

      <h2>Query Parameters</h2>
      <CodeBlock code={`const PaginationParams = S.Struct({
  page: S.optional(S.NumberFromString).pipe(S.withDefault(() => 1)),
  limit: S.optional(S.NumberFromString).pipe(S.withDefault(() => 20))
})

HttpRouter.get("/users", Effect.gen(function* () {
  const { page, limit } = yield* HttpRouter.schemaSearchParams(PaginationParams)
  const repo = yield* UserRepo
  const users = yield* repo.list({ page, limit })
  return yield* HttpServerResponse.schemaJson(S.Array(User))(users)
}))`} />

      <h2>Middleware</h2>
      <CodeBlock code={`import * as HttpMiddleware from "@effect/platform/HttpMiddleware"

// Logging middleware (built-in)
const withLogging = HttpMiddleware.logger

// Custom auth middleware
const withAuth = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest
    const auth = request.headers["authorization"]

    if (!auth?.startsWith("Bearer ")) {
      return HttpServerResponse.empty({ status: 401 })
    }

    const token = auth.slice(7)
    const user = yield* verifyToken(token)

    // Continue with user in context
    return yield* app.pipe(Effect.provideService(CurrentUser, user))
  })
)

// Apply to router
const ProtectedRouter = pipe(
  HttpRouter.empty,
  HttpRouter.get("/me", Effect.gen(function* () {
    const user = yield* CurrentUser
    return HttpServerResponse.json(user)
  }))
).pipe(withAuth)`} />

      <h2>Booting the Server</h2>
      <CodeBlock code={`import * as HttpServer from "@effect/platform/HttpServer"
import * as NodeHttpServer from "@effect/platform-node/NodeHttpServer"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import { createServer } from "node:http"

const HttpApp = HttpRouter.toHttpApp(AppRouter)

const ServerLayer = pipe(
  HttpServer.serve(HttpApp),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

// Compose with your app layers
const MainLayer = pipe(
  ServerLayer,
  Layer.provide(AppLayer) // ConfigLive, DbLive, etc.
)

Layer.launch(MainLayer).pipe(NodeRuntime.runMain)`} />

      <h2>Error Handling</h2>
      <CodeBlock code={`// Errors become proper HTTP responses
class NotFoundError extends Data.TaggedError("NotFoundError")<{
  resource: string
  id: string
}> {}

HttpRouter.get("/users/:id", Effect.gen(function* () {
  const { id } = yield* HttpRouter.schemaPathParams(S.Struct({ id: S.String }))
  const repo = yield* UserRepo
  const user = yield* repo.findById(id)

  if (!user) {
    return yield* new NotFoundError({ resource: "User", id })
  }

  return yield* HttpServerResponse.schemaJson(User)(user)
}).pipe(
  Effect.catchTag("NotFoundError", (e) =>
    HttpServerResponse.json({ error: \`\${e.resource} not found\` }, { status: 404 })
  )
))`} />
    </DocsContent>
  );
}
