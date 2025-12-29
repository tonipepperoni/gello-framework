/**
 * StorageConfig - Configuration integration for Storage
 *
 * Provides config-driven storage layer creation using @gello/core-config
 *
 * @example
 * ```typescript
 * import { Effect } from "effect"
 * import { Config } from "@gello/core-config"
 * import { Storage, StorageFromConfig } from "@gello/storage"
 *
 * // .env file:
 * // FILESYSTEM_DISK=s3
 * // AWS_BUCKET=my-bucket
 * // AWS_REGION=us-east-1
 *
 * const program = Effect.gen(function* () {
 *   const storage = yield* Storage
 *   yield* storage.put("file.txt", "Hello!")
 * })
 *
 * // StorageFromConfig reads FILESYSTEM_DISK and creates appropriate layer
 * program.pipe(
 *   Effect.provide(StorageFromConfig),
 *   Effect.provide(ConfigLive)
 * )
 * ```
 *
 * @module @gello/storage
 */

import { Effect, Layer, Schema } from "effect"
import type { Disk } from "./ports/Disk.js"
import { Storage, makeStorageService } from "./Storage.js"
import {
  StorageManagerTag,
  makeStorageManager,
  type StorageManagerConfig,
} from "./StorageManager.js"

// ─── Config Schema Types ────────────────────────────────────────────

/**
 * Supported storage disk drivers
 */
export const StorageDriver = Schema.Literal(
  "local",
  "s3",
  "azure",
  "gcs",
  "memory",
  "null"
)
export type StorageDriver = Schema.Schema.Type<typeof StorageDriver>

/**
 * Visibility setting
 */
export const VisibilityConfig = Schema.Literal("public", "private")
export type VisibilityConfig = Schema.Schema.Type<typeof VisibilityConfig>

/**
 * Local disk configuration schema
 */
export const LocalDiskConfigSchema = Schema.Struct({
  driver: Schema.Literal("local"),
  root: Schema.String,
  publicUrl: Schema.optional(Schema.String),
  visibility: Schema.optional(VisibilityConfig),
})
export type LocalDiskConfigSchema = Schema.Schema.Type<typeof LocalDiskConfigSchema>

/**
 * S3 disk configuration schema
 */
export const S3DiskConfigSchema = Schema.Struct({
  driver: Schema.Literal("s3"),
  bucket: Schema.String,
  region: Schema.String,
  accessKeyId: Schema.optional(Schema.String),
  secretAccessKey: Schema.optional(Schema.String),
  endpoint: Schema.optional(Schema.String),
  forcePathStyle: Schema.optional(Schema.Boolean),
  publicUrl: Schema.optional(Schema.String),
  visibility: Schema.optional(VisibilityConfig),
  prefix: Schema.optional(Schema.String),
})
export type S3DiskConfigSchema = Schema.Schema.Type<typeof S3DiskConfigSchema>

/**
 * Azure disk configuration schema
 */
export const AzureDiskConfigSchema = Schema.Struct({
  driver: Schema.Literal("azure"),
  accountName: Schema.String,
  accountKey: Schema.String,
  container: Schema.String,
  endpoint: Schema.optional(Schema.String),
  publicUrl: Schema.optional(Schema.String),
  visibility: Schema.optional(VisibilityConfig),
  prefix: Schema.optional(Schema.String),
})
export type AzureDiskConfigSchema = Schema.Schema.Type<typeof AzureDiskConfigSchema>

/**
 * GCS disk configuration schema
 */
export const GCSDiskConfigSchema = Schema.Struct({
  driver: Schema.Literal("gcs"),
  projectId: Schema.String,
  bucket: Schema.String,
  keyFilename: Schema.optional(Schema.String),
  publicUrl: Schema.optional(Schema.String),
  visibility: Schema.optional(VisibilityConfig),
  prefix: Schema.optional(Schema.String),
})
export type GCSDiskConfigSchema = Schema.Schema.Type<typeof GCSDiskConfigSchema>

/**
 * Memory disk configuration schema
 */
export const MemoryDiskConfigSchema = Schema.Struct({
  driver: Schema.Literal("memory"),
  publicUrl: Schema.optional(Schema.String),
  visibility: Schema.optional(VisibilityConfig),
})
export type MemoryDiskConfigSchema = Schema.Schema.Type<typeof MemoryDiskConfigSchema>

