/**
 * gello serve command - Start the development server
 *
 * Usage: gello serve [--port 3000]
 */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { render, Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { spawn } from 'node:child_process';

// React is needed at runtime for JSX
void React;

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

export interface ServeOptions {
  port?: number;
}

interface ServeAppProps {
  port: number;
}

const ServeApp: React.FC<ServeAppProps> = ({ port }) => {
  const [status, setStatus] = useState<'starting' | 'running' | 'error'>('starting');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cwd = process.cwd();
    const mainFile = path.join(cwd, 'src/main.ts');
    const packageJson = path.join(cwd, 'package.json');

    // Check if we're in a Gello project
    if (!fs.existsSync(mainFile)) {
      setStatus('error');
      setError('No src/main.ts found. Are you in a Gello project directory?');
      return;
    }

    if (!fs.existsSync(packageJson)) {
      setStatus('error');
      setError('No package.json found. Are you in a Gello project directory?');
      return;
    }

    // Set PORT environment variable
    const env = { ...process.env, PORT: String(port) };

    // Start the server using tsx
    const child = spawn('npx', ['tsx', '--watch', 'src/main.ts'], {
      cwd,
      env,
      stdio: 'inherit',
      shell: true,
    });

    setStatus('running');

    child.on('error', (err) => {
      setStatus('error');
      setError(err.message);
    });

    child.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        setStatus('error');
        setError(`Process exited with code ${code}`);
      }
    });

    // Cleanup on unmount
    return () => {
      child.kill();
    };
  }, [port]);

  if (status === 'error') {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Box>
          <Text color={gruvbox.red}>✗ Error: {error}</Text>
        </Box>
      </Box>
    );
  }

  if (status === 'starting') {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Box>
          <Text color={gruvbox.yellow}>
            <Spinner type="dots" />
          </Text>
          <Text color={gruvbox.fg}> Starting development server...</Text>
        </Box>
      </Box>
    );
  }

  // Running - the tsx process handles output directly via stdio: 'inherit'
  return null;
};

/**
 * Execute the serve command
 */
export const serveCommand = async (options: ServeOptions = {}) => {
  const port = options.port || 3000;

  const { waitUntilExit } = render(<ServeApp port={port} />);

  await waitUntilExit();
};

export default serveCommand;
