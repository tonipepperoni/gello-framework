/**
 * Visibility - File visibility (public or private)
 *
 * @module @gello/storage/domain
 */

/**
 * File visibility type
 */
export type Visibility = "public" | "private"

/**
 * Visibility constants and utilities
 */
export const Visibility = {
  /**
   * Public visibility - file is publicly accessible
   */
  Public: "public" as const,

  /**
   * Private visibility - file requires authentication
   */
  Private: "private" as const,

  /**
   * Check if visibility is public
   */
  isPublic: (v: Visibility): boolean => v === "public",

  /**
   * Check if visibility is private
   */
  isPrivate: (v: Visibility): boolean => v === "private",

  /**
   * Parse visibility from string
   */
  parse: (value: string): Visibility =>
    value.toLowerCase() === "public" ? "public" : "private",

  /**
   * Default visibility
   */
  default: "private" as Visibility,
} as const
