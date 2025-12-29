import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock } from '../../components';

export const Route = createFileRoute('/docs/directory-structure')({
  component: DirectoryStructurePage,
});

function DirectoryStructurePage() {
  return (
    <DocsContent
      title="Directory Structure"
      description="Recommended project layout for Gello applications"
    >
      <h2>Standard Layout</h2>
      <CodeBlock lang="text" code={`src/
├── main.ts              # Entry point — Layer.launch(MainLayer)
├── layers/
│   ├── index.ts         # Export AppLayer (merged layers)
│   ├── Config.ts        # Config Layer with Effect.Config
│   ├── Database.ts      # PgPool + Drizzle Layers
│   └── Redis.ts         # Redis Layer with acquireRelease
├── services/
│   ├── UserRepo.ts      # Repository Layers
│   ├── PostRepo.ts
│   └── MailService.ts   # External service integrations
├── routes/
│   ├── index.ts         # Export all routes
│   ├── users.ts         # User route handlers
│   └── posts.ts         # Post route handlers
├── jobs/
│   ├── SendEmail.ts     # Job definitions
│   └── ProcessUpload.ts
├── schemas/
│   ├── User.ts          # @effect/schema definitions
│   └── Post.ts
└── lib/
    ├── db/
    │   └── schema.ts    # Drizzle schema definitions
    └── errors.ts        # Tagged error classes`} />

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

      <h2>Layers Directory</h2>
      <CodeBlock code={`// src/layers/index.ts
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

      <h2>Services Directory</h2>
      <p>
        Each service is a <code>Context.Tag</code> with a <code>Layer</code> implementation.
      </p>

      <CodeBlock code={`// src/services/UserRepo.ts
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

      <h2>Routes Directory</h2>
      <CodeBlock code={`// src/routes/index.ts
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

      <h2>Schemas Directory</h2>
      <CodeBlock code={`// src/schemas/User.ts
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

      <h2>Worker Entry Point</h2>
      <CodeBlock code={`// src/worker.ts
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
