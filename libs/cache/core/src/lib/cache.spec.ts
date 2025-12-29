import { describe, it, expect, beforeEach } from "vitest"
import { Effect, Option, Ref, Layer } from "effect"
import {
  // Domain types
  CacheKey,
  makeCacheKey,
  unsafeMakeCacheKey,
  prefixedKey,
  compositeKey,
  InvalidCacheKeyError,
  CacheTag,
  makeCacheTag,
  unsafeMakeCacheTag,
  InvalidCacheTagError,
  makeCacheEntry,
  isExpired,
  isValid,
  hasTag,
  seconds,
  minutes,
  hours,
  days,
  forever,
  toMillis,
  isFinite,
  isForever,
  expiresAt,
  CacheDurations,
  // Errors
  CacheMiss,
  CacheConnectionError,
  CacheSerializationError,
  isCacheMiss,
  isConnectionError,
  // Ports
  CacheStoreTag,
  JsonSerializer,
  // Cache service
  Cache,
  makeCacheService,
  CacheLive,
} from "../index.js"
import type { CacheStore, CacheError } from "../index.js"

// ─── Test Helpers ─────────────────────────────────────────────────────────────

/**
 * Create an in-memory test store
 */
const makeTestStore = (): Effect.Effect<CacheStore, never> =>
  Effect.gen(function* () {
    const store = yield* Ref.make<Map<string, { value: string; expiresAt: number | null }>>(new Map())

    return {
      get: <A>(key: CacheKey): Effect.Effect<Option.Option<A>, CacheError> =>
        Effect.gen(function* () {
          const map = yield* Ref.get(store)
          const entry = map.get(key)
          if (!entry) return Option.none()
          if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
            return Option.none()
          }
          return Option.some(JSON.parse(entry.value) as A)
        }),

      put: <A>(key: CacheKey, value: A, ttl?: any) =>
        Ref.update(store, (map) => {
          const newMap = new Map(map)
          const expiresAt = ttl ? Date.now() + toMillis(ttl)! : null
          newMap.set(key, { value: JSON.stringify(value), expiresAt })
          return newMap
        }),

      has: (key: CacheKey) =>
        Effect.gen(function* () {
          const map = yield* Ref.get(store)
          return map.has(key)
        }),

      forget: (key: CacheKey) =>
        Ref.modify(store, (map) => {
          const existed = map.has(key)
          const newMap = new Map(map)
          newMap.delete(key)
          return [existed, newMap]
        }),

      flush: () => Ref.set(store, new Map()),

      increment: (key: CacheKey, value = 1) =>
        Ref.modify(store, (map) => {
          const newMap = new Map(map)
          const entry = newMap.get(key)
          const current = entry ? Number(JSON.parse(entry.value)) || 0 : 0
          const newValue = current + value
          newMap.set(key, { value: JSON.stringify(newValue), expiresAt: entry?.expiresAt ?? null })
          return [newValue, newMap]
        }),

      decrement: (key: CacheKey, value = 1) =>
        Ref.modify(store, (map) => {
          const newMap = new Map(map)
          const entry = newMap.get(key)
          const current = entry ? Number(JSON.parse(entry.value)) || 0 : 0
          const newValue = current - value
          newMap.set(key, { value: JSON.stringify(newValue), expiresAt: entry?.expiresAt ?? null })
          return [newValue, newMap]
        }),

      many: <A>(keys: readonly CacheKey[]) =>
        Effect.gen(function* () {
          const map = yield* Ref.get(store)
          const result = new Map<CacheKey, A | null>()
          for (const key of keys) {
            const entry = map.get(key)
            result.set(key, entry ? JSON.parse(entry.value) : null)
          }
          return result
        }),

      putMany: <A>(items: ReadonlyMap<CacheKey, A>, ttl?: any) =>
        Ref.update(store, (map) => {
          const newMap = new Map(map)
          const expiresAt = ttl ? Date.now() + toMillis(ttl)! : null
          for (const [key, value] of items) {
            newMap.set(key, { value: JSON.stringify(value), expiresAt })
          }
          return newMap
        }),
    }
  })

