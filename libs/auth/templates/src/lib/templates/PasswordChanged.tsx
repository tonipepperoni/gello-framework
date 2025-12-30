/**
 * @gello/auth-templates - Password Changed Template
 *
 * Email template for password change confirmation.
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

export interface PasswordChangedProps {
  userName: string
  changedAt: string
  ipAddress?: string
  securityUrl: string
  appName?: string
  theme?: MailTheme
}

export const PasswordChanged: React.FC<PasswordChangedProps> = ({
  userName,
  changedAt,
  ipAddress,
  securityUrl,
  appName = "Our App",
  theme = defaultTheme,
}) => {
  return (
    <BaseLayout theme={theme} preview={`Your ${appName} password was changed`}>
      <Section>
        <Heading as="h1">Password Changed</Heading>

        <Text>Hi {userName},</Text>

        <Text>
          Your password for your {appName} account was successfully changed on{" "}
          {changedAt}.
        </Text>

        {ipAddress && (
          <Text muted>
            This change was made from IP address: {ipAddress}
          </Text>
        )}

        <Alert type="warning">
          If you didn't make this change, your account may have been
          compromised. Please reset your password immediately and review your
          account security.
        </Alert>

        <Button href={securityUrl}>Review Account Security</Button>

        <Text muted>
          For your security, we send these notifications whenever your password
          is changed.
        </Text>
      </Section>
    </BaseLayout>
  )
}

export default PasswordChanged
