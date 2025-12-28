import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-8">
        <img src="/logo.svg" alt="Gello" className="w-32 h-32 mx-auto" />
      </div>

      <h1 className="mb-4 text-5xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-violet-500 to-purple-400 bg-clip-text text-transparent">
          Gello
        </span>
      </h1>

      <p className="mb-8 max-w-2xl text-xl text-zinc-400">
        FP-core backend framework built on{' '}
        <strong className="text-white">Effect</strong>.
        Non-modular, purely functional — program = value, interpret at the edge.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <Link
          to="/docs"
          className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500"
        >
          Get Started
        </Link>
        <a
          href="https://github.com/tonipepperoni/gello-framework"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-5xl">
        <FeatureCard
          title="Context.Tag + Layer"
          description="No DI container, no decorators. Just compose Layers for dependencies and yield* from context."
          icon="⚡"
        />
        <FeatureCard
          title="Scoped Resources"
          description="Database pools, Redis connections — all managed with Layer.scoped and acquireRelease."
          icon="🔒"
        />
        <FeatureCard
          title="@effect/platform HTTP"
          description="Type-safe routing with HttpRouter, schema validation at boundaries, proper middleware."
          icon="🌐"
        />
        <FeatureCard
          title="Single Composition Point"
          description="All layers merge at one root, then Layer.launch. No scattered configuration."
          icon="🎯"
        />
        <FeatureCard
          title="Drizzle + Effect"
          description="Type-safe database with proper resource lifecycle. Pool created, used, closed."
          icon="🗄️"
        />
        <FeatureCard
          title="Effect Queues"
          description="Jobs as values, workers as Layers. Pure Effect — no external queue dependency."
          icon="📬"
        />
      </div>

      <div className="mt-20 rounded-xl bg-zinc-900 border border-zinc-800 p-8 max-w-3xl w-full">
        <h2 className="mb-4 text-lg font-semibold text-white">Quick Start</h2>
        <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-left text-sm">
          <code className="text-zinc-300">
{`pnpm add effect @effect/schema @effect/platform @effect/platform-node`}
          </code>
        </pre>
      </div>
    </main>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-left transition-colors hover:border-violet-500/50">
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </div>
  );
}
