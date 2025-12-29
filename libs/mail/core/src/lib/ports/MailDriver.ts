/**
 * @gello/mail-core - MailDriver Port
 *
 * Port interface for mail transport implementations.
 */

import { Context, Effect } from "effect"
import type { Address, MailResult, Message, SendRawOptions } from "../domain/types.js"
import type { MailConnectionError, MailDeliveryError, MailError } from "../domain/errors.js"

// =============================================================================
// MailDriver Interface
// =============================================================================

/**
 * Port interface for mail drivers.
 *
 * Implementations include:
 * - SmtpDriver: Standard SMTP via nodemailer
 * - SesDriver: AWS Simple Email Service
 * - MailgunDriver: Mailgun API
 * - PostmarkDriver: Postmark API
 * - ResendDriver: Resend API
 * - LogDriver: Console logging (development)
 * - ArrayDriver: In-memory storage (testing)
 */
export interface MailDriver {
  /**
   * Driver name identifier
   */
  readonly name: string

  /**
   * Send a complete message
   */
  send(
    message: Message
  ): Effect.Effect<MailResult, MailError | MailDeliveryError>

  /**
   * Send a raw email (bypassing Mailable)
   */
  sendRaw(
    to: Address | ReadonlyArray<Address>,
    subject: string,
    content: string | { text?: string; html?: string },
    options?: SendRawOptions
  ): Effect.Effect<MailResult, MailError | MailDeliveryError>

  /**
   * Verify driver connection/configuration
   */
  verify(): Effect.Effect<boolean, MailConnectionError>
}

// =============================================================================
// Context Tag
// =============================================================================

/**
 * Context tag for MailDriver dependency injection
 */
export class MailDriverTag extends Context.Tag("@gello/MailDriver")<
  MailDriverTag,
  MailDriver
>() {}
