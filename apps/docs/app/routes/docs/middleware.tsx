import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock, type TOCItem } from '../../components';
import { getPageNavigation } from '../../lib/source';

export const Route = createFileRoute('/docs/middleware')({
  component: MiddlewarePage,
});

const toc: TOCItem[] = [
  { title: 'The Pattern', url: '#the-pattern', depth: 2 },
  { title: 'Custom Middleware', url: '#custom-middleware', depth: 2 },
  { title: 'Authentication Middleware', url: '#authentication-middleware', depth: 2 },
  { title: 'CORS Middleware', url: '#cors-middleware', depth: 2 },
  { title: 'Rate Limiting', url: '#rate-limiting', depth: 2 },
  { title: 'Composing Middleware', url: '#composing-middleware', depth: 2 },
  { title: 'Route-Specific Middleware', url: '#route-specific-middleware', depth: 2 },
];

function MiddlewarePage() {
  const footer = getPageNavigation('/docs/middleware');

  return (
    <DocsContent
      title="Middleware"
      description="Composable request/response transformations using Effect"
      toc={toc}
      footer={footer}
    >
      <h2 id="the-pattern">The Pattern</h2>
      <p>
        Middleware in Gello are functions that wrap handlers, transforming requests or responses.
        They compose naturally using <code>pipe</code> and can access/provide context.
      </p>

      <CodeBlock code={`import * as HttpMiddleware from "@effect/platform/HttpMiddleware"

// Built-in logging middleware
const withLogging = HttpMiddleware.logger

// Apply to your app
const HttpApp = pipe(
  HttpRouter.toHttpApp(AppRouter),
  withLogging
)`} />

      <h2 id="custom-middleware">Custom Middleware</h2>
      <CodeBlock code={`const withTiming = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    const start = Date.now()
    const response = yield* app
    const duration = Date.now() - start

    return response.pipe(
      HttpServerResponse.setHeader("X-Response-Time", \`\${duration}ms\`)
    )
  })
)`} />

      <h2 id="authentication-middleware">Authentication Middleware</h2>
      <CodeBlock code={`class CurrentUser extends Context.Tag("CurrentUser")<
  CurrentUser,
  { id: string; email: string; role: string }
>() {}

const withAuth = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest
    const auth = request.headers["authorization"]

    if (!auth?.startsWith("Bearer ")) {
      return HttpServerResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const token = auth.slice(7)
    const user = yield* verifyToken(token)

    // Provide user to downstream handlers
    return yield* app.pipe(Effect.provideService(CurrentUser, user))
  })
)`} />

      <h2 id="cors-middleware">CORS Middleware</h2>
      <CodeBlock code={`const cors = (options: { origins: string | string[] }) =>
  HttpMiddleware.make((app) =>
    Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest
      const origin = request.headers["origin"]

      const response = yield* app

      const allowedOrigins = Array.isArray(options.origins)
        ? options.origins
        : [options.origins]

      if (origin && (allowedOrigins.includes("*") || allowedOrigins.includes(origin))) {
        return response.pipe(
          HttpServerResponse.setHeader("Access-Control-Allow-Origin", origin),
          HttpServerResponse.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE"),
          HttpServerResponse.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization")
        )
      }

      return response
    })
  )`} />

      <h2 id="rate-limiting">Rate Limiting</h2>
      <CodeBlock code={`const withRateLimit = (limit: number, window: Duration.Duration) =>
  HttpMiddleware.make((app) =>
    Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest
      const redis = yield* Redis
      const ip = request.headers["x-forwarded-for"] ?? "unknown"
      const key = \`ratelimit:\${ip}\`

      const count = yield* Effect.tryPromise(() => redis.incr(key))

      if (count === 1) {
        yield* Effect.tryPromise(() =>
          redis.expire(key, Duration.toSeconds(window))
        )
      }

      if (count > limit) {
        return HttpServerResponse.json(
          { error: "Too many requests" },
          { status: 429 }
        )
      }

      return yield* app
    })
  )`} />

      <h2 id="composing-middleware">Composing Middleware</h2>
      <CodeBlock code={`// Middleware compose left-to-right
const HttpApp = pipe(
  HttpRouter.toHttpApp(AppRouter),
  withLogging,        // 1. Log request
  withTiming,         // 2. Track duration
  cors({ origins: "*" }), // 3. Add CORS headers
  withRateLimit(100, Duration.minutes(1)) // 4. Rate limit
)`} />

      <h2 id="route-specific-middleware">Route-Specific Middleware</h2>
      <CodeBlock code={`// Apply middleware to specific routes
const PublicRouter = pipe(
  HttpRouter.empty,
  HttpRouter.get("/health", healthCheck),
  HttpRouter.get("/docs", getDocs)
)

const ProtectedRouter = pipe(
  HttpRouter.empty,
  HttpRouter.get("/me", getProfile),
  HttpRouter.patch("/settings", updateSettings)
).pipe(withAuth)

// Merge routers
const AppRouter = pipe(
  HttpRouter.empty,
  HttpRouter.mount("/api", PublicRouter),
  HttpRouter.mount("/api", ProtectedRouter)
)`} />
    </DocsContent>
  );
}
