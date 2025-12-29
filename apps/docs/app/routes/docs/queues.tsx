import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock, Callout } from '../../components';

export const Route = createFileRoute('/docs/queues')({
  component: QueuesPage,
});

function QueuesPage() {
  return (
    <DocsContent
      title="Queues"
      description="Laravel-inspired job queues — implemented with pure Effect primitives"
    >
      <h2>The Pattern</h2>
      <p>
        Gello's queue system takes inspiration from Laravel's elegant job dispatching API,
        but implements it using Effect's functional patterns. Jobs are values, workers are Layers,
        and everything is type-safe.
      </p>

      <Callout type="info" title="Pure Effect">
        Queues use <code>Context.Tag</code> for the service and <code>Layer.scoped</code> for
        lifecycle management — no external queue dependency required.
      </Callout>

      <h2>Queue Service Layer</h2>
      <CodeBlock code={`import { Context, Effect, Layer, Queue, Fiber } from "effect"

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
)`} />

      <h2>Redis-Backed Queue</h2>
      <CodeBlock code={`import { Context, Effect, Layer, Stream, Schedule } from "effect"

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
).pipe(Layer.provide(RedisLive))`} />

      <h2>Dispatching Jobs</h2>
      <CodeBlock code={`HttpRouter.post("/users", Effect.gen(function* () {
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
}))`} />

      <h2>Worker Process</h2>
      <CodeBlock code={`// src/worker.ts
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

Layer.launch(MainLayer).pipe(NodeRuntime.runMain)`} />

      <CodeBlock lang="bash" code={`npx tsx src/worker.ts`} />

      <h2>Typed Job Definitions</h2>
      <CodeBlock code={`import * as S from "@effect/schema/Schema"

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

type Job = S.Schema.Type<typeof Job>`} />

      <h2>Parallel Workers</h2>
      <CodeBlock code={`// Run N workers in parallel
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
  )`} />

      <h2>Testing</h2>
      <CodeBlock code={`// In-memory test queue that tracks jobs
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
)`} />
    </DocsContent>
  );
}
