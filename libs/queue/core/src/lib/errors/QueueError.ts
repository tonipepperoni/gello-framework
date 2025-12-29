import { Data } from "effect"
import { JobId } from "../domain/JobId.js"
import { QueueName } from "../domain/QueueName.js"

export class QueueError extends Data.TaggedError("QueueError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class QueueConnectionError extends Data.TaggedError("QueueConnectionError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class JobNotFoundError extends Data.TaggedError("JobNotFoundError")<{
  readonly jobId: JobId
}> {
  override get message() {
    return `Job not found: ${this.jobId}`
  }
}

export class JobHandlerNotFoundError extends Data.TaggedError("JobHandlerNotFoundError")<{
  readonly name: string
}> {
  override get message() {
    return `No handler registered for job: ${this.name}`
  }
}

export class JobExecutionError extends Data.TaggedError("JobExecutionError")<{
  readonly jobId: JobId
  readonly name: string
  readonly message: string
  readonly cause?: unknown
}> {}

export class JobTimeoutError extends Data.TaggedError("JobTimeoutError")<{
  readonly jobId: JobId
  readonly name: string
  readonly timeout: number
}> {
  override get message() {
    return `Job ${this.name} (${this.jobId}) timed out after ${this.timeout}ms`
  }
}

export class QueueNotFoundError extends Data.TaggedError("QueueNotFoundError")<{
  readonly queue: QueueName
}> {
  override get message() {
    return `Queue not found: ${this.queue}`
  }
}

export class JobValidationError extends Data.TaggedError("JobValidationError")<{
  readonly name: string
  readonly message: string
  readonly errors: ReadonlyArray<string>
}> {}

export type AnyQueueError =
  | QueueError
  | QueueConnectionError
  | JobNotFoundError
  | JobHandlerNotFoundError
  | JobExecutionError
  | JobTimeoutError
  | QueueNotFoundError
  | JobValidationError
