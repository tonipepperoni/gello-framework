/**
 * CacheManager - Multi-store cache management
 *
 * Manages multiple cache stores and provides a unified interface
 * for switching between them. Inspired by Laravel's Cache Manager.
 *
 * @module CacheManager
 */
import { Context, Effect, Layer, Ref } from "effect"
import type { CacheStore } from "./ports/CacheStore.js"
import type { CacheService } from "./Cache.js"
import { makeCacheService } from "./Cache.js"
import { CacheConfigError } from "./errors/CacheError.js"
import type { CacheError } from "./errors/CacheError.js"

/**
 * CacheManager interface
 *
 * Manages multiple named cache stores and provides access to them.
 */
export interface CacheManager {
  /**
   * Get the default cache service
   */
  readonly cache: () => CacheService

  /**
   * Get a cache service for a specific store
   *
   * @param name - Store name
   */
  readonly store: (name: string) => Effect.Effect<CacheService, CacheError>

  /**
   * Get the underlying store by name
   *
   * @param name - Store name
   */
  readonly driver: (name: string) => Effect.Effect<CacheStore, CacheError>

  /**
   * Register a new store
   *
   * @param name - Store name
   * @param store - Cache store instance
   */
  readonly extend: (
    name: string,
    store: CacheStore
  ) => Effect.Effect<void, never>

  /**
   * Get the default store name
   */
  readonly getDefaultDriver: () => string

  /**
   * Set the default store name
   *
   * @param name - Store name
   */
  readonly setDefaultDriver: (name: string) => Effect.Effect<void, CacheError>

  /**
   * Get all registered store names
   */
  readonly getStoreNames: () => Effect.Effect<readonly string[], never>

  /**
   * Check if a store exists
   *
   * @param name - Store name
   */
  readonly hasStore: (name: string) => Effect.Effect<boolean, never>
}

/**
 * CacheManager service tag
 */
export class CacheManagerTag extends Context.Tag("@gello/cache/CacheManager")<
  CacheManagerTag,
  CacheManager
>() {}

/**
 * Configuration for CacheManager
 */
export interface CacheManagerConfig {
  /**
   * Default store name
   */
  readonly default: string

  /**
   * Named stores
   */
  readonly stores: Record<string, CacheStore>
}

/**
 * Create a CacheManager instance
 */
export const makeCacheManager = (
  config: CacheManagerConfig
): Effect.Effect<CacheManager, CacheError> =>
  Effect.gen(function* () {
    // Initialize stores map
    const storesRef = yield* Ref.make<Map<string, CacheStore>>(
      new Map(Object.entries(config.stores))
    )

    // Default driver name
    const defaultDriverRef = yield* Ref.make<string>(config.default)

    // Cache service instances (lazy-created)
    const servicesRef = yield* Ref.make<Map<string, CacheService>>(new Map())

    const getStore = (name: string): Effect.Effect<CacheStore, CacheError> =>
      Effect.gen(function* () {
        const stores = yield* Ref.get(storesRef)
        const store = stores.get(name)

        if (!store) {
          return yield* Effect.fail(
            new CacheConfigError({
              setting: "store",
              reason: `Cache store "${name}" is not registered`,
            })
          )
        }

        return store
      })

    const getOrCreateService = (
      name: string
    ): Effect.Effect<CacheService, CacheError> =>
      Effect.gen(function* () {
        const services = yield* Ref.get(servicesRef)
        const existing = services.get(name)

        if (existing) {
          return existing
        }

        const store = yield* getStore(name)
        const service = makeCacheService(store)

        yield* Ref.update(servicesRef, (map) => {
          const newMap = new Map(map)
          newMap.set(name, service)
          return newMap
        })

        return service
      })

    const manager: CacheManager = {
      cache: () => {
        // Synchronous access to default cache - throws if not available
        const defaultName = Effect.runSync(Ref.get(defaultDriverRef))
        const stores = Effect.runSync(Ref.get(storesRef))
        const store = stores.get(defaultName)

        if (!store) {
          throw new Error(`Default cache store "${defaultName}" not found`)
        }

        // Get or create service
        const services = Effect.runSync(Ref.get(servicesRef))
        const existing = services.get(defaultName)

        if (existing) {
          return existing
        }

        const service = makeCacheService(store)
        Effect.runSync(
          Ref.update(servicesRef, (map) => {
            const newMap = new Map(map)
            newMap.set(defaultName, service)
            return newMap
          })
        )

        return service
      },

      store: (name: string) => getOrCreateService(name),

      driver: (name: string) => getStore(name),

      extend: (name: string, store: CacheStore) =>
        Ref.update(storesRef, (map) => {
          const newMap = new Map(map)
          newMap.set(name, store)
          return newMap
        }),

      getDefaultDriver: () => Effect.runSync(Ref.get(defaultDriverRef)),

      setDefaultDriver: (name: string) =>
        Effect.gen(function* () {
          // Verify store exists
          yield* getStore(name)
          yield* Ref.set(defaultDriverRef, name)
        }),

      getStoreNames: () =>
        Ref.get(storesRef).pipe(Effect.map((m) => Array.from(m.keys()))),

      hasStore: (name: string) =>
        Ref.get(storesRef).pipe(Effect.map((m) => m.has(name))),
    }

    return manager
  })

/**
 * Create a CacheManager layer
 */
export const CacheManagerLive = (
  config: CacheManagerConfig
): Layer.Layer<CacheManagerTag, CacheError> =>
  Layer.effect(CacheManagerTag, makeCacheManager(config))

/**
 * Convenience function to access a specific store through the manager
 */
export const useStore = (
  name: string
): Effect.Effect<CacheService, CacheError, CacheManagerTag> =>
  Effect.gen(function* () {
    const manager = yield* CacheManagerTag
    return yield* manager.store(name)
  })

/**
 * Convenience function to access the default cache
 */
export const useCache = (): Effect.Effect<CacheService, never, CacheManagerTag> =>
  Effect.gen(function* () {
    const manager = yield* CacheManagerTag
    return manager.cache()
  })

/**
 * Builder pattern for creating CacheManager config
 */
export class CacheManagerBuilder {
  private stores: Record<string, CacheStore> = {}
  private defaultStore: string = "memory"

  /**
   * Add a store
   */
  addStore(name: string, store: CacheStore): this {
    this.stores[name] = store
    return this
  }

  /**
   * Set the default store
   */
  setDefault(name: string): this {
    this.defaultStore = name
    return this
  }

  /**
   * Build the configuration
   */
  build(): CacheManagerConfig {
    return {
      default: this.defaultStore,
      stores: this.stores,
    }
  }

  /**
   * Build and create a CacheManager layer
   */
  toLayer(): Layer.Layer<CacheManagerTag, CacheError> {
    return CacheManagerLive(this.build())
  }
}

/**
 * Create a new CacheManager builder
 */
export const cacheManagerBuilder = (): CacheManagerBuilder =>
  new CacheManagerBuilder()
