# Queue System Architecture (DDD + Hexagonal)

## Overview

The Gello queue system is built using **Domain-Driven Design** and **Hexagonal Architecture** (Ports & Adapters), split into granular sub-libs for optimal **NX caching**. Pure Effect implementation — no external queue dependencies.

---

## Hexagonal Architecture

```
                    ┌─────────────────────────────────────────────┐
                    │              APPLICATION LAYER              │
                    │                                             │
                    │  ┌─────────────┐     ┌─────────────────┐   │
                    │  │  Producer   │     │     Worker      │   │
                    │  │    SDK      │     │    Runtime      │   │
                    │  └──────┬──────┘     └────────┬────────┘   │
                    │         │                     │             │
                    └─────────┼─────────────────────┼─────────────┘
                              │                     │
                    ┌─────────▼─────────────────────▼─────────────┐
                    │               DOMAIN LAYER                  │
                    │                                             │
                    │  ┌─────────┐  ┌─────────┐  ┌───────────┐   │
                    │  │   Job   │  │  Queue  │  │  Retry    │   │
                    │  │ Entity  │  │ Service │  │  Policy   │   │
                    │  └─────────┘  └─────────┘  └───────────┘   │
                    │                                             │
                    │  ┌─────────────┐  ┌──────────────────────┐ │
                    │  │ Idempotency │  │ Failure Classifier   │ │
                    │  └─────────────┘  └──────────────────────┘ │
                    │                                             │
                    └───────────────────┬─────────────────────────┘
                                        │
                              ┌─────────▼─────────┐
                              │      PORTS        │
                              │   (Interfaces)    │
                              └─────────┬─────────┘
                                        │
          ┌─────────────────────────────┼─────────────────────────────┐
          │                             │                             │
    ┌─────▼─────┐               ┌───────▼───────┐             ┌───────▼───────┐
    │  Memory   │               │    Redis      │             │   Postgres    │
    │  Adapter  │               │   Adapter     │             │   Adapter     │
    └───────────┘               └───────────────┘             └───────────────┘
          │                             │                             │
    ┌─────▼─────┐               ┌───────▼───────┐             ┌───────▼───────┐
    │ Effect    │               │    Redis      │             │   Database    │
    │ Queue     │               │   (ioredis)   │             │   (Drizzle)   │
    └───────────┘               └───────────────┘             └───────────────┘
```

---

## NX Library Structure (Granular Sub-Libs)

```
libs/queue/
├── contracts/           # Ports & shared types (zero deps)
│   └── src/*.test.ts    # Unit tests for schemas & types
├── domain/              # Core domain logic
│   ├── job/             # Job entity & value objects
│   │   └── src/*.test.ts
│   ├── retry/           # Retry policies & backoff
│   │   └── src/*.test.ts
│   ├── idempotency/     # Exactly-once guarantees
│   │   └── src/*.test.ts
│   └── failure/         # Failure classification
│       └── src/*.test.ts
├── producer/            # Producer SDK
│   └── src/*.test.ts
├── worker/              # Worker runtime
│   ├── core/            # Worker loop & lifecycle
│   │   └── src/*.test.ts
│   ├── pool/            # Worker pool management
│   │   └── src/*.test.ts
│   └── signals/         # Graceful shutdown
│       └── src/*.test.ts
├── adapters/            # Infrastructure adapters
│   ├── memory/          # In-memory (dev/test)
│   │   └── src/*.test.ts
│   ├── redis/           # Redis driver
│   │   └── src/*.test.ts  # Uses testcontainers
│   └── postgres/        # PostgreSQL driver
│       └── src/*.test.ts  # Uses testcontainers
├── dlq/                 # Dead letter queue
│   └── src/*.test.ts
├── observability/       # Metrics, tracing, logging
│   └── src/*.test.ts
├── ops/                 # Operator tooling & CLI
│   └── src/*.test.ts
└── testing/             # Test UTILITIES for consumers (not tests!)
    └── src/             # Provides Layers & fixtures for app tests
```

---

## Library Dependencies (NX Graph)

```
contracts (no deps)
    ↓
domain/job ← domain/retry ← domain/idempotency ← domain/failure
    ↓
producer ← worker/core ← worker/pool ← worker/signals
    ↓
adapters/memory | adapters/redis | adapters/postgres
    ↓
dlq ← observability ← ops
    ↓
testing (depends on contracts + adapters/memory)
```

---

## A) Architecture & Contracts (Core)

### `libs/queue/contracts/`

**Purpose:** Zero-dependency types, schemas, and interfaces (ports).

```typescript
// libs/queue/contracts/src/index.ts

import * as S from "@effect/schema/Schema"

// ─── Job Schema ───────────────────────────────────────────────
export const JobId = S.String.pipe(S.brand("JobId"))
export type JobId = S.Schema.Type<typeof JobId>

export const JobStatus = S.Literal(
  "pending",
  "processing",
  "completed",
  "failed",
  "dead"
)
export type JobStatus = S.Schema.Type<typeof JobStatus>

export const JobPriority = S.Literal("low", "normal", "high", "critical")
export type JobPriority = S.Schema.Type<typeof JobPriority>

export const JobMeta = S.Struct({
  id: JobId,
  queue: S.String,
  jobType: S.String,
  priority: JobPriority,
  attempts: S.Number,
  maxAttempts: S.Number,
  createdAt: S.Date,
  scheduledAt: S.Date,
  startedAt: S.optionalWith(S.Date, { nullable: true }),
  completedAt: S.optionalWith(S.Date, { nullable: true }),
  failedAt: S.optionalWith(S.Date, { nullable: true }),
  idempotencyKey: S.optionalWith(S.String, { nullable: true }),
})
export type JobMeta = S.Schema.Type<typeof JobMeta>

export const SerializedJob = S.Struct({
  meta: JobMeta,
  payload: S.Unknown,
  lastError: S.optionalWith(S.String, { nullable: true }),
})
export type SerializedJob = S.Schema.Type<typeof SerializedJob>

// ─── Port Interfaces ──────────────────────────────────────────
export interface QueuePort {
  readonly push: (job: SerializedJob) => Effect.Effect<JobId, QueueError>
  readonly pop: (queue: string, timeout?: Duration) => Effect.Effect<SerializedJob | null, QueueError>
  readonly schedule: (job: SerializedJob, at: Date) => Effect.Effect<JobId, QueueError>
  readonly ack: (jobId: JobId) => Effect.Effect<void, QueueError>
  readonly nack: (jobId: JobId, error: string, retryAt?: Date) => Effect.Effect<void, QueueError>
  readonly dead: (jobId: JobId, error: string) => Effect.Effect<void, QueueError>
  readonly peek: (queue: string, limit?: number) => Effect.Effect<SerializedJob[], QueueError>
  readonly stats: (queue: string) => Effect.Effect<QueueStats, QueueError>
}

export interface IdempotencyPort {
  readonly acquire: (key: string, ttl: Duration) => Effect.Effect<boolean, IdempotencyError>
  readonly release: (key: string) => Effect.Effect<void, IdempotencyError>
  readonly check: (key: string) => Effect.Effect<IdempotencyState, IdempotencyError>
}

export interface DLQPort {
  readonly push: (job: SerializedJob, reason: string) => Effect.Effect<void, DLQError>
  readonly list: (queue: string, opts: PaginationOpts) => Effect.Effect<FailedJob[], DLQError>
  readonly retry: (jobId: JobId) => Effect.Effect<void, DLQError>
  readonly retryAll: (queue: string) => Effect.Effect<number, DLQError>
  readonly purge: (queue: string, olderThan?: Date) => Effect.Effect<number, DLQError>
}

export interface ObservabilityPort {
  readonly jobEnqueued: (job: SerializedJob) => Effect.Effect<void>
  readonly jobStarted: (job: SerializedJob) => Effect.Effect<void>
  readonly jobCompleted: (job: SerializedJob, duration: Duration) => Effect.Effect<void>
  readonly jobFailed: (job: SerializedJob, error: unknown, willRetry: boolean) => Effect.Effect<void>
  readonly jobDead: (job: SerializedJob, error: unknown) => Effect.Effect<void>
  readonly workerStarted: (workerId: string) => Effect.Effect<void>
  readonly workerStopped: (workerId: string) => Effect.Effect<void>
  readonly workerHealthCheck: (workerId: string, healthy: boolean) => Effect.Effect<void>
}

// ─── Error Types ──────────────────────────────────────────────
export class QueueError extends Data.TaggedError("QueueError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class IdempotencyError extends Data.TaggedError("IdempotencyError")<{
  readonly message: string
  readonly key: string
}> {}

export class DLQError extends Data.TaggedError("DLQError")<{
  readonly message: string
  readonly cause?: unknown
}> {}
```

