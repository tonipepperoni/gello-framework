/**
 * @gello/mail-templates - Card
 *
 * Elevated card container.
 */

import * as React from "react"
import { Section } from "@react-email/components"
import { useMailTheme } from "../../theme/index.js"

export interface CardProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function Card({ children, style }: CardProps) {
  const theme = useMailTheme()

  return (
    <Section
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: `${theme.layout.borderRadius}px`,
        padding: `${theme.layout.padding}px`,
        border: `1px solid ${theme.colors.border}`,
        margin: "16px 0",
        ...style,
      }}
    >
      {children}
    </Section>
  )
}
