/**
 * @gello/mail-core - Error Types
 *
 * Tagged error types for the mail system.
 */

import { Data } from "effect"
import type { MessageId } from "./types.js"

/**
 * Base mail error
 */
export class MailError extends Data.TaggedError("MailError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * Connection error to mail provider
 */
export class MailConnectionError extends Data.TaggedError("MailConnectionError")<{
  readonly message: string
  readonly provider: string
  readonly cause?: unknown
}> {}

/**
 * Email validation error (invalid address, missing fields, etc.)
 */
export class MailValidationError extends Data.TaggedError("MailValidationError")<{
  readonly message: string
  readonly field: string
  readonly value?: unknown
}> {}

/**
 * Delivery error from provider
 */
export class MailDeliveryError extends Data.TaggedError("MailDeliveryError")<{
  readonly message: string
  readonly messageId: MessageId
  readonly provider: string
  readonly providerError?: string
  readonly statusCode?: number
}> {}

/**
 * Template rendering error
 */
export class TemplateError extends Data.TaggedError("TemplateError")<{
  readonly message: string
  readonly template?: string
  readonly cause?: unknown
}> {}

/**
 * Template not found error
 */
export class TemplateNotFoundError extends Data.TaggedError("TemplateNotFoundError")<{
  readonly message: string
  readonly template: string
}> {}

/**
 * Attachment error (file not found, too large, etc.)
 */
export class AttachmentError extends Data.TaggedError("AttachmentError")<{
  readonly message: string
  readonly filename?: string
  readonly cause?: unknown
}> {}

/**
 * Configuration error
 */
export class MailConfigError extends Data.TaggedError("MailConfigError")<{
  readonly message: string
  readonly field?: string
}> {}

/**
 * Union of all mail-related errors
 */
export type MailSystemError =
  | MailError
  | MailConnectionError
  | MailValidationError
  | MailDeliveryError
  | TemplateError
  | TemplateNotFoundError
  | AttachmentError
  | MailConfigError
