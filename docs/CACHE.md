# Cache System Design

> Laravel-inspired caching with Hexagonal DDD Architecture for Effect-TS

## Overview

A type-safe, functional caching system inspired by Laravel 4.2's cache features, built with Effect-TS patterns and hexagonal (ports & adapters) architecture.

## Laravel 4.2 Cache Features to Implement

| Feature | Laravel API | Gello API | Priority |
|---------|-------------|-----------|----------|
| Get item | `Cache::get('key')` | `Cache.get('key')` | P0 |
| Get with default | `Cache::get('key', 'default')` | `Cache.get('key', 'default')` | P0 |
| Put item | `Cache::put('key', 'value', $minutes)` | `Cache.put('key', 'value', duration)` | P0 |
| Forever | `Cache::forever('key', 'value')` | `Cache.forever('key', 'value')` | P0 |
| Remember | `Cache::remember('key', $min, fn)` | `Cache.remember('key', duration, effect)` | P0 |
| Remember forever | `Cache::rememberForever('key', fn)` | `Cache.rememberForever('key', effect)` | P0 |
| Has key | `Cache::has('key')` | `Cache.has('key')` | P0 |
| Forget | `Cache::forget('key')` | `Cache.forget('key')` | P0 |
| Flush | `Cache::flush()` | `Cache.flush()` | P1 |
| Increment | `Cache::increment('key', $amount)` | `Cache.increment('key', amount)` | P1 |
| Decrement | `Cache::decrement('key', $amount)` | `Cache.decrement('key', amount)` | P1 |
| Pull (get & delete) | `Cache::pull('key')` | `Cache.pull('key')` | P1 |
| Add (if not exists) | `Cache::add('key', 'value', $min)` | `Cache.add('key', 'value', duration)` | P1 |
| Many get | `Cache::many(['k1', 'k2'])` | `Cache.many(['k1', 'k2'])` | P2 |
| Many put | `Cache::putMany([...], $min)` | `Cache.putMany({...}, duration)` | P2 |
| Tags | `Cache::tags(['t1'])->get()` | `Cache.tags(['t1']).get()` | P2 |

## Cache Drivers

| Driver | Description | Use Case |
|--------|-------------|----------|
| `memory` | In-process Map (default) | Development, testing, single-instance |
| `redis` | Redis/Valkey backend | Production, distributed, persistent |
| `file` | File system storage | Simple persistence, no external deps |
| `database` | SQL table storage | When DB is only infrastructure |
| `null` | No-op driver | Testing, disabling cache |
| `multi` | Multi-level (L1/L2) | Memory + Redis layered caching |

---

