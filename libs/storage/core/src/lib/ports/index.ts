/**
 * Port interfaces exports for @gello/storage
 *
 * @module @gello/storage/ports
 */

// Disk
export { DiskTag } from "./Disk.js"
export type { Disk, PutOptions } from "./Disk.js"

// StreamableDisk
export { StreamableDiskTag, isStreamable } from "./StreamableDisk.js"
export type { StreamableDisk } from "./StreamableDisk.js"

// TemporaryUrlDisk
export { TemporaryUrlDiskTag, supportsTemporaryUrls } from "./TemporaryUrlDisk.js"
export type {
  TemporaryUrlDisk,
  TemporaryUrlOptions,
  TemporaryUploadUrl,
} from "./TemporaryUrlDisk.js"
