/**
 * @gello/mail-templates - Heading
 *
 * Styled heading component (h1-h6).
 */

import * as React from "react"
import { Heading as EmailHeading } from "@react-email/components"
import { useMailTheme } from "../../theme/index.js"

export interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  children: React.ReactNode
  style?: React.CSSProperties
}

const fontSizes = {
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  h5: 16,
  h6: 14,
}

const margins = {
  h1: "0 0 16px 0",
  h2: "24px 0 12px 0",
  h3: "20px 0 10px 0",
  h4: "16px 0 8px 0",
  h5: "12px 0 6px 0",
  h6: "8px 0 4px 0",
}

export function Heading({ as = "h1", children, style }: HeadingProps) {
  const theme = useMailTheme()

  return (
    <EmailHeading
      as={as}
      style={{
        fontFamily: theme.fonts.heading,
        fontSize: `${fontSizes[as]}px`,
        fontWeight: "600",
        color: theme.colors.text,
        margin: margins[as],
        lineHeight: "1.3",
        ...style,
      }}
    >
      {children}
    </EmailHeading>
  )
}
