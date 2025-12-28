import { n as jsxRuntimeExports } from "../server.js";
import { C as CodeBlock } from "./CodeBlock-1L53za-Z.js";
import "node:async_hooks";
import "node:stream";
import "stream";
import "util";
import "node:stream/web";
function QueuesPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "prose", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Queues" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-zinc-400 mb-8", children: "BullMQ + Effect — jobs as values, workers as Layers" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "The Pattern" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "Queues follow the same pattern: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "Context.Tag" }),
      " for the service,",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "Layer.scoped" }),
      " with ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "acquireRelease" }),
      " for lifecycle management. BullMQ handles the heavy lifting — Effect manages the resources."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Queue Service Layer" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `import { Context, Effect, Layer } from "effect"
import { Queue, Worker, type Job } from "bullmq"
import IORedis from "ioredis"

// 1) Define the service interface
interface QueueService {
  add: <T>(name: string, data: T) => Effect.Effect<void>
  addBulk: <T>(name: string, jobs: T[]) => Effect.Effect<void>
}

class JobQueue extends Context.Tag("JobQueue")<JobQueue, QueueService>() {}

// 2) Create the Layer with proper lifecycle
const JobQueueLive = Layer.scoped(
  JobQueue,
  Effect.gen(function* () {
    const cfg = yield* Config
    const connection = new IORedis(cfg.REDIS_URL, { maxRetriesPerRequest: null })
    const queue = new Queue("default", { connection })

    yield* Effect.addFinalizer(() =>
      Effect.tryPromise(async () => {
        await queue.close()
        await connection.quit()
      }).pipe(Effect.orDie)
    )

    return {
      add: (name, data) =>
        Effect.tryPromise(() => queue.add(name, data)).pipe(Effect.asVoid),
      addBulk: (name, jobs) =>
        Effect.tryPromise(() =>
          queue.addBulk(jobs.map((data) => ({ name, data })))
        ).pipe(Effect.asVoid)
    }
  })
).pipe(Layer.provide(ConfigLive))` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Dispatching Jobs" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `import * as S from "@effect/schema/Schema"

const SendEmailPayload = S.Struct({
  to: S.String,
  subject: S.String,
  body: S.String
})

HttpRouter.post("/users", Effect.gen(function* () {
  const body = yield* HttpServerRequest.schemaBodyJson(CreateUser)
  const repo = yield* UserRepo
  const queue = yield* JobQueue

  const user = yield* repo.create(body)

  // Dispatch welcome email job
  yield* queue.add("send-email", {
    to: user.email,
    subject: "Welcome!",
    body: "Thanks for signing up."
  })

  return yield* HttpServerResponse.schemaJson(User)(user)
}))` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Worker Layer" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// Workers are also Layers — compose at the edge
const WorkerLayer = Layer.scoped(
  Layer.Tag<void>()("Worker"),
  Effect.gen(function* () {
    const cfg = yield* Config
    const mailer = yield* MailService

    const connection = new IORedis(cfg.REDIS_URL, { maxRetriesPerRequest: null })
    const worker = new Worker(
      "default",
      async (job: Job) => {
        switch (job.name) {
          case "send-email":
            await Effect.runPromise(mailer.send(job.data))
            break
          // Add more job handlers
        }
      },
      { connection, concurrency: 5 }
    )

    yield* Effect.addFinalizer(() =>
      Effect.tryPromise(async () => {
        await worker.close()
        await connection.quit()
      }).pipe(Effect.orDie)
    )

    yield* Effect.log("Worker started")
  })
).pipe(Layer.provide(ConfigLive), Layer.provide(MailServiceLive))` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Running the Worker" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// src/worker.ts
import { pipe } from "effect"
import * as Layer from "effect/Layer"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"

const MainLayer = pipe(
  WorkerLayer,
  Layer.provide(ConfigLive),
  Layer.provide(MailServiceLive),
  Layer.provide(RedisLive)
)

Layer.launch(MainLayer).pipe(NodeRuntime.runMain)` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { lang: "bash", code: `npx tsx src/worker.ts` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Typed Job Handlers" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// Type-safe job definitions
type JobHandlers = {
  "send-email": { to: string; subject: string; body: string }
  "process-upload": { userId: string; fileUrl: string }
  "generate-report": { reportId: string; format: "pdf" | "csv" }
}

const handleJob = <K extends keyof JobHandlers>(
  name: K,
  handler: (data: JobHandlers[K]) => Effect.Effect<void>
) => ({ name, handler })

const handlers = [
  handleJob("send-email", (data) =>
    Effect.gen(function* () {
      const mailer = yield* MailService
      yield* mailer.send(data)
    })
  ),
  handleJob("process-upload", (data) =>
    Effect.gen(function* () {
      const storage = yield* StorageService
      yield* storage.process(data.fileUrl, data.userId)
    })
  )
]` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Testing" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// Mock queue for tests
const JobQueueTest = Layer.succeed(JobQueue, {
  add: () => Effect.void,
  addBulk: () => Effect.void
})

// Track dispatched jobs
const createTestQueue = () => {
  const jobs: Array<{ name: string; data: unknown }> = []
  return {
    layer: Layer.succeed(JobQueue, {
      add: (name, data) => Effect.sync(() => { jobs.push({ name, data }) }),
      addBulk: (name, items) => Effect.sync(() => {
        items.forEach((data) => jobs.push({ name, data }))
      })
    }),
    getJobs: () => jobs
  }
}` })
  ] });
}
export {
  QueuesPage as component
};
