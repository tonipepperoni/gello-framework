/**
 * @gello/auth-templates - Reset Password Template
 *
 * Email template for password reset.
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

export interface ResetPasswordProps {
  userName: string
  resetUrl: string
  expiresIn?: string
  appName?: string
  ipAddress?: string
  theme?: MailTheme
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({
  userName,
  resetUrl,
  expiresIn = "60 minutes",
  appName = "Our App",
  ipAddress,
  theme = defaultTheme,
}) => {
  return (
    <BaseLayout theme={theme} preview={`Reset your password for ${appName}`}>
      <Section>
        <Heading as="h1">Reset Your Password</Heading>

        <Text>Hi {userName},</Text>

        <Text>
          We received a request to reset your password for your {appName}{" "}
          account. Click the button below to set a new password.
        </Text>

        <Button href={resetUrl}>Reset Password</Button>

        <Text muted>
          This password reset link will expire in {expiresIn}.
        </Text>

        {ipAddress && (
          <Text muted>
            This request was made from IP address: {ipAddress}
          </Text>
        )}

        <Alert type="warning">
          If you didn't request a password reset, please ignore this email or
          contact support if you believe your account has been compromised.
        </Alert>

        <Text muted>
          If the button above doesn't work, copy and paste this URL into your
          browser: {resetUrl}
        </Text>
      </Section>
    </BaseLayout>
  )
}

export default ResetPassword
