/**
 * NullDisk - No-op storage adapter (for testing/disabling storage)
 *
 * @module @gello/storage-drivers
 */

import { Effect, Layer, Stream } from "effect"
import type { Disk, PutOptions, StreamableDisk } from "@gello/storage"
import {
  FilePath,
  unsafeFilePath,
  FileInfo,
  NULL,
  DiskTag,
  StreamableDiskTag,
  FileNotFoundError,
} from "@gello/storage"

/**
 * Configuration for NullDisk
 */
export interface NullDiskConfig {
  /**
   * Whether to simulate files existing (always returns true for exists())
   */
  readonly simulateExists?: boolean

  /**
   * Default visibility to return
   */
  readonly visibility?: "public" | "private"
}

/**
 * Create a NullDisk adapter
 *
 * All operations are no-ops:
 * - get/getString: Always fails with FileNotFoundError
 * - put/delete/copy/move: No-op, always succeeds
 * - exists: Returns simulateExists config (default false)
 * - size/lastModified: Always fails with FileNotFoundError
 */
export const makeNullDisk = (
  config: NullDiskConfig = {}
): Effect.Effect<Disk & StreamableDisk, never> =>
  Effect.succeed({
    get: (filePath) =>
      Effect.fail(new FileNotFoundError({ path: filePath, disk: NULL })),

    getString: (filePath) =>
      Effect.fail(new FileNotFoundError({ path: filePath, disk: NULL })),

    put: () => Effect.void,

    exists: () => Effect.succeed(config.simulateExists ?? false),

    missing: () => Effect.succeed(!(config.simulateExists ?? false)),

    delete: () => Effect.succeed(false),

    deleteMany: () => Effect.void,

    copy: () => Effect.void,

    move: () => Effect.void,

    size: (filePath) =>
      Effect.fail(new FileNotFoundError({ path: filePath, disk: NULL })),

    lastModified: (filePath) =>
      Effect.fail(new FileNotFoundError({ path: filePath, disk: NULL })),

    getMetadata: (filePath) =>
      Effect.fail(new FileNotFoundError({ path: filePath, disk: NULL })),

    url: (filePath) => Effect.succeed(`null://${filePath}`),

    getVisibility: () => Effect.succeed(config.visibility ?? "private"),

    setVisibility: () => Effect.void,

    prepend: () => Effect.void,

    append: () => Effect.void,

    files: () => Effect.succeed([]),

    allFiles: () => Effect.succeed([]),

    directories: () => Effect.succeed([]),

    allDirectories: () => Effect.succeed([]),

    makeDirectory: () => Effect.void,

    deleteDirectory: () => Effect.void,

    // StreamableDisk methods
    readStream: (filePath) =>
      Effect.fail(new FileNotFoundError({ path: filePath, disk: NULL })),

    writeStream: () => Effect.void,
  })

/**
 * Create a NullDisk layer
 */
export const NullDiskLive = (
  config: NullDiskConfig = {}
): Layer.Layer<DiskTag, never> =>
  Layer.effect(DiskTag, makeNullDisk(config))

/**
 * Create a default NullDisk layer (no config needed)
 */
export const NullDiskDefaultLive: Layer.Layer<DiskTag, never> =
  Layer.effect(DiskTag, makeNullDisk())

/**
 * Create a NullDisk layer with StreamableDisk tag
 */
export const NullDiskStreamableLive = (
  config: NullDiskConfig = {}
): Layer.Layer<StreamableDiskTag, never> =>
  Layer.effect(StreamableDiskTag, makeNullDisk(config))
