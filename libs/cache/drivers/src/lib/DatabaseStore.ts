/**
 * DatabaseStore - SQL database cache store adapter
 *
 * Stores cache entries in a database table. Useful when the database
 * is the only available infrastructure or for cache entries that need
 * to survive application restarts.
 *
 * @module adapters/DatabaseStore
 */
import { Effect, Layer, Option } from "effect"
import {
  toMillis,
  CacheStoreTag,
  CacheStoreError,
} from "@gello/cache"
import type {
  CacheKey,
  Duration,
  CacheStore,
  CacheError,
} from "@gello/cache"

/**
 * Database client interface
 * Works with any SQL client that implements this interface
 */
export interface DatabaseClient {
  query<R = unknown>(sql: string, params?: unknown[]): Promise<R[]>
  execute(sql: string, params?: unknown[]): Promise<{ rowCount: number }>
}

/**
 * Database store configuration
 */
export interface DatabaseStoreConfig {
  /**
   * Database client instance
   */
  readonly client: DatabaseClient

  /**
   * Table name for cache entries (default: "cache")
   */
  readonly table?: string

  /**
   * Key column name (default: "key")
   */
  readonly keyColumn?: string

  /**
   * Value column name (default: "value")
   */
  readonly valueColumn?: string

  /**
   * Expiration column name (default: "expires_at")
   */
  readonly expiresAtColumn?: string

  /**
   * Created at column name (default: "created_at")
   */
  readonly createdAtColumn?: string
}

/**
 * Cache entry row structure
 */
interface CacheRow {
  key: string
  value: string
  expires_at: number | null
  created_at: number
}

/**
 * Create a database-based cache store
 *
 * Expected table schema:
 * ```sql
 * CREATE TABLE cache (
 *   key VARCHAR(250) PRIMARY KEY,
 *   value TEXT NOT NULL,
 *   expires_at BIGINT,
 *   created_at BIGINT NOT NULL
 * );
 * CREATE INDEX idx_cache_expires_at ON cache(expires_at);
 * ```
 */
