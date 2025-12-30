/**
 * @gello/auth-templates - Mailables
 *
 * Pre-built auth mailables.
 */

export {
  VerifyEmailMailable,
  verifyEmail,
  type VerifyEmailData,
} from "./VerifyEmailMailable.js"

export {
  ResetPasswordMailable,
  resetPassword,
  type ResetPasswordData,
} from "./ResetPasswordMailable.js"

export {
  WelcomeEmailMailable,
  welcomeEmail,
  type WelcomeEmailData,
} from "./WelcomeEmailMailable.js"

export {
  NewLoginMailable,
  newLogin,
  type NewLoginData,
} from "./NewLoginMailable.js"
