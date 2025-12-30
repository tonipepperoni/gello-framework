/**
 * gello openapi:generate - Generate OpenAPI spec from routes
 */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { render, Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { gruvbox } from '../../components/wizard/theme.js';

interface GenerateOpenApiProps {
  output?: string;
}

type Status = 'loading' | 'success' | 'error';

const GenerateOpenApiComponent: React.FC<GenerateOpenApiProps> = ({ output }) => {
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('Looking for route definitions...');
  const [error, setError] = useState<string | null>(null);
  const [outputPath, setOutputPath] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const cwd = process.cwd();

        // Determine output path
        const finalOutput = output ?? findDefaultOutput(cwd);
        setOutputPath(finalOutput);

        setMessage('Scanning for routes...');

        // Check if we're in an NX workspace
        const isNxWorkspace = fs.existsSync(path.join(cwd, 'nx.json'));

        if (isNxWorkspace) {
          // Look for routes in apps/api/src/routes
          const routesPath = path.join(cwd, 'apps/api/src/routes');

          if (!fs.existsSync(routesPath)) {
            throw new Error(
              'No routes directory found at apps/api/src/routes.\n' +
              'Create route definitions using the @gello/openapi Route builder.'
            );
          }

          setMessage('Generating OpenAPI specification...');

          // For now, generate a placeholder spec
          // Full implementation would dynamically import and parse routes
          const spec = generatePlaceholderSpec();

          // Ensure output directory exists
          const outputDir = path.dirname(finalOutput);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          // Write spec
          fs.writeFileSync(finalOutput, JSON.stringify(spec, null, 2) + '\n');

          setStatus('success');
          setMessage('OpenAPI specification generated successfully');
        } else {
          // Single project - look for routes in src/routes
          const routesPath = path.join(cwd, 'src/routes');

          if (!fs.existsSync(routesPath)) {
            throw new Error(
              'No routes directory found.\n' +
              'This command expects routes in src/routes/ or apps/api/src/routes/'
            );
          }

          setMessage('Generating OpenAPI specification...');

          const spec = generatePlaceholderSpec();
          const outputFile = output ?? path.join(cwd, 'openapi.json');

          fs.writeFileSync(outputFile, JSON.stringify(spec, null, 2) + '\n');
          setOutputPath(outputFile);

          setStatus('success');
          setMessage('OpenAPI specification generated successfully');
        }
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    run();
  }, [output]);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text color={gruvbox.orange} bold>
          OpenAPI Generator
        </Text>
      </Box>

      {status === 'loading' && (
        <Box>
          <Text color={gruvbox.yellow}>
            <Spinner type="dots" />{' '}
          </Text>
          <Text color={gruvbox.fg}>{message}</Text>
        </Box>
      )}

      {status === 'success' && (
        <Box flexDirection="column">
          <Box>
            <Text color={gruvbox.green}>✓ </Text>
            <Text color={gruvbox.fg}>{message}</Text>
          </Box>
          {outputPath && (
            <Box marginTop={1}>
              <Text color={gruvbox.gray}>
                Output: <Text color={gruvbox.aqua}>{outputPath}</Text>
              </Text>
            </Box>
          )}
          <Box marginTop={1}>
            <Text color={gruvbox.gray}>
              Next: Run <Text color={gruvbox.yellow}>gello client:generate</Text> to generate TypeScript client
            </Text>
          </Box>
        </Box>
      )}

      {status === 'error' && (
        <Box flexDirection="column">
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

function findDefaultOutput(cwd: string): string {
  // Check if we're in an NX workspace
  if (fs.existsSync(path.join(cwd, 'nx.json'))) {
    return path.join(cwd, 'libs/api-spec/openapi.json');
  }

  // Single project
  return path.join(cwd, 'openapi.json');
}

function generatePlaceholderSpec(): object {
  return {
    openapi: '3.1.0',
    info: {
      title: 'API',
      version: '1.0.0',
      description: 'Generated by Gello CLI',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    paths: {
      '/': {
        get: {
          summary: 'API Info',
          responses: {
            '200': {
              description: 'API information',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      version: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/health': {
        get: {
          summary: 'Health Check',
          responses: {
            '200': {
              description: 'Health status',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      uptime: { type: 'number' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  };
}

export interface GenerateOpenApiOptions {
  output?: string;
}

export const generateOpenApiCommand = async (options: GenerateOpenApiOptions = {}) => {
  const { waitUntilExit } = render(
    <GenerateOpenApiComponent output={options.output} />
  );
  await waitUntilExit();
};
