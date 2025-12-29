/**
 * DiskName - Branded type for validated disk identifiers
 *
 * @module @gello/storage/domain
 */

import { Brand, Effect } from "effect"

/**
 * Branded type for validated disk names
 */
export type DiskName = string & Brand.Brand<"DiskName">

/**
 * Brand constructor for DiskName
 */
export const DiskName = Brand.nominal<DiskName>()

/**
 * Valid disk name pattern (lowercase, alphanumeric, underscores, hyphens)
 */
const VALID_DISK_NAME = /^[a-z][a-z0-9_-]*$/

/**
 * Error class for invalid disk names
 */
export class InvalidDiskNameError {
  readonly _tag = "InvalidDiskNameError"
  constructor(readonly name: string) {}
}

/**
 * Create a validated DiskName from a string
 */
export const makeDiskName = (
  name: string
): Effect.Effect<DiskName, InvalidDiskNameError> =>
  VALID_DISK_NAME.test(name)
    ? Effect.succeed(DiskName(name))
    : Effect.fail(new InvalidDiskNameError(name))

/**
 * Create a DiskName without validation (use with caution)
 */
export const unsafeDiskName = (name: string): DiskName => DiskName(name)

// Built-in disk names
export const LOCAL = DiskName("local")
export const PUBLIC = DiskName("public")
export const S3 = DiskName("s3")
export const AZURE = DiskName("azure")
export const GCS = DiskName("gcs")
export const MEMORY = DiskName("memory")
export const NULL = DiskName("null")

/**
 * Check if a disk name is a built-in disk
 */
export const isBuiltIn = (name: DiskName): boolean =>
  [LOCAL, PUBLIC, S3, AZURE, GCS, MEMORY, NULL].includes(name)
