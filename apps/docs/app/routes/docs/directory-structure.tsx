import { createFileRoute } from '@tanstack/react-router';
import {
  DocsContent,
  CodeBlock,
  Files,
  File,
  Folder,
  Callout,
  Accordions,
  Accordion,
  type TOCItem,
} from '../../components';
import { getPageNavigation } from '../../lib/source';

export const Route = createFileRoute('/docs/directory-structure')({
  component: DirectoryStructurePage,
});

const toc: TOCItem[] = [
  { title: 'Standard Layout', url: '#standard-layout', depth: 2 },
  { title: 'Directory Breakdown', url: '#directory-breakdown', depth: 2 },
  { title: 'Worker Entry Point', url: '#worker-entry-point', depth: 2 },
];

function DirectoryStructurePage() {
  const footer = getPageNavigation('/docs/directory-structure');

  return (
    <DocsContent
      title="Directory Structure"
      description="Recommended project layout for Gello applications"
      toc={toc}
      footer={footer}
    >
      <h2 id="standard-layout">Standard Layout</h2>
      <Files>
        <Folder name="src" defaultOpen>
          <File name="main.ts" />
          <Folder name="layers" defaultOpen>
            <File name="index.ts" />
            <File name="Config.ts" />
            <File name="Database.ts" />
            <File name="Redis.ts" />
          </Folder>
          <Folder name="services" defaultOpen>
            <File name="UserRepo.ts" />
            <File name="PostRepo.ts" />
            <File name="MailService.ts" />
          </Folder>
          <Folder name="routes" defaultOpen>
            <File name="index.ts" />
            <File name="users.ts" />
            <File name="posts.ts" />
          </Folder>
          <Folder name="jobs">
            <File name="SendEmail.ts" />
            <File name="ProcessUpload.ts" />
          </Folder>
          <Folder name="schemas">
            <File name="User.ts" />
            <File name="Post.ts" />
          </Folder>
          <Folder name="lib">
            <Folder name="db">
              <File name="schema.ts" />
            </Folder>
            <File name="errors.ts" />
          </Folder>
        </Folder>
        <File name="package.json" />
        <File name="tsconfig.json" />
      </Files>

      <Callout type="info">
        This structure follows the principle: <strong>Layers for dependencies, Services for business logic, Routes for HTTP handlers.</strong>
      </Callout>

      <h2 id="directory-breakdown">Directory Breakdown</h2>

      <Accordions type="single">
        <Accordion id="entry" title="main.ts — Entry Point">
          <p>The entry point where all layers are composed and launched:</p>
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
        </Accordion>

        <Accordion id="layers" title="layers/ — Dependency Layers">
          <p>Export all layers merged as <code>AppLayer</code>:</p>
          <CodeBlock lang="typescript" code={`// src/layers/index.ts
import { Layer } from "effect"
import { ConfigLive } from "./Config"
import { PgPoolLive, DbLive } from "./Database"
import { RedisLive } from "./Redis"
import { UserRepoLive } from "../services/UserRepo"

export const AppLayer = Layer.mergeAll(
  ConfigLive,
  PgPoolLive,
  DbLive,
  RedisLive,
  UserRepoLive
)`} />
        </Accordion>

        <Accordion id="services" title="services/ — Business Logic">
          <p>Each service is a <code>Context.Tag</code> with a <code>Layer</code> implementation:</p>
          <CodeBlock lang="typescript" code={`// src/services/UserRepo.ts
import { Context, Effect, Layer } from "effect"
import { Db } from "../layers/Database"

interface UserRepoService {
  findById: (id: string) => Effect.Effect<User | null>
  create: (data: CreateUser) => Effect.Effect<User>
  list: (opts: ListOpts) => Effect.Effect<User[]>
}

export class UserRepo extends Context.Tag("UserRepo")<
  UserRepo,
  UserRepoService
>() {}

export const UserRepoLive = Layer.effect(
  UserRepo,
  Effect.gen(function* () {
    const db = yield* Db
    return {
      findById: (id) => Effect.tryPromise(() => /* ... */),
      create: (data) => Effect.tryPromise(() => /* ... */),
      list: (opts) => Effect.tryPromise(() => /* ... */)
    }
  })
)`} />
        </Accordion>

        <Accordion id="routes" title="routes/ — HTTP Handlers">
          <CodeBlock lang="typescript" code={`// src/routes/index.ts
import { route } from "@gello/core-adapters-node"
import { userRoutes } from "./users"
import { postRoutes } from "./posts"

const apiInfo = Effect.succeed(
  HttpServerResponse.json({ name: "API", version: "1.0.0" })
)

export const routes = [
  route.get("/", apiInfo),
  route.get("/health", Effect.succeed(HttpServerResponse.json({ status: "ok" }))),
  ...userRoutes,
  ...postRoutes,
] as const`} />
        </Accordion>

        <Accordion id="schemas" title="schemas/ — Validation Schemas">
          <CodeBlock lang="typescript" code={`// src/schemas/User.ts
import * as S from "@effect/schema/Schema"

export const CreateUser = S.Struct({
  name: S.String.pipe(S.minLength(2)),
  email: S.String.pipe(S.pattern(/@/))
})

export const UpdateUser = S.partial(CreateUser)

export const User = S.Struct({
  id: S.String,
  name: S.String,
  email: S.String,
  createdAt: S.Date
})

export type CreateUser = S.Schema.Type<typeof CreateUser>
export type User = S.Schema.Type<typeof User>`} />
        </Accordion>

        <Accordion id="jobs" title="jobs/ — Background Jobs">
          <CodeBlock lang="typescript" code={`// src/jobs/SendEmail.ts
import { Effect, Layer } from "effect"
import { Queue, Job } from "@gello/queue"

export const SendEmailJob = Job.define("send-email", (data: EmailData) =>
  Effect.gen(function* () {
    const mailer = yield* MailService
    yield* mailer.send(data)
  })
)

export const EmailWorker = Layer.effect(
  Queue.Worker,
  Effect.gen(function* () {
    const queue = yield* Queue
    return yield* queue.process("emails", SendEmailJob)
  })
)`} />
        </Accordion>
      </Accordions>

      <h2 id="worker-entry-point">Worker Entry Point</h2>
      <p>For background job processing, create a separate worker entry:</p>
      <CodeBlock lang="typescript" code={`// src/worker.ts
import { pipe } from "effect"
import * as Layer from "effect/Layer"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"

import { AppLayer } from "./layers"
import { EmailWorker } from "./jobs/SendEmail"

const WorkerLayer = pipe(
  EmailWorker,
  Layer.provide(AppLayer)
)

Layer.launch(WorkerLayer).pipe(NodeRuntime.runMain)`} />
    </DocsContent>
  );
}
