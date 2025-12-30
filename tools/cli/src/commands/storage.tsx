/**
 * gello storage command - Manage storage configuration
 *
 * Usage:
 *   gello storage          - Show storage configuration status
 *   gello storage:config   - Generate storage config module
 */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { render, Box, Text } from 'ink';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { gruvbox } from '../components/wizard/theme.js';

// React is needed at runtime for JSX
void React;

// ============================================================================
// Storage Status Command
// ============================================================================

interface DiskInfo {
  name: string;
  driver: string;
  configured: boolean;
  details: string;
}

const StorageStatus: React.FC = () => {
  const [disks, setDisks] = useState<DiskInfo[]>([]);
  const [defaultDisk, setDefaultDisk] = useState<string>('local');

  useEffect(() => {
    const env = process.env as Record<string, string | undefined>;
    const detected: DiskInfo[] = [];

    // Detect configured disks from environment
    setDefaultDisk(env['FILESYSTEM_DISK'] ?? 'local');

    // Local disk
    detected.push({
      name: 'local',
      driver: 'local',
      configured: true, // Always available as fallback
      details: env['FILESYSTEM_LOCAL_ROOT'] ?? './storage',
    });

    // S3 disk
    if (env['AWS_BUCKET']) {
      detected.push({
        name: 's3',
        driver: 's3',
        configured: true,
        details: `${env['AWS_BUCKET']} (${env['AWS_DEFAULT_REGION'] ?? 'us-east-1'})`,
      });
    } else {
      detected.push({
        name: 's3',
        driver: 's3',
        configured: false,
        details: 'AWS_BUCKET not set',
      });
    }

    // Azure disk
    if (env['AZURE_STORAGE_ACCOUNT']) {
      detected.push({
        name: 'azure',
        driver: 'azure',
        configured: true,
        details: `${env['AZURE_STORAGE_ACCOUNT']}/${env['AZURE_STORAGE_CONTAINER'] ?? '(no container)'}`,
      });
    } else {
      detected.push({
        name: 'azure',
        driver: 'azure',
        configured: false,
        details: 'AZURE_STORAGE_ACCOUNT not set',
      });
    }

    // GCS disk
    if (env['GCS_PROJECT_ID']) {
      detected.push({
        name: 'gcs',
        driver: 'gcs',
        configured: true,
        details: `${env['GCS_PROJECT_ID']}/${env['GCS_BUCKET'] ?? '(no bucket)'}`,
      });
    } else {
      detected.push({
        name: 'gcs',
        driver: 'gcs',
        configured: false,
        details: 'GCS_PROJECT_ID not set',
      });
    }

    setDisks(detected);
  }, []);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color={gruvbox.orange} bold>
          Storage Configuration
        </Text>
      </Box>

      {/* Default disk */}
      <Box marginBottom={1}>
        <Text color={gruvbox.gray}>
          Default disk: <Text color={gruvbox.aqua}>{defaultDisk}</Text>
        </Text>
      </Box>

      {/* Disks table header */}
      <Box>
        <Box width={12}>
          <Text color={gruvbox.gray} bold>DISK</Text>
        </Box>
        <Box width={10}>
          <Text color={gruvbox.gray} bold>DRIVER</Text>
        </Box>
        <Box width={12}>
          <Text color={gruvbox.gray} bold>STATUS</Text>
        </Box>
        <Box>
          <Text color={gruvbox.gray} bold>DETAILS</Text>
        </Box>
      </Box>

      {/* Divider */}
      <Box marginBottom={1}>
        <Text color={gruvbox.bg2}>{'─'.repeat(60)}</Text>
      </Box>

      {/* Disks */}
      {disks.map((disk) => (
        <Box key={disk.name}>
          <Box width={12}>
            <Text color={disk.name === defaultDisk ? gruvbox.yellow : gruvbox.fg}>
              {disk.name === defaultDisk ? '● ' : '  '}{disk.name}
            </Text>
          </Box>
          <Box width={10}>
            <Text color={gruvbox.purple}>{disk.driver}</Text>
          </Box>
          <Box width={12}>
            {disk.configured ? (
              <Text color={gruvbox.green}>✓ ready</Text>
            ) : (
              <Text color={gruvbox.gray}>○ disabled</Text>
            )}
          </Box>
          <Box>
            <Text color={gruvbox.fg4}>{disk.details}</Text>
          </Box>
        </Box>
      ))}

      {/* Help */}
      <Box marginTop={1} flexDirection="column">
        <Text color={gruvbox.gray}>
          Run <Text color={gruvbox.yellow}>gello storage:config</Text> to generate storage config module
        </Text>
      </Box>
    </Box>
  );
};

// ============================================================================
// Storage Config Generator
// ============================================================================

