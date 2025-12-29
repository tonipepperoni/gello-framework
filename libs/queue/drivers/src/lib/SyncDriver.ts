import { Effect, Option, Layer } from "effect"
import {
  QueueDriver,
  QueueDriverTag,
  JobRegistryTag,
} from "@gello/queue-core"

/**
 * Synchronous queue driver that executes jobs immediately
 * Useful for testing and local development
 */
export const makeSyncDriver = Effect.gen(function* () {
  const registry = yield* JobRegistryTag

  const driver: QueueDriver = {
    push: (_queue, job) =>
      Effect.gen(function* () {
        // Execute immediately
        yield* registry.dispatch(job).pipe(
          Effect.catchAll((error) =>
            Effect.logError(`Sync job failed: ${job.name}`, error)
          )
        )
        return job.id
      }),

    later: (queue, job, delay) =>
      Effect.gen(function* () {
        // Wait for delay then execute
        yield* Effect.sleep(delay)
        yield* registry.dispatch(job).pipe(
          Effect.catchAll((error) =>
            Effect.logError(`Sync job failed: ${job.name}`, error)
          )
        )
        return job.id
      }),

    // Sync driver doesn't queue jobs, so pop returns nothing
    pop: () => Effect.succeed(Option.none()),

    popMany: () => Effect.succeed([]),

    complete: () => Effect.void,

    release: () => Effect.void,

    delete: () => Effect.void,

    size: () => Effect.succeed(0),

    clear: () => Effect.void,

    queues: () => Effect.succeed([]),
  }

  return driver
})

export const SyncDriverLive = Layer.effect(QueueDriverTag, makeSyncDriver)
