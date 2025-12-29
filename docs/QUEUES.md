# Queue System PRD

> A Laravel 4.2-inspired queue system built on Effect with hexagonal DDD architecture

## Table of Contents

- [Overview](#overview)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Getting Started](#getting-started)
  - [Step 1: Define a Job](#step-1-define-a-job)
  - [Step 2: Create a Job Registry](#step-2-create-a-job-registry)
  - [Step 3: Dispatch Jobs](#step-3-dispatch-jobs)
  - [Step 4: Wire Up the Layers](#step-4-wire-up-the-layers)
  - [Step 5: Run the Worker](#step-5-run-the-worker)
  - [Step 6: Monitor and Manage](#step-6-monitor-and-manage)
  - [Complete Example](#complete-example)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
  - [Core Types](#core-types)
  - [Job Definition Contract](#job-definition-contract)
- [Ports (Interfaces)](#ports-interfaces)
  - [QueueDriver Port](#queuedriver-port)
  - [FailedJobRepository Port](#failedjobrepository-port)
- [Adapters (Drivers)](#adapters-drivers)
  - [Memory Driver](#memory-driver)
  - [Redis Driver](#redis-driver)
  - [Database Driver](#database-driver)
  - [Sync Driver](#sync-driver)
- [Queue Service](#queue-service)
- [Worker System](#worker-system)
  - [Worker Configuration](#worker-configuration)
  - [Worker Process](#worker-process)
- [Queue Orchestrator App](#queue-orchestrator-app)
  - [App Structure](#app-structure)
  - [Main Entry Point](#main-entry-point)
  - [CLI Commands](#cli-commands)
- [Job Registry](#job-registry)
- [Job Examples](#job-examples)
  - [Email Job](#email-job)
  - [Batch Processing Job](#batch-processing-job)
- [Monitoring & Metrics](#monitoring--metrics)
  - [Metrics Interface](#metrics-interface)
  - [Health Check Endpoint](#health-check-endpoint)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Config Schema](#config-schema)
- [Testing](#testing)
  - [Test Utilities](#test-utilities)
- [Migration Guide](#migration-guide)
  - [From BullMQ](#from-bullmq)
  - [From Laravel](#from-laravel)
- [Implementation Phases](#implementation-phases)
- [API Reference](#api-reference)
- [References](#references)

---

## Overview

The Gello queue system provides a unified API for deferring time-consuming tasks like sending emails, processing uploads, or generating reports. Inspired by Laravel 4.2's elegant queue API, it leverages Effect's functional paradigm for type-safe, composable job processing.

### Goals

1. **Laravel-familiar API** — Developers coming from Laravel should feel at home
2. **Effect-native** — Built entirely on Effect primitives (Queue, Fiber, Layer)
3. **Hexagonal Architecture** — Ports define contracts, adapters implement drivers
4. **Type-safe Jobs** — Schema-validated payloads with compile-time guarantees
5. **Resilient by Default** — Retry policies, circuit breakers, dead letter queues
6. **Observable** — Metrics, tracing, and monitoring built-in

### Non-Goals

- Real-time pub/sub (use dedicated solutions)
- Complex workflow orchestration (use Temporal/Inngest)
- Multi-tenant isolation at queue level

---

## Getting Started

This section walks through creating your first job, dispatching it to a queue, and running a worker to process it.

### Step 1: Define a Job

Create a job by implementing the `Queueable` interface:

```typescript
// src/jobs/SendWelcomeEmail.ts
import { Effect, Duration } from "effect"
import { Queueable, QueueName, JobPriority } from "@gello/queue-core"

interface SendWelcomeEmailPayload {
  userId: string
  email: string
  name: string
}

export const SendWelcomeEmailJob: Queueable<SendWelcomeEmailPayload> = {
  name: "SendWelcomeEmail",
  queue: QueueName("emails"),
  priority: JobPriority.NORMAL,
  maxAttempts: 3,
  timeout: Duration.seconds(30),
  retryAfter: Duration.minutes(1),

  handle: (payload) =>
    Effect.gen(function* () {
      yield* Effect.log(`Sending welcome email to ${payload.email}`)
      // Your email sending logic here
      yield* Effect.log(`Welcome email sent to ${payload.name}`)
    }),

  onFailure: (payload, error) =>
    Effect.log(`Failed to send welcome email to ${payload.email}: ${error}`),
}
```

### Step 2: Create a Job Registry

Register all your jobs in a central registry:

```typescript
// src/jobs/registry.ts
import { Effect, Layer } from "effect"
import { JobRegistryTag, makeJobRegistry } from "@gello/queue-core"
import { SendWelcomeEmailJob } from "./SendWelcomeEmail"
import { ProcessOrderJob } from "./ProcessOrder"
import { GenerateReportJob } from "./GenerateReport"

export const JobRegistryLive = Layer.effect(
  JobRegistryTag,
  Effect.gen(function* () {
    const registry = yield* makeJobRegistry()

    // Register all jobs
    yield* registry.register(SendWelcomeEmailJob)
    yield* registry.register(ProcessOrderJob)
    yield* registry.register(GenerateReportJob)

    return registry
  })
)
```

### Step 3: Dispatch Jobs

Use the `Queue` service to dispatch jobs from anywhere in your application:

```typescript
// src/services/UserService.ts
import { Effect, Duration } from "effect"
import { QueueTag, QueueName } from "@gello/queue-core"
import { SendWelcomeEmailJob } from "../jobs/SendWelcomeEmail"

export const createUser = (userData: { email: string; name: string }) =>
  Effect.gen(function* () {
    const queue = yield* QueueTag

    // Create user in database...
    const userId = "user_123"

    // Dispatch welcome email job
    const jobId = yield* queue.push(SendWelcomeEmailJob, {
      userId,
      email: userData.email,
      name: userData.name,
    })

    yield* Effect.log(`Queued welcome email job: ${jobId}`)

    return { userId }
  })

// Dispatch with a delay
export const scheduleReminder = (userId: string) =>
  Effect.gen(function* () {
    const queue = yield* QueueTag

    yield* queue.later(Duration.hours(24), SendReminderJob, { userId })
  })

// Dispatch to a specific queue
export const processUrgentOrder = (orderId: string) =>
  Effect.gen(function* () {
    const queue = yield* QueueTag

    yield* queue.pushOn(QueueName("high-priority"), ProcessOrderJob, { orderId })
  })
```

### Step 4: Wire Up the Layers

Compose all the layers together in your application:

```typescript
// src/main.ts
import { Effect, Layer, pipe } from "effect"
import { QueueLive, QueueTag } from "@gello/queue-core"
import { MemoryDriverLive, MemoryFailedJobRepositoryLive } from "@gello/queue-drivers"
import { JobRegistryLive } from "./jobs/registry"

// Development layer (in-memory)
const DevQueueLayer = pipe(
  QueueLive,
  Layer.provide(MemoryDriverLive),
  Layer.provide(MemoryFailedJobRepositoryLive),
  Layer.provide(JobRegistryLive)
)

// Production layer (Redis)
const ProdQueueLayer = pipe(
  QueueLive,
  Layer.provide(RedisDriverLive({
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT ?? 6379),
  })),
  Layer.provide(DatabaseFailedJobRepositoryLive),
  Layer.provide(JobRegistryLive)
)

// Use the appropriate layer
const program = Effect.gen(function* () {
  const queue = yield* QueueTag

  yield* queue.push(SendWelcomeEmailJob, {
    userId: "user_123",
    email: "new@example.com",
    name: "New User",
  })
})

Effect.runPromise(
  program.pipe(Effect.provide(DevQueueLayer))
)
```

### Step 5: Run the Worker

Start a worker to process queued jobs:

```bash
# Using NX
npx nx serve queue-orchestrator

# Or with CLI options
npx nx serve queue-orchestrator -- work --queue=emails --concurrency=4
```

Or programmatically:

```typescript
// worker.ts
import { Effect, Layer, Duration, pipe } from "effect"
import { makeWorker, QueueName } from "@gello/queue-worker"
import { MemoryDriverLive, MemoryFailedJobRepositoryLive } from "@gello/queue-drivers"
import { JobRegistryLive } from "./jobs/registry"

const WorkerLayer = pipe(
  MemoryDriverLive,
  Layer.provideMerge(MemoryFailedJobRepositoryLive),
  Layer.provideMerge(JobRegistryLive)
)

const program = Effect.gen(function* () {
  const worker = yield* makeWorker({
    queue: QueueName("emails"),
    concurrency: 2,
    sleep: Duration.seconds(3),
    tries: 3,
    timeout: Duration.minutes(1),
  })

  yield* Effect.log("Starting worker...")
  yield* worker.start()
})

Effect.runPromise(
  program.pipe(Effect.provide(WorkerLayer))
)
```

### Step 6: Monitor and Manage

Use CLI commands to manage your queues:

```bash
# Check queue status
npx nx serve queue-orchestrator -- status

# List failed jobs
npx nx serve queue-orchestrator -- failed

# Retry a failed job
npx nx serve queue-orchestrator -- retry <job-id>

# Retry all failed jobs
npx nx serve queue-orchestrator -- retry-all

# Clear a queue
npx nx serve queue-orchestrator -- clear --queue=emails

# Get help
npx nx serve queue-orchestrator -- help
```

### Complete Example

Here's a complete working example:

```typescript
// complete-example.ts
import { Effect, Layer, Duration, pipe } from "effect"
import {
  QueueTag,
  QueueLive,
  JobRegistryTag,
  makeJobRegistry,
  Queueable,
  QueueName,
  JobPriority
} from "@gello/queue-core"
import { MemoryDriverLive, MemoryFailedJobRepositoryLive } from "@gello/queue-drivers"
import { makeWorker } from "@gello/queue-worker"

// 1. Define a job
interface GreetPayload {
  name: string
}

const GreetJob: Queueable<GreetPayload> = {
  name: "Greet",
  queue: QueueName("default"),
  priority: JobPriority.NORMAL,
  maxAttempts: 3,
  timeout: Duration.seconds(10),

  handle: (payload) =>
    Effect.gen(function* () {
      yield* Effect.log(`Hello, ${payload.name}!`)
    }),
}

// 2. Create registry layer
const JobRegistryLive = Layer.effect(
  JobRegistryTag,
  Effect.gen(function* () {
    const registry = yield* makeJobRegistry()
    yield* registry.register(GreetJob)
    return registry
  })
)

// 3. Compose layers
const MainLayer = pipe(
  QueueLive,
  Layer.provide(MemoryDriverLive),
  Layer.provide(MemoryFailedJobRepositoryLive),
  Layer.provide(JobRegistryLive)
)

// 4. Run program
const program = Effect.gen(function* () {
  const queue = yield* QueueTag

  // Dispatch jobs
  yield* queue.push(GreetJob, { name: "Alice" })
  yield* queue.push(GreetJob, { name: "Bob" })
  yield* queue.push(GreetJob, { name: "Charlie" })

  yield* Effect.log("Jobs queued, starting worker...")

  // Start worker
  const worker = yield* makeWorker({
    queue: QueueName("default"),
    concurrency: 1,
    sleep: Duration.seconds(1),
    stopOnEmpty: true, // Stop when queue is empty
  })

  yield* worker.start()
  yield* Effect.log("All jobs processed!")
})

Effect.runPromise(program.pipe(Effect.provide(MainLayer)))
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                           │
├─────────────────────────────────────────────────────────────────────┤
│  Dispatch Jobs          │  Define Jobs           │  Job Middleware  │
│  Queue::push(job)       │  class SendEmail       │  RateLimitJob    │
│  Queue::later(delay)    │  implements Job        │  UniqueJob       │
│  Queue::bulk(jobs)      │                        │  WithoutOverlap  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          DOMAIN LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│  Job                    │  JobPayload            │  JobResult       │
│  JobId                  │  JobPriority           │  JobStatus       │
│  QueueName              │  JobAttempt            │  FailedJob       │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           PORT LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│  QueueDriver (Port)     │  JobRepository (Port)  │  FailedJobRepo   │
│  - push()               │  - findById()          │  - store()       │
│  - pop()                │  - update()            │  - retry()       │
│  - later()              │  - delete()            │  - prune()       │
│  - size()               │                        │                  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         ADAPTER LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│  MemoryDriver           │  RedisDriver           │  DatabaseDriver  │
│  SyncDriver             │  SQSDriver             │  RabbitMQDriver  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Domain Model

### Core Types

```typescript
// Job identifier
type JobId = Brand.Branded<string, "JobId">

// Queue name
type QueueName = Brand.Branded<string, "QueueName">

// Job priority (higher = more urgent)
type JobPriority = 0 | 1 | 2 | 3 | 4 | 5

// Job status lifecycle
type JobStatus =
  | "pending"      // Waiting in queue
  | "reserved"     // Picked up by worker
  | "processing"   // Currently executing
  | "completed"    // Successfully finished
  | "failed"       // Failed after all retries
  | "buried"       // Moved to dead letter queue

// Job attempt tracking
interface JobAttempt {
  readonly attemptNumber: number
  readonly startedAt: Date
  readonly completedAt?: Date
  readonly error?: string
  readonly duration?: Duration.Duration
}

// Core job record
interface Job<T = unknown> {
  readonly id: JobId
  readonly queue: QueueName
  readonly name: string
  readonly payload: T
  readonly priority: JobPriority
  readonly attempts: number
  readonly maxAttempts: number
  readonly timeout: Duration.Duration
  readonly retryAfter: Duration.Duration
  readonly availableAt: Date
  readonly createdAt: Date
  readonly reservedAt?: Date
}

// Failed job for dead letter queue
interface FailedJob {
  readonly id: JobId
  readonly queue: QueueName
  readonly name: string
  readonly payload: unknown
  readonly exception: string
  readonly failedAt: Date
}
```

### Job Definition Contract

```typescript
// Base job interface (Laravel-style)
interface Queueable<T, E = never, R = never> {
  readonly name: string
  readonly queue?: QueueName
  readonly priority?: JobPriority
  readonly maxAttempts?: number
  readonly timeout?: Duration.Duration
  readonly retryAfter?: Duration.Duration
  readonly backoff?: Schedule.Schedule<unknown, unknown>

  // The job handler
  handle(payload: T): Effect.Effect<void, E, R>

  // Optional hooks
  beforeHandle?(payload: T): Effect.Effect<void, E, R>
  afterHandle?(payload: T): Effect.Effect<void, E, R>
  onFailure?(payload: T, error: E): Effect.Effect<void, never, R>
}

// Schema-validated job
interface SchemaJob<T, E = never, R = never> extends Queueable<T, E, R> {
  readonly schema: Schema.Schema<T>
}
```

---

## Ports (Interfaces)

### QueueDriver Port

```typescript
interface QueueDriver {
  /**
   * Push a job onto the queue
   */
  push<T>(
    queue: QueueName,
    job: Job<T>
  ): Effect.Effect<JobId, QueueError>

  /**
   * Push a job with delay
   */
  later<T>(
    queue: QueueName,
    job: Job<T>,
    delay: Duration.Duration
  ): Effect.Effect<JobId, QueueError>

  /**
   * Pop the next job from the queue
   */
  pop(
    queue: QueueName,
    timeout?: Duration.Duration
  ): Effect.Effect<Option.Option<Job>, QueueError>

  /**
   * Pop multiple jobs (batch)
   */
  popMany(
    queue: QueueName,
    count: number
  ): Effect.Effect<ReadonlyArray<Job>, QueueError>

  /**
   * Mark job as completed
   */
  complete(job: Job): Effect.Effect<void, QueueError>

  /**
   * Release job back to queue (for retry)
   */
  release(
    job: Job,
    delay?: Duration.Duration
  ): Effect.Effect<void, QueueError>

  /**
   * Delete a job
   */
  delete(job: Job): Effect.Effect<void, QueueError>

  /**
   * Get queue size
   */
  size(queue: QueueName): Effect.Effect<number, QueueError>

  /**
   * Clear all jobs from queue
   */
  clear(queue: QueueName): Effect.Effect<void, QueueError>

  /**
   * Get all queue names
   */
  queues(): Effect.Effect<ReadonlyArray<QueueName>, QueueError>
}

// Context tag
class QueueDriverTag extends Context.Tag("QueueDriver")<
  QueueDriverTag,
  QueueDriver
>() {}
```

### FailedJobRepository Port

```typescript
interface FailedJobRepository {
  /**
   * Store a failed job
   */
  store(job: FailedJob): Effect.Effect<void, RepositoryError>

  /**
   * Get all failed jobs
   */
  all(): Effect.Effect<ReadonlyArray<FailedJob>, RepositoryError>

  /**
   * Find failed job by ID
   */
  find(id: JobId): Effect.Effect<Option.Option<FailedJob>, RepositoryError>

  /**
   * Retry a failed job (move back to queue)
   */
  retry(id: JobId): Effect.Effect<void, RepositoryError>

  /**
   * Retry all failed jobs
   */
  retryAll(): Effect.Effect<number, RepositoryError>

  /**
   * Delete a failed job
   */
  delete(id: JobId): Effect.Effect<void, RepositoryError>

  /**
   * Prune old failed jobs
   */
  prune(olderThan: Duration.Duration): Effect.Effect<number, RepositoryError>

  /**
   * Count failed jobs
   */
  count(): Effect.Effect<number, RepositoryError>
}

class FailedJobRepositoryTag extends Context.Tag("FailedJobRepository")<
  FailedJobRepositoryTag,
  FailedJobRepository
>() {}
```

---

## Adapters (Drivers)

### Memory Driver

In-memory queue using Effect.Queue for development and testing.

```typescript
const MemoryDriverLive = Layer.scoped(
  QueueDriverTag,
  Effect.gen(function* () {
    const queues = new Map<QueueName, Queue.Queue<Job>>()
    const delayed = new Map<JobId, Fiber.RuntimeFiber<void>>()

    const getOrCreateQueue = (name: QueueName) =>
      Effect.gen(function* () {
        if (!queues.has(name)) {
          const q = yield* Queue.unbounded<Job>()
          queues.set(name, q)
        }
        return queues.get(name)!
      })

    return {
      push: (queue, job) =>
        Effect.gen(function* () {
          const q = yield* getOrCreateQueue(queue)
          yield* Queue.offer(q, job)
          return job.id
        }),

      later: (queue, job, delay) =>
        Effect.gen(function* () {
          const fiber = yield* pipe(
            Effect.sleep(delay),
            Effect.flatMap(() => this.push(queue, job)),
            Effect.forkScoped
          )
          delayed.set(job.id, fiber)
          return job.id
        }),

      pop: (queue, timeout) =>
        Effect.gen(function* () {
          const q = yield* getOrCreateQueue(queue)
          if (timeout) {
            return yield* pipe(
              Queue.take(q),
              Effect.map(Option.some),
              Effect.timeout(timeout),
              Effect.map(Option.flatten)
            )
          }
          return yield* Queue.poll(q)
        }),

      // ... other methods
    }
  })
)
```

### Redis Driver

Production-ready driver using Redis lists and sorted sets.

```typescript
interface RedisDriverConfig {
  readonly host: string
  readonly port: number
  readonly password?: string
  readonly db?: number
  readonly keyPrefix?: string
}

const RedisDriverLive = (config: RedisDriverConfig) =>
  Layer.scoped(
    QueueDriverTag,
    Effect.gen(function* () {
      const redis = yield* makeRedisClient(config)
      const prefix = config.keyPrefix ?? "gello:queue:"

      const queueKey = (name: QueueName) => `${prefix}${name}`
      const delayedKey = (name: QueueName) => `${prefix}${name}:delayed`
      const reservedKey = (name: QueueName) => `${prefix}${name}:reserved`

      return {
        push: (queue, job) =>
          Effect.gen(function* () {
            const serialized = JSON.stringify(job)
            yield* redis.lpush(queueKey(queue), serialized)
            return job.id
          }),

        later: (queue, job, delay) =>
          Effect.gen(function* () {
            const serialized = JSON.stringify(job)
            const availableAt = Date.now() + Duration.toMillis(delay)
            yield* redis.zadd(delayedKey(queue), availableAt, serialized)
            return job.id
          }),

        pop: (queue, timeout) =>
          Effect.gen(function* () {
            // Move delayed jobs that are ready
            yield* migrateDelayedJobs(queue)

            const result = timeout
              ? yield* redis.brpop(queueKey(queue), Duration.toSeconds(timeout))
              : yield* redis.rpop(queueKey(queue))

            if (!result) return Option.none()

            const job = JSON.parse(result) as Job
            // Move to reserved set with timeout
            yield* redis.zadd(
              reservedKey(queue),
              Date.now() + Duration.toMillis(job.timeout),
              result
            )
            return Option.some(job)
          }),

        // ... other methods
      }
    })
  )
```

### Database Driver

Persistent queue using database tables.

```typescript
// Schema for jobs table
const jobsTable = pgTable("queue_jobs", {
  id: uuid("id").primaryKey(),
  queue: varchar("queue", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  payload: jsonb("payload").notNull(),
  priority: integer("priority").default(0).notNull(),
  attempts: integer("attempts").default(0).notNull(),
  maxAttempts: integer("max_attempts").default(3).notNull(),
  availableAt: timestamp("available_at").notNull(),
  reservedAt: timestamp("reserved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Schema for failed_jobs table
const failedJobsTable = pgTable("failed_jobs", {
  id: uuid("id").primaryKey(),
  queue: varchar("queue", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  payload: jsonb("payload").notNull(),
  exception: text("exception").notNull(),
  failedAt: timestamp("failed_at").defaultNow().notNull(),
})

const DatabaseDriverLive = Layer.effect(
  QueueDriverTag,
  Effect.gen(function* () {
    const db = yield* Database

    return {
      push: (queue, job) =>
        Effect.gen(function* () {
          yield* db.insert(jobsTable).values({
            id: job.id,
            queue,
            name: job.name,
            payload: job.payload,
            priority: job.priority,
            attempts: job.attempts,
            maxAttempts: job.maxAttempts,
            availableAt: job.availableAt,
          })
          return job.id
        }),

      pop: (queue) =>
        Effect.gen(function* () {
          // Atomic pop with FOR UPDATE SKIP LOCKED
          const result = yield* db.transaction(async (tx) => {
            const [job] = await tx
              .select()
              .from(jobsTable)
              .where(
                and(
                  eq(jobsTable.queue, queue),
                  lte(jobsTable.availableAt, new Date()),
                  isNull(jobsTable.reservedAt)
                )
              )
              .orderBy(desc(jobsTable.priority), asc(jobsTable.availableAt))
              .limit(1)
              .for("update", { skipLocked: true })

            if (!job) return null

            await tx
              .update(jobsTable)
              .set({ reservedAt: new Date(), attempts: job.attempts + 1 })
              .where(eq(jobsTable.id, job.id))

            return job
          })

          return Option.fromNullable(result)
        }),

      // ... other methods
    }
  })
)
```

### Sync Driver

Executes jobs immediately (for testing/development).

```typescript
const SyncDriverLive = Layer.succeed(
  QueueDriverTag,
  {
    push: (queue, job) =>
      Effect.gen(function* () {
        // Execute immediately via job registry
        const registry = yield* JobRegistry
        yield* registry.dispatch(job)
        return job.id
      }),

    later: (queue, job, delay) =>
      Effect.gen(function* () {
        yield* Effect.sleep(delay)
        const registry = yield* JobRegistry
        yield* registry.dispatch(job)
        return job.id
      }),

    pop: () => Effect.succeed(Option.none()),
    size: () => Effect.succeed(0),
    // ... other methods return no-ops
  }
)
```

---

## Queue Service

High-level service for dispatching jobs (Laravel-style facade).

```typescript
interface QueueService {
  /**
   * Push a job onto the default queue
   */
  push<T>(job: Queueable<T>, payload: T): Effect.Effect<JobId, QueueError>

  /**
   * Push a job onto a specific queue
   */
  pushOn<T>(
    queue: QueueName,
    job: Queueable<T>,
    payload: T
  ): Effect.Effect<JobId, QueueError>

  /**
   * Push a job with delay
   */
  later<T>(
    delay: Duration.Duration,
    job: Queueable<T>,
    payload: T
  ): Effect.Effect<JobId, QueueError>

  /**
   * Push multiple jobs
   */
  bulk<T>(
    jobs: ReadonlyArray<{ job: Queueable<T>; payload: T }>
  ): Effect.Effect<ReadonlyArray<JobId>, QueueError>

  /**
   * Get queue size
   */
  size(queue?: QueueName): Effect.Effect<number, QueueError>

  /**
   * Clear a queue
   */
  clear(queue?: QueueName): Effect.Effect<void, QueueError>
}

class Queue extends Context.Tag("Queue")<Queue, QueueService>() {}

// Usage
const program = Effect.gen(function* () {
  const queue = yield* Queue

  // Push job immediately
  yield* queue.push(SendEmailJob, {
    to: "user@example.com",
    subject: "Welcome!",
    body: "Hello world",
  })

  // Push with delay
  yield* queue.later(
    Duration.minutes(5),
    SendReminderJob,
    { userId: "123" }
  )

  // Push to specific queue
  yield* queue.pushOn(
    QueueName("high-priority"),
    ProcessPaymentJob,
    { orderId: "456" }
  )
})
```

---

## Worker System

### Worker Configuration

```typescript
interface WorkerConfig {
  readonly queue: QueueName | ReadonlyArray<QueueName>
  readonly concurrency: number
  readonly sleep: Duration.Duration
  readonly maxJobs?: number
  readonly maxTime?: Duration.Duration
  readonly memory?: number // MB limit
  readonly timeout?: Duration.Duration
  readonly tries?: number
  readonly backoff?: Schedule.Schedule<unknown, unknown>
  readonly stopOnEmpty?: boolean
}

const defaultWorkerConfig: WorkerConfig = {
  queue: QueueName("default"),
  concurrency: 1,
  sleep: Duration.seconds(3),
  tries: 3,
  timeout: Duration.minutes(1),
  backoff: Schedule.exponential(Duration.seconds(1), 2).pipe(
    Schedule.jittered,
    Schedule.upTo(Duration.minutes(5))
  ),
}
```

### Worker Process

```typescript
interface Worker {
  /**
   * Start processing jobs
   */
  start(): Effect.Effect<void, WorkerError>

  /**
   * Stop processing gracefully
   */
  stop(): Effect.Effect<void, never>

  /**
   * Pause processing
   */
  pause(): Effect.Effect<void, never>

  /**
   * Resume processing
   */
  resume(): Effect.Effect<void, never>

  /**
   * Get worker status
   */
  status(): Effect.Effect<WorkerStatus, never>
}

interface WorkerStatus {
  readonly state: "running" | "paused" | "stopped"
  readonly processedCount: number
  readonly failedCount: number
  readonly currentJob?: JobId
  readonly startedAt: Date
  readonly uptime: Duration.Duration
  readonly memory: number
}

class WorkerTag extends Context.Tag("Worker")<WorkerTag, Worker>() {}

// Worker implementation
const makeWorker = (config: WorkerConfig) =>
  Effect.gen(function* () {
    const driver = yield* QueueDriverTag
    const registry = yield* JobRegistry
    const failedRepo = yield* FailedJobRepositoryTag
    const metrics = yield* QueueMetrics

    const state = yield* Ref.make<WorkerStatus>({
      state: "stopped",
      processedCount: 0,
      failedCount: 0,
      startedAt: new Date(),
      uptime: Duration.zero,
      memory: 0,
    })

    const shouldStop = yield* Ref.make(false)
    const isPaused = yield* Ref.make(false)

    const processJob = (job: Job) =>
      Effect.gen(function* () {
        yield* Ref.update(state, (s) => ({ ...s, currentJob: job.id }))
        yield* metrics.jobStarted(job)

        const handler = yield* registry.getHandler(job.name)

        const result = yield* pipe(
          handler.handle(job.payload),
          Effect.timeout(job.timeout),
          Effect.retry(config.backoff),
          Effect.tapError((error) =>
            Effect.gen(function* () {
              if (job.attempts >= job.maxAttempts) {
                yield* failedRepo.store({
                  id: job.id,
                  queue: job.queue,
                  name: job.name,
                  payload: job.payload,
                  exception: String(error),
                  failedAt: new Date(),
                })
                yield* handler.onFailure?.(job.payload, error)
                yield* metrics.jobFailed(job, error)
              } else {
                yield* driver.release(job, job.retryAfter)
                yield* metrics.jobRetried(job)
              }
            })
          ),
          Effect.tap(() =>
            Effect.gen(function* () {
              yield* driver.complete(job)
              yield* handler.afterHandle?.(job.payload)
              yield* metrics.jobCompleted(job)
              yield* Ref.update(state, (s) => ({
                ...s,
                processedCount: s.processedCount + 1,
                currentJob: undefined,
              }))
            })
          )
        )

        return result
      })

    const loop = Effect.gen(function* () {
      const queues = Array.isArray(config.queue) ? config.queue : [config.queue]

      while (!(yield* Ref.get(shouldStop))) {
        if (yield* Ref.get(isPaused)) {
          yield* Effect.sleep(config.sleep)
          continue
        }

        // Round-robin through queues
        let jobFound = false
        for (const queue of queues) {
          const maybeJob = yield* driver.pop(queue)

          if (Option.isSome(maybeJob)) {
            jobFound = true
            yield* processJob(maybeJob.value)
            break
          }
        }

        if (!jobFound) {
          if (config.stopOnEmpty) {
            yield* Ref.set(shouldStop, true)
          } else {
            yield* Effect.sleep(config.sleep)
          }
        }
      }
    })

    return {
      start: () =>
        Effect.gen(function* () {
          yield* Ref.update(state, (s) => ({
            ...s,
            state: "running",
            startedAt: new Date(),
          }))

          // Start concurrent workers
          const workers = Array.from({ length: config.concurrency }, () =>
            Effect.forkScoped(loop)
          )
          yield* Effect.all(workers)
        }),

      stop: () =>
        Effect.gen(function* () {
          yield* Ref.set(shouldStop, true)
          yield* Ref.update(state, (s) => ({ ...s, state: "stopped" }))
        }),

      pause: () =>
        Effect.gen(function* () {
          yield* Ref.set(isPaused, true)
          yield* Ref.update(state, (s) => ({ ...s, state: "paused" }))
        }),

      resume: () =>
        Effect.gen(function* () {
          yield* Ref.set(isPaused, false)
          yield* Ref.update(state, (s) => ({ ...s, state: "running" }))
        }),

      status: () => Ref.get(state),
    }
  })
```

---

## Queue Orchestrator App

A dedicated NX application for running queue workers.

### App Structure

```
apps/queue-orchestrator/
├── src/
│   ├── main.ts              # Entry point
│   ├── config.ts            # Worker configuration
│   ├── workers/
│   │   ├── default.ts       # Default queue worker
│   │   ├── high-priority.ts # High priority worker
│   │   └── scheduled.ts     # Scheduled job processor
│   ├── monitoring/
│   │   ├── health.ts        # Health check endpoint
│   │   ├── metrics.ts       # Prometheus metrics
│   │   └── dashboard.ts     # Admin UI (optional)
│   └── cli/
│       ├── work.ts          # queue:work command
│       ├── retry.ts         # queue:retry command
│       ├── failed.ts        # queue:failed command
│       └── clear.ts         # queue:clear command
├── project.json
├── vite.config.ts
└── tsconfig.json
```

### Main Entry Point

```typescript
// src/main.ts
import { Effect, Layer, pipe } from "effect"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import { WorkerConfig, makeWorkerPool } from "./workers"
import { HealthServer } from "./monitoring/health"
import { MetricsCollector } from "./monitoring/metrics"

const config: WorkerConfig = {
  queues: [
    { name: "high-priority", concurrency: 4, timeout: Duration.minutes(5) },
    { name: "default", concurrency: 2, timeout: Duration.minutes(1) },
    { name: "low-priority", concurrency: 1, timeout: Duration.minutes(10) },
  ],
  redis: {
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT ?? 6379),
  },
  database: process.env.DATABASE_URL,
}

const MainLayer = pipe(
  // Worker pool
  makeWorkerPool(config),
  // Health check server
  Layer.provideMerge(HealthServer.layer({ port: 9090 })),
  // Metrics collector
  Layer.provideMerge(MetricsCollector.layer()),
  // Redis driver
  Layer.provide(RedisDriverLive(config.redis)),
  // Database for failed jobs
  Layer.provide(DatabaseLive(config.database)),
  // Job registry with all handlers
  Layer.provide(JobRegistryLive),
)

pipe(
  Layer.launch(MainLayer),
  Effect.tapErrorCause(Effect.logError),
  NodeRuntime.runMain
)
```

### CLI Commands

```typescript
// src/cli/work.ts
import { Command, Options } from "@effect/cli"

const queueOption = Options.text("queue").pipe(
  Options.withDefault("default"),
  Options.withDescription("Queue name to process")
)

const concurrencyOption = Options.integer("concurrency").pipe(
  Options.withDefault(1),
  Options.withDescription("Number of concurrent workers")
)

const sleepOption = Options.integer("sleep").pipe(
  Options.withDefault(3),
  Options.withDescription("Seconds to sleep when queue is empty")
)

const triesOption = Options.integer("tries").pipe(
  Options.withDefault(3),
  Options.withDescription("Max job attempts before failure")
)

export const workCommand = Command.make(
  "work",
  { queue: queueOption, concurrency: concurrencyOption, sleep: sleepOption, tries: triesOption },
  ({ queue, concurrency, sleep, tries }) =>
    Effect.gen(function* () {
      yield* Effect.log(`Starting worker for queue: ${queue}`)
      yield* Effect.log(`Concurrency: ${concurrency}, Sleep: ${sleep}s, Tries: ${tries}`)

      const worker = yield* makeWorker({
        queue: QueueName(queue),
        concurrency,
        sleep: Duration.seconds(sleep),
        tries,
      })

      yield* worker.start()
    })
)
```

---

## Job Registry

Centralized registry for job handlers.

```typescript
interface JobRegistry {
  /**
   * Register a job handler
   */
  register<T>(job: Queueable<T>): Effect.Effect<void, never>

  /**
   * Get handler for a job name
   */
  getHandler(name: string): Effect.Effect<Queueable<unknown>, JobNotFoundError>

  /**
   * Dispatch a job to its handler
   */
  dispatch(job: Job): Effect.Effect<void, JobError>

  /**
   * List all registered jobs
   */
  list(): Effect.Effect<ReadonlyArray<string>, never>
}

class JobRegistryTag extends Context.Tag("JobRegistry")<
  JobRegistryTag,
  JobRegistry
>() {}

// Implementation
const JobRegistryLive = Layer.effect(
  JobRegistryTag,
  Effect.gen(function* () {
    const handlers = new Map<string, Queueable<unknown>>()

    return {
      register: (job) =>
        Effect.sync(() => {
          handlers.set(job.name, job)
        }),

      getHandler: (name) =>
        Effect.gen(function* () {
          const handler = handlers.get(name)
          if (!handler) {
            return yield* Effect.fail(new JobNotFoundError({ name }))
          }
          return handler
        }),

      dispatch: (job) =>
        Effect.gen(function* () {
          const handler = yield* this.getHandler(job.name)
          yield* handler.beforeHandle?.(job.payload)
          yield* handler.handle(job.payload)
          yield* handler.afterHandle?.(job.payload)
        }),

      list: () => Effect.succeed(Array.from(handlers.keys())),
    }
  })
)
```

---

## Job Examples

### Email Job

```typescript
// jobs/SendEmail.ts
import { Effect } from "effect"
import * as S from "@effect/schema/Schema"

const SendEmailPayload = S.Struct({
  to: S.String.pipe(S.pattern(/@/)),
  subject: S.String.pipe(S.minLength(1)),
  body: S.String,
  attachments: S.optional(S.Array(S.String)),
})

type SendEmailPayload = S.Schema.Type<typeof SendEmailPayload>

export const SendEmailJob: SchemaJob<SendEmailPayload, EmailError, EmailService> = {
  name: "SendEmail",
  queue: QueueName("emails"),
  priority: 2,
  maxAttempts: 3,
  timeout: Duration.seconds(30),
  retryAfter: Duration.minutes(1),
  schema: SendEmailPayload,

  handle: (payload) =>
    Effect.gen(function* () {
      const email = yield* EmailService
      yield* email.send({
        to: payload.to,
        subject: payload.subject,
        body: payload.body,
        attachments: payload.attachments,
      })
      yield* Effect.log(`Email sent to ${payload.to}`)
    }),

  onFailure: (payload, error) =>
    Effect.gen(function* () {
      yield* Effect.logError(`Failed to send email to ${payload.to}: ${error}`)
      // Notify admin, store for manual review, etc.
    }),
}
```

### Batch Processing Job

```typescript
// jobs/ProcessReport.ts
export const ProcessReportJob: Queueable<ProcessReportPayload> = {
  name: "ProcessReport",
  queue: QueueName("reports"),
  priority: 1,
  maxAttempts: 1, // No retry for long jobs
  timeout: Duration.hours(1),

  handle: (payload) =>
    Effect.gen(function* () {
      const storage = yield* Storage
      const db = yield* Database

      // Stream process large dataset
      const records = yield* db.stream(
        sql`SELECT * FROM transactions WHERE report_id = ${payload.reportId}`
      )

      let processed = 0
      yield* Stream.runForEach(records, (record) =>
        Effect.gen(function* () {
          // Process each record
          yield* processRecord(record)
          processed++

          // Progress update every 1000 records
          if (processed % 1000 === 0) {
            yield* Effect.log(`Processed ${processed} records`)
          }
        })
      )

      // Generate and store report
      const report = yield* generateReport(payload.reportId)
      yield* storage.put(`reports/${payload.reportId}.pdf`, report)
    }),
}
```

---

## Monitoring & Metrics

### Metrics Interface

```typescript
interface QueueMetrics {
  jobEnqueued(job: Job): Effect.Effect<void, never>
  jobStarted(job: Job): Effect.Effect<void, never>
  jobCompleted(job: Job): Effect.Effect<void, never>
  jobFailed(job: Job, error: unknown): Effect.Effect<void, never>
  jobRetried(job: Job): Effect.Effect<void, never>
  queueSize(queue: QueueName, size: number): Effect.Effect<void, never>
  workerStatus(status: WorkerStatus): Effect.Effect<void, never>
}

// Prometheus metrics
const prometheusMetrics: QueueMetrics = {
  jobEnqueued: (job) =>
    Effect.sync(() => {
      jobsEnqueuedTotal.inc({ queue: job.queue, name: job.name })
    }),

  jobCompleted: (job) =>
    Effect.sync(() => {
      jobsCompletedTotal.inc({ queue: job.queue, name: job.name })
      jobDurationHistogram.observe(
        { queue: job.queue, name: job.name },
        Duration.toMillis(job.duration)
      )
    }),

  jobFailed: (job, error) =>
    Effect.sync(() => {
      jobsFailedTotal.inc({ queue: job.queue, name: job.name })
    }),

  // ... other metrics
}
```

### Health Check Endpoint

```typescript
// GET /health
{
  "status": "healthy",
  "workers": [
    {
      "queue": "default",
      "state": "running",
      "processed": 15234,
      "failed": 12,
      "uptime": "2h 34m"
    }
  ],
  "queues": [
    { "name": "default", "size": 42 },
    { "name": "high-priority", "size": 3 }
  ],
  "failedJobs": 156
}
```

---

## Configuration

### Environment Variables

```bash
# Queue driver
QUEUE_DRIVER=redis  # redis | database | memory | sync

# Redis configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
QUEUE_PREFIX=gello:queue:

# Database configuration (for database driver or failed jobs)
DATABASE_URL=postgres://user:pass@localhost:5432/myapp

# Worker defaults
QUEUE_DEFAULT=default
QUEUE_RETRY_AFTER=60
QUEUE_MAX_TRIES=3
QUEUE_TIMEOUT=60

# Monitoring
QUEUE_METRICS_PORT=9090
QUEUE_HEALTH_PORT=9091
```

### Config Schema

```typescript
const QueueConfig = S.Struct({
  driver: S.Literal("redis", "database", "memory", "sync"),
  defaultQueue: S.String.pipe(S.withDefault(() => "default")),
  redis: S.optional(S.Struct({
    host: S.String,
    port: S.Number,
    password: S.optional(S.String),
    db: S.optional(S.Number),
  })),
  database: S.optional(S.String),
  retryAfter: S.Number.pipe(S.withDefault(() => 60)),
  maxTries: S.Number.pipe(S.withDefault(() => 3)),
  timeout: S.Number.pipe(S.withDefault(() => 60)),
})
```

---

## Testing

### Test Utilities

```typescript
// Testing helpers
const makeTestQueue = () =>
  Effect.gen(function* () {
    const enqueued: Job[] = []
    const processed: Job[] = []

    const testDriver: QueueDriver = {
      push: (queue, job) =>
        Effect.sync(() => {
          enqueued.push(job)
          return job.id
        }),
      pop: () => Effect.succeed(Option.fromNullable(enqueued.shift())),
      // ... other methods
    }

    return {
      driver: testDriver,
      getEnqueued: () => enqueued,
      getProcessed: () => processed,
      assertJobEnqueued: (name: string) =>
        Effect.sync(() => {
          const found = enqueued.find((j) => j.name === name)
          if (!found) throw new Error(`Job ${name} not enqueued`)
        }),
    }
  })

// Usage in tests
describe("SendEmailJob", () => {
  it("enqueues email job", async () => {
    await Effect.runPromise(
      Effect.gen(function* () {
        const testQueue = yield* makeTestQueue()
        const queue = yield* Queue

        yield* queue.push(SendEmailJob, {
          to: "test@example.com",
          subject: "Test",
          body: "Hello",
        })

        yield* testQueue.assertJobEnqueued("SendEmail")
      }).pipe(
        Effect.provide(TestQueueLayer)
      )
    )
  })
})
```

---

## Migration Guide

### From BullMQ

```typescript
// Before (BullMQ)
const queue = new Queue("emails")
await queue.add("send-email", { to: "user@example.com" })

// After (Gello)
const program = Effect.gen(function* () {
  const queue = yield* Queue
  yield* queue.push(SendEmailJob, { to: "user@example.com" })
})
```

### From Laravel

```php
// Before (Laravel)
SendEmail::dispatch($user)->onQueue('emails');
Queue::later(now()->addMinutes(5), new SendReminder($user));

// After (Gello)
const program = Effect.gen(function* () {
  const queue = yield* Queue
  yield* queue.pushOn(QueueName("emails"), SendEmailJob, user)
  yield* queue.later(Duration.minutes(5), SendReminderJob, user)
})
```

---

## Implementation Phases

### Phase 1: Core Foundation ✅
- [x] Domain types (Job, JobId, QueueName, etc.)
- [x] QueueDriver port interface
- [x] MemoryDriver adapter
- [x] Basic Queue service
- [x] Job registry

### Phase 2: Production Drivers ✅
- [x] RedisDriver adapter
- [x] DatabaseDriver adapter
- [x] SyncDriver adapter
- [x] FailedJobRepository

### Phase 3: Worker System ✅
- [x] Worker implementation
- [x] Worker pool
- [x] Graceful shutdown
- [ ] Signal handling

### Phase 4: Queue Orchestrator App ✅
- [x] NX app setup
- [x] CLI commands (work, retry, failed, clear, status, help)
- [ ] Health check endpoint
- [ ] Metrics endpoint

### Phase 5: Advanced Features
- [ ] Job middleware
- [ ] Job batching
- [ ] Rate limiting
- [ ] Unique jobs
- [ ] Job chaining

### Phase 6: Observability
- [ ] Prometheus metrics
- [ ] OpenTelemetry tracing
- [ ] Admin dashboard (optional)

---

## API Reference

### Queue Service

| Method | Description |
|--------|-------------|
| `push(job, payload)` | Push job to default queue |
| `pushOn(queue, job, payload)` | Push job to specific queue |
| `later(delay, job, payload)` | Push job with delay |
| `bulk(jobs)` | Push multiple jobs |
| `size(queue?)` | Get queue size |
| `clear(queue?)` | Clear queue |

### CLI Commands

| Command | Description |
|---------|-------------|
| `queue:work` | Start queue worker |
| `queue:retry <id>` | Retry failed job |
| `queue:retry-all` | Retry all failed jobs |
| `queue:failed` | List failed jobs |
| `queue:clear <queue>` | Clear queue |
| `queue:status` | Show queue status |
| `queue:monitor` | Real-time monitoring |

---

## References

- [Laravel 4.2 Queues Documentation](https://laravel.com/docs/4.2/queues)
- [Effect Queue](https://effect.website/docs/guides/concurrency/queue)
- [Effect Fiber](https://effect.website/docs/guides/concurrency/fibers)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
