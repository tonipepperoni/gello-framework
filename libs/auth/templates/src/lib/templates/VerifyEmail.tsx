/**
 * @gello/auth-templates - Verify Email Template
 *
 * Email template for email verification.
 */

import * as React from "react"
import {
  BaseLayout,
  Section,
  Heading,
  Text,
  Button,
  Alert,
  defaultTheme,
  type MailTheme,
} from "@gello/mail-templates"

export interface VerifyEmailProps {
  userName: string
  verificationUrl: string
  expiresIn?: string
  appName?: string
  theme?: MailTheme
}

export const VerifyEmail: React.FC<VerifyEmailProps> = ({
  userName,
  verificationUrl,
  expiresIn = "60 minutes",
  appName = "Our App",
  theme = defaultTheme,
}) => {
  return (
    <BaseLayout theme={theme} preview={`Verify your email address for ${appName}`}>
      <Section>
        <Heading as="h1">Verify Your Email Address</Heading>

        <Text>Hi {userName},</Text>

        <Text>
          Thank you for signing up for {appName}! Please verify your email
          address by clicking the button below.
        </Text>

        <Button href={verificationUrl}>Verify Email Address</Button>

        <Text muted>
          This verification link will expire in {expiresIn}. If you didn't
          create an account, you can safely ignore this email.
        </Text>

        <Alert type="info">
          If the button above doesn't work, copy and paste this URL into your
          browser: {verificationUrl}
        </Alert>
      </Section>
    </BaseLayout>
  )
}

export default VerifyEmail