## Hexagonal DDD Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Application Layer                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     CacheService                              │   │
│  │  get, put, forget, remember, increment, tags, etc.           │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ uses
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Domain Layer                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  CacheKey    │  │  CacheValue  │  │  CacheEntry              │  │
│  │  (branded)   │  │  (serialized)│  │  { key, value, ttl, tags}│  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Duration    │  │  CacheTag    │  │  CacheError (ADT)        │  │
│  │  (ttl)       │  │  (branded)   │  │  Miss | Serialization    │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ implements
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Ports (Interfaces)                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   CacheStore (Port)                          │   │
│  │  get(key): Effect<Option<Value>, CacheError>                 │   │
│  │  put(key, value, ttl?): Effect<void, CacheError>             │   │
│  │  forget(key): Effect<boolean, CacheError>                    │   │
│  │  flush(): Effect<void, CacheError>                           │   │
│  │  increment(key, value): Effect<number, CacheError>           │   │
│  │  decrement(key, value): Effect<number, CacheError>           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  TaggableStore (Port)                        │   │
│  │  getTagged(tags, key): Effect<Option<Value>, CacheError>     │   │
│  │  putTagged(tags, key, value, ttl?): Effect<void, CacheError> │   │
│  │  flushTags(tags): Effect<void, CacheError>                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  Serializer (Port)                           │   │
│  │  serialize<A>(value: A): Effect<string, SerializationError>  │   │
│  │  deserialize<A>(data: string): Effect<A, SerializationError> │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ implemented by
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Adapters (Implementations)                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ MemoryStore │ │ RedisStore  │ │  FileStore  │ │DatabaseStore│   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────────┐   │
│  │  NullStore  │ │ MultiStore  │ │     JsonSerializer          │   │
│  └─────────────┘ └─────────────┘ └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
libs/cache/
├── core/                          # Domain + Application layers
│   ├── src/
│   │   ├── index.ts              # Public exports
│   │   ├── lib/
│   │   │   ├── Cache.ts          # Main Cache service (application layer)
│   │   │   ├── CacheManager.ts   # Multi-store manager
│   │   │   ├── TaggedCache.ts    # Tagged cache wrapper
│   │   │   │
│   │   │   ├── domain/           # Domain layer
│   │   │   │   ├── CacheKey.ts   # Branded key type
│   │   │   │   ├── CacheValue.ts # Value wrapper
│   │   │   │   ├── CacheEntry.ts # Full entry with metadata
│   │   │   │   ├── CacheTag.ts   # Tag type
│   │   │   │   ├── Duration.ts   # TTL duration helpers
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── ports/            # Port interfaces
│   │   │   │   ├── CacheStore.ts # Core store interface
│   │   │   │   ├── TaggableStore.ts
│   │   │   │   ├── Serializer.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── errors/           # Domain errors
│   │   │       ├── CacheError.ts
│   │   │       └── index.ts
│   │   │
│   │   └── testing/              # Test utilities
│   │       └── MockCache.ts
│   │
│   ├── package.json
│   └── project.json
│
├── drivers/                       # Adapter implementations
│   ├── src/
│   │   ├── index.ts
│   │   ├── lib/
│   │   │   ├── MemoryStore.ts    # In-memory (default)
│   │   │   ├── RedisStore.ts     # Redis/Valkey
│   │   │   ├── FileStore.ts      # File system
│   │   │   ├── DatabaseStore.ts  # SQL database
│   │   │   ├── NullStore.ts      # No-op
│   │   │   ├── MultiStore.ts     # L1/L2 layered
│   │   │   └── JsonSerializer.ts # JSON serialization
│   │   │
│   │   └── testing/
│   │       └── index.ts
│   │
│   ├── package.json
│   └── project.json
```

---

## Domain Layer

### CacheKey (Branded Type)

```typescript
import { Brand } from 'effect';

export type CacheKey = string & Brand.Brand<'CacheKey'>;
export const CacheKey = Brand.nominal<CacheKey>();

// Validation
export const makeCacheKey = (key: string): Effect<CacheKey, InvalidKeyError> =>
  key.length > 0 && key.length <= 250
    ? Effect.succeed(CacheKey(key))
    : Effect.fail(new InvalidKeyError({ key, reason: 'Key must be 1-250 characters' }));

// Prefixed keys for namespacing
export const prefixedKey = (prefix: string, key: CacheKey): CacheKey =>
  CacheKey(`${prefix}:${key}`);
```

### CacheTag (Branded Type)

```typescript
export type CacheTag = string & Brand.Brand<'CacheTag'>;
export const CacheTag = Brand.nominal<CacheTag>();

export const makeCacheTag = (tag: string): Effect<CacheTag, InvalidTagError> =>
  /^[a-zA-Z0-9_-]+$/.test(tag)
    ? Effect.succeed(CacheTag(tag))
    : Effect.fail(new InvalidTagError({ tag }));
```

### CacheEntry

```typescript
export interface CacheEntry<A> {
  readonly key: CacheKey;
  readonly value: A;
  readonly expiresAt: Option<Date>;
  readonly tags: ReadonlyArray<CacheTag>;
  readonly createdAt: Date;
}

export const isExpired = (entry: CacheEntry<unknown>): boolean =>
  Option.match(entry.expiresAt, {
    onNone: () => false,
    onSome: (exp) => exp.getTime() < Date.now(),
  });
```

### Duration Helpers

```typescript
import { Duration } from 'effect';

export const seconds = (n: number) => Duration.seconds(n);
export const minutes = (n: number) => Duration.minutes(n);
export const hours = (n: number) => Duration.hours(n);
export const days = (n: number) => Duration.days(n);
export const forever = Duration.infinity;

// Convert to milliseconds for storage
export const toMillis = (d: Duration.Duration): number | null =>
  Duration.isFinite(d) ? Duration.toMillis(d) : null;
