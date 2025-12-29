/**
 * @gello/mail-templates - Link
 *
 * Styled link component.
 */

import * as React from "react"
import { Link as EmailLink } from "@react-email/components"
import { useMailTheme } from "../../theme/index.js"

export interface LinkProps {
  href: string
  children: React.ReactNode
  style?: React.CSSProperties
}

export function Link({ href, children, style }: LinkProps) {
  const theme = useMailTheme()

  return (
    <EmailLink
      href={href}
      style={{
        color: theme.colors.primary,
        textDecoration: "underline",
        ...style,
      }}
    >
      {children}
    </EmailLink>
  )
}
