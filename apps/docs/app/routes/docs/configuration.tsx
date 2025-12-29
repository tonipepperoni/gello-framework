import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock, Callout, type TOCItem } from '../../components';
import { getPageNavigation } from '../../lib/source';

export const Route = createFileRoute('/docs/configuration')({
  component: ConfigurationPage,
});

const toc: TOCItem[] = [
  { title: 'Overview', url: '#overview', depth: 2 },
  { title: 'Quick Start', url: '#quick-start', depth: 2 },
  { title: 'Environment Files', url: '#environment-files', depth: 2 },
  { title: 'Example .env.example', url: '#example-env-example', depth: 3 },
  { title: 'The env() Helper', url: '#the-env-helper', depth: 2 },
  { title: 'Config Service (Effect Pattern)', url: '#config-service-effect-pattern', depth: 2 },
  { title: 'Schema Validation', url: '#schema-validation', depth: 2 },
  { title: 'Built-in Validators', url: '#built-in-validators', depth: 2 },
  { title: 'Environment Detection', url: '#environment-detection', depth: 2 },
  { title: 'Environment Priority', url: '#environment-priority', depth: 3 },
  { title: 'Testing Utilities', url: '#testing-utilities', depth: 2 },
  { title: 'Best Practices', url: '#best-practices', depth: 2 },
];

