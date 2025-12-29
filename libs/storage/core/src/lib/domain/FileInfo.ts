/**
 * FileInfo - File metadata value object
 *
 * @module @gello/storage/domain
 */

import type { FilePath } from "./FilePath.js"
import type { Visibility } from "./Visibility.js"

/**
 * File metadata information
 */
export interface FileInfo {
  /**
   * File path
   */
  readonly path: FilePath

  /**
   * File size in bytes
   */
  readonly size: number

  /**
   * MIME type (if detected)
   */
  readonly mimeType: string | null

  /**
   * Last modified timestamp
   */
  readonly lastModified: Date

  /**
   * File visibility
   */
  readonly visibility: Visibility

  /**
   * Whether this is a directory
   */
  readonly isDirectory: boolean

  /**
   * Optional checksum (e.g., MD5, SHA256)
   */
  readonly checksum?: string

  /**
   * Optional custom metadata
   */
  readonly metadata?: Record<string, string>
}

/**
 * FileInfo utilities
 */
export const FileInfo = {
  /**
   * Create a FileInfo object
   */
  make: (
    props: Omit<FileInfo, "isDirectory"> & { isDirectory?: boolean }
  ): FileInfo => ({
    ...props,
    isDirectory: props.isDirectory ?? false,
  }),

  /**
   * Create a FileInfo for a file
   */
  file: (props: Omit<FileInfo, "isDirectory">): FileInfo => ({
    ...props,
    isDirectory: false,
  }),

  /**
   * Create a FileInfo for a directory
   */
  directory: (props: Omit<FileInfo, "isDirectory" | "size" | "mimeType"> & { size?: number; mimeType?: string | null }): FileInfo => ({
    ...props,
    size: props.size ?? 0,
    mimeType: props.mimeType ?? null,
    isDirectory: true,
  }),

  /**
   * Check if this is a file
   */
  isFile: (info: FileInfo): boolean => !info.isDirectory,

  /**
   * Check if this is a directory
   */
  isDir: (info: FileInfo): boolean => info.isDirectory,

  /**
   * Get human-readable file size
   */
  humanSize: (info: FileInfo): string => {
    const bytes = info.size
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  },
}
