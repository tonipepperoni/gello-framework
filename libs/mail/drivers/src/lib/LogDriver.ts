/**
 * @gello/mail-drivers - LogDriver
 *
 * Development driver that logs emails to the console instead of sending.
 */

import { Effect, Layer } from "effect"
import {
  type MailDriver,
  MailDriverTag,
  type Message,
  type MailResult,
  type Address,
  Message as MessageUtils,
  Address as AddressUtils,
} from "@gello/mail-core"

// =============================================================================
// Log Driver Implementation
// =============================================================================

/**
 * Log driver that outputs emails to console
 *
 * @example
 * ```typescript
 * const MainLayer = pipe(
 *   MailServiceLive,
 *   Layer.provide(LogDriverLive)
 * )
 * ```
 */
const makeLogDriver = (): MailDriver => ({
  name: "log",

  send: (message: Message) =>
    Effect.gen(function* () {
      const divider = "=".repeat(60)
      const subDivider = "-".repeat(60)

      yield* Effect.log(divider)
      yield* Effect.log("📧 MAIL LOG")
      yield* Effect.log(divider)
      yield* Effect.log(`Message ID: ${message.id}`)
      yield* Effect.log(`From: ${formatAddress(message.envelope.from)}`)
      yield* Effect.log(
        `To: ${message.envelope.to.map(formatAddress).join(", ")}`
      )

      if (message.envelope.cc?.length) {
        yield* Effect.log(
          `Cc: ${message.envelope.cc.map(formatAddress).join(", ")}`
        )
      }

      if (message.envelope.bcc?.length) {
        yield* Effect.log(
          `Bcc: ${message.envelope.bcc.map(formatAddress).join(", ")}`
        )
      }

      if (message.envelope.replyTo) {
        yield* Effect.log(`Reply-To: ${formatAddress(message.envelope.replyTo)}`)
      }

      yield* Effect.log(`Subject: ${message.content.subject}`)
      yield* Effect.log(`Priority: ${message.priority}`)

      if (message.tags?.length) {
        yield* Effect.log(`Tags: ${message.tags.join(", ")}`)
      }

      if (message.attachments.length > 0) {
        yield* Effect.log(`Attachments: ${message.attachments.length} file(s)`)
        for (const attachment of message.attachments) {
          switch (attachment._tag) {
            case "FileAttachment":
              yield* Effect.log(`  - File: ${attachment.path}`)
              break
            case "DataAttachment":
              yield* Effect.log(`  - Data: ${attachment.filename}`)
              break
            case "UrlAttachment":
              yield* Effect.log(`  - URL: ${attachment.url}`)
              break
          }
        }
      }

      yield* Effect.log(subDivider)

      if (message.content.text) {
        yield* Effect.log("TEXT CONTENT:")
        yield* Effect.log(message.content.text)
      }

      if (message.content.html) {
        yield* Effect.log("HTML CONTENT:")
        yield* Effect.log(truncate(message.content.html, 500))
      }

      if (message.content.template) {
        yield* Effect.log(`TEMPLATE: ${message.content.template.name}`)
        yield* Effect.log(
          `DATA: ${JSON.stringify(message.content.template.data, null, 2)}`
        )
      }

      yield* Effect.log(divider)

      const result: MailResult = {
        messageId: message.id,
        status: "sent",
        provider: "log",
        sentAt: new Date(),
      }

      return result
    }),

  sendRaw: (to, subject, content, options) =>
    Effect.gen(function* () {
      const toAddresses = normalizeAddresses(to)
      const envelope = {
        from: options?.from
          ? normalizeAddress(options.from)
          : AddressUtils.make("noreply@example.com"),
        to: toAddresses,
        cc: options?.cc ? normalizeAddresses(options.cc) : undefined,
        bcc: options?.bcc ? normalizeAddresses(options.bcc) : undefined,
        replyTo: options?.replyTo
          ? normalizeAddress(options.replyTo)
          : undefined,
      }

      const contentObj =
        typeof content === "string" ? { text: content } : content

      const message = MessageUtils.make(envelope, { subject, ...contentObj }, {
        attachments: options?.attachments,
        priority: options?.priority,
        tags: options?.tags,
      })

      return yield* makeLogDriver().send(message)
    }),

  verify: () => Effect.succeed(true),
})

// =============================================================================
// Helpers
// =============================================================================

function formatAddress(addr: Address): string {
  return addr.name ? `"${addr.name}" <${addr.email}>` : String(addr.email)
}

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength) + "... [truncated]"
}

function normalizeAddress(addr: Address | string): Address {
  if (typeof addr === "string") {
    return AddressUtils.parse(addr) ?? AddressUtils.make(addr)
  }
  return addr
}

function normalizeAddresses(
  input: Address | string | ReadonlyArray<Address | string>
): Address[] {
  const arr = Array.isArray(input) ? input : [input]
  return arr.map(normalizeAddress)
}

// =============================================================================
// Layer
// =============================================================================

/**
 * Live layer for Log driver
 */
export const LogDriverLive = Layer.succeed(MailDriverTag, makeLogDriver())