```

### CacheError (ADT)

```typescript
import { Data } from 'effect';

export class CacheMiss extends Data.TaggedError('CacheMiss')<{
  readonly key: CacheKey;
}> {}

export class CacheConnectionError extends Data.TaggedError('CacheConnectionError')<{
  readonly driver: string;
  readonly cause: unknown;
}> {}

export class SerializationError extends Data.TaggedError('SerializationError')<{
  readonly operation: 'serialize' | 'deserialize';
  readonly cause: unknown;
}> {}

export class InvalidKeyError extends Data.TaggedError('InvalidKeyError')<{
  readonly key: string;
  readonly reason: string;
}> {}

export class InvalidTagError extends Data.TaggedError('InvalidTagError')<{
  readonly tag: string;
}> {}

export type CacheError =
  | CacheMiss
  | CacheConnectionError
  | SerializationError
  | InvalidKeyError
  | InvalidTagError;
```

---

## Ports (Interfaces)

### CacheStore Port

```typescript
import { Effect, Option, Duration } from 'effect';

export interface CacheStore {
  /**
   * Get a value from the cache
   */
  readonly get: <A>(key: CacheKey) => Effect<Option<A>, CacheError>;

  /**
   * Store a value in the cache
   */
  readonly put: <A>(
    key: CacheKey,
    value: A,
    ttl?: Duration.Duration
  ) => Effect<void, CacheError>;

  /**
   * Check if a key exists
   */
  readonly has: (key: CacheKey) => Effect<boolean, CacheError>;

  /**
   * Remove a key from the cache
   */
  readonly forget: (key: CacheKey) => Effect<boolean, CacheError>;

  /**
   * Clear all items from the cache
   */
  readonly flush: () => Effect<void, CacheError>;

  /**
   * Increment a numeric value
   */
  readonly increment: (
    key: CacheKey,
    value?: number
  ) => Effect<number, CacheError>;

  /**
   * Decrement a numeric value
   */
  readonly decrement: (
    key: CacheKey,
    value?: number
  ) => Effect<number, CacheError>;
}

export class CacheStoreTag extends Context.Tag('CacheStore')<
  CacheStoreTag,
  CacheStore
>() {}
```

### TaggableStore Port

```typescript
export interface TaggableStore extends CacheStore {
  /**
   * Get value with tags
   */
  readonly getTagged: <A>(
    tags: ReadonlyArray<CacheTag>,
    key: CacheKey
  ) => Effect<Option<A>, CacheError>;

  /**
   * Store value with tags
   */
  readonly putTagged: <A>(
    tags: ReadonlyArray<CacheTag>,
    key: CacheKey,
    value: A,
    ttl?: Duration.Duration
  ) => Effect<void, CacheError>;

  /**
   * Flush all entries with given tags
   */
  readonly flushTags: (
    tags: ReadonlyArray<CacheTag>
  ) => Effect<void, CacheError>;
}
```

### Serializer Port

```typescript
export interface Serializer {
  readonly serialize: <A>(value: A) => Effect<string, SerializationError>;
  readonly deserialize: <A>(data: string) => Effect<A, SerializationError>;
}

export class SerializerTag extends Context.Tag('Serializer')<
  SerializerTag,
  Serializer
>() {}
```

---

## Application Layer (Cache Service)

### Main Cache API

```typescript
import { Effect, Option, Duration, Context, Layer } from 'effect';

export interface CacheService {
  // Basic operations
  readonly get: <A>(key: string, defaultValue?: A) => Effect<A, CacheError>;
  readonly put: <A>(key: string, value: A, ttl?: Duration.Duration) => Effect<void, CacheError>;
  readonly has: (key: string) => Effect<boolean, CacheError>;
  readonly forget: (key: string) => Effect<boolean, CacheError>;
  readonly flush: () => Effect<void, CacheError>;

  // Advanced operations
  readonly forever: <A>(key: string, value: A) => Effect<void, CacheError>;
  readonly pull: <A>(key: string) => Effect<Option<A>, CacheError>;
  readonly add: <A>(key: string, value: A, ttl?: Duration.Duration) => Effect<boolean, CacheError>;

