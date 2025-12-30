/**
 * Fumadocs neutral theme for CLI
 * Matches the docs site color scheme
 */
export const theme = {
  // Backgrounds
  bg: '#0a0a0a',
  bgSoft: '#171717',
  bg1: '#212121',
  bg2: '#272727',
  // Foregrounds
  fg: '#fafafa',
  fgMuted: '#a3a3a3',
  fg2: '#d1d1d1',
  fg3: '#f5f5f5',
  fg4: '#a3a3a3',        // Alias for muted
  // Grays
  gray: '#737373',
  grayLight: '#b3b3b3',
  border: '#272727',
  // Accent colors (modern palette)
  primary: '#3b82f6',    // Blue
  blue: '#3b82f6',       // Alias
  success: '#22c55e',    // Green
  green: '#22c55e',      // Alias
  warning: '#eab308',    // Yellow
  yellow: '#eab308',     // Alias
  error: '#ef4444',      // Red
  red: '#ef4444',        // Alias
  info: '#06b6d4',       // Cyan
  aqua: '#06b6d4',       // Alias
  purple: '#a855f7',     // Purple
  orange: '#f97316',     // Orange
} as const;

// Alias for backward compatibility
export const gruvbox = theme;

export const GELLO_LOGO = `
 ██████╗ ███████╗██╗     ██╗      ██████╗
██╔════╝ ██╔════╝██║     ██║     ██╔═══██╗
██║  ███╗█████╗  ██║     ██║     ██║   ██║
██║   ██║██╔══╝  ██║     ██║     ██║   ██║
╚██████╔╝███████╗███████╗███████╗╚██████╔╝
 ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝
`.trim();