// ─── Domain Tests ─────────────────────────────────────────────────────────────

describe("CacheKey", () => {
  describe("makeCacheKey", () => {
    it("should create a valid cache key", async () => {
      const result = await Effect.runPromise(makeCacheKey("user:123"))
      expect(result).toBe("user:123")
    })

    it("should reject empty keys", async () => {
      const result = await Effect.runPromiseExit(makeCacheKey(""))
      expect(result._tag).toBe("Failure")
    })

    it("should reject keys over 250 characters", async () => {
      const longKey = "a".repeat(251)
      const result = await Effect.runPromiseExit(makeCacheKey(longKey))
      expect(result._tag).toBe("Failure")
    })

    it("should accept keys at max length", async () => {
      const maxKey = "a".repeat(250)
      const result = await Effect.runPromise(makeCacheKey(maxKey))
      expect(result.length).toBe(250)
    })
  })

  describe("unsafeMakeCacheKey", () => {
    it("should create a key without validation", () => {
      const key = unsafeMakeCacheKey("any:key")
      expect(key).toBe("any:key")
    })
  })

  describe("prefixedKey", () => {
    it("should create a prefixed key", () => {
      const key = unsafeMakeCacheKey("123")
      const result = prefixedKey("user", key)
      expect(result).toBe("user:123")
    })
  })

  describe("compositeKey", () => {
    it("should create a composite key from parts", () => {
      const result = compositeKey("user", "123", "profile")
      expect(result).toBe("user:123:profile")
    })
  })
})

describe("CacheTag", () => {
  describe("makeCacheTag", () => {
    it("should create a valid tag", async () => {
      const result = await Effect.runPromise(makeCacheTag("users"))
      expect(result).toBe("users")
    })

    it("should accept alphanumeric with underscores and hyphens", async () => {
      const result = await Effect.runPromise(makeCacheTag("user_profiles-v2"))
      expect(result).toBe("user_profiles-v2")
    })

    it("should accept colons for namespacing", async () => {
      const result = await Effect.runPromise(makeCacheTag("user:123:posts"))
      expect(result).toBe("user:123:posts")
    })

    it("should reject empty tags", async () => {
      const result = await Effect.runPromiseExit(makeCacheTag(""))
      expect(result._tag).toBe("Failure")
    })

    it("should reject tags with spaces", async () => {
      const result = await Effect.runPromiseExit(makeCacheTag("user posts"))
      expect(result._tag).toBe("Failure")
    })
  })
})

describe("CacheEntry", () => {
  const key = unsafeMakeCacheKey("test")
  const tag = unsafeMakeCacheTag("test-tag")

  describe("makeCacheEntry", () => {
    it("should create an entry with no expiration", () => {
      const entry = makeCacheEntry({ key, value: "hello" })
      expect(entry.key).toBe("test")
      expect(entry.value).toBe("hello")
      expect(Option.isNone(entry.expiresAt)).toBe(true)
      expect(entry.tags).toEqual([])
    })

    it("should create an entry with expiration", () => {
      const expires = new Date(Date.now() + 60000)
      const entry = makeCacheEntry({ key, value: 42, expiresAt: expires })
      expect(Option.isSome(entry.expiresAt)).toBe(true)
    })

    it("should create an entry with tags", () => {
      const entry = makeCacheEntry({ key, value: {}, tags: [tag] })
      expect(entry.tags).toHaveLength(1)
    })
  })

  describe("isExpired", () => {
    it("should return false for entries with no expiration", () => {
      const entry = makeCacheEntry({ key, value: "test" })
      expect(isExpired(entry)).toBe(false)
    })

    it("should return false for entries that haven't expired", () => {
      const entry = makeCacheEntry({
        key,
        value: "test",
        expiresAt: new Date(Date.now() + 60000),
      })
      expect(isExpired(entry)).toBe(false)
    })

    it("should return true for expired entries", () => {
      const entry = makeCacheEntry({
        key,
        value: "test",
        expiresAt: new Date(Date.now() - 1000),
      })
      expect(isExpired(entry)).toBe(true)
    })
  })

  describe("isValid", () => {
    it("should be the opposite of isExpired", () => {
      const validEntry = makeCacheEntry({ key, value: "test" })
      expect(isValid(validEntry)).toBe(true)

      const expiredEntry = makeCacheEntry({
        key,
        value: "test",
        expiresAt: new Date(Date.now() - 1000),
      })
      expect(isValid(expiredEntry)).toBe(false)
    })
  })

  describe("hasTag", () => {
    it("should return true if entry has the tag", () => {
      const entry = makeCacheEntry({ key, value: "test", tags: [tag] })
      expect(hasTag(entry, tag)).toBe(true)
    })

    it("should return false if entry doesn't have the tag", () => {
      const entry = makeCacheEntry({ key, value: "test" })
      expect(hasTag(entry, tag)).toBe(false)
    })
  })
})

