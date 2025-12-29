/**
 * FilePath - Branded type for validated file paths
 *
 * @module @gello/storage/domain
 */

import { Brand, Effect, pipe } from "effect"

/**
 * Branded type for validated file paths
 */
export type FilePath = string & Brand.Brand<"FilePath">

/**
 * Brand constructor for FilePath
 */
export const FilePath = Brand.nominal<FilePath>()

/**
 * Invalid characters in file paths
 */
const INVALID_CHARS = /[<>:"|?*\x00-\x1f]/

/**
 * Double dots (path traversal)
 */
const DOUBLE_DOTS = /\.\./

/**
 * Maximum path length
 */
const MAX_PATH_LENGTH = 1024

/**
 * Error class for invalid file paths
 */
export class InvalidPathError {
  readonly _tag = "InvalidPathError"
  constructor(
    readonly path: string,
    readonly reason: string
  ) {}
}

/**
 * Normalize path separators and remove leading/trailing slashes
 */
export const normalizePath = (path: string): string =>
  path
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/+/g, "/")

/**
 * Create a validated FilePath from a string
 */
export const makeFilePath = (
  path: string
): Effect.Effect<FilePath, InvalidPathError> => {
  const normalized = normalizePath(path)

  if (normalized.length === 0) {
    return Effect.fail(new InvalidPathError(path, "Path cannot be empty"))
  }
  if (normalized.length > MAX_PATH_LENGTH) {
    return Effect.fail(
      new InvalidPathError(path, `Path exceeds ${MAX_PATH_LENGTH} characters`)
    )
  }
  if (INVALID_CHARS.test(normalized)) {
    return Effect.fail(
      new InvalidPathError(path, "Path contains invalid characters")
    )
  }
  if (DOUBLE_DOTS.test(normalized)) {
    return Effect.fail(
      new InvalidPathError(path, "Path traversal (..) not allowed")
    )
  }

  return Effect.succeed(FilePath(normalized))
}

/**
 * Create a FilePath without validation (use with caution)
 */
export const unsafeFilePath = (path: string): FilePath =>
  FilePath(normalizePath(path))

/**
 * Get the directory name from a path
 */
export const dirname = (path: FilePath): FilePath => {
  const parts = path.split("/")
  return FilePath(parts.slice(0, -1).join("/") || ".")
}

/**
 * Get the base name (file name) from a path
 */
export const basename = (path: FilePath): string =>
  path.split("/").pop() ?? ""

/**
 * Get the file extension from a path
 */
export const extension = (path: FilePath): string => {
  const base = basename(path)
  const lastDot = base.lastIndexOf(".")
  return lastDot > 0 ? base.slice(lastDot + 1) : ""
}

/**
 * Get the file name without extension
 */
export const filenameWithoutExtension = (path: FilePath): string => {
  const base = basename(path)
  const lastDot = base.lastIndexOf(".")
  return lastDot > 0 ? base.slice(0, lastDot) : base
}

/**
 * Join path segments into a validated FilePath
 */
export const join = (
  ...parts: string[]
): Effect.Effect<FilePath, InvalidPathError> =>
  makeFilePath(parts.filter(Boolean).join("/"))

/**
 * Join path segments without validation
 */
export const unsafeJoin = (...parts: string[]): FilePath =>
  unsafeFilePath(parts.filter(Boolean).join("/"))

/**
 * Check if a path is absolute
 */
export const isAbsolute = (path: FilePath): boolean => path.startsWith("/")

/**
 * Check if a path is relative
 */
export const isRelative = (path: FilePath): boolean => !isAbsolute(path)

/**
 * Get parent directory
 */
export const parent = (path: FilePath): FilePath | null => {
  const dir = dirname(path)
  return dir === "." ? null : dir
}

/**
 * Check if path has a specific extension
 */
export const hasExtension = (path: FilePath, ext: string): boolean => {
  const pathExt = extension(path).toLowerCase()
  const checkExt = ext.toLowerCase().replace(/^\./, "")
  return pathExt === checkExt
}
