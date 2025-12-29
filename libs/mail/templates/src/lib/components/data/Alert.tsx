/**
 * @gello/mail-templates - Alert
 *
 * Alert/callout box component.
 */

import * as React from "react"
import { Section, Text } from "@react-email/components"
import { useMailTheme } from "../../theme/index.js"

export interface AlertProps {
  type?: "info" | "success" | "warning" | "error"
  title?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

export function Alert({
  type = "info",
  title,
  children,
  style,
}: AlertProps) {
  const theme = useMailTheme()

  const types = {
    info: {
      bg: "#eff6ff",
      border: "#3b82f6",
      title: "#1e40af",
      text: "#1e3a5f",
    },
    success: {
      bg: "#f0fdf4",
      border: "#22c55e",
      title: "#166534",
      text: "#14532d",
    },
    warning: {
      bg: "#fffbeb",
      border: "#f59e0b",
      title: "#92400e",
      text: "#78350f",
    },
    error: {
      bg: "#fef2f2",
      border: "#ef4444",
      title: "#991b1b",
      text: "#7f1d1d",
    },
  }

  const colors = types[type]

  return (
    <Section
      style={{
        backgroundColor: colors.bg,
        borderLeft: `4px solid ${colors.border}`,
        borderRadius: `${theme.layout.borderRadius}px`,
        padding: "16px",
        margin: "16px 0",
        ...style,
      }}
    >
      {title && (
        <Text
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: "14px",
            fontWeight: "600",
            color: colors.title,
            margin: "0 0 8px 0",
          }}
        >
          {title}
        </Text>
      )}
      <Text
        style={{
          fontFamily: theme.fonts.body,
          fontSize: "14px",
          color: colors.text,
          margin: 0,
          lineHeight: "1.5",
        }}
      >
        {children}
      </Text>
    </Section>
  )
}