  // Remember patterns (cache-aside)
  readonly remember: <A, E, R>(
    key: string,
    ttl: Duration.Duration,
    compute: Effect<A, E, R>
  ) => Effect<A, E | CacheError, R>;

  readonly rememberForever: <A, E, R>(
    key: string,
    compute: Effect<A, E, R>
  ) => Effect<A, E | CacheError, R>;

  // Atomic counters
  readonly increment: (key: string, value?: number) => Effect<number, CacheError>;
  readonly decrement: (key: string, value?: number) => Effect<number, CacheError>;

  // Bulk operations
  readonly many: <A>(keys: ReadonlyArray<string>) => Effect<Record<string, A | null>, CacheError>;
  readonly putMany: <A>(items: Record<string, A>, ttl?: Duration.Duration) => Effect<void, CacheError>;

  // Tagged cache
  readonly tags: (tags: ReadonlyArray<string>) => TaggedCacheService;
}

export class Cache extends Context.Tag('Cache')<Cache, CacheService>() {}
```

### TaggedCacheService

```typescript
export interface TaggedCacheService {
  readonly get: <A>(key: string, defaultValue?: A) => Effect<A, CacheError>;
  readonly put: <A>(key: string, value: A, ttl?: Duration.Duration) => Effect<void, CacheError>;
  readonly forever: <A>(key: string, value: A) => Effect<void, CacheError>;
  readonly flush: () => Effect<void, CacheError>;
  readonly remember: <A, E, R>(
    key: string,
    ttl: Duration.Duration,
    compute: Effect<A, E, R>
  ) => Effect<A, E | CacheError, R>;
}
```

### CacheManager (Multi-Store)

```typescript
export interface CacheManager {
  /**
   * Get the default store
   */
  readonly store: () => CacheStore;

  /**
   * Get a specific store by name
   */
  readonly driver: (name: string) => Effect<CacheStore, CacheError>;

  /**
   * Register a new store
   */
  readonly extend: (name: string, store: CacheStore) => Effect<void, never>;

  /**
   * Get the default store name
   */
  readonly getDefaultDriver: () => string;
}

export class CacheManagerTag extends Context.Tag('CacheManager')<
  CacheManagerTag,
  CacheManager
>() {}
```

---

## Adapter Implementations

### MemoryStore

```typescript
interface MemoryEntry {
  readonly value: string;
  readonly expiresAt: number | null;
  readonly tags: ReadonlyArray<string>;
}

export const makeMemoryStore = (): Effect<CacheStore, never> =>
  Effect.gen(function* () {
    const store = yield* Ref.make<Map<string, MemoryEntry>>(new Map());

    const cleanup = () =>
      Ref.update(store, (map) => {
        const now = Date.now();
        const newMap = new Map(map);
        for (const [key, entry] of newMap) {
          if (entry.expiresAt !== null && entry.expiresAt < now) {
            newMap.delete(key);
          }
        }
        return newMap;
      });

    return {
      get: <A>(key: CacheKey) =>
        Effect.gen(function* () {
          yield* cleanup;
          const map = yield* Ref.get(store);
          const entry = map.get(key);
          if (!entry) return Option.none();
          if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
            yield* Ref.update(store, (m) => { m.delete(key); return m; });
            return Option.none();
          }
          return Option.some(JSON.parse(entry.value) as A);
        }),

      put: <A>(key: CacheKey, value: A, ttl?: Duration.Duration) =>
        Ref.update(store, (map) => {
          map.set(key, {
            value: JSON.stringify(value),
            expiresAt: ttl ? Date.now() + Duration.toMillis(ttl) : null,
            tags: [],
          });
          return map;
        }),

      has: (key: CacheKey) =>
        Effect.gen(function* () {
          yield* cleanup;
          const map = yield* Ref.get(store);
          return map.has(key);
        }),

      forget: (key: CacheKey) =>
        Ref.modify(store, (map) => {
          const existed = map.has(key);
          map.delete(key);
          return [existed, map];
        }),

      flush: () => Ref.set(store, new Map()),

      increment: (key: CacheKey, value = 1) =>
        Ref.modify(store, (map) => {
          const entry = map.get(key);
          const current = entry ? Number(JSON.parse(entry.value)) || 0 : 0;
          const newValue = current + value;
          map.set(key, { ...entry, value: JSON.stringify(newValue), expiresAt: entry?.expiresAt ?? null, tags: entry?.tags ?? [] });
          return [newValue, map];
        }),

      decrement: (key: CacheKey, value = 1) =>
        Ref.modify(store, (map) => {
          const entry = map.get(key);
          const current = entry ? Number(JSON.parse(entry.value)) || 0 : 0;
          const newValue = current - value;
          map.set(key, { ...entry, value: JSON.stringify(newValue), expiresAt: entry?.expiresAt ?? null, tags: entry?.tags ?? [] });
          return [newValue, map];
        }),
    };
  });

