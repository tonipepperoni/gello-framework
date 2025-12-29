/**
 * CacheTag - Branded type for cache tags
 *
 * @module domain/CacheTag
 */
import { Brand, Effect } from "effect"

/**
 * Branded type for cache tags
 * Tags must be alphanumeric with underscores and hyphens
 */
export type CacheTag = string & Brand.Brand<"CacheTag">

/**
 * Constructor for CacheTag brand
 */
export const CacheTag = Brand.nominal<CacheTag>()

/**
 * Valid tag pattern: alphanumeric, underscores, hyphens, colons
 */
const TAG_PATTERN = /^[a-zA-Z0-9_:-]+$/

/**
 * Maximum tag length
 */
export const MAX_TAG_LENGTH = 100

/**
 * Validate and create a CacheTag
 */
export const makeCacheTag = (
  tag: string
): Effect.Effect<CacheTag, InvalidCacheTagError> => {
  if (tag.length === 0) {
    return Effect.fail(
      new InvalidCacheTagError({ tag, reason: "Tag cannot be empty" })
    )
  }
  if (tag.length > MAX_TAG_LENGTH) {
    return Effect.fail(
      new InvalidCacheTagError({
        tag,
        reason: `Tag length ${tag.length} exceeds maximum of ${MAX_TAG_LENGTH}`,
      })
    )
  }
  if (!TAG_PATTERN.test(tag)) {
    return Effect.fail(
      new InvalidCacheTagError({
        tag,
        reason:
          "Tag must contain only alphanumeric characters, underscores, hyphens, and colons",
      })
    )
  }
  return Effect.succeed(CacheTag(tag))
}

/**
 * Create a CacheTag without validation (unsafe)
 */
export const unsafeMakeCacheTag = (tag: string): CacheTag => CacheTag(tag)

/**
 * Create multiple tags from strings
 */
export const makeCacheTags = (
  tags: readonly string[]
): Effect.Effect<readonly CacheTag[], InvalidCacheTagError> =>
  Effect.all(tags.map(makeCacheTag))

/**
 * Error for invalid cache tag
 */
export class InvalidCacheTagError extends Error {
  readonly _tag = "InvalidCacheTagError" as const
  readonly tag: string
  readonly reason: string

  constructor({ tag, reason }: { tag: string; reason: string }) {
    super(`Invalid cache tag "${tag}": ${reason}`)
    this.name = "InvalidCacheTagError"
    this.tag = tag
    this.reason = reason
  }
}
