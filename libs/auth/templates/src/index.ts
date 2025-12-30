/**
 * @gello/auth-templates
 *
 * Pre-built auth email templates and mailables for the Gello auth system.
 */

// Templates
export {
  VerifyEmail,
  type VerifyEmailProps,
  ResetPassword,
  type ResetPasswordProps,
  WelcomeEmail,
  type WelcomeEmailProps,
  NewLogin,
  type NewLoginProps,
  PasswordChanged,
  type PasswordChangedProps,
} from "./lib/templates/index.js"

// Mailables
export {
  VerifyEmailMailable,
  verifyEmail,
  type VerifyEmailData,
  ResetPasswordMailable,
  resetPassword,
  type ResetPasswordData,
  WelcomeEmailMailable,
  welcomeEmail,
  type WelcomeEmailData,
  NewLoginMailable,
  newLogin,
  type NewLoginData,
} from "./lib/mailables/index.js"
