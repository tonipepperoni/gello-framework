import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock, Tabs, Tab, type TOCItem } from '../../components';
import { getPageNavigation } from '../../lib/source';

export const Route = createFileRoute('/docs/database')({
  component: DatabasePage,
});

const toc: TOCItem[] = [
  { title: 'Setup', url: '#setup', depth: 2 },
  { title: 'Connection Pool Layer', url: '#connection-pool-layer', depth: 2 },
  { title: 'Drizzle Layer', url: '#drizzle-layer', depth: 2 },
  { title: 'Schema Definition', url: '#schema-definition', depth: 2 },
  { title: 'Repository Pattern', url: '#repository-pattern', depth: 2 },
  { title: 'Transactions', url: '#transactions', depth: 2 },
  { title: 'Queries with Joins', url: '#queries-with-joins', depth: 2 },
  { title: 'Testing with Test Database', url: '#testing-with-test-database', depth: 2 },
];

function DatabasePage() {
  const footer = getPageNavigation('/docs/database');

  return (
    <DocsContent
      title="Database"
      description="Type-safe database access with Drizzle ORM and Effect's resource management"
      toc={toc}
      footer={footer}
    >
      <h2 id="setup">Setup</h2>
      <Tabs items={['pnpm', 'npm', 'yarn']}>
        <Tab value="pnpm">
          <CodeBlock lang="bash" code={`pnpm add drizzle-orm pg
pnpm add -D drizzle-kit @types/pg`} />
        </Tab>
        <Tab value="npm">
          <CodeBlock lang="bash" code={`npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg`} />
        </Tab>
        <Tab value="yarn">
          <CodeBlock lang="bash" code={`yarn add drizzle-orm pg
yarn add -D drizzle-kit @types/pg`} />
        </Tab>
      </Tabs>

      <h2 id="connection-pool-layer">Connection Pool Layer</h2>
      <p>
        The database pool is a scoped resource — acquired on startup, released on shutdown.
      </p>

      <CodeBlock code={`import { Pool } from "pg"
import { Context, Effect, Layer } from "effect"

class PgPool extends Context.Tag("PgPool")<PgPool, Pool>() {}

const PgPoolLive = Layer.scoped(
  PgPool,
  Effect.acquireRelease(
    Effect.gen(function* () {
      const cfg = yield* Config
      const pool = new Pool({ connectionString: cfg.DATABASE_URL })

      // Test connection
      const client = yield* Effect.tryPromise(() => pool.connect())
      client.release()

      yield* Effect.log("Database connected")
      return pool
    }),
    (pool) =>
      Effect.tryPromise(() => pool.end()).pipe(
        Effect.tap(() => Effect.log("Database disconnected")),
        Effect.orDie
      )
  )
).pipe(Layer.provide(ConfigLive))`} />

      <h2 id="drizzle-layer">Drizzle Layer</h2>
      <CodeBlock code={`import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import * as schema from "./schema"

class Db extends Context.Tag("Db")<
  Db,
  NodePgDatabase<typeof schema>
>() {}

const DbLive = Layer.effect(
  Db,
  Effect.gen(function* () {
    const pool = yield* PgPool
    return drizzle(pool, { schema })
  })
).pipe(Layer.provide(PgPoolLive))`} />

      <h2 id="schema-definition">Schema Definition</h2>
      <CodeBlock code={`// src/lib/db/schema.ts
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
})

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  published: boolean("published").default(false),
  authorId: text("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
})`} />

      <h2 id="repository-pattern">Repository Pattern</h2>
      <CodeBlock code={`import { eq } from "drizzle-orm"
import { users } from "../lib/db/schema"

export const UserRepoLive = Layer.effect(
  UserRepo,
  Effect.gen(function* () {
    const db = yield* Db

    return {
      findById: (id) =>
        Effect.tryPromise(async () => {
          const [user] = await db.select().from(users).where(eq(users.id, id))
          return user ?? null
        }),

      create: (data) =>
        Effect.tryPromise(async () => {
          const id = crypto.randomUUID()
          const [user] = await db.insert(users).values({ id, ...data }).returning()
          return user
        }),

      list: ({ page, limit }) =>
        Effect.tryPromise(() =>
          db.select().from(users).limit(limit).offset((page - 1) * limit)
        )
    }
  })
)`} />

      <h2 id="transactions">Transactions</h2>
      <CodeBlock code={`const transferFunds = (fromId: string, toId: string, amount: number) =>
  Effect.gen(function* () {
    const db = yield* Db

    return yield* Effect.tryPromise(() =>
      db.transaction(async (tx) => {
        await tx.update(accounts)
          .set({ balance: sql\`balance - \${amount}\` })
          .where(eq(accounts.id, fromId))

        await tx.update(accounts)
          .set({ balance: sql\`balance + \${amount}\` })
          .where(eq(accounts.id, toId))

        return { success: true }
      })
    )
  })`} />

      <h2 id="queries-with-joins">Queries with Joins</h2>
      <CodeBlock code={`const getPostWithAuthor = (postId: string) =>
  Effect.gen(function* () {
    const db = yield* Db

    const result = yield* Effect.tryPromise(() =>
      db.query.posts.findFirst({
        where: eq(posts.id, postId),
        with: {
          author: true
        }
      })
    )

    return result
  })`} />

      <h2 id="testing-with-test-database">Testing with Test Database</h2>
      <CodeBlock code={`// Use a test database
const ConfigTest = Layer.succeed(Config, {
  DATABASE_URL: "postgres://localhost/myapp_test",
  // ...
})

// Or use an in-memory mock
const DbTest = Layer.succeed(Db, {
  select: () => ({ from: () => ({ where: () => Promise.resolve([]) }) }),
  insert: () => ({ values: () => ({ returning: () => Promise.resolve([]) }) })
} as unknown as NodePgDatabase)`} />
    </DocsContent>
  );
}
