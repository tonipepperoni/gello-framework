import { n as jsxRuntimeExports } from "../server.js";
import { C as CodeBlock } from "./CodeBlock-20dvdbBQ.js";
import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
function DocsIntroduction() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "prose", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Introduction" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-zinc-400 mb-8", children: "Gello — A TypeScript backend framework built on Effect, inspired by Laravel, Rails, and NestJS" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Gello is a sophisticated backend framework that combines the best ideas from established frameworks with Effect's functional programming paradigm:" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Laravel's Developer Experience" }),
        " — Elegant APIs, powerful CLI, sensible defaults"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Ruby on Rails' Philosophy" }),
        " — Convention over configuration, developer productivity"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "NestJS's Modularity" }),
        " — Service-oriented architecture, clean dependency injection"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Effect's Type Safety" }),
        " — Functional programming, compile-time error handling"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "Built on ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://effect.website", target: "_blank", rel: "noopener noreferrer", children: "Effect" }),
      " and",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://github.com/Effect-TS/effect/tree/main/packages/platform", target: "_blank", rel: "noopener noreferrer", children: "@effect/platform" }),
      ", Gello follows the principle: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "program = value, interpret at the edge" }),
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Core Philosophy" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "No Module Abstraction" }),
        ": Just compose Layers for dependencies and handlers that ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "yield*" }),
        " from context"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Scoped Resources" }),
        ": Database pools, Redis connections — all managed with ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "Layer.scoped" }),
        " and ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "acquireRelease" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Typed Boundaries" }),
        ": Use ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "@effect/schema" }),
        " for request/response validation at the edge"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Single Composition Point" }),
        ": All layers merge at one root, then ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "Layer.launch" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Quick Example" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `import { Context, Effect, Layer, pipe } from "effect"
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

Layer.launch(MainLayer).pipe(NodeRuntime.runMain)` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "What This Gives You" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Resource Safety" }),
        ": Pools close on shutdown, connections release properly"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Testability" }),
        ": Swap any Layer for a mock — no DI container ceremony"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Type Inference" }),
        ": The compiler knows exactly what dependencies each handler needs"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "No Magic" }),
        ": It's just functions and values, all the way down"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Requirements" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Node.js" }),
        " 20.0+"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "TypeScript" }),
        " 5.4+"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Effect" }),
        " 3.x"
      ] })
    ] })
  ] });
}
export {
  DocsIntroduction as component
};
