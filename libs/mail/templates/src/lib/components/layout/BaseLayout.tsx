/**
 * @gello/mail-templates - BaseLayout
 *
 * Main email wrapper with header, content area, and footer.
 */

import * as React from "react"
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Link,
  Text,
  Hr,
} from "@react-email/components"
import { ThemeProvider, useMailTheme, type MailTheme } from "../../theme/index.js"

export interface BaseLayoutProps {
  theme: MailTheme
  preview?: string
  children: React.ReactNode
}

/**
 * Base email layout with header and footer
 */
export function BaseLayout({ theme, preview, children }: BaseLayoutProps) {
  return (
    <ThemeProvider theme={theme}>
      <Html>
        <Head />
        {preview && <span style={{ display: "none" }}>{preview}</span>}
        <Body style={bodyStyle(theme)}>
          <Container style={containerStyle(theme)}>
            <Header />
            <Section style={contentStyle(theme)}>{children}</Section>
            <Footer />
          </Container>
        </Body>
      </Html>
    </ThemeProvider>
  )
}

/**
 * Email header with logo
 */
function Header() {
  const theme = useMailTheme()

  return (
    <Section style={headerStyle(theme)}>
      {theme.brand.logo ? (
        <Link href={theme.brand.website}>
          <Img
            src={theme.brand.logo}
            width={theme.brand.logoWidth ?? 120}
            alt={theme.brand.name}
            style={{ margin: "0 auto" }}
          />
        </Link>
      ) : (
        <Text style={brandTextStyle(theme)}>{theme.brand.name}</Text>
      )}
    </Section>
  )
}

/**
 * Email footer with company info and links
 */
function Footer() {
  const theme = useMailTheme()
  const footer = theme.footer

  if (!footer) return null

  return (
    <Section style={footerStyle(theme)}>
      <Hr style={dividerStyle(theme)} />

      {footer.company && (
        <Text style={footerTextStyle(theme)}>{footer.company}</Text>
      )}

      {footer.address && (
        <Text style={footerTextStyle(theme)}>{footer.address}</Text>
      )}

      {footer.socialLinks && (
        <Section style={{ textAlign: "center", marginTop: "16px" }}>
          {footer.socialLinks.twitter && (
            <Link href={footer.socialLinks.twitter} style={socialLinkStyle(theme)}>
              Twitter
            </Link>
          )}
          {footer.socialLinks.facebook && (
            <Link href={footer.socialLinks.facebook} style={socialLinkStyle(theme)}>
              Facebook
            </Link>
          )}
          {footer.socialLinks.linkedin && (
            <Link href={footer.socialLinks.linkedin} style={socialLinkStyle(theme)}>
              LinkedIn
            </Link>
          )}
          {footer.socialLinks.github && (
            <Link href={footer.socialLinks.github} style={socialLinkStyle(theme)}>
              GitHub
            </Link>
          )}
        </Section>
      )}

      {footer.unsubscribeUrl && (
        <Text style={unsubscribeStyle(theme)}>
          <Link href={footer.unsubscribeUrl} style={{ color: theme.colors.muted }}>
            Unsubscribe
          </Link>
        </Text>
      )}
    </Section>
  )
}

// =============================================================================
// Styles
// =============================================================================

function bodyStyle(theme: MailTheme): React.CSSProperties {
  return {
    backgroundColor: theme.colors.surface,
    fontFamily: theme.fonts.body,
    margin: 0,
    padding: "40px 0",
  }
}

function containerStyle(theme: MailTheme): React.CSSProperties {
  return {
    maxWidth: `${theme.layout.maxWidth}px`,
    margin: "0 auto",
    backgroundColor: theme.colors.background,
    borderRadius: `${theme.layout.borderRadius}px`,
    overflow: "hidden",
  }
}

function headerStyle(theme: MailTheme): React.CSSProperties {
  return {
    padding: `${theme.layout.padding}px`,
    textAlign: "center",
    borderBottom: `1px solid ${theme.colors.border}`,
  }
}

function brandTextStyle(theme: MailTheme): React.CSSProperties {
  return {
    fontSize: "24px",
    fontWeight: "bold",
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
    margin: 0,
  }
}

function contentStyle(theme: MailTheme): React.CSSProperties {
  return {
    padding: `${theme.layout.padding}px`,
  }
}

function footerStyle(theme: MailTheme): React.CSSProperties {
  return {
    padding: `${theme.layout.padding}px`,
    textAlign: "center",
  }
}

function footerTextStyle(theme: MailTheme): React.CSSProperties {
  return {
    fontSize: "12px",
    color: theme.colors.muted,
    margin: "4px 0",
    lineHeight: "1.5",
  }
}

function dividerStyle(theme: MailTheme): React.CSSProperties {
  return {
    borderColor: theme.colors.border,
    borderTop: "none",
    marginBottom: "16px",
  }
}

function socialLinkStyle(theme: MailTheme): React.CSSProperties {
  return {
    color: theme.colors.muted,
    fontSize: "12px",
    marginRight: "16px",
    textDecoration: "none",
  }
}

function unsubscribeStyle(theme: MailTheme): React.CSSProperties {
  return {
    fontSize: "11px",
    color: theme.colors.muted,
    marginTop: "16px",
  }
}
