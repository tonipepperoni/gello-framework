# Sprint 3: Background Processing (HIGH PRIORITY)
**Duration:** Weeks 5-6
**Epic:** Epic 3 - Queue System
**Story Points:** 34 (expanded for DDD + Hexagonal)
**Package:** `@gello/queue-*` (16 sub-libs)

---

## Sprint Goal

Deliver a production-ready job queue system that enables reliable background processing with retry logic, scheduling, and monitoring capabilities. Pure Effect implementation — no external queue dependencies.

**Note:** This sprint is marked HIGH PRIORITY per user request. Queue system uses DDD + Hexagonal Architecture split into 16 granular NX libs for optimal caching.

> **Architecture Reference:** See [QUEUE_ARCHITECTURE.md](../QUEUE_ARCHITECTURE.md) for comprehensive design document with:
> - Hexagonal architecture diagram
> - All 16 sub-lib definitions
> - Complete code examples
> - Definition of Done checklist

---

## User Stories

### US-3.1: Job Definition DSL
**As a** developer
**I want** to define jobs with type-safe payloads
**So that** I can process background work reliably

**Acceptance Criteria:**
- [ ] Job class with typed payload
- [ ] Effect-based handle method
- [ ] Configurable retry count and backoff
- [ ] Job priority levels
- [ ] Unique job support (prevent duplicates)

**Story Points:** 5

**Technical Tasks:**
1. Create `Job` base class/interface
2. Define job payload schema with Effect Schema
3. Add configuration options (tries, backoff, priority)
4. Implement unique job ID generation
5. Create example SendEmailJob

**Code Example:**
```typescript
import { Job, Schema as S } from "@gello/queue"

export class SendWelcomeEmail extends Job<{
  userId: number
  email: string
}> {
  static schema = S.Struct({
    userId: S.Number,
    email: S.String.pipe(S.pattern(/^[^\s@]+@[^\s@]+$/))
  })

  tries = 3
  backoff = [60, 300, 900] // seconds

  handle = Effect.gen(function* () {
    const { userId, email } = this.payload
    const emailService = yield* EmailService
    yield* emailService.send(email, "welcome", { userId })
  })
}
```

---

### US-3.2: Queue Dispatching
**As a** developer
**I want** to dispatch jobs to a queue
**So that** they are processed asynchronously

**Acceptance Criteria:**
- [ ] `Job.dispatch()` adds job to queue
- [ ] `Job.dispatchAfter(delay)` schedules job
- [ ] Jobs can be dispatched to specific queues
- [ ] Job ID returned for tracking
- [ ] Batch dispatching support

**Story Points:** 4

**Technical Tasks:**
1. Create `QueueService` for dispatching
2. Implement dispatch method with serialization
3. Add delayed job scheduling
4. Add queue name routing
5. Implement batch dispatch

**Code Example:**
```typescript
// Simple dispatch
await SendWelcomeEmail.dispatch({ userId: 1, email: "user@example.com" })

// Delayed dispatch (5 minutes)
await SendWelcomeEmail.dispatchAfter(300, { userId: 1, email: "user@example.com" })

// Specific queue
await SendWelcomeEmail.dispatch({ userId: 1 }, { queue: "emails" })

// Batch
await Queue.batch([
  SendWelcomeEmail.make({ userId: 1 }),
  SendWelcomeEmail.make({ userId: 2 })
])
```

---

### US-3.3: Queue Drivers
**As a** developer
**I want** multiple queue backends
**So that** I can choose based on my infrastructure

**Acceptance Criteria:**
- [ ] Memory driver (development)
- [ ] Database driver (PostgreSQL)
- [ ] Redis driver (production)
- [ ] Driver configured via environment
- [ ] Same API across all drivers

**Story Points:** 5

