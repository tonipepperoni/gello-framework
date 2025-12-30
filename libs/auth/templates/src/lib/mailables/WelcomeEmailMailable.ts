/**
 * @gello/auth-templates - Welcome Email Mailable
 *
 * Mailable for sending welcome emails.
 */

import { Effect } from "effect"
import { BaseMailable, type Content, type Mailable } from "@gello/mail-core"
import type { WelcomeEmailProps } from "../templates/WelcomeEmail.js"

/**
 * Data for welcome email mailable
 */
export interface WelcomeEmailData {
  userName: string
  email: string
  loginUrl: string
  appName?: string
  features?: string[]
}

/**
 * Mailable for welcome email
 */
export class WelcomeEmailMailable extends BaseMailable<WelcomeEmailData> {
  getSubject(): string {
    const data = this.getData()
    return `Welcome to ${data.appName ?? "Our App"}!`
  }

  getContent(): Effect.Effect<Content, never> {
    const data = this.getData()
    return Effect.succeed({
      subject: this.getSubject(),
      template: {
        name: "auth/welcome",
        data: {
          userName: data.userName,
          loginUrl: data.loginUrl,
          appName: data.appName ?? "Our App",
          features: data.features ?? [],
        } satisfies WelcomeEmailProps,
      },
    })
  }
}

/**
 * Create a welcome email mailable
 */
export const welcomeEmail = (data: WelcomeEmailData): Mailable<WelcomeEmailData> => {
  return new WelcomeEmailMailable().to(data.email).with(data)
}