export const MemoryStoreLive: Layer<CacheStoreTag> = Layer.effect(
  CacheStoreTag,
  makeMemoryStore()
);
```

### RedisStore

```typescript
import { Redis } from 'ioredis'; // or effect-redis

export interface RedisStoreConfig {
  readonly host: string;
  readonly port: number;
  readonly password?: string;
  readonly database?: number;
  readonly prefix?: string;
  readonly tls?: boolean;
}

export const makeRedisStore = (config: RedisStoreConfig): Effect<CacheStore, CacheConnectionError> =>
  Effect.gen(function* () {
    const client = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.database ?? 0,
      tls: config.tls ? {} : undefined,
      keyPrefix: config.prefix ?? 'cache:',
    });

    yield* Effect.addFinalizer(() =>
      Effect.promise(() => client.quit()).pipe(Effect.orDie)
    );

    return {
      get: <A>(key: CacheKey) =>
        Effect.tryPromise({
          try: () => client.get(key),
          catch: (e) => new CacheConnectionError({ driver: 'redis', cause: e }),
        }).pipe(
          Effect.map((value) =>
            value !== null ? Option.some(JSON.parse(value) as A) : Option.none()
          )
        ),

      put: <A>(key: CacheKey, value: A, ttl?: Duration.Duration) =>
        Effect.tryPromise({
          try: async () => {
            const serialized = JSON.stringify(value);
            if (ttl && Duration.isFinite(ttl)) {
              await client.psetex(key, Duration.toMillis(ttl), serialized);
            } else {
              await client.set(key, serialized);
            }
          },
          catch: (e) => new CacheConnectionError({ driver: 'redis', cause: e }),
        }),

      has: (key: CacheKey) =>
        Effect.tryPromise({
          try: () => client.exists(key).then((n) => n > 0),
          catch: (e) => new CacheConnectionError({ driver: 'redis', cause: e }),
        }),

      forget: (key: CacheKey) =>
        Effect.tryPromise({
          try: () => client.del(key).then((n) => n > 0),
          catch: (e) => new CacheConnectionError({ driver: 'redis', cause: e }),
        }),

      flush: () =>
        Effect.tryPromise({
          try: () => client.flushdb(),
          catch: (e) => new CacheConnectionError({ driver: 'redis', cause: e }),
        }).pipe(Effect.asVoid),

      increment: (key: CacheKey, value = 1) =>
        Effect.tryPromise({
          try: () => client.incrby(key, value),
          catch: (e) => new CacheConnectionError({ driver: 'redis', cause: e }),
        }),

      decrement: (key: CacheKey, value = 1) =>
        Effect.tryPromise({
          try: () => client.decrby(key, value),
          catch: (e) => new CacheConnectionError({ driver: 'redis', cause: e }),
        }),
    };
  });

export const RedisStoreLive = (config: RedisStoreConfig): Layer<CacheStoreTag, CacheConnectionError> =>
  Layer.scoped(CacheStoreTag, makeRedisStore(config));
```

### FileStore

```typescript
export interface FileStoreConfig {
  readonly directory: string;
  readonly extension?: string;
}

