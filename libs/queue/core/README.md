# @gello/queue-core

Core domain types, ports, and services for the Gello queue system.

## Overview

This package provides the foundational building blocks for a Laravel 4.2-inspired queue system built on Effect. It defines the domain model, port interfaces, and high-level services that adapters implement.

## Installation

```bash
pnpm add @gello/queue-core
```

## Contents

### Domain Types

| Type | Description |
|------|-------------|
| `JobId` | Branded string identifier for jobs |
| `QueueName` | Branded string for queue names |
| `JobPriority` | Priority levels 0-5 (higher = more urgent) |
| `JobStatus` | Job lifecycle states |
| `Job<T>` | Core job record with payload |
| `FailedJob` | Failed job for dead letter queue |
| `Queueable<T>` | Job handler definition interface |

### Ports (Interfaces)

| Port | Description |
|------|-------------|
| `QueueDriver` | Driver interface for queue backends |
| `FailedJobRepository` | Failed job storage interface |

### Services

| Service | Description |
|---------|-------------|
| `Queue` | High-level service for dispatching jobs |
| `JobRegistry` | Centralized registry for job handlers |

### Errors

| Error | Description |
|-------|-------------|
| `QueueError` | Base queue error |
| `QueueConnectionError` | Connection failure to backend |
| `JobNotFoundError` | Job handler not registered |
| `JobExecutionError` | Job handler threw an error |
| `JobTimeoutError` | Job exceeded timeout |
| `JobValidationError` | Payload validation failed |

## Usage

### Defining a Job

```typescript
import { Effect, Duration } from "effect"
import { Queueable, QueueName, JobPriority } from "@gello/queue-core"

interface SendEmailPayload {
  to: string
  subject: string
  body: string
}

const SendEmailJob: Queueable<SendEmailPayload> = {
  name: "SendEmail",
  queue: QueueName("emails"),
  priority: JobPriority.NORMAL,
  maxAttempts: 3,
  timeout: Duration.seconds(30),

  handle: (payload) =>
    Effect.gen(function* () {
      // Send email logic
      yield* Effect.log(`Sending email to ${payload.to}`)
    }),

  onFailure: (payload, error) =>
    Effect.log(`Failed to send email to ${payload.to}: ${error}`),
}
```

### Dispatching Jobs

```typescript
import { Effect } from "effect"
import { QueueTag, QueueName } from "@gello/queue-core"

const program = Effect.gen(function* () {
  const queue = yield* QueueTag

  // Push to default queue
  yield* queue.push(SendEmailJob, {
    to: "user@example.com",
    subject: "Welcome!",
    body: "Hello world",
  })

  // Push with delay
  yield* queue.later(Duration.minutes(5), SendEmailJob, { ... })

  // Push to specific queue
  yield* queue.pushOn(QueueName("high-priority"), SendEmailJob, { ... })
})
```

### Registering Job Handlers

```typescript
import { Effect } from "effect"
import { JobRegistryTag } from "@gello/queue-core"

const program = Effect.gen(function* () {
  const registry = yield* JobRegistryTag

  yield* registry.register(SendEmailJob)
  yield* registry.register(ProcessReportJob)
  yield* registry.register(CleanupJob)
})
```

## Building

```bash
nx build queue-core
```

## Testing

```bash
nx test queue-core
```
