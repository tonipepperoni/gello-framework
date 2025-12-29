/**
 * Disk - Core port interface for storage operations
 *
 * @module @gello/storage/ports
 */

import { Effect, Context, Stream } from "effect"
import type { FilePath } from "../domain/FilePath.js"
import type { FileInfo } from "../domain/FileInfo.js"
import type { Visibility } from "../domain/Visibility.js"
import type { StorageError } from "../errors/StorageError.js"

/**
 * Options for put operations
 */
export interface PutOptions {
  /**
   * File visibility (public or private)
   */
  readonly visibility?: Visibility

  /**
   * MIME type override
   */
  readonly mimeType?: string

  /**
   * Custom metadata
   */
  readonly metadata?: Record<string, string>

  /**
   * Expected checksum for validation
   */
  readonly checksum?: string
}

/**
 * Core disk interface - the primary port for storage operations
 */
export interface Disk {
  /**
   * Get file contents as bytes
   */
  readonly get: (path: FilePath) => Effect.Effect<Uint8Array, StorageError>

  /**
   * Get file contents as string
   */
  readonly getString: (
    path: FilePath,
    encoding?: BufferEncoding
  ) => Effect.Effect<string, StorageError>

  /**
   * Store file contents
   */
  readonly put: (
    path: FilePath,
    contents: Uint8Array | string,
    options?: PutOptions
  ) => Effect.Effect<void, StorageError>

  /**
   * Check if file exists
   */
  readonly exists: (path: FilePath) => Effect.Effect<boolean, StorageError>

  /**
   * Check if path is missing
   */
  readonly missing: (path: FilePath) => Effect.Effect<boolean, StorageError>

  /**
   * Delete a file
   */
  readonly delete: (path: FilePath) => Effect.Effect<boolean, StorageError>

  /**
   * Delete multiple files
   */
  readonly deleteMany: (
    paths: ReadonlyArray<FilePath>
  ) => Effect.Effect<void, StorageError>

  /**
   * Copy a file
   */
  readonly copy: (
    from: FilePath,
    to: FilePath
  ) => Effect.Effect<void, StorageError>

  /**
   * Move a file
   */
  readonly move: (
    from: FilePath,
    to: FilePath
  ) => Effect.Effect<void, StorageError>

  /**
   * Get file size in bytes
   */
  readonly size: (path: FilePath) => Effect.Effect<number, StorageError>

  /**
   * Get last modified timestamp
   */
  readonly lastModified: (path: FilePath) => Effect.Effect<Date, StorageError>

  /**
   * Get file metadata
   */
  readonly getMetadata: (path: FilePath) => Effect.Effect<FileInfo, StorageError>

  /**
   * Get public URL for file
   */
  readonly url: (path: FilePath) => Effect.Effect<string, StorageError>

  /**
   * Get visibility
   */
  readonly getVisibility: (
    path: FilePath
  ) => Effect.Effect<Visibility, StorageError>

  /**
   * Set visibility
   */
  readonly setVisibility: (
    path: FilePath,
    visibility: Visibility
  ) => Effect.Effect<void, StorageError>

  /**
   * Prepend data to a file
   */
  readonly prepend: (
    path: FilePath,
    data: Uint8Array | string
  ) => Effect.Effect<void, StorageError>

  /**
   * Append data to a file
   */
  readonly append: (
    path: FilePath,
    data: Uint8Array | string
  ) => Effect.Effect<void, StorageError>

  /**
   * List files in directory (non-recursive)
   */
  readonly files: (
    directory?: FilePath
  ) => Effect.Effect<ReadonlyArray<FilePath>, StorageError>

  /**
   * List all files recursively
   */
  readonly allFiles: (
    directory?: FilePath
  ) => Effect.Effect<ReadonlyArray<FilePath>, StorageError>

  /**
   * List directories (non-recursive)
   */
  readonly directories: (
    directory?: FilePath
  ) => Effect.Effect<ReadonlyArray<FilePath>, StorageError>

  /**
   * List all directories recursively
   */
  readonly allDirectories: (
    directory?: FilePath
  ) => Effect.Effect<ReadonlyArray<FilePath>, StorageError>

  /**
   * Create a directory
   */
  readonly makeDirectory: (
    path: FilePath
  ) => Effect.Effect<void, StorageError>

  /**
   * Delete a directory (and all contents)
   */
  readonly deleteDirectory: (
    path: FilePath
  ) => Effect.Effect<void, StorageError>
}

/**
 * Context tag for Disk
 */
export class DiskTag extends Context.Tag("@gello/storage/Disk")<
  DiskTag,
  Disk
>() {}
