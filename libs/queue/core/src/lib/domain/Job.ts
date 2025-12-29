import { Duration } from "effect"
import * as S from "@effect/schema/Schema"
import { JobId, JobIdSchema, makeJobId } from "./JobId.js"
import { QueueName, QueueNameSchema, DEFAULT_QUEUE } from "./QueueName.js"
import { JobPriority, JobPrioritySchema, DEFAULT_PRIORITY } from "./JobPriority.js"

export interface Job<T = unknown> {
  readonly id: JobId
  readonly queue: QueueName
  readonly name: string
  readonly payload: T
  readonly priority: JobPriority
  readonly attempts: number
  readonly maxAttempts: number
  readonly timeout: Duration.Duration
  readonly retryAfter: Duration.Duration
  readonly availableAt: Date
  readonly createdAt: Date
  readonly reservedAt?: Date
}

export const JobSchema = <T>(payloadSchema: S.Schema<T>) =>
  S.Struct({
    id: JobIdSchema,
    queue: QueueNameSchema,
    name: S.String.pipe(S.minLength(1)),
    payload: payloadSchema,
    priority: JobPrioritySchema,
    attempts: S.Number.pipe(S.int(), S.nonNegative()),
    maxAttempts: S.Number.pipe(S.int(), S.positive()),
    timeout: S.Number, // Duration in millis for serialization
    retryAfter: S.Number, // Duration in millis for serialization
    availableAt: S.Date,
    createdAt: S.Date,
    reservedAt: S.optional(S.Date),
  })

export interface CreateJobOptions<T> {
  readonly name: string
  readonly payload: T
  readonly queue?: QueueName
  readonly priority?: JobPriority
  readonly maxAttempts?: number
  readonly timeout?: Duration.Duration
  readonly retryAfter?: Duration.Duration
  readonly delay?: Duration.Duration
}

export const createJob = <T>(options: CreateJobOptions<T>): Job<T> => {
  const now = new Date()
  const delay = options.delay ?? Duration.zero
  const availableAt = new Date(now.getTime() + Duration.toMillis(delay))

  return {
    id: makeJobId(),
    queue: options.queue ?? DEFAULT_QUEUE,
    name: options.name,
    payload: options.payload,
    priority: options.priority ?? DEFAULT_PRIORITY,
    attempts: 0,
    maxAttempts: options.maxAttempts ?? 3,
    timeout: options.timeout ?? Duration.minutes(1),
    retryAfter: options.retryAfter ?? Duration.seconds(60),
    availableAt,
    createdAt: now,
  }
}

export const serializeJob = <T>(job: Job<T>): string =>
  JSON.stringify({
    ...job,
    timeout: Duration.toMillis(job.timeout),
    retryAfter: Duration.toMillis(job.retryAfter),
    availableAt: job.availableAt.toISOString(),
    createdAt: job.createdAt.toISOString(),
    reservedAt: job.reservedAt?.toISOString(),
  })

export const deserializeJob = <T>(json: string): Job<T> => {
  const data = JSON.parse(json)
  return {
    ...data,
    timeout: Duration.millis(data.timeout),
    retryAfter: Duration.millis(data.retryAfter),
    availableAt: new Date(data.availableAt),
    createdAt: new Date(data.createdAt),
    reservedAt: data.reservedAt ? new Date(data.reservedAt) : undefined,
  }
}