export const makeFileStore = (config: FileStoreConfig): Effect<CacheStore, never> =>
  Effect.gen(function* () {
    const ext = config.extension ?? '.cache';
    const dir = config.directory;

    // Ensure directory exists
    yield* Effect.sync(() => fs.mkdirSync(dir, { recursive: true }));

    const keyToPath = (key: CacheKey) =>
      path.join(dir, `${Buffer.from(key).toString('base64url')}${ext}`);

    return {
      get: <A>(key: CacheKey) =>
        Effect.gen(function* () {
          const filePath = keyToPath(key);
          const exists = yield* Effect.sync(() => fs.existsSync(filePath));
          if (!exists) return Option.none();

          const content = yield* Effect.sync(() => fs.readFileSync(filePath, 'utf-8'));
          const entry = JSON.parse(content) as { value: A; expiresAt: number | null };

          if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
            yield* Effect.sync(() => fs.unlinkSync(filePath));
            return Option.none();
          }

          return Option.some(entry.value);
        }),

      put: <A>(key: CacheKey, value: A, ttl?: Duration.Duration) =>
        Effect.sync(() => {
          const entry = {
            value,
            expiresAt: ttl && Duration.isFinite(ttl)
              ? Date.now() + Duration.toMillis(ttl)
              : null,
          };
          fs.writeFileSync(keyToPath(key), JSON.stringify(entry));
        }),

      // ... other methods similar pattern
    };
  });
```

### NullStore

```typescript
export const NullStore: CacheStore = {
  get: () => Effect.succeed(Option.none()),
  put: () => Effect.void,
  has: () => Effect.succeed(false),
  forget: () => Effect.succeed(false),
  flush: () => Effect.void,
  increment: (_, value = 1) => Effect.succeed(value),
  decrement: (_, value = 1) => Effect.succeed(-value),
};

export const NullStoreLive: Layer<CacheStoreTag> = Layer.succeed(CacheStoreTag, NullStore);
```

### MultiStore (L1/L2 Layered)

```typescript
export interface MultiStoreConfig {
  readonly l1: CacheStore;  // Fast (memory)
  readonly l2: CacheStore;  // Persistent (redis)
  readonly l1Ttl?: Duration.Duration;  // How long to keep in L1
}

export const makeMultiStore = (config: MultiStoreConfig): CacheStore => ({
  get: <A>(key: CacheKey) =>
    Effect.gen(function* () {
      // Try L1 first
      const l1Result = yield* config.l1.get<A>(key);
      if (Option.isSome(l1Result)) {
        return l1Result;
      }

      // Fall back to L2
      const l2Result = yield* config.l2.get<A>(key);
      if (Option.isSome(l2Result)) {
        // Populate L1 on cache hit
        yield* config.l1.put(key, l2Result.value, config.l1Ttl);
      }
      return l2Result;
    }),

  put: <A>(key: CacheKey, value: A, ttl?: Duration.Duration) =>
    Effect.all([
      config.l1.put(key, value, config.l1Ttl ?? ttl),
      config.l2.put(key, value, ttl),
    ]).pipe(Effect.asVoid),

  forget: (key: CacheKey) =>
    Effect.all([
      config.l1.forget(key),
      config.l2.forget(key),
    ]).pipe(Effect.map(([a, b]) => a || b)),

  flush: () =>
    Effect.all([
      config.l1.flush(),
      config.l2.flush(),
    ]).pipe(Effect.asVoid),

  // ... other methods
});
```

---

## Usage Examples

### Basic Usage

```typescript
import { Effect } from 'effect';
import { Cache, minutes, hours } from '@gello/cache';

const program = Effect.gen(function* () {
  const cache = yield* Cache;

  // Simple get/put
  yield* cache.put('user:1', { name: 'Alice' }, minutes(30));
  const user = yield* cache.get('user:1');

  // Remember pattern (cache-aside)
  const posts = yield* cache.remember(
    'posts:recent',
    hours(1),
    fetchRecentPosts()
  );

  // Forever (no expiration)
  yield* cache.forever('settings:global', globalSettings);

  // Increment counter
  const views = yield* cache.increment('article:123:views');

  // Pull (get and delete)
  const notification = yield* cache.pull('notification:456');

  // Check existence
  const hasUser = yield* cache.has('user:1');

  // Delete
  yield* cache.forget('user:1');

  // Bulk operations
  const users = yield* cache.many(['user:1', 'user:2', 'user:3']);
  yield* cache.putMany({
    'config:a': 1,
    'config:b': 2,
  }, hours(24));
});
```

### Tagged Cache

```typescript
const program = Effect.gen(function* () {
  const cache = yield* Cache;

  // Store with tags
  const userCache = cache.tags(['users']);

  yield* userCache.put('user:1', userData, hours(1));
  yield* userCache.put('user:2', userData2, hours(1));

  // Get tagged
  const user = yield* userCache.get('user:1');

  // Flush all items with 'users' tag
  yield* userCache.flush();

  // Multi-tag
  const postCache = cache.tags(['posts', 'user:1:posts']);
  yield* postCache.put('post:123', postData);
});
```

### Driver Selection

```typescript
import { Cache, CacheManager, MemoryStoreLive, RedisStoreLive } from '@gello/cache';

