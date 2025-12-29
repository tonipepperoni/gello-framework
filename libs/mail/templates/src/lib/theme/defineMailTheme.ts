/**
 * @gello/mail-templates - defineMailTheme
 *
 * Factory function for creating mail themes with sensible defaults.
 */

import type { MailTheme, MailThemeInput } from "./types.js"
import { defaultTheme } from "./defaultTheme.js"

/**
 * Create a mail theme by merging user configuration with defaults
 *
 * @example
 * ```typescript
 * export const mailTheme = defineMailTheme({
 *   brand: {
 *     name: "My Company",
 *     logo: "https://example.com/logo.png",
 *     website: "https://example.com",
 *   },
 *   colors: {
 *     primary: "#8b5cf6", // Purple
 *   },
 *   footer: {
 *     company: "My Company Inc.",
 *     address: "123 Main St, City, Country",
 *   },
 * })
 * ```
 */
export function defineMailTheme(input: MailThemeInput = {}): MailTheme {
  return {
    brand: {
      ...defaultTheme.brand,
      ...input.brand,
    },
    colors: {
      ...defaultTheme.colors,
      ...input.colors,
    },
    fonts: {
      ...defaultTheme.fonts,
      ...input.fonts,
    },
    layout: {
      ...defaultTheme.layout,
      ...input.layout,
    },
    footer: input.footer
      ? {
          ...defaultTheme.footer,
          ...input.footer,
        }
      : undefined,
  }
}
