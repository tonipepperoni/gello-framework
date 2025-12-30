/**
 * @gello/auth-templates - Welcome Email Template
 *
 * Email template for welcoming new users.
 */

import * as React from "react"
import {
  BaseLayout,
  Section,
  Heading,
  Text,
  Button,
  Divider,
  defaultTheme,
  type MailTheme,
} from "@gello/mail-templates"

export interface WelcomeEmailProps {
  userName: string
  loginUrl: string
  appName?: string
  features?: string[]
  theme?: MailTheme
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  userName,
  loginUrl,
  appName = "Our App",
  features = [],
  theme = defaultTheme,
}) => {
  return (
    <BaseLayout theme={theme} preview={`Welcome to ${appName}!`}>
      <Section>
        <Heading as="h1">Welcome to {appName}!</Heading>

        <Text>Hi {userName},</Text>

        <Text>
          Thank you for joining {appName}! We're excited to have you on board.
          Your account is now ready to use.
        </Text>

        <Button href={loginUrl}>Get Started</Button>

        {features.length > 0 && (
          <>
            <Divider />

            <Heading as="h2">What you can do:</Heading>

            <ul>
              {features.map((feature, index) => (
                <li key={index}>
                  <Text>{feature}</Text>
                </li>
              ))}
            </ul>
          </>
        )}

        <Divider />

        <Text muted>
          If you have any questions, feel free to reply to this email. We're
          here to help!
        </Text>
      </Section>
    </BaseLayout>
  )
}

export default WelcomeEmail
