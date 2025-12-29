/**
 * @gello/mail-drivers - ArrayDriver
 *
 * Testing driver that stores emails in memory with assertion helpers.
 */

import { Effect, Layer, Ref } from "effect"
import {
  type MailDriver,
  MailDriverTag,
  type Message,
  type MailResult,
  type Address,
  Message as MessageUtils,
  Address as AddressUtils,
  MailError,
} from "@gello/mail-core"

// =============================================================================
// Array Driver State
// =============================================================================

interface ArrayDriverState {
  readonly sent: Message[]
}

// =============================================================================
// Array Driver Interface
// =============================================================================

/**
 * Extended driver interface with test assertion helpers
 */
export interface ArrayDriver extends MailDriver {
  /**
   * Get all sent messages
   */
  getSent(): Effect.Effect<ReadonlyArray<Message>>

  /**
   * Get the last sent message
   */
  getLastSent(): Effect.Effect<Message | undefined>

  /**
   * Clear all sent messages
   */
  clear(): Effect.Effect<void>

  /**
   * Assert that a specific number of emails were sent
   */
  assertSentCount(count: number): Effect.Effect<void, MailError>

  /**
   * Assert that an email was sent to a specific address
   */
  assertSentTo(email: string): Effect.Effect<void, MailError>

  /**
   * Assert that an email was sent with a specific subject
   */
  assertSentWithSubject(subject: string): Effect.Effect<void, MailError>

  /**
   * Assert that no emails were sent
   */
  assertNothingSent(): Effect.Effect<void, MailError>

  /**
   * Find messages matching a predicate
   */
  findMessages(
    predicate: (message: Message) => boolean
  ): Effect.Effect<ReadonlyArray<Message>>
}

// =============================================================================
// Array Driver Factory
// =============================================================================

/**
 * Create an ArrayDriver instance for testing
 *
 * @example
 * ```typescript
 * const testDriver = yield* makeArrayDriver()
 *
 * // ... send emails ...
 *
 * yield* testDriver.assertSentCount(1)
 * yield* testDriver.assertSentTo("user@example.com")
 *
 * const sent = yield* testDriver.getSent()
 * expect(sent[0].content.subject).toBe("Welcome!")
 * ```
 */
export const makeArrayDriver = Effect.gen(function* () {
  const stateRef = yield* Ref.make<ArrayDriverState>({ sent: [] })

  const driver: ArrayDriver = {
    name: "array",

    send: (message: Message) =>
      Effect.gen(function* () {
        yield* Ref.update(stateRef, (state) => ({
          sent: [...state.sent, message],
        }))

        const result: MailResult = {
          messageId: message.id,
          status: "sent",
          provider: "array",
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

        const message = MessageUtils.make(
          envelope,
          { subject, ...contentObj },
          {
            attachments: options?.attachments,
            priority: options?.priority,
            tags: options?.tags,
          }
        )

        return yield* driver.send(message)
      }),

    verify: () => Effect.succeed(true),

    getSent: () =>
      Ref.get(stateRef).pipe(Effect.map((state) => state.sent)),

    getLastSent: () =>
      Ref.get(stateRef).pipe(
        Effect.map((state) =>
          state.sent.length > 0 ? state.sent[state.sent.length - 1] : undefined
        )
      ),

    clear: () => Ref.set(stateRef, { sent: [] }),

    assertSentCount: (count: number) =>
      Effect.gen(function* () {
        const state = yield* Ref.get(stateRef)
        if (state.sent.length !== count) {
          return yield* Effect.fail(
            new MailError({
              message: `Expected ${count} email(s) to be sent, but got ${state.sent.length}`,
            })
          )
        }
      }),

    assertSentTo: (email: string) =>
      Effect.gen(function* () {
        const state = yield* Ref.get(stateRef)
        const found = state.sent.some((m) =>
          m.envelope.to.some((a) => String(a.email) === email)
        )
        if (!found) {
          return yield* Effect.fail(
            new MailError({
              message: `Expected an email to be sent to "${email}", but none was found`,
            })
          )
        }
      }),

    assertSentWithSubject: (subject: string) =>
      Effect.gen(function* () {
        const state = yield* Ref.get(stateRef)
        const found = state.sent.some((m) => m.content.subject === subject)
        if (!found) {
          return yield* Effect.fail(
            new MailError({
              message: `Expected an email with subject "${subject}", but none was found`,
            })
          )
        }
      }),

    assertNothingSent: () =>
      Effect.gen(function* () {
        const state = yield* Ref.get(stateRef)
        if (state.sent.length > 0) {
          return yield* Effect.fail(
            new MailError({
              message: `Expected no emails to be sent, but ${state.sent.length} were sent`,
            })
          )
        }
      }),

    findMessages: (predicate) =>
      Ref.get(stateRef).pipe(
        Effect.map((state) => state.sent.filter(predicate))
      ),
  }

  return driver
})

// =============================================================================
// Helpers
// =============================================================================

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
 * Live layer for Array driver (creates new instance)
 *
 * Note: For testing, prefer using `makeArrayDriver` directly
 * to get access to assertion methods.
 */
export const ArrayDriverLive = Layer.effect(
  MailDriverTag,
  makeArrayDriver.pipe(Effect.map((d) => d as MailDriver))
)
