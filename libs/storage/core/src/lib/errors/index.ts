/**
 * Error types exports for @gello/storage
 *
 * @module @gello/storage/errors
 */

export {
  FileNotFoundError,
  FileExistsError,
  PermissionDeniedError,
  DiskNotFoundError,
  DiskConnectionError,
  InvalidPathError,
  InvalidDiskNameError,
  StorageQuotaExceededError,
  StreamError,
  DirectoryNotEmptyError,
  NotADirectoryError,
  IsADirectoryError,
  isFileNotFound,
  isFileExists,
  isPermissionDenied,
  isDiskNotFound,
  isDiskConnection,
} from "./StorageError.js"

export type { StorageError } from "./StorageError.js"
