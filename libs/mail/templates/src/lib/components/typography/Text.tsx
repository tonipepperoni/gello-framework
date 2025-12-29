/**
 * @gello/mail-templates - Text
 *
 * Styled paragraph text component.
 */

import * as React from "react"
import { Text as EmailText } from "@react-email/components"
import { useMailTheme } from "../../theme/index.js"

export interface TextProps {
  children: React.ReactNode
  muted?: boolean
  small?: boolean
  center?: boolean
  style?: React.CSSProperties
}

export function Text({
  children,
  muted = false,
  small = false,
  center = false,
  style,
}: TextProps) {
  const theme = useMailTheme()

  return (
    <EmailText
      style={{
        fontFamily: theme.fonts.body,
        fontSize: small ? "14px" : "16px",
        color: muted ? theme.colors.muted : theme.colors.text,
        lineHeight: "1.6",
        margin: "0 0 16px 0",
        textAlign: center ? "center" : undefined,
        ...style,
      }}
    >
      {children}
    </EmailText>
  )
}
