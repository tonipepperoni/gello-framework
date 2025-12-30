# Documentation Restructure Plan

## Philosophy

Following Laravel's documentation approach:

1. **Simple language** - No "hexagonal DDD", "ports and adapters", "domain-driven". Just explain what things do.
2. **Progressive disclosure** - Start with the simplest use case, add complexity gradually
3. **Practical examples** - Every concept has runnable code
4. **Task-oriented** - Organize by what developers want to accomplish, not internal architecture
5. **Reassuring tone** - "Gello handles this for you", "sensible defaults"

## Current Structure (Problems)

```
Introduction         <- Too much architecture jargon
Installation
---Getting Started---
Configuration
Directory Structure
---Core Concepts---
Dependency Injection <- Effect-specific, intimidating
HTTP
Routing
Middleware
Validation
Error Handling
---Features---
Database
Storage
Queues
Mail
Authentication       <- Just added, very detailed but complex
Caching
Logger
Time
---Tools---
CLI
```

**Issues:**
- "Core Concepts" section is intimidating (DI, error handling as concepts)
- "Dependency Injection" page scares off non-FP developers
- Authentication page uses terms like "hexagonal DDD architecture"
- Missing: Getting started tutorial, common recipes
- Too much "how it works internally" vs "how to use it"

## New Structure

```
Prologue
├── Introduction              <- What is Gello? Why use it?
├── Installation              <- Get running in 2 minutes
└── Releases                  <- Version history (future)

Getting Started
├── Your First App            <- NEW: Build something in 10 min
├── Configuration             <- Environment, .env files
├── Directory Structure       <- Where things go
└── Deployment                <- NEW: Production checklist

The Basics
├── Routing                   <- Define URLs and handlers
├── Middleware                <- Before/after request processing
├── Controllers               <- NEW: Organizing handlers (optional pattern)
├── Requests                  <- NEW: Accessing request data
├── Responses                 <- NEW: Returning data
├── Validation                <- Validating input
└── Error Handling            <- What happens when things fail

Security
├── Authentication            <- Tokens, sessions, login
├── Authorization             <- Who can do what (gates, abilities)
└── OAuth                     <- NEW: Social login (GitHub, Google)

Database
├── Getting Started           <- NEW: Connect and query
├── Query Builder             <- Building queries (if applicable)
└── Migrations                <- Schema changes

Features
├── Caching                   <- Speed up with cache
├── Mail                      <- Sending emails
├── Queues                    <- Background jobs
├── Storage                   <- Files and uploads
└── Logging                   <- Application logs

Testing
├── Getting Started           <- NEW: Writing your first test
├── HTTP Tests                <- NEW: Testing routes
└── Mocking                   <- NEW: Replacing services in tests

Packages (Advanced)
├── Effect Primer             <- NEW: Just enough Effect to be productive
├── Services & Layers         <- NEW: Replaces "Dependency Injection"
├── Building Packages         <- NEW: Creating reusable libraries
└── CLI Reference             <- All CLI commands
```

## Page-by-Page Plan

### Prologue

#### Introduction (Rewrite)
**Remove:**
- Architecture diagram with "Edge", "Application Layer", "Service Layer", "Infrastructure Layer"
- "program = value, interpret at the edge"
- "No Module Abstraction: Just compose Layers"
- "Scoped Resources", "Layer.scoped", "acquireRelease"

**Keep/Add:**
- What Gello is (1 paragraph)
- Why Gello? (bullet points: type safety, Laravel-like DX, modern TypeScript)
- Quick code example (simplified - just a route returning JSON)
- Packages table (keep but simplify descriptions)

**Tone shift:**
```diff
- Built on Effect and @effect/platform, Gello follows the principle: program = value, interpret at the edge.
+ Gello gives you the developer experience of Laravel with TypeScript's type safety.
```

#### Installation (Simplify)
Keep the quick start steps. Add:
- Requirements (Node 20+, pnpm)
- What you get after `npx gello new`

---

### Getting Started

#### Your First App (NEW)
Build a simple API in 10 minutes:
1. Create project
2. Define a route
3. Add a service (fetching data)
4. Return JSON
5. Run and test with curl

No Effect theory - just "here's how you do X".