**NX Config:**
```json
{
  "name": "@gello/queue-contracts",
  "tags": ["queue", "type:lib", "layer:contracts"],
  "implicitDependencies": []
}
```

---

## B) Backend Selection & Implementation (Pluggable Drivers)

### `libs/queue/adapters/memory/`

In-memory adapter for development and testing.

```typescript
// libs/queue/adapters/memory/src/MemoryAdapter.ts

import { Context, Effect, Layer, Queue, Ref } from "effect"
import type { QueuePort, SerializedJob, JobId } from "@gello/queue-contracts"

export class MemoryQueueAdapter extends Context.Tag("MemoryQueueAdapter")<
  MemoryQueueAdapter,
  QueuePort
>() {}

export const MemoryQueueAdapterLive = Layer.scoped(
  MemoryQueueAdapter,
  Effect.gen(function* () {
    const queues = yield* Ref.make<Map<string, Queue.Queue<SerializedJob>>>(new Map())
    const scheduled = yield* Ref.make<SerializedJob[]>([])
    const processed = yield* Ref.make<Set<JobId>>(new Set())

    // Background scheduler
    yield* Effect.fork(
      Effect.forever(
        Effect.gen(function* () {
          yield* Effect.sleep("100 millis")
          const now = new Date()
          const jobs = yield* Ref.get(scheduled)
          const ready = jobs.filter(j => j.meta.scheduledAt <= now)
          const pending = jobs.filter(j => j.meta.scheduledAt > now)

          yield* Ref.set(scheduled, pending)

          for (const job of ready) {
            const q = yield* getOrCreateQueue(queues, job.meta.queue)
            yield* Queue.offer(q, job)
          }
        })
      )
    )

    return {
      push: (job) =>
        Effect.gen(function* () {
          const q = yield* getOrCreateQueue(queues, job.meta.queue)
          yield* Queue.offer(q, job)
          return job.meta.id
        }),

      pop: (queue, timeout) =>
        Effect.gen(function* () {
          const q = yield* getOrCreateQueue(queues, queue)
          const result = yield* Queue.poll(q)
          return result._tag === "Some" ? result.value : null
        }),

      schedule: (job, at) =>
        Effect.gen(function* () {
          const scheduled = { ...job, meta: { ...job.meta, scheduledAt: at } }
          yield* Ref.update(scheduled, (jobs) => [...jobs, scheduled])
          return job.meta.id
        }),

      ack: (jobId) =>
        Ref.update(processed, (set) => set.add(jobId)),

      nack: (jobId, error, retryAt) =>
        Effect.void, // Re-enqueue handled by worker

      dead: (jobId, error) =>
        Effect.void, // DLQ handled separately

      peek: (queue, limit = 10) =>
        Effect.gen(function* () {
          const q = yield* getOrCreateQueue(queues, queue)
          return yield* Queue.takeUpTo(q, limit)
        }),

      stats: (queue) =>
        Effect.gen(function* () {
          const q = yield* getOrCreateQueue(queues, queue)
          const size = yield* Queue.size(q)
          return { queue, pending: size, processing: 0, failed: 0, dead: 0 }
        }),
    }
  })
)
```

### `libs/queue/adapters/redis/`

Production Redis adapter using ioredis.

```typescript
// libs/queue/adapters/redis/src/RedisAdapter.ts

import { Context, Effect, Layer } from "effect"
import type { QueuePort, SerializedJob, JobId } from "@gello/queue-contracts"
import type { Redis } from "@gello/redis"

export class RedisQueueAdapter extends Context.Tag("RedisQueueAdapter")<
  RedisQueueAdapter,
  QueuePort
>() {}

export const RedisQueueAdapterLive = Layer.effect(
  RedisQueueAdapter,
  Effect.gen(function* () {
    const redis = yield* Redis

    const keyPrefix = "gello:queue:"
    const scheduledKey = (queue: string) => `${keyPrefix}${queue}:scheduled`
    const pendingKey = (queue: string) => `${keyPrefix}${queue}:pending`
    const processingKey = (queue: string) => `${keyPrefix}${queue}:processing`

    return {
      push: (job) =>
        Effect.tryPromise({
          try: async () => {
            await redis.lpush(pendingKey(job.meta.queue), JSON.stringify(job))
            return job.meta.id
          },
          catch: (e) => new QueueError({ message: "Push failed", cause: e }),
        }),

      pop: (queue, timeout) =>
        Effect.tryPromise({
          try: async () => {
            const result = await redis.brpoplpush(
              pendingKey(queue),
              processingKey(queue),
              timeout ? Math.ceil(Duration.toSeconds(timeout)) : 5
            )
            return result ? JSON.parse(result) : null
          },
          catch: (e) => new QueueError({ message: "Pop failed", cause: e }),
        }),

      schedule: (job, at) =>
        Effect.tryPromise({
          try: async () => {
            const score = at.getTime()
            await redis.zadd(scheduledKey(job.meta.queue), score, JSON.stringify(job))
            return job.meta.id
          },
          catch: (e) => new QueueError({ message: "Schedule failed", cause: e }),
        }),

      ack: (jobId) =>
        Effect.tryPromise({
          try: async () => {
            // Remove from processing list
            await redis.lrem(processingKey("*"), 1, jobId)
          },
          catch: (e) => new QueueError({ message: "Ack failed", cause: e }),
        }),

      nack: (jobId, error, retryAt) =>
        Effect.tryPromise({
          try: async () => {
            if (retryAt) {
              // Schedule for retry
              const job = await redis.lindex(processingKey("*"), 0)
              if (job) {
                await redis.zadd(scheduledKey("default"), retryAt.getTime(), job)
              }
            }
          },
          catch: (e) => new QueueError({ message: "Nack failed", cause: e }),
        }),

      dead: (jobId, error) =>
        Effect.void, // Handled by DLQ adapter

      peek: (queue, limit = 10) =>
        Effect.tryPromise({
          try: async () => {
            const results = await redis.lrange(pendingKey(queue), 0, limit - 1)
            return results.map((r) => JSON.parse(r))
          },
          catch: (e) => new QueueError({ message: "Peek failed", cause: e }),
        }),

      stats: (queue) =>
        Effect.tryPromise({
          try: async () => ({
            queue,
            pending: await redis.llen(pendingKey(queue)),
            processing: await redis.llen(processingKey(queue)),
            failed: 0,
            dead: await redis.zcard(`${keyPrefix}${queue}:dead`),
          }),
          catch: (e) => new QueueError({ message: "Stats failed", cause: e }),
        }),
    }
  })
).pipe(Layer.provide(RedisLive))
```

