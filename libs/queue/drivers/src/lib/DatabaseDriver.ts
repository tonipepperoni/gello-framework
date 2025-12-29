import { Effect, Option, Duration, Layer } from "effect"
import {
  QueueDriver,
  QueueDriverTag,
  Job,
  JobId,
  QueueName,
  QueueConnectionError,
} from "@gello/queue-core"

// Database client interface (to be provided by user via Drizzle or other ORM)
export interface DatabaseClient {
  query<T>(sql: string, params?: unknown[]): Effect.Effect<T[], QueueConnectionError>
  execute(sql: string, params?: unknown[]): Effect.Effect<void, QueueConnectionError>
  transaction<A, E>(
    fn: (tx: DatabaseClient) => Effect.Effect<A, E>
  ): Effect.Effect<A, E | QueueConnectionError>
}

export class DatabaseClientTag extends Effect.Tag("@gello/queue/DatabaseClient")<
  DatabaseClientTag,
  DatabaseClient
>() {}

interface JobRow {
  id: string
  queue: string
  name: string
  payload: string
  priority: number
  attempts: number
  max_attempts: number
  timeout_ms: number
  retry_after_ms: number
  available_at: Date
  created_at: Date
  reserved_at: Date | null
}

/**
 * Database queue driver using SQL tables
 * Supports PostgreSQL with FOR UPDATE SKIP LOCKED for concurrent workers
 */
export const makeDatabaseDriver = (tableName = "queue_jobs") =>
  Effect.gen(function* () {
    const db = yield* DatabaseClientTag

    const rowToJob = (row: JobRow): Job => ({
      id: row.id as JobId,
      queue: row.queue as QueueName,
      name: row.name,
      payload: JSON.parse(row.payload),
      priority: row.priority as 0 | 1 | 2 | 3 | 4 | 5,
      attempts: row.attempts,
      maxAttempts: row.max_attempts,
      timeout: Duration.millis(row.timeout_ms),
      retryAfter: Duration.millis(row.retry_after_ms),
      availableAt: row.available_at,
      createdAt: row.created_at,
      reservedAt: row.reserved_at ?? undefined,
    })

    const driver: QueueDriver = {
      push: (queue, job) =>
        Effect.gen(function* () {
          yield* db.execute(
            `INSERT INTO ${tableName}
             (id, queue, name, payload, priority, attempts, max_attempts, timeout_ms, retry_after_ms, available_at, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
              job.id,
              queue,
              job.name,
              JSON.stringify(job.payload),
              job.priority,
              job.attempts,
              job.maxAttempts,
              Duration.toMillis(job.timeout),
              Duration.toMillis(job.retryAfter),
              job.availableAt,
              job.createdAt,
            ]
          )
          return job.id
        }),

      later: (queue, job, delay) =>
        Effect.gen(function* () {
          const availableAt = new Date(Date.now() + Duration.toMillis(delay))
          const delayedJob = { ...job, availableAt }
          return yield* driver.push(queue, delayedJob)
        }),

      pop: (queue, timeout) =>
        db.transaction((tx) =>
          Effect.gen(function* () {
            // Use FOR UPDATE SKIP LOCKED for concurrent worker safety
            const rows = yield* tx.query<JobRow>(
              `SELECT * FROM ${tableName}
               WHERE queue = $1
                 AND available_at <= NOW()
                 AND reserved_at IS NULL
               ORDER BY priority DESC, available_at ASC
               LIMIT 1
               FOR UPDATE SKIP LOCKED`,
              [queue]
            )

            if (rows.length === 0) {
              return Option.none()
            }

            const row = rows[0]

            // Reserve the job
            yield* tx.execute(
              `UPDATE ${tableName}
               SET reserved_at = NOW(), attempts = attempts + 1
               WHERE id = $1`,
              [row.id]
            )

            const job = rowToJob({
              ...row,
              attempts: row.attempts + 1,
              reserved_at: new Date(),
            })

            return Option.some(job)
          })
        ),

      popMany: (queue, count) =>
        db.transaction((tx) =>
          Effect.gen(function* () {
            const rows = yield* tx.query<JobRow>(
              `SELECT * FROM ${tableName}
               WHERE queue = $1
                 AND available_at <= NOW()
                 AND reserved_at IS NULL
               ORDER BY priority DESC, available_at ASC
               LIMIT $2
               FOR UPDATE SKIP LOCKED`,
              [queue, count]
            )

            if (rows.length === 0) {
              return []
            }

            const ids = rows.map((r) => r.id)

            yield* tx.execute(
              `UPDATE ${tableName}
               SET reserved_at = NOW(), attempts = attempts + 1
               WHERE id = ANY($1)`,
              [ids]
            )

            return rows.map((row) =>
              rowToJob({
                ...row,
                attempts: row.attempts + 1,
                reserved_at: new Date(),
              })
            )
          })
        ),

      complete: (job) =>
        Effect.gen(function* () {
          yield* db.execute(`DELETE FROM ${tableName} WHERE id = $1`, [job.id])
        }),

      release: (job, delay) =>
        Effect.gen(function* () {
          const availableAt = delay
            ? new Date(Date.now() + Duration.toMillis(delay))
            : new Date()

          yield* db.execute(
            `UPDATE ${tableName}
             SET reserved_at = NULL, available_at = $2
             WHERE id = $1`,
            [job.id, availableAt]
          )
        }),

      delete: (job) =>
        Effect.gen(function* () {
          yield* db.execute(`DELETE FROM ${tableName} WHERE id = $1`, [job.id])
        }),

      size: (queue) =>
        Effect.gen(function* () {
          const rows = yield* db.query<{ count: string }>(
            `SELECT COUNT(*) as count FROM ${tableName}
             WHERE queue = $1 AND reserved_at IS NULL`,
            [queue]
          )
          return parseInt(rows[0]?.count ?? "0", 10)
        }),

      clear: (queue) =>
        Effect.gen(function* () {
          yield* db.execute(`DELETE FROM ${tableName} WHERE queue = $1`, [queue])
        }),

      queues: () =>
        Effect.gen(function* () {
          const rows = yield* db.query<{ queue: string }>(
            `SELECT DISTINCT queue FROM ${tableName}`
          )
          return rows.map((r) => r.queue as QueueName)
        }),
    }

    return driver
  })

export const DatabaseDriverLive = (tableName?: string) =>
  Layer.effect(QueueDriverTag, makeDatabaseDriver(tableName))

/**
 * SQL migration for queue jobs table (PostgreSQL)
 */
export const createQueueJobsTableSQL = (tableName = "queue_jobs") => `
CREATE TABLE IF NOT EXISTS ${tableName} (
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

CREATE INDEX IF NOT EXISTS idx_${tableName}_queue_available
ON ${tableName} (queue, available_at)
WHERE reserved_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_${tableName}_reserved
ON ${tableName} (reserved_at)
WHERE reserved_at IS NOT NULL;
`

/**
 * SQL migration for failed jobs table (PostgreSQL)
 */
export const createFailedJobsTableSQL = (tableName = "failed_jobs") => `
CREATE TABLE IF NOT EXISTS ${tableName} (
  id UUID PRIMARY KEY,
  queue VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  exception TEXT NOT NULL,
  failed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_${tableName}_queue ON ${tableName} (queue);
CREATE INDEX IF NOT EXISTS idx_${tableName}_failed_at ON ${tableName} (failed_at);
`
