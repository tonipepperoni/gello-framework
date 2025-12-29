import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock, Callout } from '../../components';

export const Route = createFileRoute('/docs/routing')({
  component: RoutingPage,
});

function RoutingPage() {
  return (
    <DocsContent
      title="Routing"
      description="Declarative route definitions with type-safe params and automatic context injection"
    >
      <h2>Route Builders</h2>
      <p>
        Gello provides a fluent route builder API that creates typed route definitions.
        Routes are just data — arrays of route objects that get registered with your app.
      </p>

      <CodeBlock code={`import { route } from "@gello/core-adapters-node"

// Define routes as data
export const routes = [
  route.get("/", homeHandler),
  route.get("/health", healthCheck),
  route.get("/users", listUsers),
  route.get("/users/:id", getUser),
  route.post("/users", createUser),
  route.patch("/users/:id", updateUser),
  route.delete("/users/:id", deleteUser),
] as const`} />

      <h2>Route Parameters</h2>
      <p>
        Route parameters are automatically extracted and injected into your handler's context.
        Use the <code>getParam</code> helper to access them type-safely.
      </p>

      <CodeBlock code={`import { getParam } from "@gello/core-domain-routing"

const getUser = Effect.gen(function* () {
  // Extract :id from the path
  const id = yield* getParam("id")

  const repo = yield* UserRepo
  const user = yield* repo.findById(id)

  if (!user) {
    return HttpServerResponse.empty({ status: 404 })
  }

  return HttpServerResponse.json(user)
})`} />

      <h2>Query Parameters</h2>
      <p>
        Query parameters are also available via context. Use typed helpers for common conversions.
      </p>

      <CodeBlock code={`import {
  getQuery,
  getQueryAsNumber,
  getQueryAsBoolean
} from "@gello/core-domain-routing"

const listUsers = Effect.gen(function* () {
  // ?page=2&limit=20&active=true
  const page = yield* getQueryAsNumber("page", 1)      // defaults to 1
  const limit = yield* getQueryAsNumber("limit", 20)   // defaults to 20
  const active = yield* getQueryAsBoolean("active")    // Option<boolean>

  const repo = yield* UserRepo
  const users = yield* repo.list({ page, limit, active })

  return HttpServerResponse.json(users)
})`} />

      <h2>Registering Routes</h2>
      <p>
        Routes are registered with your app using the <code>routes()</code> method.
        The app automatically injects <code>RouteParams</code>, <code>QueryParams</code>,
        and <code>HttpServerRequest</code> into each handler's context.
      </p>

      <CodeBlock code={`import { createApp, runApp } from "@gello/core-adapters-node"
import { routes } from "./routes"

const app = createApp({ port: 3000 })
  .use(cors({ origins: "*" }))
  .routes(routes)

runApp(app, AppLayer)`} />

      <h2>Route Groups</h2>
      <p>
        Organize related routes by defining them in separate files and combining them.
      </p>

      <CodeBlock code={`// routes/users.ts
export const userRoutes = [
  route.get("/users", listUsers),
  route.get("/users/:id", getUser),
  route.post("/users", createUser),
] as const

// routes/posts.ts
export const postRoutes = [
  route.get("/posts", listPosts),
  route.get("/posts/:id", getPost),
] as const

// routes/index.ts
export const routes = [
  ...apiRoutes,
  ...userRoutes,
  ...postRoutes,
] as const`} />

      <h2>Middleware per Route</h2>
      <p>
        Apply middleware to specific routes by wrapping handlers.
      </p>

      <CodeBlock code={`const withAuth = <R>(handler: Effect.Effect<HttpServerResponse, RouteError, R>) =>
  pipe(
    Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest
      const token = request.headers.authorization?.replace("Bearer ", "")

      if (!token) {
        return HttpServerResponse.empty({ status: 401 })
      }

      const user = yield* verifyToken(token)
      return yield* handler.pipe(Effect.provideService(CurrentUser, user))
    })
  )

export const routes = [
  route.get("/public", publicHandler),
  route.get("/me", withAuth(getProfile)),
  route.post("/settings", withAuth(updateSettings)),
] as const`} />

      <h2>Error Handling</h2>
      <p>
        Wrap routes with error handlers to convert domain errors to HTTP responses.
      </p>

      <CodeBlock code={`const handleError = (error: RouteError) =>
  Match.value(error).pipe(
    Match.tag("NotFoundError", (e) =>
      HttpServerResponse.json({ error: e.message }, { status: 404 })
    ),
    Match.tag("ValidationError", (e) =>
      HttpServerResponse.json({ error: e.message }, { status: 400 })
    ),
    Match.orElse(() =>
      HttpServerResponse.json({ error: "Internal error" }, { status: 500 })
    )
  )

const handle = <R>(handler: Effect.Effect<HttpServerResponse, RouteError, R>) =>
  pipe(handler, Effect.catchAll(handleError))

export const routes = [
  route.get("/users/:id", handle(getUser)),
  route.post("/users", handle(createUser)),
] as const`} />

      <h2>CLI: List Routes</h2>
      <p>
        Use the Gello CLI to view all registered routes in your application.
      </p>

      <CodeBlock lang="bash" code={`pnpm gello route:list`} />

      <Callout type="info">
        This displays a beautiful TUI with all routes, their methods, paths, and handlers —
        grouped by path prefix with color-coded HTTP methods.
      </Callout>
    </DocsContent>
  );
}
