/**
 * @gello/storage-drivers - Storage disk adapters
 *
 * Provides adapters for various storage backends:
 * - LocalDisk: Local filesystem storage
 * - MemoryDisk: In-memory storage (for testing)
 * - NullDisk: No-op storage (for disabling storage)
 * - S3Disk: Amazon S3 / S3-compatible storage (R2, MinIO, etc.)
 * - AzureDisk: Azure Blob Storage
 * - GCSDisk: Google Cloud Storage
 *
 * @example
 * ```typescript
 * import { Effect, Layer } from "effect"
 * import { Storage, StorageLive } from "@gello/storage"
 * import {
 *   LocalDiskLive,
 *   MemoryDiskLive,
 *   S3DiskLive,
 *   AzureDiskLive,
 *   GCSDiskLive,
 * } from "@gello/storage-drivers"
 *
 * // Local filesystem storage
 * const LocalStorage = StorageLive.pipe(
 *   Layer.provide(LocalDiskLive({ root: "./storage" }))
 * )
 *
 * // In-memory storage (for tests)
 * const MemoryStorage = StorageLive.pipe(
 *   Layer.provide(MemoryDiskLive())
 * )
 *
 * // S3 storage
 * const S3Storage = StorageLive.pipe(
 *   Layer.provide(S3DiskLive({
 *     bucket: "my-bucket",
 *     region: "us-east-1",
 *   }))
 * )
 *
 * // Azure Blob storage
 * const AzureStorage = StorageLive.pipe(
 *   Layer.provide(AzureDiskLive({
 *     accountName: "myaccount",
 *     accountKey: "...",
 *     container: "my-container",
 *   }))
 * )
 *
 * // Google Cloud Storage
 * const GCSStorage = StorageLive.pipe(
 *   Layer.provide(GCSDiskLive({
 *     projectId: "my-project",
 *     bucket: "my-bucket",
 *   }))
 * )
 * ```
 *
 * @module @gello/storage-drivers
 */

// LocalDisk
export {
  type LocalDiskConfig,
  makeLocalDisk,
  LocalDiskLive,
  LocalDiskStreamableLive,
} from "./LocalDisk.js"

// MemoryDisk
export {
  type MemoryDiskConfig,
  makeMemoryDisk,
  MemoryDiskLive,
  MemoryDiskDefaultLive,
  MemoryDiskStreamableLive,
} from "./MemoryDisk.js"

// NullDisk
export {
  type NullDiskConfig,
  makeNullDisk,
  NullDiskLive,
  NullDiskDefaultLive,
  NullDiskStreamableLive,
} from "./NullDisk.js"

// S3Disk
export {
  type S3DiskConfig,
  makeS3Disk,
  S3DiskLive,
  S3DiskStreamableLive,
  S3DiskTemporaryUrlLive,
} from "./S3Disk.js"

// AzureDisk
export {
  type AzureDiskConfig,
  makeAzureDisk,
  AzureDiskLive,
  AzureDiskStreamableLive,
  AzureDiskTemporaryUrlLive,
} from "./AzureDisk.js"

// GCSDisk
export {
  type GCSDiskConfig,
  makeGCSDisk,
  GCSDiskLive,
  GCSDiskStreamableLive,
  GCSDiskTemporaryUrlLive,
} from "./GCSDisk.js"
