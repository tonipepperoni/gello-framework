/**
 * RouteList - Beautiful TUI component for displaying routes
 * Gruvbox dark theme inspired styling
 */
import * as React from 'react';
import { Box, Text } from 'ink';
import { gruvbox, GELLO_LOGO } from './wizard/theme.js';

export interface RouteInfo {
  method: string;
  path: string;
  handler: string;
  middleware?: string[];
}

export interface RouteListProps {
  routes: RouteInfo[];
  appName?: string;
}

// Method colors using neutral theme
const methodColors: Record<string, string> = {
  GET: gruvbox.success,
  POST: gruvbox.warning,
  PUT: gruvbox.primary,
  PATCH: gruvbox.purple,
  DELETE: gruvbox.error,
  HEAD: gruvbox.info,
  OPTIONS: gruvbox.gray,
};

const MethodBadge: React.FC<{ method: string }> = ({ method }) => {
  const color = methodColors[method] || gruvbox.fg;
  const padded = method.padEnd(7);
  return (
    <Text color={color} bold>
      {padded}
    </Text>
  );
};

const RouteRow: React.FC<{ route: RouteInfo }> = ({ route }) => {
  return (
    <Box>
      <Box width={10}>
        <MethodBadge method={route.method} />
      </Box>
      <Box width={35}>
        <Text color={gruvbox.aqua}>{route.path}</Text>
      </Box>
      <Box>
        <Text color={gruvbox.fg4}>{route.handler}</Text>
      </Box>
    </Box>
  );
};

const Divider: React.FC<{ width?: number }> = ({ width = 78 }) => (
  <Box>
    <Text color={gruvbox.bg2}>{'─'.repeat(width)}</Text>
  </Box>
);

const Header: React.FC = () => (
  <Box marginBottom={0}>
    <Box width={10}>
      <Text bold color={gruvbox.fg}>
        METHOD
      </Text>
    </Box>
    <Box width={35}>
      <Text bold color={gruvbox.fg}>
        PATH
      </Text>
    </Box>
    <Box>
      <Text bold color={gruvbox.fg}>
        HANDLER
      </Text>
    </Box>
  </Box>
);

export const RouteList: React.FC<RouteListProps> = ({ routes, appName = 'Gello App' }) => {
  // Group routes by path prefix
  const groupedRoutes = routes.reduce(
    (acc, route) => {
      const prefix = route.path.split('/')[1] || 'root';
      if (!acc[prefix]) {
        acc[prefix] = [];
      }
      acc[prefix].push(route);
      return acc;
    },
    {} as Record<string, RouteInfo[]>
  );

  const totalRoutes = routes.length;
  const methodCounts = routes.reduce(
    (acc, route) => {
      acc[route.method] = (acc[route.method] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Logo */}
      <Box marginBottom={1}>
        <Text color={gruvbox.orange}>{GELLO_LOGO}</Text>
      </Box>

      {/* Title */}
      <Box marginBottom={1} flexDirection="column">
        <Box>
          <Text color={gruvbox.fg} bold>
            Route List
          </Text>
          <Text color={gruvbox.gray}> • </Text>
          <Text color={gruvbox.fg4}>{appName}</Text>
        </Box>
      </Box>

      {/* Stats Bar */}
      <Box marginBottom={1} gap={2}>
        <Text>
          <Text color={gruvbox.gray}>Total: </Text>
          <Text bold color={gruvbox.orange}>
            {totalRoutes}
          </Text>
          <Text color={gruvbox.gray}> routes</Text>
        </Text>
        <Text color={gruvbox.bg2}>│</Text>
        {Object.entries(methodCounts).map(([method, count]) => (
          <Text key={method}>
            <Text color={methodColors[method]}>{method}</Text>
            <Text color={gruvbox.gray}>:</Text>
            <Text color={gruvbox.fg4}>{count}</Text>
          </Text>
        ))}
      </Box>

      <Divider />

      {/* Header */}
      <Header />

      <Divider />

      {/* Routes by group */}
      {Object.entries(groupedRoutes).map(([prefix, groupRoutes]) => (
        <Box key={prefix} flexDirection="column" marginY={0}>
          {/* Group Header */}
          <Box marginTop={1} marginBottom={0}>
            <Text color={gruvbox.yellow} bold>
              /{prefix === 'root' ? '' : prefix}
            </Text>
          </Box>

          {/* Routes in group */}
          {groupRoutes.map((route) => (
            <RouteRow key={`${route.method}-${route.path}`} route={route} />
          ))}
        </Box>
      ))}

      <Divider />

      {/* Footer */}
      <Box marginTop={1}>
        <Text color={gruvbox.gray}>
          Run <Text color={gruvbox.aqua}>gello route:list --json</Text> for machine-readable output
        </Text>
      </Box>
    </Box>
  );
};

export default RouteList;
