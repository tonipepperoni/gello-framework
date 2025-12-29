# @gello/queue-drivers

Queue driver implementations for the Gello queue system.

## Overview

This package provides concrete implementations of the `QueueDriver` and `FailedJobRepository` ports defined in `@gello/queue-core`. Choose the driver that best fits your deployment environment.

## Installation

```bash
pnpm add @gello/queue-drivers
```

## Available Drivers

### MemoryDriver

In-memory queue using Effect.Queue. Perfect for development and testing.

```typescript
import { Layer } from "effect"
import { MemoryDriverLive } from "@gello/queue-drivers"

const MainLayer = Layer.provide(MyApp, MemoryDriverLive)
```

**Characteristics:**
- Zero external dependencies
- Fast and lightweight
- Data lost on restart
- Single-process only

### RedisDriver

Production-ready driver using Redis lists and sorted sets.

```typescript
import { Layer } from "effect"
import { RedisDriverLive } from "@gello/queue-drivers"

const MainLayer = Layer.provide(
  MyApp,
  RedisDriverLive({
    host: "localhost",
    port: 6379,
    password: "secret",
    db: 0,
    keyPrefix: "myapp:queue:",
  })
)
```

**Characteristics:**
- Horizontal scaling with multiple workers
- Delayed job support via sorted sets
- Persistent across restarts
- Requires Redis server

### DatabaseDriver

Persistent queue using SQL database tables with `FOR UPDATE SKIP LOCKED`.

```typescript
import { Layer } from "effect"
import { DatabaseDriverLive, createQueueJobsTableSQL } from "@gello/queue-drivers"

// Run migration first
await db.execute(createQueueJobsTableSQL())

const MainLayer = Layer.provide(
  MyApp,
  DatabaseDriverLive("queue_jobs")
)
```

**Characteristics:**
- Uses existing database infrastructure
- Transactional job processing
- Supports PostgreSQL with skip-locked
- Good for moderate throughput

### SyncDriver

Executes jobs immediately without queuing. Useful for testing.

```typescript
import { Layer } from "effect"
import { SyncDriverLive } from "@gello/queue-drivers"

const TestLayer = Layer.provide(MyApp, SyncDriverLive)
```

**Characteristics:**
- No actual queuing
- Jobs execute synchronously
- Simplifies testing
- Not for production use

## Failed Job Repository

### MemoryFailedJobRepository

In-memory failed job storage for development.

```typescript
import { Layer } from "effect"
import { MemoryDriverLive, MemoryFailedJobRepositoryLive } from "@gello/queue-drivers"

const MainLayer = pipe(
  MemoryDriverLive,
  Layer.provideMerge(MemoryFailedJobRepositoryLive)
)
```

## Database Schema

For the DatabaseDriver, use these migration scripts:

```sql
-- Queue jobs table (PostgreSQL)
CREATE TABLE IF NOT EXISTS queue_jobs (
  id UUID PRIMARY KEY,
  queue VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  priority INTEGER DEFAULT 0 NOT NULL,
  attempts INTEGER DEFAULT 0 NOT NULL,
  max_attempts INTEGER DEFAULT 3 NOT NULL,
  timeout_ms BIGINT DEFAULT 60000 NOT NULL,
  retry_after_ms BIGINT DEFAULT 60000 NOT NULL,
  available_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reserved_at TIMESTAMPTZ
);

CREATE INDEX idx_queue_jobs_queue_available
ON queue_jobs (queue, available_at)
WHERE reserved_at IS NULL;

-- Failed jobs table
CREATE TABLE IF NOT EXISTS failed_jobs (
  id UUID PRIMARY KEY,
  queue VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  exception TEXT NOT NULL,
  failed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Building

```bash
nx build queue-drivers
```

## Testing

```bash
nx test queue-drivers
```
