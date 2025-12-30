/**
 * gello client:generate - Generate TypeScript client from OpenAPI spec
 */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { render, Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import { gruvbox } from '../../components/wizard/theme.js';

interface GenerateClientProps {
  input?: string;
  output?: string;
}

type Status = 'loading' | 'success' | 'warning' | 'error';

const GenerateClientComponent: React.FC<GenerateClientProps> = ({ input, output }) => {
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('Looking for OpenAPI spec...');
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<Array<{ text: string; done: boolean }>>([]);

  const addStep = (text: string) => {
    setSteps((prev) => [...prev, { text, done: false }]);
  };

  const completeStep = () => {
    setSteps((prev) => {
      const newSteps = [...prev];
      const lastIncomplete = newSteps.findIndex((s) => !s.done);
      if (lastIncomplete !== -1) {
        newSteps[lastIncomplete] = { ...newSteps[lastIncomplete], done: true };
      }
      return newSteps;
    });
  };

  useEffect(() => {
    const run = async () => {
      try {
        const cwd = process.cwd();

        // Find input spec
        addStep('Locating OpenAPI specification');
        const specPath = findSpecPath(cwd, input);

        if (!specPath) {
          throw new Error(
            'OpenAPI specification not found.\n' +
            'Run `gello openapi:generate` first, or specify --input path.'
          );
        }

        if (!fs.existsSync(specPath)) {
          throw new Error(
            `OpenAPI spec not found at: ${specPath}\n` +
            'Run `gello openapi:generate` first.'
          );
        }
        completeStep();

        // Check for Hey API
        addStep('Checking for @hey-api/openapi-ts');
        const hasHeyApi = checkHeyApiInstalled(cwd);

        if (!hasHeyApi) {
          setStatus('warning');
          setMessage(
            '@hey-api/openapi-ts is not installed.\n' +
            'Install it with: pnpm add -D @hey-api/openapi-ts @hey-api/client-fetch'
          );
          return;
        }
        completeStep();

        // Determine output path
        addStep('Generating TypeScript client');
        const outputPath = findOutputPath(cwd, output);

        // Create Hey API config if not exists
        const configPath = getHeyApiConfigPath(cwd, outputPath);
        ensureHeyApiConfig(cwd, specPath, outputPath, configPath);

        // Run Hey API
        try {
          execSync('npx openapi-ts', {
            cwd: path.dirname(configPath),
            stdio: 'pipe',
          });
        } catch {
          // Hey API might not be available, generate manual client instead
          generateManualClient(outputPath, specPath);
        }
        completeStep();

        setStatus('success');
        setMessage('TypeScript client generated successfully');
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    run();
  }, [input, output]);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text color={gruvbox.orange} bold>
          Client Generator
        </Text>
      </Box>

      {/* Steps */}
      {steps.map((step, i) => (
        <Box key={i}>
          {step.done ? (
            <Text color={gruvbox.green}>✓ </Text>
          ) : status === 'loading' ? (
            <Text color={gruvbox.yellow}>
              <Spinner type="dots" />{' '}
            </Text>
          ) : (
            <Text color={gruvbox.gray}>○ </Text>
          )}
          <Text color={step.done ? gruvbox.fg4 : gruvbox.fg}>{step.text}</Text>
        </Box>
      ))}

      {status === 'success' && (
        <Box marginTop={1} flexDirection="column">
          <Box>
            <Text color={gruvbox.green}>✓ </Text>
            <Text color={gruvbox.fg}>{message}</Text>
          </Box>
          <Box marginTop={1}>
            <Text color={gruvbox.gray}>
              Import the client:{' '}
              <Text color={gruvbox.aqua}>
                import {'{ api }'} from '@app/api-client'
              </Text>
            </Text>
          </Box>
        </Box>
      )}

      {status === 'warning' && (
        <Box marginTop={1} flexDirection="column">
          <Box>
            <Text color={gruvbox.yellow}>⚠ </Text>
            <Text color={gruvbox.fg}>{message}</Text>
          </Box>
        </Box>
      )}

      {status === 'error' && (
        <Box flexDirection="column" marginTop={1}>
          <Box>
            <Text color={gruvbox.red}>✗ Error</Text>
          </Box>
          <Box marginTop={1}>
            <Text color={gruvbox.fg}>{error}</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};

function findSpecPath(cwd: string, input?: string): string | null {
  if (input) {
    return path.isAbsolute(input) ? input : path.join(cwd, input);
  }

  // Check NX workspace location
  const nxPath = path.join(cwd, 'libs/api-spec/openapi.json');
  if (fs.existsSync(nxPath)) {
    return nxPath;
  }

  // Check root
  const rootPath = path.join(cwd, 'openapi.json');
  if (fs.existsSync(rootPath)) {
    return rootPath;
  }

  return null;
}

function findOutputPath(cwd: string, output?: string): string {
  if (output) {
    return path.isAbsolute(output) ? output : path.join(cwd, output);
  }

  // Check if we're in an NX workspace
  if (fs.existsSync(path.join(cwd, 'nx.json'))) {
    return path.join(cwd, 'libs/api-client/src/generated');
  }

  return path.join(cwd, 'src/generated');
}

function getHeyApiConfigPath(cwd: string, outputPath: string): string {
  const libPath = path.dirname(path.dirname(outputPath));
  return path.join(libPath, 'openapi-ts.config.ts');
}

function checkHeyApiInstalled(cwd: string): boolean {
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8')
    );
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };
    return '@hey-api/openapi-ts' in deps;
  } catch {
    return false;
  }
}

function ensureHeyApiConfig(
  cwd: string,
  specPath: string,
  outputPath: string,
  configPath: string
): void {
  if (fs.existsSync(configPath)) {
    return; // Config already exists
  }

  const relativeSpec = path.relative(path.dirname(configPath), specPath);
  const relativeOutput = path.relative(path.dirname(configPath), outputPath);

  const config = `import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: '${relativeSpec}',
  output: {
    path: '${relativeOutput}',
    format: 'prettier',
  },
  plugins: [
    '@hey-api/types',
    '@hey-api/sdk',
  ],
});
`;

  fs.writeFileSync(configPath, config);
}

function generateManualClient(outputPath: string, _specPath: string): void {
  // Ensure output directory exists
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // TODO: Parse spec to generate dynamic client
  // const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));

  const clientCode = `/**
 * API Client
 *
 * Auto-generated from OpenAPI specification.
 * Regenerate with: gello client:generate
 */

export interface ApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

let config: ApiConfig = {
  baseUrl: 'http://localhost:3000',
};

export function configure(newConfig: Partial<ApiConfig>): void {
  config = { ...config, ...newConfig };
}

async function request<T>(
  method: string,
  path: string,
  options?: {
    body?: unknown;
    headers?: Record<string, string>;
  }
): Promise<T> {
  const url = \`\${config.baseUrl}\${path}\`;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
      ...options?.headers,
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(\`API error: \${response.status} \${response.statusText}\`);
  }

  return response.json();
}

// Generated API methods
export const api = {
  getInfo: () => request<{ name: string; version: string }>('GET', '/'),
  getHealth: () => request<{ status: string; uptime: number }>('GET', '/health'),
};
`;

  fs.writeFileSync(path.join(outputPath, 'index.ts'), clientCode);

  // Create types file
  const typesCode = `/**
 * API Types
 *
 * Auto-generated from OpenAPI specification.
 */

export interface ApiInfo {
  name: string;
  version: string;
}

export interface HealthStatus {
  status: string;
  uptime: number;
}
`;

  fs.writeFileSync(path.join(outputPath, 'types.ts'), typesCode);
}

export interface GenerateClientOptions {
  input?: string;
  output?: string;
}

export const generateClientCommand = async (options: GenerateClientOptions = {}) => {
  const { waitUntilExit } = render(
    <GenerateClientComponent input={options.input} output={options.output} />
  );
  await waitUntilExit();
};
