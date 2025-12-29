import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock, Callout } from '../../components';

export const Route = createFileRoute('/docs/cli')({
  component: CliPage,
});

function CliPage() {
  return (
    <DocsContent
      title="CLI"
      description="Gello CLI — create projects and manage your application"
    >
      <h2>Installation</h2>
      <p>
        The Gello CLI is available as an npm package. Use it directly with npx:
      </p>

      <CodeBlock lang="bash" code={`npx gello <command>`} />

      <p>
        Or install globally:
      </p>

      <CodeBlock lang="bash" code={`npm install -g gello
gello <command>`} />

      <h2>Available Commands</h2>

      <h3>new</h3>
      <p>
        Create a new Gello project with a complete starter template:
      </p>
      <CodeBlock lang="bash" code={`# Create a new project
npx gello new my-app

# Then install dependencies and run
cd my-app
pnpm install
pnpm dev`} />

      <Callout type="info" title="What gets scaffolded?">
        The scaffolded project includes Effect + @effect/platform HTTP server, example routes with CRUD operations,
        TypeScript configuration, and development scripts with hot reload.
      </Callout>

      <h3>serve</h3>
      <p>
        Start the development server with hot reload:
      </p>
      <CodeBlock lang="bash" code={`# Start development server
npx gello serve

# Or with a custom port
npx gello serve --port 4000`} />

      <h3>route:list</h3>
      <p>
        Display all registered routes in a beautiful TUI:
      </p>
      <CodeBlock lang="bash" code={`# Display all routes
npx gello route:list

# Output as JSON
npx gello route:list --json

# Filter by method
npx gello route:list --method GET

# Filter by path
npx gello route:list --path /users`} />

      <h3>Generators (Coming Soon)</h3>
      <CodeBlock lang="bash" code={`# Generate a controller
npx gello make:controller User

# Generate a service
npx gello make:service Email

# Generate a job
npx gello make:job SendWelcomeEmail`} />

      <h3>Database (Coming Soon)</h3>
      <CodeBlock lang="bash" code={`# Run migrations
npx gello migrate

# Create a new migration
npx gello migrate:make add_users_table

# Rollback last migration
npx gello migrate:rollback`} />

      <h3>Queue (Coming Soon)</h3>
      <CodeBlock lang="bash" code={`# Start queue worker
npx gello queue:work

# Show queue status
npx gello queue:status

# Clear failed jobs
npx gello queue:clear --failed`} />

      <h2>Help</h2>
      <CodeBlock lang="bash" code={`# Show help
npx gello --help

# Show version
npx gello --version`} />

      <h2>Route List Output</h2>
      <p>
        The <code>route:list</code> command displays a beautiful TUI with:
      </p>
      <ul>
        <li>GELLO ASCII art logo</li>
        <li>Stats bar with total routes and method counts</li>
        <li>Routes grouped by path prefix</li>
        <li>Color-coded HTTP methods (GET=green, POST=yellow, DELETE=red)</li>
      </ul>

      <CodeBlock lang="text" code={` ██████╗ ███████╗██╗     ██╗      ██████╗
██╔════╝ ██╔════╝██║     ██║     ██╔═══██╗
██║  ███╗█████╗  ██║     ██║     ██║   ██║
██║   ██║██╔══╝  ██║     ██║     ██║   ██║
╚██████╔╝███████╗███████╗███████╗╚██████╔╝
 ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝

Route List • Todo API

Total: 9 routes  │  GET:4  POST:2  PATCH:1  DELETE:2

──────────────────────────────────────────
METHOD    PATH                    HANDLER
──────────────────────────────────────────

/
GET       /                       apiInfo

/health
GET       /health                 healthCheck

/todos
GET       /todos                  listTodos
GET       /todos/:id              getTodoById
POST      /todos                  createTodoRoute
PATCH     /todos/:id              updateTodoRoute
DELETE    /todos/:id              deleteTodoRoute`} />
    </DocsContent>
  );
}
