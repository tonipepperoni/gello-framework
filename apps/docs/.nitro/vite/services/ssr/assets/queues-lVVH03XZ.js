import { n as jsxRuntimeExports } from "../server.js";
import { C as CodeBlock } from "./CodeBlock-20dvdbBQ.js";
import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
function QueuesPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "prose", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Queues" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-zinc-400 mb-8", children: "Laravel-inspired job queues — implemented with pure Effect primitives" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "The Pattern" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "Gello's queue system takes inspiration from Laravel's elegant job dispatching API, but implements it using Effect's functional patterns. Jobs are values, workers are Layers, and everything is type-safe. Queues use ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "Context.Tag" }),
      " for the service and",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "Layer.scoped" }),
      " for lifecycle management, with Redis or Postgres as backing stores."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Queue Service Layer" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `import { Context, Effect, Layer, Queue, Fiber } from "effect"

// 1) Define the service interface
interface JobQueue<T> {
  enqueue: (job: T) => Effect.Effect<void>
  enqueueBatch: (jobs: T[]) => Effect.Effect<void>
  process: (handler: (job: T) => Effect.Effect<void>) => Effect.Effect<never>
}

class EmailQueue extends Context.Tag("EmailQueue")<
  EmailQueue,
  JobQueue<{ to: string; subject: string; body: string }>
>() {}

// 2) Create the Layer with Effect.Queue (in-memory) or Redis-backed
const EmailQueueLive = Layer.scoped(
  EmailQueue,
  Effect.gen(function* () {
    const queue = yield* Queue.unbounded<{ to: string; subject: string; body: string }>()

    return {
      enqueue: (job) => Queue.offer(queue, job),
      enqueueBatch: (jobs) => Queue.offerAll(queue, jobs),
      process: (handler) =>
        Effect.forever(
          Effect.gen(function* () {
            const job = yield* Queue.take(queue)
            yield* handler(job).pipe(
              Effect.catchAll((e) => Effect.log(\`Job failed: \${e}\`))
            )
          })
        )
    }
  })
)` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Redis-Backed Queue" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `import { Context, Effect, Layer, Stream, Schedule } from "effect"

// Redis-backed queue with persistence
const EmailQueueRedis = Layer.scoped(
  EmailQueue,
  Effect.gen(function* () {
    const redis = yield* Redis
    const queueKey = "queue:email"

    return {
      enqueue: (job) =>
        Effect.tryPromise(() =>
          redis.lpush(queueKey, JSON.stringify(job))
        ).pipe(Effect.asVoid),

      enqueueBatch: (jobs) =>
        Effect.tryPromise(() =>
          redis.lpush(queueKey, ...jobs.map((j) => JSON.stringify(j)))
        ).pipe(Effect.asVoid),

      process: (handler) =>
        Effect.forever(
          Effect.gen(function* () {
            // Blocking pop with timeout
            const result = yield* Effect.tryPromise(() =>
              redis.brpop(queueKey, 5)
            )
            if (result) {
              const job = JSON.parse(result[1])
              yield* handler(job).pipe(
                Effect.retry(Schedule.exponential("1 second").pipe(
                  Schedule.compose(Schedule.recurs(3))
                )),
                Effect.catchAll((e) => Effect.log(\`Job failed after retries: \${e}\`))
              )
            }
          })
        )
    }
  })
).pipe(Layer.provide(RedisLive))` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Dispatching Jobs" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `HttpRouter.post("/users", Effect.gen(function* () {
  const body = yield* HttpServerRequest.schemaBodyJson(CreateUser)
  const repo = yield* UserRepo
  const queue = yield* EmailQueue

  const user = yield* repo.create(body)

  // Dispatch welcome email job
  yield* queue.enqueue({
    to: user.email,
    subject: "Welcome!",
    body: "Thanks for signing up."
  })

  return yield* HttpServerResponse.schemaJson(User)(user)
}))` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Worker Process" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// src/worker.ts
import { pipe } from "effect"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"

const WorkerLayer = Layer.scopedDiscard(
  Effect.gen(function* () {
    const queue = yield* EmailQueue
    const mailer = yield* MailService

    yield* Effect.log("Worker started, processing jobs...")

    // Fork the processor to run in background
    yield* queue.process((job) =>
      Effect.gen(function* () {
        yield* mailer.send(job)
        yield* Effect.log(\`Sent email to \${job.to}\`)
      })
    ).pipe(Effect.forkScoped)
  })
)

const MainLayer = pipe(
  WorkerLayer,
  Layer.provideMerge(EmailQueueRedis),
  Layer.provideMerge(MailServiceLive),
  Layer.provideMerge(RedisLive),
  Layer.provideMerge(ConfigLive)
)

Layer.launch(MainLayer).pipe(NodeRuntime.runMain)` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { lang: "bash", code: `npx tsx src/worker.ts` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Typed Job Definitions" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `import * as S from "@effect/schema/Schema"

// Define job schemas
const EmailJob = S.Struct({
  to: S.String,
  subject: S.String,
  body: S.String,
  priority: S.optional(S.Literal("low", "normal", "high")).pipe(
    S.withDefault(() => "normal" as const)
  )
})

const UploadJob = S.Struct({
  userId: S.String,
  fileUrl: S.String,
  contentType: S.String
})

// Union of all job types
const Job = S.Union(
  S.Struct({ type: S.Literal("email"), data: EmailJob }),
  S.Struct({ type: S.Literal("upload"), data: UploadJob })
)

type Job = S.Schema.Type<typeof Job>` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Parallel Workers" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// Run N workers in parallel
const parallelWorkers = (n: number) =>
  Layer.scopedDiscard(
    Effect.gen(function* () {
      const queue = yield* EmailQueue
      const mailer = yield* MailService

      // Fork N workers
      yield* Effect.all(
        Array.from({ length: n }, (_, i) =>
          queue.process((job) =>
            Effect.gen(function* () {
              yield* Effect.log(\`Worker \${i}: processing job\`)
              yield* mailer.send(job)
            })
          ).pipe(Effect.forkScoped)
        ),
        { concurrency: "unbounded" }
      )

      yield* Effect.log(\`Started \${n} workers\`)
    })
  )` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Testing" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { code: `// In-memory test queue that tracks jobs
const createTestQueue = <T>() => {
  const jobs: T[] = []
  const processed: T[] = []

  return {
    layer: Layer.succeed(EmailQueue, {
      enqueue: (job) => Effect.sync(() => { jobs.push(job) }),
      enqueueBatch: (batch) => Effect.sync(() => { jobs.push(...batch) }),
      process: (handler) =>
        Effect.gen(function* () {
          while (jobs.length > 0) {
            const job = jobs.shift()!
            yield* handler(job)
            processed.push(job)
          }
        })
    }),
    getEnqueued: () => jobs,
    getProcessed: () => processed
  }
}

// Usage in tests
const testQueue = createTestQueue()

await Effect.runPromise(
  Effect.gen(function* () {
    const queue = yield* EmailQueue
    yield* queue.enqueue({ to: "test@test.com", subject: "Test", body: "Hello" })
    expect(testQueue.getEnqueued()).toHaveLength(1)
  }).pipe(Effect.provide(testQueue.layer))
)` })
  ] });
}
export {
  QueuesPage as component
};
