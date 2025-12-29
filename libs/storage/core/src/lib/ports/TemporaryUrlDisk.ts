/**
 * TemporaryUrlDisk - Port interface for signed/temporary URL generation
 *
 * @module @gello/storage/ports
 */

import { Effect, Context, Duration } from "effect"
import type { FilePath } from "../domain/FilePath.js"
import type { StorageError } from "../errors/StorageError.js"
import type { Disk, PutOptions } from "./Disk.js"

/**
 * Options for temporary URL generation
 */
export interface TemporaryUrlOptions {
  /**
   * Response content disposition (e.g., "attachment; filename=file.pdf")
   */
  readonly responseDisposition?: string

  /**
   * Response content type override
   */
  readonly responseContentType?: string
}

/**
 * Result of temporary upload URL generation
 */
export interface TemporaryUploadUrl {
  /**
   * The signed URL to upload to
   */
  readonly url: string

  /**
   * Headers that must be included in the upload request
   */
  readonly headers: Record<string, string>

  /**
   * HTTP method to use (usually PUT or POST)
   */
  readonly method: "PUT" | "POST"
}

/**
 * Extended disk interface with temporary URL support
 */
export interface TemporaryUrlDisk extends Disk {
  /**
   * Generate a temporary signed URL for downloading
   */
  readonly temporaryUrl: (
    path: FilePath,
    expiration: Duration.Duration,
    options?: TemporaryUrlOptions
  ) => Effect.Effect<string, StorageError>

  /**
   * Generate a temporary signed URL for uploading (direct client uploads)
   */
  readonly temporaryUploadUrl: (
    path: FilePath,
    expiration: Duration.Duration,
    options?: PutOptions
  ) => Effect.Effect<TemporaryUploadUrl, StorageError>
}

/**
 * Context tag for TemporaryUrlDisk
 */
export class TemporaryUrlDiskTag extends Context.Tag("@gello/storage/TemporaryUrlDisk")<
  TemporaryUrlDiskTag,
  TemporaryUrlDisk
>() {}

/**
 * Check if a disk supports temporary URLs
 */
export const supportsTemporaryUrls = (disk: Disk): disk is TemporaryUrlDisk =>
  "temporaryUrl" in disk && "temporaryUploadUrl" in disk
