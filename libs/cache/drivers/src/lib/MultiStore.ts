/**
 * MultiStore - Multi-level (L1/L2) cache store adapter
 *
 * Implements a layered caching strategy where:
 * - L1 is typically fast in-memory cache
 * - L2 is typically persistent cache (Redis, file, database)
 *
 * Read-through: On cache miss from L1, fetch from L2 and populate L1
 * Write-through: Writes go to both L1 and L2
 *
 * @module adapters/MultiStore
 */
import { Effect, Layer, Option } from "effect"
import {
  CacheStoreTag,
} from "@gello/cache"
import type {
  CacheKey,
  Duration,
  CacheStore,
  CacheError,
} from "@gello/cache"

/**
 * Multi-store configuration
 */
export interface MultiStoreConfig {
  /**
   * L1 cache store (fast, typically in-memory)
   */
  readonly l1: CacheStore

  /**
   * L2 cache store (persistent, typically Redis/file/database)
   */
  readonly l2: CacheStore

  /**
   * TTL for L1 cache (defaults to original TTL if not specified)
   * Set this shorter than L2 TTL to balance freshness vs performance
   */
  readonly l1Ttl?: Duration

  /**
   * Whether to populate L1 on L2 cache hits (default: true)
   */
  readonly populateL1OnHit?: boolean

  /**
   * Whether to write to both stores (default: true)
   * If false, only writes to L2 (useful for read-heavy workloads)
   */
  readonly writeToL1?: boolean
}

/**
 * Create a multi-level cache store
 *
 * @example
 * ```typescript
 * const multiStore = makeMultiStore({
 *   l1: memoryStore,     // Fast in-memory
 *   l2: redisStore,      // Persistent Redis
 *   l1Ttl: minutes(5),   // Keep in L1 for 5 minutes
 * });
 * ```
 */
