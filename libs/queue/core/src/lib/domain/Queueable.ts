import { Effect, Duration, Schedule } from "effect"
import * as S from "@effect/schema/Schema"
import { QueueName } from "./QueueName.js"
import { JobPriority } from "./JobPriority.js"

/**
 * Base interface for queueable jobs (Laravel-style)
 */
export interface Queueable<T, E = never, R = never> {
  readonly name: string
  readonly queue?: QueueName
  readonly priority?: JobPriority
  readonly maxAttempts?: number
  readonly timeout?: Duration.Duration
  readonly retryAfter?: Duration.Duration
  readonly backoff?: Schedule.Schedule<unknown, unknown>

  /**
   * The job handler - executed when the job is processed
   */
  handle(payload: T): Effect.Effect<void, E, R>

  /**
   * Optional hook called before handle
   */
  beforeHandle?(payload: T): Effect.Effect<void, E, R>

  /**
   * Optional hook called after successful handle
   */
  afterHandle?(payload: T): Effect.Effect<void, E, R>

  /**
   * Optional hook called when job fails permanently
   */
  onFailure?(payload: T, error: E): Effect.Effect<void, never, R>
}

/**
 * Schema-validated job with type-safe payload
 */
export interface SchemaJob<T, E = never, R = never> extends Queueable<T, E, R> {
  readonly schema: S.Schema<T>
}

/**
 * Helper to define a job with type inference
 */
export const defineJob = <T, E = never, R = never>(
  job: Queueable<T, E, R>
): Queueable<T, E, R> => job

/**
 * Helper to define a schema-validated job
 */
export const defineSchemaJob = <T, E = never, R = never>(
  job: SchemaJob<T, E, R>
): SchemaJob<T, E, R> => job
