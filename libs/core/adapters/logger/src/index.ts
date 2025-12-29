/**
 * @gello/adapters-logger
 *
 * Logger driver adapters for different output targets:
 * - Console (colorized terminal output)
 * - JSON (structured JSON for log aggregators)
 * - File (rotating file logs with compression)
 * - Pretty (Effect's pretty logger integration)
 * - Multi (composite for multiple outputs)
 * - Null/Memory (for testing)
 */

// Console Driver
export { consoleDriver, simpleConsoleDriver } from "./ConsoleDriver.js";

// JSON Driver
export { jsonDriver, ndjsonDriver, prettyJsonDriver } from "./JsonDriver.js";

// File Driver
export { fileDriver, simpleFileDriver } from "./FileDriver.js";

// Pretty Driver
export {
  prettyDriver,
  effectPrettyLogger,
  effectPrettyLoggerLayer,
} from "./PrettyDriver.js";

// Multi Driver
export {
  multiDriver,
  filteredDriver,
  teeDriver,
  conditionalDriver,
  asyncDriver,
} from "./MultiDriver.js";

// Null/Memory Driver
export {
  nullDriver,
  memoryDriver,
  countingDriver,
  type MemoryDriverState,
} from "./NullDriver.js";
