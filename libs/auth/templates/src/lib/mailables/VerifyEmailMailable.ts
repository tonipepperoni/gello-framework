/**
 * @gello/auth-templates - Verify Email Mailable
 *
 * Mailable for sending email verification.
 */

import { Effect } from "effect"
import { BaseMailable, type Content, type Mailable } from "@gello/mail-core"
import type { VerifyEmailProps } from "../templates/VerifyEmail.js"

/**
 * Data for verify email mailable
 */
export interface VerifyEmailData {
  userName: string
  email: string
  verificationUrl: string
  expiresIn?: string
  appName?: string
}

/**
 * Mailable for email verification
 */
export class VerifyEmailMailable extends BaseMailable<VerifyEmailData> {
  getSubject(): string {
    const data = this.getData()
    return `Verify your email address for ${data.appName ?? "Our App"}`
  }

  getContent(): Effect.Effect<Content, never> {
    const data = this.getData()
    return Effect.succeed({
      subject: this.getSubject(),
      template: {
        name: "auth/verify-email",
        data: {
          userName: data.userName,
          verificationUrl: data.verificationUrl,
          expiresIn: data.expiresIn ?? "60 minutes",
          appName: data.appName ?? "Our App",
        } satisfies VerifyEmailProps,
      },
    })
  }
}

/**
 * Create a verify email mailable
 */
export const verifyEmail = (data: VerifyEmailData): Mailable<VerifyEmailData> => {
  return new VerifyEmailMailable().to(data.email).with(data)
}