### `libs/queue/adapters/postgres/`

PostgreSQL adapter using Drizzle.

```typescript
// libs/queue/adapters/postgres/src/PostgresAdapter.ts

import { Context, Effect, Layer } from "effect"
import { eq, and, lte, sql } from "drizzle-orm"
import type { QueuePort, SerializedJob, JobId } from "@gello/queue-contracts"
import type { Database } from "@gello/database-drizzle"
import { jobs, failedJobs } from "./schema"

export class PostgresQueueAdapter extends Context.Tag("PostgresQueueAdapter")<
  PostgresQueueAdapter,
  QueuePort
>() {}

export const PostgresQueueAdapterLive = Layer.effect(
  PostgresQueueAdapter,
  Effect.gen(function* () {
    const db = yield* Database

    return {
      push: (job) =>
        Effect.tryPromise({
          try: async () => {
            const [result] = await db.insert(jobs).values({
              id: job.meta.id,
              queue: job.meta.queue,
              jobType: job.meta.jobType,
              priority: job.meta.priority,
              payload: job.payload,
              maxAttempts: job.meta.maxAttempts,
              scheduledAt: job.meta.scheduledAt,
            }).returning({ id: jobs.id })
            return result.id as JobId
          },
          catch: (e) => new QueueError({ message: "Push failed", cause: e }),
        }),

      pop: (queue, timeout) =>
        Effect.tryPromise({
          try: async () => {
            const now = new Date()
            const [job] = await db
              .update(jobs)
              .set({
                startedAt: now,
                attempts: sql`${jobs.attempts} + 1`
              })
              .where(and(
                eq(jobs.queue, queue),
                lte(jobs.scheduledAt, now),
                sql`${jobs.startedAt} IS NULL`
              ))
              .orderBy(jobs.priority, jobs.scheduledAt)
              .limit(1)
              .returning()

            if (!job) return null

            return {
              meta: {
                id: job.id as JobId,
                queue: job.queue,
                jobType: job.jobType,
                priority: job.priority,
                attempts: job.attempts,
                maxAttempts: job.maxAttempts,
                createdAt: job.createdAt,
                scheduledAt: job.scheduledAt,
                startedAt: job.startedAt,
                completedAt: null,
                failedAt: null,
                idempotencyKey: job.idempotencyKey,
              },
              payload: job.payload,
              lastError: null,
            } as SerializedJob
          },
          catch: (e) => new QueueError({ message: "Pop failed", cause: e }),
        }),

      schedule: (job, at) =>
        Effect.tryPromise({
          try: async () => {
            const [result] = await db.insert(jobs).values({
              id: job.meta.id,
              queue: job.meta.queue,
              jobType: job.meta.jobType,
              priority: job.meta.priority,
              payload: job.payload,
              maxAttempts: job.meta.maxAttempts,
              scheduledAt: at,
            }).returning({ id: jobs.id })
            return result.id as JobId
          },
          catch: (e) => new QueueError({ message: "Schedule failed", cause: e }),
        }),

      ack: (jobId) =>
        Effect.tryPromise({
          try: async () => {
            await db.delete(jobs).where(eq(jobs.id, jobId))
          },
          catch: (e) => new QueueError({ message: "Ack failed", cause: e }),
        }),

      nack: (jobId, error, retryAt) =>
        Effect.tryPromise({
          try: async () => {
            await db.update(jobs).set({
              startedAt: null,
              scheduledAt: retryAt ?? new Date(),
              lastError: error,
            }).where(eq(jobs.id, jobId))
          },
          catch: (e) => new QueueError({ message: "Nack failed", cause: e }),
        }),

      dead: (jobId, error) =>
        Effect.tryPromise({
          try: async () => {
            const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId))
            if (job) {
              await db.insert(failedJobs).values({
                jobId: job.id,
                queue: job.queue,
                jobType: job.jobType,
                payload: job.payload,
                exception: error,
              })
              await db.delete(jobs).where(eq(jobs.id, jobId))
            }
          },
          catch: (e) => new QueueError({ message: "Dead failed", cause: e }),
        }),

      peek: (queue, limit = 10) =>
        Effect.tryPromise({
          try: async () => {
            const results = await db.select().from(jobs)
              .where(eq(jobs.queue, queue))
              .orderBy(jobs.priority, jobs.scheduledAt)
              .limit(limit)
            return results.map(toSerializedJob)
          },
          catch: (e) => new QueueError({ message: "Peek failed", cause: e }),
        }),

      stats: (queue) =>
        Effect.tryPromise({
          try: async () => {
            const pending = await db.select({ count: sql`count(*)` })
              .from(jobs)
              .where(and(eq(jobs.queue, queue), sql`${jobs.startedAt} IS NULL`))
            const processing = await db.select({ count: sql`count(*)` })
              .from(jobs)
              .where(and(eq(jobs.queue, queue), sql`${jobs.startedAt} IS NOT NULL`))
            const dead = await db.select({ count: sql`count(*)` })
              .from(failedJobs)
              .where(eq(failedJobs.queue, queue))

            return {
              queue,
              pending: Number(pending[0]?.count ?? 0),
              processing: Number(processing[0]?.count ?? 0),
              failed: 0,
              dead: Number(dead[0]?.count ?? 0),
            }
          },
          catch: (e) => new QueueError({ message: "Stats failed", cause: e }),
        }),
    }
  })
).pipe(Layer.provide(DatabaseLive))
```

---

## C) Producer SDK (Typed Enqueue APIs)

### `libs/queue/producer/`

Type-safe job dispatching API.