interface ConfigGeneratorProps {
  outputDir: string;
}

const ConfigGenerator: React.FC<ConfigGeneratorProps> = ({ outputDir }) => {
  const [status, setStatus] = useState<'generating' | 'done' | 'error'>('generating');
  const [error, setError] = useState<string | null>(null);
  const [createdFiles, setCreatedFiles] = useState<string[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const files: string[] = [];

        // Create services directory if needed
        const servicesDir = path.join(outputDir, 'src', 'services');
        if (!fs.existsSync(servicesDir)) {
          fs.mkdirSync(servicesDir, { recursive: true });
        }

        // Write storage service module
        const storagePath = path.join(servicesDir, 'storage.ts');
        fs.writeFileSync(storagePath, storageServiceTemplate);
        files.push('src/services/storage.ts');

        // Update .env.example if it exists
        const envExamplePath = path.join(outputDir, '.env.example');
        if (fs.existsSync(envExamplePath)) {
          const existing = fs.readFileSync(envExamplePath, 'utf-8');
          if (!existing.includes('FILESYSTEM_DISK')) {
            fs.appendFileSync(envExamplePath, envStorageTemplate);
            files.push('.env.example (updated)');
          }
        }

        setCreatedFiles(files);
        setStatus('done');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('error');
      }
    };

    run();
  }, [outputDir]);

  if (status === 'error') {
    return (
      <Box paddingX={2} paddingY={1}>
        <Text color={gruvbox.red}>✗ Error: {error}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text color={gruvbox.orange} bold>
          Storage Configuration Generated
        </Text>
      </Box>

      {createdFiles.map((file) => (
        <Box key={file}>
          <Text color={gruvbox.green}>✓ </Text>
          <Text color={gruvbox.fg}>{file}</Text>
        </Box>
      ))}

      <Box marginTop={1} flexDirection="column">
        <Text color={gruvbox.gray}>Next steps:</Text>
        <Box marginLeft={2} flexDirection="column">
          <Text color={gruvbox.yellow}>1. pnpm add @gello/storage @gello/storage-drivers</Text>
          <Text color={gruvbox.yellow}>2. Configure FILESYSTEM_DISK in .env</Text>
          <Text color={gruvbox.yellow}>3. Import StorageLive in your app</Text>
        </Box>
      </Box>
    </Box>
  );
};

// ============================================================================
// Templates
// ============================================================================

