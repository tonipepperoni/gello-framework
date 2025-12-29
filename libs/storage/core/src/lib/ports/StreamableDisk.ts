/**
 * StreamableDisk - Port interface for streaming operations
 *
 * @module @gello/storage/ports
 */

import { Effect, Context, Stream } from "effect"
import type { FilePath } from "../domain/FilePath.js"
import type { StorageError } from "../errors/StorageError.js"
import type { Disk, PutOptions } from "./Disk.js"

/**
 * Extended disk interface with streaming support
 */
export interface StreamableDisk extends Disk {
  /**
   * Get file as a stream of chunks
   */
  readonly readStream: (
    path: FilePath
  ) => Effect.Effect<Stream.Stream<Uint8Array, StorageError>, StorageError>

  /**
   * Write a stream to a file
   */
  readonly writeStream: (
    path: FilePath,
    stream: Stream.Stream<Uint8Array, never>,
    options?: PutOptions
  ) => Effect.Effect<void, StorageError>
}

/**
 * Context tag for StreamableDisk
 */
export class StreamableDiskTag extends Context.Tag("@gello/storage/StreamableDisk")<
  StreamableDiskTag,
  StreamableDisk
>() {}

/**
 * Check if a disk supports streaming
 */
export const isStreamable = (disk: Disk): disk is StreamableDisk =>
  "readStream" in disk && "writeStream" in disk