describe("Duration", () => {
  describe("seconds/minutes/hours/days", () => {
    it("should create correct durations", () => {
      expect(toMillis(seconds(1))).toBe(1000)
      expect(toMillis(minutes(1))).toBe(60000)
      expect(toMillis(hours(1))).toBe(3600000)
      expect(toMillis(days(1))).toBe(86400000)
    })
  })

  describe("forever", () => {
    it("should be infinite", () => {
      expect(isForever(forever)).toBe(true)
      expect(isFinite(forever)).toBe(false)
      expect(toMillis(forever)).toBe(null)
    })
  })

  describe("expiresAt", () => {
    it("should return an Effect that yields an Option for finite durations", () => {
      const result = Effect.runSync(expiresAt(seconds(60)))
      expect(Option.isSome(result)).toBe(true)
    })

    it("should return Option.none for forever", () => {
      const result = Effect.runSync(expiresAt(forever))
      expect(Option.isNone(result)).toBe(true)
    })
  })

  describe("CacheDurations", () => {
    it("should have common durations", () => {
      expect(toMillis(CacheDurations.oneMinute)).toBe(60000)
      expect(toMillis(CacheDurations.oneHour)).toBe(3600000)
      expect(toMillis(CacheDurations.oneDay)).toBe(86400000)
      expect(isForever(CacheDurations.forever)).toBe(true)
    })
  })
})

// ─── Error Tests ──────────────────────────────────────────────────────────────

describe("CacheErrors", () => {
  describe("CacheMiss", () => {
    it("should create a cache miss error", () => {
      const key = unsafeMakeCacheKey("missing:key")
      const error = new CacheMiss({ key })
      expect(error._tag).toBe("CacheMiss")
      expect(error.key).toBe("missing:key")
      expect(error.message).toContain("Cache miss")
    })
  })

  describe("CacheConnectionError", () => {
    it("should create a connection error", () => {
      const error = new CacheConnectionError({
        driver: "redis",
        cause: new Error("Connection refused"),
      })
      expect(error._tag).toBe("CacheConnectionError")
      expect(error.driver).toBe("redis")
    })
  })

  describe("type guards", () => {
    it("should correctly identify error types", () => {
      const miss = new CacheMiss({ key: unsafeMakeCacheKey("test") })
      const conn = new CacheConnectionError({ driver: "redis", cause: null })

      expect(isCacheMiss(miss)).toBe(true)
      expect(isCacheMiss(conn)).toBe(false)
      expect(isConnectionError(conn)).toBe(true)
      expect(isConnectionError(miss)).toBe(false)
    })
  })
})

// ─── Serializer Tests ─────────────────────────────────────────────────────────

describe("JsonSerializer", () => {
  describe("serialize", () => {
    it("should serialize objects", async () => {
      const result = await Effect.runPromise(
        JsonSerializer.serialize({ name: "test", value: 42 })
      )
      expect(result).toBe('{"name":"test","value":42}')
    })

    it("should serialize primitives", async () => {
      expect(await Effect.runPromise(JsonSerializer.serialize("hello"))).toBe('"hello"')
      expect(await Effect.runPromise(JsonSerializer.serialize(42))).toBe("42")
      expect(await Effect.runPromise(JsonSerializer.serialize(true))).toBe("true")
    })

    it("should serialize arrays", async () => {
      const result = await Effect.runPromise(JsonSerializer.serialize([1, 2, 3]))
      expect(result).toBe("[1,2,3]")
    })
  })

  describe("deserialize", () => {
    it("should deserialize objects", async () => {
      const result = await Effect.runPromise(
        JsonSerializer.deserialize<{ name: string }>('{"name":"test"}')
      )
      expect(result).toEqual({ name: "test" })
    })

    it("should fail on invalid JSON", async () => {
      const result = await Effect.runPromiseExit(
        JsonSerializer.deserialize("not json")
      )
      expect(result._tag).toBe("Failure")
    })
  })
})

