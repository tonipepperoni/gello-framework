/**
 * Config Module
 *
 * Laravel-inspired configuration with Effect patterns.
 * Provides dot notation access, type coercion, and validation.
 */

import { Context, Effect, Layer, Option } from "effect"
import { Schema } from "@effect/schema"
import type { ParseError } from "@effect/schema/ParseResult"
import { ConfigError } from "@gello/core-contracts"
import { getPath, setPath, deepMerge } from "./DotNotation.js"
import {
  detectEnvironment,
  environment,
  isLocal,
  isProduction,
  isTesting,
  isStaging,
  isDevelopment,
  whenEnvironment,
  whenLocal,
  whenProduction,
  type Environment,
} from "./Environment.js"
import { loadEnvFiles, env } from "./loaders/EnvLoader.js"

// ─── Config Store ────────────────────────────────────────────────

type ConfigData = Record<string, unknown>

/**
 * Internal config store interface
 */
export interface ConfigStore {
  readonly data: ConfigData
  readonly get: (key: string) => Option.Option<unknown>
  readonly set: (key: string, value: unknown) => ConfigStore
  readonly merge: (override: ConfigData) => ConfigStore
}

const createStore = (data: ConfigData): ConfigStore => ({
  data,
  get: (key) => getPath(data, key),
  set: (key, value) => createStore(setPath(data, key, value)),
  merge: (override) => createStore(deepMerge(data, override)),
})

// ─── Config Service ──────────────────────────────────────────────

/**
 * Config service interface
 */
export interface ConfigService {
  /**
   * Get a config value by dot-notation key
   */
  readonly get: <A>(key: string, defaultValue?: A) => Effect.Effect<A, ConfigError>

  /**
   * Get a string config value
   */
  readonly string: (key: string, defaultValue?: string) => Effect.Effect<string, ConfigError>

  /**
   * Get a number config value
   */
  readonly number: (key: string, defaultValue?: number) => Effect.Effect<number, ConfigError>

  /**
   * Get a boolean config value
   */
  readonly boolean: (key: string, defaultValue?: boolean) => Effect.Effect<boolean, ConfigError>

  /**
   * Get a config value validated against a schema
   */
  readonly schema: <A, I>(
    key: string,
    schema: Schema.Schema<A, I>,
    defaultValue?: A
  ) => Effect.Effect<A, ConfigError | ParseError>

  /**
   * Check if a config key exists
   */
  readonly has: (key: string) => Effect.Effect<boolean>

  /**
   * Get all config data
   */
  readonly all: () => Effect.Effect<ConfigData>

  /**
   * Get current environment
   */
  readonly environment: () => Effect.Effect<Environment>

  /**
   * Check if in a specific environment
   */
  readonly isEnvironment: (env: Environment) => Effect.Effect<boolean>
}

/**
 * Config service tag
 */
export class Config extends Context.Tag("@gello/Config")<Config, ConfigService>() {}

// ─── Config Implementation ───────────────────────────────────────

const makeConfigService = (store: ConfigStore): ConfigService => ({
  get: <A>(key: string, defaultValue?: A) =>
    Effect.gen(function* () {
      const value = store.get(key)
      if (Option.isNone(value)) {
        if (defaultValue !== undefined) {
          return defaultValue
        }
        return yield* Effect.fail(ConfigError.missing(key))
      }
      return value.value as A
    }),

  string: (key: string, defaultValue?: string) =>
    Effect.gen(function* () {
      const value = store.get(key)
      if (Option.isNone(value)) {
        if (defaultValue !== undefined) return defaultValue
        return yield* Effect.fail(ConfigError.missing(key))
      }
      const v = value.value
      if (typeof v === "string") return v
      if (typeof v === "number" || typeof v === "boolean") return String(v)
      return yield* Effect.fail(ConfigError.invalid(key, `Expected string, got ${typeof v}`))
    }),

  number: (key: string, defaultValue?: number) =>
    Effect.gen(function* () {
      const value = store.get(key)
      if (Option.isNone(value)) {
        if (defaultValue !== undefined) return defaultValue
        return yield* Effect.fail(ConfigError.missing(key))
      }
      const v = value.value
      if (typeof v === "number") return v
      if (typeof v === "string") {
        const n = Number(v)
        if (!Number.isNaN(n)) return n
      }
      return yield* Effect.fail(ConfigError.invalid(key, `Expected number, got ${typeof v}`))
    }),

  boolean: (key: string, defaultValue?: boolean) =>
    Effect.gen(function* () {
      const value = store.get(key)
      if (Option.isNone(value)) {
        if (defaultValue !== undefined) return defaultValue
        return yield* Effect.fail(ConfigError.missing(key))
      }
      const v = value.value
      if (typeof v === "boolean") return v
      if (typeof v === "string") {
        const lower = v.toLowerCase().trim()
        if (["true", "1", "yes", "on"].includes(lower)) return true
        if (["false", "0", "no", "off"].includes(lower)) return false
      }
      if (typeof v === "number") return v !== 0
      return yield* Effect.fail(ConfigError.invalid(key, `Expected boolean, got ${typeof v}`))
    }),

  schema: <A, I>(key: string, s: Schema.Schema<A, I>, defaultValue?: A) =>
    Effect.gen(function* () {
      const value = store.get(key)
      if (Option.isNone(value)) {
        if (defaultValue !== undefined) return defaultValue
        return yield* Effect.fail(ConfigError.missing(key))
      }
      return yield* Schema.decodeUnknown(s)(value.value)
    }),

  has: (key: string) => Effect.succeed(Option.isSome(store.get(key))),

  all: () => Effect.succeed(store.data),

  environment: () => environment,

  isEnvironment: (e: Environment) =>
    Effect.map(environment, (current) => current === e),
})