// Use memory store (default)
const withMemory = program.pipe(
  Effect.provide(MemoryStoreLive)
);

// Use Redis store
const withRedis = program.pipe(
  Effect.provide(RedisStoreLive({
    host: 'localhost',
    port: 6379,
  }))
);

// Multi-level caching
const withMultiLevel = program.pipe(
  Effect.provide(MultiStoreLive({
    l1: memoryStore,
    l2: redisStore,
    l1Ttl: minutes(5),
  }))
);
```

### Configuration Integration

```typescript
import { env } from '@gello/config';
import { Cache, RedisStoreLive, MemoryStoreLive, FileStoreLive } from '@gello/cache';

const cacheDriver = env('CACHE_DRIVER', 'memory');

const CacheLive = match(cacheDriver)
  .with('memory', () => MemoryStoreLive)
  .with('redis', () => RedisStoreLive({
    host: env('REDIS_HOST', 'localhost'),
    port: Number(env('REDIS_PORT', '6379')),
    password: env('REDIS_PASSWORD', ''),
    prefix: env('CACHE_PREFIX', 'cache:'),
  }))
  .with('file', () => FileStoreLive({
    directory: env('CACHE_PATH', '/tmp/cache'),
  }))
  .otherwise(() => MemoryStoreLive);
```

---

## Implementation Phases

### Phase 1: Core (P0)
- [ ] Domain types (CacheKey, CacheTag, CacheEntry, Duration)
- [ ] CacheError ADT
- [ ] CacheStore port interface
- [ ] Cache service interface
- [ ] MemoryStore adapter
- [ ] Basic operations: get, put, has, forget, flush
- [ ] Remember/rememberForever patterns
- [ ] Unit tests

### Phase 2: Extended Operations (P1)
- [ ] Increment/decrement
- [ ] Pull (get & delete)
- [ ] Add (if not exists)
- [ ] Forever (no TTL)
- [ ] NullStore adapter
- [ ] FileStore adapter

### Phase 3: Advanced Features (P2)
- [ ] RedisStore adapter
- [ ] Tagged cache support
- [ ] Many/putMany bulk operations
- [ ] MultiStore (L1/L2)
- [ ] DatabaseStore adapter
- [ ] CacheManager for multiple stores

### Phase 4: Integration
- [ ] Config integration
- [ ] CLI generator templates
- [ ] Documentation
- [ ] Performance benchmarks

---

## Environment Variables

```bash
# Cache driver: memory, redis, file, database, null
CACHE_DRIVER=memory

# Prefix for all cache keys
CACHE_PREFIX=gello:

# Default TTL in seconds (0 = forever)
CACHE_TTL=3600

# File store
CACHE_PATH=/tmp/cache

# Redis (if CACHE_DRIVER=redis)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DATABASE=0

# Database (if CACHE_DRIVER=database)
CACHE_TABLE=cache
```

---

## Testing Utilities

```typescript
import { testCache, MockCache } from '@gello/cache/testing';

describe('UserService', () => {
  it('caches user lookup', async () => {
    const mockCache = MockCache.make();

    const result = await Effect.runPromise(
      userService.getUser('123').pipe(
        Effect.provide(mockCache.layer)
      )
    );

    expect(mockCache.puts).toHaveLength(1);
    expect(mockCache.puts[0].key).toBe('user:123');
  });
});
```

---

## References

- [Laravel 4.2 Cache Documentation](https://laravel.com/docs/4.2/cache)
- [Effect-TS Context and Layers](https://effect.website/docs/requirements-management/services)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
