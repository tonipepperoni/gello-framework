/**
 * Domain layer exports for @gello/storage
 *
 * @module @gello/storage/domain
 */

// FilePath
export {
  FilePath,
  makeFilePath,
  unsafeFilePath,
  normalizePath,
  dirname,
  basename,
  extension,
  filenameWithoutExtension,
  join,
  unsafeJoin,
  isAbsolute,
  isRelative,
  parent,
  hasExtension,
  InvalidPathError,
} from "./FilePath.js"
export type { FilePath as FilePathType } from "./FilePath.js"

// DiskName
export {
  DiskName,
  makeDiskName,
  unsafeDiskName,
  InvalidDiskNameError,
  LOCAL,
  PUBLIC,
  S3,
  AZURE,
  GCS,
  MEMORY,
  NULL,
  isBuiltIn,
} from "./DiskName.js"
export type { DiskName as DiskNameType } from "./DiskName.js"

// Visibility
export { Visibility } from "./Visibility.js"
export type { Visibility as VisibilityType } from "./Visibility.js"

// FileInfo
export { FileInfo } from "./FileInfo.js"
export type { FileInfo as FileInfoType } from "./FileInfo.js"

// MimeType
export {
  guessMimeType,
  getMimeType,
  isImage,
  isVideo,
  isAudio,
  isText,
  isDocument,
  isArchive,
  DEFAULT_MIME_TYPE,
} from "./MimeType.js"
