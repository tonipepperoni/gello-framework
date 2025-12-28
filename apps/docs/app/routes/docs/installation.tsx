import { createFileRoute } from '@tanstack/react-router';
import { CodeBlock } from '../../components/CodeBlock';

export const Route = createFileRoute('/docs/installation')({
  component: InstallationPage,
});

function InstallationPage() {
  return (
    <article className="prose">
      <h1>Installation</h1>
      <p className="text-xl text-zinc-400 mb-8">
        Effect + @effect/platform — everything you need
      </p>

      <h2>Core Dependencies</h2>
      <CodeBlock lang="bash" code={`pnpm add effect @effect/schema @effect/platform @effect/platform-node`} />

      <h2>Database (Drizzle + Postgres)</h2>
      <CodeBlock lang="bash" code={`pnpm add drizzle-orm pg
pnpm add -D drizzle-kit @types/pg`} />

      <h2>Cache (Redis)</h2>
      <CodeBlock lang="bash" code={`pnpm add ioredis
pnpm add -D @types/ioredis`} />

      <h2>Optional: Queues (BullMQ)</h2>
      <CodeBlock lang="bash" code={`pnpm add bullmq`} />

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
    "moduleResolution": "bundler",
    "module": "ESNext",
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

      <h2>Run</h2>
      <CodeBlock lang="bash" code={`npx tsx src/main.ts`} />
    </article>
  );
}