// ─── Config Layer ────────────────────────────────────────────────

/**
 * Create a Config layer from static config data
 */
export const layer = (config: ConfigData): Layer.Layer<Config> =>
  Layer.succeed(Config, makeConfigService(createStore(config)))

/**
 * Create a Config layer that loads from environment variables
 */
export const fromEnv = (
  mapping: Record<string, string>
): Layer.Layer<Config> =>
  Layer.effect(
    Config,
    Effect.sync(() => {
      const data: ConfigData = {}
      for (const [configKey, envKey] of Object.entries(mapping)) {
        const value = process.env[envKey]
        if (value !== undefined) {
          // Use setPath to handle nested keys
          Object.assign(data, setPath(data as Record<string, unknown>, configKey, value))
        }
      }
      return makeConfigService(createStore(data))
    })
  )

/**
 * Create a Config layer that loads from .env files and merges with provided config
 */
export const fromEnvFiles = (
  basePath: string = process.cwd(),
  baseConfig: ConfigData = {}
): Layer.Layer<Config> =>
  Layer.effect(
    Config,
    Effect.gen(function* () {
      const envVars = yield* loadEnvFiles(basePath)

      // Convert flat env vars to nested config
      const envConfig: ConfigData = {}
      for (const [key, value] of Object.entries(envVars)) {
        // Convert UPPER_SNAKE_CASE to dot.notation
        const configKey = key.toLowerCase().replace(/_/g, ".")
        Object.assign(envConfig, setPath(envConfig as Record<string, unknown>, configKey, value))
      }

      // Merge: baseConfig < envConfig < process.env
      const merged = deepMerge(
        deepMerge(baseConfig, envConfig),
        {} // process.env is accessed dynamically
      )

      return makeConfigService(createStore(merged))
    })
  )

// ─── Config Helpers ──────────────────────────────────────────────

/**
 * Get a config value (requires Config service)
 */
export const get = <A>(key: string, defaultValue?: A): Effect.Effect<A, ConfigError, Config> =>
  Effect.flatMap(Config, (config) => config.get(key, defaultValue))

/**
 * Get a string config value
 */
export const string = (
  key: string,
  defaultValue?: string
): Effect.Effect<string, ConfigError, Config> =>
  Effect.flatMap(Config, (config) => config.string(key, defaultValue))

/**
 * Get a number config value
 */
export const number = (
  key: string,
  defaultValue?: number
): Effect.Effect<number, ConfigError, Config> =>
  Effect.flatMap(Config, (config) => config.number(key, defaultValue))

/**
 * Get a boolean config value
 */
export const boolean = (
  key: string,
  defaultValue?: boolean
): Effect.Effect<boolean, ConfigError, Config> =>
  Effect.flatMap(Config, (config) => config.boolean(key, defaultValue))

/**
 * Get a config value validated against a schema
 */
export const schema = <A, I>(
  key: string,
  s: Schema.Schema<A, I>,
  defaultValue?: A
): Effect.Effect<A, ConfigError | ParseError, Config> =>
  Effect.flatMap(Config, (config) => config.schema(key, s, defaultValue))

/**
 * Check if a config key exists
 */
export const has = (key: string): Effect.Effect<boolean, never, Config> =>
  Effect.flatMap(Config, (config) => config.has(key))

/**
 * Get all config data
 */
export const all = (): Effect.Effect<ConfigData, never, Config> =>
  Effect.flatMap(Config, (config) => config.all())

// ─── Testing Utilities ───────────────────────────────────────────

/**
 * Create a test layer with overrides
 */
export const testLayer = (overrides: ConfigData): Layer.Layer<Config> =>
  layer(overrides)

/**
 * Run an effect with config overrides
 */
export const withOverrides = <A, E, R>(
  overrides: ConfigData,
  effect: Effect.Effect<A, E, R>
): Effect.Effect<A, E, Exclude<R, Config>> =>
  Effect.provide(effect, layer(overrides)) as Effect.Effect<A, E, Exclude<R, Config>>

// ─── Re-exports ──────────────────────────────────────────────────

export {
  // Environment
  environment,
  isLocal,
  isProduction,
  isTesting,
  isStaging,
  isDevelopment,
  whenEnvironment,
  whenLocal,
  whenProduction,
  detectEnvironment,
  type Environment,
  // Env helper
  env,
}