```typescript
// libs/queue/producer/src/index.ts

import { Context, Effect, Layer } from "effect"
import * as S from "@effect/schema/Schema"
import type { QueuePort, JobId, JobPriority, SerializedJob } from "@gello/queue-contracts"

// ─── Job Definition ───────────────────────────────────────────
export interface JobDefinition<T> {
  readonly type: string
  readonly schema: S.Schema<T>
  readonly queue?: string
  readonly priority?: JobPriority
  readonly maxAttempts?: number
  readonly backoff?: readonly number[]
  readonly idempotencyKey?: (payload: T) => string
}

export const defineJob = <T>(config: JobDefinition<T>): JobDefinition<T> => config

// ─── Producer Service ─────────────────────────────────────────
export class QueueProducer extends Context.Tag("QueueProducer")<
  QueueProducer,
  {
    readonly dispatch: <T>(
      job: JobDefinition<T>,
      payload: T,
      opts?: DispatchOptions
    ) => Effect.Effect<JobId, QueueError>

    readonly dispatchAfter: <T>(
      job: JobDefinition<T>,
      payload: T,
      delay: Duration,
      opts?: DispatchOptions
    ) => Effect.Effect<JobId, QueueError>

    readonly dispatchAt: <T>(
      job: JobDefinition<T>,
      payload: T,
      at: Date,
      opts?: DispatchOptions
    ) => Effect.Effect<JobId, QueueError>

    readonly dispatchBatch: <T>(
      job: JobDefinition<T>,
      payloads: T[],
      opts?: DispatchOptions
    ) => Effect.Effect<JobId[], QueueError>
  }
>() {}

export interface DispatchOptions {
  readonly queue?: string
  readonly priority?: JobPriority
  readonly idempotencyKey?: string
}

export const QueueProducerLive = Layer.effect(
  QueueProducer,
  Effect.gen(function* () {
    const queue = yield* QueuePort
    const observability = yield* ObservabilityPort

    const createJob = <T>(
      definition: JobDefinition<T>,
      payload: T,
      opts: DispatchOptions & { scheduledAt: Date }
    ): SerializedJob => ({
      meta: {
        id: generateJobId(),
        queue: opts.queue ?? definition.queue ?? "default",
        jobType: definition.type,
        priority: opts.priority ?? definition.priority ?? "normal",
        attempts: 0,
        maxAttempts: definition.maxAttempts ?? 3,
        createdAt: new Date(),
        scheduledAt: opts.scheduledAt,
        startedAt: null,
        completedAt: null,
        failedAt: null,
        idempotencyKey: opts.idempotencyKey ?? definition.idempotencyKey?.(payload) ?? null,
      },
      payload: S.encodeSync(definition.schema)(payload),
      lastError: null,
    })

    return {
      dispatch: (job, payload, opts = {}) =>
        Effect.gen(function* () {
          const serialized = createJob(job, payload, { ...opts, scheduledAt: new Date() })
          yield* observability.jobEnqueued(serialized)
          return yield* queue.push(serialized)
        }),

      dispatchAfter: (job, payload, delay, opts = {}) =>
        Effect.gen(function* () {
          const at = new Date(Date.now() + Duration.toMillis(delay))
          const serialized = createJob(job, payload, { ...opts, scheduledAt: at })
          yield* observability.jobEnqueued(serialized)
          return yield* queue.schedule(serialized, at)
        }),

      dispatchAt: (job, payload, at, opts = {}) =>
        Effect.gen(function* () {
          const serialized = createJob(job, payload, { ...opts, scheduledAt: at })
          yield* observability.jobEnqueued(serialized)
          return yield* queue.schedule(serialized, at)
        }),

      dispatchBatch: (job, payloads, opts = {}) =>
        Effect.all(
          payloads.map((payload) =>
            Effect.gen(function* () {
              const serialized = createJob(job, payload, { ...opts, scheduledAt: new Date() })
              yield* observability.jobEnqueued(serialized)
              return yield* queue.push(serialized)
            })
          ),
          { concurrency: 10 }
        ),
    }
  })
)

// ─── Usage Example ────────────────────────────────────────────
// const SendWelcomeEmail = defineJob({
//   type: "email.welcome",
//   schema: S.Struct({ userId: S.String, email: S.String }),
//   queue: "emails",
//   priority: "high",
//   maxAttempts: 5,
//   backoff: [60, 300, 900, 3600],
//   idempotencyKey: (p) => `welcome:${p.userId}`,
// })
//
// Effect.gen(function* () {
//   const producer = yield* QueueProducer
//   yield* producer.dispatch(SendWelcomeEmail, { userId: "123", email: "user@example.com" })
// })
```

---

## D) Worker Runtime

### `libs/queue/worker/core/`

Core worker loop and job execution.

```typescript
// libs/queue/worker/core/src/Worker.ts

import { Context, Effect, Layer, Fiber, Scope, Ref, Semaphore } from "effect"
import type { QueuePort, SerializedJob, ObservabilityPort } from "@gello/queue-contracts"
import type { RetryPolicy } from "@gello/queue-domain-retry"
import type { FailureClassifier } from "@gello/queue-domain-failure"

export interface WorkerConfig {
  readonly queues: string[]
  readonly concurrency: number
  readonly pollInterval: Duration
  readonly jobTimeout: Duration
  readonly shutdownTimeout: Duration
}

export class Worker extends Context.Tag("Worker")<
  Worker,
  {
    readonly start: () => Effect.Effect<void, never, Scope.Scope>
    readonly stop: () => Effect.Effect<void>
    readonly isRunning: () => Effect.Effect<boolean>
    readonly stats: () => Effect.Effect<WorkerStats>
  }
>() {}

export interface WorkerStats {
  readonly workerId: string
  readonly processed: number
  readonly failed: number
  readonly uptime: Duration
  readonly currentJobs: number
}

export const WorkerLive = Layer.scoped(
  Worker,
  Effect.gen(function* () {
    const queue = yield* QueuePort
    const observability = yield* ObservabilityPort
    const retryPolicy = yield* RetryPolicy
    const failureClassifier = yield* FailureClassifier
    const config = yield* WorkerConfig
    const handlers = yield* JobHandlers

    const workerId = generateWorkerId()
    const running = yield* Ref.make(false)
    const processed = yield* Ref.make(0)
    const failed = yield* Ref.make(0)
    const startTime = yield* Ref.make<Date | null>(null)
    const currentFibers = yield* Ref.make<Set<Fiber.RuntimeFiber<unknown, unknown>>>(new Set())
    const semaphore = yield* Semaphore.make(config.concurrency)

    const processJob = (job: SerializedJob) =>
      Effect.gen(function* () {
        yield* observability.jobStarted(job)
        const startedAt = Date.now()

        const handler = handlers.get(job.meta.jobType)
        if (!handler) {
          yield* Effect.fail(new Error(`No handler for job type: ${job.meta.jobType}`))
        }

        yield* handler(job.payload).pipe(
          Effect.timeout(config.jobTimeout),
          Effect.catchAll((error) =>
            Effect.gen(function* () {
              const classification = yield* failureClassifier.classify(error)

              if (classification === "transient" && job.meta.attempts < job.meta.maxAttempts) {
                const delay = yield* retryPolicy.nextDelay(job.meta.attempts)
                const retryAt = new Date(Date.now() + Duration.toMillis(delay))
                yield* queue.nack(job.meta.id, String(error), retryAt)
                yield* observability.jobFailed(job, error, true)
              } else {
                yield* queue.dead(job.meta.id, String(error))
                yield* observability.jobDead(job, error)
              }

              yield* Ref.update(failed, (n) => n + 1)
            })
          )
        )

        const duration = Duration.millis(Date.now() - startedAt)
        yield* queue.ack(job.meta.id)
        yield* observability.jobCompleted(job, duration)
        yield* Ref.update(processed, (n) => n + 1)
      })

    const pollQueue = (queueName: string) =>
      Effect.gen(function* () {
        const job = yield* queue.pop(queueName, config.pollInterval)
        if (job) {
          yield* Semaphore.withPermits(semaphore, 1)(
            Effect.gen(function* () {
              const fiber = yield* Effect.fork(processJob(job))
              yield* Ref.update(currentFibers, (set) => set.add(fiber))
              yield* Fiber.await(fiber)
              yield* Ref.update(currentFibers, (set) => {
                set.delete(fiber)
                return set
              })
            })
          )
        }
      })

    const runLoop = Effect.gen(function* () {
      while (yield* Ref.get(running)) {
        for (const queueName of config.queues) {
          yield* pollQueue(queueName).pipe(
            Effect.catchAll((e) => Effect.log(`Poll error: ${e}`))
          )
        }
        yield* Effect.sleep(config.pollInterval)
      }
    })

    // Graceful shutdown on finalization
    yield* Effect.addFinalizer(() =>
      Effect.gen(function* () {
        yield* Ref.set(running, false)
        yield* observability.workerStopped(workerId)

        // Wait for current jobs with timeout
        const fibers = yield* Ref.get(currentFibers)
        yield* Effect.all(
          Array.from(fibers).map((f) => Fiber.await(f)),
          { concurrency: "unbounded" }
        ).pipe(
          Effect.timeout(config.shutdownTimeout),
          Effect.catchAll(() => Effect.log("Shutdown timeout, interrupting jobs"))
        )
      })
    )

    return {
      start: () =>
        Effect.gen(function* () {
          yield* Ref.set(running, true)
          yield* Ref.set(startTime, new Date())
          yield* observability.workerStarted(workerId)
          yield* Effect.forkScoped(runLoop)
        }),

      stop: () =>
        Effect.gen(function* () {
          yield* Ref.set(running, false)
        }),

      isRunning: () => Ref.get(running),

      stats: () =>
        Effect.gen(function* () {
          const start = yield* Ref.get(startTime)
          const current = yield* Ref.get(currentFibers)
          return {
            workerId,
            processed: yield* Ref.get(processed),
            failed: yield* Ref.get(failed),
            uptime: start ? Duration.millis(Date.now() - start.getTime()) : Duration.zero,
            currentJobs: current.size,
          }
        }),
    }
  })
)
```

