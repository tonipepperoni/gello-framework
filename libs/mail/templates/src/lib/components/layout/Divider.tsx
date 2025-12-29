/**
 * @gello/mail-templates - Divider
 *
 * Horizontal divider line.
 */

import * as React from "react"
import { Hr } from "@react-email/components"
import { useMailTheme } from "../../theme/index.js"

export interface DividerProps {
  style?: React.CSSProperties
}

export function Divider({ style }: DividerProps) {
  const theme = useMailTheme()

  return (
    <Hr
      style={{
        borderColor: theme.colors.border,
        borderTop: "none",
        margin: "24px 0",
        ...style,
      }}
    />
  )
}
