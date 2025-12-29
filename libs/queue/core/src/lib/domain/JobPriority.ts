import * as S from "@effect/schema/Schema"

export type JobPriority = 0 | 1 | 2 | 3 | 4 | 5

export const JobPrioritySchema = S.Literal(0, 1, 2, 3, 4, 5).pipe(
  S.annotations({ identifier: "JobPriority" })
)

export const DEFAULT_PRIORITY: JobPriority = 0
export const LOW_PRIORITY: JobPriority = 1
export const NORMAL_PRIORITY: JobPriority = 2
export const HIGH_PRIORITY: JobPriority = 3
export const URGENT_PRIORITY: JobPriority = 4
export const CRITICAL_PRIORITY: JobPriority = 5
