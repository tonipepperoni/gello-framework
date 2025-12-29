/**
 * @gello/mail-core - Mailable
 *
 * Base class and factory for creating type-safe email definitions.
 */

import { Effect, Schema } from "effect"
import type {
  Address,
  Attachment,
  Content,
  Envelope,
  MailableConfig,
  MailPriority,
  MailResult,
  Message,
} from "./types.js"
import { Address as AddressUtils, Message as MessageUtils } from "./types.js"
import type { MailError, MailValidationError } from "./errors.js"

// =============================================================================
// Mailable Interface
// =============================================================================

/**
 * Interface for a mailable email definition
 */
export interface Mailable<TData = void> {
  /**
   * Build the final message
   */
  build(): Effect.Effect<Message, MailError | MailValidationError>

  /**
   * Set recipient(s)
   */
  to(address: Address | string | ReadonlyArray<Address | string>): Mailable<TData>

  /**
   * Set CC recipient(s)
   */
  cc(address: Address | string | ReadonlyArray<Address | string>): Mailable<TData>

  /**
   * Set BCC recipient(s)
   */
  bcc(address: Address | string | ReadonlyArray<Address | string>): Mailable<TData>

  /**
   * Set sender
   */
  from(address: Address | string, name?: string): Mailable<TData>

  /**
   * Set reply-to address
   */
  replyTo(address: Address | string, name?: string): Mailable<TData>

  /**
   * Set subject
   */
  subject(text: string): Mailable<TData>

  /**
   * Set template data (for typed mailables)
   */
  with(data: TData): Mailable<TData>

  /**
   * Add attachment
   */
  attach(attachment: Attachment): Mailable<TData>

  /**
   * Add header
   */
  header(name: string, value: string): Mailable<TData>

  /**
   * Set priority
   */
  priority(level: MailPriority): Mailable<TData>

  /**
   * Add tag
   */
  tag(tag: string): Mailable<TData>

  /**
   * Add metadata
   */
  metadata(key: string, value: unknown): Mailable<TData>

  /**
   * Hook: Before sending
   */
  beforeSend?(message: Message): Effect.Effect<Message, MailError>

  /**
   * Hook: After sending
   */
  afterSend?(result: MailResult): Effect.Effect<void, MailError>

  /**
   * Hook: On failure
   */
  onFailure?(error: MailError): Effect.Effect<void, never>
}

// =============================================================================
// Mailable Builder State
// =============================================================================

interface MailableState<TData> {
  to: Address[]
  cc: Address[]
  bcc: Address[]
  from?: Address
  replyTo?: Address
  subject?: string
  data?: TData
  attachments: Attachment[]
  headers: Map<string, string>
  priority: MailPriority
  tags: string[]
  metadata: Record<string, unknown>
}

// =============================================================================
// makeMailable Factory
// =============================================================================

/**
 * Configuration for makeMailable factory
 */
export interface MakeMailableOptions<TData> {
  /**
   * Schema for validating the data
   */
  readonly schema?: Schema.Schema<TData, unknown>

  /**
   * Queue configuration for async sending
   */
  readonly config?: MailableConfig
}

/**
 * Abstract base class for creating mailables
 */
export abstract class BaseMailable<TData = void> implements Mailable<TData> {
  protected state: MailableState<TData> = {
    to: [],
    cc: [],
    bcc: [],
    attachments: [],
    headers: new Map(),
    priority: "normal",
    tags: [],
    metadata: {},
  }

  /**
   * Get the email subject (override in subclass)
   */
  abstract getSubject(): string

  /**
   * Get the content (override in subclass)
   */
  abstract getContent(data: TData): Effect.Effect<Content, MailError>

