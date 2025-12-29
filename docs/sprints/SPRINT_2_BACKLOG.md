# Sprint 2: Data Persistence
**Duration:** Weeks 3-4
**Epic:** Epic 2 - Database Integration
**Story Points:** 18
**Package:** `@gello/database`

---

## Sprint Goal

Enable developers to define database schemas, manage migrations, and query databases with full type safety using Drizzle ORM integrated into Effect's ecosystem.

---

## User Stories

### US-2.1: Drizzle ORM Integration
**As a** developer
**I want** to use Drizzle ORM with Effect
**So that** I get type-safe database queries with proper resource management

**Acceptance Criteria:**
- [ ] Database connections as Effect service
- [ ] Connection pool with configurable limits
- [ ] Automatic connection cleanup
- [ ] Query builder returns Effect types
- [ ] Support for PostgreSQL (primary)

**Story Points:** 5

**Technical Tasks:**
1. Create `DatabaseService` using `@effect/sql-drizzle`
2. Implement connection pool with Effect resource management
3. Add configuration for pool size, timeout
4. Wrap Drizzle queries in Effect
5. Add connection health checks

---

### US-2.2: Schema Definition
**As a** developer
**I want** to define database schemas in TypeScript
**So that** I get compile-time type safety for my tables

**Acceptance Criteria:**
- [ ] Tables defined using Drizzle schema DSL
- [ ] TypeScript types inferred from schema
- [ ] Relationships can be defined
- [ ] Schema exports for use in queries
- [ ] Example User/Todo models

**Story Points:** 3

**Technical Tasks:**
1. Create schema definition patterns
2. Set up Drizzle schema directory structure
3. Add relationship definition utilities
4. Create example User and Todo schemas
5. Document schema patterns

---

### US-2.3: Migration Generation
**As a** developer
**I want** to generate migrations from schema changes
**So that** I can version control my database changes

**Acceptance Criteria:**
- [ ] `drizzle-kit generate` creates migrations
- [ ] Migrations are timestamped
- [ ] SQL files are readable and auditable
- [ ] Schema changes detected automatically
- [ ] Integration with `gello make:migration`

**Story Points:** 4

**Technical Tasks:**
1. Configure Drizzle Kit
2. Set up migrations directory structure
3. Add generation script to package.json
4. Create CLI integration (placeholder)
5. Add migration naming conventions

---

### US-2.4: Migration Runner
**As a** developer
**I want** to run migrations via CLI
**So that** I can apply schema changes to my database

**Acceptance Criteria:**
- [ ] `gello migrate` runs pending migrations
- [ ] `gello migrate:rollback` reverts last batch
- [ ] `gello migrate:status` shows migration state
- [ ] Migrations tracked in database table
- [ ] Transaction wrapping for safety

**Story Points:** 4

**Technical Tasks:**
1. Create MigrationRunner service
2. Implement migration tracking table
3. Add migration execution with transactions
4. Create rollback functionality
5. Add status reporting

---

### US-2.5: Repository Pattern
**As a** developer
**I want** a repository abstraction for common queries
**So that** I can write less boilerplate

**Acceptance Criteria:**
- [ ] Generic repository factory
- [ ] CRUD operations out of the box
- [ ] Type-safe query building
- [ ] Effect-wrapped results
- [ ] Extensible for custom queries

**Story Points:** 2

**Technical Tasks:**
1. Create generic Repository class
2. Implement findById, findAll, create, update, delete
3. Add query building helpers
4. Integrate with Effect error handling
5. Create example usage in tests

---

## Technical Specifications

### Package Structure

```
packages/database/
├── src/
│   ├── index.ts                 # Public exports
│   ├── services/
│   │   ├── DatabaseService.ts   # Main DB service
│   │   └── MigrationService.ts  # Migration runner
│   ├── schema/
│   │   ├── index.ts             # Schema exports
│   │   └── common.ts            # Common fields (timestamps, etc.)
│   ├── repository/
│   │   └── Repository.ts        # Generic repository
│   └── migrations/
│       └── runner.ts            # Migration execution
├── test/
│   ├── DatabaseService.test.ts
│   └── Repository.test.ts
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

### Key Dependencies

```json
{
  "dependencies": {
    "effect": "^3.12.5",
    "@effect/sql": "^0.27.0",
    "@effect/sql-drizzle": "^0.15.0",
    "drizzle-orm": "^0.38.3",
    "postgres": "^3.4.5"
  },
  "devDependencies": {
    "drizzle-kit": "^0.30.1"
  }
}
```

### Database Service Pattern (from platform)

```typescript
import { PgDrizzle } from "@effect/sql-drizzle/Pg"
import { Layer, Effect, Context } from "effect"
import * as schema from "./schema"

export class Database extends Context.Tag("Database")<
  Database,
  PgDrizzle.PgDrizzle
>() {
  static readonly layer = Layer.unwrapEffect(
    Effect.gen(function* () {
      const config = yield* ConfigService
      return PgDrizzle.layer({
        schema,
        url: config.databaseUrl
      })
    })
  )
}
```

---

## Definition of Done

- [ ] All user stories complete
- [ ] Test coverage > 80%
- [ ] Migrations run successfully against PostgreSQL
- [ ] Example Todo model with CRUD operations
- [ ] Documentation complete
- [ ] Integration tested with Sprint 1 HTTP layer

---

## Dependencies

- **Requires Sprint 1:** ConfigService, DI patterns
- **Enables Sprint 3:** Queue system can use database backend
