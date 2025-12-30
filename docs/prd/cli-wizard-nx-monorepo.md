# PRD: Gello CLI Wizard & NX Monorepo Scaffolding

**Version:** 1.0.0
**Status:** Draft
**Created:** 2025-12-30
**Author:** Gello Team

---

## Executive Summary

Transform `gello new` from a simple project generator into a comprehensive interactive wizard that scaffolds production-ready NX monorepos with full-stack capabilities. Support multiple frontend frameworks (TanStack, Next.js, Expo), implement clean architecture for features, integrate OpenAPI-based type-safe client generation, and provide extensibility to add applications post-creation.

### Key Outcomes

1. **Zero-to-Production in Minutes** - Complete monorepo with API, frontend, shared types, and codegen
2. **Framework Flexibility** - Support React SPA, RSC (TanStack/Next), and React Native (Expo)
3. **Type Safety End-to-End** - OpenAPI spec generation → Hey API client → Effect validation
4. **Clean Feature Architecture** - `libs/feature-*/` with platform-specific and shared code
5. **Extensible by Design** - Add new apps/features to existing projects via wizard

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Goals & Non-Goals](#2-goals--non-goals)
3. [User Stories](#3-user-stories)
4. [Feature Specifications](#4-feature-specifications)
   - 4.1 [Enhanced CLI Wizard](#41-enhanced-cli-wizard)
   - 4.2 [NX Monorepo Structure](#42-nx-monorepo-structure)
   - 4.3 [OpenAPI & Codegen System](#43-openapi--codegen-system)
   - 4.4 [Feature Architecture](#44-feature-architecture)
   - 4.5 [UI Libraries](#45-ui-libraries)
   - 4.6 [CLI Commands](#46-cli-commands)
5. [Technical Architecture](#5-technical-architecture)
6. [Implementation Phases](#6-implementation-phases)
7. [Success Metrics](#7-success-metrics)
8. [Open Questions](#8-open-questions)
9. [Appendices](#9-appendices)

---

## 1. Problem Statement

### Current State

The existing `gello new` command creates a minimal single-package project:
- Basic HTTP server with routes
- Simple config and cache setup
- No frontend support
- No monorepo structure
- No type sharing between packages
- No codegen infrastructure

### Pain Points

| Pain Point | Impact |
|------------|--------|
| Manual monorepo setup | Hours of boilerplate configuration |
| No frontend integration | Teams build separate projects, lose type safety |
| No OpenAPI/codegen | Manual type duplication, drift between API and clients |
| Feature code scattered | No clear organization for cross-platform features |
| One-time scaffold only | Can't add apps to existing projects |

### Opportunity

Developers choosing Gello want the Laravel DX with Effect's type safety. A comprehensive wizard that scaffolds production-ready full-stack monorepos would:
- Reduce time-to-first-feature from hours to minutes
- Establish best practices from day one
- Enable end-to-end type safety automatically
- Create a cohesive ecosystem around Gello

---

## 2. Goals & Non-Goals

### Goals

| ID | Goal | Priority |
|----|------|----------|
| G1 | Interactive wizard for project type selection | P0 |
| G2 | NX monorepo scaffolding with apps/libs structure | P0 |
| G3 | Support 5 project configurations (API-only through Expo) | P0 |
| G4 | OpenAPI spec generation from Gello routes | P0 |
| G5 | Hey API integration for TypeScript client generation | P1 |
| G6 | Clean architecture for feature organization | P1 |
| G7 | shadcn/ui integration for web frontends | P1 |
| G8 | React Native Reusables for mobile UI | P2 |
| G9 | Add-on capability for existing projects | P1 |
| G10 | Feature/driver selection wizard (queue, mail, cache) | P1 |
| G11 | Auto-serve all apps after scaffold completion | P2 |

### Non-Goals

- **Not building a full IDE** - We scaffold, we don't manage ongoing development
- **Not supporting non-TypeScript clients** - Focus on TypeScript ecosystem
- **Not implementing CI/CD templates** - Out of scope for initial release
- **Not supporting other React frameworks** - No Remix, Gatsby, etc. initially
- **Not building custom bundler** - Use Vite, Next.js built-in, Metro as-is

---

## 3. User Stories

### US-1: New Full-Stack Project
> As a developer starting a new SaaS, I want to run a single command that creates a complete monorepo with Gello API, React frontend, and shared types, so I can start building features immediately.

**Acceptance Criteria:**
- Run `gello new my-saas`
- Select "REST API + SPA (TanStack Router)"
- Get NX monorepo with `apps/api`, `apps/web`, `libs/contracts`
- Frontend has pre-configured API client with types
- `gello serve` starts both API and web dev servers

### US-2: Add Mobile App to Existing Project
> As a developer with an existing Gello web app, I want to add an Expo mobile app that shares the same API types and UI patterns, without recreating the whole project.

**Acceptance Criteria:**
- Run `gello add expo` in existing monorepo
- Wizard scaffolds `apps/mobile` with Expo Router
- Adds `libs/mobile-ui` for React Native components
- Existing `libs/contracts` and `libs/api-client` work with mobile
- API client is configured and ready to use

### US-3: Configure Infrastructure on Setup
> As a developer, I want the wizard to ask what infrastructure I'll use (Redis for queues, S3 for storage) so the project is pre-configured with the right drivers and env variables.

**Acceptance Criteria:**
- Wizard step asks about queue driver (sync, database, redis)
- Wizard step asks about cache driver (memory, redis, database)
- Wizard step asks about mail driver (log, smtp, resend, ses)
- Generated `.env.example` has only relevant variables
- Config files import correct driver packages

### US-4: Generate API Client from Routes
> As a developer, I want my frontend to have auto-generated, type-safe API functions that update when my Gello routes change.

**Acceptance Criteria:**
- Define route with `@effect/schema` validation
- Run `gello openapi:generate`
- OpenAPI spec generated in `libs/api-spec/openapi.json`
- Run `gello client:generate`
- TypeScript client generated with Effect runtime validators
- Frontend imports and uses type-safe client

### US-5: Organize Features Across Platforms
> As a developer building a notification system, I want a clear folder structure that keeps web, mobile, API, and shared code organized but discoverable.

**Acceptance Criteria:**
- Run `gello make:feature notifications`
- Creates `libs/feature-notifications/` with:
  - `frontend/` - Web-specific components
  - `backend/` - API routes, services
  - `mobile/` - React Native components
  - `shared/` - Types, schemas, utilities
- Each subfolder is a separate NX library
- Clear import paths like `@my-app/feature-notifications/shared`

---

## 4. Feature Specifications

### 4.1 Enhanced CLI Wizard

#### 4.1.1 Wizard Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      gello new my-app                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: What would you like to build?                          │
│                                                                 │
│  ○ REST API only                                                │
│  ○ REST API + SPA (TanStack Router)           ← React SPA       │
│  ○ REST API + Web App (TanStack Start)        ← React RSC       │
│  ○ REST API + Web App (Next.js)               ← Next.js RSC     │
│  ○ REST API + Mobile App (Expo)               ← React Native    │
│                                                                 │
│  [↑↓ Navigate] [Enter Select]                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Configure your infrastructure                          │
│                                                                 │
│  Queue Driver:     ○ Sync  ● Redis  ○ Database                  │
│  Cache Driver:     ○ Memory  ● Redis  ○ Database                │
│  Mail Driver:      ○ Log  ○ SMTP  ● Resend  ○ SES               │
│  Session Driver:   ○ Memory  ● Redis  ○ Database                │
│                                                                 │
│  [Tab Next Field] [Space Toggle] [Enter Continue]               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Additional features                                    │
│                                                                 │
│  ☑ Authentication (API tokens + sessions)                       │
│  ☑ Authorization (abilities/policies)                           │
│  ☐ OAuth Providers (GitHub, Google)                             │
│  ☑ Database (Drizzle + PostgreSQL)                              │
│  ☐ Storage (S3-compatible)                                      │
│  ☑ OpenAPI + Codegen                                            │
│                                                                 │
│  [Space Toggle] [Enter Continue]                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Package manager                                        │
│                                                                 │
│  ● pnpm (Recommended)                                           │
│  ○ npm                                                          │
│  ○ yarn                                                         │
│  ○ bun                                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Creating my-app...                                             │
│                                                                 │
│  ✓ Initialize NX workspace                                      │
│  ✓ Create apps/api                                              │
│  ✓ Create apps/web                                              │
│  ✓ Create libs/contracts                                        │
│  ✓ Create libs/api-client                                       │
│  ✓ Create libs/ui                                               │
│  ✓ Configure OpenAPI codegen                                    │
│  ✓ Set up authentication                                        │
│  ✓ Generate .env files                                          │
│  ● Installing dependencies...                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  ✨ Project created successfully!                                │
│                                                                 │
│  Next steps:                                                    │
│                                                                 │
│    cd my-app                                                    │
│    cp .env.example .env                                         │
│    gello serve                    # Start all apps              │
│                                                                 │
│  Or start individual apps:                                      │
│                                                                 │
│    gello serve api                # API on :3000                │
│    gello serve web                # Web on :5173                │
│                                                                 │
│  Documentation: https://gello.net/docs                          │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.1.2 Project Type Configurations

| Option | Apps Created | Libs Created | Key Technologies |
|--------|--------------|--------------|------------------|
| **API only** | `api` | `contracts` | Gello, Effect, Drizzle |
| **API + SPA** | `api`, `web` | `contracts`, `api-client`, `ui` | + TanStack Router, Vite, shadcn |
| **API + TanStack Start** | `api`, `web` | `contracts`, `api-client`, `ui` | + TanStack Start, Vinxi |
| **API + Next.js** | `api`, `web` | `contracts`, `api-client`, `ui` | + Next.js 15, App Router |
| **API + Expo** | `api`, `mobile` | `contracts`, `api-client`, `mobile-ui` | + Expo Router, React Native |

#### 4.1.3 Wizard Implementation

```typescript
// tools/cli/src/commands/new/wizard.tsx
import { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import SelectInput from 'ink-select-input'
import MultiSelect from 'ink-multi-select'

interface WizardState {
  step: 'project-type' | 'infrastructure' | 'features' | 'package-manager' | 'creating'
  projectName: string
  projectType: ProjectType
  infrastructure: InfrastructureConfig
  features: FeatureFlags
  packageManager: PackageManager
}

type ProjectType =
  | 'api-only'
  | 'api-spa-tanstack'
  | 'api-rsc-tanstack'
  | 'api-rsc-nextjs'
  | 'api-expo'

interface InfrastructureConfig {
  queue: 'sync' | 'redis' | 'database'
  cache: 'memory' | 'redis' | 'database'
  mail: 'log' | 'smtp' | 'resend' | 'ses'
  session: 'memory' | 'redis' | 'database'
}

interface FeatureFlags {
  authentication: boolean
  authorization: boolean
  oauth: boolean
  database: boolean
  storage: boolean
  openapi: boolean
}

export const NewProjectWizard = ({ projectName }: { projectName: string }) => {
  const [state, setState] = useState<WizardState>({
    step: 'project-type',
    projectName,
    projectType: 'api-spa-tanstack',
    infrastructure: {
      queue: 'redis',
      cache: 'redis',
      mail: 'log',
      session: 'redis',
    },
    features: {
      authentication: true,
      authorization: true,
      oauth: false,
      database: true,
      storage: false,
      openapi: true,
    },
    packageManager: 'pnpm',
  })

  // Render current step...
}
```

---

### 4.2 NX Monorepo Structure

#### 4.2.1 Generated Directory Structure

```
my-app/
├── apps/
│   ├── api/                          # Gello API server
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── index.ts
│   │   │   ├── routes/
│   │   │   │   ├── index.ts          # Route aggregator
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── user.routes.ts
│   │   │   │   └── todo.routes.ts
│   │   │   ├── services/
│   │   │   │   └── index.ts
│   │   │   └── main.ts
│   │   ├── project.json
│   │   └── tsconfig.json
│   │
│   ├── web/                          # React frontend (if selected)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/                # or routes/ for TanStack
│   │   │   ├── lib/
│   │   │   │   └── api.ts            # API client instance
│   │   │   └── main.tsx
│   │   ├── project.json
│   │   └── tsconfig.json
│   │
│   ├── mobile/                       # Expo app (if selected)
│   │   ├── app/                      # Expo Router
│   │   │   ├── (tabs)/
│   │   │   └── _layout.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   │   └── api.ts
│   │   ├── app.json
│   │   └── project.json
│   │
│   └── queue-worker/                 # Queue worker process
│       ├── src/
│       │   └── main.ts
│       └── project.json
│
├── libs/
│   ├── contracts/                    # Shared schemas & types
│   │   ├── src/
│   │   │   ├── schemas/
│   │   │   │   ├── user.ts
│   │   │   │   ├── todo.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── project.json
│   │   └── package.json
│   │
│   ├── api-spec/                     # Generated OpenAPI spec
│   │   ├── openapi.json
│   │   └── project.json
│   │
│   ├── api-client/                   # Generated TypeScript client
│   │   ├── src/
│   │   │   ├── generated/            # Hey API output
│   │   │   │   ├── schemas.ts
│   │   │   │   ├── services.ts
│   │   │   │   └── types.ts
│   │   │   ├── effect-client.ts      # Effect wrapper
│   │   │   └── index.ts
│   │   ├── openapi-ts.config.ts
│   │   └── project.json
│   │
│   ├── ui/                           # Web UI components (shadcn)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/               # shadcn components
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── project.json
│   │
│   ├── mobile-ui/                    # Mobile UI components (if Expo)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   └── index.ts
│   │   └── project.json
│   │
│   └── feature-*/                    # Feature libraries (see 4.4)
│
├── tools/
│   └── scripts/
│       └── generate-openapi.ts
│
├── nx.json
├── tsconfig.base.json
├── package.json
├── pnpm-workspace.yaml
├── .env.example
├── .gitignore
└── README.md
```

#### 4.2.2 NX Configuration

```json
// nx.json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "sharedGlobals": [],
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json"
    ]
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "cache": true
    },
    "dev": {
      "dependsOn": ["^build"]
    },
    "generate-openapi": {
      "dependsOn": ["build"],
      "outputs": ["{workspaceRoot}/libs/api-spec/openapi.json"],
      "cache": true
    },
    "generate-client": {
      "dependsOn": ["generate-openapi"],
      "inputs": ["{workspaceRoot}/libs/api-spec/openapi.json"],
      "outputs": ["{projectRoot}/src/generated"],
      "cache": true
    }
  },
  "plugins": [
    {
      "plugin": "@nx/vite/plugin",
      "options": {
        "buildTargetName": "build",
        "serveTargetName": "dev"
      }
    }
  ]
}
```

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true,
    "baseUrl": ".",
    "paths": {
      "@my-app/contracts": ["libs/contracts/src/index.ts"],
      "@my-app/api-client": ["libs/api-client/src/index.ts"],
      "@my-app/ui": ["libs/ui/src/index.ts"],
      "@my-app/mobile-ui": ["libs/mobile-ui/src/index.ts"],
      "@my-app/feature-*": ["libs/feature-*/src/index.ts"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

#### 4.2.3 Workspace Package Configuration

```json
// package.json (root)
{
  "name": "my-app",
  "private": true,
  "scripts": {
    "dev": "nx run-many -t dev --projects=api,web",
    "build": "nx run-many -t build",
    "test": "nx run-many -t test",
    "lint": "nx run-many -t lint",
    "typecheck": "nx run-many -t typecheck",
    "generate": "nx run-many -t generate-openapi,generate-client",
    "gello": "gello"
  },
  "devDependencies": {
    "nx": "^20.0.0",
    "@nx/js": "^20.0.0",
    "@nx/vite": "^20.0.0",
    "@nx/react": "^20.0.0",
    "typescript": "^5.6.0",
    "gello": "^0.1.0"
  }
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'libs/*'
  - 'tools/*'
```

---

### 4.3 OpenAPI & Codegen System

#### 4.3.1 Overview

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Gello Routes  │ ───▶ │   OpenAPI Spec  │ ───▶ │  TypeScript     │
│   + Schemas     │      │   (JSON/YAML)   │      │  Client         │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                        │                        │
   @effect/schema          openapi.json            Hey API +
   Route definitions       Generated at            Effect wrapper
                          build time
```

#### 4.3.2 Route Definition with OpenAPI Metadata

```typescript
// apps/api/src/routes/user.routes.ts
import * as S from '@effect/schema/Schema'
import { Route, route } from '@gello/core'
import { UserSchema, CreateUserSchema, UpdateUserSchema } from '@my-app/contracts'

export const userRoutes = Route.group({
  prefix: '/users',
  tags: ['Users'],
}, [
  route.get('/')
    .summary('List all users')
    .description('Returns a paginated list of users')
    .response(S.Array(UserSchema))
    .handler(() =>
      Effect.gen(function* () {
        const users = yield* UserRepository.findAll()
        return Response.json(users)
      })
    ),

  route.get('/:id')
    .summary('Get user by ID')
    .params(S.Struct({ id: S.String }))
    .response(UserSchema)
    .errors({
      404: NotFoundError,
    })
    .handler((req) =>
      Effect.gen(function* () {
        const user = yield* UserRepository.findById(req.params.id)
        return Response.json(user)
      })
    ),

  route.post('/')
    .summary('Create a new user')
    .body(CreateUserSchema)
    .response(UserSchema, { status: 201 })
    .errors({
      400: ValidationError,
      409: ConflictError,
    })
    .handler((req) =>
      Effect.gen(function* () {
        const user = yield* UserRepository.create(req.body)
        return Response.created(user)
      })
    ),

  route.patch('/:id')
    .summary('Update a user')
    .params(S.Struct({ id: S.String }))
    .body(UpdateUserSchema)
    .response(UserSchema)
    .handler((req) =>
      Effect.gen(function* () {
        const user = yield* UserRepository.update(req.params.id, req.body)
        return Response.json(user)
      })
    ),

  route.delete('/:id')
    .summary('Delete a user')
    .params(S.Struct({ id: S.String }))
    .response(S.Void, { status: 204 })
    .handler((req) =>
      Effect.gen(function* () {
        yield* UserRepository.delete(req.params.id)
        return Response.noContent()
      })
    ),
])
```

#### 4.3.3 Contracts Package (Shared Schemas)

```typescript
// libs/contracts/src/schemas/user.ts
import * as S from '@effect/schema/Schema'

export const UserId = S.String.pipe(
  S.brand('UserId'),
  S.annotations({
    description: 'Unique user identifier',
    example: 'usr_abc123',
  })
)

export const Email = S.String.pipe(
  S.pattern(/^[^@]+@[^@]+\.[^@]+$/),
  S.annotations({
    description: 'Valid email address',
    format: 'email',
    example: 'john@example.com',
  })
)

export const UserSchema = S.Struct({
  id: UserId,
  email: Email,
  name: S.String.pipe(
    S.minLength(1),
    S.maxLength(100),
    S.annotations({ description: 'User display name' })
  ),
  role: S.Literal('user', 'admin').pipe(
    S.annotations({ description: 'User role', default: 'user' })
  ),
  createdAt: S.Date.pipe(
    S.annotations({ description: 'Account creation timestamp' })
  ),
  updatedAt: S.Date.pipe(
    S.annotations({ description: 'Last update timestamp' })
  ),
}).annotations({
  identifier: 'User',
  description: 'Represents a user in the system',
})

export const CreateUserSchema = S.Struct({
  email: Email,
  name: S.String.pipe(S.minLength(1), S.maxLength(100)),
  password: S.String.pipe(
    S.minLength(8),
    S.annotations({ description: 'User password (min 8 characters)' })
  ),
}).annotations({
  identifier: 'CreateUser',
})

export const UpdateUserSchema = S.Struct({
  name: S.optional(S.String.pipe(S.minLength(1), S.maxLength(100))),
  email: S.optional(Email),
}).annotations({
  identifier: 'UpdateUser',
})

// Export types
export type UserId = S.Schema.Type<typeof UserId>
export type User = S.Schema.Type<typeof UserSchema>
export type CreateUser = S.Schema.Type<typeof CreateUserSchema>
export type UpdateUser = S.Schema.Type<typeof UpdateUserSchema>
```

#### 4.3.4 OpenAPI Generator

```typescript
// libs/openapi/src/generator.ts
import * as S from '@effect/schema/Schema'
import * as AST from '@effect/schema/AST'
import type { OpenAPIV3_1 } from 'openapi-types'
import type { Route } from '@gello/core'

export class OpenApiGenerator {
  private schemas: Map<string, OpenAPIV3_1.SchemaObject> = new Map()

  /**
   * Generate OpenAPI document from Gello routes
   */
  static fromRoutes(
    routes: Route[],
    options: GeneratorOptions
  ): OpenAPIV3_1.Document {
    const generator = new OpenApiGenerator()

    const paths: OpenAPIV3_1.PathsObject = {}

    for (const route of routes) {
      const path = generator.convertPath(route.path)

      if (!paths[path]) {
        paths[path] = {}
      }

      paths[path][route.method.toLowerCase() as OpenAPIV3_1.HttpMethods] =
        generator.generateOperation(route)
    }

    return {
      openapi: '3.1.0',
      info: {
        title: options.title ?? 'API',
        version: options.version ?? '1.0.0',
        description: options.description,
      },
      servers: options.servers ?? [{ url: '/' }],
      paths,
      components: {
        schemas: Object.fromEntries(generator.schemas),
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          apiKey: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
          },
        },
      },
    }
  }

  /**
   * Convert Effect Schema to OpenAPI Schema
   */
  schemaToOpenApi(schema: S.Schema<any>): OpenAPIV3_1.SchemaObject {
    const ast = schema.ast
    return this.astToOpenApi(ast)
  }

  private astToOpenApi(ast: AST.AST): OpenAPIV3_1.SchemaObject {
    const annotations = AST.getAnnotation<Record<string, any>>(ast, 'openapi')

    switch (ast._tag) {
      case 'StringKeyword':
        return { type: 'string', ...annotations }

      case 'NumberKeyword':
        return { type: 'number', ...annotations }

      case 'BooleanKeyword':
        return { type: 'boolean', ...annotations }

      case 'Literal':
        return { enum: [ast.literal], ...annotations }

      case 'Union':
        // Handle Literal unions as enums
        const allLiterals = ast.types.every(t => t._tag === 'Literal')
        if (allLiterals) {
          return {
            enum: ast.types.map(t => (t as AST.Literal).literal),
            ...annotations,
          }
        }
        return {
          oneOf: ast.types.map(t => this.astToOpenApi(t)),
          ...annotations,
        }

      case 'TypeLiteral':
        const properties: Record<string, OpenAPIV3_1.SchemaObject> = {}
        const required: string[] = []

        for (const prop of ast.propertySignatures) {
          const key = String(prop.name)
          properties[key] = this.astToOpenApi(prop.type)

          if (!prop.isOptional) {
            required.push(key)
          }
        }

        return {
          type: 'object',
          properties,
          required: required.length > 0 ? required : undefined,
          ...annotations,
        }

      case 'TupleType':
        return {
          type: 'array',
          items: ast.elements.length === 1
            ? this.astToOpenApi(ast.elements[0].type)
            : { oneOf: ast.elements.map(e => this.astToOpenApi(e.type)) },
          ...annotations,
        }

      case 'Refinement':
        const base = this.astToOpenApi(ast.from)
        // Extract constraints from refinement
        return { ...base, ...annotations }

      case 'Transformation':
        return this.astToOpenApi(ast.to)

      default:
        return { type: 'object', ...annotations }
    }
  }

  private convertPath(path: string): string {
    // Convert :param to {param}
    return path.replace(/:(\w+)/g, '{$1}')
  }

  private generateOperation(route: Route): OpenAPIV3_1.OperationObject {
    const operation: OpenAPIV3_1.OperationObject = {
      summary: route.metadata?.summary,
      description: route.metadata?.description,
      tags: route.metadata?.tags,
      parameters: [],
      responses: {},
    }

    // Path parameters
    if (route.params) {
      const paramsSchema = this.schemaToOpenApi(route.params)
      if (paramsSchema.properties) {
        for (const [name, schema] of Object.entries(paramsSchema.properties)) {
          operation.parameters!.push({
            name,
            in: 'path',
            required: true,
            schema: schema as OpenAPIV3_1.SchemaObject,
          })
        }
      }
    }

    // Query parameters
    if (route.query) {
      const querySchema = this.schemaToOpenApi(route.query)
      if (querySchema.properties) {
        for (const [name, schema] of Object.entries(querySchema.properties)) {
          operation.parameters!.push({
            name,
            in: 'query',
            required: querySchema.required?.includes(name) ?? false,
            schema: schema as OpenAPIV3_1.SchemaObject,
          })
        }
      }
    }

    // Request body
    if (route.body) {
      operation.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: this.schemaToOpenApi(route.body),
          },
        },
      }
    }

    // Success response
    const successStatus = route.metadata?.successStatus ?? 200
    operation.responses[successStatus] = {
      description: 'Successful response',
      content: route.response
        ? {
            'application/json': {
              schema: this.schemaToOpenApi(route.response),
            },
          }
        : undefined,
    }

    // Error responses
    if (route.metadata?.errors) {
      for (const [status, errorSchema] of Object.entries(route.metadata.errors)) {
        operation.responses[status] = {
          description: `Error: ${status}`,
          content: {
            'application/json': {
              schema: this.schemaToOpenApi(errorSchema),
            },
          },
        }
      }
    }

    return operation
  }
}

interface GeneratorOptions {
  title?: string
  version?: string
  description?: string
  servers?: OpenAPIV3_1.ServerObject[]
}
```

#### 4.3.5 Hey API Configuration

```typescript
// libs/api-client/openapi-ts.config.ts
import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: '../api-spec/openapi.json',
  output: {
    path: 'src/generated',
    format: 'prettier',
    lint: 'eslint',
  },
  plugins: [
    {
      name: '@hey-api/schemas',
      type: 'effect', // Generate Effect schemas
    },
    {
      name: '@hey-api/sdk',
      asClass: false, // Use functions, not classes
    },
    {
      name: '@hey-api/types',
      enums: 'typescript',
      dates: true,
    },
  ],
})
```

#### 4.3.6 Effect Client Wrapper

```typescript
// libs/api-client/src/effect-client.ts
import { Effect, Context, Layer, Config } from 'effect'
import * as S from '@effect/schema/Schema'
import * as generated from './generated'

// API Client service
export class ApiClient extends Context.Tag('@app/ApiClient')<
  ApiClient,
  {
    readonly baseUrl: string
    readonly fetch: typeof fetch
    readonly getToken: () => Effect.Effect<string | undefined>
  }
>() {}

// Create layer with configuration
export const ApiClientLive = Layer.effect(
  ApiClient,
  Effect.gen(function* () {
    const baseUrl = yield* Config.string('API_URL').pipe(
      Config.withDefault('http://localhost:3000')
    )

    return {
      baseUrl,
      fetch: globalThis.fetch,
      getToken: () => Effect.succeed(undefined), // Override in auth context
    }
  })
)

// Effect-wrapped API functions
export const users = {
  list: () =>
    Effect.gen(function* () {
      const client = yield* ApiClient
      const response = yield* Effect.tryPromise({
        try: () => generated.getUsers({ baseUrl: client.baseUrl }),
        catch: (e) => new ApiError({ cause: e }),
      })
      return yield* S.decodeUnknown(S.Array(generated.UserSchema))(response)
    }),

  getById: (id: string) =>
    Effect.gen(function* () {
      const client = yield* ApiClient
      const response = yield* Effect.tryPromise({
        try: () => generated.getUserById({ baseUrl: client.baseUrl, path: { id } }),
        catch: (e) => new ApiError({ cause: e }),
      })
      return yield* S.decodeUnknown(generated.UserSchema)(response)
    }),

  create: (data: generated.CreateUser) =>
    Effect.gen(function* () {
      const client = yield* ApiClient
      const token = yield* client.getToken()
      const response = yield* Effect.tryPromise({
        try: () => generated.createUser({
          baseUrl: client.baseUrl,
          body: data,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        catch: (e) => new ApiError({ cause: e }),
      })
      return yield* S.decodeUnknown(generated.UserSchema)(response)
    }),
}

// Error types
export class ApiError extends Data.TaggedError('ApiError')<{
  cause: unknown
}> {}

export class NetworkError extends Data.TaggedError('NetworkError')<{
  message: string
}> {}

// Re-export types
export type { User, CreateUser, UpdateUser } from './generated'
```

#### 4.3.7 CLI Commands for Codegen

```typescript
// tools/cli/src/commands/openapi/generate.tsx
import { Box, Text, render } from 'ink'
import Spinner from 'ink-spinner'
import { Effect } from 'effect'
import { OpenApiGenerator } from '@gello/openapi'

export const GenerateOpenApiCommand = async () => {
  const app = render(<GeneratingOpenApi />)

  try {
    // Load routes from the API app
    const { routes } = await import(
      path.join(process.cwd(), 'apps/api/src/routes')
    )

    // Generate OpenAPI spec
    const spec = OpenApiGenerator.fromRoutes(routes, {
      title: 'API',
      version: '1.0.0',
    })

    // Write to file
    const outputPath = path.join(process.cwd(), 'libs/api-spec/openapi.json')
    fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2))

    app.rerender(<GenerationSuccess path={outputPath} />)
  } catch (error) {
    app.rerender(<GenerationError error={error} />)
    process.exit(1)
  }

  await app.waitUntilExit()
}

// tools/cli/src/commands/client/generate.tsx
export const GenerateClientCommand = async () => {
  const app = render(<GeneratingClient />)

  try {
    // Run Hey API codegen
    execSync('pnpm openapi-ts', {
      cwd: path.join(process.cwd(), 'libs/api-client'),
      stdio: 'inherit',
    })

    app.rerender(<ClientGenerationSuccess />)
  } catch (error) {
    app.rerender(<ClientGenerationError error={error} />)
    process.exit(1)
  }

  await app.waitUntilExit()
}
```

---

### 4.4 Feature Architecture

#### 4.4.1 Feature Library Structure

Features are organized as libraries that can contain platform-specific and shared code:

```
libs/
├── feature-notifications/
│   ├── frontend/                    # Web-specific code
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── NotificationBell.tsx
│   │   │   │   ├── NotificationList.tsx
│   │   │   │   └── NotificationToast.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useNotifications.ts
│   │   │   └── index.ts
│   │   ├── project.json
│   │   └── package.json
│   │
│   ├── backend/                     # API-specific code
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   └── notification.routes.ts
│   │   │   ├── services/
│   │   │   │   ├── NotificationService.ts
│   │   │   │   └── NotificationRepository.ts
│   │   │   ├── jobs/
│   │   │   │   └── SendNotificationJob.ts
│   │   │   └── index.ts
│   │   ├── project.json
│   │   └── package.json
│   │
│   ├── mobile/                      # React Native-specific code
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── NotificationBell.tsx
│   │   │   │   └── NotificationList.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useNotifications.ts
│   │   │   └── index.ts
│   │   ├── project.json
│   │   └── package.json
│   │
│   └── shared/                      # Cross-platform code
│       ├── src/
│       │   ├── schemas/
│       │   │   └── notification.ts  # Effect schemas
│       │   ├── types/
│       │   │   └── index.ts
│       │   ├── utils/
│       │   │   └── formatters.ts
│       │   └── index.ts
│       ├── project.json
│       └── package.json
```

#### 4.4.2 Feature Imports

```typescript
// apps/api/src/routes/index.ts
import { notificationRoutes } from '@my-app/feature-notifications/backend'
import { authRoutes } from '@my-app/feature-auth/backend'

export const routes = [
  ...authRoutes,
  ...notificationRoutes,
]

// apps/web/src/components/Header.tsx
import { NotificationBell } from '@my-app/feature-notifications/frontend'

export const Header = () => (
  <header>
    <NotificationBell />
  </header>
)

// apps/mobile/app/(tabs)/index.tsx
import { NotificationList } from '@my-app/feature-notifications/mobile'

export default function HomeScreen() {
  return <NotificationList />
}

// Shared schemas used everywhere
// libs/feature-notifications/backend/src/routes/notification.routes.ts
import { NotificationSchema } from '@my-app/feature-notifications/shared'
```

#### 4.4.3 Feature Generator Command

```bash
gello make:feature notifications

# Creates:
# ✓ libs/feature-notifications/frontend/
# ✓ libs/feature-notifications/backend/
# ✓ libs/feature-notifications/mobile/
# ✓ libs/feature-notifications/shared/
# ✓ Updated tsconfig.base.json paths
# ✓ Updated nx.json
```

```typescript
// tools/cli/src/commands/make/feature.tsx
export const MakeFeatureCommand = async (name: string, options: FeatureOptions) => {
  const featureName = `feature-${name}`
  const basePath = path.join(process.cwd(), 'libs', featureName)

  // Determine which subfolders to create
  const subfolders = ['shared'] // Always create shared

  if (options.frontend !== false) subfolders.push('frontend')
  if (options.backend !== false) subfolders.push('backend')
  if (options.mobile === true) subfolders.push('mobile')

  for (const folder of subfolders) {
    await createFeatureLib(basePath, folder, name)
  }

  // Update tsconfig.base.json
  await updateTsConfigPaths(featureName, subfolders)

  // Update nx.json implicit dependencies
  await updateNxConfig(featureName)
}
```

---

### 4.5 UI Libraries

#### 4.5.1 Web UI (shadcn/ui)

```
libs/ui/
├── src/
│   ├── components/
│   │   ├── ui/                      # shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (all shadcn components)
│   │   ├── composed/                # App-specific compositions
│   │   │   ├── DataTable.tsx
│   │   │   ├── FormField.tsx
│   │   │   └── PageHeader.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-toast.ts
│   │   └── use-media-query.ts
│   ├── lib/
│   │   └── utils.ts                 # cn() utility
│   └── index.ts
├── tailwind.config.ts
├── components.json                  # shadcn config
├── project.json
└── package.json
```

**shadcn Configuration:**

```json
// libs/ui/components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@my-app/ui/components",
    "utils": "@my-app/ui/lib/utils",
    "hooks": "@my-app/ui/hooks"
  }
}
```

**Usage in Web App:**

```typescript
// apps/web/src/components/UserForm.tsx
import { Button, Input, Form, FormField } from '@my-app/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateUserSchema } from '@my-app/contracts'

export const UserForm = () => {
  const form = useForm({
    resolver: zodResolver(CreateUserSchema),
  })

  return (
    <Form {...form}>
      <FormField name="email" render={({ field }) => (
        <Input type="email" placeholder="Email" {...field} />
      )} />
      <FormField name="name" render={({ field }) => (
        <Input placeholder="Name" {...field} />
      )} />
      <Button type="submit">Create User</Button>
    </Form>
  )
}
```

#### 4.5.2 Mobile UI (React Native Reusables)

```
libs/mobile-ui/
├── src/
│   ├── components/
│   │   ├── primitives/              # Base components
│   │   │   ├── Button.tsx
│   │   │   ├── Text.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   ├── composed/                # Complex components
│   │   │   ├── FormField.tsx
│   │   │   ├── ListItem.tsx
│   │   │   └── BottomSheet.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useColorScheme.ts
│   │   └── useHaptics.ts
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   └── typography.ts
│   └── index.ts
├── project.json
└── package.json
```

**Mobile Component Example:**

```typescript
// libs/mobile-ui/src/components/primitives/Button.tsx
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { useColorScheme } from '../hooks/useColorScheme'
import { colors } from '../theme/colors'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onPress?: () => void
  disabled?: boolean
  children: string
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  onPress,
  disabled,
  children,
}: ButtonProps) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const buttonStyle: ViewStyle = {
    ...styles.base,
    ...styles[size],
    ...getVariantStyle(variant, isDark),
    ...(disabled && styles.disabled),
  }

  return (
    <Pressable
      style={({ pressed }) => [buttonStyle, pressed && styles.pressed]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={getTextStyle(variant, isDark)}>{children}</Text>
    </Pressable>
  )
}
```

---

### 4.6 CLI Commands

#### 4.6.1 Command Overview

| Command | Description | Alias |
|---------|-------------|-------|
| `gello new <name>` | Create new project via wizard | - |
| `gello add <type>` | Add app/feature to existing project | - |
| `gello serve [app]` | Start development servers | `gello dev` |
| `gello build [app]` | Build for production | - |
| `gello openapi:generate` | Generate OpenAPI spec from routes | - |
| `gello client:generate` | Generate TypeScript client from spec | - |
| `gello make:feature <name>` | Create feature library | - |
| `gello make:route <name>` | Create route file | - |
| `gello make:service <name>` | Create service file | - |
| `gello make:job <name>` | Create queue job | - |
| `gello queue:work` | Start queue worker | - |
| `gello route:list` | Display registered routes | `gello routes` |

#### 4.6.2 `gello serve` Command

```typescript
// tools/cli/src/commands/serve.tsx
interface ServeOptions {
  app?: string
  port?: number
  host?: string
}

export const ServeCommand = async (options: ServeOptions) => {
  const { app } = options

  // Detect project type
  const projectConfig = await loadProjectConfig()

  if (!projectConfig.isNxWorkspace) {
    // Legacy single-app project
    return serveSingleApp(options)
  }

  // NX workspace - determine what to serve
  const apps = await getAvailableApps()

  if (app) {
    // Serve specific app
    if (!apps.includes(app)) {
      throw new Error(`App "${app}" not found. Available: ${apps.join(', ')}`)
    }
    return serveNxApp(app, options)
  }

  // Serve all apps
  return serveAllApps(apps, options)
}

const serveNxApp = async (app: string, options: ServeOptions) => {
  const command = `nx run ${app}:dev`

  const child = spawn('pnpm', ['exec', ...command.split(' ')], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: String(options.port ?? getDefaultPort(app)),
    },
  })

  return child
}

const serveAllApps = async (apps: string[], options: ServeOptions) => {
  // Use nx run-many for parallel execution
  const command = `nx run-many -t dev --projects=${apps.join(',')}`

  const child = spawn('pnpm', ['exec', ...command.split(' ')], {
    stdio: 'inherit',
  })

  return child
}

const getDefaultPort = (app: string): number => {
  const portMap: Record<string, number> = {
    api: 3000,
    web: 5173,
    mobile: 8081,
    'queue-worker': 3001,
  }
  return portMap[app] ?? 3000
}
```

#### 4.6.3 `gello add` Command

```bash
# Add web app to existing API-only project
gello add web --framework tanstack-router

# Add mobile app
gello add mobile --framework expo

# Add queue worker
gello add queue-worker

# Add feature
gello add feature auth
```

```typescript
// tools/cli/src/commands/add.tsx
type AddType = 'web' | 'mobile' | 'queue-worker' | 'feature'

interface AddOptions {
  framework?: 'tanstack-router' | 'tanstack-start' | 'nextjs' | 'expo'
  name?: string
}

export const AddCommand = async (type: AddType, options: AddOptions) => {
  // Verify we're in a Gello NX workspace
  const projectConfig = await loadProjectConfig()

  if (!projectConfig.isNxWorkspace) {
    throw new Error(
      'This command requires an NX workspace. ' +
      'Create one with: gello new my-app'
    )
  }

  switch (type) {
    case 'web':
      return addWebApp(options)
    case 'mobile':
      return addMobileApp(options)
    case 'queue-worker':
      return addQueueWorker()
    case 'feature':
      return addFeature(options.name!)
  }
}

const addWebApp = async (options: AddOptions) => {
  const framework = options.framework ?? await promptFramework()

  const steps = [
    { name: 'Create apps/web directory', fn: () => createWebApp(framework) },
    { name: 'Install dependencies', fn: () => installDeps(framework) },
    { name: 'Create libs/ui', fn: () => createUiLib() },
    { name: 'Configure shadcn/ui', fn: () => configureShadcn() },
    { name: 'Set up API client', fn: () => configureApiClient('web') },
    { name: 'Update nx.json', fn: () => updateNxConfig() },
  ]

  await runSteps(steps)
}
```

---

## 5. Technical Architecture

### 5.1 Package Dependencies

```
┌─────────────────────────────────────────────────────────────────────┐
│                         apps/web                                    │
│  TanStack Router / TanStack Start / Next.js                        │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ imports
┌───────────────────────────▼─────────────────────────────────────────┐
│                       libs/ui                                       │
│  shadcn/ui components                                              │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ imports
┌───────────────────────────▼─────────────────────────────────────────┐
│                    libs/api-client                                  │
│  Effect-wrapped TypeScript client (from Hey API)                   │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ generated from
┌───────────────────────────▼─────────────────────────────────────────┐
│                    libs/api-spec                                    │
│  openapi.json (generated from routes)                              │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ generated from
┌───────────────────────────▼─────────────────────────────────────────┐
│                      apps/api                                       │
│  Gello routes with @effect/schema                                  │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ imports
┌───────────────────────────▼─────────────────────────────────────────┐
│                    libs/contracts                                   │
│  Shared schemas & types (@effect/schema)                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Build Pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  contracts  │────▶│    api      │────▶│  api-spec   │────▶│ api-client  │
│   (build)   │     │   (build)   │     │ (generate)  │     │ (generate)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                    ┌──────────────────────────────────────────────┘
                    ▼
             ┌─────────────┐     ┌─────────────┐
             │     web     │     │   mobile    │
             │   (build)   │     │   (build)   │
             └─────────────┘     └─────────────┘
```

### 5.3 Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Monorepo Tool** | NX | Mature, excellent caching, generator ecosystem |
| **Package Manager** | pnpm | Workspace protocol, disk efficiency |
| **OpenAPI Version** | 3.1 | JSON Schema compatibility, better tooling |
| **Client Generator** | Hey API | Effect Schema support, modern TypeScript |
| **Web UI** | shadcn/ui | Customizable, not a dependency |
| **Mobile UI** | Custom primitives | React Native has different needs |
| **State Management** | TanStack Query + Effect | Async state + Effect composition |

---

## 6. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

**Goal:** Core wizard and API-only scaffolding

| Task | Priority | Complexity |
|------|----------|------------|
| Wizard UI components (Ink) | P0 | Medium |
| Project type selection step | P0 | Low |
| Infrastructure config step | P0 | Medium |
| Feature selection step | P0 | Medium |
| API-only scaffolding | P0 | Low |
| NX workspace initialization | P0 | Medium |
| `libs/contracts` generation | P0 | Low |

**Deliverable:** `gello new my-app` → working API with NX structure

### Phase 2: OpenAPI & Codegen (Weeks 3-4)

**Goal:** End-to-end type-safe API client generation

| Task | Priority | Complexity |
|------|----------|------------|
| OpenAPI generator from Effect schemas | P0 | High |
| Route metadata API (tags, summary, etc.) | P0 | Medium |
| Hey API integration | P1 | Medium |
| Effect client wrapper | P1 | Medium |
| `gello openapi:generate` command | P0 | Low |
| `gello client:generate` command | P1 | Low |
| `libs/api-spec` structure | P0 | Low |
| `libs/api-client` structure | P1 | Low |

**Deliverable:** Routes → OpenAPI → TypeScript client pipeline

### Phase 3: Web Frontends (Weeks 5-6)

**Goal:** Full-stack React applications

| Task | Priority | Complexity |
|------|----------|------------|
| TanStack Router scaffolding | P0 | Medium |
| TanStack Start scaffolding | P1 | Medium |
| Next.js scaffolding | P1 | Medium |
| `libs/ui` with shadcn setup | P1 | Medium |
| API client integration in web apps | P0 | Low |
| `gello add web` command | P1 | Medium |
| Example todo app (full-stack) | P1 | Medium |

**Deliverable:** `gello new my-app` with web frontend options

### Phase 4: Mobile & Features (Weeks 7-8)

**Goal:** Expo support and feature architecture

| Task | Priority | Complexity |
|------|----------|------------|
| Expo scaffolding | P2 | High |
| `libs/mobile-ui` primitives | P2 | Medium |
| Feature library structure | P1 | Medium |
| `gello make:feature` command | P1 | Low |
| `gello add mobile` command | P2 | Medium |
| Cross-platform feature example | P2 | Medium |

**Deliverable:** Full mobile support and feature organization

### Phase 5: Polish & Documentation (Weeks 9-10)

**Goal:** Production-ready experience

| Task | Priority | Complexity |
|------|----------|------------|
| Queue worker app scaffolding | P2 | Low |
| `gello serve` multi-app support | P1 | Medium |
| Auto-serve after scaffold | P2 | Low |
| Documentation updates | P0 | Medium |
| Example applications | P1 | Medium |
| Error handling & edge cases | P0 | Medium |
| Performance optimization | P2 | Low |

**Deliverable:** Complete, documented CLI experience

---

## 7. Success Metrics

### 7.1 Quantitative Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to first route | < 5 minutes | From `gello new` to running API |
| Time to full-stack | < 10 minutes | API + Web with shared types |
| Wizard completion rate | > 90% | Users who finish all steps |
| CLI command success rate | > 95% | Commands that don't error |
| Generated project build success | 100% | All scaffolded projects build |

### 7.2 Qualitative Metrics

- Developer satisfaction surveys (post-scaffold)
- GitHub issues related to scaffolding
- Community feedback on Discord/GitHub Discussions
- Comparison benchmarks vs. other scaffolding tools

---

## 8. Open Questions

### 8.1 Technical

1. **Q:** Should OpenAPI spec be generated at build time or serve time?
   **Recommendation:** Build time - enables caching and version control

2. **Q:** How to handle API versioning in OpenAPI spec?
   **Recommendation:** Version in path prefix (`/api/v1/`) + separate spec files

3. **Q:** Should we support Yarn/Bun workspaces or pnpm only?
   **Recommendation:** Support all three, default to pnpm

4. **Q:** How to handle migrations in scaffolded projects?
   **Recommendation:** Include Drizzle migrations setup, document workflow

### 8.2 Product

1. **Q:** Should we include example data/seed scripts?
   **Recommendation:** Yes, with a working todo example

2. **Q:** How opinionated should the folder structure be?
   **Recommendation:** Opinionated by default, document escape hatches

3. **Q:** Should we include testing setup (Vitest) in scaffold?
   **Recommendation:** Yes, with example tests

4. **Q:** Include CI/CD templates (GitHub Actions)?
   **Recommendation:** Optional flag, not by default

---

## 9. Appendices

### 9.1 Appendix A: Full Wizard State Machine

```typescript
type WizardStep =
  | { type: 'project-type' }
  | { type: 'infrastructure' }
  | { type: 'features' }
  | { type: 'package-manager' }
  | { type: 'creating'; progress: number }
  | { type: 'complete' }
  | { type: 'error'; error: Error }

type WizardEvent =
  | { type: 'SELECT_PROJECT_TYPE'; projectType: ProjectType }
  | { type: 'CONFIGURE_INFRASTRUCTURE'; config: InfrastructureConfig }
  | { type: 'SELECT_FEATURES'; features: FeatureFlags }
  | { type: 'SELECT_PACKAGE_MANAGER'; pm: PackageManager }
  | { type: 'BACK' }
  | { type: 'CREATION_PROGRESS'; progress: number }
  | { type: 'CREATION_COMPLETE' }
  | { type: 'CREATION_ERROR'; error: Error }
```

### 9.2 Appendix B: Generated File Templates

See `tools/cli/src/templates/` for all file templates used in scaffolding.

### 9.3 Appendix C: Dependency Versions

```json
{
  "effect": "^3.19.0",
  "@effect/schema": "^0.75.0",
  "nx": "^20.0.0",
  "@tanstack/react-router": "^1.80.0",
  "@tanstack/start": "^1.80.0",
  "next": "^15.0.0",
  "expo": "^52.0.0",
  "vite": "^6.0.0",
  "@hey-api/openapi-ts": "^0.50.0"
}
```

### 9.4 Appendix D: Related Documentation

- [Gello Core Documentation](https://gello.net/docs)
- [Effect Documentation](https://effect.website/docs)
- [NX Documentation](https://nx.dev/getting-started/intro)
- [Hey API Documentation](https://heyapi.dev/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Expo Documentation](https://docs.expo.dev/)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-30 | Gello Team | Initial draft |

---

*End of PRD*
