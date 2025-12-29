/**
 * StorageError - Domain errors for storage operations
 *
 * @module @gello/storage/errors
 */

import { Data } from "effect"
import type { FilePath } from "../domain/FilePath.js"
import type { DiskName } from "../domain/DiskName.js"

/**
 * File not found error
 */
export class FileNotFoundError extends Data.TaggedError("FileNotFoundError")<{
  readonly path: FilePath
  readonly disk: DiskName
}> {
  get message(): string {
    return `File not found: ${this.path} on disk ${this.disk}`
  }
}

/**
 * File already exists error
 */
export class FileExistsError extends Data.TaggedError("FileExistsError")<{
  readonly path: FilePath
  readonly disk: DiskName
}> {
  get message(): string {
    return `File already exists: ${this.path} on disk ${this.disk}`
  }
}

/**
 * Permission denied error
 */
export class PermissionDeniedError extends Data.TaggedError("PermissionDeniedError")<{
  readonly path: FilePath
  readonly disk: DiskName
  readonly operation: "read" | "write" | "delete" | "list"
}> {
  get message(): string {
    return `Permission denied: cannot ${this.operation} ${this.path} on disk ${this.disk}`
  }
}

/**
 * Disk not found error
 */
export class DiskNotFoundError extends Data.TaggedError("DiskNotFoundError")<{
  readonly disk: string
}> {
  get message(): string {
    return `Disk not found: ${this.disk}`
  }
}

/**
 * Disk connection error
 */
export class DiskConnectionError extends Data.TaggedError("DiskConnectionError")<{
  readonly disk: DiskName
  readonly cause: unknown
}> {
  get message(): string {
    return `Connection error on disk ${this.disk}: ${String(this.cause)}`
  }
}

/**
 * Invalid path error (re-exported from domain for convenience)
 */
export class InvalidPathError extends Data.TaggedError("InvalidPathError")<{
  readonly path: string
  readonly reason: string
}> {
  get message(): string {
    return `Invalid path "${this.path}": ${this.reason}`
  }
}

/**
 * Invalid disk name error (re-exported from domain for convenience)
 */
export class InvalidDiskNameError extends Data.TaggedError("InvalidDiskNameError")<{
  readonly name: string
}> {
  get message(): string {
    return `Invalid disk name: ${this.name}`
  }
}

/**
 * Storage quota exceeded error
 */
export class StorageQuotaExceededError extends Data.TaggedError("StorageQuotaExceededError")<{
  readonly disk: DiskName
  readonly requestedBytes: number
  readonly availableBytes: number
}> {
  get message(): string {
    return `Storage quota exceeded on disk ${this.disk}: requested ${this.requestedBytes} bytes, available ${this.availableBytes} bytes`
  }
}

/**
 * Stream error
 */
export class StreamError extends Data.TaggedError("StreamError")<{
  readonly path: FilePath
  readonly disk: DiskName
  readonly cause: unknown
}> {
  get message(): string {
    return `Stream error for ${this.path} on disk ${this.disk}: ${String(this.cause)}`
  }
}

/**
 * Directory not empty error
 */
export class DirectoryNotEmptyError extends Data.TaggedError("DirectoryNotEmptyError")<{
  readonly path: FilePath
  readonly disk: DiskName
}> {
  get message(): string {
    return `Directory not empty: ${this.path} on disk ${this.disk}`
  }
}

/**
 * Not a directory error
 */
export class NotADirectoryError extends Data.TaggedError("NotADirectoryError")<{
  readonly path: FilePath
  readonly disk: DiskName
}> {
  get message(): string {
    return `Not a directory: ${this.path} on disk ${this.disk}`
  }
}

/**
 * Is a directory error (when file operation attempted on directory)
 */
export class IsADirectoryError extends Data.TaggedError("IsADirectoryError")<{
  readonly path: FilePath
  readonly disk: DiskName
}> {
  get message(): string {
    return `Is a directory: ${this.path} on disk ${this.disk}`
  }
}

/**
 * Union type of all storage errors
 */
export type StorageError =
  | FileNotFoundError
  | FileExistsError
  | PermissionDeniedError
  | DiskNotFoundError
  | DiskConnectionError
  | InvalidPathError
  | InvalidDiskNameError
  | StorageQuotaExceededError
  | StreamError
  | DirectoryNotEmptyError
  | NotADirectoryError
  | IsADirectoryError

/**
 * Type guard for FileNotFoundError
 */
export const isFileNotFound = (error: StorageError): error is FileNotFoundError =>
  error._tag === "FileNotFoundError"

/**
 * Type guard for FileExistsError
 */
export const isFileExists = (error: StorageError): error is FileExistsError =>
  error._tag === "FileExistsError"

/**
 * Type guard for PermissionDeniedError
 */
export const isPermissionDenied = (error: StorageError): error is PermissionDeniedError =>
  error._tag === "PermissionDeniedError"

/**
 * Type guard for DiskNotFoundError
 */
export const isDiskNotFound = (error: StorageError): error is DiskNotFoundError =>
  error._tag === "DiskNotFoundError"

/**
 * Type guard for DiskConnectionError
 */
export const isDiskConnection = (error: StorageError): error is DiskConnectionError =>
  error._tag === "DiskConnectionError"
