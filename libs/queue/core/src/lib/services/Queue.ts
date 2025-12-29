import { Context, Effect, Duration, Layer } from "effect"
import { Job, createJob } from "../domain/Job.js"
import { JobId } from "../domain/JobId.js"
import { QueueName, DEFAULT_QUEUE } from "../domain/QueueName.js"
import { Queueable } from "../domain/Queueable.js"
import { QueueDriverTag } from "../ports/QueueDriver.js"
import { QueueError, QueueConnectionError } from "../errors/QueueError.js"

/**
 * High-level Queue service (Laravel-style facade)
 */
export interface QueueService {
  /**
   * Push a job onto the default queue
   */
  push<T>(
    job: Queueable<T>,
    payload: T
  ): Effect.Effect<JobId, QueueError | QueueConnectionError>

  /**
   * Push a job onto a specific queue
   */
  pushOn<T>(
    queue: QueueName,
    job: Queueable<T>,
    payload: T
  ): Effect.Effect<JobId, QueueError | QueueConnectionError>

  /**
   * Push a job with delay
   */
  later<T>(
    delay: Duration.Duration,
    job: Queueable<T>,
    payload: T
  ): Effect.Effect<JobId, QueueError | QueueConnectionError>

  /**
   * Push a job with delay onto a specific queue
   */
  laterOn<T>(
    queue: QueueName,
    delay: Duration.Duration,
    job: Queueable<T>,
    payload: T
  ): Effect.Effect<JobId, QueueError | QueueConnectionError>

  /**
   * Push multiple jobs
   */
  bulk<T>(
    jobs: ReadonlyArray<{ job: Queueable<T>; payload: T }>
  ): Effect.Effect<ReadonlyArray<JobId>, QueueError | QueueConnectionError>

  /**
   * Get queue size
   */
  size(queue?: QueueName): Effect.Effect<number, QueueError | QueueConnectionError>

  /**
   * Clear a queue
   */
  clear(queue?: QueueName): Effect.Effect<void, QueueError | QueueConnectionError>

  /**
   * Get all queue names
   */
  queues(): Effect.Effect<ReadonlyArray<QueueName>, QueueError | QueueConnectionError>
}

export class Queue extends Context.Tag("@gello/queue/Queue")<Queue, QueueService>() {}

/**
 * Create a Job record from a Queueable definition and payload
 */
const makeJobFromQueueable = <T>(
  queueable: Queueable<T>,
  payload: T,
  queue?: QueueName,
  delay?: Duration.Duration
): Job<T> =>
  createJob({
    name: queueable.name,
    payload,
    queue: queue ?? queueable.queue ?? DEFAULT_QUEUE,
    priority: queueable.priority,
    maxAttempts: queueable.maxAttempts,
    timeout: queueable.timeout,
    retryAfter: queueable.retryAfter,
    delay,
  })

/**
 * Live Queue service implementation
 */
export const QueueLive = Layer.effect(
  Queue,
  Effect.gen(function* () {
    const driver = yield* QueueDriverTag

    const service: QueueService = {
      push: (job, payload) =>
        Effect.gen(function* () {
          const queue = job.queue ?? DEFAULT_QUEUE
          const jobRecord = makeJobFromQueueable(job, payload, queue)
          return yield* driver.push(queue, jobRecord)
        }),

      pushOn: (queue, job, payload) =>
        Effect.gen(function* () {
          const jobRecord = makeJobFromQueueable(job, payload, queue)
          return yield* driver.push(queue, jobRecord)
        }),

      later: (delay, job, payload) =>
        Effect.gen(function* () {
          const queue = job.queue ?? DEFAULT_QUEUE
          const jobRecord = makeJobFromQueueable(job, payload, queue, delay)
          return yield* driver.later(queue, jobRecord, delay)
        }),

      laterOn: (queue, delay, job, payload) =>
        Effect.gen(function* () {
          const jobRecord = makeJobFromQueueable(job, payload, queue, delay)
          return yield* driver.later(queue, jobRecord, delay)
        }),

      bulk: (jobs) =>
        Effect.gen(function* () {
          const results: JobId[] = []
          for (const { job, payload } of jobs) {
            const queue = job.queue ?? DEFAULT_QUEUE
            const jobRecord = makeJobFromQueueable(job, payload, queue)
            const id = yield* driver.push(queue, jobRecord)
            results.push(id)
          }
          return results
        }),

      size: (queue) => driver.size(queue ?? DEFAULT_QUEUE),

      clear: (queue) => driver.clear(queue ?? DEFAULT_QUEUE),

      queues: () => driver.queues(),
    }

    return service
  })
)