function ConfigurationPage() {
  const footer = getPageNavigation('/docs/configuration');

  return (
    <DocsContent
      title="Configuration"
      description="Laravel-inspired configuration with dot notation, environment detection, and type-safe validation"
      toc={toc}
      footer={footer}
    >
      <h2 id="overview">Overview</h2>
      <p>
        Gello provides a powerful configuration system via <code>@gello/config</code> that supports:
      </p>
      <ul>
        <li>Environment variable loading with sensible defaults</li>
        <li>Dot notation access: <code>config.get("database.host")</code></li>
        <li>Type coercion: strings, numbers, booleans</li>
        <li>Schema validation with Effect Schema</li>
        <li>Environment detection (local, development, staging, production, testing)</li>
        <li>.env file loading with cascading priority</li>
        <li>Testing utilities for easy overrides</li>
      </ul>

      <h2 id="quick-start">Quick Start</h2>
      <p>
        Generated projects include a <code>src/config/index.ts</code> file with a pre-configured setup:
      </p>
      <CodeBlock code={`import { env } from '@gello/config';

export const config = {
  app: {
    name: env('APP_NAME', 'my-app'),
    env: env('APP_ENV', 'local'),
    debug: env('APP_DEBUG', 'true') === 'true',
  },

  server: {
    host: env('APP_HOST', '0.0.0.0'),
    port: Number(env('APP_PORT', '3000')),
  },

  database: {
    host: env('DB_HOST', 'localhost'),
    port: Number(env('DB_PORT', '5432')),
    name: env('DB_NAME', 'gello'),
    user: env('DB_USER', 'gello'),
    password: env('DB_PASSWORD', ''),
  },

  redis: {
    host: env('REDIS_HOST', 'localhost'),
    port: Number(env('REDIS_PORT', '6379')),
    password: env('REDIS_PASSWORD', ''),
  },

  queue: {
    driver: env('QUEUE_DRIVER', 'memory') as 'memory' | 'redis',
    prefix: env('QUEUE_PREFIX', 'gello:'),
  },
} as const;`} />

      <h2 id="environment-files">Environment Files</h2>
      <p>
        Gello loads <code>.env</code> files with Laravel-style cascading priority (highest to lowest):
      </p>
      <ol>
        <li><code>.env.{'{environment}'}.local</code> — Environment-specific local overrides (gitignored)</li>
        <li><code>.env.local</code> — Local overrides (gitignored)</li>
        <li><code>.env.{'{environment}'}</code> — Environment-specific defaults</li>
        <li><code>.env</code> — Base defaults</li>
      </ol>

      <Callout type="warn" title="Security">
        Never commit <code>.env</code> files with secrets. Use <code>.env.example</code> as a template.
      </Callout>

      <h3 id="example-env-example">Example .env.example</h3>
      <CodeBlock lang="bash" code={`# Application
APP_NAME=my-app
APP_ENV=local
APP_DEBUG=true

# Server
APP_HOST=0.0.0.0
APP_PORT=3000

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gello
DB_USER=gello
DB_PASSWORD=secret
DB_SSL=false
DB_POOL_MIN=2
DB_POOL_MAX=10

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DATABASE=0
REDIS_TLS=false

# Queue
QUEUE_DRIVER=memory
QUEUE_DEFAULT=default
QUEUE_PREFIX=gello:`} />

      <h2 id="the-env-helper">The env() Helper</h2>
      <p>
        The <code>env()</code> function reads from <code>process.env</code> with an optional default:
      </p>
      <CodeBlock code={`import { env } from '@gello/config';

// With default (returns string)
const port = env('PORT', '3000');

// Without default (returns string | undefined)
const apiKey = env('API_KEY');

// Type coercion
const portNum = Number(env('PORT', '3000'));
const debug = env('DEBUG', 'false') === 'true';`} />

      <h2 id="config-service-effect-pattern">Config Service (Effect Pattern)</h2>
      <p>
        For Effect-based applications, use the Config service with dependency injection:
      </p>
      <CodeBlock code={`import { Effect } from 'effect';
import {
  Config,
  layer,
  get,
  string,
  number,
  boolean,
  schema,
} from '@gello/config';

// Create a config layer from static data
const configLayer = layer({
  app: { name: 'my-app', debug: true },
  database: { host: 'localhost', port: 5432 },
});

// Access config in Effects
const program = Effect.gen(function* () {
  const appName = yield* string('app.name');
  const dbPort = yield* number('database.port');
  const debug = yield* boolean('app.debug');

  return { appName, dbPort, debug };
});

// Run with the config layer
Effect.runPromise(
  Effect.provide(program, configLayer)
);`} />

      <h2 id="schema-validation">Schema Validation</h2>
      <p>
        Validate config values against Effect Schema for runtime type safety:
      </p>
      <CodeBlock code={`import { schema } from '@gello/config';
import { Port, Email, Url, NonEmptyString } from '@gello/config';

// Built-in validators
const port = yield* schema('server.port', Port);           // 1-65535
const email = yield* schema('admin.email', Email);         // Valid email format
const apiUrl = yield* schema('api.url', Url);              // Valid URL
const appName = yield* schema('app.name', NonEmptyString); // Non-empty string

// Custom schema
import { Schema } from '@effect/schema';

const LogLevel = Schema.Literal('debug', 'info', 'warn', 'error');
const level = yield* schema('log.level', LogLevel);`} />

      <h2 id="built-in-validators">Built-in Validators</h2>
      <CodeBlock code={`import {
  // String validators
  NonEmptyString,        // String with length >= 1
  TrimmedString,         // Trimmed non-empty string

  // Number validators
  Port,                  // Integer 1-65535
  PositiveInt,           // Integer > 0
  NonNegativeInt,        // Integer >= 0
  Timeout,               // Integer 0-300000 (5 min max)
  PoolSize,              // Integer 1-100
  Percentage,            // Number 0-100

  // Format validators
  Url,                   // Valid HTTP(S) URL
  Email,                 // Valid email format
  UUID,                  // Valid UUID
  Hostname,              // Valid hostname or IP

  // Enum validators
  LogLevel,              // "debug" | "info" | "warn" | "error" | "fatal"
  EnvironmentSchema,     // "local" | "development" | "staging" | "production" | "testing"

  // Coercion schemas
  BooleanFromString,     // "true"/"1"/"yes"/"on" → true
  NumberFromString,      // "123" → 123
  PortFromString,        // "3000" → 3000 (validated)
} from '@gello/config';`} />

      <h2 id="environment-detection">Environment Detection</h2>
      <p>
        Detect and respond to the current environment:
      </p>
      <CodeBlock code={`import {
  environment,
  isLocal,
  isDevelopment,
  isProduction,
  isTesting,
  isStaging,
  whenEnvironment,
  whenLocal,
  whenProduction,
} from '@gello/config';

// Get current environment
const env = yield* environment; // "local" | "development" | "staging" | "production" | "testing"

// Check environment
const isProd = yield* isProduction;  // boolean
const isDev = yield* isDevelopment;  // true for "local" or "development"

// Conditional execution
yield* whenProduction(
  Effect.log('Running in production mode')
);

yield* whenLocal(
  Effect.log('Debug mode enabled')
);

yield* whenEnvironment(['staging', 'production'],
  Effect.sync(() => enableMetrics())
);`} />

      <h3 id="environment-priority">Environment Priority</h3>
      <p>
        Environment is detected from these variables in order:
      </p>
      <ol>
        <li><code>GELLO_ENV</code></li>
        <li><code>APP_ENV</code></li>
        <li><code>NODE_ENV</code></li>
      </ol>
      <p>
        Aliases are supported: <code>dev</code> → development, <code>prod</code> → production, <code>test</code> → testing
      </p>

      <h2 id="testing-utilities">Testing Utilities</h2>
      <p>
        Override config easily in tests:
      </p>
      <CodeBlock code={`import { testLayer, withOverrides, layer } from '@gello/config';

// Create a test layer
const testConfig = testLayer({
  database: { host: 'test-db', port: 5433 },
  app: { debug: true },
});

// Run with test config
const result = await Effect.runPromise(
  Effect.provide(myEffect, testConfig)
);

// Or use withOverrides for inline overrides
const result = await Effect.runPromise(
  withOverrides(
    { database: { host: 'localhost' } },
    myEffect
  )
);`} />

      <h2 id="best-practices">Best Practices</h2>
      <ul>
        <li><strong>Never commit <code>.env</code></strong> — Use <code>.env.example</code> as a template</li>
        <li><strong>Use defaults for development</strong> — Make the app run with zero config locally</li>
        <li><strong>Validate early</strong> — Use schema validation for critical config values</li>
        <li><strong>Mask secrets</strong> — Never log passwords or API keys</li>
        <li><strong>Environment-specific files</strong> — Use <code>.env.production</code> for prod defaults</li>
        <li><strong>Centralize config</strong> — Keep all config in <code>src/config/index.ts</code></li>
      </ul>
    </DocsContent>
  );
}
