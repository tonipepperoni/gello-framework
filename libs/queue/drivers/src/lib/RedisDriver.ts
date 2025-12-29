import { Effect, Option, Duration, Layer } from "effect"
import {
  QueueDriver,
  QueueDriverTag,
  Job,
  QueueName,
  QueueConnectionError,
  serializeJob,
  deserializeJob,
} from "@gello/queue-core"

export interface RedisDriverConfig {
  readonly host: string
  readonly port: number
  readonly password?: string
  readonly db?: number
  readonly keyPrefix?: string
  readonly tls?: boolean
}

// Redis client interface (to be provided by user)
export interface RedisClient {
  lpush(key: string, value: string): Effect.Effect<number, QueueConnectionError>
  rpop(key: string): Effect.Effect<string | null, QueueConnectionError>
  brpop(key: string, timeout: number): Effect.Effect<[string, string] | null, QueueConnectionError>
  llen(key: string): Effect.Effect<number, QueueConnectionError>
  del(key: string): Effect.Effect<number, QueueConnectionError>
  zadd(key: string, score: number, member: string): Effect.Effect<number, QueueConnectionError>
  zrangebyscore(key: string, min: number, max: number): Effect.Effect<string[], QueueConnectionError>
  zrem(key: string, member: string): Effect.Effect<number, QueueConnectionError>
  keys(pattern: string): Effect.Effect<string[], QueueConnectionError>
  set(key: string, value: string, options?: { px?: number }): Effect.Effect<void, QueueConnectionError>
  get(key: string): Effect.Effect<string | null, QueueConnectionError>
  quit(): Effect.Effect<void, never>
}

export class RedisClientTag extends Effect.Tag("@gello/queue/RedisClient")<
  RedisClientTag,
  RedisClient
>() {}

/**
 * Redis queue driver using Redis lists and sorted sets
 * Production-ready with delayed job support
 */
export const makeRedisDriver = (config: RedisDriverConfig) =>
  Effect.gen(function* () {
    const redis = yield* RedisClientTag
    const prefix = config.keyPrefix ?? "gello:queue:"

    const queueKey = (name: QueueName) => `${prefix}${name}`
    const delayedKey = (name: QueueName) => `${prefix}${name}:delayed`
    const reservedKey = (name: QueueName) => `${prefix}${name}:reserved`

    // Migrate delayed jobs that are ready to be processed
    const migrateDelayedJobs = (queue: QueueName) =>
      Effect.gen(function* () {
        const now = Date.now()
        const ready = yield* redis.zrangebyscore(delayedKey(queue), 0, now)

        for (const jobJson of ready) {
          yield* redis.zrem(delayedKey(queue), jobJson)
          yield* redis.lpush(queueKey(queue), jobJson)
        }
      })

    const driver: QueueDriver = {
      push: (queue, job) =>
        Effect.gen(function* () {
          const serialized = serializeJob(job)
          yield* redis.lpush(queueKey(queue), serialized)
          return job.id
        }),

      later: (queue, job, delay) =>
        Effect.gen(function* () {
          const serialized = serializeJob(job)
          const availableAt = Date.now() + Duration.toMillis(delay)
          yield* redis.zadd(delayedKey(queue), availableAt, serialized)
          return job.id
        }),

      pop: (queue, timeout) =>
        Effect.gen(function* () {
          // First migrate any delayed jobs that are ready
          yield* migrateDelayedJobs(queue)

          const result = timeout
            ? yield* redis.brpop(queueKey(queue), Math.ceil(Duration.toSeconds(timeout)))
            : yield* redis.rpop(queueKey(queue))

          if (!result) {
            return Option.none()
          }

          const jobJson = Array.isArray(result) ? result[1] : result
          const job = deserializeJob(jobJson) as Job

          // Update job with attempt info
          const updatedJob: Job = {
            ...job,
            attempts: job.attempts + 1,
            reservedAt: new Date(),
          }

          // Move to reserved set with expiration based on timeout
          const reservedUntil = Date.now() + Duration.toMillis(job.timeout)
          yield* redis.zadd(reservedKey(queue), reservedUntil, serializeJob(updatedJob))

          return Option.some(updatedJob)
        }),

      popMany: (queue, count) =>
        Effect.gen(function* () {
          yield* migrateDelayedJobs(queue)

          const jobs: Job[] = []
          for (let i = 0; i < count; i++) {
            const result = yield* redis.rpop(queueKey(queue))
            if (!result) break

            const job = deserializeJob(result) as Job
            const updatedJob: Job = {
              ...job,
              attempts: job.attempts + 1,
              reservedAt: new Date(),
            }

            const reservedUntil = Date.now() + Duration.toMillis(job.timeout)
            yield* redis.zadd(reservedKey(queue), reservedUntil, serializeJob(updatedJob))
            jobs.push(updatedJob)
          }

          return jobs
        }),

      complete: (job) =>
        Effect.gen(function* () {
          yield* redis.zrem(reservedKey(job.queue), serializeJob(job))
        }),

      release: (job, delay) =>
        Effect.gen(function* () {
          yield* redis.zrem(reservedKey(job.queue), serializeJob(job))

          if (delay && Duration.toMillis(delay) > 0) {
            yield* driver.later(job.queue, job, delay)
          } else {
            yield* driver.push(job.queue, job)
          }
        }),

      delete: (job) =>
        Effect.gen(function* () {
          yield* redis.zrem(reservedKey(job.queue), serializeJob(job))
          yield* redis.zrem(delayedKey(job.queue), serializeJob(job))
        }),

      size: (queue) =>
        Effect.gen(function* () {
          yield* migrateDelayedJobs(queue)
          return yield* redis.llen(queueKey(queue))
        }),

      clear: (queue) =>
        Effect.gen(function* () {
          yield* redis.del(queueKey(queue))
          yield* redis.del(delayedKey(queue))
          yield* redis.del(reservedKey(queue))
        }),

      queues: () =>
        Effect.gen(function* () {
          const keys = yield* redis.keys(`${prefix}*`)
          const queueNames = new Set<QueueName>()

          for (const key of keys) {
            // Extract queue name from key
            const withoutPrefix = key.replace(prefix, "")
            const queueName = withoutPrefix.split(":")[0]
            if (queueName) {
              queueNames.add(queueName as QueueName)
            }
          }

          return Array.from(queueNames)
        }),
    }

    return driver
  })

export const RedisDriverLive = (config: RedisDriverConfig) =>
  Layer.effect(QueueDriverTag, makeRedisDriver(config))
