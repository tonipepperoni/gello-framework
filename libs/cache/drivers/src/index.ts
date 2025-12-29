/**
 * @gello/cache-drivers - Cache store adapters
 *
 * @module @gello/cache-drivers
 */

// Memory store (default)
export {
  makeMemoryStore,
  MemoryStoreLive,
  MemoryTaggableStoreLive,
} from "./lib/MemoryStore.js"

// Null store (for testing/disabling cache)
export {
  NullStore,
  NullStoreLive,
  NullTaggableStoreLive,
} from "./lib/NullStore.js"

// File store (file system persistence)
export {
  makeFileStore,
  FileStoreLive,
  garbageCollect as fileGarbageCollect,
} from "./lib/FileStore.js"
export type { FileStoreConfig } from "./lib/FileStore.js"

// Redis store (distributed cache)
export {
  makeRedisStore,
  RedisStoreLive,
  RedisStoreLiveScoped,
  RedisBasicStoreLive,
} from "./lib/RedisStore.js"
export type { RedisStoreConfig, RedisClient } from "./lib/RedisStore.js"

// Multi-level store (L1/L2 caching)
export {
  makeMultiStore,
  MultiStoreLive,
  makeMultiStoreWithMemory,
  makeReadThroughStore,
  makeWriteThroughStore,
} from "./lib/MultiStore.js"
export type {
  MultiStoreConfig,
  MultiStoreWithMemoryConfig,
} from "./lib/MultiStore.js"

// Database store (SQL persistence)
export {
  makeDatabaseStore,
  DatabaseStoreLive,
  createCacheTableSQL,
  garbageCollect as dbGarbageCollect,
} from "./lib/DatabaseStore.js"
export type {
  DatabaseStoreConfig,
  DatabaseClient,
} from "./lib/DatabaseStore.js"
