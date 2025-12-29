/**
 * @gello/mail-templates - Button
 *
 * Primary call-to-action button.
 */

import * as React from "react"
import { Button as EmailButton } from "@react-email/components"
import { useMailTheme } from "../../theme/index.js"

export interface ButtonProps {
  href: string
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  style?: React.CSSProperties
}

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  style,
}: ButtonProps) {
  const theme = useMailTheme()

  const sizes = {
    sm: { padding: "8px 16px", fontSize: "14px" },
    md: { padding: "12px 24px", fontSize: "16px" },
    lg: { padding: "16px 32px", fontSize: "18px" },
  }

  const variants = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: "#ffffff",
      border: "none",
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      color: "#ffffff",
      border: "none",
    },
    outline: {
      backgroundColor: "transparent",
      color: theme.colors.primary,
      border: `2px solid ${theme.colors.primary}`,
    },
  }

  return (
    <EmailButton
      href={href}
      style={{
        display: fullWidth ? "block" : "inline-block",
        width: fullWidth ? "100%" : undefined,
        textAlign: "center",
        fontFamily: theme.fonts.body,
        fontWeight: "600",
        textDecoration: "none",
        borderRadius: `${theme.layout.borderRadius}px`,
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </EmailButton>
  )
}
