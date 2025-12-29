/**
 * StorageManager - Multi-disk storage management
 *
 * @module @gello/storage
 */

import { Effect, Context, Layer, Ref, HashMap } from "effect"
import type { DiskName } from "./domain/DiskName.js"
import { LOCAL, unsafeDiskName } from "./domain/DiskName.js"
import { DiskNotFoundError } from "./errors/StorageError.js"
import type { StorageError } from "./errors/StorageError.js"
import type { Disk } from "./ports/Disk.js"
import { makeStorageService, type StorageService } from "./Storage.js"

/**
 * StorageManager interface for managing multiple disks
 */
export interface StorageManager {
  /**
   * Get the default storage service
   */
  readonly storage: () => StorageService

  /**
   * Get a storage service for a specific disk
   */
  readonly disk: (name: string) => Effect.Effect<StorageService, StorageError>

  /**
   * Get the underlying disk by name
   */
  readonly getDisk: (name: string) => Effect.Effect<Disk, StorageError>

  /**
   * Register a new disk
   */
  readonly extend: (name: string, disk: Disk) => Effect.Effect<void, never>

  /**
   * Get the default disk name
   */
  readonly getDefaultDisk: () => DiskName

  /**
   * Set the default disk
   */
  readonly setDefaultDisk: (name: string) => Effect.Effect<void, StorageError>

  /**
   * Get all registered disk names
   */
  readonly getDisks: () => Effect.Effect<ReadonlyArray<DiskName>, never>

  /**
   * Check if a disk is registered
   */
  readonly hasDisk: (name: string) => Effect.Effect<boolean, never>
}

/**
 * Configuration for StorageManager
 */
export interface StorageManagerConfig {
  /**
   * Default disk name
   */
  readonly default: string

  /**
   * Map of disk name to disk implementation
   */
  readonly disks: Record<string, Disk>
}

/**
 * Create a StorageManager
 */
export const makeStorageManager = (
  config: StorageManagerConfig
): Effect.Effect<StorageManager, never> =>
  Effect.gen(function* () {
    // Initialize disks map
    const initialDisks = new Map<string, Disk>()
    for (const [name, disk] of Object.entries(config.disks)) {
      initialDisks.set(name, disk)
    }

    const disksRef = yield* Ref.make(initialDisks)
    const defaultDiskRef = yield* Ref.make<DiskName>(unsafeDiskName(config.default))

    // Cache for storage services
    const servicesCache = new Map<string, StorageService>()

    const getOrCreateService = (disk: Disk, name: string): StorageService => {
      let service = servicesCache.get(name)
      if (!service) {
        service = makeStorageService(disk)
        servicesCache.set(name, service)
      }
      return service
    }

    return {
      storage: () => {
        const defaultName = Effect.runSync(Ref.get(defaultDiskRef))
        const disks = Effect.runSync(Ref.get(disksRef))
        const disk = disks.get(defaultName)
        if (!disk) {
          throw new Error(`Default disk "${defaultName}" not found`)
        }
        return getOrCreateService(disk, defaultName)
      },

      disk: (name) =>
        Effect.gen(function* () {
          const disks = yield* Ref.get(disksRef)
          const disk = disks.get(name)
          if (!disk) {
            return yield* Effect.fail(new DiskNotFoundError({ disk: name }))
          }
          return getOrCreateService(disk, name)
        }),

      getDisk: (name) =>
        Effect.gen(function* () {
          const disks = yield* Ref.get(disksRef)
          const disk = disks.get(name)
          if (!disk) {
            return yield* Effect.fail(new DiskNotFoundError({ disk: name }))
          }
          return disk
        }),

      extend: (name, disk) =>
        Effect.gen(function* () {
          yield* Ref.update(disksRef, (disks) => {
            const newDisks = new Map(disks)
            newDisks.set(name, disk)
            return newDisks
          })
          // Clear cache for this disk
          servicesCache.delete(name)
        }),

      getDefaultDisk: () => Effect.runSync(Ref.get(defaultDiskRef)),

      setDefaultDisk: (name) =>
        Effect.gen(function* () {
          const disks = yield* Ref.get(disksRef)
          if (!disks.has(name)) {
            return yield* Effect.fail(new DiskNotFoundError({ disk: name }))
          }
          yield* Ref.set(defaultDiskRef, unsafeDiskName(name))
        }),

      getDisks: () =>
        Effect.gen(function* () {
          const disks = yield* Ref.get(disksRef)
          return Array.from(disks.keys()).map(unsafeDiskName)
        }),

      hasDisk: (name) =>
        Effect.gen(function* () {
          const disks = yield* Ref.get(disksRef)
          return disks.has(name)
        }),
    }
  })

/**
 * Context tag for StorageManager
 */
export class StorageManagerTag extends Context.Tag("@gello/storage/StorageManager")<
  StorageManagerTag,
  StorageManager
>() {}

/**
 * Create a StorageManager layer
 */
export const StorageManagerLive = (
  config: StorageManagerConfig
): Layer.Layer<StorageManagerTag> =>
  Layer.effect(StorageManagerTag, makeStorageManager(config))

/**
 * Builder for StorageManager configuration
 */
export class StorageManagerBuilder {
  private _default: string = "local"
  private _disks: Record<string, Disk> = {}

  /**
   * Set the default disk
   */
  default(name: string): this {
    this._default = name
    return this
  }

  /**
   * Add a disk
   */
  disk(name: string, disk: Disk): this {
    this._disks[name] = disk
    return this
  }

  /**
   * Add multiple disks
   */
  disks(disks: Record<string, Disk>): this {
    this._disks = { ...this._disks, ...disks }
    return this
  }

  /**
   * Build the configuration
   */
  build(): StorageManagerConfig {
    return {
      default: this._default,
      disks: this._disks,
    }
  }

  /**
   * Build and create the StorageManager
   */
  make(): Effect.Effect<StorageManager, never> {
    return makeStorageManager(this.build())
  }

  /**
   * Build and create a layer
   */
  toLayer(): Layer.Layer<StorageManagerTag> {
    return StorageManagerLive(this.build())
  }
}

/**
 * Create a StorageManager builder
 */
export const storageManagerBuilder = (): StorageManagerBuilder =>
  new StorageManagerBuilder()

/**
 * Helper to get storage from StorageManager
 */
export const useStorage = Effect.gen(function* () {
  const manager = yield* StorageManagerTag
  return manager.storage()
})

/**
 * Helper to get a specific disk from StorageManager
 */
export const useDisk = (name: string) =>
  Effect.gen(function* () {
    const manager = yield* StorageManagerTag
    return yield* manager.disk(name)
  })