#### Configuration (Rewrite)
**Remove:**
- Deep dives into ConfigService internals
- Layer composition details

**Add:**
- .env file basics
- Accessing config values (`yield* Config`, `Config.string("APP_NAME")`)
- Environment detection (`Config.isProduction()`)
- Common config patterns (database, redis, mail)

#### Directory Structure (Keep, minor edits)
- Explain what each folder is for
- Don't explain internal library structure

#### Deployment (NEW)
- Environment variables for production
- Running in production mode
- Health checks
- Common platforms (Docker, Vercel, Railway)

---

### The Basics

#### Routing (Rewrite partially)
**Keep:**
- Route builders (`route.get`, `route.post`, etc.)
- Route parameters
- Query parameters
- Route groups (newly documented)

**Remove:**
- Detailed type annotations showing Effect generics
- Internal routing mechanics

**Add:**
- Named routes (if supported)
- Redirect routes
- Fallback/404 handling

#### Middleware (Rewrite)
**Keep:**
- Built-in middleware (CORS, logging, timing)
- Custom middleware example

**Simplify:**
- Remove middleware composition internals
- Focus on: "wrap your handler to add behavior"

#### Controllers (NEW)
Show the optional pattern of grouping related handlers:
```typescript
// Optional organizational pattern
export const UserController = {
  index: Effect.gen(function* () { ... }),
  show: Effect.gen(function* () { ... }),
  store: Effect.gen(function* () { ... }),
}
```

#### Requests (NEW)
- Getting the request object
- Headers, body, query params
- JSON body parsing
- File uploads (if supported)

#### Responses (NEW)
- `HttpServerResponse.json()`
- `HttpServerResponse.text()`
- Status codes
- Headers
- Redirects
- Downloads/streaming

#### Validation (Rewrite)
**Simplify:**
- Show schema validation with `@effect/schema`
- Show accumulated validation
- Remove deep FP explanations

#### Error Handling (Rewrite)
**Focus on:**
- How errors become HTTP responses
- Custom error responses
- Logging errors

**Remove:**
- Tagged error theory
- Match.value patterns (show simpler if/else first)

---

### Security

#### Authentication (Major Rewrite)
**Current problems:**
- "hexagonal DDD architecture"
- "ports and adapters"
- Complex package breakdown

**New structure:**
1. **Token Authentication** - Protect API routes
2. **Creating Tokens** - Generate tokens for users
3. **Token Abilities** - Scope what tokens can do
4. **Sessions** - Cookie-based auth for SPAs
5. **Password Hashing** - Secure password storage

**Remove:**
- Package architecture section
- "Ports" and "Services" breakdown
- Implementation details about drivers

#### Authorization (Rewrite from scratch)
Currently buried in Authentication page. Make standalone:
1. **Defining Abilities** - `defineAbilitiesFor(user, ...)`
2. **Checking Permissions** - `can()`, `cannot()`
3. **Middleware Guards** - `authorize()` middleware
4. **Common Patterns** - Own-resource access, admin checks

#### OAuth / Social Login (NEW - extracted)
1. **Configuration** - Set up GitHub/Google credentials
2. **Redirect to Provider** - Start OAuth flow
3. **Handle Callback** - Get user info
4. **Custom Providers** - Extend for other services

---

### Database

#### Getting Started (NEW)
- Configure database connection
- Make your first query
- Using with Drizzle ORM

#### Query Builder
- Basic queries
- Joins, where clauses
- Pagination

#### Migrations
- Creating migrations
- Running migrations
- Rollback

---

### Features

#### Caching (Rewrite)
**Simplify to Laravel-style:**
```typescript
// Get
const value = yield* Cache.get("key")

// Store
yield* Cache.put("key", value, Duration.minutes(10))

// Remember (get or compute)
const users = yield* Cache.remember("users", Duration.hours(1), () =>
  fetchUsers()
)
```

#### Mail (Keep, simplify)
- Keep the good structure
- Remove "Mailable contract" terminology
- Focus on: send an email, use a template, queue emails

#### Queues (Keep, simplify)
- Keep the good structure
- Remove "hexagonal" mentions
- Focus on: define a job, dispatch it, process it

