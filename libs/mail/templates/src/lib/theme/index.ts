/**
 * @gello/mail-templates - Theme
 *
 * Theme system exports.
 */

export type {
  MailTheme,
  MailThemeInput,
  MailThemeBrand,
  MailThemeColors,
  MailThemeFonts,
  MailThemeLayout,
  MailThemeFooter,
} from "./types.js"

export { defaultTheme } from "./defaultTheme.js"
export { defineMailTheme } from "./defineMailTheme.js"
export { ThemeProvider, useMailTheme } from "./ThemeProvider.js"
