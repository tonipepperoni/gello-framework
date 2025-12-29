/**
 * Config validators using Effect Schema
 *
 * Pre-built validators for common config values
 */

import { Schema } from "@effect/schema"

// ─── String Validators ───────────────────────────────────────────

/**
 * Non-empty string
 */
export const NonEmptyString = Schema.String.pipe(
  Schema.minLength(1, { message: () => "String cannot be empty" })
)

/**
 * Trimmed non-empty string
 */
export const TrimmedString = Schema.transform(
  Schema.String,
  Schema.String,
  {
    decode: (s) => s.trim(),
    encode: (s) => s,
  }
).pipe(Schema.minLength(1, { message: () => "String cannot be empty after trimming" }))

// ─── Number Validators ───────────────────────────────────────────

/**
 * Port number (1-65535)
 */
export const Port = Schema.Number.pipe(
  Schema.int({ message: () => "Port must be an integer" }),
  Schema.between(1, 65535, { message: () => "Port must be between 1 and 65535" })
)

/**
 * Positive integer
 */
export const PositiveInt = Schema.Number.pipe(
  Schema.int({ message: () => "Must be an integer" }),
  Schema.positive({ message: () => "Must be positive" })
)

/**
 * Non-negative integer (0 or greater)
 */
export const NonNegativeInt = Schema.Number.pipe(
  Schema.int({ message: () => "Must be an integer" }),
  Schema.nonNegative({ message: () => "Must be non-negative" })
)

/**
 * Timeout in milliseconds (0-5 minutes)
 */
export const Timeout = Schema.Number.pipe(
  Schema.int({ message: () => "Timeout must be an integer" }),
  Schema.between(0, 300_000, { message: () => "Timeout must be between 0 and 300000ms" })
)

/**
 * Pool size (1-100)
 */
export const PoolSize = Schema.Number.pipe(
  Schema.int({ message: () => "Pool size must be an integer" }),
  Schema.between(1, 100, { message: () => "Pool size must be between 1 and 100" })
)

/**
 * Percentage (0-100)
 */
export const Percentage = Schema.Number.pipe(
  Schema.between(0, 100, { message: () => "Percentage must be between 0 and 100" })
)

// ─── Format Validators ───────────────────────────────────────────

/**
 * URL format
 */
export const Url = Schema.String.pipe(
  Schema.pattern(/^https?:\/\/.+/, { message: () => "Must be a valid URL" })
)

/**
 * Email format
 */
export const Email = Schema.String.pipe(
  Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: () => "Must be a valid email" })
)

/**
 * UUID format
 */
export const UUID = Schema.String.pipe(
  Schema.pattern(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    { message: () => "Must be a valid UUID" }
  )
)

/**
 * Hostname (domain or IP)
 */
export const Hostname = Schema.String.pipe(
  Schema.pattern(
    /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}|(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z]{2,})$/,
    { message: () => "Must be a valid hostname or IP address" }
  )
)

// ─── Enum Validators ─────────────────────────────────────────────

/**
 * Log level
 */
export const LogLevel = Schema.Literal("debug", "info", "warn", "error", "fatal")
export type LogLevel = Schema.Schema.Type<typeof LogLevel>

/**
 * Environment
 */
export const EnvironmentSchema = Schema.Literal(
  "local",
  "development",
  "staging",
  "production",
  "testing"
)

// ─── Boolean Coercion ────────────────────────────────────────────

/**
 * Coerce string to boolean
 * Accepts: true, false, 1, 0, yes, no, on, off
 */
export const BooleanFromString = Schema.transform(
  Schema.String,
  Schema.Boolean,
  {
    decode: (s) => {
      const lower = s.toLowerCase().trim()
      return ["true", "1", "yes", "on"].includes(lower)
    },
    encode: (b) => (b ? "true" : "false"),
  }
)

/**
 * Coerce string to number
 */
export const NumberFromString = Schema.transform(
  Schema.String,
  Schema.Number,
  {
    decode: (s) => {
      const n = Number(s)
      if (Number.isNaN(n)) {
        throw new Error(`Cannot convert "${s}" to number`)
      }
      return n
    },
    encode: (n) => String(n),
  }
)

/**
 * Port from string
 */
export const PortFromString = Schema.compose(NumberFromString, Port)

// ─── Composite Config Schemas ────────────────────────────────────

/**
 * Database connection config
 */
export const DatabaseConnectionConfig = Schema.Struct({
  host: Hostname,
  port: Port,
  database: NonEmptyString,
  username: NonEmptyString,
  password: Schema.String,
  ssl: Schema.optional(Schema.Boolean),
})

/**
 * Database pool config
 */
export const DatabasePoolConfig = Schema.Struct({
  min: PoolSize,
  max: PoolSize,
  idleTimeout: Schema.optional(Timeout),
  connectionTimeout: Schema.optional(Timeout),
})

/**
 * HTTP server config
 */
export const HttpServerConfig = Schema.Struct({
  host: Schema.optional(Hostname),
  port: Port,
  shutdownTimeout: Schema.optional(Timeout),
})

/**
 * Redis config
 */
export const RedisConfig = Schema.Struct({
  host: Hostname,
  port: Port,
  password: Schema.optional(Schema.String),
  database: Schema.optional(NonNegativeInt),
  tls: Schema.optional(Schema.Boolean),
})

/**
 * App config
 */
export const AppConfig = Schema.Struct({
  name: NonEmptyString,
  env: EnvironmentSchema,
  debug: Schema.Boolean,
  url: Schema.optional(Url),
  timezone: Schema.optional(Schema.String),
})
