import { Context, Effect, Duration, Ref, Option, Fiber, Schedule, Layer, pipe } from "effect"
import {
  Job,
  JobId,
  QueueName,
  DEFAULT_QUEUE,
  QueueDriverTag,
  FailedJobRepositoryTag,
  JobRegistryTag,
  createFailedJob,
} from "@gello/queue-core"

export interface WorkerConfig {
  readonly queue: QueueName | ReadonlyArray<QueueName>
  readonly concurrency: number
  readonly sleep: Duration.Duration
  readonly maxJobs?: number
  readonly maxTime?: Duration.Duration
  readonly timeout?: Duration.Duration
  readonly tries?: number
  readonly backoff?: Schedule.Schedule<unknown, unknown>
  readonly stopOnEmpty?: boolean
}

export const defaultWorkerConfig: WorkerConfig = {
  queue: DEFAULT_QUEUE,
  concurrency: 1,
  sleep: Duration.seconds(3),
  tries: 3,
  timeout: Duration.minutes(1),
  backoff: pipe(
    Schedule.exponential(Duration.seconds(1), 2),
    Schedule.jittered,
    Schedule.upTo(Duration.minutes(5))
  ),
  stopOnEmpty: false,
}

export type WorkerState = "running" | "paused" | "stopped"

export interface WorkerStatus {
  readonly state: WorkerState
  readonly processedCount: number
  readonly failedCount: number
  readonly currentJob?: JobId
  readonly startedAt: Date
  readonly uptime: Duration.Duration
  readonly queues: ReadonlyArray<QueueName>
}

export interface Worker {
  start(): Effect.Effect<void>
  stop(): Effect.Effect<void>
  pause(): Effect.Effect<void>
  resume(): Effect.Effect<void>
  status(): Effect.Effect<WorkerStatus>
}

export class WorkerTag extends Context.Tag("@gello/queue/Worker")<WorkerTag, Worker>() {}

export const makeWorker = (config: WorkerConfig = defaultWorkerConfig) =>
  Effect.gen(function* () {
    const driver = yield* QueueDriverTag
    const registry = yield* JobRegistryTag
    const failedRepo = yield* FailedJobRepositoryTag

    const queues = Array.isArray(config.queue) ? config.queue : [config.queue]
    const startedAt = new Date()

    const state = yield* Ref.make<{
      status: WorkerState
      processedCount: number
      failedCount: number
      currentJob?: JobId
    }>({
      status: "stopped",
      processedCount: 0,
      failedCount: 0,
    })

    const shouldStop = yield* Ref.make(false)
    const isPaused = yield* Ref.make(false)
    const jobsProcessed = yield* Ref.make(0)
    const workerFibers = yield* Ref.make<Fiber.RuntimeFiber<void, never>[]>([])

    const processJob = (job: Job): Effect.Effect<void, never> =>
      Effect.gen(function* () {
        yield* Ref.update(state, (s) => ({ ...s, currentJob: job.id }))
        yield* Effect.logInfo(`Processing job: ${job.name} (${job.id})`)

        yield* pipe(
          registry.dispatch(job),
          Effect.timeout(job.timeout),
          Effect.catchAll((error) =>
            Effect.gen(function* () {
              yield* Effect.logWarning(`Job ${job.name} failed: ${error}`)

              if (job.attempts >= job.maxAttempts) {
                yield* failedRepo.store(
                  createFailedJob(job.id, job.queue, job.name, job.payload, String(error))
                )
                yield* Effect.logError(`Job ${job.name} permanently failed after ${job.attempts} attempts`)
                yield* Ref.update(state, (s) => ({ ...s, failedCount: s.failedCount + 1 }))

                const handler = yield* registry.getHandler(job.name).pipe(Effect.catchAll(() => Effect.succeed(null)))
                if (handler?.onFailure) {
                  yield* handler.onFailure(job.payload, error as never).pipe(
                    Effect.catchAll((e) => Effect.logError(`onFailure hook failed: ${e}`))
                  )
                }
              } else {
                yield* driver.release(job, job.retryAfter)
                yield* Effect.logInfo(`Job ${job.name} released for retry (attempt ${job.attempts}/${job.maxAttempts})`)
              }
            })
          ),
          Effect.tap(() =>
            Effect.gen(function* () {
              yield* driver.complete(job)
              yield* Effect.logInfo(`Job ${job.name} completed successfully`)
              yield* Ref.update(state, (s) => ({ ...s, processedCount: s.processedCount + 1, currentJob: undefined }))
              yield* Ref.update(jobsProcessed, (n) => n + 1)
            })
          )
        )
      }).pipe(Effect.catchAll(() => Effect.void))

    const workerLoop = Effect.gen(function* () {
      while (!(yield* Ref.get(shouldStop))) {
        if (yield* Ref.get(isPaused)) {
          yield* Effect.sleep(config.sleep)
          continue
        }

        if (config.maxJobs) {
          const processed = yield* Ref.get(jobsProcessed)
          if (processed >= config.maxJobs) {
            yield* Effect.logInfo(`Max jobs limit reached (${config.maxJobs})`)
            yield* Ref.set(shouldStop, true)
            continue
          }
        }

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
            yield* Effect.logInfo("Queue empty, stopping worker")
            yield* Ref.set(shouldStop, true)
          } else {
            yield* Effect.sleep(config.sleep)
          }
        }
      }
    })

    const worker: Worker = {
      start: () =>
        Effect.gen(function* () {
          yield* Ref.set(shouldStop, false)
          yield* Ref.set(isPaused, false)
          yield* Ref.update(state, (s) => ({ ...s, status: "running" as WorkerState }))
          yield* Effect.logInfo(`Starting worker with ${config.concurrency} concurrent processor(s) on queues: ${queues.join(", ")}`)

          const fibers: Fiber.RuntimeFiber<void, unknown>[] = []
          for (let i = 0; i < config.concurrency; i++) {
            const fiber = yield* Effect.forkDaemon(workerLoop)
            fibers.push(fiber)
          }
          yield* Ref.set(workerFibers, fibers as Fiber.RuntimeFiber<void, never>[])

          if (config.maxTime) {
            yield* pipe(Effect.sleep(config.maxTime), Effect.tap(() => worker.stop()), Effect.forkDaemon)
          }

          yield* pipe(
            Effect.all(fibers.map(Fiber.join)),
            Effect.catchAll(() => Effect.void)
          )
        }),

      stop: () =>
        Effect.gen(function* () {
          yield* Effect.logInfo("Stopping worker...")
          yield* Ref.set(shouldStop, true)
          yield* Ref.update(state, (s) => ({ ...s, status: "stopped" as WorkerState }))
        }),

      pause: () =>
        Effect.gen(function* () {
          yield* Effect.logInfo("Pausing worker...")
          yield* Ref.set(isPaused, true)
          yield* Ref.update(state, (s) => ({ ...s, status: "paused" as WorkerState }))
        }),

      resume: () =>
        Effect.gen(function* () {
          yield* Effect.logInfo("Resuming worker...")
          yield* Ref.set(isPaused, false)
          yield* Ref.update(state, (s) => ({ ...s, status: "running" as WorkerState }))
        }),

      status: () =>
        Effect.gen(function* () {
          const s = yield* Ref.get(state)
          return {
            state: s.status,
            processedCount: s.processedCount,
            failedCount: s.failedCount,
            currentJob: s.currentJob,
            startedAt,
            uptime: Duration.millis(Date.now() - startedAt.getTime()),
            queues,
          }
        }),
    }

    return worker
  })

export const WorkerLive = (config?: WorkerConfig) => Layer.effect(WorkerTag, makeWorker(config))
