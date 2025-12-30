/**
 * @gello/auth-templates - New Login Alert Template
 *
 * Email template for new login notifications.
 */

import * as React from "react"
import {
  BaseLayout,
  Section,
  Heading,
  Text,
  Button,
  Alert,
  Card,
  defaultTheme,
  type MailTheme,
} from "@gello/mail-templates"

export interface NewLoginProps {
  userName: string
  loginTime: string
  ipAddress: string
  location?: string
  device?: string
  browser?: string
  securityUrl: string
  appName?: string
  theme?: MailTheme
}

export const NewLogin: React.FC<NewLoginProps> = ({
  userName,
  loginTime,
  ipAddress,
  location,
  device,
  browser,
  securityUrl,
  appName = "Our App",
  theme = defaultTheme,
}) => {
  return (
    <BaseLayout theme={theme} preview={`New login to your ${appName} account`}>
      <Section>
        <Heading as="h1">New Login Detected</Heading>

        <Text>Hi {userName},</Text>

        <Text>
          We detected a new login to your {appName} account. If this was you,
          you can safely ignore this email.
        </Text>

        <Card>
          <Text>
            <strong>Time:</strong> {loginTime}
          </Text>
          <Text>
            <strong>IP Address:</strong> {ipAddress}
          </Text>
          {location && (
            <Text>
              <strong>Location:</strong> {location}
            </Text>
          )}
          {device && (
            <Text>
              <strong>Device:</strong> {device}
            </Text>
          )}
          {browser && (
            <Text>
              <strong>Browser:</strong> {browser}
            </Text>
          )}
        </Card>

        <Alert type="warning">
          If you didn't sign in, your account may have been compromised. Please
          change your password immediately and review your account security.
        </Alert>

        <Button href={securityUrl}>Review Account Security</Button>

        <Text muted>
          For your security, we send these notifications whenever there's a new
          login to your account.
        </Text>
      </Section>
    </BaseLayout>
  )
}

export default NewLogin
