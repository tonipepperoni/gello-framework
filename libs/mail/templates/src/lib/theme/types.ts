/**
 * @gello/mail-templates - Theme Types
 *
 * Type definitions for the mail theme configuration.
 */

/**
 * Brand configuration
 */
export interface MailThemeBrand {
  readonly name: string
  readonly logo?: string
  readonly logoWidth?: number
  readonly website?: string
}

/**
 * Color palette
 */
export interface MailThemeColors {
  readonly primary: string
  readonly secondary: string
  readonly background: string
  readonly surface: string
  readonly text: string
  readonly muted: string
  readonly border: string
  readonly success: string
  readonly warning: string
  readonly error: string
}

/**
 * Font configuration
 */
export interface MailThemeFonts {
  readonly heading: string
  readonly body: string
  readonly mono: string
}

/**
 * Layout configuration
 */
export interface MailThemeLayout {
  readonly maxWidth: number
  readonly padding: number
  readonly borderRadius: number
}

/**
 * Social link
 */
export interface SocialLink {
  readonly url: string
  readonly icon?: string
}

/**
 * Footer configuration
 */
export interface MailThemeFooter {
  readonly company?: string
  readonly address?: string
  readonly unsubscribeUrl?: string
  readonly socialLinks?: {
    readonly twitter?: string
    readonly facebook?: string
    readonly instagram?: string
    readonly linkedin?: string
    readonly github?: string
    readonly youtube?: string
  }
}

/**
 * Complete mail theme configuration
 */
export interface MailTheme {
  readonly brand: MailThemeBrand
  readonly colors: MailThemeColors
  readonly fonts: MailThemeFonts
  readonly layout: MailThemeLayout
  readonly footer?: MailThemeFooter
}

/**
 * Partial theme for user configuration
 */
export type MailThemeInput = {
  readonly brand?: Partial<MailThemeBrand>
  readonly colors?: Partial<MailThemeColors>
  readonly fonts?: Partial<MailThemeFonts>
  readonly layout?: Partial<MailThemeLayout>
  readonly footer?: Partial<MailThemeFooter>
}
