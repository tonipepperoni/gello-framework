/**
 * Cache Configuration Integration
 *
 * Helpers for configuring cache from environment variables
 * and creating cache layers from configuration.
 *
 * @module config
 */
import { Effect, Layer } from "effect"
import type { CacheStore } from "./ports/CacheStore.js"
import { makeCacheService, Cache } from "./Cache.js"
import type { CacheManagerConfig } from "./CacheManager.js"
import { CacheConfigError } from "./errors/CacheError.js"
import type { CacheError } from "./errors/CacheError.js"

/**
 * Cache driver types
 */
export type CacheDriver =
  | "memory"
  | "redis"
  | "file"
  | "database"
  | "null"
  | "multi"

/**
 * Cache configuration from environment
 */
export interface CacheConfig {
  /**
   * Default cache driver
   */
  driver: CacheDriver

  /**
   * Key prefix for all cache entries
   */
  prefix: string

  /**
   * Default TTL in seconds (0 = forever)
   */
  ttl: number

  /**
   * File store configuration (if driver = "file")
   */
  file?: {
    directory: string
  }

  /**
   * Redis configuration (if driver = "redis")
   */
  redis?: {
    host: string
    port: number
    password?: string
    database?: number
    tls?: boolean
  }

  /**
   * Database configuration (if driver = "database")
   */
  database?: {
    table: string
  }

  /**
   * Multi-level cache configuration (if driver = "multi")
   */
  multi?: {
    l1Driver: CacheDriver
    l2Driver: CacheDriver
    l1TtlSeconds?: number
  }
}

/**
 * Default cache configuration
 */
export const defaultCacheConfig: CacheConfig = {
  driver: "memory",
  prefix: "cache:",
  ttl: 3600,
}

/**
 * Read cache configuration from environment variables
 *
 * Environment variables:
 * - CACHE_DRIVER: memory | redis | file | database | null | multi
 * - CACHE_PREFIX: Key prefix (default: "cache:")
 * - CACHE_TTL: Default TTL in seconds (default: 3600)
 * - CACHE_PATH: File store directory (if driver = "file")
 * - CACHE_TABLE: Database table name (if driver = "database")
 * - REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DATABASE, REDIS_TLS
 */
export const readCacheConfigFromEnv = (): CacheConfig => {
  const env = (key: string, defaultValue?: string): string | undefined =>
    process.env[key] ?? defaultValue

  const driver = (env("CACHE_DRIVER", "memory") as CacheDriver) || "memory"
  const prefix = env("CACHE_PREFIX", "cache:") || "cache:"
  const ttl = parseInt(env("CACHE_TTL", "3600") || "3600", 10)

  const config: CacheConfig = {
    driver,
    prefix,
    ttl,
  }

  // File store config
  if (driver === "file") {
    config.file = {
      directory: env("CACHE_PATH", "/tmp/cache") || "/tmp/cache",
    }
  }

  // Redis config
  if (driver === "redis" || driver === "multi") {
    config.redis = {
      host: env("REDIS_HOST", "localhost") || "localhost",
      port: parseInt(env("REDIS_PORT", "6379") || "6379", 10),
      password: env("REDIS_PASSWORD"),
      database: parseInt(env("REDIS_DATABASE", "0") || "0", 10),
      tls: env("REDIS_TLS") === "true",
    }
  }

  // Database config
  if (driver === "database") {
    config.database = {
      table: env("CACHE_TABLE", "cache") || "cache",
    }
  }

  // Multi-level config
  if (driver === "multi") {
    config.multi = {
      l1Driver: "memory",
      l2Driver: (env("CACHE_L2_DRIVER", "redis") as CacheDriver) || "redis",
      l1TtlSeconds: parseInt(env("CACHE_L1_TTL", "300") || "300", 10),
    }
  }

  return config
}

