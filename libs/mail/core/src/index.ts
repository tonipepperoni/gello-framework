/**
 * @gello/mail-core
 *
 * Core domain types, ports, and services for the Gello mail system.
 */

// Domain Types - re-export everything
export * from "./lib/domain/types.js"

// Errors
export {
  MailError,
  MailConnectionError,
  MailValidationError,
  MailDeliveryError,
  TemplateError,
  TemplateNotFoundError,
  AttachmentError,
  MailConfigError,
  type MailSystemError,
} from "./lib/domain/errors.js"

// Mailable
export {
  type Mailable,
  BaseMailable,
  createSimpleMailable,
  createTemplateMailable,
  type MakeMailableOptions,
} from "./lib/domain/mailable.js"

// Ports
export {
  type MailDriver,
  MailDriverTag,
} from "./lib/ports/MailDriver.js"

export {
  type TemplateEngine,
  type RenderedTemplate,
  type CompiledTemplate,
  TemplateEngineTag,
} from "./lib/ports/TemplateEngine.js"

// Services
export {
  type MailService,
  MailTag,
  MailServiceLive,
} from "./lib/services/Mail.js"
