import { n as jsxRuntimeExports } from "../server.js";
import { C as CodeBlock } from "./CodeBlock-20dvdbBQ.js";
import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
function ConfigurationPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "prose", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Configuration" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-zinc-400 mb-8", children: "Effect.Config + Layer — validated at startup, accessed via context" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "The Pattern" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "Configuration is a Layer. Define it with ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "Effect.Config" }),
      ", expose it via",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "Context.Tag" }),
      ", and yield from context in handlers. No global config object."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Defining Config" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `import { Context, Config, Effect, Layer } from "effect"

// 1) Define the config shape
const AppConfigSchema = Config.all({
  DATABASE_URL: Config.string("DATABASE_URL"),
  REDIS_URL: Config.string("REDIS_URL"),
  PORT: Config.integer("PORT").pipe(Config.withDefault(3000)),
  NODE_ENV: Config.literal("development", "production", "test")("NODE_ENV").pipe(
    Config.withDefault("development")
  )
})

// 2) Infer the type
type AppConfig = Config.Config.Success<typeof AppConfigSchema>

// 3) Create the Context.Tag
class Config extends Context.Tag("Config")<Config, AppConfig>() {}

// 4) Create the Layer — reads from environment
const ConfigLive = Layer.effect(
  Config,
  Effect.config(AppConfigSchema)
)` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Using in Layers" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// Other layers can depend on Config
const PgPoolLive = Layer.scoped(
  PgPool,
  Effect.gen(function* () {
    const cfg = yield* Config
    const pool = new Pool({ connectionString: cfg.DATABASE_URL })
    yield* Effect.addFinalizer(() =>
      Effect.tryPromise(() => pool.end()).pipe(Effect.orDie)
    )
    return pool
  })
).pipe(Layer.provide(ConfigLive))` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Using in Handlers" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `HttpRouter.get("/info", Effect.gen(function* () {
  const cfg = yield* Config
  return HttpServerResponse.json({
    environment: cfg.NODE_ENV,
    port: cfg.PORT
  })
}))` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Nested Config" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// Group related config with Config.nested
const DatabaseConfig = Config.all({
  url: Config.string("URL"),
  poolMin: Config.integer("POOL_MIN").pipe(Config.withDefault(2)),
  poolMax: Config.integer("POOL_MAX").pipe(Config.withDefault(10)),
  ssl: Config.boolean("SSL").pipe(Config.withDefault(false))
}).pipe(Config.nested("DATABASE"))

// Reads: DATABASE_URL, DATABASE_POOL_MIN, DATABASE_POOL_MAX, DATABASE_SSL` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Secret Values" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// Config.secret wraps the value — won't leak in logs
const SecureConfig = Config.all({
  apiKey: Config.secret("API_KEY"),
  dbPassword: Config.secret("DB_PASSWORD")
})

// Access the underlying value
const cfg = yield* Effect.config(SecureConfig)
const key = Secret.value(cfg.apiKey) // string` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Validation at Startup" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Config is validated when the Layer is built. Missing or invalid values fail fast with clear error messages:" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { lang: "text", code: `ConfigError: Missing data at NODE_ENV: Expected one of
("development" | "production" | "test") but received "staging"` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Testing with Config" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// Override config in tests
const ConfigTest = Layer.succeed(Config, {
  DATABASE_URL: "postgres://localhost/test",
  REDIS_URL: "redis://localhost",
  PORT: 3001,
  NODE_ENV: "test" as const
})

await Effect.runPromise(
  myEffect.pipe(Effect.provide(ConfigTest))
)` })
  ] });
}
export {
  ConfigurationPage as component
};
