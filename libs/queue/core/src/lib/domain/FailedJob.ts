import * as S from "@effect/schema/Schema"
import { JobId, JobIdSchema } from "./JobId.js"
import { QueueName, QueueNameSchema } from "./QueueName.js"

export interface FailedJob {
  readonly id: JobId
  readonly queue: QueueName
  readonly name: string
  readonly payload: unknown
  readonly exception: string
  readonly failedAt: Date
}

export const FailedJobSchema = S.Struct({
  id: JobIdSchema,
  queue: QueueNameSchema,
  name: S.String,
  payload: S.Unknown,
  exception: S.String,
  failedAt: S.Date,
})

export const createFailedJob = (
  id: JobId,
  queue: QueueName,
  name: string,
  payload: unknown,
  exception: string
): FailedJob => ({
  id,
  queue,
  name,
  payload,
  exception,
  failedAt: new Date(),
})

export const serializeFailedJob = (job: FailedJob): string =>
  JSON.stringify({
    ...job,
    failedAt: job.failedAt.toISOString(),
  })

export const deserializeFailedJob = (json: string): FailedJob => {
  const data = JSON.parse(json)
  return {
    ...data,
    failedAt: new Date(data.failedAt),
  }
}
