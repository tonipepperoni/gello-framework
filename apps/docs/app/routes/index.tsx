import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '../lib/layout.shared';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12 lg:py-16 text-center">
        {/* Logo - hidden on very small screens, show text instead */}
        <div className="mb-6 sm:mb-8">
          {/* ASCII art for larger screens */}
          <pre className="hidden sm:block text-fd-primary text-xs sm:text-sm font-mono leading-none overflow-x-auto">
{` ██████╗ ███████╗██╗     ██╗      ██████╗
██╔════╝ ██╔════╝██║     ██║     ██╔═══██╗
██║  ███╗█████╗  ██║     ██║     ██║   ██║
██║   ██║██╔══╝  ██║     ██║     ██║   ██║
╚██████╔╝███████╗███████╗███████╗╚██████╔╝
 ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝`}
          </pre>
          {/* Simple text logo for mobile */}
          <h1 className="sm:hidden text-4xl font-bold text-fd-primary font-mono">
            gello
          </h1>
        </div>

        <p className="mb-6 sm:mb-8 max-w-2xl text-base sm:text-lg lg:text-xl text-fd-muted-foreground px-2">
          A TypeScript backend framework built on{' '}
          <strong className="text-fd-foreground">Effect</strong>, inspired by{' '}
          <strong className="text-fd-foreground">Laravel</strong>,{' '}
          <strong className="text-fd-foreground">Rails</strong>, and{' '}
          <strong className="text-fd-foreground">NestJS</strong>.
          Functional, type-safe, composable.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 w-full sm:w-auto px-4 sm:px-0">
          <Link
            to="/docs"
            className="inline-flex items-center justify-center rounded-lg bg-fd-primary px-6 sm:px-8 py-3 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/tonipepperoni/gello-framework"
            className="inline-flex items-center justify-center rounded-lg border border-fd-border bg-fd-secondary px-6 sm:px-8 py-3 text-sm font-medium text-fd-secondary-foreground transition-colors hover:bg-fd-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full px-2 sm:px-0">
        <FeatureCard
          title="Context.Tag + Layer"
          description="No DI container, no decorators. Just compose Layers for dependencies and yield* from context."
          color="green"
        />
        <FeatureCard
          title="Scoped Resources"
          description="Database pools, Redis connections — all managed with Layer.scoped and acquireRelease."
          color="blue"
        />
        <FeatureCard
          title="@effect/platform HTTP"
          description="Type-safe routing with HttpRouter, schema validation at boundaries, proper middleware."
          color="aqua"
        />
        <FeatureCard
          title="Single Composition Point"
          description="All layers merge at one root, then Layer.launch. No scattered configuration."
          color="yellow"
        />
        <FeatureCard
          title="Drizzle + Effect"
          description="Type-safe database with proper resource lifecycle. Pool created, used, closed."
          color="purple"
        />
        <FeatureCard
          title="Effect Queues"
          description="Jobs as values, workers as Layers. Pure Effect — no external queue dependency."
          color="orange"
        />
      </div>

        <div className="mt-12 sm:mt-16 lg:mt-20 rounded-xl bg-fd-card border border-fd-border p-4 sm:p-6 lg:p-8 max-w-3xl w-full mx-4 sm:mx-0">
          <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-fd-foreground">Quick Start</h2>
          <pre className="overflow-x-auto rounded-lg bg-fd-secondary p-3 sm:p-4 text-left text-xs sm:text-sm border border-fd-border">
            <code className="text-fd-foreground">
{`npx gello new my-app
cd my-app
pnpm install
pnpm dev`}
            </code>
          </pre>
        </div>
      </main>
    </HomeLayout>
  );
}

function FeatureCard({ title, description, color }: { title: string; description: string; color: string }) {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-card p-6 text-left transition-colors hover:border-fd-primary/50">
      <h3 className="mb-2 text-lg font-semibold text-fd-primary">{title}</h3>
      <p className="text-sm text-fd-muted-foreground">{description}</p>
    </div>
  );
}
