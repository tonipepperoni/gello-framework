import { Effect, Queue, Option, Duration, Ref, Layer, Fiber, HashMap, pipe } from "effect"
import {
  QueueDriver,
  QueueDriverTag,
  Job,
  JobId,
  QueueName,
} from "@gello/queue-core"

interface DelayedJob {
  readonly job: Job
  readonly fiber: Fiber.RuntimeFiber<JobId, unknown>
}

interface QueueState {
  readonly queues: HashMap.HashMap<QueueName, Queue.Queue<Job>>
  readonly delayed: HashMap.HashMap<JobId, DelayedJob>
  readonly reserved: HashMap.HashMap<JobId, Job>
}

/**
 * In-memory queue driver using Effect.Queue
 * Perfect for development and testing
 */
export const makeMemoryDriver = Effect.gen(function* () {
  const state = yield* Ref.make<QueueState>({
    queues: HashMap.empty(),
    delayed: HashMap.empty(),
    reserved: HashMap.empty(),
  })

  const getOrCreateQueue = (name: QueueName): Effect.Effect<Queue.Queue<Job>> =>
    Effect.gen(function* () {
      const current = yield* Ref.get(state)
      const existing = HashMap.get(current.queues, name)

      if (Option.isSome(existing)) {
        return existing.value
      }

      const newQueue = yield* Queue.unbounded<Job>()
      yield* Ref.update(state, (s) => ({
        ...s,
        queues: HashMap.set(s.queues, name, newQueue),
      }))
      return newQueue
    })

  const driver: QueueDriver = {
    push: (queueName, job) =>
      Effect.gen(function* () {
        const queue = yield* getOrCreateQueue(queueName)
        yield* Queue.offer(queue, job)
        return job.id
      }),

    later: (queueName, job, delay) =>
      Effect.gen(function* () {
        const fiber = yield* pipe(
          Effect.sleep(delay),
          Effect.flatMap(() => driver.push(queueName, job)),
          Effect.forkDaemon
        )

        yield* Ref.update(state, (s) => ({
          ...s,
          delayed: HashMap.set(s.delayed, job.id, { job, fiber }),
        }))

        return job.id
      }),

    pop: (queueName, timeout) =>
      Effect.gen(function* () {
        const queue = yield* getOrCreateQueue(queueName)

        const reserveJob = (j: Job): Effect.Effect<Job> =>
          Effect.gen(function* () {
            const job: Job = {
              ...j,
              attempts: j.attempts + 1,
              reservedAt: new Date(),
            }
            yield* Ref.update(state, (s) => ({
              ...s,
              reserved: HashMap.set(s.reserved, job.id, job),
            }))
            return job
          })

        if (timeout) {
          const maybeJob = yield* pipe(
            Queue.take(queue),
            Effect.map(Option.some<Job>),
            Effect.timeoutTo({
              duration: timeout,
              onTimeout: () => Option.none<Job>(),
              onSuccess: (opt) => opt,
            })
          )

          if (Option.isSome(maybeJob)) {
            const job = yield* reserveJob(maybeJob.value)
            return Option.some(job)
          }
          return Option.none()
        }

        const maybeJob = yield* Queue.poll(queue)
        if (Option.isSome(maybeJob)) {
          const job = yield* reserveJob(maybeJob.value)
          return Option.some(job)
        }
        return Option.none()
      }),

    popMany: (queueName, count) =>
      Effect.gen(function* () {
        const queue = yield* getOrCreateQueue(queueName)
        const jobs: Job[] = []

        for (let i = 0; i < count; i++) {
          const maybeJob = yield* Queue.poll(queue)
          if (Option.isSome(maybeJob)) {
            const job = {
              ...maybeJob.value,
              attempts: maybeJob.value.attempts + 1,
              reservedAt: new Date(),
            }
            jobs.push(job)
            yield* Ref.update(state, (s) => ({
              ...s,
              reserved: HashMap.set(s.reserved, job.id, job),
            }))
          } else {
            break
          }
        }

        return jobs
      }),

    complete: (job) =>
      Ref.update(state, (s) => ({
        ...s,
        reserved: HashMap.remove(s.reserved, job.id),
      })),

    release: (job, delay) =>
      Effect.gen(function* () {
        yield* Ref.update(state, (s) => ({
          ...s,
          reserved: HashMap.remove(s.reserved, job.id),
        }))

        if (delay && Duration.toMillis(delay) > 0) {
          yield* driver.later(job.queue, job, delay)
        } else {
          yield* driver.push(job.queue, job)
        }
      }),

    delete: (job) =>
      Effect.gen(function* () {
        const current = yield* Ref.get(state)
        const delayed = HashMap.get(current.delayed, job.id)

        if (Option.isSome(delayed)) {
          yield* Fiber.interrupt(delayed.value.fiber)
        }

        yield* Ref.update(state, (s) => ({
          ...s,
          reserved: HashMap.remove(s.reserved, job.id),
          delayed: HashMap.remove(s.delayed, job.id),
        }))
      }),

    size: (queueName) =>
      Effect.gen(function* () {
        const current = yield* Ref.get(state)
        const queue = HashMap.get(current.queues, queueName)

        if (Option.isNone(queue)) {
          return 0
        }

        return yield* Queue.size(queue.value)
      }),

    clear: (queueName) =>
      Effect.gen(function* () {
        const current = yield* Ref.get(state)
        const queue = HashMap.get(current.queues, queueName)

        if (Option.isSome(queue)) {
          // Drain the queue
          let item = yield* Queue.poll(queue.value)
          while (Option.isSome(item)) {
            item = yield* Queue.poll(queue.value)
          }
        }
      }),

    queues: () =>
      Effect.gen(function* () {
        const current = yield* Ref.get(state)
        return Array.from(HashMap.keys(current.queues))
      }),
  }

  return driver
})

export const MemoryDriverLive = Layer.effect(QueueDriverTag, makeMemoryDriver)
