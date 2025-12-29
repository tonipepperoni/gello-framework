# Gello Configuration System

A Laravel-competitive configuration system built on Effect, using functional programming patterns from "Practical FP in Scala" and the Effect ecosystem.

## Design Goals

1. **Laravel DX** — Dot notation, environment cascading, runtime overrides
2. **FP Patterns** — Reader monad (via Effect Context), Validation Applicative, Optics
3. **Type Safety** — Refined types, branded values, compile-time guarantees
4. **Effect Native** — All operations return `Effect.Effect<A, ConfigError, R>`

---

## Architecture

### Layer Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    ConfigService (Tag)                       │
│                         ↑                                    │
│         ┌───────────────┼───────────────┐                   │
│         │               │               │                   │
│    EnvLoader      FileLoader      DefaultsLoader            │
│    (.env files)   (config/*.ts)   (hardcoded)               │
│         │               │               │                   │
│         └───────────────┼───────────────┘                   │
│                         ↓                                    │
│              ConfigMerger (Optics-based)                    │
│                         ↓                                    │
│              ConfigValidator (Refined + Schema)             │
│                         ↓                                    │
│              ConfigCache (Effect.cached)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Core API

### Reading Config

```typescript
import { Config } from "@gello/config"

// Dot notation access
const host = yield* Config.get("database.host")
const port = yield* Config.get("database.port", 5432)  // with default

// Typed accessors
const debug = yield* Config.boolean("app.debug")
const timeout = yield* Config.number("http.timeout")
const name = yield* Config.string("app.name")

// Refined types (validated at access time)
const port = yield* Config.refined("server.port", Port)         // Port: 1-65535
const email = yield* Config.refined("admin.email", Email)       // Email format
const url = yield* Config.refined("api.baseUrl", Url)           // Valid URL

// Nested config as typed object
const database = yield* Config.section("database", DatabaseConfigSchema)
```

### Environment Detection

```typescript
// Check current environment
const env = yield* Config.environment()  // "local" | "staging" | "production"

// Environment predicates
if (yield* Config.isLocal()) { ... }
if (yield* Config.isProduction()) { ... }

// Environment-specific execution
yield* Config.whenLocal(Effect.log("Debug mode enabled"))
```

### Runtime Overrides

```typescript
// Scoped override (for testing)
yield* Config.withOverrides({ "database.host": "localhost" }, myEffect)

// Layer-based override
const TestConfigLayer = Config.overrideLayer({
  "database.host": "localhost",
  "cache.driver": "memory",
})
```

---

## File Structure

```
config/
├── app.ts              # Application config
├── database.ts         # Database connections
├── cache.ts            # Cache settings
├── queue.ts            # Queue configuration
├── http.ts             # HTTP server settings
├── local/              # Local environment overrides
│   ├── app.ts
│   └── database.ts
├── staging/            # Staging overrides
│   └── database.ts
└── production/         # Production overrides
    └── app.ts
```

### Config File Format

```typescript
// config/database.ts
import { defineConfig } from "@gello/config"

export default defineConfig({
  default: "postgres",

  connections: {
    postgres: {
      host: env("DB_HOST", "localhost"),
      port: env("DB_PORT", 5432),
      database: env("DB_DATABASE", "gello"),
      username: env("DB_USERNAME", "postgres"),
      password: env("DB_PASSWORD"),  // required, no default
    },

    sqlite: {
      database: env("SQLITE_DATABASE", ":memory:"),
    },
  },

  pool: {
    min: 2,
    max: 10,
  },
})
```

---

## Environment Variables

### .env File Support

```bash
# .env (base, committed)
APP_NAME=Gello
APP_DEBUG=false

# .env.local (local overrides, gitignored)
APP_DEBUG=true
DB_HOST=localhost

# .env.production (production, gitignored or in CI)
APP_DEBUG=false
DB_HOST=prod-db.example.com
```

### Loading Priority (highest wins)

1. Runtime overrides (`Config.withOverrides`)
2. Process environment (`process.env`)
3. `.env.{environment}` file (`.env.local`, `.env.production`)
4. `.env` file
5. Config file environment folder (`config/local/app.ts`)
6. Base config files (`config/app.ts`)
7. Defaults in code

---

## Validation

### Using Refined Types

```typescript
// libs/core/config/src/validators.ts
import { refined, boundedInt, NonEmptyString } from "@gello/refined"

// Pre-built config validators
export const Port = boundedInt(1, 65535)
export const Timeout = boundedInt(0, 300_000)  // 0-5 minutes
export const PoolSize = boundedInt(1, 100)
export const LogLevel = Schema.Literal("debug", "info", "warn", "error")

// Composite config schemas
export const DatabaseConfig = Schema.Struct({
  host: NonEmptyString,
  port: Port,
  database: NonEmptyString,
  username: NonEmptyString,
  password: Schema.String,
  pool: Schema.Struct({
    min: PoolSize,
    max: PoolSize,
  }),
})
```

### Validation Applicative (Accumulate All Errors)

```typescript
// Validate entire config at startup, collect ALL errors
const validateConfig = Config.validateAll([
  Config.require("app.name", NonEmptyString),
  Config.require("database.host", NonEmptyString),
  Config.require("database.port", Port),
  Config.require("server.port", Port),
])

// Returns Either<ConfigErrors[], ValidatedConfig>
// ConfigErrors is an array of ALL validation failures, not just first
```

---

## Implementation Modules

### 1. ConfigLoader (Reader Pattern)

```typescript
// Loads config from various sources, returns raw Record<string, unknown>
interface ConfigLoader {
  readonly load: Effect.Effect<Record<string, unknown>, ConfigLoadError>
}

const EnvFileLoader: ConfigLoader = ...    // .env files
const TsFileLoader: ConfigLoader = ...     // config/*.ts files
const ProcessEnvLoader: ConfigLoader = ... // process.env
```

### 2. ConfigMerger (Optics)

```typescript
// Deep merge configs with Lens-based path access
import { Lens, path } from "@gello/optics"

const merge = (base: Config, override: Config): Config => {
  // Use Optics for immutable deep merge
  return pipe(
    base,
    Lens.modify(path("database", "host"), () => override.database?.host),
    // ... etc
  )
}
```

### 3. ConfigAccessor (Dot Notation)

```typescript
// "database.connections.postgres.host" -> nested access
const get = (key: string) => {
  const parts = key.split(".")
  return parts.reduce((obj, part) => obj?.[part], config)
}
```

### 4. ConfigCache (Effect.cached)

```typescript
// Cache parsed config to avoid repeated parsing
const cachedConfig = Effect.cached(
  loadAndValidateConfig()
)
```

---

## Testing Support

```typescript
// Test with overridden config
const testEffect = pipe(
  myHandler,
  Effect.provide(Config.testLayer({
    "database.host": "localhost",
    "database.port": 5432,
  }))
)

// Or use Config.withOverrides for scoped overrides
const result = yield* Config.withOverrides(
  { "feature.enabled": true },
  checkFeatureFlag()
)
```

---

## Implementation Plan

### Phase 1: Core API
- [ ] `ConfigService` Context.Tag and `ConfigPort` interface
- [ ] Dot notation accessor (`Config.get`, `Config.string`, etc.)
- [ ] Basic file loader for `config/*.ts`
- [ ] Environment detection (`Config.environment()`)

### Phase 2: Environment Support
- [ ] `.env` file parser
- [ ] Environment cascading (local → staging → production)
- [ ] `process.env` integration
- [ ] Priority-based merge

### Phase 3: Validation
- [ ] Refined type validators (Port, Email, Url, etc.)
- [ ] Schema-based section validation
- [ ] Validation Applicative (accumulate errors)
- [ ] Startup validation with clear error messages

### Phase 4: Advanced Features
- [ ] Optics-based deep merge
- [ ] Runtime overrides with `Config.withOverrides`
- [ ] Config caching with `Effect.cached`
- [ ] Test utilities and mock layers

### Phase 5: DX Polish
- [ ] `defineConfig` helper with TypeScript inference
- [ ] Config file generator (`gello make:config`)
- [ ] Documentation and examples

---

## File Locations

```
libs/core/config/
├── src/
│   ├── index.ts              # Public API exports
│   ├── Config.ts             # Main Config module (get, string, etc.)
│   ├── ConfigService.ts      # Context.Tag and Layer
│   ├── loaders/
│   │   ├── EnvLoader.ts      # .env file loading
│   │   ├── FileLoader.ts     # config/*.ts loading
│   │   └── ProcessEnvLoader.ts
│   ├── merger/
│   │   └── ConfigMerger.ts   # Optics-based merge
│   ├── validators/
│   │   ├── refined.ts        # Port, Email, etc.
│   │   └── schemas.ts        # Composite config schemas
│   └── testing/
│       └── TestConfig.ts     # Test utilities
```

---

## References

- Laravel Configuration: https://laravel.com/docs/configuration
- Effect Config: https://effect.website/docs/configuration
- Practical FP in Scala (Volpe): Refined types, Optics patterns
- FP in Scala (Chiusano): Reader monad, Validation applicative