#### Storage (Rewrite)
**Simplify:**
```typescript
// Store a file
yield* Storage.put("avatars/user-1.jpg", fileContents)

// Get a file
const contents = yield* Storage.get("avatars/user-1.jpg")

// Generate URL
const url = yield* Storage.temporaryUrl("avatars/user-1.jpg", Duration.hours(1))
```

#### Logging
- Log levels
- Configuring outputs
- Contextual logging

---

### Testing

#### Getting Started (NEW)
- Setting up Vitest
- Running tests
- Test layers

#### HTTP Tests (NEW)
- Testing routes
- Making requests
- Asserting responses

#### Mocking (NEW)
- Replacing services
- Test doubles
- In-memory drivers

---

### Packages (Advanced)

#### Effect Primer (NEW)
**For developers new to Effect:**
- What is Effect? (2 paragraphs max)
- `Effect.gen` and `yield*`
- Services and `Context.Tag`
- Layers (just enough to use the framework)
- Error handling basics

This replaces intimidating "Dependency Injection" page.

#### Services & Layers (Rewrite of DI page)
**For when you need to create your own services:**
- Defining a service
- Creating a layer
- Providing to your app
- Testing with mock layers

#### Building Packages
- Creating a library
- Exporting from a package
- Versioning

#### CLI Reference
- All commands with examples
- `gello new`
- `gello serve`
- `gello route:list`

---

## Writing Guidelines

### Do
- Start with the simplest example
- Show real, runnable code
- Use "you" and "your"
- Explain what code does, line by line when needed
- Provide copy-paste examples

### Don't
- Use architecture jargon (hexagonal, DDD, ports, adapters)
- Show complex type signatures unless necessary
- Explain internal implementation
- Assume FP knowledge
- Use "we" (use "Gello" or "you" instead)

### Terminology Mapping
| Instead of | Use |
|------------|-----|
| Port | Interface / Contract |
| Adapter | Driver / Implementation |
| Domain | (just describe what it does) |
| Hexagonal | (don't mention) |
| DDD | (don't mention) |
| Layer | Layer (but explain simply) |
| Context.Tag | Service |
| yield* | (show in code, explain as "get the value") |

---

## Implementation Order

1. **Phase 1: Core rewrites**
   - [ ] Introduction
   - [ ] Installation
   - [ ] Your First App (NEW)
   - [ ] Routing
   - [ ] Middleware

2. **Phase 2: Basics**
   - [ ] Requests (NEW)
   - [ ] Responses (NEW)
   - [ ] Validation
   - [ ] Error Handling
   - [ ] Configuration

3. **Phase 3: Security**
   - [ ] Authentication (major rewrite)
   - [ ] Authorization (extract from auth)
   - [ ] OAuth (extract from auth)

4. **Phase 4: Features**
   - [ ] Caching
   - [ ] Mail
   - [ ] Queues
   - [ ] Storage
   - [ ] Logging

5. **Phase 5: Database & Testing**
   - [ ] Database Getting Started
   - [ ] Testing Getting Started
   - [ ] HTTP Tests
   - [ ] Mocking

6. **Phase 6: Advanced**
   - [ ] Effect Primer
   - [ ] Services & Layers
   - [ ] CLI Reference
   - [ ] Deployment

---

## File Changes Summary

### New Files
- `your-first-app.mdx`
- `deployment.mdx`
- `controllers.mdx`
- `requests.mdx`
- `responses.mdx`
- `authorization.mdx`
- `oauth.mdx`
- `database/index.mdx` (or `database-getting-started.mdx`)
- `testing/index.mdx`
- `testing/http-tests.mdx`
- `testing/mocking.mdx`
- `effect-primer.mdx`
- `services-and-layers.mdx`

### Major Rewrites
- `index.mdx` (introduction)
- `routing.mdx`
- `middleware.mdx`
- `authentication.mdx`
- `validation.mdx`
- `error-handling.mdx`
- `caching.mdx`
- `storage.mdx`

### Delete/Rename
- `dependency-injection.mdx` → `services-and-layers.mdx`
- `http.mdx` → split into `requests.mdx` + `responses.mdx`

### Navigation Update
- `meta.json` - new structure
- `source.ts` - new page tree
