/**
 * @gello/auth-templates - Reset Password Mailable
 *
 * Mailable for sending password reset emails.
 */

import { Effect } from "effect"
import { BaseMailable, type Content, type Mailable } from "@gello/mail-core"
import type { ResetPasswordProps } from "../templates/ResetPassword.js"

/**
 * Data for reset password mailable
 */
export interface ResetPasswordData {
  userName: string
  email: string
  resetUrl: string
  expiresIn?: string
  appName?: string
  ipAddress?: string
}

/**
 * Mailable for password reset
 */
export class ResetPasswordMailable extends BaseMailable<ResetPasswordData> {
  getSubject(): string {
    const data = this.getData()
    return `Reset your password for ${data.appName ?? "Our App"}`
  }

  getContent(): Effect.Effect<Content, never> {
    const data = this.getData()
    return Effect.succeed({
      subject: this.getSubject(),
      template: {
        name: "auth/reset-password",
        data: {
          userName: data.userName,
          resetUrl: data.resetUrl,
          expiresIn: data.expiresIn ?? "60 minutes",
          appName: data.appName ?? "Our App",
          ipAddress: data.ipAddress,
        } satisfies ResetPasswordProps,
      },
    })
  }
}

/**
 * Create a reset password mailable
 */
export const resetPassword = (data: ResetPasswordData): Mailable<ResetPasswordData> => {
  return new ResetPasswordMailable().to(data.email).with(data)
}
