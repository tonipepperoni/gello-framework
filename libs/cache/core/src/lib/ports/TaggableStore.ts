/**
 * TaggableStore - Port interface for tagged cache storage
 *
 * @module ports/TaggableStore
 */
import { Context, Effect, Option } from "effect"
import type { CacheKey } from "../domain/CacheKey.js"
import type { CacheTag } from "../domain/CacheTag.js"
import type { Duration } from "../domain/Duration.js"
import type { CacheError } from "../errors/CacheError.js"
import type { CacheStore } from "./CacheStore.js"

/**
 * Extended cache store interface with tag support
 *
 * Tags allow grouping cache entries for bulk invalidation.
 * For example, all user-related cache entries can be tagged
 * with "users" and flushed together when user data changes.
 */
export interface TaggableStore extends CacheStore {
  /**
   * Get a value by key, filtered by tags
   *
   * The entry must have ALL specified tags to be returned.
   *
   * @param tags - Required tags
   * @param key - The cache key
   */
  readonly getTagged: <A>(
    tags: readonly CacheTag[],
    key: CacheKey
  ) => Effect.Effect<Option.Option<A>, CacheError>

  /**
   * Store a value with associated tags
   *
   * @param tags - Tags to associate with this entry
   * @param key - The cache key
   * @param value - The value to store
   * @param ttl - Optional time-to-live duration
   */
  readonly putTagged: <A>(
    tags: readonly CacheTag[],
    key: CacheKey,
    value: A,
    ttl?: Duration
  ) => Effect.Effect<void, CacheError>

  /**
   * Flush all entries with any of the specified tags
   *
   * @param tags - Tags to flush
   */
  readonly flushTags: (
    tags: readonly CacheTag[]
  ) => Effect.Effect<void, CacheError>

  /**
   * Get all keys associated with a tag
   *
   * @param tag - The tag to look up
   */
  readonly getTaggedKeys: (
    tag: CacheTag
  ) => Effect.Effect<readonly CacheKey[], CacheError>
}

/**
 * TaggableStore service tag for dependency injection
 */
export class TaggableStoreTag extends Context.Tag("@gello/cache/TaggableStore")<
  TaggableStoreTag,
  TaggableStore
>() {}

/**
 * Check if a store supports tagging
 */
export const isTaggable = (store: CacheStore): store is TaggableStore =>
  "putTagged" in store && "flushTags" in store
