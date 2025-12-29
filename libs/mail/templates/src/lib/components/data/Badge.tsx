/**
 * @gello/mail-templates - Badge
 *
 * Status badge component.
 */

import * as React from "react"
import { useMailTheme } from "../../theme/index.js"

export interface BadgeProps {
  children: React.ReactNode
  color?: "default" | "success" | "warning" | "error" | "primary"
  style?: React.CSSProperties
}

export function Badge({ children, color = "default", style }: BadgeProps) {
  const theme = useMailTheme()

  const colors = {
    default: { bg: theme.colors.surface, text: theme.colors.text },
    success: { bg: "#dcfce7", text: "#166534" },
    warning: { bg: "#fef3c7", text: "#92400e" },
    error: { bg: "#fee2e2", text: "#991b1b" },
    primary: { bg: "#dbeafe", text: "#1e40af" },
  }

  const colorSet = colors[color]

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: theme.fonts.body,
        fontSize: "12px",
        fontWeight: "600",
        backgroundColor: colorSet.bg,
        color: colorSet.text,
        padding: "4px 12px",
        borderRadius: "9999px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        ...style,
      }}
    >
      {children}
    </span>
  )
}
