/**
 * Project creation logic for NX workspace scaffolding
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import type {
  ProjectType,
  StarterTemplate,
  InfrastructureConfig,
  FeatureFlags,
  PackageManager,
} from '../../components/wizard/types.js';
import { templateRegistry } from '../../templates/index.js';

export interface CreateProjectOptions {
  projectName: string;
  projectType: ProjectType;
  template: StarterTemplate;
  infrastructure: InfrastructureConfig;
  features: FeatureFlags;
  packageManager: PackageManager;
  onProgress: (progress: CreationProgress) => void;
}

export type CreationProgress =
  | { type: 'step-start'; message: string }
  | { type: 'step-complete'; message: string }
  | { type: 'error'; message: string };

const step = async (
  message: string,
  fn: () => Promise<void>,
  onProgress: (p: CreationProgress) => void
) => {
  onProgress({ type: 'step-start', message });
  await fn();
  onProgress({ type: 'step-complete', message });
};

export const createProject = async (options: CreateProjectOptions): Promise<void> => {
  const { projectName, projectType, template, infrastructure, features, packageManager, onProgress } = options;
  const projectPath = path.resolve(process.cwd(), projectName);

  // Track template dependencies to add later
  let templateDeps: string[] = [];
  let templateDevDeps: string[] = [];

  // Check if directory exists
  if (fs.existsSync(projectPath)) {
    throw new Error(`Directory "${projectName}" already exists`);
  }

  // Create project directory
  await step('Creating project directory', async () => {
    fs.mkdirSync(projectPath, { recursive: true });
  }, onProgress);

  // Create NX workspace structure
  await step('Initializing NX workspace', async () => {
    await createNxWorkspace(projectPath, projectName, packageManager);
  }, onProgress);

  // Create apps/api
  await step('Creating API application', async () => {
    await createApiApp(projectPath, projectName, infrastructure, features);
  }, onProgress);

  // Create libs/contracts
  await step('Creating contracts library', async () => {
    await createContractsLib(projectPath);
  }, onProgress);

  // Create frontend if needed
  const hasFrontend = projectType !== 'api-only';
  const isMobile = projectType === 'api-expo';

  if (hasFrontend && !isMobile) {
    await step('Creating web application', async () => {
      await createWebApp(projectPath, projectName, projectType);
    }, onProgress);

    await step('Creating UI library', async () => {
      await createUiLib(projectPath);
    }, onProgress);
  }

  if (isMobile) {
    await step('Creating mobile application', async () => {
      await createMobileApp(projectPath, projectName);
    }, onProgress);

    await step('Creating mobile UI library', async () => {
      await createMobileUiLib(projectPath);
    }, onProgress);
  }

  // Create OpenAPI libs if feature enabled
  if (features.openapi) {
    await step('Creating API spec library', async () => {
      await createApiSpecLib(projectPath);
    }, onProgress);

    await step('Creating API client library', async () => {
      await createApiClientLib(projectPath);
    }, onProgress);
  }

  // Apply starter template
  if (template !== 'empty') {
    await step(`Applying ${template} template`, async () => {
      const result = templateRegistry.generate(template, {
        projectName,
        projectType,
        infrastructure,
        features,
        packageManager,
      });

      // Write template files
      for (const [filePath, content] of result.files) {
        const fullPath = path.join(projectPath, filePath);
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(fullPath, content);
      }

      // Save template dependencies to add later
      templateDeps = result.dependencies;
      templateDevDeps = result.devDependencies;
    }, onProgress);
  }

  // Create environment files
  await step('Creating environment configuration', async () => {
    await createEnvFiles(projectPath, infrastructure, features);
  }, onProgress);

  // Create root config files
  await step('Creating configuration files', async () => {
    await createRootConfigs(projectPath, projectName, projectType, features, templateDeps, templateDevDeps);
  }, onProgress);

  // Install dependencies
  await step('Installing dependencies', async () => {
    await installDependencies(projectPath, packageManager);
  }, onProgress);
};

async function createNxWorkspace(
  projectPath: string,
  projectName: string,
  packageManager: PackageManager
): Promise<void> {
  const nxJson = {
    $schema: './node_modules/nx/schemas/nx-schema.json',
    namedInputs: {
      default: ['{projectRoot}/**/*', 'sharedGlobals'],
      sharedGlobals: [],
      production: [
        'default',
        '!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)',
        '!{projectRoot}/tsconfig.spec.json',
      ],
    },
    targetDefaults: {
      build: {
        dependsOn: ['^build'],
        inputs: ['production', '^production'],
        cache: true,
      },
      dev: {
        dependsOn: ['^build'],
      },
      'generate-openapi': {
        dependsOn: ['build'],
        outputs: ['{workspaceRoot}/libs/api-spec/openapi.json'],
        cache: true,
      },
      'generate-client': {
        dependsOn: ['generate-openapi'],
        inputs: ['{workspaceRoot}/libs/api-spec/openapi.json'],
        outputs: ['{projectRoot}/src/generated'],
        cache: true,
      },
    },
  };

  fs.mkdirSync(path.join(projectPath, 'apps'), { recursive: true });
  fs.mkdirSync(path.join(projectPath, 'libs'), { recursive: true });
  fs.mkdirSync(path.join(projectPath, 'tools'), { recursive: true });

  fs.writeFileSync(
    path.join(projectPath, 'nx.json'),
    JSON.stringify(nxJson, null, 2) + '\n'
  );

  // Create pnpm-workspace.yaml
  if (packageManager === 'pnpm') {
    fs.writeFileSync(
      path.join(projectPath, 'pnpm-workspace.yaml'),
      `packages:\n  - 'apps/*'\n  - 'libs/*'\n  - 'tools/*'\n`
    );
  }
}