### `libs/queue/worker/signals/`

Graceful shutdown signal handling.

```typescript
// libs/queue/worker/signals/src/SignalHandler.ts

import { Effect, Layer } from "effect"
import type { Worker } from "@gello/queue-worker-core"

export const withGracefulShutdown = <A, E, R>(
  worker: Effect.Effect<A, E, R>
) =>
  Effect.gen(function* () {
    const w = yield* Worker

    // Register signal handlers
    yield* Effect.sync(() => {
      const shutdown = () => {
        Effect.runFork(w.stop())
      }
      process.on("SIGTERM", shutdown)
      process.on("SIGINT", shutdown)
    })

    yield* w.start()

    // Keep alive until stopped
    while (yield* w.isRunning()) {
      yield* Effect.sleep("1 second")
    }
  })

export const WorkerMainLayer = (config: WorkerConfig) =>
  Layer.scopedDiscard(
    Effect.gen(function* () {
      yield* Effect.log("Starting worker...")
      yield* withGracefulShutdown(Effect.void)
    })
  ).pipe(
    Layer.provideMerge(WorkerLive),
    Layer.provideMerge(Layer.succeed(WorkerConfig, config))
  )
```

---

## E) Retry Policy + Failure Classification

### `libs/queue/domain/retry/`

```typescript
// libs/queue/domain/retry/src/RetryPolicy.ts

import { Context, Effect, Layer } from "effect"

export type BackoffStrategy = "fixed" | "exponential" | "linear" | "custom"

export interface RetryPolicyConfig {
  readonly strategy: BackoffStrategy
  readonly baseDelay: Duration
  readonly maxDelay: Duration
  readonly jitter: boolean
  readonly customDelays?: readonly Duration[]
}

export class RetryPolicy extends Context.Tag("RetryPolicy")<
  RetryPolicy,
  {
    readonly nextDelay: (attempt: number) => Effect.Effect<Duration>
    readonly shouldRetry: (attempt: number, maxAttempts: number) => boolean
  }
>() {}

export const RetryPolicyLive = (config: RetryPolicyConfig) =>
  Layer.succeed(RetryPolicy, {
    nextDelay: (attempt) =>
      Effect.sync(() => {
        let delay: number

        switch (config.strategy) {
          case "fixed":
            delay = Duration.toMillis(config.baseDelay)
            break
          case "exponential":
            delay = Duration.toMillis(config.baseDelay) * Math.pow(2, attempt)
            break
          case "linear":
            delay = Duration.toMillis(config.baseDelay) * (attempt + 1)
            break
          case "custom":
            delay = config.customDelays?.[attempt]
              ? Duration.toMillis(config.customDelays[attempt])
              : Duration.toMillis(config.maxDelay)
            break
        }

        delay = Math.min(delay, Duration.toMillis(config.maxDelay))

        if (config.jitter) {
          delay = delay * (0.5 + Math.random())
        }

        return Duration.millis(delay)
      }),

    shouldRetry: (attempt, maxAttempts) => attempt < maxAttempts,
  })

export const DefaultRetryPolicy = RetryPolicyLive({
  strategy: "exponential",
  baseDelay: Duration.seconds(1),
  maxDelay: Duration.minutes(30),
  jitter: true,
})
```

### `libs/queue/domain/failure/`

```typescript
// libs/queue/domain/failure/src/FailureClassifier.ts

import { Context, Effect, Layer } from "effect"

export type FailureType = "transient" | "permanent" | "fatal"

export class FailureClassifier extends Context.Tag("FailureClassifier")<
  FailureClassifier,
  {
    readonly classify: (error: unknown) => Effect.Effect<FailureType>
    readonly register: (predicate: (error: unknown) => boolean, type: FailureType) => void
  }
>() {}

// Transient errors (should retry):
// - Network timeouts
// - Connection refused
// - Rate limits (429)
// - Service unavailable (503)
// - Database deadlocks

// Permanent errors (move to DLQ):
// - Validation errors
// - Not found (404)
// - Unauthorized (401/403)
// - Bad request (400)

// Fatal errors (halt worker):
// - Out of memory
// - Configuration errors

export const FailureClassifierLive = Layer.sync(
  FailureClassifier,
  () => {
    const rules: Array<{ predicate: (e: unknown) => boolean; type: FailureType }> = [
      // Transient patterns
      { predicate: (e) => isTimeoutError(e), type: "transient" },
      { predicate: (e) => isConnectionError(e), type: "transient" },
      { predicate: (e) => isRateLimitError(e), type: "transient" },
      { predicate: (e) => isDeadlockError(e), type: "transient" },

      // Permanent patterns
      { predicate: (e) => isValidationError(e), type: "permanent" },
      { predicate: (e) => isNotFoundError(e), type: "permanent" },
      { predicate: (e) => isAuthError(e), type: "permanent" },

      // Fatal patterns
      { predicate: (e) => isOutOfMemoryError(e), type: "fatal" },
    ]

    return {
      classify: (error) =>
        Effect.sync(() => {
          for (const rule of rules) {
            if (rule.predicate(error)) {
              return rule.type
            }
          }
          return "transient" // Default to retry
        }),

      register: (predicate, type) => {
        rules.unshift({ predicate, type })
      },
    }
  }
)
```

---

## F) Failed Jobs Store / DLQ + Operator Tooling

### `libs/queue/dlq/`

```typescript
// libs/queue/dlq/src/DLQ.ts

import { Context, Effect, Layer } from "effect"
import type { DLQPort, SerializedJob, JobId, FailedJob } from "@gello/queue-contracts"

export class DLQ extends Context.Tag("DLQ")<DLQ, DLQPort>() {}

// Postgres implementation
export const DLQPostgresLive = Layer.effect(
  DLQ,
  Effect.gen(function* () {
    const db = yield* Database

    return {
      push: (job, reason) =>
        Effect.tryPromise({
          try: () =>
            db.insert(failedJobs).values({
              jobId: job.meta.id,
              queue: job.meta.queue,
              jobType: job.meta.jobType,
              payload: job.payload,
              exception: reason,
              attempts: job.meta.attempts,
              failedAt: new Date(),
            }),
          catch: (e) => new DLQError({ message: "DLQ push failed", cause: e }),
        }),

      list: (queue, { offset = 0, limit = 50 }) =>
        Effect.tryPromise({
          try: () =>
            db.select().from(failedJobs)
              .where(eq(failedJobs.queue, queue))
              .orderBy(desc(failedJobs.failedAt))
              .offset(offset)
              .limit(limit),
          catch: (e) => new DLQError({ message: "DLQ list failed", cause: e }),
        }),

      retry: (jobId) =>
        Effect.gen(function* () {
          const [failed] = yield* Effect.tryPromise(() =>
            db.select().from(failedJobs).where(eq(failedJobs.jobId, jobId))
          )
          if (!failed) return

          // Re-enqueue
          yield* Effect.tryPromise(() =>
            db.insert(jobs).values({
              id: generateJobId(),
              queue: failed.queue,
              jobType: failed.jobType,
              payload: failed.payload,
              attempts: 0,
              maxAttempts: 3,
              scheduledAt: new Date(),
            })
          )

          // Remove from DLQ
          yield* Effect.tryPromise(() =>
            db.delete(failedJobs).where(eq(failedJobs.jobId, jobId))
          )
        }),

      retryAll: (queue) =>
        Effect.gen(function* () {
          const failed = yield* Effect.tryPromise(() =>
            db.select().from(failedJobs).where(eq(failedJobs.queue, queue))
          )

          yield* Effect.all(
            failed.map((f) =>
              Effect.tryPromise(() =>
                db.insert(jobs).values({
                  id: generateJobId(),
                  queue: f.queue,
                  jobType: f.jobType,
                  payload: f.payload,
                  attempts: 0,
                  maxAttempts: 3,
                  scheduledAt: new Date(),
                })
              )
            ),
            { concurrency: 10 }
          )

          yield* Effect.tryPromise(() =>
            db.delete(failedJobs).where(eq(failedJobs.queue, queue))
          )

          return failed.length
        }),

      purge: (queue, olderThan) =>
        Effect.tryPromise({
          try: async () => {
            const result = await db.delete(failedJobs)
              .where(and(
                eq(failedJobs.queue, queue),
                olderThan ? lte(failedJobs.failedAt, olderThan) : sql`true`
              ))
            return result.rowCount ?? 0
          },
          catch: (e) => new DLQError({ message: "DLQ purge failed", cause: e }),
        }),
    }
  })
).pipe(Layer.provide(DatabaseLive))
```

