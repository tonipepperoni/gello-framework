import * as S from "@effect/schema/Schema"

export type JobStatus =
  | "pending"
  | "reserved"
  | "processing"
  | "completed"
  | "failed"
  | "buried"

export const JobStatusSchema = S.Literal(
  "pending",
  "reserved",
  "processing",
  "completed",
  "failed",
  "buried"
).pipe(S.annotations({ identifier: "JobStatus" }))
