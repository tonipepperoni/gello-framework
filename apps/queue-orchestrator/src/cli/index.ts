import { Effect, Console } from "effect"
import {
  QueueDriverTag,
  FailedJobRepositoryTag,
  QueueName,
} from "@gello/queue-core"

/**
 * CLI for Queue Orchestrator
 *
 * Commands:
 *   work           Start processing jobs (default)
 *   status         Show queue status
 *   failed         List failed jobs
 *   retry <id>     Retry a specific failed job
 *   retry-all      Retry all failed jobs
 *   clear <queue>  Clear all jobs from a queue
 *   help           Show help message
 */

export const runCli = (args: string[]) =>
  Effect.gen(function* () {
    const command = args[0]

    switch (command) {
      case "status":
        yield* statusCommand
        break

      case "failed":
        yield* failedCommand
        break

      case "retry":
        if (args[1]) {
          yield* retryCommand(args[1])
        } else {
          yield* Console.error("Usage: retry <job-id>")
        }
        break

      case "retry-all":
        yield* retryAllCommand
        break

      case "clear":
        if (args[1]) {
          yield* clearCommand(args[1])
        } else {
          yield* Console.error("Usage: clear <queue-name>")
        }
        break

      case "help":
      case "--help":
      case "-h":
        yield* helpCommand
        break

      default:
        yield* Console.error(`Unknown command: ${command}`)
        yield* helpCommand
    }
  })

const statusCommand = Effect.gen(function* () {
  const driver = yield* QueueDriverTag
  const failedRepo = yield* FailedJobRepositoryTag

  yield* Console.log("")
  yield* Console.log("Queue Status")
  yield* Console.log("============")
  yield* Console.log("")

  const queues = yield* driver.queues()

  if (queues.length === 0) {
    yield* Console.log("No active queues")
  } else {
    for (const queue of queues) {
      const size = yield* driver.size(queue)
      yield* Console.log(`  ${queue}: ${size} jobs`)
    }
  }

  yield* Console.log("")

  const failedCount = yield* failedRepo.count()
  yield* Console.log(`Failed Jobs: ${failedCount}`)
  yield* Console.log("")
})

const failedCommand = Effect.gen(function* () {
  const failedRepo = yield* FailedJobRepositoryTag

  yield* Console.log("")
  yield* Console.log("Failed Jobs")
  yield* Console.log("===========")
  yield* Console.log("")

  const jobs = yield* failedRepo.all()

  if (jobs.length === 0) {
    yield* Console.log("No failed jobs")
  } else {
    for (const job of jobs) {
      yield* Console.log(`ID: ${job.id}`)
      yield* Console.log(`  Queue: ${job.queue}`)
      yield* Console.log(`  Name: ${job.name}`)
      yield* Console.log(`  Failed: ${job.failedAt.toISOString()}`)
      yield* Console.log(`  Error: ${job.exception.substring(0, 100)}...`)
      yield* Console.log("")
    }
  }
})

const retryCommand = (jobId: string) =>
  Effect.gen(function* () {
    const failedRepo = yield* FailedJobRepositoryTag

    yield* Console.log(`Retrying job ${jobId}...`)

    yield* failedRepo.retry(jobId as any)

    yield* Console.log(`Job ${jobId} has been queued for retry`)
  })

const retryAllCommand = Effect.gen(function* () {
  const failedRepo = yield* FailedJobRepositoryTag

  yield* Console.log("Retrying all failed jobs...")

  const count = yield* failedRepo.retryAll()

  yield* Console.log(`${count} jobs have been queued for retry`)
})

const clearCommand = (queueName: string) =>
  Effect.gen(function* () {
    const driver = yield* QueueDriverTag

    yield* Console.log(`Clearing queue ${queueName}...`)

    yield* driver.clear(QueueName(queueName))

    yield* Console.log(`Queue ${queueName} has been cleared`)
  })

const helpCommand = Effect.gen(function* () {
  yield* Console.log("")
  yield* Console.log("Gello Queue Orchestrator")
  yield* Console.log("========================")
  yield* Console.log("")
  yield* Console.log("Usage: queue-orchestrator <command> [options]")
  yield* Console.log("")
  yield* Console.log("Commands:")
  yield* Console.log("  work              Start processing jobs (default)")
  yield* Console.log("  status            Show queue status")
  yield* Console.log("  failed            List failed jobs")
  yield* Console.log("  retry <id>        Retry a specific failed job")
  yield* Console.log("  retry-all         Retry all failed jobs")
  yield* Console.log("  clear <queue>     Clear all jobs from a queue")
  yield* Console.log("  help              Show this help message")
  yield* Console.log("")
  yield* Console.log("Environment Variables:")
  yield* Console.log("  QUEUE_NAME        Queue to process (default: 'default')")
  yield* Console.log("  QUEUE_CONCURRENCY Number of concurrent workers (default: 1)")
  yield* Console.log("  QUEUE_SLEEP       Seconds to sleep when empty (default: 3)")
  yield* Console.log("  QUEUE_TRIES       Max job attempts (default: 3)")
  yield* Console.log("  QUEUE_TIMEOUT     Job timeout in seconds (default: 60)")
  yield* Console.log("")
  yield* Console.log("Examples:")
  yield* Console.log("  queue-orchestrator work")
  yield* Console.log("  QUEUE_NAME=emails QUEUE_CONCURRENCY=4 queue-orchestrator work")
  yield* Console.log("  queue-orchestrator status")
  yield* Console.log("  queue-orchestrator failed")
  yield* Console.log("  queue-orchestrator retry abc123")
  yield* Console.log("")
})