---

## G) Idempotency & "Exactly-Once at the Edge"

### `libs/queue/domain/idempotency/`

```typescript
// libs/queue/domain/idempotency/src/Idempotency.ts

import { Context, Effect, Layer } from "effect"
import type { IdempotencyPort, IdempotencyState } from "@gello/queue-contracts"

export class Idempotency extends Context.Tag("Idempotency")<
  Idempotency,
  IdempotencyPort
>() {}

// Redis implementation for distributed locks
export const IdempotencyRedisLive = Layer.effect(
  Idempotency,
  Effect.gen(function* () {
    const redis = yield* Redis
    const keyPrefix = "gello:idempotency:"

    return {
      acquire: (key, ttl) =>
        Effect.tryPromise({
          try: async () => {
            const fullKey = `${keyPrefix}${key}`
            const result = await redis.set(
              fullKey,
              JSON.stringify({ acquiredAt: new Date(), status: "processing" }),
              "PX",
              Duration.toMillis(ttl),
              "NX"
            )
            return result === "OK"
          },
          catch: (e) => new IdempotencyError({ message: "Acquire failed", key }),
        }),

      release: (key) =>
        Effect.tryPromise({
          try: async () => {
            const fullKey = `${keyPrefix}${key}`
            await redis.set(
              fullKey,
              JSON.stringify({ completedAt: new Date(), status: "completed" }),
              "KEEPTTL"
            )
          },
          catch: (e) => new IdempotencyError({ message: "Release failed", key }),
        }),

      check: (key) =>
        Effect.tryPromise({
          try: async () => {
            const fullKey = `${keyPrefix}${key}`
            const value = await redis.get(fullKey)
            if (!value) return { status: "unknown" } as IdempotencyState
            return JSON.parse(value) as IdempotencyState
          },
          catch: (e) => new IdempotencyError({ message: "Check failed", key }),
        }),
    }
  })
).pipe(Layer.provide(RedisLive))

// Postgres fallback for non-Redis environments
export const IdempotencyPostgresLive = Layer.effect(
  Idempotency,
  Effect.gen(function* () {
    const db = yield* Database

    return {
      acquire: (key, ttl) =>
        Effect.tryPromise({
          try: async () => {
            const expiresAt = new Date(Date.now() + Duration.toMillis(ttl))
            try {
              await db.insert(idempotencyKeys).values({
                key,
                status: "processing",
                expiresAt,
              })
              return true
            } catch {
              return false // Key exists
            }
          },
          catch: (e) => new IdempotencyError({ message: "Acquire failed", key }),
        }),

      release: (key) =>
        Effect.tryPromise({
          try: () =>
            db.update(idempotencyKeys)
              .set({ status: "completed", completedAt: new Date() })
              .where(eq(idempotencyKeys.key, key)),
          catch: (e) => new IdempotencyError({ message: "Release failed", key }),
        }),

      check: (key) =>
        Effect.tryPromise({
          try: async () => {
            const [record] = await db.select()
              .from(idempotencyKeys)
              .where(eq(idempotencyKeys.key, key))
            if (!record) return { status: "unknown" }
            return { status: record.status, acquiredAt: record.createdAt }
          },
          catch: (e) => new IdempotencyError({ message: "Check failed", key }),
        }),
    }
  })
).pipe(Layer.provide(DatabaseLive))
```

---

## H) Observability

### `libs/queue/observability/`

```typescript
// libs/queue/observability/src/Metrics.ts

import { Context, Effect, Layer, Metric } from "effect"
import type { ObservabilityPort, SerializedJob } from "@gello/queue-contracts"

// Effect Metrics
const jobsEnqueued = Metric.counter("gello_queue_jobs_enqueued_total")
const jobsProcessed = Metric.counter("gello_queue_jobs_processed_total")
const jobsFailed = Metric.counter("gello_queue_jobs_failed_total")
const jobsDead = Metric.counter("gello_queue_jobs_dead_total")
const jobDuration = Metric.histogram("gello_queue_job_duration_seconds", {
  boundaries: [0.01, 0.05, 0.1, 0.5, 1, 5, 10, 30, 60],
})
const activeWorkers = Metric.gauge("gello_queue_active_workers")
const queueDepth = Metric.gauge("gello_queue_depth")

export class QueueMetrics extends Context.Tag("QueueMetrics")<
  QueueMetrics,
  ObservabilityPort
>() {}

export const QueueMetricsLive = Layer.succeed(QueueMetrics, {
  jobEnqueued: (job) =>
    Effect.gen(function* () {
      yield* Metric.increment(jobsEnqueued)
      yield* Effect.log(`Job enqueued: ${job.meta.jobType}`, {
        jobId: job.meta.id,
        queue: job.meta.queue,
        priority: job.meta.priority,
      })
    }),

  jobStarted: (job) =>
    Effect.log(`Job started: ${job.meta.jobType}`, {
      jobId: job.meta.id,
      attempt: job.meta.attempts,
    }),

  jobCompleted: (job, duration) =>
    Effect.gen(function* () {
      yield* Metric.increment(jobsProcessed)
      yield* Metric.update(jobDuration, Duration.toSeconds(duration))
      yield* Effect.log(`Job completed: ${job.meta.jobType}`, {
        jobId: job.meta.id,
        duration: Duration.toMillis(duration),
      })
    }),

  jobFailed: (job, error, willRetry) =>
    Effect.gen(function* () {
      yield* Metric.increment(jobsFailed)
      yield* Effect.logWarning(`Job failed: ${job.meta.jobType}`, {
        jobId: job.meta.id,
        error: String(error),
        willRetry,
        attempt: job.meta.attempts,
      })
    }),

  jobDead: (job, error) =>
    Effect.gen(function* () {
      yield* Metric.increment(jobsDead)
      yield* Effect.logError(`Job dead: ${job.meta.jobType}`, {
        jobId: job.meta.id,
        error: String(error),
        attempts: job.meta.attempts,
      })
    }),

  workerStarted: (workerId) =>
    Effect.gen(function* () {
      yield* Metric.update(activeWorkers, 1)
      yield* Effect.log(`Worker started: ${workerId}`)
    }),

  workerStopped: (workerId) =>
    Effect.gen(function* () {
      yield* Metric.update(activeWorkers, -1)
      yield* Effect.log(`Worker stopped: ${workerId}`)
    }),

  workerHealthCheck: (workerId, healthy) =>
    Effect.log(`Worker health: ${workerId}`, { healthy }),
})

// OpenTelemetry integration
export const QueueTracingLive = Layer.effect(
  QueueMetrics,
  Effect.gen(function* () {
    const tracer = yield* Tracer

    return {
      jobEnqueued: (job) =>
        tracer.span("queue.enqueue", {
          attributes: {
            "queue.name": job.meta.queue,
            "job.type": job.meta.jobType,
            "job.id": job.meta.id,
          },
        })(Effect.void),

      jobStarted: (job) =>
        Effect.void, // Span started by worker

      jobCompleted: (job, duration) =>
        Effect.annotateCurrentSpan({
          "job.duration_ms": Duration.toMillis(duration),
          "job.status": "completed",
        }),

      jobFailed: (job, error, willRetry) =>
        Effect.annotateCurrentSpan({
          "job.status": willRetry ? "retrying" : "failed",
          "job.error": String(error),
        }),

      jobDead: (job, error) =>
        Effect.annotateCurrentSpan({
          "job.status": "dead",
          "job.error": String(error),
        }),

      workerStarted: (workerId) =>
        tracer.span("worker.start", {
          attributes: { "worker.id": workerId },
        })(Effect.void),

      workerStopped: (workerId) =>
        Effect.void,

      workerHealthCheck: (workerId, healthy) =>
        Effect.void,
    }
  })
)
```