/**
 * Create a cache layer from configuration
 *
 * This function is meant to be used with the drivers package:
 *
 * @example
 * ```typescript
 * import { createCacheFromConfig } from '@gello/cache';
 * import { makeMemoryStore, makeFileStore, makeRedisStore } from '@gello/cache-drivers';
 *
 * const config = readCacheConfigFromEnv();
 * const cacheLayer = createCacheFromConfig(config, {
 *   memory: () => Effect.runSync(makeMemoryStore()),
 *   file: (cfg) => Effect.runSync(makeFileStore({ directory: cfg.file!.directory })),
 *   redis: (cfg) => makeRedisStore(redisClient, { prefix: cfg.prefix }),
 * });
 * ```
 */
export interface StoreFactories {
  memory: (config: CacheConfig) => CacheStore
  file?: (config: CacheConfig) => CacheStore
  redis?: (config: CacheConfig) => CacheStore
  database?: (config: CacheConfig) => CacheStore
  null?: (config: CacheConfig) => CacheStore
  multi?: (config: CacheConfig, factories: StoreFactories) => CacheStore
}

/**
 * Create a cache store from configuration
 */
export const createStoreFromConfig = (
  config: CacheConfig,
  factories: StoreFactories
): Effect.Effect<CacheStore, CacheError> =>
  Effect.gen(function* () {
    // Handle multi driver specially (needs factories as second arg)
    if (config.driver === "multi") {
      if (!factories.multi) {
        return yield* Effect.fail(
          new CacheConfigError({
            setting: "driver",
            reason: `Multi driver requires a 'multi' factory`,
          })
        )
      }
      return factories.multi(config, factories)
    }

    // Get the factory for the single-arg drivers
    const factory = factories[config.driver] as
      | ((config: CacheConfig) => CacheStore)
      | undefined

    if (!factory) {
      return yield* Effect.fail(
        new CacheConfigError({
          setting: "driver",
          reason: `Unsupported cache driver: ${config.driver}`,
        })
      )
    }

    return factory(config)
  })

/**
 * Create a Cache service layer from configuration
 */
export const createCacheLayerFromConfig = (
  config: CacheConfig,
  factories: StoreFactories
): Layer.Layer<Cache, CacheError> =>
  Layer.effect(
    Cache,
    createStoreFromConfig(config, factories).pipe(
      Effect.map(makeCacheService)
    )
  )

/**
 * Create a CacheManager from configuration with multiple drivers
 */
export const createCacheManagerFromConfig = (
  defaultDriver: CacheDriver,
  stores: Record<string, CacheStore>
): Effect.Effect<CacheManagerConfig, CacheError> =>
  Effect.succeed({
    default: defaultDriver,
    stores,
  })

/**
 * Convenience type for cache configuration in app config
 */
export interface AppCacheConfig {
  cache: {
    driver: CacheDriver
    prefix: string
    ttl: number
    path?: string
    table?: string
    l1TtlSeconds?: number
  }
}

/**
 * Example configuration structure for generated apps
 */
export const exampleCacheConfig = `
// src/config/cache.ts
import { env } from '@gello/config';

export const cacheConfig = {
  driver: env('CACHE_DRIVER', 'memory') as 'memory' | 'redis' | 'file' | 'database' | 'null',
  prefix: env('CACHE_PREFIX', 'app:'),
  ttl: Number(env('CACHE_TTL', '3600')),

  // File store
  file: {
    directory: env('CACHE_PATH', '/tmp/cache'),
  },

  // Redis (uses shared redis config)
  redis: {
    host: env('REDIS_HOST', 'localhost'),
    port: Number(env('REDIS_PORT', '6379')),
    password: env('REDIS_PASSWORD', ''),
    database: Number(env('REDIS_DATABASE', '0')),
    tls: env('REDIS_TLS', 'false') === 'true',
  },

  // Database
  database: {
    table: env('CACHE_TABLE', 'cache'),
  },
} as const;
`
