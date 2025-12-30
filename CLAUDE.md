# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gello is a TypeScript backend framework built on Effect, inspired by Laravel, Rails, and NestJS. It uses functional programming patterns with compile-time type safety.

## Common Commands

```bash
# Build all projects
pnpm build

# Run tests
pnpm test

# Run a single project's tests
nx test <project-name>

# Lint
pnpm lint

# Type check
pnpm typecheck

# Run CLI in dev mode
pnpm gello <command>

# Run specific project
nx run <project-name>:dev

# Build specific project
nx build <project-name>

# Publish packages (requires npm login)
nx run-many -t publish --projects='gello-*'
```

## Architecture

### Nx Monorepo Structure

- **apps/** - Runnable applications (docs site, todo example)
- **libs/** - Internal libraries organized by domain
- **libs/publishable/** - Public npm packages (@gello/core, @gello/common, etc.)
- **tools/** - CLI and developer tooling

### Publishable Packages

| Package | Description |
|---------|-------------|
| `@gello/core` | Core contracts, errors, base types |
| `@gello/common` | Middleware, routing, validation |
| `@gello/platform-node` | Node.js HTTP adapter |
| `@gello/queue` | Effect-native queue system |
| `@gello/fp` | Optics, refined types |
| `@gello/testing` | Testing utilities |

### Monorepo Directory Structure

```
gello/
├── apps/
│   ├── docs/                    # Documentation site (TanStack Start + Vite)
│   └── todo/                    # Example todo application
│
├── tools/
│   ├── cli/                     # Gello CLI (Ink/React TUI)
│   └── db-seeder/               # Database seeding utilities
│
├── libs/
│   ├── core/                    # ─── CORE FRAMEWORK ───────────────────
│   │   ├── adapters/
│   │   │   └── node/            # @gello/core-adapter-node: Node.js HTTP server adapter
│   │   ├── config/              # @gello/core-config: Configuration loading/management
│   │   ├── contracts/           # @gello/core-contracts: Ports, schemas, errors (ZERO deps)
│   │   ├── di/                  # @gello/core-di: Dependency injection utilities
│   │   ├── domain/
│   │   │   ├── errors/          # @gello/core-domain-errors: Tagged error types
│   │   │   ├── middleware/      # @gello/core-domain-middleware: CORS, logging, timing, error handler
│   │   │   └── routing/         # @gello/core-domain-routing: Path patterns, route matching
│   │   ├── errors/              # @gello/core-errors: Base error utilities
│   │   ├── http/                # @gello/core-http: HTTP primitives
│   │   ├── middleware/          # @gello/core-middleware: Middleware composition
│   │   ├── resilience/          # @gello/resilience: Circuit breaker, retry, timeout
│   │   ├── routing/             # @gello/core-routing: Router implementation
│   │   ├── testing/             # @gello/core-testing: Core test helpers
│   │   └── validation/          # @gello/core-validation: Schema validation with @effect/schema
│   │
│   ├── database/                # ─── DATABASE ─────────────────────────
│   │   ├── drizzle/             # @gello/database-drizzle: Drizzle ORM + Effect integration
│   │   ├── migrations/          # @gello/database-migrations: Migration utilities
│   │   └── repository/          # @gello/database-repository: Repository pattern base
│   │
│   ├── fp/                      # ─── FUNCTIONAL PROGRAMMING ───────────
│   │   ├── optics/              # @gello/optics: Lens, Prism, Optional, Traversal
│   │   └── refined/             # @gello/refined: Branded types, validation (Email, UUID, etc.)
│   │
│   ├── queue/                   # ─── QUEUE SYSTEM ─────────────────────
│   │   ├── core/                # @gello/queue-core: Queue abstractions, job definitions
│   │   ├── drivers/             # @gello/queue-drivers: In-memory, Redis drivers
│   │   └── worker/              # @gello/queue-worker: Worker process management
│   │
│   ├── testing/                 # ─── TESTING ──────────────────────────
│   │   ├── mocks/               # @gello/testing-mocks: Service mocks for testing
│   │   └── utilities/           # @gello/testing-utilities: Test helpers, assertions
│   │
│   └── publishable/             # ─── NPM PACKAGES (aggregators) ───────
│       ├── core/                # @gello/core → re-exports contracts, domain-errors
│       ├── common/              # @gello/common → re-exports middleware, routing, validation
│       ├── platform-node/       # @gello/platform-node → re-exports node adapter
│       ├── queue/               # @gello/queue → re-exports queue-core, drivers, worker
│       ├── fp/                  # @gello/fp → re-exports optics, refined
│       └── testing/             # @gello/testing → re-exports mocks, utilities
│
├── tsconfig.base.json           # Path aliases (@gello/* mappings)
├── nx.json                      # Nx configuration
└── package.json                 # Root package with workspace scripts
```

### Library Dependency Flow

```
contracts (zero-dep) → domain → adapters → publishable aggregators
                    ↘        ↗
                      fp libs
```

Internal libs are fine-grained for architecture; publishable packages aggregate them for simpler consumer API.

### Key Patterns

**Effect-based Architecture**: All operations return `Effect.Effect<A, E, R>` with typed errors and dependencies.

**Hexagonal Architecture**: Contracts in `libs/core/contracts` define ports; adapters implement them.

**Context.Tag for DI**: Services use Effect's Context.Tag pattern:
```typescript
class ConfigService extends Context.Tag("@gello/ConfigService")<
  ConfigService,
  ConfigPort
>() {}
```

**Layer Composition**: Dependencies compose via Effect Layers, launched at the edge with `Layer.launch`.

### Path Aliases

All packages use `@gello/*` aliases defined in `tsconfig.base.json`. Internal libs use prefixes like `@gello/core-*`, `@gello/queue-*`. Publishable packages use clean names like `@gello/core`.

### CLI (tools/cli)

Built with Ink (React for CLI). Commands:
- `gello new <name>` - Scaffold new project
- `gello serve` - Start dev server with hot reload
- `gello route:list` - Display registered routes

### Effect Conventions

- Use `Effect.gen(function* () { ... })` for Effect generators
- Use `yield*` to extract values from Effects
- Errors are typed and handled explicitly
- Resources managed with `Layer.scoped` and `acquireRelease`

## CLI Templates (CRITICAL)

### Template Rules

**IMPORTANT: CLI templates MUST use published @gello/* packages, NOT self-contained/inline implementations.**

Templates in `tools/cli/src/templates/` generate projects that users install via npm. These generated projects MUST depend on published Gello packages:

```typescript
// ✅ CORRECT - Use published packages
const dependencies = [
  '@gello/platform-node',
  '@gello/core',
  '@gello/common',
  '@gello/auth',  // When auth is enabled
];

// ❌ WRONG - Never generate auth/core code inline
// Never make templates "self-contained" without Gello dependencies
```

### Publishing Checklist

Before publishing CLI updates:

1. **Verify all dependencies are published to npm** - Run `npm view @gello/<package>` for each dependency used in templates
2. **Check for workspace:* references** - Publishable packages in `libs/publishable/` MUST NOT have `workspace:*` in dependencies when published
3. **Test the full flow**:
   ```bash
   # Create a test project
   npx gello@latest new testproject --template todo
   cd testproject
   pnpm install  # Must succeed without errors
   pnpm dev      # Must start successfully
   ```

### Package Publishing Requirements

Publishable packages (`libs/publishable/*`) must:

1. **Bundle all internal dependencies** - The build should resolve all `@gello/internal-*` imports
2. **NOT have workspace:* in published package.json** - These only work in monorepos
3. **Use peerDependencies for effect/platform** - Users install these themselves

Example of correct publishable package.json:
```json
{
  "name": "@gello/common",
  "peerDependencies": {
    "effect": "^3.19.0",
    "@gello/core": "^0.1.0"
  }
  // NO "dependencies" with workspace:* references
}
```

### Common Mistakes to Avoid

1. **Making templates self-contained** - Templates should ALWAYS use Gello packages
2. **Publishing with workspace:* references** - This breaks npm installs
3. **Not testing the full install flow** - Always test `pnpm install` in a fresh generated project
4. **Using internal package names in templates** - Use `@gello/auth` not `@gello/auth-core`