const storageServiceTemplate = `/**
 * Storage Service Setup
 *
 * Provides a configured storage layer using @gello/storage.
 * Supports multiple disk drivers: local, s3, azure, gcs, memory.
 */
import { Effect, Layer } from 'effect';
import {
  Storage,
  StorageManager,
  StorageManagerBuilder,
  registerDiskFactory,
  readStorageConfigFromEnv,
  makeStorageLayerFromConfig,
  type StorageService,
} from '@gello/storage';
import {
  makeLocalDisk,
  makeMemoryDisk,
  makeNullDisk,
  makeS3Disk,
  makeAzureDisk,
  makeGCSDisk,
} from '@gello/storage-drivers';

// ============================================================================
// Register Disk Factories
// ============================================================================

// Register factories for each driver type
// These are used by makeStorageLayerFromConfig to create disk instances

registerDiskFactory('local', (config) => {
  if (config.driver !== 'local') throw new Error('Invalid config');
  return makeLocalDisk({
    root: config.root,
    publicUrl: config.publicUrl,
    visibility: config.visibility,
  });
});

registerDiskFactory('memory', () => makeMemoryDisk());

registerDiskFactory('null', (config) => {
  if (config.driver !== 'null') throw new Error('Invalid config');
  return makeNullDisk({
    simulateExists: config.simulateExists,
    visibility: config.visibility,
  });
});

registerDiskFactory('s3', (config) => {
  if (config.driver !== 's3') throw new Error('Invalid config');
  return makeS3Disk({
    bucket: config.bucket,
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    endpoint: config.endpoint,
    forcePathStyle: config.forcePathStyle,
    publicUrl: config.publicUrl,
    visibility: config.visibility,
    prefix: config.prefix,
  });
});

registerDiskFactory('azure', (config) => {
  if (config.driver !== 'azure') throw new Error('Invalid config');
  return makeAzureDisk({
    accountName: config.accountName,
    accountKey: config.accountKey,
    container: config.container,
    endpoint: config.endpoint,
    publicUrl: config.publicUrl,
    visibility: config.visibility,
    prefix: config.prefix,
  });
});

registerDiskFactory('gcs', (config) => {
  if (config.driver !== 'gcs') throw new Error('Invalid config');
  return makeGCSDisk({
    projectId: config.projectId,
    bucket: config.bucket,
    keyFilename: config.keyFilename,
    publicUrl: config.publicUrl,
    visibility: config.visibility,
    prefix: config.prefix,
  });
});

// ============================================================================
// Storage Layer
// ============================================================================

/**
 * Create the storage layer from environment configuration.
 *
 * Reads FILESYSTEM_DISK and related env vars to determine which
 * disk drivers to configure.
 *
 * @example
 * \`\`\`typescript
 * const program = Effect.gen(function* () {
 *   const storage = yield* Storage;
 *   yield* storage.put('hello.txt', 'Hello, World!');
 *   const content = yield* storage.getString('hello.txt');
 *   console.log(content);
 * });
 *
 * Effect.runPromise(
 *   program.pipe(
 *     Effect.provide(StorageLive)
 *   )
 * );
 * \`\`\`
 */
export const StorageLive: Effect.Effect<Layer.Layer<StorageService>, unknown> =
  Effect.gen(function* () {
    const config = readStorageConfigFromEnv();
    return yield* makeStorageLayerFromConfig(config);
  });

/**
 * Create storage layer synchronously (for simpler setup).
 * This version creates layers immediately using Effect.runSync.
 */
export const createStorageLayer = (): Layer.Layer<StorageService> => {
  const config = readStorageConfigFromEnv();
  return Effect.runSync(Effect.flatten(makeStorageLayerFromConfig(config)));
};

// ============================================================================
// Storage Helpers
// ============================================================================

/**
 * Put a file to storage.
 */
export const storagePut = (path: string, contents: string | Uint8Array) =>
  Effect.gen(function* () {
    const storage = yield* Storage;
    yield* storage.put(path as any, contents);
  });

/**
 * Get file contents as string.
 */
export const storageGet = (path: string) =>
  Effect.gen(function* () {
    const storage = yield* Storage;
    return yield* storage.getString(path as any);
  });

/**
 * Check if a file exists.
 */
export const storageExists = (path: string) =>
  Effect.gen(function* () {
    const storage = yield* Storage;
    return yield* storage.exists(path as any);
  });

/**
 * Delete a file.
 */
export const storageDelete = (path: string) =>
  Effect.gen(function* () {
    const storage = yield* Storage;
    yield* storage.delete(path as any);
  });

/**
 * Get the public URL for a file.
 */
export const storageUrl = (path: string) =>
  Effect.gen(function* () {
    const storage = yield* Storage;
    return yield* storage.url(path as any);
  });

/**
 * List files in a directory.
 */
export const storageFiles = (directory?: string) =>
  Effect.gen(function* () {
    const storage = yield* Storage;
    return yield* storage.files(directory);
  });
`;

const envStorageTemplate = `
# ─── Storage ─────────────────────────────────────────────────────────────────
# Filesystem disk driver: "local" (default), "s3", "azure", "gcs", "memory", "null"

FILESYSTEM_DISK=local

# Local disk configuration
FILESYSTEM_LOCAL_ROOT=./storage
FILESYSTEM_LOCAL_PUBLIC_URL=
FILESYSTEM_LOCAL_VISIBILITY=private

# S3 disk configuration (also works with R2, MinIO, etc.)
# AWS_BUCKET=my-bucket
# AWS_DEFAULT_REGION=us-east-1
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_ENDPOINT=                    # Custom endpoint for S3-compatible services
# AWS_USE_PATH_STYLE_ENDPOINT=false
# AWS_PUBLIC_URL=
# AWS_PREFIX=

# Azure Blob Storage configuration
# AZURE_STORAGE_ACCOUNT=
# AZURE_STORAGE_KEY=
# AZURE_STORAGE_CONTAINER=
# AZURE_STORAGE_ENDPOINT=
# AZURE_PUBLIC_URL=
# AZURE_PREFIX=

# Google Cloud Storage configuration
# GCS_PROJECT_ID=
# GCS_BUCKET=
# GCS_KEY_FILE=
# GCS_PUBLIC_URL=
# GCS_PREFIX=
`;

// ============================================================================
// Command Entry Points
// ============================================================================

export interface StorageCommandOptions {
  command?: 'status' | 'config';
  outputDir?: string;
}

export const storageCommand = async (options: StorageCommandOptions = {}) => {
  const command = options.command ?? 'status';
  const outputDir = options.outputDir ?? process.cwd();

  if (command === 'config') {
    const { waitUntilExit } = render(
      <ConfigGenerator outputDir={outputDir} />
    );
    await waitUntilExit();
  } else {
    const { waitUntilExit } = render(<StorageStatus />);
    await waitUntilExit();
  }
};

export const storageConfigCommand = async (outputDir?: string) => {
  const { waitUntilExit } = render(
    <ConfigGenerator outputDir={outputDir ?? process.cwd()} />
  );
  await waitUntilExit();
};

export default storageCommand;
