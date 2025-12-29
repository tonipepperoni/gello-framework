/**
 * @gello/cache - Laravel-inspired caching with Effect-TS
 *
 * @module @gello/cache
 */

// Domain layer
export * from "./lib/domain/index.js"

// Error types
export * from "./lib/errors/index.js"

// Port interfaces
export * from "./lib/ports/index.js"

// Application layer (Cache service)
export {
  Cache,
  makeCacheService,
  CacheLive,
  makeCacheLayer,
} from "./lib/Cache.js"
export type {
  CacheService,
  TaggedCacheService,
} from "./lib/Cache.js"

// CacheManager (multi-store management)
export {
  CacheManagerTag,
  makeCacheManager,
  CacheManagerLive,
  useStore,
  useCache,
  CacheManagerBuilder,
  cacheManagerBuilder,
} from "./lib/CacheManager.js"
export type {
  CacheManager,
  CacheManagerConfig,
} from "./lib/CacheManager.js"

// Re-export types that are commonly used
export type {
  CacheKey,
  CacheTag,
  CacheEntry,
  Duration,
} from "./lib/domain/index.js"

export type { CacheError } from "./lib/errors/index.js"

export type {
  CacheStore,
  TaggableStore,
  Serializer,
} from "./lib/ports/index.js"

// Configuration integration
export {
  readCacheConfigFromEnv,
  createStoreFromConfig,
  createCacheLayerFromConfig,
  createCacheManagerFromConfig,
  defaultCacheConfig,
  exampleCacheConfig,
} from "./lib/config.js"
export type {
  CacheDriver,
  CacheConfig,
  StoreFactories,
  AppCacheConfig,
} from "./lib/config.js"
