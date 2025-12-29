import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock, Callout, type TOCItem } from '../../components';
import { getPageNavigation } from '../../lib/source';

export const Route = createFileRoute('/docs/logger')({
  component: LoggerPage,
});

const toc: TOCItem[] = [
  { title: 'Architecture Overview', url: '#architecture-overview', depth: 2 },
  { title: 'Quick Start', url: '#quick-start', depth: 2 },
  { title: 'Log Levels', url: '#log-levels', depth: 2 },
  { title: 'Using the Logger', url: '#using-the-logger', depth: 2 },
  { title: 'Child Loggers & Context', url: '#child-loggers-context', depth: 2 },
  { title: 'Drivers', url: '#drivers', depth: 2 },
  { title: 'Console Driver', url: '#console-driver', depth: 3 },
  { title: 'Pretty Driver', url: '#pretty-driver', depth: 3 },
  { title: 'JSON Driver', url: '#json-driver', depth: 3 },
  { title: 'File Driver', url: '#file-driver', depth: 3 },
  { title: 'Multi Driver', url: '#multi-driver', depth: 3 },
  { title: 'Environment Presets', url: '#environment-presets', depth: 2 },
  { title: 'Testing with Mock Logger', url: '#testing-with-mock-logger', depth: 2 },
  { title: 'Redaction', url: '#redaction', depth: 2 },
  { title: 'Best Practices', url: '#best-practices', depth: 2 },
];

