/**
 * @gello/mail-templates - Code
 *
 * Inline code component.
 */

import * as React from "react"
import { useMailTheme } from "../../theme/index.js"

export interface CodeProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function Code({ children, style }: CodeProps) {
  const theme = useMailTheme()

  return (
    <code
      style={{
        fontFamily: theme.fonts.mono,
        fontSize: "14px",
        backgroundColor: theme.colors.surface,
        padding: "2px 6px",
        borderRadius: "4px",
        border: `1px solid ${theme.colors.border}`,
        ...style,
      }}
    >
      {children}
    </code>
  )
}