/**
 * Null disk configuration schema
 */
export const NullDiskConfigSchema = Schema.Struct({
  driver: Schema.Literal("null"),
  simulateExists: Schema.optional(Schema.Boolean),
  visibility: Schema.optional(VisibilityConfig),
})
export type NullDiskConfigSchema = Schema.Schema.Type<typeof NullDiskConfigSchema>

/**
 * Union of all disk configuration schemas
 */
export const DiskConfigSchema = Schema.Union(
  LocalDiskConfigSchema,
  S3DiskConfigSchema,
  AzureDiskConfigSchema,
  GCSDiskConfigSchema,
  MemoryDiskConfigSchema,
  NullDiskConfigSchema
)
export type DiskConfigSchema = Schema.Schema.Type<typeof DiskConfigSchema>

/**
 * Full storage configuration schema
 */
export const StorageConfigSchema = Schema.Struct({
  default: StorageDriver,
  disks: Schema.Record({ key: Schema.String, value: DiskConfigSchema }),
})
export type StorageConfigSchema = Schema.Schema.Type<typeof StorageConfigSchema>

// ─── Environment Variable Mapping ───────────────────────────────────

/**
 * Default environment variable mapping for storage config
 *
 * Maps environment variables to config keys using dot notation.
 * Use with `Config.fromEnv(STORAGE_ENV_MAPPING)`
 */
export const STORAGE_ENV_MAPPING: Record<string, string> = {
  // Default disk
  "filesystem.default": "FILESYSTEM_DISK",

  // Local disk
  "filesystem.disks.local.driver": "FILESYSTEM_LOCAL_DRIVER",
  "filesystem.disks.local.root": "FILESYSTEM_LOCAL_ROOT",
  "filesystem.disks.local.publicUrl": "FILESYSTEM_LOCAL_PUBLIC_URL",
  "filesystem.disks.local.visibility": "FILESYSTEM_LOCAL_VISIBILITY",

  // S3 disk
  "filesystem.disks.s3.driver": "FILESYSTEM_S3_DRIVER",
  "filesystem.disks.s3.bucket": "AWS_BUCKET",
  "filesystem.disks.s3.region": "AWS_DEFAULT_REGION",
  "filesystem.disks.s3.accessKeyId": "AWS_ACCESS_KEY_ID",
  "filesystem.disks.s3.secretAccessKey": "AWS_SECRET_ACCESS_KEY",
  "filesystem.disks.s3.endpoint": "AWS_ENDPOINT",
  "filesystem.disks.s3.forcePathStyle": "AWS_USE_PATH_STYLE_ENDPOINT",
  "filesystem.disks.s3.publicUrl": "AWS_PUBLIC_URL",
  "filesystem.disks.s3.prefix": "AWS_PREFIX",

  // Azure disk
  "filesystem.disks.azure.driver": "FILESYSTEM_AZURE_DRIVER",
  "filesystem.disks.azure.accountName": "AZURE_STORAGE_ACCOUNT",
  "filesystem.disks.azure.accountKey": "AZURE_STORAGE_KEY",
  "filesystem.disks.azure.container": "AZURE_STORAGE_CONTAINER",
  "filesystem.disks.azure.endpoint": "AZURE_STORAGE_ENDPOINT",
  "filesystem.disks.azure.publicUrl": "AZURE_PUBLIC_URL",
  "filesystem.disks.azure.prefix": "AZURE_PREFIX",

  // GCS disk
  "filesystem.disks.gcs.driver": "FILESYSTEM_GCS_DRIVER",
  "filesystem.disks.gcs.projectId": "GCS_PROJECT_ID",
  "filesystem.disks.gcs.bucket": "GCS_BUCKET",
  "filesystem.disks.gcs.keyFilename": "GCS_KEY_FILE",
  "filesystem.disks.gcs.publicUrl": "GCS_PUBLIC_URL",
  "filesystem.disks.gcs.prefix": "GCS_PREFIX",
}

// ─── Config Reader Interface ────────────────────────────────────────

/**
 * Interface for reading config values (compatible with @gello/core-config)
 */
