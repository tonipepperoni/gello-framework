import { Effect, Layer, pipe, Duration, Console } from "effect"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import {
  QueueLive,
  JobRegistryTag,
  makeJobRegistry,
  QueueName,
} from "@gello/queue-core"
import { MemoryDriverLive, MemoryFailedJobRepositoryLive } from "@gello/queue-drivers"
import { makeWorker, WorkerConfig, defaultWorkerConfig } from "@gello/queue-worker"
import { runCli } from "./cli/index.js"

/**
 * Queue Orchestrator - Worker Process
 *
 * This application runs queue workers that process jobs from configured queues.
 * It can be configured via environment variables or CLI arguments.
 */

// Configuration from environment
const getConfig = (): WorkerConfig => {
  const queue = process.env.QUEUE_NAME ?? "default"
  const concurrency = parseInt(process.env.QUEUE_CONCURRENCY ?? "1", 10)
  const sleep = parseInt(process.env.QUEUE_SLEEP ?? "3", 10)
  const tries = parseInt(process.env.QUEUE_TRIES ?? "3", 10)
  const timeout = parseInt(process.env.QUEUE_TIMEOUT ?? "60", 10)

  return {
    ...defaultWorkerConfig,
    queue: QueueName(queue),
    concurrency,
    sleep: Duration.seconds(sleep),
    tries,
    timeout: Duration.seconds(timeout),
  }
}

// Job Registry Layer - register your job handlers here
const JobRegistryLive = Layer.effect(
  JobRegistryTag,
  makeJobRegistry
)

// Main layer composition
const MainLayer = pipe(
  QueueLive,
  Layer.provideMerge(MemoryDriverLive),
  Layer.provideMerge(MemoryFailedJobRepositoryLive),
  Layer.provideMerge(JobRegistryLive)
)

// Main program
const main = Effect.gen(function* () {
  const args = process.argv.slice(2)

  if (args.length === 0 || args[0] === "work") {
    // Default: run worker
    yield* runWorker
  } else {
    // Run CLI
    yield* runCli(args)
  }
})

const runWorker = Effect.gen(function* () {
  const config = getConfig()

  yield* Console.log("╔════════════════════════════════════════╗")
  yield* Console.log("║     Gello Queue Orchestrator           ║")
  yield* Console.log("╚════════════════════════════════════════╝")
  yield* Console.log("")
  yield* Console.log(`Queue: ${config.queue}`)
  yield* Console.log(`Concurrency: ${config.concurrency}`)
  yield* Console.log(`Timeout: ${Duration.toSeconds(config.timeout ?? Duration.minutes(1))}s`)
  yield* Console.log("")
  yield* Console.log("Starting worker...")
  yield* Console.log("")

  const worker = yield* makeWorker(config)
  yield* worker.start()
})

// Run the application
pipe(
  main,
  Effect.provide(MainLayer),
  Effect.tapErrorCause(Effect.logError),
  NodeRuntime.runMain
)
