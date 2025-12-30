/**
 * gello serve command - Start all development servers
 *
 * Usage: gello serve [--port 3000]
 *
 * Detects NX workspace and runs all apps in parallel.
 */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { render, Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { spawn } from 'node:child_process';
import { gruvbox } from '../components/wizard/theme.js';

// React is needed at runtime for JSX
void React;

export interface ServeOptions {
  port?: number;
}

interface AppInfo {
  name: string;
  path: string;
  type: 'api' | 'web' | 'mobile' | 'unknown';
}

/**
 * Detect apps in the workspace by scanning apps/ directory
 */
function detectApps(cwd: string): AppInfo[] {
  const appsDir = path.join(cwd, 'apps');
  if (!fs.existsSync(appsDir)) {
    return [];
  }

  const apps: AppInfo[] = [];
  const entries = fs.readdirSync(appsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const appPath = path.join(appsDir, entry.name);
    const projectJsonPath = path.join(appPath, 'project.json');

    if (fs.existsSync(projectJsonPath)) {
      let type: AppInfo['type'] = 'unknown';

      // Detect type based on name or content
      if (entry.name === 'api' || entry.name.includes('api')) {
        type = 'api';
      } else if (entry.name === 'web' || entry.name.includes('web')) {
        type = 'web';
      } else if (entry.name === 'mobile' || entry.name.includes('mobile')) {
        type = 'mobile';
      }

      apps.push({
        name: entry.name,
        path: appPath,
        type,
      });
    }
  }

  return apps;
}

interface ServeAppProps {
  port: number;
}

const ServeApp: React.FC<ServeAppProps> = ({ port }) => {
  const [status, setStatus] = useState<'checking' | 'starting' | 'running' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [isNxWorkspace, setIsNxWorkspace] = useState(false);

  useEffect(() => {
    const cwd = process.cwd();
    const nxJsonPath = path.join(cwd, 'nx.json');
    const packageJsonPath = path.join(cwd, 'package.json');

    // Check if we're in an NX workspace
    if (fs.existsSync(nxJsonPath)) {
      setIsNxWorkspace(true);
      const detectedApps = detectApps(cwd);
      setApps(detectedApps);

      if (detectedApps.length === 0) {
        setStatus('error');
        setError('No apps found in apps/ directory');
        return undefined;
      }

      setStatus('starting');

      // Set PORT environment variable
      const env = { ...process.env, PORT: String(port) };

      // Run nx run-many -t dev for all apps (excluding libs and CLI)
      const child = spawn('npx', ['nx', 'run-many', '-t', 'dev'], {
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
    }

    // Fallback: Check for simple Gello project (src/main.ts)
    const mainFile = path.join(cwd, 'src/main.ts');
    const apiMainFile = path.join(cwd, 'apps/api/src/main.ts');

    if (fs.existsSync(mainFile)) {
      setStatus('starting');

      const env = { ...process.env, PORT: String(port) };

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

      return () => {
        child.kill();
      };
    }

    // Check if we're in a subproject (apps/api)
    if (fs.existsSync(apiMainFile)) {
      setStatus('error');
      setError('Run "gello serve" from the project root directory, not from apps/api');
      return undefined;
    }

    // No valid project found
    if (!fs.existsSync(packageJsonPath)) {
      setStatus('error');
      setError('No package.json found. Are you in a Gello project directory?');
      return undefined;
    }

    setStatus('error');
    setError('No runnable app found. Expected nx.json or src/main.ts');
    return undefined;
  }, [port]);

  if (status === 'checking') {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Box>
          <Text color={gruvbox.yellow}>
            <Spinner type="dots" />
          </Text>
          <Text color={gruvbox.fg}> Detecting project structure...</Text>
        </Box>
      </Box>
    );
  }

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
          <Text color={gruvbox.fg}> Starting development servers...</Text>
        </Box>
        {isNxWorkspace && apps.length > 0 && (
          <Box flexDirection="column" marginTop={1}>
            {apps.map((app) => (
              <Box key={app.name} marginLeft={2}>
                <Text color={gruvbox.gray}>• </Text>
                <Text color={gruvbox.aqua}>{app.name}</Text>
                <Text color={gruvbox.gray}> ({app.type})</Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  }

  // Running - the spawned process handles output directly via stdio: 'inherit'
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