**Technical Tasks:**
1. Create `QueueDriver` interface
2. Implement MemoryDriver (in-memory queue)
3. Implement DatabaseDriver (PostgreSQL jobs table)
4. Implement RedisDriver (Redis lists/streams)
5. Add driver factory with config-based selection

**Architecture:**
```typescript
interface QueueDriver {
  push(job: SerializedJob): Effect.Effect<string, QueueError>
  pop(queue: string): Effect.Effect<SerializedJob | null, QueueError>
  schedule(job: SerializedJob, at: Date): Effect.Effect<string, QueueError>
  delete(jobId: string): Effect.Effect<void, QueueError>
  failed(job: SerializedJob, error: Error): Effect.Effect<void, QueueError>
}
```

---

### US-3.4: Worker Implementation
**As a** developer
**I want** to run a worker process
**So that** jobs are processed from the queue

**Acceptance Criteria:**
- [ ] Worker polls queue for jobs
- [ ] Concurrent job processing (configurable)
- [ ] Memory limit handling
- [ ] Graceful shutdown (finish current jobs)
- [ ] Worker health monitoring

**Story Points:** 5

**Technical Tasks:**
1. Create `Worker` class with polling loop
2. Implement job execution with timeout
3. Add concurrency control (semaphore)
4. Implement graceful shutdown via signals
5. Add memory monitoring and restart

**Code Example:**
```typescript
// Start worker
const worker = new Worker({
  queues: ["default", "emails"],
  concurrency: 5,
  memoryLimit: "512MB"
})

await worker.start() // Blocks and processes jobs
```

---

### US-3.5: Retry and Failure Handling
**As a** developer
**I want** automatic retries with backoff
**So that** transient failures are handled gracefully

**Acceptance Criteria:**
- [ ] Configurable retry attempts per job
- [ ] Exponential backoff support
- [ ] Failed jobs stored for inspection
- [ ] Manual retry of failed jobs
- [ ] Dead letter queue for permanent failures

**Story Points:** 3

**Technical Tasks:**
1. Implement retry counter tracking
2. Add backoff calculation
3. Create failed_jobs table/collection
4. Add failed job inspection API
5. Implement retry-failed command

---

### US-3.6: Queue CLI Commands
**As a** developer
**I want** CLI commands to manage queues
**So that** I can operate workers and inspect jobs

**Acceptance Criteria:**
- [ ] `gello queue:work` starts worker
- [ ] `gello queue:status` shows queue metrics
- [ ] `gello queue:retry` retries failed jobs
- [ ] `gello queue:clear` clears a queue
- [ ] Worker logs job processing

**Story Points:** 2

**Technical Tasks:**
1. Create queue:work command
2. Create queue:status command
3. Create queue:retry command
4. Add logging with job details
5. Document CLI usage

---

## Technical Specifications

### Package Structure (DDD + Hexagonal - 16 libs)

```
libs/queue/
├── contracts/           # Ports & shared types (zero deps)
│   └── src/
│       ├── Job.schema.ts
│       ├── QueuePort.ts
│       ├── IdempotencyPort.ts
│       ├── DLQPort.ts
│       ├── ObservabilityPort.ts
│       └── errors.ts
├── domain/              # Core domain logic
│   ├── job/             # Job entity & value objects
│   ├── retry/           # Retry policies & backoff
│   ├── idempotency/     # Exactly-once guarantees
│   └── failure/         # Failure classification
├── producer/            # Producer SDK
│   └── src/
│       ├── QueueProducer.ts
│       └── DispatchOptions.ts
├── worker/              # Worker runtime
│   ├── core/            # Worker loop & lifecycle
│   ├── pool/            # Worker pool management
│   └── signals/         # Graceful shutdown
├── adapters/            # Infrastructure adapters
│   ├── memory/          # In-memory (dev/test)
│   ├── redis/           # Redis driver
│   └── postgres/        # PostgreSQL driver
├── dlq/                 # Dead letter queue
├── observability/       # Metrics, tracing, logging
├── ops/                 # Operator tooling & CLI
└── testing/             # Test utilities & mocks
```

