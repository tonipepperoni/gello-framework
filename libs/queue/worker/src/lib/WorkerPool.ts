import { Context, Effect, Duration, Ref, Fiber, Layer, HashMap } from "effect"
import { QueueName } from "@gello/queue-core"
import { Worker, WorkerConfig, WorkerStatus, makeWorker, defaultWorkerConfig } from "./Worker.ts"

export interface QueueWorkerConfig extends Omit<WorkerConfig, "queue"> {
  readonly name: QueueName
}

export interface WorkerPoolConfig {
  readonly queues: ReadonlyArray<QueueWorkerConfig>
  readonly defaultConcurrency?: number
  readonly defaultTimeout?: Duration.Duration
}

export interface WorkerPool {
  /**
   * Start all workers
   */
  startAll(): Effect.Effect<void, never>

  /**
   * Stop all workers gracefully
   */
  stopAll(): Effect.Effect<void, never>

  /**
   * Start a specific queue worker
   */
  start(queue: QueueName): Effect.Effect<void, never>

  /**
   * Stop a specific queue worker
   */
  stop(queue: QueueName): Effect.Effect<void, never>

  /**
   * Pause a specific queue worker
   */
  pause(queue: QueueName): Effect.Effect<void, never>

  /**
   * Resume a specific queue worker
   */
  resume(queue: QueueName): Effect.Effect<void, never>

  /**
   * Get status of all workers
   */
  status(): Effect.Effect<ReadonlyArray<WorkerStatus>, never>

  /**
   * Get status of a specific worker
   */
  workerStatus(queue: QueueName): Effect.Effect<WorkerStatus | undefined, never>
}

export class WorkerPoolTag extends Context.Tag("@gello/queue/WorkerPool")<
  WorkerPoolTag,
  WorkerPool
>() {}

/**
 * Create a worker pool that manages multiple queue workers
 */
export const makeWorkerPool = (config: WorkerPoolConfig) =>
  Effect.gen(function* () {
    const workers = yield* Ref.make<HashMap.HashMap<QueueName, Worker>>(HashMap.empty())
    const fibers = yield* Ref.make<HashMap.HashMap<QueueName, Fiber.RuntimeFiber<void, never>>>(
      HashMap.empty()
    )

    // Create workers for each configured queue
    for (const queueConfig of config.queues) {
      const workerConfig: WorkerConfig = {
        ...defaultWorkerConfig,
        queue: queueConfig.name,
        concurrency: queueConfig.concurrency ?? config.defaultConcurrency ?? 1,
        timeout: queueConfig.timeout ?? config.defaultTimeout ?? Duration.minutes(1),
        sleep: queueConfig.sleep ?? Duration.seconds(3),
        tries: queueConfig.tries ?? 3,
        maxJobs: queueConfig.maxJobs,
        maxTime: queueConfig.maxTime,
        stopOnEmpty: queueConfig.stopOnEmpty,
      }

      const worker = yield* makeWorker(workerConfig)
      yield* Ref.update(workers, (m) => HashMap.set(m, queueConfig.name, worker))
    }

    const pool: WorkerPool = {
      startAll: () =>
        Effect.gen(function* () {
          const workerMap = yield* Ref.get(workers)

          for (const [queue, worker] of HashMap.entries(workerMap)) {
            const fiber = yield* Effect.forkDaemon(worker.start())
            yield* Ref.update(fibers, (m) => HashMap.set(m, queue, fiber))
          }
        }),

      stopAll: () =>
        Effect.gen(function* () {
          const workerMap = yield* Ref.get(workers)

          for (const worker of HashMap.values(workerMap)) {
            yield* worker.stop()
          }
        }),

      start: (queue) =>
        Effect.gen(function* () {
          const workerMap = yield* Ref.get(workers)
          const worker = HashMap.get(workerMap, queue)

          if (worker._tag === "Some") {
            const fiber = yield* Effect.forkDaemon(worker.value.start())
            yield* Ref.update(fibers, (m) => HashMap.set(m, queue, fiber))
          }
        }),

      stop: (queue) =>
        Effect.gen(function* () {
          const workerMap = yield* Ref.get(workers)
          const worker = HashMap.get(workerMap, queue)

          if (worker._tag === "Some") {
            yield* worker.value.stop()
          }
        }),

      pause: (queue) =>
        Effect.gen(function* () {
          const workerMap = yield* Ref.get(workers)
          const worker = HashMap.get(workerMap, queue)

          if (worker._tag === "Some") {
            yield* worker.value.pause()
          }
        }),

      resume: (queue) =>
        Effect.gen(function* () {
          const workerMap = yield* Ref.get(workers)
          const worker = HashMap.get(workerMap, queue)

          if (worker._tag === "Some") {
            yield* worker.value.resume()
          }
        }),

      status: () =>
        Effect.gen(function* () {
          const workerMap = yield* Ref.get(workers)
          const statuses: WorkerStatus[] = []

          for (const worker of HashMap.values(workerMap)) {
            const status = yield* worker.status()
            statuses.push(status)
          }

          return statuses
        }),

      workerStatus: (queue) =>
        Effect.gen(function* () {
          const workerMap = yield* Ref.get(workers)
          const worker = HashMap.get(workerMap, queue)

          if (worker._tag === "Some") {
            return yield* worker.value.status()
          }

          return undefined
        }),
    }

    return pool
  })

export const WorkerPoolLive = (config: WorkerPoolConfig) =>
  Layer.effect(WorkerPoolTag, makeWorkerPool(config))
