import { n as jsxRuntimeExports } from "../server.js";
import { C as CodeBlock } from "./CodeBlock-20dvdbBQ.js";
import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
function HttpPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "prose", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "HTTP Server" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-zinc-400 mb-8", children: "Functional HTTP layer with @effect/platform — type-safe, composable, resource-managed" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-6", children: "Unlike Express or Koa, Gello's HTTP layer is built on Effect's functional patterns. Routes are values, handlers return Effects, and resources are automatically managed. This gives you type-safe routing, middleware composition, and proper resource cleanup without any imperative callback chains." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Setup" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { lang: "bash", code: `pnpm add effect @effect/schema @effect/platform @effect/platform-node` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Basic Router" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `import { pipe } from "effect"
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
)` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Typed Request Bodies" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `import * as S from "@effect/schema/Schema"
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
}))` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Typed Responses" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// Schema for response — ensures you return the right shape
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
}))` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Query Parameters" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `const PaginationParams = S.Struct({
  page: S.optional(S.NumberFromString).pipe(S.withDefault(() => 1)),
  limit: S.optional(S.NumberFromString).pipe(S.withDefault(() => 20))
})

HttpRouter.get("/users", Effect.gen(function* () {
  const { page, limit } = yield* HttpRouter.schemaSearchParams(PaginationParams)
  const repo = yield* UserRepo
  const users = yield* repo.list({ page, limit })
  return yield* HttpServerResponse.schemaJson(S.Array(User))(users)
}))` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Middleware" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `import * as HttpMiddleware from "@effect/platform/HttpMiddleware"

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
).pipe(withAuth)` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Booting the Server" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `import * as HttpServer from "@effect/platform/HttpServer"
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

Layer.launch(MainLayer).pipe(NodeRuntime.runMain)` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Error Handling" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// Errors become proper HTTP responses
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
))` })
  ] });
}
export {
  HttpPage as component
};
