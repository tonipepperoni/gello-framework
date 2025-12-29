/**
 * Error exports
 *
 * @module errors
 */
export {
  CacheMiss,
  CacheConnectionError,
  CacheSerializationError,
  CacheStoreError,
  CacheConfigError,
  isCacheMiss,
  isConnectionError,
  isSerializationError,
  isStoreError,
  isConfigError,
} from "./CacheError.js"
export type { CacheError } from "./CacheError.js"
