import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock, Callout, type TOCItem } from '../../components';
import { getPageNavigation } from '../../lib/source';

export const Route = createFileRoute('/docs/caching')({
  component: CachingPage,
});

const toc: TOCItem[] = [
  { title: 'The Pattern', url: '#the-pattern', depth: 2 },
  { title: 'Quick Start', url: '#quick-start', depth: 2 },
  { title: 'Cache Operations', url: '#cache-operations', depth: 2 },
  { title: 'The Remember Pattern', url: '#the-remember-pattern', depth: 2 },
  { title: 'Cache Drivers', url: '#cache-drivers', depth: 2 },
  { title: 'Memory Store', url: '#memory-store', depth: 3 },
  { title: 'File Store', url: '#file-store', depth: 3 },
  { title: 'Redis Store', url: '#redis-store', depth: 3 },
  { title: 'Multi-Level Cache', url: '#multi-level-cache', depth: 3 },
  { title: 'Null Store', url: '#null-store', depth: 3 },
  { title: 'Configuration', url: '#configuration', depth: 2 },
  { title: 'Testing', url: '#testing', depth: 2 },
  { title: 'Cache in HTTP Routes', url: '#cache-in-http-routes', depth: 2 },
];

function CachingPage() {
  const footer = getPageNavigation('/docs/caching');

  return (
    <DocsContent
      title="Caching"
      description="Laravel-inspired caching with Effect — hexagonal architecture, multiple drivers, and type-safe operations"
      toc={toc}
      footer={footer}
    >
      <h2 id="the-pattern">The Pattern</h2>
      <p>
        Gello's cache system follows hexagonal architecture. The core defines ports (interfaces) while
        drivers implement adapters. Use <code>Context.Tag</code> for dependency injection and swap
        implementations via Layers. Built-in drivers include memory, file, Redis, database, and multi-level
        L1/L2 caching.
      </p>

      <h2 id="quick-start">Quick Start</h2>
      <CodeBlock code={`import { Effect } from "effect"
import { Cache, makeCacheLayer } from "@gello/cache"
import { makeMemoryStore } from "@gello/cache-drivers"
import { minutes } from "@gello/time"

// Create a cache layer
const CacheLive = makeCacheLayer(
  Effect.runSync(makeMemoryStore({ maxSize: 1000 }))
)

// Use the cache
const program = Effect.gen(function* () {
  const cache = yield* Cache

  // Store a value for 30 minutes
  yield* cache.put("user:1", { name: "John" }, minutes(30))

  // Retrieve it
  const user = yield* cache.get<{ name: string }>("user:1")
  // user: Option<{ name: string }>
})

Effect.runPromise(program.pipe(Effect.provide(CacheLive)))`} />

      <h2 id="cache-operations">Cache Operations</h2>
      <CodeBlock code={`import { hours, minutes } from "@gello/time"

Effect.gen(function* () {
  const cache = yield* Cache

  // Basic get/put
  yield* cache.put("key", value)
  yield* cache.put("key", value, hours(1))  // with TTL
  const result = yield* cache.get<T>("key") // Option<T>

  // Check existence
  const exists = yield* cache.has("key")

  // Remove
  yield* cache.forget("key")
  yield* cache.flush()                      // clear all

  // Atomic increment/decrement
  const newCount = yield* cache.increment("counter", 1)
  yield* cache.decrement("counter", 5)

  // Bulk operations
  const values = yield* cache.many(["key1", "key2", "key3"])
  yield* cache.putMany(new Map([["a", 1], ["b", 2]]), minutes(5))
})`} />

      <h2 id="the-remember-pattern">The Remember Pattern</h2>
      <Callout type="info">
        The most powerful caching pattern — fetch from cache or compute and store.
        Perfect for expensive operations like database queries or API calls.
      </Callout>

      <CodeBlock code={`import { Cache } from "@gello/cache"
import { minutes } from "@gello/time"
import { Effect } from "effect"

// Cache-aside pattern: get from cache or compute
const getUser = (id: string) =>
  Effect.gen(function* () {
    const cache = yield* Cache

    return yield* cache.remember(
      \`user:\${id}\`,
      minutes(30),
      // Only runs if cache miss
      Effect.gen(function* () {
        const db = yield* Database
        return yield* db.users.findById(id)
      })
    )
  })

// Remember forever (until manually cleared)
const getSettings = () =>
  Effect.gen(function* () {
    const cache = yield* Cache
    return yield* cache.rememberForever("app:settings", loadSettings)
  })`} />

      <h2 id="cache-drivers">Cache Drivers</h2>

      <h3 id="memory-store">Memory Store</h3>
      <p>Fast in-process cache with optional LRU eviction. Great for development and single-instance deployments.</p>
      <CodeBlock code={`import { makeMemoryStore, MemoryStoreLive } from "@gello/cache-drivers"

// Direct creation
const store = Effect.runSync(makeMemoryStore({
  maxSize: 1000,         // LRU eviction after 1000 entries
  prefix: "app:",        // Key prefix
}))

// Or use the Layer
const CacheLayer = Layer.provide(CacheLive, MemoryStoreLive)`} />

      <h3 id="file-store">File Store</h3>
      <p>Persist cache to disk. Survives restarts and works well for large cached values.</p>
      <CodeBlock code={`import { makeFileStore, FileStoreLive } from "@gello/cache-drivers"

// Create file-based store
const store = yield* makeFileStore({
  directory: "/tmp/cache",
  extension: ".cache",    // default
  prefix: "app:",
})

// Layer for DI
const CacheLayer = FileStoreLive({
  directory: config.cache.file.directory,
})`} />

      <h3 id="redis-store">Redis Store</h3>
      <p>Distributed cache for multi-instance deployments. Supports tags for group invalidation.</p>
      <CodeBlock code={`import { makeRedisStore, RedisStoreLiveScoped } from "@gello/cache-drivers"
import { createClient } from "redis"

// With existing Redis client
const redis = createClient({ url: "redis://localhost:6379" })
await redis.connect()

const store = makeRedisStore(redis, {
  prefix: "app:",
  defaultTtl: Duration.hours(1),
})

// Tagged cache operations
const taggedStore = store as TaggableStore
yield* taggedStore.tags(["users", "profile"]).put("user:1", user)
yield* taggedStore.tags(["users"]).flush() // Invalidate all user caches`} />

      <h3 id="multi-level-cache">Multi-Level Cache (L1/L2)</h3>
      <p>Combine fast local cache with persistent distributed cache for optimal performance.</p>
      <CodeBlock code={`import { makeMultiStore, makeReadThroughStore } from "@gello/cache-drivers"

// L1: Fast in-memory cache
const l1 = Effect.runSync(makeMemoryStore({ maxSize: 100 }))

// L2: Persistent Redis cache
const l2 = makeRedisStore(redisClient, { prefix: "app:" })

// Multi-level store
const store = makeMultiStore({
  l1,
  l2,
  l1Ttl: Duration.minutes(5),    // L1 TTL
  populateL1OnHit: true,          // Write to L1 on L2 hit
  writeToL1: true,                // Write to L1 on put
})`} />

      <h3 id="null-store">Null Store</h3>
      <p>No-op cache for testing or when caching should be disabled.</p>
      <CodeBlock code={`import { NullStore, NullStoreLive } from "@gello/cache-drivers"

// Useful for testing or disabling cache in dev
const TestCacheLayer = Layer.provide(CacheLive, NullStoreLive)`} />

      <h2 id="configuration">Configuration</h2>
      <CodeBlock lang="bash" code={`# Cache driver: memory | redis | file | database | null | multi
CACHE_DRIVER=memory
CACHE_PREFIX=app:
CACHE_TTL=3600

# File store
CACHE_PATH=/tmp/cache

# Redis (shared with other services)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=`} />

      <h2 id="testing">Testing</h2>
      <CodeBlock code={`import { NullStoreLive, MemoryStoreLive } from "@gello/cache-drivers"
import { makeCacheLayer, Cache } from "@gello/cache"
import { minutes } from "@gello/time"
import { Effect, Layer } from "effect"

// Use NullStore for tests that don't need caching
const TestLayer = Layer.provide(CacheLive, NullStoreLive)

// Or use MemoryStore for integration tests
const IntegrationTestLayer = Layer.provide(
  CacheLive,
  MemoryStoreLive
)

// Test the remember pattern
const testRemember = Effect.gen(function* () {
  const cache = yield* Cache
  let computeCount = 0

  const compute = Effect.sync(() => {
    computeCount++
    return { data: "expensive" }
  })

  // First call computes
  yield* cache.remember("key", minutes(1), compute)
  expect(computeCount).toBe(1)

  // Second call uses cache
  yield* cache.remember("key", minutes(1), compute)
  expect(computeCount).toBe(1) // Still 1!
}).pipe(Effect.provide(IntegrationTestLayer))`} />

      <h2 id="cache-in-http-routes">Cache in HTTP Routes</h2>
      <CodeBlock code={`import { Cache } from "@gello/cache"
import { minutes } from "@gello/time"
import { Effect } from "effect"

HttpRouter.get("/users/:id", Effect.gen(function* () {
  const { id } = yield* HttpRouter.params
  const cache = yield* Cache

  // Cache user lookups for 5 minutes
  const user = yield* cache.remember(
    \`user:\${id}\`,
    minutes(5),
    Effect.gen(function* () {
      const db = yield* Database
      return yield* db.users.findById(id)
    })
  )

  return yield* HttpServerResponse.schemaJson(User)(user)
}))

// Invalidate on mutation
HttpRouter.patch("/users/:id", Effect.gen(function* () {
  const { id } = yield* HttpRouter.params
  const body = yield* HttpServerRequest.schemaBodyJson(UpdateUser)
  const cache = yield* Cache
  const db = yield* Database

  const updated = yield* db.users.update(id, body)

  // Invalidate cache
  yield* cache.forget(\`user:\${id}\`)

  return yield* HttpServerResponse.schemaJson(User)(updated)
}))`} />
    </DocsContent>
  );
}
