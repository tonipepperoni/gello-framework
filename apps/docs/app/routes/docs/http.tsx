import { createFileRoute } from '@tanstack/react-router';
import {
  DocsContent,
  CodeBlock,
  Callout,
  TypeTable,
  Steps,
  Step,
  Cards,
  Card,
  type TOCItem,
} from '../../components';
import { getPageNavigation } from '../../lib/source';

export const Route = createFileRoute('/docs/http')({
  component: HttpPage,
});

const toc: TOCItem[] = [
  { title: 'Setup', url: '#setup', depth: 2 },
  { title: 'Core Concepts', url: '#core-concepts', depth: 2 },
  { title: 'Basic Router', url: '#basic-router', depth: 2 },
  { title: 'Request Handling', url: '#request-handling', depth: 2 },
  { title: 'Path Parameters', url: '#path-parameters', depth: 3 },
  { title: 'Query Parameters', url: '#query-parameters', depth: 3 },
  { title: 'Request Body', url: '#request-body', depth: 3 },
  { title: 'Response Building', url: '#response-building', depth: 2 },
  { title: 'Middleware', url: '#middleware', depth: 2 },
  { title: 'Booting the Server', url: '#booting-the-server', depth: 2 },
  { title: 'Create the HTTP app from router', url: '#create-the-http-app-from-router', depth: 3 },
  { title: 'Create the server layer', url: '#create-the-server-layer', depth: 3 },
  { title: 'Compose with app layers and launch', url: '#compose-with-app-layers-and-launch', depth: 3 },
  { title: 'Error Handling', url: '#error-handling', depth: 2 },
];

function HttpPage() {
  const footer = getPageNavigation('/docs/http');

  return (
    <DocsContent
      title="HTTP Server"
      description="Functional HTTP layer with @effect/platform — type-safe, composable, resource-managed"
      toc={toc}
      footer={footer}
    >
      <Callout type="info">
        Unlike Express or Koa, Gello's HTTP layer is built on Effect's functional patterns.
        Routes are values, handlers return Effects, and resources are automatically managed.
      </Callout>

      <h2 id="setup">Setup</h2>
      <CodeBlock lang="bash" code={`pnpm add effect @effect/schema @effect/platform @effect/platform-node`} />

      <h2 id="core-concepts">Core Concepts</h2>
      <Cards>
        <Card title="HttpRouter" description="Compose routes as values with type-safe parameters" />
        <Card title="HttpServerRequest" description="Access request body, headers, and query params" />
        <Card title="HttpServerResponse" description="Build responses with schema validation" />
        <Card title="HttpMiddleware" description="Compose middleware as Effects" />
      </Cards>

      <h2 id="basic-router">Basic Router</h2>
      <CodeBlock lang="typescript" code={`import { pipe } from "effect"
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

      <h2 id="request-handling">Request Handling</h2>

      <h3 id="path-parameters">Path Parameters</h3>
      <TypeTable
        type={{
          'HttpRouter.schemaPathParams': {
            type: '(schema: Schema<A>) => Effect<A>',
            description: 'Extract and validate URL path parameters',
          },
        }}
      />
      <CodeBlock lang="typescript" code={`HttpRouter.get("/users/:id", Effect.gen(function* () {
  const { id } = yield* HttpRouter.schemaPathParams(
    S.Struct({ id: S.String })
  )
  // id is typed as string
}))`} />

      <h3 id="query-parameters">Query Parameters</h3>
      <TypeTable
        type={{
          'HttpRouter.schemaSearchParams': {
            type: '(schema: Schema<A>) => Effect<A>',
            description: 'Extract and validate URL query parameters',
          },
        }}
      />
      <CodeBlock lang="typescript" code={`const PaginationParams = S.Struct({
  page: S.optional(S.NumberFromString).pipe(S.withDefault(() => 1)),
  limit: S.optional(S.NumberFromString).pipe(S.withDefault(() => 20))
})

HttpRouter.get("/users", Effect.gen(function* () {
  const { page, limit } = yield* HttpRouter.schemaSearchParams(PaginationParams)
  // page and limit are typed as numbers with defaults
}))`} />

      <h3 id="request-body">Request Body</h3>
      <TypeTable
        type={{
          'HttpServerRequest.schemaBodyJson': {
            type: '(schema: Schema<A>) => Effect<A>',
            description: 'Parse and validate JSON request body',
          },
        }}
      />
      <CodeBlock lang="typescript" code={`import * as S from "@effect/schema/Schema"
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

      <h2 id="response-building">Response Building</h2>
      <TypeTable
        type={{
          'HttpServerResponse.json': {
            type: '(body: unknown, options?) => ServerResponse',
            description: 'Create JSON response',
          },
          'HttpServerResponse.schemaJson': {
            type: '(schema: Schema<A>) => (a: A) => Effect<ServerResponse>',
            description: 'Create type-checked JSON response',
          },
          'HttpServerResponse.empty': {
            type: '(options?) => ServerResponse',
            description: 'Create empty response with status',
          },
          'HttpServerResponse.text': {
            type: '(body: string, options?) => ServerResponse',
            description: 'Create text response',
          },
        }}
      />

      <CodeBlock lang="typescript" code={`// Schema for response — ensures you return the right shape
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

      <h2 id="middleware">Middleware</h2>
      <CodeBlock lang="typescript" code={`import * as HttpMiddleware from "@effect/platform/HttpMiddleware"

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

      <h2 id="booting-the-server">Booting the Server</h2>
      <Steps>
        <Step>
          <h3 id="create-the-http-app-from-router">Create the HTTP app from router</h3>
          <CodeBlock lang="typescript" code={`const HttpApp = HttpRouter.toHttpApp(AppRouter)`} />
        </Step>
        <Step>
          <h3 id="create-the-server-layer">Create the server layer</h3>
          <CodeBlock lang="typescript" code={`import * as HttpServer from "@effect/platform/HttpServer"
import * as NodeHttpServer from "@effect/platform-node/NodeHttpServer"
import { createServer } from "node:http"

const ServerLayer = pipe(
  HttpServer.serve(HttpApp),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)`} />
        </Step>
        <Step>
          <h3 id="compose-with-app-layers-and-launch">Compose with app layers and launch</h3>
          <CodeBlock lang="typescript" code={`import * as NodeRuntime from "@effect/platform-node/NodeRuntime"

const MainLayer = pipe(
  ServerLayer,
  Layer.provide(AppLayer) // ConfigLive, DbLive, etc.
)

Layer.launch(MainLayer).pipe(NodeRuntime.runMain)`} />
        </Step>
      </Steps>

      <h2 id="error-handling">Error Handling</h2>
      <CodeBlock lang="typescript" code={`// Errors become proper HTTP responses
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
