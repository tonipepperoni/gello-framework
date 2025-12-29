/**
 * CacheError - Algebraic data type for cache errors
 *
 * @module errors/CacheError
 */
import { Data } from "effect"
import type { CacheKey } from "../domain/CacheKey.js"

/**
 * Cache miss - key not found in cache
 */
export class CacheMiss extends Data.TaggedError("CacheMiss")<{
  readonly key: CacheKey
}> {
  override get message(): string {
    return `Cache miss for key: ${this.key}`
  }
}

/**
 * Cache connection error - failed to connect to cache backend
 */
export class CacheConnectionError extends Data.TaggedError(
  "CacheConnectionError"
)<{
  readonly driver: string
  readonly cause: unknown
}> {
  override get message(): string {
    return `Cache connection error for driver "${this.driver}": ${String(this.cause)}`
  }
}

/**
 * Serialization error - failed to serialize or deserialize value
 */
export class CacheSerializationError extends Data.TaggedError(
  "CacheSerializationError"
)<{
  readonly operation: "serialize" | "deserialize"
  readonly cause: unknown
}> {
  override get message(): string {
    return `Cache ${this.operation} error: ${String(this.cause)}`
  }
}

/**
 * Store error - generic store operation error
 */
export class CacheStoreError extends Data.TaggedError("CacheStoreError")<{
  readonly operation: string
  readonly driver: string
  readonly cause: unknown
}> {
  override get message(): string {
    return `Cache store error in ${this.driver}.${this.operation}: ${String(this.cause)}`
  }
}

/**
 * Configuration error - invalid cache configuration
 */
export class CacheConfigError extends Data.TaggedError("CacheConfigError")<{
  readonly setting: string
  readonly reason: string
}> {
  override get message(): string {
    return `Cache config error for "${this.setting}": ${this.reason}`
  }
}

/**
 * Union type of all cache errors
 */
export type CacheError =
  | CacheMiss
  | CacheConnectionError
  | CacheSerializationError
  | CacheStoreError
  | CacheConfigError

/**
 * Check if an error is a cache miss
 */
export const isCacheMiss = (error: CacheError): error is CacheMiss =>
  error._tag === "CacheMiss"

/**
 * Check if an error is a connection error
 */
export const isConnectionError = (
  error: CacheError
): error is CacheConnectionError => error._tag === "CacheConnectionError"

/**
 * Check if an error is a serialization error
 */
export const isSerializationError = (
  error: CacheError
): error is CacheSerializationError =>
  error._tag === "CacheSerializationError"

/**
 * Check if an error is a store error
 */
export const isStoreError = (error: CacheError): error is CacheStoreError =>
  error._tag === "CacheStoreError"

/**
 * Check if an error is a config error
 */
export const isConfigError = (error: CacheError): error is CacheConfigError =>
  error._tag === "CacheConfigError"
