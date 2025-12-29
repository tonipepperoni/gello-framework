/**
 * @gello/mail-core - Domain Types
 *
 * Core domain types for the mail system following DDD principles.
 */

import { Brand, Duration } from "effect"

// =============================================================================
// Branded Types
// =============================================================================

/**
 * Unique identifier for a mail message
 */
export type MessageId = Brand.Branded<string, "MessageId">
export const MessageId = Brand.nominal<MessageId>()

/**
 * Validated email address
 */
export type EmailAddress = Brand.Branded<string, "EmailAddress">
export const EmailAddress = Brand.nominal<EmailAddress>()

// =============================================================================
// Enums & Literals
// =============================================================================

/**
 * Email priority levels
 */
export type MailPriority = "low" | "normal" | "high"

export const MailPriority = {
  LOW: "low" as const,
  NORMAL: "normal" as const,
  HIGH: "high" as const,
}

/**
 * Mail delivery status
 */
export type MailStatus =
  | "pending"
  | "sending"
  | "sent"
  | "delivered"
  | "failed"
  | "bounced"

/**
 * Content type for email body
 */
export type ContentType = "text/plain" | "text/html"

// =============================================================================
// Address Types
// =============================================================================

/**
 * Email address with optional display name
 *
 * @example
 * { email: EmailAddress("john@example.com"), name: "John Doe" }
 */
export interface Address {
  readonly email: EmailAddress
  readonly name?: string
}

/**
 * Create an Address from email string and optional name
 */
export const Address = {
  make: (email: string, name?: string): Address => ({
    email: EmailAddress(email),
    name,
  }),

  /**
   * Format address as string: "Name <email>" or just "email"
   */
  format: (address: Address): string =>
    address.name ? `"${address.name}" <${address.email}>` : address.email,

  /**
   * Parse string like "Name <email>" into Address
   */
  parse: (str: string): Address | null => {
    const match = str.match(/^(?:"?([^"]*)"?\s)?<?([^>]+@[^>]+)>?$/)
    if (!match) return null
    return Address.make(match[2].trim(), match[1]?.trim())
  },
}

// =============================================================================
// Attachment Types
// =============================================================================

/**
 * Attachment options
 */
export interface AttachmentOptions {
  readonly filename?: string
  readonly contentType?: string
  readonly contentId?: string // For inline attachments (cid:)
  readonly encoding?: "base64" | "binary" | "utf8"
}

/**
 * File-based attachment (path on filesystem)
 */
export interface FileAttachment {
  readonly _tag: "FileAttachment"
  readonly path: string
  readonly options: AttachmentOptions
}

/**
 * Data-based attachment (buffer or string content)
 */
export interface DataAttachment {
  readonly _tag: "DataAttachment"
  readonly content: Buffer | Uint8Array | string
  readonly filename: string
  readonly options: AttachmentOptions
}

/**
 * URL-based attachment (fetched at send time)
 */
export interface UrlAttachment {
  readonly _tag: "UrlAttachment"
  readonly url: string
  readonly options: AttachmentOptions
}

/**
 * Union type for all attachment variants
 */
export type Attachment = FileAttachment | DataAttachment | UrlAttachment

/**
 * Attachment constructors
 */
export const Attachment = {
  fromFile: (path: string, options: AttachmentOptions = {}): FileAttachment => ({
    _tag: "FileAttachment",
    path,
    options,
  }),

  fromData: (
    content: Buffer | Uint8Array | string,
    filename: string,
    options: AttachmentOptions = {}
  ): DataAttachment => ({
    _tag: "DataAttachment",
    content,
    filename,
    options,
  }),

  fromUrl: (url: string, options: AttachmentOptions = {}): UrlAttachment => ({
    _tag: "UrlAttachment",
    url,
    options,
  }),
}

// =============================================================================
// Envelope & Content
// =============================================================================

/**
 * Email envelope (addressing information)
 */
export interface Envelope {
  readonly from: Address
  readonly to: ReadonlyArray<Address>
  readonly cc?: ReadonlyArray<Address>
  readonly bcc?: ReadonlyArray<Address>
  readonly replyTo?: Address
}

/**
 * Template reference for content rendering
 */
export interface TemplateRef {
  readonly name: string
  readonly data: Record<string, unknown>
}

/**
 * Email content (subject + body)
 */
export interface Content {
  readonly subject: string
  readonly text?: string
  readonly html?: string
  readonly template?: TemplateRef
}

// =============================================================================
// Message
// =============================================================================

/**
 * Complete email message ready for sending
 */
export interface Message {
  readonly id: MessageId
  readonly envelope: Envelope
  readonly content: Content
  readonly attachments: ReadonlyArray<Attachment>
  readonly headers: ReadonlyMap<string, string>
  readonly priority: MailPriority
  readonly tags?: ReadonlyArray<string>
  readonly metadata?: Record<string, unknown>
  readonly createdAt: Date
}

/**
 * Message factory helpers
 */
export const Message = {
  /**
   * Generate a new MessageId
   */
  generateId: (): MessageId => MessageId(crypto.randomUUID()),

  /**
   * Create a new message with defaults
   */
  make: (
    envelope: Envelope,
    content: Content,
    options?: Partial<Omit<Message, "id" | "envelope" | "content" | "createdAt">>
  ): Message => ({
    id: Message.generateId(),
    envelope,
    content,
    attachments: options?.attachments ?? [],
    headers: options?.headers ?? new Map(),
    priority: options?.priority ?? "normal",
    tags: options?.tags,
    metadata: options?.metadata,
    createdAt: new Date(),
  }),
}

// =============================================================================
// Mail Result
// =============================================================================

/**
 * Result of sending an email
 */
export interface MailResult {
  readonly messageId: MessageId
  readonly status: MailStatus
  readonly provider: string
  readonly sentAt: Date
  readonly providerMessageId?: string
  readonly error?: string
}

// =============================================================================
// Send Options
// =============================================================================

/**
 * Options for sending raw emails
 */
export interface SendRawOptions {
  readonly from?: Address | string
  readonly cc?: ReadonlyArray<Address | string>
  readonly bcc?: ReadonlyArray<Address | string>
  readonly replyTo?: Address | string
  readonly attachments?: ReadonlyArray<Attachment>
  readonly headers?: Record<string, string>
  readonly priority?: MailPriority
  readonly tags?: ReadonlyArray<string>
}

// =============================================================================
// Mailable Configuration
// =============================================================================

/**
 * Configuration for a Mailable class
 */
export interface MailableConfig {
  readonly queue?: string
  readonly delay?: Duration.Duration
  readonly tries?: number
  readonly timeout?: Duration.Duration
}
