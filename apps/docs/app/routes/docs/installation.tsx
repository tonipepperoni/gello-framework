import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock, Callout, Tabs, Tab } from '../../components';

export const Route = createFileRoute('/docs/installation')({
  component: InstallationPage,
});

function InstallationPage() {
  return (
    <DocsContent
      title="Installation"
      description="Get started with Gello in seconds using the CLI"
    >
      <h2>Quick Start (Recommended)</h2>
      <p>
        The fastest way to create a new Gello project is using the CLI:
      </p>
      <CodeBlock lang="bash" code={`npx gello new my-app
cd my-app
pnpm install
pnpm dev`} />

      <Callout type="info" title="What gets scaffolded?">
        This creates a complete project with Effect, HTTP server, and example routes — ready to go.
      </Callout>

      <h2>Manual Installation</h2>
      <p>
        If you prefer to add Gello to an existing project, install the packages directly:
      </p>

      <h3>Core Packages</h3>
      <Tabs items={['pnpm', 'npm', 'yarn']}>
        <Tab value="pnpm">
          <CodeBlock lang="bash" code={`# Core framework
pnpm add @gello/core @gello/common @gello/platform-node

# Effect runtime (peer dependencies)
pnpm add effect @effect/platform @effect/platform-node @effect/schema`} />
        </Tab>
        <Tab value="npm">
          <CodeBlock lang="bash" code={`# Core framework
npm install @gello/core @gello/common @gello/platform-node

# Effect runtime (peer dependencies)
npm install effect @effect/platform @effect/platform-node @effect/schema`} />
        </Tab>
        <Tab value="yarn">
          <CodeBlock lang="bash" code={`# Core framework
yarn add @gello/core @gello/common @gello/platform-node

# Effect runtime (peer dependencies)
yarn add effect @effect/platform @effect/platform-node @effect/schema`} />
        </Tab>
      </Tabs>

      <h3>Optional Packages</h3>
      <CodeBlock lang="bash" code={`# Queue system
pnpm add @gello/queue

# Functional programming utilities (optics, refined types)
pnpm add @gello/fp

# Testing utilities
pnpm add -D @gello/testing`} />

      <h3>Database (Drizzle + Postgres)</h3>
      <CodeBlock lang="bash" code={`pnpm add drizzle-orm pg
pnpm add -D drizzle-kit @types/pg`} />

      <h2>Package Overview</h2>
      <table>
        <thead>
          <tr>
            <th>Package</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>@gello/core</code></td>
            <td>Core contracts, errors, and base types</td>
          </tr>
          <tr>
            <td><code>@gello/common</code></td>
            <td>Middleware, routing, validation utilities</td>
          </tr>
          <tr>
            <td><code>@gello/platform-node</code></td>
            <td>Node.js HTTP adapter</td>
          </tr>
          <tr>
            <td><code>@gello/queue</code></td>
            <td>Effect-native queue system</td>
          </tr>
          <tr>
            <td><code>@gello/fp</code></td>
            <td>Optics, refined types, FP utilities</td>
          </tr>
          <tr>
            <td><code>@gello/testing</code></td>
            <td>Testing utilities and mocks</td>
          </tr>
        </tbody>
      </table>

      <h2>Project Structure</h2>
      <CodeBlock lang="text" code={`src/
├── main.ts              # Entry point — Layer.launch(MainLayer)
├── layers/
│   ├── Config.ts        # Config Layer with Effect.Config
│   ├── Database.ts      # PgPool + Drizzle Layers
│   └── Redis.ts         # Redis Layer with acquireRelease
├── services/
│   └── UserRepo.ts      # Service Layers using Context.Tag
├── routes/
│   └── users.ts         # HttpRouter handlers
└── lib/
    └── schema.ts        # Drizzle schema definitions`} />

      <h2>TypeScript Config</h2>
      <CodeBlock lang="json" code={`{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "moduleResolution": "NodeNext",
    "module": "NodeNext",
    "target": "ES2022",
    "lib": ["ES2022"],
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}`} />

      <h2>Entry Point</h2>
      <CodeBlock code={`// src/main.ts
import { pipe } from "effect"
import * as Layer from "effect/Layer"
import * as HttpServer from "@effect/platform/HttpServer"
import * as NodeHttpServer from "@effect/platform-node/NodeHttpServer"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import { createServer } from "node:http"

import { AppRouter } from "./routes"
import { AppLayer } from "./layers"

const MainLayer = pipe(
  HttpServer.serve(AppRouter),
  HttpServer.withLogAddress,
  Layer.provide(AppLayer),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

Layer.launch(MainLayer).pipe(NodeRuntime.runMain)`} />

      <h2>Development</h2>
      <CodeBlock lang="bash" code={`# Start development server with hot reload
pnpm dev

# Or using the CLI
npx gello serve`} />
    </DocsContent>
  );
}
