import { Context, Effect, Option, Duration } from "effect"
import { Job } from "../domain/Job.js"
import { JobId } from "../domain/JobId.js"
import { QueueName } from "../domain/QueueName.js"
import { QueueError, QueueConnectionError } from "../errors/QueueError.js"

/**
 * Port interface for queue drivers (Hexagonal Architecture)
 */
export interface QueueDriver {
  /**
   * Push a job onto the queue
   */
  push<T>(queue: QueueName, job: Job<T>): Effect.Effect<JobId, QueueError | QueueConnectionError>

  /**
   * Push a job with delay
   */
  later<T>(
    queue: QueueName,
    job: Job<T>,
    delay: Duration.Duration
  ): Effect.Effect<JobId, QueueError | QueueConnectionError>

  /**
   * Pop the next job from the queue
   */
  pop(
    queue: QueueName,
    timeout?: Duration.Duration
  ): Effect.Effect<Option.Option<Job>, QueueError | QueueConnectionError>

  /**
   * Pop multiple jobs (batch)
   */
  popMany(
    queue: QueueName,
    count: number
  ): Effect.Effect<ReadonlyArray<Job>, QueueError | QueueConnectionError>

  /**
   * Mark job as completed and remove from queue
   */
  complete(job: Job): Effect.Effect<void, QueueError | QueueConnectionError>

  /**
   * Release job back to queue (for retry)
   */
  release(
    job: Job,
    delay?: Duration.Duration
  ): Effect.Effect<void, QueueError | QueueConnectionError>

  /**
   * Delete a job from the queue
   */
  delete(job: Job): Effect.Effect<void, QueueError | QueueConnectionError>

  /**
   * Get the number of jobs in the queue
   */
  size(queue: QueueName): Effect.Effect<number, QueueError | QueueConnectionError>

  /**
   * Clear all jobs from the queue
   */
  clear(queue: QueueName): Effect.Effect<void, QueueError | QueueConnectionError>

  /**
   * Get all queue names
   */
  queues(): Effect.Effect<ReadonlyArray<QueueName>, QueueError | QueueConnectionError>
}

export class QueueDriverTag extends Context.Tag("@gello/queue/QueueDriver")<
  QueueDriverTag,
  QueueDriver
>() {}