export interface ConfigReader {
  readonly string: (
    key: string,
    defaultValue?: string
  ) => Effect.Effect<string, unknown>
  readonly boolean: (
    key: string,
    defaultValue?: boolean
  ) => Effect.Effect<boolean, unknown>
}

// ─── Disk Factory Functions ─────────────────────────────────────────

/**
 * Factory function type for creating disks
 */
export type DiskFactory = (config: DiskConfigSchema) => Effect.Effect<Disk, unknown>

/**
 * Registry of disk factories
 * Users can register custom factories for custom drivers
 */
const diskFactories = new Map<string, DiskFactory>()

/**
 * Register a disk factory for a driver
 *
 * @example
 * ```typescript
 * import { registerDiskFactory } from "@gello/storage"
 * import { makeLocalDisk } from "@gello/storage-drivers"
 *
 * registerDiskFactory("local", (config) =>
 *   makeLocalDisk({ root: config.root })
 * )
 * ```
 */
export const registerDiskFactory = (driver: string, factory: DiskFactory): void => {
  diskFactories.set(driver, factory)
}

/**
 * Get a disk factory by driver name
 */
export const getDiskFactory = (driver: string): DiskFactory | undefined =>
  diskFactories.get(driver)

// ─── Storage Layer Factory ──────────────────────────────────────────

/**
 * Configuration for storage layer creation
 */
export interface StorageLayerConfig {
  /**
   * Default disk name
   */
  readonly defaultDisk: StorageDriver

  /**
   * Disk configurations by name
   */
  readonly disks: Record<string, DiskConfigSchema>

  /**
   * Custom disk factories (optional)
   */
  readonly factories?: Record<string, DiskFactory>
}

/**
 * Create a storage layer from configuration
 *
 * This function creates disk instances from config and returns a Storage layer.
 * Requires disk factories to be registered for each driver type.
 *
 * @example
 * ```typescript
 * import { makeStorageLayerFromConfig, registerDiskFactory } from "@gello/storage"
 * import { makeLocalDisk, makeS3Disk } from "@gello/storage-drivers"
 *
 * // Register factories
 * registerDiskFactory("local", (c) => makeLocalDisk({ root: c.root }))
 * registerDiskFactory("s3", (c) => makeS3Disk({ bucket: c.bucket, region: c.region }))
 *
 * // Create layer from config
 * const StorageLive = makeStorageLayerFromConfig({
 *   defaultDisk: "local",
 *   disks: {
 *     local: { driver: "local", root: "./storage" },
 *     s3: { driver: "s3", bucket: "my-bucket", region: "us-east-1" },
 *   },
 * })
 * ```
 */
export const makeStorageLayerFromConfig = (
  config: StorageLayerConfig
): Effect.Effect<Layer.Layer<Storage>, unknown> =>
  Effect.gen(function* () {
    const diskInstances: Record<string, Disk> = {}

    for (const [name, diskConfig] of Object.entries(config.disks)) {
      const factory =
        config.factories?.[diskConfig.driver] ??
        getDiskFactory(diskConfig.driver)

      if (!factory) {
        return yield* Effect.fail(
          new Error(
            `No disk factory registered for driver "${diskConfig.driver}". ` +
              `Register one using registerDiskFactory("${diskConfig.driver}", factory)`
          )
        )
      }

      const disk = yield* factory(diskConfig)
      diskInstances[name] = disk
    }

    const manager = yield* makeStorageManager({
      default: config.defaultDisk,
      disks: diskInstances,
    })

    return Layer.succeed(Storage, manager.storage())
  })

/**
 * Create a StorageManager layer from configuration
 */
export const makeStorageManagerLayerFromConfig = (
  config: StorageLayerConfig
): Effect.Effect<Layer.Layer<StorageManagerTag>, unknown> =>
  Effect.gen(function* () {
    const diskInstances: Record<string, Disk> = {}

    for (const [name, diskConfig] of Object.entries(config.disks)) {
      const factory =
        config.factories?.[diskConfig.driver] ??
        getDiskFactory(diskConfig.driver)

      if (!factory) {
        return yield* Effect.fail(
          new Error(
            `No disk factory registered for driver "${diskConfig.driver}". ` +
              `Register one using registerDiskFactory("${diskConfig.driver}", factory)`
          )
        )
      }

      const disk = yield* factory(diskConfig)
      diskInstances[name] = disk
    }

    const manager = yield* makeStorageManager({
      default: config.defaultDisk,
      disks: diskInstances,
    })

    return Layer.succeed(StorageManagerTag, manager)
  })