async function createApiApp(
  projectPath: string,
  projectName: string,
  infrastructure: InfrastructureConfig,
  features: FeatureFlags
): Promise<void> {
  const apiPath = path.join(projectPath, 'apps/api');
  fs.mkdirSync(path.join(apiPath, 'src/routes'), { recursive: true });
  fs.mkdirSync(path.join(apiPath, 'src/services'), { recursive: true });
  fs.mkdirSync(path.join(apiPath, 'src/config'), { recursive: true });

  // project.json
  const projectJson = {
    name: 'api',
    $schema: '../../node_modules/nx/schemas/project-schema.json',
    sourceRoot: 'apps/api/src',
    projectType: 'application',
    targets: {
      build: {
        executor: 'nx:run-commands',
        options: {
          command: 'vite build',
          cwd: 'apps/api',
        },
      },
      dev: {
        executor: 'nx:run-commands',
        options: {
          command: 'node --import tsx --watch src/main.ts',
          cwd: 'apps/api',
        },
      },
      serve: {
        executor: 'nx:run-commands',
        options: {
          command: 'node --import tsx src/main.ts',
          cwd: 'apps/api',
        },
      },
    },
  };
  fs.writeFileSync(
    path.join(apiPath, 'project.json'),
    JSON.stringify(projectJson, null, 2) + '\n'
  );

  // package.json
  const packageJson = {
    name: `@${projectName}/api`,
    version: '0.0.1',
    private: true,
    type: 'module',
  };
  fs.writeFileSync(
    path.join(apiPath, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n'
  );

  // tsconfig.json
  const tsconfig = {
    extends: '../../tsconfig.base.json',
    compilerOptions: {
      outDir: './dist',
      rootDir: './src',
    },
    include: ['src/**/*.ts', '../../types/**/*.d.ts'],
    exclude: ['node_modules', 'dist'],
  };
  fs.writeFileSync(
    path.join(apiPath, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2) + '\n'
  );

  // Main entry point
  const mainTs = `/**
 * ${projectName} API Server
 *
 * Built with Gello - The Effect-powered backend framework
 */
import * as http from 'node:http';
import { Effect, Layer } from 'effect';
import { config } from './config/index.js';
import { routes } from './routes/index.js';

// ============================================================================
// HTTP Helpers
// ============================================================================

const json = (res: http.ServerResponse, data: unknown, status = 200) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const parseBody = (req: http.IncomingMessage): Promise<unknown> =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });

// ============================================================================
// Request Handler
// ============================================================================

const handleRequest = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const url = req.url ?? '/';
  const method = req.method ?? 'GET';

  // CORS
  res.setHeader('Access-Control-Allow-Origin', config.security.corsOrigins);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Logging
  if (config.server.logging) {
    console.log(\`\${method} \${url}\`);
  }

  // Root endpoint
  if (method === 'GET' && url === '/') {
    return json(res, {
      name: config.app.name,
      version: '1.0.0',
      environment: config.app.env,
      docs: '/docs',
    });
  }

  // Health check
  if (method === 'GET' && url === '/health') {
    return json(res, {
      status: 'ok',
      uptime: process.uptime(),
    });
  }

  // 404
  return json(res, { error: 'Not found' }, 404);
};

// ============================================================================
// Server
// ============================================================================

const server = http.createServer(handleRequest);

server.listen(config.server.port, config.server.host, () => {
  console.log(\`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 \${config.app.name.padEnd(20)}                         ║
║                                                               ║
║   Server: http://\${config.server.host}:\${String(config.server.port).padEnd(5)}                          ║
║   Environment: \${config.app.env.padEnd(12)}                                 ║
║                                                               ║
║   Endpoints:                                                  ║
║     GET /        - API info                                   ║
║     GET /health  - Health check                               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
\`);
});
`;
  fs.writeFileSync(path.join(apiPath, 'src/main.ts'), mainTs);

  // Config
  const configTs = `/**
 * Application Configuration
 */
const env = (key: string, defaultValue: string): string =>
  process.env[key] ?? defaultValue;

export const config = {
  app: {
    name: env('APP_NAME', '${projectName}'),
    env: env('APP_ENV', 'local') as 'local' | 'development' | 'staging' | 'production',
    debug: env('APP_DEBUG', 'true') === 'true',
  },
  server: {
    host: env('APP_HOST', '0.0.0.0'),
    port: Number(env('APP_PORT', '3000')),
    logging: env('APP_LOGGING', 'true') === 'true',
  },
  security: {
    corsOrigins: env('CORS_ORIGINS', '*'),
  },
  queue: {
    driver: env('QUEUE_DRIVER', '${infrastructure.queue}') as 'sync' | 'redis' | 'database',
  },
  cache: {
    driver: env('CACHE_DRIVER', '${infrastructure.cache}') as 'memory' | 'redis' | 'database',
  },
  mail: {
    driver: env('MAIL_DRIVER', '${infrastructure.mail}') as 'log' | 'smtp' | 'resend' | 'ses',
  },
  session: {
    driver: env('SESSION_DRIVER', '${infrastructure.session}') as 'memory' | 'redis' | 'database',
  },
} as const;

export type AppConfig = typeof config;
`;
  fs.writeFileSync(path.join(apiPath, 'src/config/index.ts'), configTs);

  // Routes
  const routesTs = `/**
 * API Routes
 */
export const routes = {
  // Add your routes here
};
`;
  fs.writeFileSync(path.join(apiPath, 'src/routes/index.ts'), routesTs);
}

async function createContractsLib(projectPath: string): Promise<void> {
  const libPath = path.join(projectPath, 'libs/contracts');
  fs.mkdirSync(path.join(libPath, 'src/schemas'), { recursive: true });

  // project.json
  const projectJson = {
    name: 'contracts',
    $schema: '../../node_modules/nx/schemas/project-schema.json',
    sourceRoot: 'libs/contracts/src',
    projectType: 'library',
    targets: {
      build: {
        executor: 'nx:run-commands',
        options: {
          command: 'tsc -p tsconfig.json',
          cwd: 'libs/contracts',
        },
      },
    },
  };
  fs.writeFileSync(
    path.join(libPath, 'project.json'),
    JSON.stringify(projectJson, null, 2) + '\n'
  );

  // package.json
  const packageJson = {
    name: '@app/contracts',
    version: '0.0.1',
    private: true,
    type: 'module',
    main: './src/index.js',
    types: './src/index.d.ts',
    exports: {
      '.': {
        types: './src/index.d.ts',
        import: './src/index.js',
      },
    },
  };
  fs.writeFileSync(
    path.join(libPath, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n'
  );

  // tsconfig.json
  const tsconfig = {
    extends: '../../tsconfig.base.json',
    compilerOptions: {
      outDir: './dist',
      rootDir: './src',
      declaration: true,
      declarationMap: true,
    },
    include: ['src/**/*.ts'],
    exclude: ['node_modules', 'dist'],
  };
  fs.writeFileSync(
    path.join(libPath, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2) + '\n'
  );

  // Example schema
  const userSchema = `/**
 * User Schema
 *
 * Shared between API and clients for type safety.
 */
import * as S from '@effect/schema/Schema';

export const UserId = S.String.pipe(
  S.brand('UserId'),
  S.annotations({
    description: 'Unique user identifier',
    example: 'usr_abc123',
  })
);

export const Email = S.String.pipe(
  S.pattern(/^[^@]+@[^@]+\\.[^@]+$/),
  S.annotations({
    description: 'Valid email address',
    format: 'email',
  })
);

export const UserSchema = S.Struct({
  id: UserId,
  email: Email,
  name: S.String.pipe(
    S.minLength(1),
    S.maxLength(100),
    S.annotations({ description: 'User display name' })
  ),
  createdAt: S.Date,
  updatedAt: S.Date,
}).annotations({
  identifier: 'User',
  description: 'A user in the system',
});

export const CreateUserSchema = S.Struct({
  email: Email,
  name: S.String.pipe(S.minLength(1), S.maxLength(100)),
  password: S.String.pipe(S.minLength(8)),
}).annotations({
  identifier: 'CreateUser',
});

export const UpdateUserSchema = S.Struct({
  name: S.optional(S.String.pipe(S.minLength(1), S.maxLength(100))),
  email: S.optional(Email),
}).annotations({
  identifier: 'UpdateUser',
});

// Export types
export type UserId = S.Schema.Type<typeof UserId>;
export type User = S.Schema.Type<typeof UserSchema>;
export type CreateUser = S.Schema.Type<typeof CreateUserSchema>;
export type UpdateUser = S.Schema.Type<typeof UpdateUserSchema>;
`;
  fs.writeFileSync(path.join(libPath, 'src/schemas/user.ts'), userSchema);

  // Index
  const indexTs = `/**
 * Contracts - Shared schemas and types
 */
export * from './schemas/user.js';
`;
  fs.writeFileSync(path.join(libPath, 'src/index.ts'), indexTs);
}

async function createWebApp(
  projectPath: string,
  projectName: string,
  projectType: ProjectType
): Promise<void> {
  const webPath = path.join(projectPath, 'apps/web');
  fs.mkdirSync(path.join(webPath, 'src/components'), { recursive: true });
  fs.mkdirSync(path.join(webPath, 'src/routes'), { recursive: true });
  fs.mkdirSync(path.join(webPath, 'src/lib'), { recursive: true });

  // project.json
  const projectJson = {
    name: 'web',
    $schema: '../../node_modules/nx/schemas/project-schema.json',
    sourceRoot: 'apps/web/src',
    projectType: 'application',
    targets: {
      build: {
        executor: 'nx:run-commands',
        options: {
          command: 'vite build',
          cwd: 'apps/web',
        },
      },
      dev: {
        executor: 'nx:run-commands',
        options: {
          command: 'vite dev',
          cwd: 'apps/web',
        },
      },
    },
  };
  fs.writeFileSync(
    path.join(webPath, 'project.json'),
    JSON.stringify(projectJson, null, 2) + '\n'
  );

  // package.json
  const packageJson = {
    name: `@${projectName}/web`,
    version: '0.0.1',
    private: true,
    type: 'module',
  };
  fs.writeFileSync(
    path.join(webPath, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n'
  );

  // tsconfig.json
  const tsconfig = {
    extends: '../../tsconfig.base.json',
    compilerOptions: {
      jsx: 'react-jsx',
      outDir: './dist',
      rootDir: './src',
    },
    include: ['src/**/*.ts', 'src/**/*.tsx'],
    exclude: ['node_modules', 'dist'],
  };
  fs.writeFileSync(
    path.join(webPath, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2) + '\n'
  );

  // Vite config
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
`;
  fs.writeFileSync(path.join(webPath, 'vite.config.ts'), viteConfig);

  // index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  fs.writeFileSync(path.join(webPath, 'index.html'), indexHtml);

  // Main entry
  const mainTsx = `import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
  fs.writeFileSync(path.join(webPath, 'src/main.tsx'), mainTsx);

  // App component
  const appTsx = `import React, { useEffect, useState } from 'react';

interface ApiInfo {
  name: string;
  version: string;
  environment: string;
}

export const App: React.FC = () => {
  const [apiInfo, setApiInfo] = useState<ApiInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/')
      .then((res) => res.json())
      .then((data) => {
        setApiInfo(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui', color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Welcome to {apiInfo?.name}</h1>
      <p>Version: {apiInfo?.version}</p>
      <p>Environment: {apiInfo?.environment}</p>
      <hr />
      <p>Edit <code>apps/web/src/App.tsx</code> to get started.</p>
    </div>
  );
};
`;
  fs.writeFileSync(path.join(webPath, 'src/App.tsx'), appTsx);
}

async function createUiLib(projectPath: string): Promise<void> {
  const libPath = path.join(projectPath, 'libs/ui');
  fs.mkdirSync(path.join(libPath, 'src/components'), { recursive: true });

  // project.json
  const projectJson = {
    name: 'ui',
    $schema: '../../node_modules/nx/schemas/project-schema.json',
    sourceRoot: 'libs/ui/src',
    projectType: 'library',
    targets: {
      build: {
        executor: 'nx:run-commands',
        options: {
          command: 'tsc -p tsconfig.json',
          cwd: 'libs/ui',
        },
      },
    },
  };
  fs.writeFileSync(
    path.join(libPath, 'project.json'),
    JSON.stringify(projectJson, null, 2) + '\n'
  );

  // package.json
  const packageJson = {
    name: '@app/ui',
    version: '0.0.1',
    private: true,
    type: 'module',
    main: './src/index.js',
    types: './src/index.d.ts',
  };
  fs.writeFileSync(
    path.join(libPath, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n'
  );

  // tsconfig.json
  const tsconfig = {
    extends: '../../tsconfig.base.json',
    compilerOptions: {
      jsx: 'react-jsx',
      outDir: './dist',
      rootDir: './src',
      declaration: true,
    },
    include: ['src/**/*.ts', 'src/**/*.tsx'],
    exclude: ['node_modules', 'dist'],
  };
  fs.writeFileSync(
    path.join(libPath, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2) + '\n'
  );

  // Example button component
  const buttonTsx = `import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = {
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontWeight: 500,
  };

  const sizeStyles = {
    sm: { padding: '0.25rem 0.5rem', fontSize: '0.875rem' },
    md: { padding: '0.5rem 1rem', fontSize: '1rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1.125rem' },
  };

  const variantStyles = {
    primary: { backgroundColor: '#3b82f6', color: '#ffffff' },
    secondary: { backgroundColor: '#272727', color: '#fafafa' },
    outline: { backgroundColor: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6' },
  };

  return (
    <button
      style={{ ...baseStyles, ...sizeStyles[size], ...variantStyles[variant] }}
      {...props}
    >
      {children}
    </button>
  );
};
`;
  fs.writeFileSync(path.join(libPath, 'src/components/Button.tsx'), buttonTsx);

  // Index
  const indexTs = `export * from './components/Button.js';
`;
  fs.writeFileSync(path.join(libPath, 'src/index.ts'), indexTs);
}

async function createMobileApp(projectPath: string, projectName: string): Promise<void> {
  const mobilePath = path.join(projectPath, 'apps/mobile');
  fs.mkdirSync(path.join(mobilePath, 'app'), { recursive: true });
  fs.mkdirSync(path.join(mobilePath, 'components'), { recursive: true });

  // project.json
  const projectJson = {
    name: 'mobile',
    $schema: '../../node_modules/nx/schemas/project-schema.json',
    sourceRoot: 'apps/mobile',
    projectType: 'application',
    targets: {
      dev: {
        executor: 'nx:run-commands',
        options: {
          command: 'expo start',
          cwd: 'apps/mobile',
        },
      },
    },
  };
  fs.writeFileSync(
    path.join(mobilePath, 'project.json'),
    JSON.stringify(projectJson, null, 2) + '\n'
  );

  // package.json
  const packageJson = {
    name: `@${projectName}/mobile`,
    version: '0.0.1',
    private: true,
    main: 'expo-router/entry',
  };
  fs.writeFileSync(
    path.join(mobilePath, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n'
  );

  // app.json
  const appJson = {
    expo: {
      name: projectName,
      slug: projectName,
      version: '1.0.0',
      scheme: projectName,
      platforms: ['ios', 'android'],
    },
  };
  fs.writeFileSync(
    path.join(mobilePath, 'app.json'),
    JSON.stringify(appJson, null, 2) + '\n'
  );

  // _layout.tsx
  const layoutTsx = `import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack />;
}
`;
  fs.writeFileSync(path.join(mobilePath, 'app/_layout.tsx'), layoutTsx);

  // index.tsx
  const indexTsx = `import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ${projectName}</Text>
      <Text style={styles.subtitle}>Edit app/index.tsx to get started</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
`;
  fs.writeFileSync(path.join(mobilePath, 'app/index.tsx'), indexTsx);

  // tsconfig.json
  const tsconfig = {
    extends: 'expo/tsconfig.base',
    compilerOptions: {
      strict: true,
    },
  };
  fs.writeFileSync(
    path.join(mobilePath, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2) + '\n'
  );
}

async function createMobileUiLib(projectPath: string): Promise<void> {
  const libPath = path.join(projectPath, 'libs/mobile-ui');
  fs.mkdirSync(path.join(libPath, 'src/components'), { recursive: true });

  // project.json
  const projectJson = {
    name: 'mobile-ui',
    $schema: '../../node_modules/nx/schemas/project-schema.json',
    sourceRoot: 'libs/mobile-ui/src',
    projectType: 'library',
  };
  fs.writeFileSync(
    path.join(libPath, 'project.json'),
    JSON.stringify(projectJson, null, 2) + '\n'
  );

  // package.json
  const packageJson = {
    name: '@app/mobile-ui',
    version: '0.0.1',
    private: true,
    type: 'module',
    main: './src/index.js',
    types: './src/index.d.ts',
  };
  fs.writeFileSync(
    path.join(libPath, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n'
  );

  // Example button
  const buttonTsx = `import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onPress?: () => void;
  children: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onPress,
  children,
}) => {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={[styles.base, isPrimary ? styles.primary : styles.secondary]}
      onPress={onPress}
    >
      <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary]}>
        {children}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#3b82f6',
  },
  secondary: {
    backgroundColor: '#272727',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textPrimary: {
    color: '#ffffff',
  },
  textSecondary: {
    color: '#fafafa',
  },
});
`;
  fs.writeFileSync(path.join(libPath, 'src/components/Button.tsx'), buttonTsx);

  // Index
  fs.writeFileSync(
    path.join(libPath, 'src/index.ts'),
    `export * from './components/Button.js';\n`
  );
}

async function createApiSpecLib(projectPath: string): Promise<void> {
  const libPath = path.join(projectPath, 'libs/api-spec');
  fs.mkdirSync(libPath, { recursive: true });

  // project.json
  const projectJson = {
    name: 'api-spec',
    $schema: '../../node_modules/nx/schemas/project-schema.json',
    sourceRoot: 'libs/api-spec',
    projectType: 'library',
    targets: {
      generate: {
        executor: 'nx:run-commands',
        options: {
          command: 'gello openapi:generate',
          cwd: '.',
        },
      },
    },
  };
  fs.writeFileSync(
    path.join(libPath, 'project.json'),
    JSON.stringify(projectJson, null, 2) + '\n'
  );

  // Empty openapi.json placeholder
  const openApiSpec = {
    openapi: '3.1.0',
    info: {
      title: 'API',
      version: '1.0.0',
    },
    paths: {},
  };
  fs.writeFileSync(
    path.join(libPath, 'openapi.json'),
    JSON.stringify(openApiSpec, null, 2) + '\n'
  );
}

async function createApiClientLib(projectPath: string): Promise<void> {
  const libPath = path.join(projectPath, 'libs/api-client');
  fs.mkdirSync(path.join(libPath, 'src'), { recursive: true });

  // project.json
  const projectJson = {
    name: 'api-client',
    $schema: '../../node_modules/nx/schemas/project-schema.json',
    sourceRoot: 'libs/api-client/src',
    projectType: 'library',
    targets: {
      'generate-client': {
        executor: 'nx:run-commands',
        options: {
          command: 'gello client:generate',
          cwd: '.',
        },
      },
      build: {
        executor: 'nx:run-commands',
        dependsOn: ['generate-client'],
        options: {
          command: 'tsc -p tsconfig.json',
          cwd: 'libs/api-client',
        },
      },
    },
  };
  fs.writeFileSync(
    path.join(libPath, 'project.json'),
    JSON.stringify(projectJson, null, 2) + '\n'
  );

  // package.json
  const packageJson = {
    name: '@app/api-client',
    version: '0.0.1',
    private: true,
    type: 'module',
    main: './src/index.js',
    types: './src/index.d.ts',
  };
  fs.writeFileSync(
    path.join(libPath, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n'
  );

  // tsconfig.json
  const tsconfig = {
    extends: '../../tsconfig.base.json',
    compilerOptions: {
      outDir: './dist',
      rootDir: './src',
      declaration: true,
    },
    include: ['src/**/*.ts'],
    exclude: ['node_modules', 'dist'],
  };
  fs.writeFileSync(
    path.join(libPath, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2) + '\n'
  );

  // Placeholder index
  const indexTs = `/**
 * API Client
 *
 * Generated from OpenAPI spec. Run \`gello client:generate\` to regenerate.
 */
export const API_VERSION = '1.0.0';

// Generated types and client will be added here
`;
  fs.writeFileSync(path.join(libPath, 'src/index.ts'), indexTs);
}

async function createEnvFiles(
  projectPath: string,
  infrastructure: InfrastructureConfig,
  features: FeatureFlags
): Promise<void> {
  const envContent = `# ============================================================================
# Application Configuration
# ============================================================================

APP_NAME=my-app
APP_ENV=local
APP_DEBUG=true

# ─── Server ──────────────────────────────────────────────────────────────────

APP_HOST=0.0.0.0
APP_PORT=3000
APP_LOGGING=true

# ─── Security ────────────────────────────────────────────────────────────────

CORS_ORIGINS=*

# ─── Queue ───────────────────────────────────────────────────────────────────

QUEUE_DRIVER=${infrastructure.queue}

# ─── Cache ───────────────────────────────────────────────────────────────────

CACHE_DRIVER=${infrastructure.cache}

# ─── Mail ────────────────────────────────────────────────────────────────────

MAIL_DRIVER=${infrastructure.mail}

# ─── Session ─────────────────────────────────────────────────────────────────

SESSION_DRIVER=${infrastructure.session}

${infrastructure.queue === 'redis' || infrastructure.cache === 'redis' || infrastructure.session === 'redis' ? `# ─── Redis ───────────────────────────────────────────────────────────────────

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DATABASE=0
` : ''}
${features.database ? `# ─── Database ────────────────────────────────────────────────────────────────

DB_HOST=localhost
DB_PORT=5432
DB_NAME=app
DB_USER=postgres
DB_PASSWORD=secret
` : ''}
`;
  fs.writeFileSync(path.join(projectPath, '.env.example'), envContent);
}

async function createRootConfigs(
  projectPath: string,
  projectName: string,
  projectType: ProjectType,
  features: FeatureFlags,
  templateDeps: string[] = [],
  templateDevDeps: string[] = []
): Promise<void> {
  // tsconfig.base.json
  const hasFrontend = projectType !== 'api-only';
  const isMobile = projectType === 'api-expo';

  const paths: Record<string, string[]> = {
    [`@${projectName}/contracts`]: ['libs/contracts/src/index.ts'],
    // Map @gello/* to type declarations (workaround for bundled package types)
    '@gello/platform-node': ['types/gello-platform-node.d.ts'],
    '@gello/core': ['types/gello-core.d.ts'],
    '@gello/common': ['types/gello-common.d.ts'],
    '@gello/auth': ['types/gello-auth.d.ts'],
  };

  if (features.openapi) {
    paths[`@${projectName}/api-client`] = ['libs/api-client/src/index.ts'];
  }

  if (hasFrontend && !isMobile) {
    paths[`@${projectName}/ui`] = ['libs/ui/src/index.ts'];
  }

  if (isMobile) {
    paths[`@${projectName}/mobile-ui`] = ['libs/mobile-ui/src/index.ts'];
  }

  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      baseUrl: '.',
      paths,
      typeRoots: ['./types', './node_modules/@types'],
    },
    include: ['types/**/*.d.ts'],
    exclude: ['node_modules', 'dist'],
  };
  fs.writeFileSync(
    path.join(projectPath, 'tsconfig.base.json'),
    JSON.stringify(tsconfig, null, 2) + '\n'
  );

  // Root package.json
  const deps: Record<string, string> = {
    effect: '^3.19.0',
    '@effect/schema': '^0.75.0',
  };

  const devDeps: Record<string, string> = {
    nx: '^20.0.0',
    typescript: '^5.7.0',
    tsx: '^4.19.0',
    '@types/node': '^22.0.0',
  };

  if (hasFrontend && !isMobile) {
    deps['react'] = '^18.3.0';
    deps['react-dom'] = '^18.3.0';
    devDeps['@types/react'] = '^18.3.0';
    devDeps['@types/react-dom'] = '^18.3.0';
    devDeps['vite'] = '^6.0.0';
    devDeps['@vitejs/plugin-react'] = '^4.3.0';
  }

  if (isMobile) {
    deps['expo'] = '^52.0.0';
    deps['expo-router'] = '^4.0.0';
    deps['react'] = '^18.3.0';
    deps['react-native'] = '^0.76.0';
  }

  // Add template dependencies
  for (const dep of templateDeps) {
    deps[dep] = 'latest';
  }
  for (const devDep of templateDevDeps) {
    devDeps[devDep] = 'latest';
  }

  const scripts: Record<string, string> = {
    dev: hasFrontend ? 'nx run-many -t dev --projects=api,web' : 'nx run api:dev',
    build: 'nx run-many -t build',
    test: 'nx run-many -t test',
    lint: 'nx run-many -t lint',
    typecheck: 'nx run-many -t typecheck',
  };

  if (features.openapi) {
    scripts['generate'] = 'nx run-many -t generate-openapi,generate-client';
  }

  const rootPackageJson = {
    name: projectName,
    version: '0.0.1',
    private: true,
    scripts,
    dependencies: deps,
    devDependencies: devDeps,
  };
  fs.writeFileSync(
    path.join(projectPath, 'package.json'),
    JSON.stringify(rootPackageJson, null, 2) + '\n'
  );

  // .gitignore
  const gitignore = `# Dependencies
node_modules/

# Build
dist/
.next/
.expo/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Environment
.env
.env.local
.env.*.local

# NX
.nx/cache
`;
  fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignore);

  // README.md
  const readme = `# ${projectName}

Built with [Gello](https://gello.net) - The Effect-powered backend framework.

## Getting Started

\`\`\`bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Start development servers
pnpm dev
\`\`\`

## Project Structure

\`\`\`
${projectName}/
├── apps/
│   ├── api/           # Gello API server
${hasFrontend && !isMobile ? '│   └── web/           # React web app\n' : ''}${isMobile ? '│   └── mobile/        # Expo mobile app\n' : ''}├── libs/
│   ├── contracts/     # Shared schemas & types
${hasFrontend && !isMobile ? '│   ├── ui/            # Web UI components\n' : ''}${isMobile ? '│   ├── mobile-ui/     # Mobile UI components\n' : ''}${features.openapi ? '│   ├── api-spec/      # OpenAPI specification\n│   └── api-client/    # Generated API client\n' : ''}├── nx.json
├── tsconfig.base.json
└── package.json
\`\`\`

## Commands

| Command | Description |
|---------|-------------|
| \`pnpm dev\` | Start development servers |
| \`pnpm build\` | Build all packages |
| \`pnpm test\` | Run tests |
| \`pnpm lint\` | Lint code |
${features.openapi ? '| `pnpm generate` | Generate API client from spec |\n' : ''}
## Documentation

- [Gello Documentation](https://gello.net/docs)
- [Effect Documentation](https://effect.website/docs)
- [NX Documentation](https://nx.dev)
`;
  fs.writeFileSync(path.join(projectPath, 'README.md'), readme);
}

async function installDependencies(
  projectPath: string,
  packageManager: PackageManager
): Promise<void> {
  const commands: Record<PackageManager, string> = {
    pnpm: 'pnpm install',
    npm: 'npm install',
    yarn: 'yarn install',
    bun: 'bun install',
  };

  try {
    execSync(commands[packageManager], {
      cwd: projectPath,
      stdio: 'pipe',
    });
  } catch {
    // Installation may fail if some packages aren't available,
    // but we want to continue anyway
    console.warn('Warning: Some dependencies may not have installed correctly');
  }
}
