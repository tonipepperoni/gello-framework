#!/usr/bin/env node
/**
 * Gello CLI - Developer tools for the Gello framework
 * Gruvbox dark theme inspired styling
 *
 * Commands:
 *   new           Create a new Gello project
 *   route:list    Display all registered routes
 *   make:*        Code generators (coming soon)
 *   migrate:*     Database migrations (coming soon)
 *   queue:*       Queue management (coming soon)
 */
import * as React from 'react';
import { render, Box, Text } from 'ink';
import { routeListCommand } from './commands/route-list.js';
import { newCommand } from './commands/new/index.js';
import { serveCommand } from './commands/serve.js';
import { storageCommand, storageConfigCommand } from './commands/storage.js';
import { generateOpenApiCommand, generateClientCommand } from './commands/openapi/index.js';

// Gruvbox dark palette
const gruvbox = {
  bg: '#282828',
  fg: '#ebdbb2',
  gray: '#928374',
  red: '#fb4934',
  green: '#b8bb26',
  yellow: '#fabd2f',
  blue: '#83a598',
  purple: '#d3869b',
  aqua: '#8ec07c',
  orange: '#fe8019',
  bg1: '#3c3836',
  bg2: '#504945',
  fg4: '#a89984',
};

// Solid block-style logo
const GELLO_LOGO = `
 ██████╗ ███████╗██╗     ██╗      ██████╗
██╔════╝ ██╔════╝██║     ██║     ██╔═══██╗
██║  ███╗█████╗  ██║     ██║     ██║   ██║
██║   ██║██╔══╝  ██║     ██║     ██║   ██║
╚██████╔╝███████╗███████╗███████╗╚██████╔╝
 ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝
`.trim();

interface HelpScreenProps {
  version: string;
}

const HelpScreen: React.FC<HelpScreenProps> = ({ version }) => (
  <Box flexDirection="column" paddingX={2} paddingY={1}>
    {/* Logo */}
    <Box marginBottom={1}>
      <Text color={gruvbox.orange}>{GELLO_LOGO}</Text>
    </Box>

    {/* Version */}
    <Box marginBottom={1}>
      <Text color={gruvbox.gray}>Version {version}</Text>
    </Box>

    {/* Description */}
    <Box marginBottom={1}>
      <Text color={gruvbox.fg}>A TypeScript backend framework built on Effect</Text>
    </Box>

    {/* Usage */}
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={gruvbox.yellow}>
        Usage:
      </Text>
      <Box marginLeft={2}>
        <Text color={gruvbox.fg}>gello {'<command>'} [options]</Text>
      </Box>
    </Box>

    {/* Commands */}
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={gruvbox.yellow}>
        Commands:
      </Text>

      {/* Project */}
      <Box marginLeft={2} marginTop={1}>
        <Text color={gruvbox.aqua} bold>
          Project
        </Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.green}>new {'<name>'}</Text>
        </Box>
        <Text color={gruvbox.gray}>Create a new Gello project</Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.green}>serve</Text>
        </Box>
        <Text color={gruvbox.gray}>Start the development server</Text>
      </Box>

      {/* Routes */}
      <Box marginLeft={2} marginTop={1}>
        <Text color={gruvbox.aqua} bold>
          Routes
        </Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.green}>route:list</Text>
        </Box>
        <Text color={gruvbox.gray}>Display all registered routes</Text>
      </Box>

      {/* Storage */}
      <Box marginLeft={2} marginTop={1}>
        <Text color={gruvbox.aqua} bold>
          Storage
        </Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.green}>storage</Text>
        </Box>
        <Text color={gruvbox.gray}>Show storage configuration status</Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.green}>storage:config</Text>
        </Box>
        <Text color={gruvbox.gray}>Generate storage config module</Text>
      </Box>

      {/* OpenAPI */}
      <Box marginLeft={2} marginTop={1}>
        <Text color={gruvbox.aqua} bold>
          OpenAPI
        </Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.green}>openapi:generate</Text>
        </Box>
        <Text color={gruvbox.gray}>Generate OpenAPI spec from routes</Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.green}>client:generate</Text>
        </Box>
        <Text color={gruvbox.gray}>Generate TypeScript client</Text>
      </Box>

      {/* Generators */}
      <Box marginLeft={2} marginTop={1}>
        <Text color={gruvbox.aqua} bold>
          Generators
        </Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.bg2}>make:controller</Text>
        </Box>
        <Text color={gruvbox.gray}>(coming soon)</Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.bg2}>make:service</Text>
        </Box>
        <Text color={gruvbox.gray}>(coming soon)</Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.bg2}>make:job</Text>
        </Box>
        <Text color={gruvbox.gray}>(coming soon)</Text>
      </Box>

      {/* Database */}
      <Box marginLeft={2} marginTop={1}>
        <Text color={gruvbox.aqua} bold>
          Database
        </Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.bg2}>migrate</Text>
        </Box>
        <Text color={gruvbox.gray}>(coming soon)</Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.bg2}>migrate:make</Text>
        </Box>
        <Text color={gruvbox.gray}>(coming soon)</Text>
      </Box>

      {/* Queue */}
      <Box marginLeft={2} marginTop={1}>
        <Text color={gruvbox.aqua} bold>
          Queue
        </Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.bg2}>queue:work</Text>
        </Box>
        <Text color={gruvbox.gray}>(coming soon)</Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.bg2}>queue:status</Text>
        </Box>
        <Text color={gruvbox.gray}>(coming soon)</Text>
      </Box>
    </Box>

    {/* Options */}
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={gruvbox.yellow}>
        Options:
      </Text>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.green}>-h, --help</Text>
        </Box>
        <Text color={gruvbox.gray}>Show this help message</Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.green}>-v, --version</Text>
        </Box>
        <Text color={gruvbox.gray}>Show version number</Text>
      </Box>
      <Box marginLeft={4}>
        <Box width={25}>
          <Text color={gruvbox.green}>--json</Text>
        </Box>
        <Text color={gruvbox.gray}>Output as JSON</Text>
      </Box>
    </Box>

    {/* Footer */}
    <Box marginTop={1}>
      <Text color={gruvbox.gray}>
        Documentation: <Text color={gruvbox.aqua}>https://gello.dev/docs</Text>
      </Text>
    </Box>
  </Box>
);

