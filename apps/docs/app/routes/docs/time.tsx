import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock, Callout, type TOCItem } from '../../components';
import { getPageNavigation } from '../../lib/source';

export const Route = createFileRoute('/docs/time')({
  component: TimePage,
});

const toc: TOCItem[] = [
  { title: 'Overview', url: '#overview', depth: 2 },
  { title: 'Installation', url: '#installation', depth: 2 },
  { title: 'Duration', url: '#duration', depth: 2 },
  { title: 'Creating Durations', url: '#creating-durations', depth: 3 },
  { title: 'Special Values', url: '#special-values', depth: 3 },
  { title: 'Converting Durations', url: '#converting-durations', depth: 3 },
  { title: 'Common Presets', url: '#common-presets', depth: 3 },
  { title: 'DateTime (Effect-based)', url: '#datetime-effect-based', depth: 2 },
  { title: 'Current Time', url: '#current-time', depth: 3 },
  { title: 'Expiration Calculation', url: '#expiration-calculation', depth: 3 },
  { title: 'Testing with TestClock', url: '#testing-with-testclock', depth: 2 },
  { title: 'Usage in Gello', url: '#usage-in-gello', depth: 2 },
  { title: 'API Reference', url: '#api-reference', depth: 2 },
];

function TimePage() {
  const footer = getPageNavigation('/docs/time');

  return (
    <DocsContent
      title="Time Utilities"
      description="Type-safe duration and datetime utilities built on Effect — testable time operations for cache TTLs, queue delays, and scheduling"
      toc={toc}
      footer={footer}
    >
      <h2 id="overview">Overview</h2>
      <p>
        The <code>@gello/time</code> library provides time utilities used throughout Gello. It wraps
        Effect's Duration and DateTime modules with convenient factories and expiration helpers.
        All time-dependent operations are Effects, making them testable with Effect's TestClock.
      </p>

      <h2 id="installation">Installation</h2>
      <CodeBlock code={`import {
  // Duration factories
  seconds, minutes, hours, days, weeks,
  // Special values
  forever, zero,
  // Duration utilities
  toMillis, toSeconds, isFinite, isForever,
  // DateTime operations (Effect-based)
  now, expiresAt, isExpired, remainingTtl,
  // Common presets
  Durations,
} from "@gello/time"`} />

      <h2 id="duration">Duration</h2>
      <p>
        Durations represent time spans. Create them with factory functions that wrap Effect's Duration:
      </p>

      <h3 id="creating-durations">Creating Durations</h3>
      <CodeBlock code={`import { seconds, minutes, hours, days, weeks, millis } from "@gello/time"

// Basic factories
const fiveSeconds = seconds(5)
const tenMinutes = minutes(10)
const oneHour = hours(1)
const threeDays = days(3)
const twoWeeks = weeks(2)
const fiveHundredMs = millis(500)

// Combine with Effect's Duration arithmetic
import { Duration } from "effect"
const combined = Duration.sum(minutes(5), seconds(30)) // 5:30`} />

      <h3 id="special-values">Special Values</h3>
      <CodeBlock code={`import { forever, zero, isForever, isFinite } from "@gello/time"

// Forever = infinite duration (no expiration)
const noExpiry = forever
isForever(noExpiry)  // true
isFinite(noExpiry)   // false

// Zero = immediate
const immediate = zero
isForever(immediate) // false
isFinite(immediate)  // true`} />

      <h3 id="converting-durations">Converting Durations</h3>
      <CodeBlock code={`import { toMillis, toSeconds, toMinutes, toHours, forever } from "@gello/time"

const duration = minutes(5)

toMillis(duration)   // 300000
toSeconds(duration)  // 300
toMinutes(duration)  // 5
toHours(duration)    // 0.0833...

// Returns null for infinite durations
toMillis(forever)    // null`} />

      <h3 id="common-presets">Common Presets</h3>
      <CodeBlock code={`import { Durations, toMillis } from "@gello/time"

Durations.hundredMillis   // 100ms
Durations.halfSecond      // 500ms
Durations.oneSecond       // 1s
Durations.fiveSeconds     // 5s
Durations.tenSeconds      // 10s
Durations.thirtySeconds   // 30s
Durations.oneMinute       // 1m
Durations.fiveMinutes     // 5m
Durations.fifteenMinutes  // 15m
Durations.thirtyMinutes   // 30m
Durations.oneHour         // 1h
Durations.sixHours        // 6h
Durations.twelveHours     // 12h
Durations.oneDay          // 24h
Durations.oneWeek         // 7d
Durations.forever         // infinite
Durations.zero            // 0

// Example usage
cache.put("session", data, Durations.thirtyMinutes)`} />

      <h2 id="datetime-effect-based">DateTime (Effect-based)</h2>
      <p>
        DateTime operations are Effects, making them testable with TestClock. Use these for
        cache expiration, scheduling, and any time-sensitive logic.
      </p>

      <h3 id="current-time">Current Time</h3>
      <CodeBlock code={`import { now, unsafeNow } from "@gello/time"
import { Effect } from "effect"

// Effect-based (testable)
const program = Effect.gen(function* () {
  const currentTime = yield* now
  console.log(currentTime)  // DateTime.Utc
})

// Synchronous (not testable, use sparingly)
const instant = unsafeNow()  // DateTime.Utc`} />

      <h3 id="expiration-calculation">Expiration Calculation</h3>
      <CodeBlock code={`import { expiresAt, isExpired, remainingTtl } from "@gello/time"
import { minutes, forever } from "@gello/time"
import { Effect, Option } from "effect"

const program = Effect.gen(function* () {
  // Calculate when something expires
  const expiration = yield* expiresAt(minutes(30))
  // Option<DateTime.Utc> - None for forever

  if (Option.isSome(expiration)) {
    // Check if expired
    const expired = yield* isExpired(expiration.value)
    // boolean

    // Get remaining time
    const remaining = yield* remainingTtl(expiration.value)
    // Duration (zero if expired)
  }

  // Forever returns None
  const noExpiry = yield* expiresAt(forever)
  Option.isNone(noExpiry)  // true
})`} />

      <h2 id="testing-with-testclock">Testing with TestClock</h2>
      <Callout type="info">
        Because time operations are Effects, you can use Effect's TestClock to control time in tests.
      </Callout>

      <CodeBlock code={`import { expiresAt, isExpired } from "@gello/time"
import { minutes } from "@gello/time"
import { Effect, TestClock, TestContext, Option } from "effect"

const testExpiration = Effect.gen(function* () {
  // Calculate expiration 5 minutes from now
  const expiration = yield* expiresAt(minutes(5))
  expect(Option.isSome(expiration)).toBe(true)

  // Not expired yet
  const expired1 = yield* isExpired(Option.getOrThrow(expiration))
  expect(expired1).toBe(false)

  // Advance time by 6 minutes
  yield* TestClock.adjust(minutes(6))

  // Now it's expired
  const expired2 = yield* isExpired(Option.getOrThrow(expiration))
  expect(expired2).toBe(true)
}).pipe(
  Effect.provide(TestContext.TestContext)
)

await Effect.runPromise(testExpiration)`} />

      <h2 id="usage-in-gello">Usage in Gello</h2>

      <h3 id="cache-ttls">Cache TTLs</h3>
      <CodeBlock code={`import { Cache } from "@gello/cache"
import { minutes, hours, Durations, forever } from "@gello/time"

Effect.gen(function* () {
  const cache = yield* Cache

  // Use duration factories
  yield* cache.put("session", data, minutes(30))
  yield* cache.put("user", user, hours(1))

  // Use presets
  yield* cache.put("config", config, Durations.oneDay)
  yield* cache.put("static", content, forever)
})`} />

      <h3 id="queue-delays">Queue Delays</h3>
      <CodeBlock code={`import { Queue } from "@gello/queue"
import { seconds, minutes, scheduleIn } from "@gello/time"
import { Effect } from "effect"

Effect.gen(function* () {
  const queue = yield* Queue

  // Delay job execution
  yield* queue.push("emails", job, { delay: minutes(5) })

  // Schedule for specific time
  const runAt = yield* scheduleIn(hours(2))
  yield* queue.push("reports", job, { runAt })
})`} />

      <h3 id="middleware-timeouts">Middleware Timeouts</h3>
      <CodeBlock code={`import { seconds } from "@gello/time"
import { Effect } from "effect"

// Timeout middleware
const withTimeout = (duration: Duration) =>
  Effect.timeout(duration)

// Usage
const handler = myHandler.pipe(
  withTimeout(seconds(30))
)`} />

      <h2 id="api-reference">API Reference</h2>

      <h3 id="duration-factories">Duration Factories</h3>
      <table>
        <thead>
          <tr>
            <th>Function</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>millis(n)</code></td><td>Create duration in milliseconds</td></tr>
          <tr><td><code>seconds(n)</code></td><td>Create duration in seconds</td></tr>
          <tr><td><code>minutes(n)</code></td><td>Create duration in minutes</td></tr>
          <tr><td><code>hours(n)</code></td><td>Create duration in hours</td></tr>
          <tr><td><code>days(n)</code></td><td>Create duration in days</td></tr>
          <tr><td><code>weeks(n)</code></td><td>Create duration in weeks</td></tr>
          <tr><td><code>forever</code></td><td>Infinite duration (no expiration)</td></tr>
          <tr><td><code>zero</code></td><td>Zero duration (immediate)</td></tr>
        </tbody>
      </table>

      <h3 id="datetime-operations">DateTime Operations</h3>
      <table>
        <thead>
          <tr>
            <th>Function</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>now</code></td><td>Current UTC time as Effect</td></tr>
          <tr><td><code>expiresAt(ttl)</code></td><td>Calculate expiration from duration</td></tr>
          <tr><td><code>isExpired(dt)</code></td><td>Check if datetime has passed</td></tr>
          <tr><td><code>remainingTtl(dt)</code></td><td>Get remaining duration until datetime</td></tr>
          <tr><td><code>scheduleIn(d)</code></td><td>Calculate datetime d from now</td></tr>
        </tbody>
      </table>
    </DocsContent>
  );
}
