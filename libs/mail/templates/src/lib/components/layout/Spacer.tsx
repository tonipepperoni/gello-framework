/**
 * @gello/mail-templates - Spacer
 *
 * Vertical spacing element.
 */

import { Section } from "@react-email/components"

export interface SpacerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}

const sizes = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
}

export function Spacer({ size = "md" }: SpacerProps) {
  return <Section style={{ height: `${sizes[size]}px` }} />
}