---

## I) Ops & Deployment Readiness

### `libs/queue/ops/`

```typescript
// libs/queue/ops/src/cli.ts

import { Command, Args, Options } from "@effect/cli"
import { Effect, Console } from "effect"
import type { QueuePort, DLQPort } from "@gello/queue-contracts"

// gello queue:work
export const workCommand = Command.make(
  "work",
  {
    queues: Options.text("queues").pipe(
      Options.withDefault("default"),
      Options.withDescription("Comma-separated queue names")
    ),
    concurrency: Options.integer("concurrency").pipe(
      Options.withDefault(5),
      Options.withDescription("Number of concurrent workers")
    ),
  },
  ({ queues, concurrency }) =>
    Effect.gen(function* () {
      yield* Console.log(`Starting worker for queues: ${queues}`)
      yield* Console.log(`Concurrency: ${concurrency}`)

      const worker = yield* Worker
      yield* worker.start()

      // Block until stopped
      while (yield* worker.isRunning()) {
        yield* Effect.sleep("1 second")
      }
    })
)

// gello queue:status
export const statusCommand = Command.make(
  "status",
  {
    queue: Args.text({ name: "queue" }).pipe(Args.withDefault("default")),
  },
  ({ queue }) =>
    Effect.gen(function* () {
      const queueService = yield* QueuePort
      const stats = yield* queueService.stats(queue)

      yield* Console.log(`Queue: ${stats.queue}`)
      yield* Console.log(`  Pending:    ${stats.pending}`)
      yield* Console.log(`  Processing: ${stats.processing}`)
      yield* Console.log(`  Failed:     ${stats.failed}`)
      yield* Console.log(`  Dead:       ${stats.dead}`)
    })
)

// gello queue:retry
export const retryCommand = Command.make(
  "retry",
  {
    queue: Args.text({ name: "queue" }),
    jobId: Options.text("job").pipe(Options.optional),
  },
  ({ queue, jobId }) =>
    Effect.gen(function* () {
      const dlq = yield* DLQPort

      if (jobId._tag === "Some") {
        yield* dlq.retry(jobId.value as JobId)
        yield* Console.log(`Retried job: ${jobId.value}`)
      } else {
        const count = yield* dlq.retryAll(queue)
        yield* Console.log(`Retried ${count} jobs from queue: ${queue}`)
      }
    })
)

// gello queue:failed
export const failedCommand = Command.make(
  "failed",
  {
    queue: Args.text({ name: "queue" }).pipe(Args.withDefault("default")),
    limit: Options.integer("limit").pipe(Options.withDefault(50)),
  },
  ({ queue, limit }) =>
    Effect.gen(function* () {
      const dlq = yield* DLQPort
      const jobs = yield* dlq.list(queue, { offset: 0, limit })

      yield* Console.log(`Failed jobs in queue: ${queue}`)
      for (const job of jobs) {
        yield* Console.log(`  ${job.jobId} - ${job.jobType} - ${job.failedAt}`)
        yield* Console.log(`    Error: ${job.exception.slice(0, 100)}...`)
      }
    })
)

// gello queue:purge
export const purgeCommand = Command.make(
  "purge",
  {
    queue: Args.text({ name: "queue" }),
    olderThan: Options.text("older-than").pipe(Options.optional),
    force: Options.boolean("force").pipe(Options.withDefault(false)),
  },
  ({ queue, olderThan, force }) =>
    Effect.gen(function* () {
      if (!force) {
        yield* Console.log(`This will permanently delete failed jobs. Use --force to confirm.`)
        return
      }

      const dlq = yield* DLQPort
      const date = olderThan._tag === "Some" ? new Date(olderThan.value) : undefined
      const count = yield* dlq.purge(queue, date)
      yield* Console.log(`Purged ${count} jobs from queue: ${queue}`)
    })
)

// Main queue command group
export const queueCommand = Command.make("queue").pipe(
  Command.withSubcommands([
    workCommand,
    statusCommand,
    retryCommand,
    failedCommand,
    purgeCommand,
  ])
)
```

---

## J) Testing & Verification

### Testing Strategy

**Each lib has its own tests in `src/*.test.ts`**:
- Unit tests: colocated with source files
- Integration tests: use testcontainers for Redis/Postgres
- Property-based tests: use fast-check for invariants

**The `testing/` lib provides utilities for CONSUMERS** (apps using the queue):

### `libs/queue/testing/` — Consumer Test Utilities

