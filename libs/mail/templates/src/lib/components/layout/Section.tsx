/**
 * @gello/mail-templates - Section
 *
 * Content section with padding.
 */

import * as React from "react"
import { Section as EmailSection } from "@react-email/components"
import { useMailTheme } from "../../theme/index.js"

export interface SectionProps {
  children: React.ReactNode
  padding?: boolean
  style?: React.CSSProperties
}

export function Section({ children, padding = true, style }: SectionProps) {
  const theme = useMailTheme()

  return (
    <EmailSection
      style={{
        padding: padding ? `${theme.layout.padding / 2}px 0` : undefined,
        ...style,
      }}
    >
      {children}
    </EmailSection>
  )
}
