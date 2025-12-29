import { Brand } from "effect"
import * as S from "@effect/schema/Schema"

export type QueueName = Brand.Branded<string, "QueueName">

export const QueueName = Brand.nominal<QueueName>()

export const DEFAULT_QUEUE = QueueName("default")

export const QueueNameSchema = S.String.pipe(
  S.minLength(1),
  S.maxLength(255),
  S.brand("QueueName"),
  S.annotations({ identifier: "QueueName" })
)
