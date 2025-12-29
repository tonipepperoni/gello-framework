import { createFileRoute } from '@tanstack/react-router';
import {
  DocsContent,
  CodeBlock,
  Callout,
  Tabs,
  Tab,
  Steps,
  Step,
  Files,
  File,
  Folder,
  Card,
  Cards,
  type TOCItem,
} from '../../components';
import { getPageNavigation } from '../../lib/source';

export const Route = createFileRoute('/docs/installation')({
  component: InstallationPage,
});

const toc: TOCItem[] = [
  { title: 'Quick Start (Recommended)', url: '#quick-start', depth: 2 },
  { title: 'Manual Installation', url: '#manual-installation', depth: 2 },
  { title: 'Core Packages', url: '#core-packages', depth: 3 },
  { title: 'Optional Packages', url: '#optional-packages', depth: 3 },
  { title: 'Database (Drizzle + Postgres)', url: '#database', depth: 3 },
  { title: 'Package Overview', url: '#package-overview', depth: 2 },
  { title: 'Project Structure', url: '#project-structure', depth: 2 },
  { title: 'TypeScript Config', url: '#typescript-config', depth: 2 },
  { title: 'Entry Point', url: '#entry-point', depth: 2 },
  { title: 'Development', url: '#development', depth: 2 },
];

function InstallationPage() {
  const footer = getPageNavigation('/docs/installation');

  return (
    <DocsContent
      title="Installation"
      description="Get started with Gello in seconds using the CLI"
      toc={toc}
      footer={footer}
    >
      <h2 id="quick-start">Quick Start (Recommended)</h2>
      <Steps>
        <Step>
          <h3>Create a new project</h3>
          <p>Use the Gello CLI to scaffold a complete project:</p>
          <CodeBlock lang="bash" code={`npx gello new my-app`} />
        </Step>
        <Step>
          <h3>Install dependencies</h3>
          <CodeBlock lang="bash" code={`cd my-app
pnpm install`} />
        </Step>
        <Step>
          <h3>Start development server</h3>
          <CodeBlock lang="bash" code={`pnpm dev`} />
        </Step>
      </Steps>

      <Callout type="info" title="What gets scaffolded?">
        This creates a complete project with Effect, HTTP server, and example routes — ready to go.
      </Callout>

      <h2 id="manual-installation">Manual Installation</h2>
      <p>
        If you prefer to add Gello to an existing project, install the packages directly:
      </p>

      <h3 id="core-packages">Core Packages</h3>
      <Tabs items={['pnpm', 'npm', 'yarn']} persist groupId="pkg">
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

      <h3 id="optional-packages">Optional Packages</h3>
      <CodeBlock lang="bash" code={`# Queue system
pnpm add @gello/queue

# Functional programming utilities (optics, refined types)
pnpm add @gello/fp

# Testing utilities
pnpm add -D @gello/testing`} />

      <h3 id="database">Database (Drizzle + Postgres)</h3>
      <CodeBlock lang="bash" code={`pnpm add drizzle-orm pg
pnpm add -D drizzle-kit @types/pg`} />

      <h2 id="package-overview">Package Overview</h2>
      <Cards>
        <Card title="@gello/core" description="Core contracts, errors, and base types" />
        <Card title="@gello/common" description="Middleware, routing, validation utilities" />
        <Card title="@gello/platform-node" description="Node.js HTTP adapter" />
        <Card title="@gello/queue" description="Effect-native queue system" />
        <Card title="@gello/fp" description="Optics, refined types, FP utilities" />
        <Card title="@gello/testing" description="Testing utilities and mocks" />
      </Cards>

      <h2 id="project-structure">Project Structure</h2>
      <Files>
        <Folder name="src" defaultOpen>
          <File name="main.ts" />
          <Folder name="layers" defaultOpen>
            <File name="Config.ts" />
            <File name="Database.ts" />
            <File name="Redis.ts" />
          </Folder>
          <Folder name="services">
            <File name="UserRepo.ts" />
          </Folder>
          <Folder name="routes">
            <File name="users.ts" />
          </Folder>
          <Folder name="lib">
            <File name="schema.ts" />
          </Folder>
        </Folder>
        <File name="package.json" />
        <File name="tsconfig.json" />
      </Files>

      <h2 id="typescript-config">TypeScript Config</h2>
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

      <h2 id="entry-point">Entry Point</h2>
      <CodeBlock lang="typescript" code={`// src/main.ts
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

      <h2 id="development">Development</h2>
      <CodeBlock lang="bash" code={`# Start development server with hot reload
pnpm dev

# Or using the CLI
npx gello serve`} />
    </DocsContent>
  );
}
