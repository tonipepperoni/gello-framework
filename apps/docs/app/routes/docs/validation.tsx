import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock } from '../../components';

export const Route = createFileRoute('/docs/validation')({
  component: ValidationPage,
});

function ValidationPage() {
  return (
    <DocsContent
      title="Validation"
      description="Type-safe validation with @effect/schema — validate once, trust everywhere"
    >
      <h2>Schema Definitions</h2>
      <p>
        Define schemas that serve as both runtime validators and TypeScript types.
        No duplicate type definitions needed.
      </p>

      <CodeBlock code={`import * as S from "@effect/schema/Schema"

// Define a schema
const CreateUser = S.Struct({
  name: S.String.pipe(S.minLength(2), S.maxLength(100)),
  email: S.String.pipe(S.pattern(/@/)),
  age: S.optional(S.Number.pipe(S.int(), S.positive()))
})

// Infer the type
type CreateUser = S.Schema.Type<typeof CreateUser>
// { name: string; email: string; age?: number }`} />

      <h2>Request Body Validation</h2>
      <CodeBlock code={`import * as HttpServerRequest from "@effect/platform/HttpServerRequest"

HttpRouter.post("/users", Effect.gen(function* () {
  // Validates and decodes — fails with ParseError on bad input
  const body = yield* HttpServerRequest.schemaBodyJson(CreateUser)

  // body is fully typed as CreateUser
  const repo = yield* UserRepo
  const user = yield* repo.create(body)

  return HttpServerResponse.json(user, { status: 201 })
}))`} />

      <h2>Path Parameters</h2>
      <CodeBlock code={`const UserIdParam = S.Struct({
  id: S.String.pipe(S.pattern(/^[a-f0-9-]{36}$/)) // UUID format
})

HttpRouter.get("/users/:id", Effect.gen(function* () {
  const { id } = yield* HttpRouter.schemaPathParams(UserIdParam)

  const repo = yield* UserRepo
  const user = yield* repo.findById(id)

  if (!user) {
    return HttpServerResponse.empty({ status: 404 })
  }

  return HttpServerResponse.json(user)
}))`} />

      <h2>Query Parameters</h2>
      <CodeBlock code={`const PaginationQuery = S.Struct({
  page: S.optional(S.NumberFromString).pipe(S.withDefault(() => 1)),
  limit: S.optional(S.NumberFromString).pipe(S.withDefault(() => 20)),
  sort: S.optional(S.Literal("asc", "desc")).pipe(S.withDefault(() => "desc" as const))
})

HttpRouter.get("/users", Effect.gen(function* () {
  const query = yield* HttpRouter.schemaSearchParams(PaginationQuery)
  // query: { page: number; limit: number; sort: "asc" | "desc" }

  const repo = yield* UserRepo
  const users = yield* repo.list(query)

  return HttpServerResponse.json(users)
}))`} />

      <h2>Response Validation</h2>
      <CodeBlock code={`const UserResponse = S.Struct({
  id: S.String,
  name: S.String,
  email: S.String,
  createdAt: S.Date
})

HttpRouter.get("/users/:id", Effect.gen(function* () {
  const { id } = yield* HttpRouter.schemaPathParams(S.Struct({ id: S.String }))

  const repo = yield* UserRepo
  const user = yield* repo.findById(id)

  if (!user) {
    return HttpServerResponse.empty({ status: 404 })
  }

  // Type-checked: response must match UserResponse schema
  return yield* HttpServerResponse.schemaJson(UserResponse)(user)
}))`} />

      <h2>Custom Validators</h2>
      <CodeBlock code={`// Email with custom validation
const Email = S.String.pipe(
  S.filter((s) => s.includes("@") && s.includes("."), {
    message: () => "Invalid email format"
  })
)

// Password with strength requirements
const Password = S.String.pipe(
  S.minLength(8),
  S.filter((s) => /[A-Z]/.test(s), {
    message: () => "Must contain uppercase letter"
  }),
  S.filter((s) => /[0-9]/.test(s), {
    message: () => "Must contain number"
  })
)

// Slug format
const Slug = S.String.pipe(
  S.pattern(/^[a-z0-9-]+$/),
  S.minLength(3),
  S.maxLength(50)
)`} />

      <h2>Transformations</h2>
      <CodeBlock code={`// Transform on decode
const TrimmedString = S.String.pipe(
  S.transform(S.String, {
    decode: (s) => s.trim(),
    encode: (s) => s
  })
)

// Date from ISO string
const DateFromString = S.String.pipe(
  S.transform(S.Date, {
    decode: (s) => new Date(s),
    encode: (d) => d.toISOString()
  })
)

// Or use built-in
import { S.DateFromString } from "@effect/schema/Schema"`} />

      <h2>Error Handling</h2>
      <CodeBlock code={`HttpRouter.post("/users", Effect.gen(function* () {
  const body = yield* HttpServerRequest.schemaBodyJson(CreateUser)
  // ...
}).pipe(
  Effect.catchTag("ParseError", (e) =>
    HttpServerResponse.json(
      {
        error: "Validation failed",
        details: ArrayFormatter.formatErrorSync(e)
      },
      { status: 400 }
    )
  )
))`} />

      <h2>Reusable Schemas</h2>
      <CodeBlock code={`// schemas/user.ts
export const UserBase = S.Struct({
  name: S.String.pipe(S.minLength(2)),
  email: Email
})

export const CreateUser = UserBase.pipe(
  S.extend(S.Struct({
    password: Password
  }))
)

export const UpdateUser = S.partial(UserBase)

export const User = UserBase.pipe(
  S.extend(S.Struct({
    id: S.String,
    createdAt: S.Date,
    updatedAt: S.Date
  }))
)`} />
    </DocsContent>
  );
}
