/**
 * @gello/mail-templates - ThemeProvider
 *
 * React context provider for mail theme.
 */

import * as React from "react"
import type { MailTheme } from "./types.js"
import { defaultTheme } from "./defaultTheme.js"

/**
 * Theme context
 */
const ThemeContext = React.createContext<MailTheme>(defaultTheme)

/**
 * Hook to access the current theme
 */
export function useMailTheme(): MailTheme {
  return React.useContext(ThemeContext)
}

/**
 * Provider props
 */
export interface ThemeProviderProps {
  theme: MailTheme
  children: React.ReactNode
}

/**
 * Theme provider component
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  )
}
