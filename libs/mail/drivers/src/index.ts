/**
 * @gello/mail-drivers
 *
 * Mail driver implementations for the Gello mail system.
 */

// Log Driver (Development)
export { LogDriverLive } from "./lib/LogDriver.js"

// Array Driver (Testing)
export {
  type ArrayDriver,
  makeArrayDriver,
  ArrayDriverLive,
} from "./lib/ArrayDriver.js"

// Re-export core types for convenience
export {
  type MailDriver,
  MailDriverTag,
} from "@gello/mail-core"