export const makeMultiStore = (config: MultiStoreConfig): CacheStore => {
  const { l1, l2, l1Ttl, populateL1OnHit = true, writeToL1 = true } = config

  const store: CacheStore = {
    get: <A>(key: CacheKey): Effect.Effect<Option.Option<A>, CacheError> =>
      l1.get<A>(key).pipe(
        Effect.flatMap((l1Result: Option.Option<A>) => {
          if (Option.isSome(l1Result)) {
            return Effect.succeed(l1Result)
          }
          // Fall back to L2
          return l2.get<A>(key).pipe(
            Effect.tap((l2Result: Option.Option<A>) => {
              // Populate L1 on L2 hit if configured
              if (Option.isSome(l2Result) && populateL1OnHit) {
                return l1.put(key, l2Result.value, l1Ttl)
              }
              return Effect.void
            })
          )
        })
      ),

    put: <A>(
      key: CacheKey,
      value: A,
      ttl?: Duration
    ): Effect.Effect<void, CacheError> =>
      // Write to L2 first (source of truth)
      l2.put(key, value, ttl).pipe(
        Effect.flatMap(() => {
          // Write to L1 if configured
          if (writeToL1) {
            return l1.put(key, value, l1Ttl ?? ttl)
          }
          return Effect.void
        })
      ),

    has: (key: CacheKey): Effect.Effect<boolean, CacheError> =>
      l1.has(key).pipe(
        Effect.flatMap((l1Has) => {
          if (l1Has) return Effect.succeed(true)
          return l2.has(key)
        })
      ),

    forget: (key: CacheKey): Effect.Effect<boolean, CacheError> =>
      Effect.all([l1.forget(key), l2.forget(key)]).pipe(
        Effect.map(([l1Deleted, l2Deleted]: [boolean, boolean]) =>
          l1Deleted || l2Deleted
        )
      ),

    flush: (): Effect.Effect<void, CacheError> =>
      Effect.all([l1.flush(), l2.flush()]).pipe(
        Effect.map(() => undefined as void)
      ),

    increment: (key: CacheKey, value = 1): Effect.Effect<number, CacheError> =>
      // Increment in L2 (source of truth)
      l2.increment(key, value).pipe(
        Effect.tap((newValue) => {
          // Update L1 with the new value
          if (writeToL1) {
            return l1.put(key, newValue, l1Ttl)
          }
          return Effect.void
        })
      ),

    decrement: (key: CacheKey, value = 1): Effect.Effect<number, CacheError> =>
      // Decrement in L2 (source of truth)
      l2.decrement(key, value).pipe(
        Effect.tap((newValue) => {
          // Update L1 with the new value
          if (writeToL1) {
            return l1.put(key, newValue, l1Ttl)
          }
          return Effect.void
        })
      ),

    many: <A>(
      keys: readonly CacheKey[]
    ): Effect.Effect<Map<CacheKey, A | null>, CacheError> =>
      l1.many<A>(keys).pipe(
        Effect.flatMap((l1Results: Map<CacheKey, A | null>) => {
          // Find keys that weren't in L1
          const missingKeys = keys.filter((key) => l1Results.get(key) === null)

          if (missingKeys.length === 0) {
            return Effect.succeed(l1Results)
          }

          // Get missing from L2
          return l2.many<A>(missingKeys).pipe(
            Effect.flatMap((l2Results: Map<CacheKey, A | null>) => {
              // Merge results
              const result = new Map<CacheKey, A | null>(l1Results)
              const populateL1Effects: Effect.Effect<void, CacheError>[] = []

              for (const [key, value] of l2Results) {
                result.set(key, value)
                // Populate L1 on hit
                if (value !== null && populateL1OnHit) {
                  populateL1Effects.push(l1.put(key, value, l1Ttl))
                }
              }

              if (populateL1Effects.length > 0) {
                return Effect.all(populateL1Effects).pipe(
                  Effect.map(() => result)
                )
              }

              return Effect.succeed(result)
            })
          )
        })
      ),

    putMany: <A>(
      items: ReadonlyMap<CacheKey, A>,
      ttl?: Duration
    ): Effect.Effect<void, CacheError> =>
      // Write to L2 first
      l2.putMany(items, ttl).pipe(
        Effect.flatMap(() => {
          // Write to L1 if configured
          if (writeToL1) {
            return l1.putMany(items, l1Ttl ?? ttl)
          }
          return Effect.void
        })
      ),
  }

  return store
}

/**
 * Create a MultiStore layer from two existing stores
 */
export const MultiStoreLive = (
  config: MultiStoreConfig
): Layer.Layer<CacheStore> =>
  Layer.succeed(CacheStoreTag, makeMultiStore(config))

/**
 * Configuration for creating a multi-store with memory L1
 */
export interface MultiStoreWithMemoryConfig {
  /**
   * L2 cache store (persistent)
   */
  readonly l2: CacheStore

  /**
   * TTL for in-memory L1 cache
   */
  readonly l1Ttl?: Duration
}

/**
 * Convenience function to create multi-store with in-memory L1
 * Requires MemoryStore to be created separately
 */
export const makeMultiStoreWithMemory = (
  memoryStore: CacheStore,
  config: MultiStoreWithMemoryConfig
): CacheStore =>
  makeMultiStore({
    l1: memoryStore,
    l2: config.l2,
    l1Ttl: config.l1Ttl,
  })

/**
 * Read-through cache behavior
 * Only populates L1 on reads, doesn't write to L1 on puts
 */
export const makeReadThroughStore = (
  l1: CacheStore,
  l2: CacheStore,
  l1Ttl?: Duration
): CacheStore =>
  makeMultiStore({
    l1,
    l2,
    l1Ttl,
    writeToL1: false,
    populateL1OnHit: true,
  })

/**
 * Write-through cache behavior
 * Writes to both stores, no auto-population on reads
 */
export const makeWriteThroughStore = (
  l1: CacheStore,
  l2: CacheStore,
  l1Ttl?: Duration
): CacheStore =>
  makeMultiStore({
    l1,
    l2,
    l1Ttl,
    writeToL1: true,
    populateL1OnHit: false,
  })