  /**
   * Build the final message
   */
  build(): Effect.Effect<Message, MailError | MailValidationError> {
    return Effect.gen(this, function* () {
      const content = yield* this.getContent(this.state.data as TData)

      const envelope: Envelope = {
        from: this.state.from ?? AddressUtils.make("noreply@example.com"),
        to: this.state.to,
        cc: this.state.cc.length > 0 ? this.state.cc : undefined,
        bcc: this.state.bcc.length > 0 ? this.state.bcc : undefined,
        replyTo: this.state.replyTo,
      }

      return MessageUtils.make(envelope, content, {
        attachments: this.state.attachments,
        headers: this.state.headers,
        priority: this.state.priority,
        tags: this.state.tags.length > 0 ? this.state.tags : undefined,
        metadata:
          Object.keys(this.state.metadata).length > 0
            ? this.state.metadata
            : undefined,
      })
    })
  }

  to(
    address: Address | string | ReadonlyArray<Address | string>
  ): Mailable<TData> {
    const addresses = Array.isArray(address) ? address : [address]
    this.state.to.push(...addresses.map(this.normalizeAddress))
    return this
  }

  cc(
    address: Address | string | ReadonlyArray<Address | string>
  ): Mailable<TData> {
    const addresses = Array.isArray(address) ? address : [address]
    this.state.cc.push(...addresses.map(this.normalizeAddress))
    return this
  }

  bcc(
    address: Address | string | ReadonlyArray<Address | string>
  ): Mailable<TData> {
    const addresses = Array.isArray(address) ? address : [address]
    this.state.bcc.push(...addresses.map(this.normalizeAddress))
    return this
  }

  from(address: Address | string, name?: string): Mailable<TData> {
    this.state.from =
      typeof address === "string"
        ? AddressUtils.make(address, name)
        : address
    return this
  }

  replyTo(address: Address | string, name?: string): Mailable<TData> {
    this.state.replyTo =
      typeof address === "string"
        ? AddressUtils.make(address, name)
        : address
    return this
  }

  subject(text: string): Mailable<TData> {
    this.state.subject = text
    return this
  }

  with(data: TData): Mailable<TData> {
    this.state.data = data
    return this
  }

  attach(attachment: Attachment): Mailable<TData> {
    this.state.attachments.push(attachment)
    return this
  }

  header(name: string, value: string): Mailable<TData> {
    this.state.headers.set(name, value)
    return this
  }

  priority(level: MailPriority): Mailable<TData> {
    this.state.priority = level
    return this
  }

  tag(tag: string): Mailable<TData> {
    this.state.tags.push(tag)
    return this
  }

  metadata(key: string, value: unknown): Mailable<TData> {
    this.state.metadata[key] = value
    return this
  }

  /**
   * Get the template data
   */
  protected getData(): TData {
    return this.state.data as TData
  }

  /**
   * Get subject from state or abstract method
   */
  protected getSubjectText(): string {
    return this.state.subject ?? this.getSubject()
  }

  private normalizeAddress(addr: Address | string): Address {
    if (typeof addr === "string") {
      return AddressUtils.parse(addr) ?? AddressUtils.make(addr)
    }
    return addr
  }
}

// =============================================================================
// Simple Mailable Factory
// =============================================================================

/**
 * Create a simple mailable with just HTML/text content
 */
export function createSimpleMailable(options: {
  subject: string
  html?: string
  text?: string
  template?: { name: string; data?: Record<string, unknown> }
}): Mailable<void> {
  return new (class extends BaseMailable<void> {
    getSubject(): string {
      return options.subject
    }

    getContent(): Effect.Effect<Content, MailError> {
      return Effect.succeed({
        subject: this.getSubjectText(),
        html: options.html,
        text: options.text,
        template: options.template
          ? { name: options.template.name, data: options.template.data ?? {} }
          : undefined,
      })
    }
  })()
}

// =============================================================================
// Template Mailable Factory
// =============================================================================

/**
 * Create a mailable that uses a template
 */
export function createTemplateMailable<TData extends Record<string, unknown>>(
  templateName: string,
  subjectFn: (data: TData) => string
): new () => BaseMailable<TData> {
  return class extends BaseMailable<TData> {
    getSubject(): string {
      const data = this.getData()
      return subjectFn(data)
    }

    getContent(): Effect.Effect<Content, MailError> {
      const data = this.getData()
      return Effect.succeed({
        subject: this.getSubjectText(),
        template: {
          name: templateName,
          data: data as Record<string, unknown>,
        },
      })
    }
  }
}
