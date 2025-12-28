import { n as jsxRuntimeExports } from "../server.js";
import { C as CodeBlock } from "./CodeBlock-1L53za-Z.js";
import "node:async_hooks";
import "node:stream";
import "stream";
import "util";
import "node:stream/web";
function InstallationPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "prose", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Installation" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-zinc-400 mb-8", children: "Effect + @effect/platform — everything you need" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Core Dependencies" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { lang: "bash", code: `pnpm add effect @effect/schema @effect/platform @effect/platform-node` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Database (Drizzle + Postgres)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { lang: "bash", code: `pnpm add drizzle-orm pg
pnpm add -D drizzle-kit @types/pg` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Cache (Redis)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { lang: "bash", code: `pnpm add ioredis
pnpm add -D @types/ioredis` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Optional: Queues (BullMQ)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { lang: "bash", code: `pnpm add bullmq` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Project Structure" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { lang: "text", code: `src/
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
    └── schema.ts        # Drizzle schema definitions` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "TypeScript Config" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { lang: "json", code: `{
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
}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Entry Point" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// src/main.ts
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

Layer.launch(MainLayer).pipe(NodeRuntime.runMain)` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Run" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { lang: "bash", code: `npx tsx src/main.ts` })
  ] });
}
export {
  InstallationPage as component
};