export const makeDatabaseStore = (
  config: DatabaseStoreConfig
): CacheStore => {
  const {
    client,
    table = "cache",
    keyColumn = "key",
    valueColumn = "value",
    expiresAtColumn = "expires_at",
    createdAtColumn = "created_at",
  } = config

  const wrapError = <A>(
    operation: string,
    promise: Promise<A>
  ): Effect.Effect<A, CacheError> =>
    Effect.tryPromise({
      try: () => promise,
      catch: (cause) =>
        new CacheStoreError({
          operation,
          driver: "database",
          cause,
        }),
    })

  const store: CacheStore = {
    get: <A>(key: CacheKey): Effect.Effect<Option.Option<A>, CacheError> =>
      Effect.gen(function* () {
        const rows = yield* wrapError(
          "get",
          client.query<CacheRow>(
            `SELECT ${valueColumn}, ${expiresAtColumn} FROM ${table} WHERE ${keyColumn} = $1`,
            [key]
          )
        )

        if (rows.length === 0) {
          return Option.none()
        }

        const row = rows[0]

        // Check expiration
        if (row.expires_at !== null && row.expires_at < Date.now()) {
          // Delete expired entry
          yield* wrapError(
            "get:cleanup",
            client.execute(`DELETE FROM ${table} WHERE ${keyColumn} = $1`, [key])
          )
          return Option.none()
        }

        try {
          return Option.some(JSON.parse(row.value) as A)
        } catch {
          return Option.none()
        }
      }),

    put: <A>(
      key: CacheKey,
      value: A,
      ttl?: Duration
    ): Effect.Effect<void, CacheError> =>
      Effect.gen(function* () {
        const serialized = JSON.stringify(value)
        const expiresAt = ttl ? toMillis(ttl) : null
        const expiresAtAbsolute = expiresAt !== null ? Date.now() + expiresAt : null
        const now = Date.now()

        // Upsert (INSERT ... ON CONFLICT UPDATE)
        yield* wrapError(
          "put",
          client.execute(
            `INSERT INTO ${table} (${keyColumn}, ${valueColumn}, ${expiresAtColumn}, ${createdAtColumn})
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (${keyColumn})
             DO UPDATE SET ${valueColumn} = $2, ${expiresAtColumn} = $3`,
            [key, serialized, expiresAtAbsolute, now]
          )
        )
      }),

    has: (key: CacheKey): Effect.Effect<boolean, CacheError> =>
      Effect.gen(function* () {
        const rows = yield* wrapError(
          "has",
          client.query<{ count: number }>(
            `SELECT COUNT(*) as count FROM ${table}
             WHERE ${keyColumn} = $1
             AND (${expiresAtColumn} IS NULL OR ${expiresAtColumn} > $2)`,
            [key, Date.now()]
          )
        )

        return rows[0]?.count > 0
      }),

    forget: (key: CacheKey): Effect.Effect<boolean, CacheError> =>
      Effect.gen(function* () {
        const result = yield* wrapError(
          "forget",
          client.execute(`DELETE FROM ${table} WHERE ${keyColumn} = $1`, [key])
        )
        return result.rowCount > 0
      }),

    flush: (): Effect.Effect<void, CacheError> =>
      wrapError("flush", client.execute(`DELETE FROM ${table}`)).pipe(
        Effect.asVoid
      ),

    increment: (key: CacheKey, value = 1): Effect.Effect<number, CacheError> =>
      store.get<number>(key).pipe(
        Effect.map((current: Option.Option<number>) =>
          Option.getOrElse(current, () => 0)
        ),
        Effect.flatMap((currentValue: number) => {
          const newValue = currentValue + value
          return store.put(key, newValue).pipe(Effect.map(() => newValue))
        })
      ),

    decrement: (key: CacheKey, value = 1): Effect.Effect<number, CacheError> =>
      store.get<number>(key).pipe(
        Effect.map((current: Option.Option<number>) =>
          Option.getOrElse(current, () => 0)
        ),
        Effect.flatMap((currentValue: number) => {
          const newValue = currentValue - value
          return store.put(key, newValue).pipe(Effect.map(() => newValue))
        })
      ),

    many: <A>(
      keys: readonly CacheKey[]
    ): Effect.Effect<Map<CacheKey, A | null>, CacheError> =>
      Effect.gen(function* () {
        if (keys.length === 0) {
          return new Map()
        }

        const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ")
        const rows = yield* wrapError(
          "many",
          client.query<CacheRow>(
            `SELECT ${keyColumn}, ${valueColumn}, ${expiresAtColumn} FROM ${table}
             WHERE ${keyColumn} IN (${placeholders})`,
            keys as unknown[]
          )
        )

        const result = new Map<CacheKey, A | null>()
        const now = Date.now()

        // Initialize with nulls
        for (const key of keys) {
          result.set(key, null)
        }

        // Fill in found values
        for (const row of rows) {
          const key = row.key as CacheKey

          // Check expiration
          if (row.expires_at !== null && row.expires_at < now) {
            continue
          }

          try {
            result.set(key, JSON.parse(row.value) as A)
          } catch {
            // Keep null on parse error
          }
        }

        return result
      }),

    putMany: <A>(
      items: ReadonlyMap<CacheKey, A>,
      ttl?: Duration
    ): Effect.Effect<void, CacheError> =>
      Effect.forEach(
        Array.from(items),
        ([key, value]: [CacheKey, A]) => store.put(key, value, ttl)
      ).pipe(Effect.asVoid),
  }

  return store
}

/**
 * Create a DatabaseStore layer
 */
export const DatabaseStoreLive = (
  config: DatabaseStoreConfig
): Layer.Layer<CacheStore> =>
  Layer.succeed(CacheStoreTag, makeDatabaseStore(config))

/**
 * SQL migration to create the cache table
 */
export const createCacheTableSQL = (tableName = "cache"): string => `
CREATE TABLE IF NOT EXISTS ${tableName} (
  key VARCHAR(250) PRIMARY KEY,
  value TEXT NOT NULL,
  expires_at BIGINT,
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_${tableName}_expires_at ON ${tableName}(expires_at);
`

/**
 * Garbage collect expired entries from database
 */
export const garbageCollect = (
  config: DatabaseStoreConfig
): Effect.Effect<number, CacheError> => {
  const { client, table = "cache", expiresAtColumn = "expires_at" } = config

  return Effect.tryPromise({
    try: async () => {
      const result = await client.execute(
        `DELETE FROM ${table} WHERE ${expiresAtColumn} IS NOT NULL AND ${expiresAtColumn} < $1`,
        [Date.now()]
      )
      return result.rowCount
    },
    catch: (cause) =>
      new CacheStoreError({
        operation: "garbageCollect",
        driver: "database",
        cause,
      }),
  })
}
