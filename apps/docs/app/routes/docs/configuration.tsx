import { createFileRoute } from '@tanstack/react-router';
import { CodeBlock } from '../../components/CodeBlock';

export const Route = createFileRoute('/docs/configuration')({
  component: ConfigurationPage,
});

function ConfigurationPage() {
  return (
    <article className="prose">
      <h1>Configuration</h1>
      <p className="text-xl text-zinc-400 mb-8">
        Effect.Config + Layer — validated at startup, accessed via context
      </p>

      <h2>The Pattern</h2>
      <p>
        Configuration is a Layer. Define it with <code>Effect.Config</code>, expose it via{' '}
        <code>Context.Tag</code>, and yield from context in handlers. No global config object.
      </p>

      <h2>Defining Config</h2>
      <CodeBlock code={`import { Context, Config, Effect, Layer } from "effect"

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
)`} />

      <h2>Using in Layers</h2>
      <CodeBlock code={`// Other layers can depend on Config
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
).pipe(Layer.provide(ConfigLive))`} />

      <h2>Using in Handlers</h2>
      <CodeBlock code={`HttpRouter.get("/info", Effect.gen(function* () {
  const cfg = yield* Config
  return HttpServerResponse.json({
    environment: cfg.NODE_ENV,
    port: cfg.PORT
  })
}))`} />

      <h2>Nested Config</h2>
      <CodeBlock code={`// Group related config with Config.nested
const DatabaseConfig = Config.all({
  url: Config.string("URL"),
  poolMin: Config.integer("POOL_MIN").pipe(Config.withDefault(2)),
  poolMax: Config.integer("POOL_MAX").pipe(Config.withDefault(10)),
  ssl: Config.boolean("SSL").pipe(Config.withDefault(false))
}).pipe(Config.nested("DATABASE"))

// Reads: DATABASE_URL, DATABASE_POOL_MIN, DATABASE_POOL_MAX, DATABASE_SSL`} />

      <h2>Secret Values</h2>
      <CodeBlock code={`// Config.secret wraps the value — won't leak in logs
const SecureConfig = Config.all({
  apiKey: Config.secret("API_KEY"),
  dbPassword: Config.secret("DB_PASSWORD")
})

// Access the underlying value
const cfg = yield* Effect.config(SecureConfig)
const key = Secret.value(cfg.apiKey) // string`} />

      <h2>Validation at Startup</h2>
      <p>
        Config is validated when the Layer is built. Missing or invalid values fail fast
        with clear error messages:
      </p>
      <CodeBlock lang="text" code={`ConfigError: Missing data at NODE_ENV: Expected one of
("development" | "production" | "test") but received "staging"`} />

      <h2>Testing with Config</h2>
      <CodeBlock code={`// Override config in tests
const ConfigTest = Layer.succeed(Config, {
  DATABASE_URL: "postgres://localhost/test",
  REDIS_URL: "redis://localhost",
  PORT: 3001,
  NODE_ENV: "test" as const
})

await Effect.runPromise(
  myEffect.pipe(Effect.provide(ConfigTest))
)`} />
    </article>
  );
}