function LoggerPage() {
  const footer = getPageNavigation('/docs/logger');

  return (
    <DocsContent
      title="Logger"
      description="A comprehensive logging solution with multiple drivers, following hexagonal DDD architecture. Built on Effect with pretty printing, structured JSON output, and file rotation."
      toc={toc}
      footer={footer}
    >
      <h2 id="architecture-overview">Architecture Overview</h2>
      <p>
        The logger follows a <strong>Ports & Adapters</strong> (hexagonal) architecture pattern,
        separating concerns into three layers:
      </p>
      <ul>
        <li><strong>Contracts (Ports)</strong> - Interfaces defining the logging API</li>
        <li><strong>Domain</strong> - Core logging logic, formatters, and entry creation</li>
        <li><strong>Adapters (Drivers)</strong> - Concrete implementations for different outputs</li>
      </ul>

      <h2 id="quick-start">Quick Start</h2>
      <CodeBlock code={`import { Effect } from "effect";
import { Logger, developmentLogger, logInfo } from "@gello/core-config";

// Use the development preset (pretty console output)
const program = Effect.gen(function* () {
  yield* logInfo("Application started", { version: "1.0.0" });

  // Your application logic here
});

// Run with the logger layer
Effect.runPromise(
  program.pipe(Effect.provide(developmentLogger()))
);`} />

      <h2 id="log-levels">Log Levels</h2>
      <CodeBlock code={`type LogLevel = "trace" | "debug" | "info" | "warning" | "error" | "fatal";

// Level ordering (lowest to highest severity)
// trace < debug < info < warning < error < fatal

// Check if a level should be logged
import { shouldLog } from "@gello/core-contracts";

shouldLog("debug", "info");  // false (debug < info minimum)
shouldLog("error", "info");  // true  (error >= info minimum)`} />

      <h2 id="using-the-logger">Using the Logger</h2>
      <CodeBlock code={`import { Effect } from "effect";
import { Logger } from "@gello/core-contracts";

// Access logger from context
const program = Effect.gen(function* () {
  const logger = yield* Logger;

  // Log at different levels
  yield* logger.trace("Detailed trace info");
  yield* logger.debug("Debug information", { userId: 123 });
  yield* logger.info("User logged in", { email: "user@example.com" });
  yield* logger.warning("Rate limit approaching", { current: 95, max: 100 });
  yield* logger.error("Failed to process", new Error("Connection timeout"), {
    retryCount: 3
  });
  yield* logger.fatal("System shutdown required", new Error("Out of memory"));
});

// Or use the convenience helpers
import { logInfo, logError, logDebug } from "@gello/core-config";

const simpler = Effect.gen(function* () {
  yield* logInfo("Processing request", { requestId: "abc-123" });
  yield* logError("Operation failed", new Error("timeout"), { attempt: 3 });
});`} />

      <h2 id="child-loggers-context">Child Loggers & Context</h2>
      <Callout type="info">
        Create child loggers with inherited context for request scoping.
        All logs from a child logger include the parent context.
      </Callout>

      <CodeBlock code={`const handleRequest = (requestId: string) =>
  Effect.gen(function* () {
    const logger = yield* Logger;

    // Create a child logger with request context
    const reqLogger = logger
      .withRequestId(requestId)
      .withService("api")
      .withModule("users");

    // All logs from this logger include the context
    yield* reqLogger.info("Processing user request");
    // Output: [api/users] (abc-123) Processing user request

    yield* reqLogger.debug("Fetching user data", { userId: 42 });
    // Output: [api/users] (abc-123) Fetching user data { userId: 42 }

    // Or add arbitrary context
    const orderLogger = reqLogger.child({ orderId: "order-999" });
    yield* orderLogger.info("Order processed");
  });`} />

      <h2 id="drivers">Drivers</h2>

      <h3 id="console-driver">Console Driver</h3>
      <p>Simple colorized output to stdout/stderr:</p>
      <CodeBlock code={`import { consoleDriver } from "@gello/adapters-logger";

const driver = consoleDriver({
  colors: true,      // ANSI color codes
  timestamps: true,  // Include timestamps
});`} />

      <h3 id="pretty-driver">Pretty Driver</h3>
      <p>Human-readable output with icons and colors:</p>
      <CodeBlock code={`import { prettyDriver } from "@gello/adapters-logger";

const driver = prettyDriver({
  colors: true,     // ANSI colors
  icons: true,      // Level icons (●, ⚠, ✖, etc.)
  timestamps: true, // HH:MM:SS.mmm format
  multiline: true,  // Pretty-print context objects
});

// Output example:
// 14:32:45.123 ● INFO    [api/users] (req-123) User logged in
//     {
//       "email": "user@example.com",
//       "ip": "192.168.1.1"
//     }`} />

      <h3 id="json-driver">JSON Driver</h3>
      <p>Structured JSON for log aggregators (ELK, Datadog, etc.):</p>
      <CodeBlock code={`import { jsonDriver } from "@gello/adapters-logger";

const driver = jsonDriver({
  includeStack: true,  // Include stack traces for errors
});

// Output example:
// {"timestamp":"2024-01-15T14:32:45.123Z","level":"info","message":"User logged in"}`} />

      <h3 id="file-driver">File Driver</h3>
      <p>Write to files with automatic rotation and compression:</p>
      <CodeBlock code={`import { Effect, Scope } from "effect";
import { fileDriver } from "@gello/adapters-logger";

// File driver requires a Scope for resource management
const program = Effect.scoped(
  Effect.gen(function* () {
    const driver = yield* fileDriver({
      path: "./logs/app.log",
      maxSize: 50 * 1024 * 1024,  // 50MB before rotation
      maxFiles: 10,               // Keep 10 rotated files
      compress: true,             // Gzip old files
    });

    // Use the driver...
  })
);`} />

      <h3 id="multi-driver">Multi Driver</h3>
      <p>Combine multiple drivers for simultaneous output:</p>
      <CodeBlock code={`import { multiDriver, prettyDriver, jsonDriver } from "@gello/adapters-logger";

// Log to both console (pretty) and stdout (JSON)
const driver = multiDriver([
  prettyDriver({ colors: true, icons: true }),
  jsonDriver({ includeStack: true }),
]);`} />

      <h2 id="environment-presets">Environment Presets</h2>
      <CodeBlock code={`import {
  developmentLogger,
  productionLogger,
  testLogger,
  stagingLogger,
  environmentLogger
} from "@gello/core-config";

// Development: Pretty console output, debug level
const devLayer = developmentLogger();

// Production: JSON to stdout + rotating file, info level
const prodLayer = productionLogger("./logs/app.log");

// Testing: Null driver, fatal level only
const testLayer = testLogger();

// Staging: JSON output, warning level minimum
const stagingLayer = stagingLogger();

// Auto-detect from NODE_ENV
const autoLayer = environmentLogger();`} />

      <h2 id="testing-with-mock-logger">Testing with Mock Logger</h2>
      <CodeBlock code={`import {
  createMockLogger,
  withMockLogger,
  silentLoggerLayer,
  expectLogEntry,
  expectNoErrors,
} from "@gello/testing-mocks";

// Option 1: Use withMockLogger helper
const testProgram = Effect.gen(function* () {
  const { result, logs } = yield* withMockLogger(
    myFunction()
  );

  // Assert on captured logs
  expectLogEntry(logs, {
    level: "info",
    messageContains: "processed"
  });
  expectNoErrors(logs);

  return result;
});

// Option 2: Silent logger (no capture, just discard)
const silentTest = myFunction().pipe(
  Effect.provide(silentLoggerLayer)
);`} />

      <h2 id="redaction">Redaction</h2>
      <p>Automatically redact sensitive data from logs:</p>
      <CodeBlock code={`import { makeLogger } from "@gello/domain-logger";
import { prettyDriver } from "@gello/adapters-logger";

const logger = makeLogger(
  prettyDriver({ colors: true }),
  {
    level: "debug",
    service: "api",
    redactKeys: [
      "password",
      "token",
      "secret",
      "authorization",
      "cookie",
      "creditCard"
    ],
  }
);

// Sensitive values are replaced with [REDACTED]
yield* logger.info("User login", {
  email: "user@example.com",
  password: "secret123",  // Logged as: [REDACTED]
  token: "abc123",        // Logged as: [REDACTED]
});`} />

      <h2 id="best-practices">Best Practices</h2>
      <ul>
        <li>
          <strong>Use child loggers</strong> for request scoping — attach <code>requestId</code> early
          and all subsequent logs will include it
        </li>
        <li>
          <strong>Structure your context</strong> — use consistent keys like <code>userId</code>,
          <code>orderId</code>, <code>duration</code> for easier log aggregation
        </li>
        <li>
          <strong>Use appropriate levels</strong> — <code>debug</code> for development,
          <code>info</code> for business events, <code>error</code> for actionable issues
        </li>
        <li>
          <strong>Configure redaction</strong> — always redact sensitive fields like passwords,
          tokens, and PII
        </li>
        <li>
          <strong>Use JSON in production</strong> — structured logs work better with log aggregators
          and make searching/alerting easier
        </li>
      </ul>
    </DocsContent>
  );
}
