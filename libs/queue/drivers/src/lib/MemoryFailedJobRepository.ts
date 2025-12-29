import { Effect, Option, Duration, Ref, Layer, HashMap } from "effect"
import {
  FailedJobRepository,
  FailedJobRepositoryTag,
  FailedJob,
  JobId,
  QueueDriverTag,
  createJob,
} from "@gello/queue-core"

/**
 * In-memory failed job repository for development and testing
 */
export const makeMemoryFailedJobRepository = Effect.gen(function* () {
  const jobs = yield* Ref.make<HashMap.HashMap<JobId, FailedJob>>(HashMap.empty())
  const driver = yield* QueueDriverTag

  const repository: FailedJobRepository = {
    store: (job) =>
      Ref.update(jobs, (map) => HashMap.set(map, job.id, job)),

    all: () =>
      Effect.gen(function* () {
        const map = yield* Ref.get(jobs)
        return Array.from(HashMap.values(map))
      }),

    find: (id) =>
      Effect.gen(function* () {
        const map = yield* Ref.get(jobs)
        return HashMap.get(map, id)
      }),

    retry: (id) =>
      Effect.gen(function* () {
        const map = yield* Ref.get(jobs)
        const job = HashMap.get(map, id)

        if (Option.isSome(job)) {
          const failedJob = job.value

          // Create new job from failed job
          const newJob = createJob({
            name: failedJob.name,
            payload: failedJob.payload,
            queue: failedJob.queue,
          })

          yield* driver.push(failedJob.queue, newJob)
          yield* Ref.update(jobs, (m) => HashMap.remove(m, id))
        }
      }),

    retryAll: () =>
      Effect.gen(function* () {
        const map = yield* Ref.get(jobs)
        let count = 0

        for (const failedJob of HashMap.values(map)) {
          const newJob = createJob({
            name: failedJob.name,
            payload: failedJob.payload,
            queue: failedJob.queue,
          })

          yield* driver.push(failedJob.queue, newJob)
          count++
        }

        yield* Ref.set(jobs, HashMap.empty())
        return count
      }),

    delete: (id) =>
      Ref.update(jobs, (map) => HashMap.remove(map, id)),

    prune: (olderThan) =>
      Effect.gen(function* () {
        const map = yield* Ref.get(jobs)
        const cutoff = new Date(Date.now() - Duration.toMillis(olderThan))
        let removed = 0

        const toRemove: JobId[] = []
        for (const job of HashMap.values(map)) {
          if (job.failedAt < cutoff) {
            toRemove.push(job.id)
            removed++
          }
        }

        yield* Ref.update(jobs, (m) => {
          let result = m
          for (const id of toRemove) {
            result = HashMap.remove(result, id)
          }
          return result
        })

        return removed
      }),

    count: () =>
      Effect.gen(function* () {
        const map = yield* Ref.get(jobs)
        return HashMap.size(map)
      }),
  }

  return repository
})

export const MemoryFailedJobRepositoryLive = Layer.effect(
  FailedJobRepositoryTag,
  makeMemoryFailedJobRepository
)
