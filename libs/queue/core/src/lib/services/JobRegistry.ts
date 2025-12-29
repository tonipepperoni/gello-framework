import { Context, Effect, Ref } from "effect"
import { Queueable } from "../domain/Queueable.js"
import { Job } from "../domain/Job.js"
import { JobHandlerNotFoundError, JobExecutionError } from "../errors/QueueError.js"

/**
 * Registry for job handlers
 */
export interface JobRegistry {
  /**
   * Register a job handler
   */
  register<T, E, R>(job: Queueable<T, E, R>): Effect.Effect<void, never>

  /**
   * Get handler for a job name
   */
  getHandler(name: string): Effect.Effect<Queueable<unknown>, JobHandlerNotFoundError>

  /**
   * Check if a handler is registered
   */
  hasHandler(name: string): Effect.Effect<boolean, never>

  /**
   * Dispatch a job to its handler
   */
  dispatch(job: Job): Effect.Effect<void, JobHandlerNotFoundError | JobExecutionError>

  /**
   * List all registered job names
   */
  list(): Effect.Effect<ReadonlyArray<string>, never>
}

export class JobRegistryTag extends Context.Tag("@gello/queue/JobRegistry")<
  JobRegistryTag,
  JobRegistry
>() {}

/**
 * Create a live JobRegistry implementation
 */
export const makeJobRegistry = Effect.gen(function* () {
  const handlers = yield* Ref.make<Map<string, Queueable<unknown>>>(new Map())

  const registry: JobRegistry = {
    register: (job) =>
      Ref.update(handlers, (map) => {
        const newMap = new Map(map)
        newMap.set(job.name, job as Queueable<unknown>)
        return newMap
      }),

    getHandler: (name) =>
      Effect.gen(function* () {
        const map = yield* Ref.get(handlers)
        const handler = map.get(name)
        if (!handler) {
          return yield* Effect.fail(new JobHandlerNotFoundError({ name }))
        }
        return handler
      }),

    hasHandler: (name) =>
      Effect.gen(function* () {
        const map = yield* Ref.get(handlers)
        return map.has(name)
      }),

    dispatch: (job) =>
      Effect.gen(function* () {
        const handler = yield* registry.getHandler(job.name)

        yield* Effect.try({
          try: () => {
            // Call beforeHandle if defined
            if (handler.beforeHandle) {
              return handler.beforeHandle(job.payload)
            }
            return Effect.void
          },
          catch: (error) =>
            new JobExecutionError({
              jobId: job.id,
              name: job.name,
              message: "beforeHandle failed",
              cause: error,
            }),
        }).pipe(Effect.flatten)

        yield* Effect.try({
          try: () => handler.handle(job.payload),
          catch: (error) =>
            new JobExecutionError({
              jobId: job.id,
              name: job.name,
              message: "handle failed",
              cause: error,
            }),
        }).pipe(Effect.flatten)

        yield* Effect.try({
          try: () => {
            if (handler.afterHandle) {
              return handler.afterHandle(job.payload)
            }
            return Effect.void
          },
          catch: (error) =>
            new JobExecutionError({
              jobId: job.id,
              name: job.name,
              message: "afterHandle failed",
              cause: error,
            }),
        }).pipe(Effect.flatten)
      }),

    list: () =>
      Effect.gen(function* () {
        const map = yield* Ref.get(handlers)
        return Array.from(map.keys())
      }),
  }

  return registry
})

export const JobRegistryLive = Effect.gen(function* () {
  return yield* makeJobRegistry
}).pipe(Effect.map((registry) => Context.make(JobRegistryTag, registry)))
