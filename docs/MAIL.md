# Mail System PRD

> A Laravel 4.2-inspired mail system built on Effect with hexagonal DDD architecture

## Table of Contents

- [Overview](#overview)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
  - [Core Types](#core-types)
  - [Mailable Contract](#mailable-contract)
  - [Address Types](#address-types)
  - [Attachment Types](#attachment-types)
- [Ports (Interfaces)](#ports-interfaces)
  - [MailDriver Port](#maildriver-port)
  - [MailTransport Port](#mailtransport-port)
- [Adapters (Drivers)](#adapters-drivers)
  - [SMTP Driver](#smtp-driver)
  - [SES Driver](#ses-driver)
  - [Mailgun Driver](#mailgun-driver)
  - [Postmark Driver](#postmark-driver)
  - [Resend Driver](#resend-driver)
  - [Log Driver](#log-driver)
  - [Array Driver](#array-driver)
- [Mail Service](#mail-service)
- [Mailable Definitions](#mailable-definitions)
  - [Basic Mailable](#basic-mailable)
  - [Mailable with Attachments](#mailable-with-attachments)
  - [Queued Mailable](#queued-mailable)
- [Templates](#templates)
  - [Template Engine Port](#template-engine-port)
  - [React Email Adapter](#react-email-adapter)
  - [MJML Adapter](#mjml-adapter)
- [Mail Orchestrator App](#mail-orchestrator-app)
- [Testing](#testing)
- [Configuration](#configuration)
- [Implementation Phases](#implementation-phases)
- [NX Library Structure](#nx-library-structure)
- [API Reference](#api-reference)
- [References](#references)

---

## Overview

The Gello mail system provides a unified API for sending emails through various providers. Inspired by Laravel 4.2's elegant Mail facade, it leverages Effect's functional paradigm for type-safe, composable email sending with support for templates, attachments, and queueing.

### Goals

1. **Laravel-familiar API** — Developers coming from Laravel should feel at home
2. **Effect-native** — Built entirely on Effect primitives (Effect, Layer, Context)
3. **Hexagonal Architecture** — Ports define contracts, adapters implement drivers
4. **Type-safe Mailables** — Schema-validated email content with compile-time guarantees
5. **Multiple Drivers** — SMTP, SES, Mailgun, Postmark, Resend out of the box
6. **Template Support** — React Email, MJML, or plain HTML templates
7. **Queue Integration** — Seamless integration with @gello/queue for async sending
8. **Observable** — Metrics, logging, and delivery tracking

### Non-Goals

- Marketing automation (use dedicated solutions like Mailchimp)
- Complex email workflows (use dedicated solutions)
- Email receiving/inbox management
- Newsletter management

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                           │
├─────────────────────────────────────────────────────────────────────┤
│  Send Mail             │  Define Mailables      │  Mail Events      │
│  Mail.send(mailable)   │  class WelcomeEmail    │  onSent()         │
│  Mail.queue(mailable)  │  implements Mailable   │  onFailed()       │
│  Mail.later(delay)     │                        │                   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          DOMAIN LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│  Message               │  Address               │  Attachment       │
│  Mailable              │  Envelope              │  Content          │
│  MailResult            │  Headers               │  Template         │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           PORT LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│  MailDriver (Port)     │  TemplateEngine (Port) │  MailLogger       │
│  - send()              │  - render()            │  - logSent()      │
│  - sendRaw()           │  - compile()           │  - logFailed()    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         ADAPTER LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│  SmtpDriver            │  SesDriver             │  MailgunDriver    │
│  PostmarkDriver        │  ResendDriver          │  LogDriver        │
│  ArrayDriver           │  ReactEmailEngine      │  MjmlEngine       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Domain Model

### Core Types

```typescript
import { Brand, Duration } from "effect"

// Message identifier
type MessageId = Brand.Branded<string, "MessageId">

// Email address (validated)
type EmailAddress = Brand.Branded<string, "EmailAddress">

// Mail priority
type MailPriority = "low" | "normal" | "high"

// Mail status
type MailStatus =
  | "pending"     // Queued for sending
  | "sending"     // Currently being sent
  | "sent"        // Successfully delivered to provider
  | "delivered"   // Confirmed delivery (if tracking available)
  | "failed"      // Failed to send
  | "bounced"     // Bounced back

// Content type
type ContentType = "text/plain" | "text/html"

// Mail result
interface MailResult {
  readonly messageId: MessageId
  readonly status: MailStatus
  readonly provider: string
  readonly sentAt: Date
  readonly providerMessageId?: string
  readonly error?: string
}

// Mail envelope
interface Envelope {
  readonly from: Address
  readonly to: ReadonlyArray<Address>
  readonly cc?: ReadonlyArray<Address>
  readonly bcc?: ReadonlyArray<Address>
  readonly replyTo?: Address
}

// Mail content
interface Content {
  readonly subject: string
  readonly text?: string
  readonly html?: string
  readonly template?: {
    readonly name: string
    readonly data: Record<string, unknown>
  }
}

// Complete message
interface Message {
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
```

### Mailable Contract

```typescript
// Base mailable interface (Laravel-style)
interface Mailable<T = void> {
  readonly subject: string

  // Recipients
  to(address: Address | string): Mailable<T>
  cc(address: Address | string): Mailable<T>
  bcc(address: Address | string): Mailable<T>
  replyTo(address: Address | string): Mailable<T>
  from(address: Address | string): Mailable<T>

  // Content
  view(template: string, data?: Record<string, unknown>): Mailable<T>
  text(content: string): Mailable<T>
  html(content: string): Mailable<T>

  // Attachments
  attach(path: string, options?: AttachOptions): Mailable<T>
  attachData(data: Buffer | string, name: string, options?: AttachOptions): Mailable<T>

  // Headers & metadata
  withHeaders(headers: Record<string, string>): Mailable<T>
  tag(tag: string): Mailable<T>
  metadata(key: string, value: unknown): Mailable<T>
  priority(level: MailPriority): Mailable<T>

  // Build the message
  build(): Effect.Effect<Message, MailError>
}

// Schema-validated mailable
interface SchemaMailable<T, E = never, R = never> extends Mailable<T> {
  readonly schema: Schema.Schema<T>

  // Type-safe data binding
  with(data: T): Mailable<T>

  // Optional hooks
  beforeSend?(message: Message): Effect.Effect<Message, E, R>
  afterSend?(result: MailResult): Effect.Effect<void, E, R>
  onFailure?(error: MailError): Effect.Effect<void, never, R>
}
```

### Address Types

```typescript
// Email address with optional name
interface Address {
  readonly email: EmailAddress
  readonly name?: string
}

// Address factory
const Address = {
  make: (email: string, name?: string): Effect.Effect<Address, ValidationError> =>
    Effect.gen(function* () {
      const validated = yield* validateEmail(email)
      return { email: validated, name }
    }),

  fromString: (str: string): Effect.Effect<Address, ValidationError> =>
    // Parse "Name <email@example.com>" format
    Effect.gen(function* () {
      const match = str.match(/^(?:"?([^"]*)"?\s)?<?([^>]+@[^>]+)>?$/)
      if (!match) {
        return yield* Effect.fail(new ValidationError({ message: "Invalid address format" }))
      }
      return yield* Address.make(match[2], match[1])
    }),
}
```

### Attachment Types

```typescript
// Attachment options
interface AttachOptions {
  readonly filename?: string
  readonly contentType?: string
  readonly contentId?: string  // For inline attachments
  readonly encoding?: "base64" | "binary" | "utf8"
}

// Attachment types
type Attachment =
  | FileAttachment
  | DataAttachment
  | UrlAttachment

interface FileAttachment {
  readonly _tag: "FileAttachment"
  readonly path: string
  readonly options: AttachOptions
}

interface DataAttachment {
  readonly _tag: "DataAttachment"
  readonly content: Buffer | string
  readonly filename: string
  readonly options: AttachOptions
}

interface UrlAttachment {
  readonly _tag: "UrlAttachment"
  readonly url: string
  readonly options: AttachOptions
}
```

---

## Ports (Interfaces)

### MailDriver Port

```typescript
interface MailDriver {
  /**
   * Send a message
   */
  send(message: Message): Effect.Effect<MailResult, MailError>

  /**
   * Send raw content (bypass mailable)
   */
  sendRaw(
    to: Address | ReadonlyArray<Address>,
    subject: string,
    content: string | { text?: string; html?: string },
    options?: SendRawOptions
  ): Effect.Effect<MailResult, MailError>

  /**
   * Check driver health/connectivity
   */
  verify(): Effect.Effect<boolean, MailError>

  /**
   * Get driver name
   */
  readonly name: string
}

// Context tag
class MailDriverTag extends Context.Tag("@gello/MailDriver")<
  MailDriverTag,
  MailDriver
>() {}

// Errors
class MailError extends Data.TaggedError("MailError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

class MailConnectionError extends Data.TaggedError("MailConnectionError")<{
  readonly message: string
  readonly provider: string
}> {}

class MailValidationError extends Data.TaggedError("MailValidationError")<{
  readonly message: string
  readonly field: string
}> {}

class MailDeliveryError extends Data.TaggedError("MailDeliveryError")<{
  readonly message: string
  readonly messageId: MessageId
  readonly provider: string
  readonly providerError?: string
}> {}
```

### TemplateEngine Port

```typescript
interface TemplateEngine {
  /**
   * Render a template with data
   */
  render(
    template: string,
    data: Record<string, unknown>
  ): Effect.Effect<{ html: string; text?: string }, TemplateError>

  /**
   * Compile a template for reuse
   */
  compile(template: string): Effect.Effect<CompiledTemplate, TemplateError>

  /**
   * Check if template exists
   */
  exists(template: string): Effect.Effect<boolean, TemplateError>
}

interface CompiledTemplate {
  render(data: Record<string, unknown>): Effect.Effect<{ html: string; text?: string }, TemplateError>
}

class TemplateEngineTag extends Context.Tag("@gello/TemplateEngine")<
  TemplateEngineTag,
  TemplateEngine
>() {}
```

---

## Adapters (Drivers)

### SMTP Driver

```typescript
interface SmtpConfig {
  readonly host: string
  readonly port: number
  readonly secure?: boolean  // TLS
  readonly auth?: {
    readonly user: string
    readonly pass: string
  }
  readonly pool?: boolean
  readonly maxConnections?: number
  readonly timeout?: Duration.Duration
}

const SmtpDriverLive = (config: SmtpConfig) =>
  Layer.scoped(
    MailDriverTag,
    Effect.gen(function* () {
      const transporter = yield* makeNodemailerTransport(config)

      return {
        name: "smtp",

        send: (message) =>
          Effect.gen(function* () {
            const mailOptions = yield* messageToNodemailer(message)
            const result = yield* Effect.tryPromise({
              try: () => transporter.sendMail(mailOptions),
              catch: (e) => new MailDeliveryError({
                message: String(e),
                messageId: message.id,
                provider: "smtp",
              }),
            })

            return {
              messageId: message.id,
              status: "sent" as const,
              provider: "smtp",
              sentAt: new Date(),
              providerMessageId: result.messageId,
            }
          }),

        sendRaw: (to, subject, content, options) =>
          Effect.gen(function* () {
            // Build minimal message and send
          }),

        verify: () =>
          Effect.tryPromise({
            try: () => transporter.verify(),
            catch: () => new MailConnectionError({
              message: "SMTP connection failed",
              provider: "smtp",
            }),
          }),
      }
    })
  )
```

### SES Driver

```typescript
interface SesConfig {
  readonly region: string
  readonly credentials?: {
    readonly accessKeyId: string
    readonly secretAccessKey: string
  }
  readonly configurationSetName?: string
}

const SesDriverLive = (config: SesConfig) =>
  Layer.scoped(
    MailDriverTag,
    Effect.gen(function* () {
      const client = yield* makeSesClient(config)

      return {
        name: "ses",

        send: (message) =>
          Effect.gen(function* () {
            const command = yield* messageToSesCommand(message)
            const result = yield* Effect.tryPromise({
              try: () => client.send(command),
              catch: (e) => new MailDeliveryError({
                message: String(e),
                messageId: message.id,
                provider: "ses",
              }),
            })

            return {
              messageId: message.id,
              status: "sent" as const,
              provider: "ses",
              sentAt: new Date(),
              providerMessageId: result.MessageId,
            }
          }),

        sendRaw: (to, subject, content, options) => /* ... */,
        verify: () => /* ... */,
      }
    })
  )
```

### Mailgun Driver

```typescript
interface MailgunConfig {
  readonly apiKey: string
  readonly domain: string
  readonly region?: "us" | "eu"
  readonly testMode?: boolean
}

const MailgunDriverLive = (config: MailgunConfig) =>
  Layer.scoped(
    MailDriverTag,
    Effect.gen(function* () {
      const baseUrl = config.region === "eu"
        ? "https://api.eu.mailgun.net/v3"
        : "https://api.mailgun.net/v3"

      return {
        name: "mailgun",

        send: (message) =>
          Effect.gen(function* () {
            const formData = yield* messageToMailgunForm(message)

            const response = yield* Effect.tryPromise({
              try: () => fetch(`${baseUrl}/${config.domain}/messages`, {
                method: "POST",
                headers: {
                  Authorization: `Basic ${btoa(`api:${config.apiKey}`)}`,
                },
                body: formData,
              }),
              catch: (e) => new MailDeliveryError({
                message: String(e),
                messageId: message.id,
                provider: "mailgun",
              }),
            })

            const result = yield* Effect.tryPromise(() => response.json())

            return {
              messageId: message.id,
              status: "sent" as const,
              provider: "mailgun",
              sentAt: new Date(),
              providerMessageId: result.id,
            }
          }),

        sendRaw: (to, subject, content, options) => /* ... */,
        verify: () => /* ... */,
      }
    })
  )
```

### Postmark Driver

```typescript
interface PostmarkConfig {
  readonly serverToken: string
  readonly messageStream?: string
}

const PostmarkDriverLive = (config: PostmarkConfig) =>
  Layer.scoped(
    MailDriverTag,
    Effect.gen(function* () {
      return {
        name: "postmark",

        send: (message) =>
          Effect.gen(function* () {
            const payload = yield* messageToPostmarkPayload(message, config.messageStream)

            const response = yield* Effect.tryPromise({
              try: () => fetch("https://api.postmarkapp.com/email", {
                method: "POST",
                headers: {
                  "X-Postmark-Server-Token": config.serverToken,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              }),
              catch: (e) => new MailDeliveryError({
                message: String(e),
                messageId: message.id,
                provider: "postmark",
              }),
            })

            const result = yield* Effect.tryPromise(() => response.json())

            return {
              messageId: message.id,
              status: "sent" as const,
              provider: "postmark",
              sentAt: new Date(),
              providerMessageId: result.MessageID,
            }
          }),

        sendRaw: (to, subject, content, options) => /* ... */,
        verify: () => /* ... */,
      }
    })
  )
```

### Resend Driver

```typescript
interface ResendConfig {
  readonly apiKey: string
}

const ResendDriverLive = (config: ResendConfig) =>
  Layer.scoped(
    MailDriverTag,
    Effect.gen(function* () {
      return {
        name: "resend",

        send: (message) =>
          Effect.gen(function* () {
            const payload = yield* messageToResendPayload(message)

            const response = yield* Effect.tryPromise({
              try: () => fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${config.apiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              }),
              catch: (e) => new MailDeliveryError({
                message: String(e),
                messageId: message.id,
                provider: "resend",
              }),
            })

            const result = yield* Effect.tryPromise(() => response.json())

            return {
              messageId: message.id,
              status: "sent" as const,
              provider: "resend",
              sentAt: new Date(),
              providerMessageId: result.id,
            }
          }),

        sendRaw: (to, subject, content, options) => /* ... */,
        verify: () => /* ... */,
      }
    })
  )
```

### Log Driver

Development driver that logs emails instead of sending.

```typescript
const LogDriverLive = Layer.succeed(
  MailDriverTag,
  {
    name: "log",

    send: (message) =>
      Effect.gen(function* () {
        yield* Effect.log("=".repeat(60))
        yield* Effect.log("MAIL LOG")
        yield* Effect.log("=".repeat(60))
        yield* Effect.log(`To: ${message.envelope.to.map(a => a.email).join(", ")}`)
        yield* Effect.log(`From: ${message.envelope.from.email}`)
        yield* Effect.log(`Subject: ${message.content.subject}`)
        yield* Effect.log("-".repeat(60))
        yield* Effect.log(message.content.text ?? message.content.html ?? "[No content]")
        yield* Effect.log("=".repeat(60))

        return {
          messageId: message.id,
          status: "sent" as const,
          provider: "log",
          sentAt: new Date(),
        }
      }),

    sendRaw: (to, subject, content, options) =>
      Effect.gen(function* () {
        yield* Effect.log(`[LOG MAIL] To: ${to}, Subject: ${subject}`)
        return {
          messageId: MessageId(crypto.randomUUID()),
          status: "sent" as const,
          provider: "log",
          sentAt: new Date(),
        }
      }),

    verify: () => Effect.succeed(true),
  }
)
```

### Array Driver

Testing driver that stores emails in memory.

```typescript
interface ArrayDriverState {
  readonly sent: Array<Message>
}

const makeArrayDriver = () =>
  Effect.gen(function* () {
    const state = yield* Ref.make<ArrayDriverState>({ sent: [] })

    const driver: MailDriver = {
      name: "array",

      send: (message) =>
        Effect.gen(function* () {
          yield* Ref.update(state, (s) => ({ sent: [...s.sent, message] }))

          return {
            messageId: message.id,
            status: "sent" as const,
            provider: "array",
            sentAt: new Date(),
          }
        }),

      sendRaw: (to, subject, content, options) => /* ... */,
      verify: () => Effect.succeed(true),
    }

    return {
      driver,
      getSent: () => Ref.get(state).pipe(Effect.map((s) => s.sent)),
      clear: () => Ref.set(state, { sent: [] }),
      assertSent: (count: number) =>
        Effect.gen(function* () {
          const sent = yield* Ref.get(state)
          if (sent.sent.length !== count) {
            return yield* Effect.fail(
              new Error(`Expected ${count} emails, got ${sent.sent.length}`)
            )
          }
        }),
      assertSentTo: (email: string) =>
        Effect.gen(function* () {
          const sent = yield* Ref.get(state)
          const found = sent.sent.some((m) =>
            m.envelope.to.some((a) => a.email === email)
          )
          if (!found) {
            return yield* Effect.fail(new Error(`No email sent to ${email}`))
          }
        }),
    }
  })

const ArrayDriverLive = Layer.effect(
  MailDriverTag,
  makeArrayDriver().pipe(Effect.map((a) => a.driver))
)
```

---

## Mail Service

High-level service for sending emails (Laravel-style facade).

```typescript
interface MailService {
  /**
   * Send a mailable immediately
   */
  send<T>(mailable: Mailable<T>): Effect.Effect<MailResult, MailError>

  /**
   * Send raw email
   */
  sendRaw(
    to: Address | string | ReadonlyArray<Address | string>,
    subject: string,
    content: string | { text?: string; html?: string }
  ): Effect.Effect<MailResult, MailError>

  /**
   * Queue a mailable for async sending
   */
  queue<T>(
    mailable: Mailable<T>,
    queue?: QueueName
  ): Effect.Effect<JobId, MailError | QueueError>

  /**
   * Queue a mailable with delay
   */
  later<T>(
    delay: Duration.Duration,
    mailable: Mailable<T>,
    queue?: QueueName
  ): Effect.Effect<JobId, MailError | QueueError>

  /**
   * Get the underlying driver
   */
  driver(): MailDriver

  /**
   * Use a specific driver for this call
   */
  using(driver: MailDriver): MailService
}

class MailTag extends Context.Tag("@gello/Mail")<MailTag, MailService>() {}

// Implementation
const MailServiceLive = Layer.effect(
  MailTag,
  Effect.gen(function* () {
    const driver = yield* MailDriverTag
    const templateEngine = yield* TemplateEngineTag.pipe(Effect.optional)
    const queue = yield* QueueTag.pipe(Effect.optional)

    const resolveContent = (message: Message) =>
      Effect.gen(function* () {
        if (message.content.template && templateEngine) {
          const { html, text } = yield* templateEngine.render(
            message.content.template.name,
            message.content.template.data
          )
          return { ...message.content, html, text }
        }
        return message.content
      })

    return {
      send: (mailable) =>
        Effect.gen(function* () {
          const message = yield* mailable.build()
          const content = yield* resolveContent(message)
          const finalMessage = { ...message, content }

          yield* mailable.beforeSend?.(finalMessage) ?? Effect.void
          const result = yield* driver.send(finalMessage)
          yield* mailable.afterSend?.(result) ?? Effect.void

          return result
        }),

      sendRaw: (to, subject, content) =>
        driver.sendRaw(
          Array.isArray(to) ? to : [to],
          subject,
          content
        ),

      queue: (mailable, queueName) =>
        Effect.gen(function* () {
          if (!queue) {
            return yield* Effect.fail(new MailError({
              message: "Queue service not available",
            }))
          }

          const message = yield* mailable.build()
          return yield* queue.push(SendMailJob, { message }, queueName)
        }),

      later: (delay, mailable, queueName) =>
        Effect.gen(function* () {
          if (!queue) {
            return yield* Effect.fail(new MailError({
              message: "Queue service not available",
            }))
          }

          const message = yield* mailable.build()
          return yield* queue.later(delay, SendMailJob, { message }, queueName)
        }),

      driver: () => driver,

      using: (customDriver) => ({
        send: (mailable) => /* use customDriver */,
        sendRaw: (to, subject, content) => customDriver.sendRaw(to, subject, content),
        queue: (mailable, queueName) => /* ... */,
        later: (delay, mailable, queueName) => /* ... */,
        driver: () => customDriver,
        using: (d) => /* ... */,
      }),
    }
  })
)

// Usage
const program = Effect.gen(function* () {
  const mail = yield* MailTag

  // Send immediately
  yield* mail.send(
    new WelcomeEmail()
      .to("user@example.com")
      .with({ name: "John", activationUrl: "https://..." })
  )

  // Send raw
  yield* mail.sendRaw(
    "user@example.com",
    "Quick notification",
    "This is a plain text email"
  )

  // Queue for async sending
  yield* mail.queue(new OrderConfirmationEmail().to(customer.email).with(order))

  // Queue with delay
  yield* mail.later(
    Duration.hours(24),
    new ReminderEmail().to(user.email).with({ userId: user.id })
  )
})
```

---

## Mailable Definitions

### Basic Mailable

```typescript
// mailables/WelcomeEmail.ts
import { Effect, Duration } from "effect"
import * as S from "@effect/schema/Schema"
import { Mailable, makeMailable, Address } from "@gello/mail-core"

const WelcomeEmailData = S.Struct({
  name: S.String,
  activationUrl: S.String,
})

type WelcomeEmailData = S.Schema.Type<typeof WelcomeEmailData>

export class WelcomeEmail extends makeMailable<WelcomeEmailData>({
  schema: WelcomeEmailData,
}) {
  readonly subject = "Welcome to Our Platform!"

  build() {
    return Effect.gen(function* () {
      const data = yield* this.getData()

      return this.createMessage({
        content: {
          subject: this.subject,
          template: {
            name: "emails/welcome",
            data,
          },
        },
      })
    })
  }
}

// Usage
const email = new WelcomeEmail()
  .to("user@example.com")
  .from("noreply@example.com", "My App")
  .with({
    name: "John Doe",
    activationUrl: "https://example.com/activate/abc123",
  })

yield* mail.send(email)
```

### Mailable with Attachments

```typescript
// mailables/InvoiceEmail.ts
export class InvoiceEmail extends makeMailable<InvoiceData>({
  schema: InvoiceData,
}) {
  readonly subject = "Your Invoice"

  build() {
    return Effect.gen(function* () {
      const data = yield* this.getData()
      const storage = yield* StorageTag

      // Get invoice PDF from storage
      const pdfBuffer = yield* storage.get(`invoices/${data.invoiceId}.pdf`)

      return this.createMessage({
        content: {
          subject: `Invoice #${data.invoiceNumber}`,
          template: {
            name: "emails/invoice",
            data,
          },
        },
        attachments: [
          {
            _tag: "DataAttachment",
            content: pdfBuffer,
            filename: `invoice-${data.invoiceNumber}.pdf`,
            options: {
              contentType: "application/pdf",
            },
          },
        ],
      })
    })
  }
}
```

### Queued Mailable

```typescript
// mailables/ReportEmail.ts
export class ReportEmail extends makeMailable<ReportData>({
  schema: ReportData,
  // Queue configuration
  queue: QueueName("emails"),
  delay: Duration.minutes(0),  // Send immediately but async
  tries: 3,
  timeout: Duration.minutes(5),
}) {
  readonly subject = "Your Report is Ready"

  build() {
    return Effect.gen(function* () {
      const data = yield* this.getData()

      return this.createMessage({
        content: {
          subject: this.subject,
          template: {
            name: "emails/report-ready",
            data,
          },
        },
      })
    })
  }

  // Hook: Called after successful send
  afterSend(result: MailResult) {
    return Effect.gen(function* () {
      yield* Effect.log(`Report email sent: ${result.messageId}`)
      // Update report status in database
    })
  }

  // Hook: Called on failure
  onFailure(error: MailError) {
    return Effect.gen(function* () {
      yield* Effect.logError(`Failed to send report email: ${error.message}`)
      // Notify admin or retry logic
    })
  }
}
```

---

## Templates (React Email)

The template system is built on [React Email](https://react.email) with a beginner-friendly configuration layer. You can use pre-built layouts or create custom templates with full React flexibility.

### Template Configuration

Define your email theme and branding in one place:

```typescript
// config/mail-theme.ts
import { defineMailTheme } from "@gello/mail-templates"

export const mailTheme = defineMailTheme({
  // Branding
  brand: {
    name: "My App",
    logo: "https://example.com/logo.png",
    logoWidth: 120,
    website: "https://example.com",
  },

  // Colors
  colors: {
    primary: "#3b82f6",      // Buttons, links
    secondary: "#64748b",    // Secondary text
    background: "#ffffff",   // Email background
    surface: "#f8fafc",      // Card backgrounds
    text: "#1e293b",         // Main text
    muted: "#94a3b8",        // Muted text
    border: "#e2e8f0",       // Borders
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
  },

  // Typography
  fonts: {
    heading: "system-ui, -apple-system, sans-serif",
    body: "system-ui, -apple-system, sans-serif",
    mono: "ui-monospace, monospace",
  },

  // Layout
  layout: {
    maxWidth: 600,
    padding: 24,
    borderRadius: 8,
  },

  // Footer
  footer: {
    company: "My Company Inc.",
    address: "123 Main St, City, Country",
    unsubscribeUrl: "https://example.com/unsubscribe",
    socialLinks: {
      twitter: "https://twitter.com/myapp",
      github: "https://github.com/myapp",
    },
  },
})
```

### Pre-built Layout Components

Use the base layout for consistent emails:

```typescript
// templates/emails/welcome.tsx
import { BaseLayout, Heading, Text, Button, Divider } from "@gello/mail-templates"
import { mailTheme } from "../../config/mail-theme"

interface WelcomeEmailProps {
  name: string
  activationUrl: string
}

export default function WelcomeEmail({ name, activationUrl }: WelcomeEmailProps) {
  return (
    <BaseLayout theme={mailTheme} preview={`Welcome to ${mailTheme.brand.name}!`}>
      <Heading>Welcome, {name}!</Heading>

      <Text>
        Thanks for signing up. We're excited to have you on board.
        Click the button below to activate your account.
      </Text>

      <Button href={activationUrl}>
        Activate Account
      </Button>

      <Divider />

      <Text muted>
        If you didn't create this account, you can safely ignore this email.
      </Text>
    </BaseLayout>
  )
}
```

### Template Components Library

Pre-built components that respect your theme:

```typescript
// Available components from @gello/mail-templates

// Layout
import {
  BaseLayout,      // Full email wrapper with header/footer
  Section,         // Content section with padding
  Card,            // Elevated card container
  Row,             // Horizontal layout
  Column,          // Column in row
  Divider,         // Horizontal divider
  Spacer,          // Vertical spacing
} from "@gello/mail-templates"

// Typography
import {
  Heading,         // h1-h6 headings
  Text,            // Paragraph text (supports: muted, small, center)
  Link,            // Styled link
  Code,            // Inline code
  CodeBlock,       // Code block
} from "@gello/mail-templates"

// Actions
import {
  Button,          // Primary CTA button
  ButtonGroup,     // Multiple buttons
  TextButton,      // Text-style link button
} from "@gello/mail-templates"

// Data Display
import {
  Table,           // Data table
  List,            // Bullet/numbered list
  KeyValue,        // Key-value pairs (for order details, etc.)
  Badge,           // Status badge
  Alert,           // Alert/callout box
} from "@gello/mail-templates"

// Media
import {
  Image,           // Responsive image
  Avatar,          // User avatar
  Icon,            // Simple icon
} from "@gello/mail-templates"
```

### Simple Template Examples

**Order Confirmation:**

```typescript
// templates/emails/order-confirmation.tsx
import {
  BaseLayout,
  Heading,
  Text,
  Card,
  KeyValue,
  Table,
  Button,
  Divider,
  Badge,
} from "@gello/mail-templates"
import { mailTheme } from "../../config/mail-theme"

interface OrderConfirmationProps {
  customerName: string
  orderNumber: string
  items: Array<{ name: string; quantity: number; price: string }>
  total: string
  trackingUrl: string
}

export default function OrderConfirmation({
  customerName,
  orderNumber,
  items,
  total,
  trackingUrl,
}: OrderConfirmationProps) {
  return (
    <BaseLayout theme={mailTheme} preview={`Order #${orderNumber} confirmed`}>
      <Badge color="success">Order Confirmed</Badge>

      <Heading>Thanks for your order, {customerName}!</Heading>

      <Text>
        Your order has been received and is being processed.
      </Text>

      <Card>
        <KeyValue
          items={[
            { label: "Order Number", value: orderNumber },
            { label: "Status", value: "Processing" },
          ]}
        />
      </Card>

      <Heading as="h2">Order Summary</Heading>

      <Table
        data={items}
        columns={[
          { header: "Item", accessor: "name" },
          { header: "Qty", accessor: "quantity" },
          { header: "Price", accessor: "price" },
        ]}
        footer={[
          { label: "Total", value: total, bold: true },
        ]}
      />

      <Button href={trackingUrl}>Track Order</Button>

      <Divider />

      <Text muted small>
        Questions? Reply to this email or contact support.
      </Text>
    </BaseLayout>
  )
}
```

**Password Reset:**

```typescript
// templates/emails/password-reset.tsx
import { BaseLayout, Heading, Text, Button, Alert, Code } from "@gello/mail-templates"
import { mailTheme } from "../../config/mail-theme"

interface PasswordResetProps {
  name: string
  resetUrl: string
  resetCode: string
  expiresIn: string
}

export default function PasswordReset({
  name,
  resetUrl,
  resetCode,
  expiresIn,
}: PasswordResetProps) {
  return (
    <BaseLayout theme={mailTheme} preview="Reset your password">
      <Heading>Reset Your Password</Heading>

      <Text>Hi {name},</Text>

      <Text>
        We received a request to reset your password. Click the button below
        to choose a new password.
      </Text>

      <Button href={resetUrl}>Reset Password</Button>

      <Text muted small>
        Or use this code: <Code>{resetCode}</Code>
      </Text>

      <Alert type="warning">
        This link expires in {expiresIn}. If you didn't request this,
        you can safely ignore this email.
      </Alert>
    </BaseLayout>
  )
}
```

### Quick Email Builder (No Template Files)

For simple emails, skip template files entirely:

```typescript
import { QuickEmail } from "@gello/mail-templates"
import { mailTheme } from "./config/mail-theme"

// Build email inline
const email = QuickEmail.create(mailTheme)
  .to("user@example.com")
  .subject("Your report is ready")
  .heading("Report Generated")
  .text("Your monthly report has been generated and is ready for download.")
  .button("Download Report", "https://example.com/report.pdf")
  .divider()
  .text("This report was generated automatically.", { muted: true, small: true })
  .build()

yield* mail.send(email)
```

### Template Engine Implementation

```typescript
// @gello/mail-templates internals

interface ReactEmailConfig {
  readonly templatesDir: string
  readonly theme?: MailTheme
  readonly defaultLocale?: string
}

const ReactEmailEngineLive = (config: ReactEmailConfig) =>
  Layer.effect(
    TemplateEngineTag,
    Effect.gen(function* () {
      const themeContext = config.theme ?? defaultTheme

      return {
        render: (template, data) =>
          Effect.gen(function* () {
            const templatePath = `${config.templatesDir}/${template}.tsx`
            const templateModule = yield* Effect.tryPromise({
              try: () => import(templatePath),
              catch: () => new TemplateError({ message: `Template not found: ${template}` }),
            })

            const Component = templateModule.default
            const html = yield* Effect.tryPromise({
              try: () => render(
                <ThemeProvider theme={themeContext}>
                  <Component {...data} />
                </ThemeProvider>
              ),
              catch: (e) => new TemplateError({ message: `Render error: ${e}` }),
            })

            // Auto-generate plain text version
            const text = htmlToText(html, {
              wordwrap: 80,
              selectors: [
                { selector: "a", options: { hideLinkHrefIfSameAsText: true } },
                { selector: "img", format: "skip" },
              ],
            })

            return { html, text }
          }),

        compile: (template) =>
          Effect.gen(function* () {
            const templatePath = `${config.templatesDir}/${template}.tsx`
            const templateModule = yield* Effect.tryPromise({
              try: () => import(templatePath),
              catch: () => new TemplateError({ message: `Template not found: ${template}` }),
            })

            return {
              render: (data) =>
                Effect.tryPromise({
                  try: () => render(
                    <ThemeProvider theme={themeContext}>
                      <templateModule.default {...data} />
                    </ThemeProvider>
                  ),
                  catch: (e) => new TemplateError({ message: `Render error: ${e}` }),
                }).pipe(
                  Effect.map((html) => ({
                    html,
                    text: htmlToText(html),
                  }))
                ),
            }
          }),

        exists: (template) =>
          Effect.tryPromise({
            try: async () => {
              const templatePath = `${config.templatesDir}/${template}.tsx`
              await import(templatePath)
              return true
            },
            catch: () => false,
          }),
      }
    })
  )
```

### Default Templates

The package includes ready-to-use templates:

```typescript
import {
  // Auth templates
  WelcomeEmailTemplate,
  PasswordResetTemplate,
  EmailVerificationTemplate,
  MagicLinkTemplate,

  // Transactional templates
  OrderConfirmationTemplate,
  ShippingNotificationTemplate,
  InvoiceTemplate,
  ReceiptTemplate,

  // Notification templates
  NotificationTemplate,
  AlertTemplate,
  ReminderTemplate,

  // Account templates
  AccountLockedTemplate,
  PasswordChangedTemplate,
  ProfileUpdatedTemplate,
} from "@gello/mail-templates/defaults"

// Use directly
const email = WelcomeEmailTemplate
  .to("user@example.com")
  .with({ name: "John", activationUrl: "https://..." })

yield* mail.send(email)
```

### Preview Server

Preview templates in the browser during development:

```bash
# Start preview server
npx nx serve mail-orchestrator -- preview --port=3001
```

```typescript
// Preview server shows all templates with live reload
// Visit http://localhost:3001 to:
// - Browse all templates
// - See desktop/mobile previews
// - Test with sample data
// - View HTML source
// - Send test emails
```

---

## Mail Orchestrator App

A dedicated NX application for mail-related CLI commands.

### App Structure

```
apps/mail-orchestrator/
├── src/
│   ├── main.ts              # Entry point
│   ├── config.ts            # Mail configuration
│   └── cli/
│       ├── send.ts          # mail:send command
│       ├── preview.ts       # mail:preview command
│       └── test.ts          # mail:test command
├── project.json
└── tsconfig.json
```

### CLI Commands

```typescript
// mail:send - Send a test email
const sendCommand = Command.make(
  "send",
  { to: Options.text("to"), template: Options.text("template") },
  ({ to, template }) =>
    Effect.gen(function* () {
      const mail = yield* MailTag
      const result = yield* mail.sendRaw(to, "Test Email", `Testing ${template}`)
      yield* Effect.log(`Email sent: ${result.messageId}`)
    })
)

// mail:preview - Start preview server
const previewCommand = Command.make(
  "preview",
  { port: Options.integer("port").pipe(Options.withDefault(3001)) },
  ({ port }) =>
    Effect.gen(function* () {
      yield* Effect.log(`Starting mail preview server on port ${port}`)
      // Start React Email preview or similar
    })
)

// mail:test - Test mail configuration
const testCommand = Command.make(
  "test",
  {},
  () =>
    Effect.gen(function* () {
      const driver = yield* MailDriverTag
      const verified = yield* driver.verify()
      if (verified) {
        yield* Effect.log(`✓ Mail driver "${driver.name}" is configured correctly`)
      } else {
        yield* Effect.logError(`✗ Mail driver "${driver.name}" verification failed`)
      }
    })
)
```

---

## Testing

```typescript
import { describe, it, expect } from "vitest"
import { Effect, Layer, pipe } from "effect"
import { makeArrayDriver, MailTag } from "@gello/mail"
import { WelcomeEmail } from "./mailables/WelcomeEmail"

describe("WelcomeEmail", () => {
  it("sends welcome email with correct content", async () => {
    const testDriver = await Effect.runPromise(makeArrayDriver())

    const TestLayer = pipe(
      MailServiceLive,
      Layer.provide(Layer.succeed(MailDriverTag, testDriver.driver))
    )

    await Effect.runPromise(
      Effect.gen(function* () {
        const mail = yield* MailTag

        yield* mail.send(
          new WelcomeEmail()
            .to("test@example.com")
            .with({ name: "Test User", activationUrl: "https://..." })
        )

        yield* testDriver.assertSent(1)
        yield* testDriver.assertSentTo("test@example.com")

        const sent = yield* testDriver.getSent()
        expect(sent[0].content.subject).toBe("Welcome to Our Platform!")
      }).pipe(Effect.provide(TestLayer))
    )
  })

  it("queues email for async sending", async () => {
    const testQueue = createTestQueue()
    const testDriver = await Effect.runPromise(makeArrayDriver())

    const TestLayer = pipe(
      MailServiceLive,
      Layer.provide(Layer.succeed(MailDriverTag, testDriver.driver)),
      Layer.provide(testQueue.layer)
    )

    await Effect.runPromise(
      Effect.gen(function* () {
        const mail = yield* MailTag

        yield* mail.queue(
          new WelcomeEmail()
            .to("test@example.com")
            .with({ name: "Test", activationUrl: "https://..." })
        )

        yield* testQueue.assertJobEnqueued("SendMail")
      }).pipe(Effect.provide(TestLayer))
    )
  })
})
```

---

## Configuration

### Environment Variables

```bash
# Mail driver
MAIL_DRIVER=smtp  # smtp | ses | mailgun | postmark | resend | log | array

# Default from address
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME="My Application"

# SMTP configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASSWORD=secret
SMTP_SECURE=true

# AWS SES configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
SES_CONFIGURATION_SET=

# Mailgun configuration
MAILGUN_API_KEY=
MAILGUN_DOMAIN=mg.example.com
MAILGUN_REGION=us  # us | eu

# Postmark configuration
POSTMARK_SERVER_TOKEN=
POSTMARK_MESSAGE_STREAM=outbound

# Resend configuration
RESEND_API_KEY=

# Queue configuration (for async sending)
MAIL_QUEUE=emails
MAIL_QUEUE_TRIES=3
MAIL_QUEUE_TIMEOUT=300
```

### Config Schema

```typescript
const MailConfig = S.Struct({
  driver: S.Literal("smtp", "ses", "mailgun", "postmark", "resend", "log", "array"),
  from: S.Struct({
    address: S.String,
    name: S.optional(S.String),
  }),
  smtp: S.optional(S.Struct({
    host: S.String,
    port: S.Number,
    user: S.optional(S.String),
    password: S.optional(S.String),
    secure: S.optional(S.Boolean),
  })),
  ses: S.optional(S.Struct({
    region: S.String,
    accessKeyId: S.optional(S.String),
    secretAccessKey: S.optional(S.String),
    configurationSetName: S.optional(S.String),
  })),
  mailgun: S.optional(S.Struct({
    apiKey: S.String,
    domain: S.String,
    region: S.optional(S.Literal("us", "eu")),
  })),
  postmark: S.optional(S.Struct({
    serverToken: S.String,
    messageStream: S.optional(S.String),
  })),
  resend: S.optional(S.Struct({
    apiKey: S.String,
  })),
  queue: S.optional(S.Struct({
    name: S.String,
    tries: S.optional(S.Number),
    timeout: S.optional(S.Number),
  })),
})
```

---

## Implementation Phases

### Phase 1: Core Foundation
- [ ] NX library scaffolding (mail-core, mail-drivers, mail-templates)
- [ ] Domain types (Message, Address, Attachment, Envelope, Content)
- [ ] Branded types (MessageId, EmailAddress)
- [ ] Error types (MailError, MailConnectionError, MailDeliveryError, MailValidationError)
- [ ] MailDriver port interface
- [ ] TemplateEngine port interface
- [ ] LogDriver adapter (development)
- [ ] ArrayDriver adapter (testing with assertions)
- [ ] Basic Mail service (send, sendRaw)
- [ ] Mailable base class and `makeMailable` factory

### Phase 2: React Email Templates
- [ ] Install @react-email/components dependency
- [ ] MailTheme type definition
- [ ] `defineMailTheme()` factory function
- [ ] Default theme with sensible colors/fonts
- [ ] ThemeProvider React context
- [ ] BaseLayout component (header, footer, branding)
- [ ] Layout components (Section, Card, Row, Column, Divider, Spacer)
- [ ] Typography components (Heading, Text, Link, Code, CodeBlock)
- [ ] Action components (Button, ButtonGroup, TextButton)
- [ ] Data components (Table, List, KeyValue, Badge, Alert)
- [ ] Media components (Image, Avatar)
- [ ] ReactEmailEngine implementation
- [ ] Auto plain-text generation (html-to-text)

### Phase 3: Default Templates & QuickEmail
- [ ] Auth templates (Welcome, PasswordReset, EmailVerification, MagicLink)
- [ ] Transactional templates (OrderConfirmation, ShippingNotification, Invoice, Receipt)
- [ ] Notification templates (Notification, Alert, Reminder)
- [ ] QuickEmail fluent builder for inline emails

### Phase 4: SMTP Driver
- [ ] Nodemailer integration
- [ ] SmtpDriver implementation
- [ ] Connection pooling support
- [ ] TLS/STARTTLS support
- [ ] Auth configuration
- [ ] Error handling and connection verify

### Phase 5: Cloud Provider Drivers
- [ ] ResendDriver (modern API, recommended)
- [ ] SesDriver (AWS SDK v3)
- [ ] PostmarkDriver
- [ ] MailgunDriver

### Phase 6: Queue Integration
- [ ] SendMailJob definition for @gello/queue
- [ ] `mail.queue()` implementation
- [ ] `mail.later()` implementation
- [ ] Retry policies for failed sends
- [ ] Dead letter handling

### Phase 7: CLI & Preview Server
- [ ] mail-orchestrator NX app setup
- [ ] mail:send command (send test emails)
- [ ] mail:test command (verify driver config)
- [ ] mail:preview command (React Email preview server)
- [ ] Preview server with hot reload
- [ ] Desktop/mobile preview modes

### Phase 8: Observability
- [ ] Send metrics (count, latency)
- [ ] Failure tracking
- [ ] Structured logging
- [ ] Webhook support for delivery tracking (future)

---

## NX Library Structure

```
libs/
├── mail/
│   ├── core/                    # @gello/mail-core
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── domain/
│   │   │   │   ├── types.ts         # Message, Address, Attachment, etc.
│   │   │   │   ├── mailable.ts      # Mailable base class & factory
│   │   │   │   └── errors.ts        # MailError, ValidationError, etc.
│   │   │   ├── ports/
│   │   │   │   ├── MailDriver.ts    # MailDriver port
│   │   │   │   └── TemplateEngine.ts # TemplateEngine port
│   │   │   └── services/
│   │   │       └── Mail.ts          # Mail service
│   │   ├── project.json
│   │   └── README.md
│   │
│   ├── drivers/                 # @gello/mail-drivers
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── SmtpDriver.ts        # Nodemailer-based SMTP
│   │   │   ├── SesDriver.ts         # AWS SES
│   │   │   ├── MailgunDriver.ts     # Mailgun API
│   │   │   ├── PostmarkDriver.ts    # Postmark API
│   │   │   ├── ResendDriver.ts      # Resend API
│   │   │   ├── LogDriver.ts         # Console logging (dev)
│   │   │   └── ArrayDriver.ts       # In-memory (testing)
│   │   ├── project.json
│   │   └── README.md
│   │
│   └── templates/               # @gello/mail-templates
│       ├── src/
│       │   ├── index.ts
│       │   │
│       │   ├── engine/
│       │   │   └── ReactEmailEngine.ts  # Template rendering engine
│       │   │
│       │   ├── theme/
│       │   │   ├── types.ts             # MailTheme interface
│       │   │   ├── defineMailTheme.ts   # Theme factory
│       │   │   ├── defaultTheme.ts      # Sensible defaults
│       │   │   └── ThemeProvider.tsx    # React context
│       │   │
│       │   ├── components/              # Reusable email components
│       │   │   ├── layout/
│       │   │   │   ├── BaseLayout.tsx   # Full email wrapper
│       │   │   │   ├── Section.tsx
│       │   │   │   ├── Card.tsx
│       │   │   │   ├── Row.tsx
│       │   │   │   ├── Column.tsx
│       │   │   │   ├── Divider.tsx
│       │   │   │   └── Spacer.tsx
│       │   │   ├── typography/
│       │   │   │   ├── Heading.tsx
│       │   │   │   ├── Text.tsx
│       │   │   │   ├── Link.tsx
│       │   │   │   ├── Code.tsx
│       │   │   │   └── CodeBlock.tsx
│       │   │   ├── actions/
│       │   │   │   ├── Button.tsx
│       │   │   │   ├── ButtonGroup.tsx
│       │   │   │   └── TextButton.tsx
│       │   │   ├── data/
│       │   │   │   ├── Table.tsx
│       │   │   │   ├── List.tsx
│       │   │   │   ├── KeyValue.tsx
│       │   │   │   ├── Badge.tsx
│       │   │   │   └── Alert.tsx
│       │   │   └── media/
│       │   │       ├── Image.tsx
│       │   │       ├── Avatar.tsx
│       │   │       └── Icon.tsx
│       │   │
│       │   ├── defaults/                # Pre-built templates
│       │   │   ├── index.ts
│       │   │   ├── auth/
│       │   │   │   ├── WelcomeEmail.tsx
│       │   │   │   ├── PasswordReset.tsx
│       │   │   │   ├── EmailVerification.tsx
│       │   │   │   └── MagicLink.tsx
│       │   │   ├── transactional/
│       │   │   │   ├── OrderConfirmation.tsx
│       │   │   │   ├── ShippingNotification.tsx
│       │   │   │   ├── Invoice.tsx
│       │   │   │   └── Receipt.tsx
│       │   │   └── notifications/
│       │   │       ├── Notification.tsx
│       │   │       ├── Alert.tsx
│       │   │       └── Reminder.tsx
│       │   │
│       │   └── builder/
│       │       └── QuickEmail.ts        # Fluent email builder
│       │
│       ├── project.json
│       └── README.md
│
├── publishable/
│   └── mail/                    # @gello/mail (aggregator)
│       ├── src/
│       │   └── index.ts         # Re-exports from core, drivers, templates
│       ├── project.json
│       └── README.md
│
apps/
└── mail-orchestrator/           # CLI app
    ├── src/
    │   ├── main.ts
    │   ├── cli/
    │   │   ├── send.ts          # mail:send command
    │   │   ├── preview.ts       # mail:preview command (React Email preview)
    │   │   └── test.ts          # mail:test command
    │   └── preview/
    │       └── server.ts        # Preview server for templates
    ├── project.json
    └── README.md
```

---

## API Reference

### Mail Service

| Method | Description |
|--------|-------------|
| `send(mailable)` | Send mailable immediately |
| `sendRaw(to, subject, content)` | Send raw email |
| `queue(mailable, queue?)` | Queue for async sending |
| `later(delay, mailable, queue?)` | Queue with delay |
| `driver()` | Get current driver |
| `using(driver)` | Use specific driver |

### Mailable Methods

| Method | Description |
|--------|-------------|
| `to(address)` | Set recipient |
| `cc(address)` | Add CC recipient |
| `bcc(address)` | Add BCC recipient |
| `from(address)` | Set sender |
| `replyTo(address)` | Set reply-to |
| `subject(text)` | Set subject |
| `view(template, data)` | Use template |
| `text(content)` | Set plain text |
| `html(content)` | Set HTML |
| `attach(path)` | Attach file |
| `attachData(data, name)` | Attach data |
| `with(data)` | Set template data |
| `build()` | Build message |

### CLI Commands

| Command | Description |
|---------|-------------|
| `mail:send --to=<email> --template=<name>` | Send test email |
| `mail:preview --port=<port>` | Start preview server |
| `mail:test` | Test mail configuration |

---

## References

- [Laravel 4.2 Mail Documentation](https://laravel.com/docs/4.2/mail)
- [Nodemailer](https://nodemailer.com/)
- [React Email](https://react.email/)
- [MJML](https://mjml.io/)
- [AWS SES SDK](https://docs.aws.amazon.com/ses/)
- [Mailgun API](https://documentation.mailgun.com/)
- [Postmark API](https://postmarkapp.com/developer)
- [Resend API](https://resend.com/docs)
