# @gello/queue-worker

Worker system for processing queue jobs in the Gello framework.

## Overview

This package provides the worker implementation that processes jobs from queues. It supports configurable concurrency, retry policies, and graceful shutdown.

## Installation

```bash
pnpm add @gello/queue-worker
```

## Usage

### Basic Worker

```typescript
import { Effect, Layer, Duration } from "effect"
import { makeWorker, WorkerConfig, QueueName } from "@gello/queue-worker"

const config: WorkerConfig = {
  queue: QueueName("default"),
  concurrency: 1,
  sleep: Duration.seconds(3),
  tries: 3,
  timeout: Duration.minutes(1),
}

const program = Effect.gen(function* () {
  const worker = yield* makeWorker(config)
  yield* worker.start()
})
```

### Multi-Queue Worker

Process multiple queues with priority ordering:

```typescript
const config: WorkerConfig = {
  queue: [
    QueueName("high-priority"),
    QueueName("default"),
    QueueName("low-priority"),
  ],
  concurrency: 4,
  sleep: Duration.seconds(3),
}
```

### Worker Pool

Manage multiple workers across different queues:

```typescript
import { makeWorkerPool, WorkerPoolConfig } from "@gello/queue-worker"

const poolConfig: WorkerPoolConfig = {
  workers: [
    { queue: QueueName("emails"), concurrency: 4 },
    { queue: QueueName("reports"), concurrency: 2 },
    { queue: QueueName("default"), concurrency: 1 },
  ],
}

const program = Effect.gen(function* () {
  const pool = yield* makeWorkerPool(poolConfig)
  yield* pool.startAll()
})
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `queue` | `QueueName \| QueueName[]` | `"default"` | Queue(s) to process |
| `concurrency` | `number` | `1` | Number of concurrent workers |
| `sleep` | `Duration` | `3s` | Sleep when queue is empty |
| `maxJobs` | `number?` | - | Stop after processing N jobs |
| `maxTime` | `Duration?` | - | Stop after running for duration |
| `timeout` | `Duration` | `60s` | Default job timeout |
| `tries` | `number` | `3` | Max retry attempts |
| `backoff` | `Schedule` | Exponential | Retry backoff schedule |
| `stopOnEmpty` | `boolean` | `false` | Stop when queue is empty |

## Worker Lifecycle

```typescript
const worker = yield* makeWorker(config)

// Start processing
yield* worker.start()

// Pause processing (graceful)
yield* worker.pause()

// Resume processing
yield* worker.resume()

// Stop processing (graceful)
yield* worker.stop()

// Get current status
const status = yield* worker.status()
console.log(status.processedCount, status.failedCount)
```

## Worker Status

```typescript
interface WorkerStatus {
  state: "running" | "paused" | "stopped"
  processedCount: number
  failedCount: number
  currentJob?: JobId
  startedAt: Date
  uptime: Duration
  queues: ReadonlyArray<QueueName>
}
```

## Layer Composition

```typescript
import { Layer, pipe } from "effect"
import { WorkerLive } from "@gello/queue-worker"
import { MemoryDriverLive, MemoryFailedJobRepositoryLive } from "@gello/queue-drivers"
import { JobRegistryLive } from "./jobs"

const WorkerLayer = pipe(
  WorkerLive({ queue: QueueName("default"), concurrency: 2 }),
  Layer.provide(MemoryDriverLive),
  Layer.provide(MemoryFailedJobRepositoryLive),
  Layer.provide(JobRegistryLive)
)
```

## Building

```bash
nx build queue-worker
```

## Testing

```bash
nx test queue-worker
```