```typescript
// libs/queue/testing/src/TestQueue.ts

import { Effect, Layer, Ref, Queue } from "effect"
import type { QueuePort, SerializedJob, JobId } from "@gello/queue-contracts"

export interface TestQueueState {
  enqueued: SerializedJob[]
  processed: SerializedJob[]
  failed: SerializedJob[]
  dead: SerializedJob[]
}

export const createTestQueue = () => {
  const stateRef = Ref.unsafeMake<TestQueueState>({
    enqueued: [],
    processed: [],
    failed: [],
    dead: [],
  })

  const layer = Layer.succeed(QueuePort, {
    push: (job) =>
      Effect.gen(function* () {
        yield* Ref.update(stateRef, (s) => ({
          ...s,
          enqueued: [...s.enqueued, job],
        }))
        return job.meta.id
      }),

    pop: (queue) =>
      Effect.gen(function* () {
        const state = yield* Ref.get(stateRef)
        const job = state.enqueued.find((j) => j.meta.queue === queue)
        if (!job) return null

        yield* Ref.update(stateRef, (s) => ({
          ...s,
          enqueued: s.enqueued.filter((j) => j.meta.id !== job.meta.id),
        }))
        return job
      }),

    schedule: (job, at) =>
      Effect.gen(function* () {
        yield* Ref.update(stateRef, (s) => ({
          ...s,
          enqueued: [...s.enqueued, { ...job, meta: { ...job.meta, scheduledAt: at } }],
        }))
        return job.meta.id
      }),

    ack: (jobId) =>
      Effect.void,

    nack: (jobId, error, retryAt) =>
      Effect.void,

    dead: (jobId, error) =>
      Effect.gen(function* () {
        const state = yield* Ref.get(stateRef)
        const job = state.enqueued.find((j) => j.meta.id === jobId)
        if (job) {
          yield* Ref.update(stateRef, (s) => ({
            ...s,
            dead: [...s.dead, job],
          }))
        }
      }),

    peek: (queue, limit = 10) =>
      Effect.gen(function* () {
        const state = yield* Ref.get(stateRef)
        return state.enqueued.filter((j) => j.meta.queue === queue).slice(0, limit)
      }),

    stats: (queue) =>
      Effect.gen(function* () {
        const state = yield* Ref.get(stateRef)
        return {
          queue,
          pending: state.enqueued.filter((j) => j.meta.queue === queue).length,
          processing: 0,
          failed: state.failed.filter((j) => j.meta.queue === queue).length,
          dead: state.dead.filter((j) => j.meta.queue === queue).length,
        }
      }),
  })

  return {
    layer,
    getState: () => Ref.get(stateRef),
    reset: () =>
      Ref.set(stateRef, {
        enqueued: [],
        processed: [],
        failed: [],
        dead: [],
      }),
  }
}

// Test utilities
export const processAllJobs = <E, R>(
  handler: (job: SerializedJob) => Effect.Effect<void, E, R>
) =>
  Effect.gen(function* () {
    const queue = yield* QueuePort
    let job = yield* queue.pop("default")

    while (job) {
      yield* handler(job)
      yield* queue.ack(job.meta.id)
      job = yield* queue.pop("default")
    }
  })

// Property-based testing helpers
export const arbitraryJob = (): SerializedJob => ({
  meta: {
    id: crypto.randomUUID() as JobId,
    queue: "test",
    jobType: "test.job",
    priority: "normal",
    attempts: 0,
    maxAttempts: 3,
    createdAt: new Date(),
    scheduledAt: new Date(),
    startedAt: null,
    completedAt: null,
    failedAt: null,
    idempotencyKey: null,
  },
  payload: { data: "test" },
  lastError: null,
})
```

---

## Definition of Done Checklist

### A) Architecture & Contracts
- [ ] `@gello/queue-contracts` published with zero deps
- [ ] All port interfaces defined with Effect types
- [ ] Job schema with @effect/schema validation
- [ ] Error types using Data.TaggedError

### B) Backend Drivers
- [ ] Memory adapter for dev/test
- [ ] Redis adapter with BRPOPLPUSH for reliability
- [ ] Postgres adapter with row-locking
- [ ] Driver selection via config
- [ ] Same API across all drivers

### C) Producer SDK
- [ ] `defineJob()` for type-safe job definitions
- [ ] `dispatch()`, `dispatchAfter()`, `dispatchAt()`
- [ ] `dispatchBatch()` for bulk operations
- [ ] Idempotency key support
- [ ] Priority levels

### D) Worker Runtime
- [ ] Configurable concurrency with Semaphore
- [ ] Job timeout handling
- [ ] Graceful shutdown (SIGTERM/SIGINT)
- [ ] Worker heartbeat/health checks
- [ ] Memory monitoring

### E) Retry Policy
- [ ] Exponential backoff with jitter
- [ ] Custom backoff strategies
- [ ] Per-job retry configuration
- [ ] Failure classification (transient/permanent/fatal)

### F) DLQ & Ops
- [ ] Failed jobs stored with full context
- [ ] `queue:failed` to list dead jobs
- [ ] `queue:retry` for single job retry
- [ ] `queue:retry --all` for bulk retry
- [ ] `queue:purge` with --older-than

### G) Idempotency
- [ ] Redis-based distributed locks
- [ ] Postgres fallback
- [ ] Configurable TTL
- [ ] State checking API

### H) Observability
- [ ] Effect Metrics integration
- [ ] Structured logging
- [ ] OpenTelemetry tracing
- [ ] Queue depth metrics
- [ ] Worker health metrics

### I) Ops Readiness
- [ ] `queue:work` CLI command
- [ ] `queue:status` CLI command
- [ ] Kubernetes liveness/readiness probes
- [ ] Graceful shutdown in containers

### J) Testing
- [ ] Test queue layer
- [ ] Property-based tests
- [ ] Integration tests with Testcontainers
- [ ] Chaos testing (kill workers, network partitions)
- [ ] Load testing (>100 jobs/second)

---

## NX Generation Commands

```bash
# Contracts (zero deps)
nx g @nx/js:lib contracts --directory=libs/queue --bundler=vite --unitTestRunner=vitest

# Domain libs
nx g @nx/js:lib job --directory=libs/queue/domain --bundler=vite --unitTestRunner=vitest
nx g @nx/js:lib retry --directory=libs/queue/domain --bundler=vite --unitTestRunner=vitest
nx g @nx/js:lib failure --directory=libs/queue/domain --bundler=vite --unitTestRunner=vitest
nx g @nx/js:lib idempotency --directory=libs/queue/domain --bundler=vite --unitTestRunner=vitest

# Producer
nx g @nx/js:lib producer --directory=libs/queue --bundler=vite --unitTestRunner=vitest

# Worker
nx g @nx/js:lib core --directory=libs/queue/worker --bundler=vite --unitTestRunner=vitest
nx g @nx/js:lib pool --directory=libs/queue/worker --bundler=vite --unitTestRunner=vitest
nx g @nx/js:lib signals --directory=libs/queue/worker --bundler=vite --unitTestRunner=vitest

# Adapters
nx g @nx/js:lib memory --directory=libs/queue/adapters --bundler=vite --unitTestRunner=vitest
nx g @nx/js:lib redis --directory=libs/queue/adapters --bundler=vite --unitTestRunner=vitest
nx g @nx/js:lib postgres --directory=libs/queue/adapters --bundler=vite --unitTestRunner=vitest

# DLQ
nx g @nx/js:lib dlq --directory=libs/queue --bundler=vite --unitTestRunner=vitest

# Observability
nx g @nx/js:lib observability --directory=libs/queue --bundler=vite --unitTestRunner=vitest

# Ops
nx g @nx/js:lib ops --directory=libs/queue --bundler=vite --unitTestRunner=vitest

# Testing
nx g @nx/js:lib testing --directory=libs/queue --bundler=vite --unitTestRunner=vitest
```

---

## Path Aliases

```json
{
  "paths": {
    "@gello/queue-contracts": ["libs/queue/contracts/src/index.ts"],
    "@gello/queue-domain-job": ["libs/queue/domain/job/src/index.ts"],
    "@gello/queue-domain-retry": ["libs/queue/domain/retry/src/index.ts"],
    "@gello/queue-domain-failure": ["libs/queue/domain/failure/src/index.ts"],
    "@gello/queue-domain-idempotency": ["libs/queue/domain/idempotency/src/index.ts"],
    "@gello/queue-producer": ["libs/queue/producer/src/index.ts"],
    "@gello/queue-worker-core": ["libs/queue/worker/core/src/index.ts"],
    "@gello/queue-worker-pool": ["libs/queue/worker/pool/src/index.ts"],
    "@gello/queue-worker-signals": ["libs/queue/worker/signals/src/index.ts"],
    "@gello/queue-adapter-memory": ["libs/queue/adapters/memory/src/index.ts"],
    "@gello/queue-adapter-redis": ["libs/queue/adapters/redis/src/index.ts"],
    "@gello/queue-adapter-postgres": ["libs/queue/adapters/postgres/src/index.ts"],
    "@gello/queue-dlq": ["libs/queue/dlq/src/index.ts"],
    "@gello/queue-observability": ["libs/queue/observability/src/index.ts"],
    "@gello/queue-ops": ["libs/queue/ops/src/index.ts"],
    "@gello/queue-testing": ["libs/queue/testing/src/index.ts"]
  }
}
```