// Parse command line arguments
const parseArgs = (args: string[]) => {
  let command: string | undefined;
  const options: Record<string, string | boolean> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith('-')) {
        options[key] = nextArg;
        i++;
      } else {
        options[key] = true;
      }
    } else if (arg.startsWith('-')) {
      const key = arg.slice(1);
      options[key] = true;
    } else if (!command) {
      command = arg;
    }
  }

  return { command, options };
};

// Main entry point
const main = async () => {
  const args = process.argv.slice(2);
  const { command, options } = parseArgs(args);

  // Version flag
  if (options['v'] || options['version']) {
    console.log('0.1.0');
    return;
  }

  // Help or no command
  if (!command || options['h'] || options['help']) {
    const { waitUntilExit } = render(<HelpScreen version="0.1.0" />);
    await waitUntilExit();
    return;
  }

  // Route commands
  switch (command) {
    case 'new': {
      const projectName = args[1];
      if (!projectName) {
        console.error('Error: Project name is required');
        console.log('Usage: gello new <project-name> [--template todo]');
        process.exit(1);
      }
      await newCommand({
        name: projectName,
        template: options['template'] as string,
      });
      break;
    }

    case 'serve':
    case 'dev':
      await serveCommand({
        port: options['port'] ? Number(options['port']) : undefined,
      });
      break;

    case 'route:list':
    case 'routes':
      await routeListCommand({
        json: options['json'] as boolean,
        path: options['path'] as string,
        method: options['method'] as string,
      });
      break;

    case 'storage':
      await storageCommand({ command: 'status' });
      break;

    case 'storage:config':
      await storageConfigCommand(options['output'] as string);
      break;

    case 'openapi:generate':
      await generateOpenApiCommand({
        output: options['output'] as string,
      });
      break;

    case 'client:generate':
      await generateClientCommand({
        input: options['input'] as string,
        output: options['output'] as string,
      });
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.log('Run "gello --help" for usage information.');
      process.exit(1);
  }
};

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
