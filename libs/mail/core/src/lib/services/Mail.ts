/**
 * @gello/mail-core - Mail Service
 *
 * High-level service for sending emails (Laravel-style facade).
 */

import { Context, Effect, Layer, Option, pipe } from "effect"
import type {
  Address,
  Content,
  Envelope,
  MailResult,
  Message,
  SendRawOptions,
} from "../domain/types.js"
import { Address as AddressUtils, Message as MessageUtils } from "../domain/types.js"
import type { Mailable } from "../domain/mailable.js"
import type {
  MailError,
  MailDeliveryError,
  MailValidationError,
  TemplateError,
  TemplateNotFoundError,
} from "../domain/errors.js"
import { MailDriverTag, type MailDriver } from "../ports/MailDriver.js"
import { TemplateEngineTag } from "../ports/TemplateEngine.js"

// =============================================================================
// Mail Service Interface
// =============================================================================

/**
 * High-level mail service interface
 */
export interface MailService {
  /**
   * Send a mailable immediately
   */
  send<T>(
    mailable: Mailable<T>
  ): Effect.Effect<
    MailResult,
    MailError | MailValidationError | MailDeliveryError | TemplateError | TemplateNotFoundError
  >

  /**
   * Send raw email
   */
  sendRaw(
    to: Address | string | ReadonlyArray<Address | string>,
    subject: string,
    content: string | { text?: string; html?: string },
    options?: SendRawOptions
  ): Effect.Effect<MailResult, MailError | MailDeliveryError>

  /**
   * Get the current driver
   */
  driver(): MailDriver

  /**
   * Use a specific driver for this call
   */
  mailer(driverName: string): MailService
}

// =============================================================================
// Context Tag
// =============================================================================

/**
 * Context tag for Mail service dependency injection
 */
export class MailTag extends Context.Tag("@gello/Mail")<
  MailTag,
  MailService
>() {}

// =============================================================================
// Mail Service Implementation
// =============================================================================

/**
 * Create the Mail service implementation
 */
const makeMailService = Effect.gen(function* () {
  const driver = yield* MailDriverTag
  const templateEngine = yield* Effect.serviceOption(TemplateEngineTag)

  /**
   * Resolve template content if needed
   */
  const resolveContent = (
    content: Content
  ): Effect.Effect<Content, TemplateError | TemplateNotFoundError> => {
    if (!content.template) {
      return Effect.succeed(content)
    }

    return pipe(
      templateEngine,
      Option.match({
        onNone: () =>
          // No template engine, return content as-is
          Effect.succeed(content),
        onSome: (engine) =>
          pipe(
            engine.render(content.template!.name, content.template!.data),
            Effect.map(({ html, text }) => ({
              ...content,
              html: html ?? content.html,
              text: text ?? content.text,
            }))
          ),
      })
    )
  }

  /**
   * Normalize address input to Address array
   */
  const normalizeAddresses = (
    input: Address | string | ReadonlyArray<Address | string>
  ): Address[] => {
    const arr = Array.isArray(input) ? input : [input]
    return arr.map((a) =>
      typeof a === "string"
        ? AddressUtils.parse(a) ?? AddressUtils.make(a)
        : a
    )
  }

  const service: MailService = {
    send: <T>(mailable: Mailable<T>) =>
      Effect.gen(function* () {
        // Build the message
        const message = yield* mailable.build()

        // Resolve template content
        const resolvedContent = yield* resolveContent(message.content)
        const finalMessage: Message = { ...message, content: resolvedContent }

        // Call beforeSend hook if defined
        const messageToSend = mailable.beforeSend
          ? yield* mailable.beforeSend(finalMessage)
          : finalMessage

        // Send via driver
        const result = yield* driver.send(messageToSend)

        // Call afterSend hook if defined
        if (mailable.afterSend) {
          yield* mailable.afterSend(result)
        }

        return result
      }),

    sendRaw: (to, subject, content, options) =>
      Effect.gen(function* () {
        const toAddresses = normalizeAddresses(to)
        const contentObj =
          typeof content === "string" ? { text: content } : content

        // Build minimal envelope
        const envelope: Envelope = {
          from:
            options?.from != null
              ? typeof options.from === "string"
                ? AddressUtils.parse(options.from) ??
                  AddressUtils.make(options.from)
                : options.from
              : AddressUtils.make("noreply@example.com"),
          to: toAddresses,
          cc: options?.cc ? normalizeAddresses(options.cc) : undefined,
          bcc: options?.bcc ? normalizeAddresses(options.bcc) : undefined,
          replyTo:
            options?.replyTo != null
              ? typeof options.replyTo === "string"
                ? AddressUtils.parse(options.replyTo) ??
                  AddressUtils.make(options.replyTo)
                : options.replyTo
              : undefined,
        }

        const message = MessageUtils.make(
          envelope,
          { subject, ...contentObj },
          {
            attachments: options?.attachments,
            headers: options?.headers
              ? new Map(Object.entries(options.headers))
              : undefined,
            priority: options?.priority,
            tags: options?.tags,
          }
        )

        return yield* driver.send(message)
      }),

    driver: () => driver,

    mailer: (_driverName: string) => {
      // TODO: Implement driver switching when we have multiple drivers
      // For now, return the same service
      return service
    },
  }

  return service
})

// =============================================================================
// Layer
// =============================================================================

/**
 * Live layer for Mail service
 */
export const MailServiceLive = Layer.effect(MailTag, makeMailService)