// ─── Cache Service Tests ──────────────────────────────────────────────────────

describe("CacheService", () => {
  const runWithCache = <A, E>(
    effect: Effect.Effect<A, E, CacheStore>
  ): Promise<A> =>
    Effect.runPromise(
      Effect.gen(function* () {
        const store = yield* makeTestStore()
        return yield* Effect.provideService(effect, CacheStoreTag, store)
      })
    )

  const runWithCacheExit = <A, E>(
    effect: Effect.Effect<A, E, CacheStore>
  ) =>
    Effect.runPromiseExit(
      Effect.gen(function* () {
        const store = yield* makeTestStore()
        return yield* Effect.provideService(effect, CacheStoreTag, store)
      })
    )

  describe("basic operations", () => {
    it("should put and get values", async () => {
      const result = await runWithCache(
        Effect.gen(function* () {
          const store = yield* CacheStoreTag
          const cache = makeCacheService(store)

          yield* cache.put("user:1", { name: "Alice" })
          return yield* cache.get<{ name: string }>("user:1")
        })
      )

      expect(result).toEqual({ name: "Alice" })
    })

    it("should return default value for missing keys", async () => {
      const result = await runWithCache(
        Effect.gen(function* () {
          const store = yield* CacheStoreTag
          const cache = makeCacheService(store)
          return yield* cache.get("missing", "default")
        })
      )

      expect(result).toBe("default")
    })

    it("should throw CacheMiss for missing keys without default", async () => {
      const result = await runWithCacheExit(
        Effect.gen(function* () {
          const store = yield* CacheStoreTag
          const cache = makeCacheService(store)
          return yield* cache.get("missing")
        })
      )

      expect(result._tag).toBe("Failure")
    })

    it("should check if key exists", async () => {
      const result = await runWithCache(
        Effect.gen(function* () {
          const store = yield* CacheStoreTag
          const cache = makeCacheService(store)

          yield* cache.put("exists", true)

          return {
            exists: yield* cache.has("exists"),
            missing: yield* cache.has("missing"),
          }
        })
      )

      expect(result.exists).toBe(true)
      expect(result.missing).toBe(false)
    })

    it("should forget keys", async () => {
      const result = await runWithCache(
        Effect.gen(function* () {
          const store = yield* CacheStoreTag
          const cache = makeCacheService(store)

          yield* cache.put("key", "value")
          const beforeForget = yield* cache.has("key")
          yield* cache.forget("key")
          const afterForget = yield* cache.has("key")

          return { beforeForget, afterForget }
        })
      )

      expect(result.beforeForget).toBe(true)
      expect(result.afterForget).toBe(false)
    })

    it("should flush all keys", async () => {
      const result = await runWithCache(
        Effect.gen(function* () {
          const store = yield* CacheStoreTag
          const cache = makeCacheService(store)

          yield* cache.put("key1", "value1")
          yield* cache.put("key2", "value2")
          yield* cache.flush()

          return {
            key1: yield* cache.has("key1"),
            key2: yield* cache.has("key2"),
          }
        })
      )

      expect(result.key1).toBe(false)
      expect(result.key2).toBe(false)
    })
  })

  describe("advanced operations", () => {
    it("should store forever", async () => {
      const result = await runWithCache(
        Effect.gen(function* () {
          const store = yield* CacheStoreTag
          const cache = makeCacheService(store)

          yield* cache.forever("permanent", "value")
          return yield* cache.get("permanent")
        })
      )

      expect(result).toBe("value")
    })

    it("should pull (get and delete)", async () => {
      const result = await runWithCache(
        Effect.gen(function* () {
          const store = yield* CacheStoreTag
          const cache = makeCacheService(store)

          yield* cache.put("pullme", "secret")
          const value = yield* cache.pull<string>("pullme")
          const exists = yield* cache.has("pullme")

          return { value, exists }
        })
      )

      expect(Option.getOrNull(result.value)).toBe("secret")
      expect(result.exists).toBe(false)
    })

    it("should add only if not exists", async () => {
      const result = await runWithCache(
        Effect.gen(function* () {
          const store = yield* CacheStoreTag
          const cache = makeCacheService(store)

          const added1 = yield* cache.add("newkey", "first")
          const added2 = yield* cache.add("newkey", "second")
          const value = yield* cache.get("newkey")

          return { added1, added2, value }
        })
      )

      expect(result.added1).toBe(true)
      expect(result.added2).toBe(false)
      expect(result.value).toBe("first")
    })
  })

  describe("remember patterns", () => {
    it("should compute and cache with remember", async () => {
      let computeCount = 0

      const result = await runWithCache(
        Effect.gen(function* () {
          const store = yield* CacheStoreTag
          const cache = makeCacheService(store)

          const compute = Effect.sync(() => {
            computeCount++
            return { expensive: true }
          })

          const result1 = yield* cache.remember("computed", minutes(5), compute)
          const result2 = yield* cache.remember("computed", minutes(5), compute)

          return { result1, result2 }
        })
      )

      expect(result.result1).toEqual({ expensive: true })
      expect(result.result2).toEqual({ expensive: true })
      expect(computeCount).toBe(1) // Only computed once
    })

    it("should remember forever", async () => {
      let computeCount = 0

      const result = await runWithCache(
        Effect.gen(function* () {
          const store = yield* CacheStoreTag
          const cache = makeCacheService(store)

          const compute = Effect.sync(() => {
            computeCount++
            return "permanent"
          })

          yield* cache.rememberForever("forever-key", compute)
          yield* cache.rememberForever("forever-key", compute)

          return computeCount
        })
      )

      expect(result).toBe(1)
    })
  })

  describe("atomic counters", () => {
    it("should increment", async () => {
      const result = await runWithCache(
        Effect.gen(function* () {
          const store = yield* CacheStoreTag
          const cache = makeCacheService(store)

          const v1 = yield* cache.increment("counter")
          const v2 = yield* cache.increment("counter")
          const v3 = yield* cache.increment("counter", 5)

          return { v1, v2, v3 }
        })
      )

      expect(result.v1).toBe(1)
      expect(result.v2).toBe(2)
      expect(result.v3).toBe(7)
    })

    it("should decrement", async () => {
      const result = await runWithCache(
        Effect.gen(function* () {
          const store = yield* CacheStoreTag
          const cache = makeCacheService(store)

          yield* cache.put("counter", 10)
          const v1 = yield* cache.decrement("counter")
          const v2 = yield* cache.decrement("counter", 3)

          return { v1, v2 }
        })
      )

      expect(result.v1).toBe(9)
      expect(result.v2).toBe(6)
    })
  })

  describe("bulk operations", () => {
    it("should get many", async () => {
      const result = await runWithCache(
        Effect.gen(function* () {
          const store = yield* CacheStoreTag
          const cache = makeCacheService(store)

          yield* cache.put("a", 1)
          yield* cache.put("b", 2)

          return yield* cache.many<number>(["a", "b", "c"])
        })
      )

      expect(result.a).toBe(1)
      expect(result.b).toBe(2)
      expect(result.c).toBe(null)
    })

    it("should put many", async () => {
      const result = await runWithCache(
        Effect.gen(function* () {
          const store = yield* CacheStoreTag
          const cache = makeCacheService(store)

          yield* cache.putMany({ x: 10, y: 20, z: 30 })

          return {
            x: yield* cache.get("x"),
            y: yield* cache.get("y"),
            z: yield* cache.get("z"),
          }
        })
      )

      expect(result).toEqual({ x: 10, y: 20, z: 30 })
    })
  })
})
