import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock, type TOCItem } from '../../components';
import { getPageNavigation } from '../../lib/source';

export const Route = createFileRoute('/docs/error-handling')({
  component: ErrorHandlingPage,
});

const toc: TOCItem[] = [
  { title: 'Tagged Errors', url: '#tagged-errors', depth: 2 },
  { title: 'Throwing Errors', url: '#throwing-errors', depth: 2 },
  { title: 'Catching by Tag', url: '#catching-by-tag', depth: 2 },
  { title: 'Catching Multiple Errors', url: '#catching-multiple-errors', depth: 2 },
  { title: 'Global Error Handler', url: '#global-error-handler', depth: 2 },
  { title: 'Error Context', url: '#error-context', depth: 2 },
  { title: 'Retry on Failure', url: '#retry-on-failure', depth: 2 },
  { title: 'Effect.catchIf', url: '#effect-catchif', depth: 2 },
  { title: 'Parse Errors', url: '#parse-errors', depth: 2 },
];

function ErrorHandlingPage() {
  const footer = getPageNavigation('/docs/error-handling');

  return (
    <DocsContent
      title="Error Handling"
      description="Typed errors with Effect — catch at boundaries, never lose context"
      toc={toc}
      footer={footer}
    >
      <h2 id="tagged-errors">Tagged Errors</h2>
      <p>
        Define domain errors as tagged classes. The type system tracks which errors
        can occur and ensures they're handled.
      </p>

      <CodeBlock code={`import { Data } from "effect"

class NotFoundError extends Data.TaggedError("NotFoundError")<{
  resource: string
  id: string
}> {}

class ValidationError extends Data.TaggedError("ValidationError")<{
  field: string
  message: string
}> {}

class UnauthorizedError extends Data.TaggedError("UnauthorizedError")<{
  reason: string
}> {}`} />

      <h2 id="throwing-errors">Throwing Errors</h2>
      <CodeBlock code={`const getUser = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* UserRepo
    const user = yield* repo.findById(id)

    if (!user) {
      return yield* new NotFoundError({ resource: "User", id })
    }

    return user
  })

// Type: Effect<User, NotFoundError, UserRepo>`} />

      <h2 id="catching-by-tag">Catching by Tag</h2>
      <CodeBlock code={`HttpRouter.get("/users/:id", Effect.gen(function* () {
  const { id } = yield* HttpRouter.schemaPathParams(S.Struct({ id: S.String }))
  const user = yield* getUser(id)
  return HttpServerResponse.json(user)
}).pipe(
  Effect.catchTag("NotFoundError", (e) =>
    HttpServerResponse.json(
      { error: \`\${e.resource} with id \${e.id} not found\` },
      { status: 404 }
    )
  )
))`} />

      <h2 id="catching-multiple-errors">Catching Multiple Errors</h2>
      <CodeBlock code={`import { Match } from "effect"

type AppError = NotFoundError | ValidationError | UnauthorizedError

const handleError = (error: AppError) =>
  Match.value(error).pipe(
    Match.tag("NotFoundError", (e) =>
      HttpServerResponse.json(
        { error: \`\${e.resource} not found\` },
        { status: 404 }
      )
    ),
    Match.tag("ValidationError", (e) =>
      HttpServerResponse.json(
        { error: e.message, field: e.field },
        { status: 400 }
      )
    ),
    Match.tag("UnauthorizedError", (e) =>
      HttpServerResponse.json(
        { error: e.reason },
        { status: 401 }
      )
    ),
    Match.exhaustive
  )

// Apply to handler
handler.pipe(Effect.catchAll(handleError))`} />

      <h2 id="global-error-handler">Global Error Handler</h2>
      <CodeBlock code={`const withErrorHandler = <R>(
  handler: Effect.Effect<HttpServerResponse.HttpServerResponse, AppError, R>
) =>
  pipe(
    handler,
    Effect.catchAll(handleError),
    Effect.catchAllDefect((defect) => {
      // Log unexpected errors
      console.error("Unexpected error:", defect)
      return HttpServerResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    })
  )

// Wrap all route handlers
export const routes = [
  route.get("/users/:id", withErrorHandler(getUser)),
  route.post("/users", withErrorHandler(createUser)),
] as const`} />

      <h2 id="error-context">Error Context</h2>
      <CodeBlock code={`// Add context to errors
const getUserWithContext = (id: string) =>
  getUser(id).pipe(
    Effect.mapError((e) =>
      e._tag === "NotFoundError"
        ? new NotFoundError({ ...e, resource: "User" })
        : e
    ),
    Effect.withSpan("getUser", { attributes: { userId: id } })
  )`} />

      <h2 id="retry-on-failure">Retry on Failure</h2>
      <CodeBlock code={`import { Schedule } from "effect"

const fetchWithRetry = Effect.gen(function* () {
  const response = yield* Effect.tryPromise({
    try: () => fetch("https://api.example.com/data"),
    catch: () => new NetworkError({ url: "..." })
  })
  return yield* Effect.tryPromise(() => response.json())
}).pipe(
  Effect.retry(
    Schedule.exponential("100 millis").pipe(
      Schedule.compose(Schedule.recurs(3))
    )
  ),
  Effect.catchTag("NetworkError", () =>
    Effect.succeed({ fallback: true })
  )
)`} />

      <h2 id="effect-catchif">Effect.catchIf</h2>
      <CodeBlock code={`// Catch errors conditionally
handler.pipe(
  Effect.catchIf(
    (e): e is NotFoundError => e._tag === "NotFoundError" && e.resource === "User",
    () => HttpServerResponse.json({ error: "User not found" }, { status: 404 })
  )
)`} />

      <h2 id="parse-errors">Parse Errors</h2>
      <CodeBlock code={`import { ArrayFormatter } from "@effect/schema"

HttpRouter.post("/users", Effect.gen(function* () {
  const body = yield* HttpServerRequest.schemaBodyJson(CreateUser)
  // ...
}).pipe(
  Effect.catchTag("ParseError", (e) => {
    const issues = ArrayFormatter.formatErrorSync(e)
    return HttpServerResponse.json(
      {
        error: "Validation failed",
        issues: issues.map(i => ({
          path: i.path.join("."),
          message: i.message
        }))
      },
      { status: 400 }
    )
  })
))`} />
    </DocsContent>
  );
}