> **Full Details:** See [QUEUE_ARCHITECTURE.md](../QUEUE_ARCHITECTURE.md)

### Key Dependencies

```json
{
  "dependencies": {
    "effect": "^3.12.5",
    "@effect/schema": "^0.77.0",
    "@gello/core": "workspace:*",
    "@gello/database": "workspace:*"
  },
  "optionalDependencies": {
    "ioredis": "^5.4.1"
  }
}
```

### Database Schema (for DatabaseDriver)

```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue VARCHAR(255) NOT NULL DEFAULT 'default',
    job_class VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    available_at TIMESTAMP NOT NULL DEFAULT NOW(),
    reserved_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE failed_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL,
    queue VARCHAR(255) NOT NULL,
    job_class VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    exception TEXT NOT NULL,
    failed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_queue_available ON jobs(queue, available_at);
CREATE INDEX idx_jobs_reserved ON jobs(reserved_at);
```

### Worker Pattern (inspired by platform/Graphile)

```typescript
export class Worker extends Context.Tag("Worker")<Worker, WorkerInstance>() {
  static readonly layer = Layer.scoped(
    Worker,
    Effect.gen(function* () {
      const queue = yield* QueueService
      const config = yield* WorkerConfig

      const worker = yield* Effect.acquireRelease(
        Effect.sync(() => new WorkerInstance(queue, config)),
        (worker) => worker.shutdown()
      )

      // Start processing in background
      yield* Effect.fork(worker.run())

      return worker
    })
  )
}
```

---

## Definition of Done

> **Complete Checklist:** See [QUEUE_ARCHITECTURE.md - Definition of Done](../QUEUE_ARCHITECTURE.md#definition-of-done-checklist)

### Summary Checklist

- [ ] **A) Architecture & Contracts** - Ports, schemas, error types
- [ ] **B) Backend Drivers** - Memory, Redis, Postgres adapters
- [ ] **C) Producer SDK** - dispatch(), dispatchAfter(), batch
- [ ] **D) Worker Runtime** - Concurrency, timeout, graceful shutdown
- [ ] **E) Retry Policy** - Exponential backoff, failure classification
- [ ] **F) DLQ & Ops** - Failed jobs, retry, purge commands
- [ ] **G) Idempotency** - Exactly-once with Redis/Postgres locks
- [ ] **H) Observability** - Metrics, tracing, structured logs
- [ ] **I) Ops Readiness** - CLI commands, K8s probes
- [ ] **J) Testing** - Test queue, property tests, chaos tests

### Technical Metrics
- [ ] Test coverage > 80%
- [ ] Jobs survive worker restart
- [ ] Throughput > 100 jobs/second
- [ ] Zero job loss on crash

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Job loss on crash | Critical | Medium | Atomic job reservation, transaction wrapping |
| Performance bottleneck | High | Medium | Connection pooling, batched operations |
| Redis connection issues | Medium | Low | Connection retry, fallback to database |
| Memory leaks in worker | High | Medium | Memory monitoring, worker restart |

---

## Success Metrics

- Jobs processed at > 100/second (simple jobs)
- Zero job loss on worker crash
- Retry logic works correctly
- Failed jobs can be inspected and retried
- Queue status visible via CLI

---

## Dependencies

- **Requires Sprint 2:** DatabaseDriver needs @gello/database
- **Requires Sprint 1:** ConfigService, DI patterns
- **Enables Sprint 4:** CLI commands and example app

---

## Reference Implementation

Based on platform library analysis, the Graphile Worker pattern provides a good reference for PostgreSQL-backed queues with Effect integration. Key patterns to adopt:

1. **Layer.scoped** for worker lifecycle management
2. **Effect.acquireRelease** for cleanup guarantees
3. **Effect.fork** for background processing
4. **Graceful shutdown** via signal handling
