/**
 * @gello/auth-templates - New Login Mailable
 *
 * Mailable for sending new login notifications.
 */

import { Effect } from "effect"
import { BaseMailable, type Content, type Mailable } from "@gello/mail-core"
import type { NewLoginProps } from "../templates/NewLogin.js"

/**
 * Data for new login mailable
 */
export interface NewLoginData {
  userName: string
  email: string
  loginTime: string
  ipAddress: string
  location?: string
  device?: string
  browser?: string
  securityUrl: string
  appName?: string
}

/**
 * Mailable for new login notification
 */
export class NewLoginMailable extends BaseMailable<NewLoginData> {
  getSubject(): string {
    const data = this.getData()
    return `New login to your ${data.appName ?? "Our App"} account`
  }

  getContent(): Effect.Effect<Content, never> {
    const data = this.getData()
    return Effect.succeed({
      subject: this.getSubject(),
      template: {
        name: "auth/new-login",
        data: {
          userName: data.userName,
          loginTime: data.loginTime,
          ipAddress: data.ipAddress,
          location: data.location,
          device: data.device,
          browser: data.browser,
          securityUrl: data.securityUrl,
          appName: data.appName ?? "Our App",
        } satisfies NewLoginProps,
      },
    })
  }
}

/**
 * Create a new login mailable
 */
export const newLogin = (data: NewLoginData): Mailable<NewLoginData> => {
  return new NewLoginMailable().to(data.email).with(data)
}