// ─── Preset Configurations ──────────────────────────────────────────

/**
 * Create a minimal local-only storage config
 */
export const localStorageConfig = (root: string): StorageLayerConfig => ({
  defaultDisk: "local",
  disks: {
    local: { driver: "local", root },
  },
})

/**
 * Create a memory-only storage config (for testing)
 */
export const memoryStorageConfig = (): StorageLayerConfig => ({
  defaultDisk: "memory",
  disks: {
    memory: { driver: "memory" },
  },
})

/**
 * Create a null storage config (for disabling storage)
 */
export const nullStorageConfig = (): StorageLayerConfig => ({
  defaultDisk: "null",
  disks: {
    null: { driver: "null" },
  },
})

// ─── Environment Reader Helper ──────────────────────────────────────

/**
 * Read storage configuration from environment variables
 *
 * This is a helper to construct StorageLayerConfig from env vars.
 * Uses standard Laravel-style env var names.
 *
 * @example
 * ```typescript
 * // .env:
 * // FILESYSTEM_DISK=s3
 * // AWS_BUCKET=my-bucket
 * // AWS_DEFAULT_REGION=us-east-1
 * // AWS_ACCESS_KEY_ID=...
 * // AWS_SECRET_ACCESS_KEY=...
 *
 * const config = readStorageConfigFromEnv()
 * const StorageLive = yield* makeStorageLayerFromConfig(config)
 * ```
 */
export const readStorageConfigFromEnv = (): StorageLayerConfig => {
  const env = process.env
  const defaultDisk = (env.FILESYSTEM_DISK ?? "local") as StorageDriver

  const disks: Record<string, DiskConfigSchema> = {}

  // Local disk (always available as fallback)
  if (env.FILESYSTEM_LOCAL_ROOT || defaultDisk === "local") {
    disks.local = {
      driver: "local",
      root: env.FILESYSTEM_LOCAL_ROOT ?? "./storage",
      publicUrl: env.FILESYSTEM_LOCAL_PUBLIC_URL,
      visibility: env.FILESYSTEM_LOCAL_VISIBILITY as "public" | "private" | undefined,
    }
  }

  // S3 disk
  if (env.AWS_BUCKET || defaultDisk === "s3") {
    disks.s3 = {
      driver: "s3",
      bucket: env.AWS_BUCKET ?? "",
      region: env.AWS_DEFAULT_REGION ?? "us-east-1",
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      endpoint: env.AWS_ENDPOINT,
      forcePathStyle: env.AWS_USE_PATH_STYLE_ENDPOINT === "true",
      publicUrl: env.AWS_PUBLIC_URL,
      prefix: env.AWS_PREFIX,
    }
  }

  // Azure disk
  if (env.AZURE_STORAGE_ACCOUNT || defaultDisk === "azure") {
    disks.azure = {
      driver: "azure",
      accountName: env.AZURE_STORAGE_ACCOUNT ?? "",
      accountKey: env.AZURE_STORAGE_KEY ?? "",
      container: env.AZURE_STORAGE_CONTAINER ?? "",
      endpoint: env.AZURE_STORAGE_ENDPOINT,
      publicUrl: env.AZURE_PUBLIC_URL,
      prefix: env.AZURE_PREFIX,
    }
  }

  // GCS disk
  if (env.GCS_PROJECT_ID || defaultDisk === "gcs") {
    disks.gcs = {
      driver: "gcs",
      projectId: env.GCS_PROJECT_ID ?? "",
      bucket: env.GCS_BUCKET ?? "",
      keyFilename: env.GCS_KEY_FILE,
      publicUrl: env.GCS_PUBLIC_URL,
      prefix: env.GCS_PREFIX,
    }
  }

  // Memory disk (for testing)
  if (defaultDisk === "memory") {
    disks.memory = {
      driver: "memory",
    }
  }

  // Null disk (for disabling)
  if (defaultDisk === "null") {
    disks.null = {
      driver: "null",
    }
  }

  return { defaultDisk, disks }
}
