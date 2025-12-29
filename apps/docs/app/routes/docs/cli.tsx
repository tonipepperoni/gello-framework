import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, CodeBlock, Callout, type TOCItem } from '../../components';
import { getPageNavigation } from '../../lib/source';

export const Route = createFileRoute('/docs/cli')({
  component: CliPage,
});

const toc: TOCItem[] = [
  { title: 'Installation', url: '#installation', depth: 2 },
  { title: 'Available Commands', url: '#available-commands', depth: 2 },
  { title: 'new', url: '#new', depth: 3 },
  { title: 'serve', url: '#serve', depth: 3 },
  { title: 'route:list', url: '#route-list', depth: 3 },
  { title: 'Generators', url: '#generators', depth: 3 },
  { title: 'Database', url: '#database', depth: 3 },
  { title: 'Queue', url: '#queue', depth: 3 },
  { title: 'Help', url: '#help', depth: 2 },
  { title: 'Route List Output', url: '#route-list-output', depth: 2 },
];

function CliPage() {
  const footer = getPageNavigation('/docs/cli');

  return (
    <DocsContent
      title="CLI"
      description="Gello CLI — create projects and manage your application"
      toc={toc}
      footer={footer}
    >
      <h2 id="installation">Installation</h2>
      <p>
        The Gello CLI is available as an npm package. Use it directly with npx:
      </p>

      <CodeBlock lang="bash" code={`npx gello <command>`} />

      <p>
        Or install globally:
      </p>

      <CodeBlock lang="bash" code={`npm install -g gello
gello <command>`} />

      <h2 id="available-commands">Available Commands</h2>

      <h3 id="new">new</h3>
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

      <h3 id="serve">serve</h3>
      <p>
        Start the development server with hot reload:
      </p>
      <CodeBlock lang="bash" code={`# Start development server
npx gello serve

# Or with a custom port
npx gello serve --port 4000`} />

      <h3 id="route-list">route:list</h3>
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

      <h3 id="generators">Generators (Coming Soon)</h3>
      <CodeBlock lang="bash" code={`# Generate a controller
npx gello make:controller User

# Generate a service
npx gello make:service Email

# Generate a job
npx gello make:job SendWelcomeEmail`} />

      <h3 id="database">Database (Coming Soon)</h3>
      <CodeBlock lang="bash" code={`# Run migrations
npx gello migrate

# Create a new migration
npx gello migrate:make add_users_table

# Rollback last migration
npx gello migrate:rollback`} />

      <h3 id="queue">Queue (Coming Soon)</h3>
      <CodeBlock lang="bash" code={`# Start queue worker
npx gello queue:work

# Show queue status
npx gello queue:status

# Clear failed jobs
npx gello queue:clear --failed`} />

      <h2 id="help">Help</h2>
      <CodeBlock lang="bash" code={`# Show help
npx gello --help

# Show version
npx gello --version`} />

      <h2 id="route-list-output">Route List Output</h2>
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
