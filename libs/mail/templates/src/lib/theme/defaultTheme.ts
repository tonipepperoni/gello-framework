/**
 * @gello/mail-templates - Default Theme
 *
 * Sensible default theme configuration.
 */

import type { MailTheme } from "./types.js"

/**
 * Default mail theme with modern, clean styling
 */
export const defaultTheme: MailTheme = {
  brand: {
    name: "My App",
    logoWidth: 120,
  },
  colors: {
    primary: "#3b82f6", // Blue 500
    secondary: "#64748b", // Slate 500
    background: "#ffffff",
    surface: "#f8fafc", // Slate 50
    text: "#1e293b", // Slate 800
    muted: "#94a3b8", // Slate 400
    border: "#e2e8f0", // Slate 200
    success: "#22c55e", // Green 500
    warning: "#f59e0b", // Amber 500
    error: "#ef4444", // Red 500
  },
  fonts: {
    heading: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    mono: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
  },
  layout: {
    maxWidth: 600,
    padding: 24,
    borderRadius: 8,
  },
}
