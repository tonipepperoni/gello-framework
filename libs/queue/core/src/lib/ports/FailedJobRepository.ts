import { Context, Effect, Option, Duration } from "effect"
import { FailedJob } from "../domain/FailedJob.js"
import { JobId } from "../domain/JobId.js"
import { QueueError, QueueConnectionError } from "../errors/QueueError.js"

/**
 * Port interface for failed job repository
 */
export interface FailedJobRepository {
  /**
   * Store a failed job
   */
  store(job: FailedJob): Effect.Effect<void, QueueError>

  /**
   * Get all failed jobs
   */
  all(): Effect.Effect<ReadonlyArray<FailedJob>, QueueError>

  /**
   * Find failed job by ID
   */
  find(id: JobId): Effect.Effect<Option.Option<FailedJob>, QueueError>

  /**
   * Retry a failed job (move back to queue)
   */
  retry(id: JobId): Effect.Effect<void, QueueError | QueueConnectionError>

  /**
   * Retry all failed jobs
   */
  retryAll(): Effect.Effect<number, QueueError | QueueConnectionError>

  /**
   * Delete a failed job
   */
  delete(id: JobId): Effect.Effect<void, QueueError>

  /**
   * Prune old failed jobs
   */
  prune(olderThan: Duration.Duration): Effect.Effect<number, QueueError>

  /**
   * Count failed jobs
   */
  count(): Effect.Effect<number, QueueError>
}

export class FailedJobRepositoryTag extends Context.Tag("@gello/queue/FailedJobRepository")<
  FailedJobRepositoryTag,
  FailedJobRepository
>() {}
