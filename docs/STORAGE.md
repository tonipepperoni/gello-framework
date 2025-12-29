# Storage System Design

> Laravel-inspired filesystem abstraction with Hexagonal DDD Architecture for Effect-TS

## Overview

A type-safe, functional filesystem abstraction inspired by Laravel 4.2's Storage facade, built with Effect-TS patterns and hexagonal (ports & adapters) architecture. Provides a unified API for local filesystem, S3, Azure Blob, Google Cloud Storage, and other backends.

## Laravel 4.2 Storage Features to Implement

| Feature | Laravel API | Gello API | Priority |
|---------|-------------|-----------|----------|
| Get file | `Storage::get('file.txt')` | `Storage.get('file.txt')` | P0 |
| Put file | `Storage::put('file.txt', $contents)` | `Storage.put('file.txt', contents)` | P0 |
| Exists | `Storage::exists('file.txt')` | `Storage.exists('file.txt')` | P0 |
| Delete | `Storage::delete('file.txt')` | `Storage.delete('file.txt')` | P0 |
| Copy | `Storage::copy('old.txt', 'new.txt')` | `Storage.copy('old.txt', 'new.txt')` | P0 |
| Move | `Storage::move('old.txt', 'new.txt')` | `Storage.move('old.txt', 'new.txt')` | P0 |
| Size | `Storage::size('file.txt')` | `Storage.size('file.txt')` | P1 |
| Last modified | `Storage::lastModified('file.txt')` | `Storage.lastModified('file.txt')` | P1 |
| URL | `Storage::url('file.txt')` | `Storage.url('file.txt')` | P1 |
| Temporary URL | `Storage::temporaryUrl('file.txt', $exp)` | `Storage.temporaryUrl('file.txt', duration)` | P1 |
| Prepend | `Storage::prepend('file.txt', $data)` | `Storage.prepend('file.txt', data)` | P2 |
| Append | `Storage::append('file.txt', $data)` | `Storage.append('file.txt', data)` | P2 |
| Visibility | `Storage::setVisibility('file', 'public')` | `Storage.setVisibility('file', 'public')` | P2 |
| Get visibility | `Storage::getVisibility('file')` | `Storage.getVisibility('file')` | P2 |
| Files in dir | `Storage::files('directory')` | `Storage.files('directory')` | P1 |
| All files | `Storage::allFiles('directory')` | `Storage.allFiles('directory')` | P1 |
| Directories | `Storage::directories('directory')` | `Storage.directories('directory')` | P1 |
| All directories | `Storage::allDirectories('dir')` | `Storage.allDirectories('dir')` | P1 |
| Make directory | `Storage::makeDirectory('path')` | `Storage.makeDirectory('path')` | P1 |
| Delete directory | `Storage::deleteDirectory('path')` | `Storage.deleteDirectory('path')` | P1 |
| Disk | `Storage::disk('s3')` | `Storage.disk('s3')` | P0 |
| Put file from path | `Storage::putFile('dir', $file)` | `Storage.putFile('dir', file)` | P2 |
| Put file as | `Storage::putFileAs('dir', $file, 'name')` | `Storage.putFileAs('dir', file, 'name')` | P2 |
| Download | `Storage::download('file.txt')` | `Storage.download('file.txt')` | P2 |
| Read stream | `Storage::readStream('file.txt')` | `Storage.readStream('file.txt')` | P1 |
| Write stream | `Storage::writeStream('file.txt', $stream)` | `Storage.writeStream('file.txt', stream)` | P1 |

## Storage Disks (Drivers)

| Disk | Description | Use Case |
|------|-------------|----------|
| `local` | Local filesystem (default) | Development, single-server apps |
| `public` | Local with public URL access | Publicly accessible files |
| `s3` | Amazon S3 / S3-compatible | Production, scalable storage |
| `azure` | Azure Blob Storage | Azure-hosted applications |
| `gcs` | Google Cloud Storage | GCP-hosted applications |
| `memory` | In-memory (volatile) | Testing, temporary files |
| `null` | No-op driver | Testing, disabling storage |
| `ftp` | FTP/SFTP | Legacy systems integration |

---

## Hexagonal DDD Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Application Layer                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    StorageService                            │   │
│  │  get, put, delete, copy, move, exists, url, stream, etc.    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    StorageManager                            │   │
│  │  disk('s3'), extend('custom', adapter), getDefaultDisk()    │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ uses
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Domain Layer                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  FilePath    │  │  FileInfo    │  │  StorageEntry            │  │
│  │  (branded)   │  │  (metadata)  │  │  { path, size, mime, ... }│  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Visibility  │  │  DiskName    │  │  StorageError (ADT)      │  │
│  │  pub/private │  │  (branded)   │  │  NotFound | Permission   │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ implements
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Ports (Interfaces)                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     Disk (Port)                              │   │
│  │  get(path): Effect<Uint8Array, StorageError>                 │   │
│  │  put(path, contents, options?): Effect<void, StorageError>   │   │
│  │  delete(path): Effect<boolean, StorageError>                 │   │
│  │  exists(path): Effect<boolean, StorageError>                 │   │
│  │  copy(from, to): Effect<void, StorageError>                  │   │
│  │  move(from, to): Effect<void, StorageError>                  │   │
│  │  url(path): Effect<string, StorageError>                     │   │
│  │  ...                                                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  StreamableDisk (Port)                       │   │
│  │  readStream(path): Effect<Stream<Uint8Array>, StorageError>  │   │
│  │  writeStream(path, stream): Effect<void, StorageError>       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  TemporaryUrlDisk (Port)                     │   │
│  │  temporaryUrl(path, expiration): Effect<string, StorageError>│   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ implemented by
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Adapters (Implementations)                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │  LocalDisk  │ │   S3Disk    │ │  AzureDisk  │ │   GCSDisk   │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ MemoryDisk  │ │  NullDisk   │ │   FTPDisk   │ │  SFTPDisk   │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
libs/storage/
├── core/                          # Domain + Application layers
│   ├── src/
│   │   ├── index.ts              # Public exports
│   │   ├── lib/
│   │   │   ├── Storage.ts        # Main Storage service (application layer)
│   │   │   ├── StorageManager.ts # Multi-disk manager
│   │   │   │
│   │   │   ├── domain/           # Domain layer
│   │   │   │   ├── FilePath.ts   # Branded path type with validation
│   │   │   │   ├── FileInfo.ts   # File metadata value object
│   │   │   │   ├── Visibility.ts # Public/Private enum
│   │   │   │   ├── DiskName.ts   # Branded disk identifier
│   │   │   │   ├── MimeType.ts   # MIME type detection
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── ports/            # Port interfaces
│   │   │   │   ├── Disk.ts       # Core disk interface
│   │   │   │   ├── StreamableDisk.ts
│   │   │   │   ├── TemporaryUrlDisk.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── errors/           # Domain errors
│   │   │       ├── StorageError.ts
│   │   │       └── index.ts
│   │   │
│   │   └── testing/              # Test utilities
│   │       └── MockStorage.ts
│   │
│   ├── package.json
│   └── project.json
│
├── drivers/                       # Adapter implementations
│   ├── src/
│   │   ├── index.ts
│   │   ├── lib/
│   │   │   ├── LocalDisk.ts      # Local filesystem
│   │   │   ├── S3Disk.ts         # Amazon S3 / S3-compatible
│   │   │   ├── AzureDisk.ts      # Azure Blob Storage
│   │   │   ├── GCSDisk.ts        # Google Cloud Storage
│   │   │   ├── MemoryDisk.ts     # In-memory (testing)
│   │   │   ├── NullDisk.ts       # No-op
│   │   │   ├── FTPDisk.ts        # FTP support
│   │   │   └── SFTPDisk.ts       # SFTP support
│   │   │
│   │   └── testing/
│   │       └── index.ts
│   │
│   ├── package.json
│   └── project.json
```

---

## Domain Layer

### FilePath (Branded Type)

```typescript
import { Brand, Effect } from 'effect';

export type FilePath = string & Brand.Brand<'FilePath'>;
export const FilePath = Brand.nominal<FilePath>();

// Path validation rules
const INVALID_CHARS = /[<>:"|?*\x00-\x1f]/;
const DOUBLE_DOTS = /\.\./;
const MAX_PATH_LENGTH = 1024;

export const makeFilePath = (path: string): Effect.Effect<FilePath, InvalidPathError> => {
  const normalized = normalizePath(path);

  if (normalized.length === 0) {
    return Effect.fail(new InvalidPathError({ path, reason: 'Path cannot be empty' }));
  }
  if (normalized.length > MAX_PATH_LENGTH) {
    return Effect.fail(new InvalidPathError({ path, reason: `Path exceeds ${MAX_PATH_LENGTH} characters` }));
  }
  if (INVALID_CHARS.test(normalized)) {
    return Effect.fail(new InvalidPathError({ path, reason: 'Path contains invalid characters' }));
  }
  if (DOUBLE_DOTS.test(normalized)) {
    return Effect.fail(new InvalidPathError({ path, reason: 'Path traversal (..) not allowed' }));
  }

  return Effect.succeed(FilePath(normalized));
};

// Normalize path separators and remove leading/trailing slashes
const normalizePath = (path: string): string =>
  path
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/');

// Path utilities
export const dirname = (path: FilePath): FilePath =>
  FilePath(path.split('/').slice(0, -1).join('/') || '.');

export const basename = (path: FilePath): string =>
  path.split('/').pop() ?? '';

export const extension = (path: FilePath): string => {
  const base = basename(path);
  const lastDot = base.lastIndexOf('.');
  return lastDot > 0 ? base.slice(lastDot + 1) : '';
};

export const join = (...parts: string[]): Effect.Effect<FilePath, InvalidPathError> =>
  makeFilePath(parts.filter(Boolean).join('/'));
```

### DiskName (Branded Type)

```typescript
export type DiskName = string & Brand.Brand<'DiskName'>;
export const DiskName = Brand.nominal<DiskName>();

const VALID_DISK_NAME = /^[a-z][a-z0-9_-]*$/;

export const makeDiskName = (name: string): Effect.Effect<DiskName, InvalidDiskNameError> =>
  VALID_DISK_NAME.test(name)
    ? Effect.succeed(DiskName(name))
    : Effect.fail(new InvalidDiskNameError({ name }));

// Built-in disk names
export const LOCAL = DiskName('local');
export const PUBLIC = DiskName('public');
export const S3 = DiskName('s3');
export const AZURE = DiskName('azure');
export const GCS = DiskName('gcs');
```

### Visibility

```typescript
import { Data } from 'effect';

export type Visibility = 'public' | 'private';

export const Visibility = {
  Public: 'public' as const,
  Private: 'private' as const,

  isPublic: (v: Visibility): boolean => v === 'public',
  isPrivate: (v: Visibility): boolean => v === 'private',
};
```

### FileInfo (Value Object)

```typescript
export interface FileInfo {
  readonly path: FilePath;
  readonly size: number;
  readonly mimeType: string | null;
  readonly lastModified: Date;
  readonly visibility: Visibility;
  readonly isDirectory: boolean;
  readonly checksum?: string;
  readonly metadata?: Record<string, string>;
}

export const FileInfo = {
  make: (props: Omit<FileInfo, 'isDirectory'> & { isDirectory?: boolean }): FileInfo => ({
    ...props,
    isDirectory: props.isDirectory ?? false,
  }),

  isFile: (info: FileInfo): boolean => !info.isDirectory,
  isDirectory: (info: FileInfo): boolean => info.isDirectory,
};
```

### MimeType Detection

```typescript
const MIME_TYPES: Record<string, string> = {
  // Images
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'webp': 'image/webp',
  'svg': 'image/svg+xml',
  'ico': 'image/x-icon',

  // Documents
  'pdf': 'application/pdf',
  'doc': 'application/msword',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'xls': 'application/vnd.ms-excel',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

  // Text
  'txt': 'text/plain',
  'html': 'text/html',
  'css': 'text/css',
  'js': 'text/javascript',
  'json': 'application/json',
  'xml': 'application/xml',
  'csv': 'text/csv',

  // Archives
  'zip': 'application/zip',
  'tar': 'application/x-tar',
  'gz': 'application/gzip',

  // Media
  'mp3': 'audio/mpeg',
  'mp4': 'video/mp4',
  'webm': 'video/webm',
};

export const guessMimeType = (path: FilePath): string | null => {
  const ext = extension(path).toLowerCase();
  return MIME_TYPES[ext] ?? null;
};
```

### StorageError (ADT)

```typescript
import { Data } from 'effect';

export class FileNotFoundError extends Data.TaggedError('FileNotFoundError')<{
  readonly path: FilePath;
  readonly disk: DiskName;
}> {}

export class FileExistsError extends Data.TaggedError('FileExistsError')<{
  readonly path: FilePath;
  readonly disk: DiskName;
}> {}

export class PermissionDeniedError extends Data.TaggedError('PermissionDeniedError')<{
  readonly path: FilePath;
  readonly disk: DiskName;
  readonly operation: 'read' | 'write' | 'delete';
}> {}

export class DiskNotFoundError extends Data.TaggedError('DiskNotFoundError')<{
  readonly disk: string;
}> {}

export class DiskConnectionError extends Data.TaggedError('DiskConnectionError')<{
  readonly disk: DiskName;
  readonly cause: unknown;
}> {}

export class InvalidPathError extends Data.TaggedError('InvalidPathError')<{
  readonly path: string;
  readonly reason: string;
}> {}

export class InvalidDiskNameError extends Data.TaggedError('InvalidDiskNameError')<{
  readonly name: string;
}> {}

export class StorageQuotaExceededError extends Data.TaggedError('StorageQuotaExceededError')<{
  readonly disk: DiskName;
  readonly requestedBytes: number;
  readonly availableBytes: number;
}> {}

export class StreamError extends Data.TaggedError('StreamError')<{
  readonly path: FilePath;
  readonly disk: DiskName;
  readonly cause: unknown;
}> {}

export type StorageError =
  | FileNotFoundError
  | FileExistsError
  | PermissionDeniedError
  | DiskNotFoundError
  | DiskConnectionError
  | InvalidPathError
  | InvalidDiskNameError
  | StorageQuotaExceededError
  | StreamError;
```

---

## Ports (Interfaces)

### Disk Port

```typescript
import { Effect, Option, Duration, Stream, Context } from 'effect';

export interface PutOptions {
  readonly visibility?: Visibility;
  readonly mimeType?: string;
  readonly metadata?: Record<string, string>;
  readonly checksum?: string;
}

export interface Disk {
  /**
   * Get file contents as bytes
   */
  readonly get: (path: FilePath) => Effect.Effect<Uint8Array, StorageError>;

  /**
   * Get file contents as string
   */
  readonly getString: (path: FilePath, encoding?: string) => Effect.Effect<string, StorageError>;

  /**
   * Store file contents
   */
  readonly put: (
    path: FilePath,
    contents: Uint8Array | string,
    options?: PutOptions
  ) => Effect.Effect<void, StorageError>;

  /**
   * Check if file exists
   */
  readonly exists: (path: FilePath) => Effect.Effect<boolean, StorageError>;

  /**
   * Check if path is missing
   */
  readonly missing: (path: FilePath) => Effect.Effect<boolean, StorageError>;

  /**
   * Delete a file
   */
  readonly delete: (path: FilePath) => Effect.Effect<boolean, StorageError>;

  /**
   * Delete multiple files
   */
  readonly deleteMany: (paths: ReadonlyArray<FilePath>) => Effect.Effect<void, StorageError>;

  /**
   * Copy a file
   */
  readonly copy: (from: FilePath, to: FilePath) => Effect.Effect<void, StorageError>;

  /**
   * Move a file
   */
  readonly move: (from: FilePath, to: FilePath) => Effect.Effect<void, StorageError>;

  /**
   * Get file size in bytes
   */
  readonly size: (path: FilePath) => Effect.Effect<number, StorageError>;

  /**
   * Get last modified timestamp
   */
  readonly lastModified: (path: FilePath) => Effect.Effect<Date, StorageError>;

  /**
   * Get file metadata
   */
  readonly getMetadata: (path: FilePath) => Effect.Effect<FileInfo, StorageError>;

  /**
   * Get public URL for file
   */
  readonly url: (path: FilePath) => Effect.Effect<string, StorageError>;

  /**
   * Get visibility
   */
  readonly getVisibility: (path: FilePath) => Effect.Effect<Visibility, StorageError>;

  /**
   * Set visibility
   */
  readonly setVisibility: (
    path: FilePath,
    visibility: Visibility
  ) => Effect.Effect<void, StorageError>;

  /**
   * Prepend to a file
   */
  readonly prepend: (path: FilePath, data: Uint8Array | string) => Effect.Effect<void, StorageError>;

  /**
   * Append to a file
   */
  readonly append: (path: FilePath, data: Uint8Array | string) => Effect.Effect<void, StorageError>;

  /**
   * List files in directory
   */
  readonly files: (directory?: FilePath) => Effect.Effect<ReadonlyArray<FilePath>, StorageError>;

  /**
   * List all files recursively
   */
  readonly allFiles: (directory?: FilePath) => Effect.Effect<ReadonlyArray<FilePath>, StorageError>;

  /**
   * List directories
   */
  readonly directories: (directory?: FilePath) => Effect.Effect<ReadonlyArray<FilePath>, StorageError>;

  /**
   * List all directories recursively
   */
  readonly allDirectories: (directory?: FilePath) => Effect.Effect<ReadonlyArray<FilePath>, StorageError>;

  /**
   * Create a directory
   */
  readonly makeDirectory: (path: FilePath) => Effect.Effect<void, StorageError>;

  /**
   * Delete a directory
   */
  readonly deleteDirectory: (path: FilePath) => Effect.Effect<void, StorageError>;
}

export class DiskTag extends Context.Tag('@gello/storage/Disk')<
  DiskTag,
  Disk
>() {}
```

### StreamableDisk Port

```typescript
export interface StreamableDisk extends Disk {
  /**
   * Get file as a stream
   */
  readonly readStream: (path: FilePath) => Effect.Effect<Stream.Stream<Uint8Array, StorageError>, StorageError>;

  /**
   * Write stream to file
   */
  readonly writeStream: (
    path: FilePath,
    stream: Stream.Stream<Uint8Array, never>,
    options?: PutOptions
  ) => Effect.Effect<void, StorageError>;
}

export class StreamableDiskTag extends Context.Tag('@gello/storage/StreamableDisk')<
  StreamableDiskTag,
  StreamableDisk
>() {}
```

### TemporaryUrlDisk Port

```typescript
export interface TemporaryUrlDisk extends Disk {
  /**
   * Generate a temporary signed URL
   */
  readonly temporaryUrl: (
    path: FilePath,
    expiration: Duration.Duration,
    options?: { readonly responseDisposition?: string }
  ) => Effect.Effect<string, StorageError>;

  /**
   * Generate a temporary upload URL (for direct client uploads)
   */
  readonly temporaryUploadUrl: (
    path: FilePath,
    expiration: Duration.Duration,
    options?: PutOptions
  ) => Effect.Effect<{ url: string; headers: Record<string, string> }, StorageError>;
}

export class TemporaryUrlDiskTag extends Context.Tag('@gello/storage/TemporaryUrlDisk')<
  TemporaryUrlDiskTag,
  TemporaryUrlDisk
>() {}
```

---

## Application Layer (Storage Service)

### Main Storage API

```typescript
import { Effect, Option, Duration, Stream, Context, Layer } from 'effect';

export interface StorageService {
  // File operations (auto-validates paths)
  readonly get: (path: string) => Effect.Effect<Uint8Array, StorageError>;
  readonly getString: (path: string, encoding?: string) => Effect.Effect<string, StorageError>;
  readonly put: (path: string, contents: Uint8Array | string, options?: PutOptions) => Effect.Effect<void, StorageError>;
  readonly exists: (path: string) => Effect.Effect<boolean, StorageError>;
  readonly missing: (path: string) => Effect.Effect<boolean, StorageError>;
  readonly delete: (path: string) => Effect.Effect<boolean, StorageError>;
  readonly copy: (from: string, to: string) => Effect.Effect<void, StorageError>;
  readonly move: (from: string, to: string) => Effect.Effect<void, StorageError>;

  // Metadata
  readonly size: (path: string) => Effect.Effect<number, StorageError>;
  readonly lastModified: (path: string) => Effect.Effect<Date, StorageError>;
  readonly mimeType: (path: string) => Effect.Effect<string | null, StorageError>;
  readonly getMetadata: (path: string) => Effect.Effect<FileInfo, StorageError>;

  // URLs
  readonly url: (path: string) => Effect.Effect<string, StorageError>;
  readonly temporaryUrl: (path: string, expiration: Duration.Duration) => Effect.Effect<string, StorageError>;

  // Visibility
  readonly getVisibility: (path: string) => Effect.Effect<Visibility, StorageError>;
  readonly setVisibility: (path: string, visibility: Visibility) => Effect.Effect<void, StorageError>;

  // Append/Prepend
  readonly prepend: (path: string, data: Uint8Array | string) => Effect.Effect<void, StorageError>;
  readonly append: (path: string, data: Uint8Array | string) => Effect.Effect<void, StorageError>;

  // Directory operations
  readonly files: (directory?: string) => Effect.Effect<ReadonlyArray<string>, StorageError>;
  readonly allFiles: (directory?: string) => Effect.Effect<ReadonlyArray<string>, StorageError>;
  readonly directories: (directory?: string) => Effect.Effect<ReadonlyArray<string>, StorageError>;
  readonly allDirectories: (directory?: string) => Effect.Effect<ReadonlyArray<string>, StorageError>;
  readonly makeDirectory: (path: string) => Effect.Effect<void, StorageError>;
  readonly deleteDirectory: (path: string) => Effect.Effect<void, StorageError>;

  // Streaming
  readonly readStream: (path: string) => Effect.Effect<Stream.Stream<Uint8Array, StorageError>, StorageError>;
  readonly writeStream: (path: string, stream: Stream.Stream<Uint8Array, never>, options?: PutOptions) => Effect.Effect<void, StorageError>;

  // File uploads (with auto-generated names)
  readonly putFile: (directory: string, contents: Uint8Array, options?: PutOptions) => Effect.Effect<FilePath, StorageError>;
  readonly putFileAs: (directory: string, contents: Uint8Array, name: string, options?: PutOptions) => Effect.Effect<FilePath, StorageError>;

  // Multi-disk access
  readonly disk: (name: string) => Effect.Effect<StorageService, StorageError>;
}

export class Storage extends Context.Tag('@gello/storage/Storage')<
  Storage,
  StorageService
>() {}
```

### StorageManager (Multi-Disk)

```typescript
export interface StorageManager {
  /**
   * Get the default disk
   */
  readonly disk: () => StorageService;

  /**
   * Get a specific disk by name
   */
  readonly driver: (name: string) => Effect.Effect<StorageService, StorageError>;

  /**
   * Register a new disk
   */
  readonly extend: (name: string, disk: Disk) => Effect.Effect<void, never>;

  /**
   * Get the default disk name
   */
  readonly getDefaultDriver: () => DiskName;

  /**
   * List available disks
   */
  readonly getDisks: () => ReadonlyArray<DiskName>;
}

export class StorageManagerTag extends Context.Tag('@gello/storage/StorageManager')<
  StorageManagerTag,
  StorageManager
>() {}
```

### Storage Service Implementation

```typescript
export const makeStorageService = (disk: Disk): StorageService => ({
  get: (path) =>
    Effect.gen(function* () {
      const validPath = yield* makeFilePath(path);
      return yield* disk.get(validPath);
    }),

  getString: (path, encoding = 'utf-8') =>
    Effect.gen(function* () {
      const validPath = yield* makeFilePath(path);
      return yield* disk.getString(validPath, encoding);
    }),

  put: (path, contents, options) =>
    Effect.gen(function* () {
      const validPath = yield* makeFilePath(path);
      return yield* disk.put(validPath, contents, options);
    }),

  exists: (path) =>
    Effect.gen(function* () {
      const validPath = yield* makeFilePath(path);
      return yield* disk.exists(validPath);
    }),

  missing: (path) =>
    Effect.gen(function* () {
      const validPath = yield* makeFilePath(path);
      return yield* disk.missing(validPath);
    }),

  delete: (path) =>
    Effect.gen(function* () {
      const validPath = yield* makeFilePath(path);
      return yield* disk.delete(validPath);
    }),

  copy: (from, to) =>
    Effect.gen(function* () {
      const fromPath = yield* makeFilePath(from);
      const toPath = yield* makeFilePath(to);
      return yield* disk.copy(fromPath, toPath);
    }),

  move: (from, to) =>
    Effect.gen(function* () {
      const fromPath = yield* makeFilePath(from);
      const toPath = yield* makeFilePath(to);
      return yield* disk.move(fromPath, toPath);
    }),

  // ... rest of methods follow same pattern

  putFile: (directory, contents, options) =>
    Effect.gen(function* () {
      const filename = generateUniqueFilename(options?.mimeType);
      const path = yield* join(directory, filename);
      yield* disk.put(path, contents, options);
      return path;
    }),

  putFileAs: (directory, contents, name, options) =>
    Effect.gen(function* () {
      const path = yield* join(directory, name);
      yield* disk.put(path, contents, options);
      return path;
    }),

  disk: (name) =>
    Effect.gen(function* () {
      const manager = yield* StorageManagerTag;
      return yield* manager.driver(name);
    }),
});
```

---

## Adapter Implementations

### LocalDisk

```typescript
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Effect, Stream } from 'effect';

export interface LocalDiskConfig {
  readonly root: string;
  readonly publicUrl?: string;
  readonly visibility?: Visibility;
  readonly permissions?: {
    readonly file?: number;
    readonly directory?: number;
  };
}

export const makeLocalDisk = (config: LocalDiskConfig): Effect.Effect<Disk & StreamableDisk, never> =>
  Effect.gen(function* () {
    const root = path.resolve(config.root);
    const defaultVisibility = config.visibility ?? 'private';
    const filePerms = config.permissions?.file ?? 0o644;
    const dirPerms = config.permissions?.directory ?? 0o755;

    // Ensure root directory exists
    yield* Effect.sync(() => fs.mkdirSync(root, { recursive: true, mode: dirPerms }));

    const resolvePath = (filePath: FilePath): string =>
      path.join(root, filePath);

    const ensureDirectory = (filePath: string) =>
      Effect.sync(() => fs.mkdirSync(path.dirname(filePath), { recursive: true, mode: dirPerms }));

    return {
      get: (filePath) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath);
          const exists = yield* Effect.sync(() => fs.existsSync(fullPath));
          if (!exists) {
            return yield* Effect.fail(new FileNotFoundError({
              path: filePath,
              disk: LOCAL
            }));
          }
          return yield* Effect.sync(() => new Uint8Array(fs.readFileSync(fullPath)));
        }),

      getString: (filePath, encoding = 'utf-8') =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath);
          const exists = yield* Effect.sync(() => fs.existsSync(fullPath));
          if (!exists) {
            return yield* Effect.fail(new FileNotFoundError({
              path: filePath,
              disk: LOCAL
            }));
          }
          return yield* Effect.sync(() => fs.readFileSync(fullPath, encoding as BufferEncoding));
        }),

      put: (filePath, contents, options) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath);
          yield* ensureDirectory(fullPath);

          const data = typeof contents === 'string'
            ? Buffer.from(contents)
            : Buffer.from(contents);

          yield* Effect.sync(() => fs.writeFileSync(fullPath, data, { mode: filePerms }));
        }),

      exists: (filePath) =>
        Effect.sync(() => fs.existsSync(resolvePath(filePath))),

      missing: (filePath) =>
        Effect.sync(() => !fs.existsSync(resolvePath(filePath))),

      delete: (filePath) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath);
          const exists = yield* Effect.sync(() => fs.existsSync(fullPath));
          if (exists) {
            yield* Effect.sync(() => fs.unlinkSync(fullPath));
            return true;
          }
          return false;
        }),

      deleteMany: (paths) =>
        Effect.forEach(paths, (p) =>
          Effect.sync(() => {
            const fullPath = resolvePath(p);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
          })
        ).pipe(Effect.asVoid),

      copy: (from, to) =>
        Effect.gen(function* () {
          const fromPath = resolvePath(from);
          const toPath = resolvePath(to);
          yield* ensureDirectory(toPath);
          yield* Effect.sync(() => fs.copyFileSync(fromPath, toPath));
        }),

      move: (from, to) =>
        Effect.gen(function* () {
          const fromPath = resolvePath(from);
          const toPath = resolvePath(to);
          yield* ensureDirectory(toPath);
          yield* Effect.sync(() => fs.renameSync(fromPath, toPath));
        }),

      size: (filePath) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath);
          const stats = yield* Effect.sync(() => fs.statSync(fullPath));
          return stats.size;
        }),

      lastModified: (filePath) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath);
          const stats = yield* Effect.sync(() => fs.statSync(fullPath));
          return stats.mtime;
        }),

      getMetadata: (filePath) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath);
          const stats = yield* Effect.sync(() => fs.statSync(fullPath));
          return FileInfo.make({
            path: filePath,
            size: stats.size,
            mimeType: guessMimeType(filePath),
            lastModified: stats.mtime,
            visibility: defaultVisibility,
            isDirectory: stats.isDirectory(),
          });
        }),

      url: (filePath) =>
        config.publicUrl
          ? Effect.succeed(`${config.publicUrl}/${filePath}`)
          : Effect.fail(new StorageError({ message: 'No public URL configured for local disk' })),

      getVisibility: () => Effect.succeed(defaultVisibility),

      setVisibility: (filePath, visibility) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath);
          const mode = visibility === 'public' ? 0o644 : 0o600;
          yield* Effect.sync(() => fs.chmodSync(fullPath, mode));
        }),

      prepend: (filePath, data) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath);
          const existing = fs.existsSync(fullPath)
            ? fs.readFileSync(fullPath)
            : Buffer.alloc(0);
          const newData = typeof data === 'string' ? Buffer.from(data) : Buffer.from(data);
          yield* Effect.sync(() => fs.writeFileSync(fullPath, Buffer.concat([newData, existing])));
        }),

      append: (filePath, data) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath);
          const newData = typeof data === 'string' ? Buffer.from(data) : Buffer.from(data);
          yield* Effect.sync(() => fs.appendFileSync(fullPath, newData));
        }),

      files: (directory) =>
        Effect.gen(function* () {
          const dir = directory ? resolvePath(directory) : root;
          const entries = yield* Effect.sync(() => fs.readdirSync(dir, { withFileTypes: true }));
          return entries
            .filter(e => e.isFile())
            .map(e => FilePath(directory ? `${directory}/${e.name}` : e.name));
        }),

      allFiles: (directory) =>
        Effect.gen(function* () {
          const results: FilePath[] = [];
          const walk = (dir: string, prefix: string) => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
              const entryPath = prefix ? `${prefix}/${entry.name}` : entry.name;
              if (entry.isFile()) {
                results.push(FilePath(entryPath));
              } else if (entry.isDirectory()) {
                walk(path.join(dir, entry.name), entryPath);
              }
            }
          };
          const startDir = directory ? resolvePath(directory) : root;
          yield* Effect.sync(() => walk(startDir, directory ?? ''));
          return results;
        }),

      directories: (directory) =>
        Effect.gen(function* () {
          const dir = directory ? resolvePath(directory) : root;
          const entries = yield* Effect.sync(() => fs.readdirSync(dir, { withFileTypes: true }));
          return entries
            .filter(e => e.isDirectory())
            .map(e => FilePath(directory ? `${directory}/${e.name}` : e.name));
        }),

      allDirectories: (directory) =>
        Effect.gen(function* () {
          const results: FilePath[] = [];
          const walk = (dir: string, prefix: string) => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
              if (entry.isDirectory()) {
                const entryPath = prefix ? `${prefix}/${entry.name}` : entry.name;
                results.push(FilePath(entryPath));
                walk(path.join(dir, entry.name), entryPath);
              }
            }
          };
          const startDir = directory ? resolvePath(directory) : root;
          yield* Effect.sync(() => walk(startDir, directory ?? ''));
          return results;
        }),

      makeDirectory: (dirPath) =>
        Effect.sync(() => {
          fs.mkdirSync(resolvePath(dirPath), { recursive: true, mode: dirPerms });
        }),

      deleteDirectory: (dirPath) =>
        Effect.sync(() => {
          fs.rmSync(resolvePath(dirPath), { recursive: true, force: true });
        }),

      // StreamableDisk methods
      readStream: (filePath) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath);
          const nodeStream = fs.createReadStream(fullPath);
          return Stream.fromAsyncIterable(nodeStream, (e) =>
            new StreamError({ path: filePath, disk: LOCAL, cause: e })
          );
        }),

      writeStream: (filePath, stream, options) =>
        Effect.gen(function* () {
          const fullPath = resolvePath(filePath);
          yield* ensureDirectory(fullPath);
          const writeStream = fs.createWriteStream(fullPath);
          yield* Stream.run(
            stream,
            Sink.forEach((chunk) =>
              Effect.sync(() => writeStream.write(Buffer.from(chunk)))
            )
          );
          yield* Effect.sync(() => writeStream.end());
        }),
    };
  });

export const LocalDiskLive = (config: LocalDiskConfig): Layer.Layer<DiskTag, never> =>
  Layer.effect(DiskTag, makeLocalDisk(config));
```

### S3Disk

```typescript
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, CopyObjectCommand, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface S3DiskConfig {
  readonly bucket: string;
  readonly region: string;
  readonly accessKeyId?: string;
  readonly secretAccessKey?: string;
  readonly endpoint?: string;        // For S3-compatible services
  readonly forcePathStyle?: boolean; // For MinIO, etc.
  readonly prefix?: string;
  readonly publicUrl?: string;
}

export const makeS3Disk = (config: S3DiskConfig): Effect.Effect<Disk & StreamableDisk & TemporaryUrlDisk, DiskConnectionError> =>
  Effect.gen(function* () {
    const client = new S3Client({
      region: config.region,
      credentials: config.accessKeyId && config.secretAccessKey
        ? {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          }
        : undefined,
      endpoint: config.endpoint,
      forcePathStyle: config.forcePathStyle,
    });

    const prefix = config.prefix ?? '';
    const prefixPath = (path: FilePath): string =>
      prefix ? `${prefix}/${path}` : path;

    yield* Effect.addFinalizer(() =>
      Effect.sync(() => client.destroy())
    );

    return {
      get: (filePath) =>
        Effect.tryPromise({
          try: async () => {
            const response = await client.send(new GetObjectCommand({
              Bucket: config.bucket,
              Key: prefixPath(filePath),
            }));
            const bytes = await response.Body?.transformToByteArray();
            if (!bytes) throw new Error('Empty response');
            return new Uint8Array(bytes);
          },
          catch: (e: any) => {
            if (e.name === 'NoSuchKey') {
              return new FileNotFoundError({ path: filePath, disk: S3 });
            }
            return new DiskConnectionError({ disk: S3, cause: e });
          },
        }),

      put: (filePath, contents, options) =>
        Effect.tryPromise({
          try: () => client.send(new PutObjectCommand({
            Bucket: config.bucket,
            Key: prefixPath(filePath),
            Body: typeof contents === 'string' ? Buffer.from(contents) : contents,
            ContentType: options?.mimeType ?? guessMimeType(filePath) ?? 'application/octet-stream',
            ACL: options?.visibility === 'public' ? 'public-read' : 'private',
            Metadata: options?.metadata,
          })),
          catch: (e) => new DiskConnectionError({ disk: S3, cause: e }),
        }).pipe(Effect.asVoid),

      exists: (filePath) =>
        Effect.tryPromise({
          try: async () => {
            try {
              await client.send(new HeadObjectCommand({
                Bucket: config.bucket,
                Key: prefixPath(filePath),
              }));
              return true;
            } catch {
              return false;
            }
          },
          catch: (e) => new DiskConnectionError({ disk: S3, cause: e }),
        }),

      delete: (filePath) =>
        Effect.tryPromise({
          try: async () => {
            await client.send(new DeleteObjectCommand({
              Bucket: config.bucket,
              Key: prefixPath(filePath),
            }));
            return true;
          },
          catch: (e) => new DiskConnectionError({ disk: S3, cause: e }),
        }),

      copy: (from, to) =>
        Effect.tryPromise({
          try: () => client.send(new CopyObjectCommand({
            Bucket: config.bucket,
            CopySource: `${config.bucket}/${prefixPath(from)}`,
            Key: prefixPath(to),
          })),
          catch: (e) => new DiskConnectionError({ disk: S3, cause: e }),
        }).pipe(Effect.asVoid),

      move: (from, to) =>
        Effect.gen(function* () {
          yield* this.copy(from, to);
          yield* this.delete(from);
        }),

      url: (filePath) =>
        config.publicUrl
          ? Effect.succeed(`${config.publicUrl}/${prefixPath(filePath)}`)
          : Effect.succeed(`https://${config.bucket}.s3.${config.region}.amazonaws.com/${prefixPath(filePath)}`),

      temporaryUrl: (filePath, expiration, options) =>
        Effect.tryPromise({
          try: () => getSignedUrl(
            client,
            new GetObjectCommand({
              Bucket: config.bucket,
              Key: prefixPath(filePath),
              ResponseContentDisposition: options?.responseDisposition,
            }),
            { expiresIn: Math.floor(Duration.toSeconds(expiration)) }
          ),
          catch: (e) => new DiskConnectionError({ disk: S3, cause: e }),
        }),

      temporaryUploadUrl: (filePath, expiration, options) =>
        Effect.tryPromise({
          try: async () => {
            const url = await getSignedUrl(
              client,
              new PutObjectCommand({
                Bucket: config.bucket,
                Key: prefixPath(filePath),
                ContentType: options?.mimeType,
                ACL: options?.visibility === 'public' ? 'public-read' : 'private',
              }),
              { expiresIn: Math.floor(Duration.toSeconds(expiration)) }
            );
            return { url, headers: {} };
          },
          catch: (e) => new DiskConnectionError({ disk: S3, cause: e }),
        }),

      files: (directory) =>
        Effect.tryPromise({
          try: async () => {
            const prefix = directory ? `${prefixPath(FilePath(directory))}/` : config.prefix || '';
            const response = await client.send(new ListObjectsV2Command({
              Bucket: config.bucket,
              Prefix: prefix,
              Delimiter: '/',
            }));
            return (response.Contents ?? [])
              .map(obj => obj.Key)
              .filter((key): key is string => key !== undefined)
              .map(key => FilePath(key.replace(config.prefix ? `${config.prefix}/` : '', '')));
          },
          catch: (e) => new DiskConnectionError({ disk: S3, cause: e }),
        }),

      // ... other methods follow similar pattern
    };
  });

export const S3DiskLive = (config: S3DiskConfig): Layer.Layer<DiskTag, DiskConnectionError> =>
  Layer.scoped(DiskTag, makeS3Disk(config));
```

### MemoryDisk (Testing)

```typescript
interface MemoryFile {
  readonly contents: Uint8Array;
  readonly mimeType: string | null;
  readonly visibility: Visibility;
  readonly lastModified: Date;
  readonly metadata: Record<string, string>;
}

export const makeMemoryDisk = (): Effect.Effect<Disk & StreamableDisk, never> =>
  Effect.gen(function* () {
    const files = yield* Ref.make<Map<string, MemoryFile>>(new Map());

    return {
      get: (filePath) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files);
          const file = store.get(filePath);
          if (!file) {
            return yield* Effect.fail(new FileNotFoundError({
              path: filePath,
              disk: DiskName('memory')
            }));
          }
          return file.contents;
        }),

      put: (filePath, contents, options) =>
        Ref.update(files, (store) => {
          store.set(filePath, {
            contents: typeof contents === 'string'
              ? new TextEncoder().encode(contents)
              : contents,
            mimeType: options?.mimeType ?? guessMimeType(filePath),
            visibility: options?.visibility ?? 'private',
            lastModified: new Date(),
            metadata: options?.metadata ?? {},
          });
          return store;
        }),

      exists: (filePath) =>
        Effect.gen(function* () {
          const store = yield* Ref.get(files);
          return store.has(filePath);
        }),

      delete: (filePath) =>
        Ref.modify(files, (store) => {
          const existed = store.has(filePath);
          store.delete(filePath);
          return [existed, store];
        }),

      // ... other methods

      readStream: (filePath) =>
        Effect.gen(function* () {
          const contents = yield* this.get(filePath);
          return Stream.make(contents);
        }),

      writeStream: (filePath, stream, options) =>
        Effect.gen(function* () {
          const chunks: Uint8Array[] = [];
          yield* Stream.runForEach(stream, (chunk) =>
            Effect.sync(() => chunks.push(chunk))
          );
          const combined = new Uint8Array(chunks.reduce((acc, c) => acc + c.length, 0));
          let offset = 0;
          for (const chunk of chunks) {
            combined.set(chunk, offset);
            offset += chunk.length;
          }
          yield* this.put(filePath, combined, options);
        }),
    };
  });

export const MemoryDiskLive: Layer.Layer<DiskTag> = Layer.effect(DiskTag, makeMemoryDisk());
```

### NullDisk

```typescript
export const NullDisk: Disk = {
  get: (path) => Effect.fail(new FileNotFoundError({ path, disk: DiskName('null') })),
  getString: (path) => Effect.fail(new FileNotFoundError({ path, disk: DiskName('null') })),
  put: () => Effect.void,
  exists: () => Effect.succeed(false),
  missing: () => Effect.succeed(true),
  delete: () => Effect.succeed(false),
  deleteMany: () => Effect.void,
  copy: () => Effect.void,
  move: () => Effect.void,
  size: (path) => Effect.fail(new FileNotFoundError({ path, disk: DiskName('null') })),
  lastModified: (path) => Effect.fail(new FileNotFoundError({ path, disk: DiskName('null') })),
  getMetadata: (path) => Effect.fail(new FileNotFoundError({ path, disk: DiskName('null') })),
  url: () => Effect.succeed(''),
  getVisibility: () => Effect.succeed('private' as Visibility),
  setVisibility: () => Effect.void,
  prepend: () => Effect.void,
  append: () => Effect.void,
  files: () => Effect.succeed([]),
  allFiles: () => Effect.succeed([]),
  directories: () => Effect.succeed([]),
  allDirectories: () => Effect.succeed([]),
  makeDirectory: () => Effect.void,
  deleteDirectory: () => Effect.void,
};

export const NullDiskLive: Layer.Layer<DiskTag> = Layer.succeed(DiskTag, NullDisk);
```

---

## Usage Examples

### Basic Usage

```typescript
import { Effect } from 'effect';
import { Storage } from '@gello/storage';

const program = Effect.gen(function* () {
  const storage = yield* Storage;

  // Write a file
  yield* storage.put('documents/hello.txt', 'Hello, World!');

  // Read a file
  const contents = yield* storage.getString('documents/hello.txt');

  // Check existence
  const exists = yield* storage.exists('documents/hello.txt');

  // Get metadata
  const info = yield* storage.getMetadata('documents/hello.txt');
  console.log(`Size: ${info.size}, Modified: ${info.lastModified}`);

  // Copy and move
  yield* storage.copy('documents/hello.txt', 'backup/hello.txt');
  yield* storage.move('documents/hello.txt', 'archive/hello.txt');

  // Delete
  yield* storage.delete('archive/hello.txt');

  // List files
  const files = yield* storage.files('documents');
  const allFiles = yield* storage.allFiles('documents'); // recursive

  // Directories
  yield* storage.makeDirectory('uploads/images');
  const dirs = yield* storage.directories('uploads');
  yield* storage.deleteDirectory('uploads/temp');
});
```

### File Uploads

```typescript
import { Storage } from '@gello/storage';

HttpRouter.post('/upload', Effect.gen(function* () {
  const storage = yield* Storage;
  const body = yield* HttpServerRequest.multipartBody;

  const file = body.files.get('avatar');
  if (!file) {
    return yield* HttpServerResponse.json({ error: 'No file' }, { status: 400 });
  }

  // Auto-generate unique filename
  const path = yield* storage.putFile('avatars', file.content, {
    visibility: 'public',
    mimeType: file.contentType,
  });

  // Or specify filename
  const path2 = yield* storage.putFileAs(
    'avatars',
    file.content,
    `user-${userId}.jpg`,
    { visibility: 'public' }
  );

  const url = yield* storage.url(path);
  return yield* HttpServerResponse.json({ url });
}));
```

### Multiple Disks

```typescript
import { Storage, StorageManager } from '@gello/storage';

const program = Effect.gen(function* () {
  const storage = yield* Storage;

  // Use default disk
  yield* storage.put('file.txt', 'content');

  // Use specific disk
  const s3 = yield* storage.disk('s3');
  yield* s3.put('uploads/file.txt', 'content', { visibility: 'public' });

  // Copy between disks
  const local = yield* storage.disk('local');
  const s3Content = yield* s3.get('uploads/file.txt');
  yield* local.put('backups/file.txt', s3Content);
});
```

### Temporary URLs (Signed URLs)

```typescript
import { Storage } from '@gello/storage';
import { minutes, hours } from '@gello/time';

const program = Effect.gen(function* () {
  const storage = yield* Storage;
  const s3 = yield* storage.disk('s3');

  // Generate download URL (expires in 30 minutes)
  const downloadUrl = yield* s3.temporaryUrl('private/report.pdf', minutes(30));

  // Generate upload URL for direct client upload
  const { url, headers } = yield* s3.temporaryUploadUrl(
    'uploads/user-avatar.jpg',
    hours(1),
    { mimeType: 'image/jpeg', visibility: 'public' }
  );

  return { downloadUrl, uploadUrl: url, uploadHeaders: headers };
});
```

### Streaming Large Files

```typescript
import { Storage } from '@gello/storage';
import { Stream, Sink } from 'effect';

const program = Effect.gen(function* () {
  const storage = yield* Storage;

  // Read as stream
  const readStream = yield* storage.readStream('large-file.zip');

  // Process stream (e.g., hash, transform)
  const hash = yield* Stream.run(
    readStream,
    Sink.fold('', (acc, chunk) => acc + hashChunk(chunk))
  );

  // Write stream
  const uploadStream = getUploadStream(); // from request
  yield* storage.writeStream('uploads/large-file.zip', uploadStream);
});
```

### Configuration Integration

```typescript
import { env } from '@gello/config';
import { Storage, LocalDiskLive, S3DiskLive, MemoryDiskLive } from '@gello/storage';
import { match } from 'ts-pattern';

const diskDriver = env('FILESYSTEM_DISK', 'local');

const StorageLive = match(diskDriver)
  .with('local', () => LocalDiskLive({
    root: env('FILESYSTEM_LOCAL_ROOT', './storage'),
    publicUrl: env('APP_URL', 'http://localhost:3000') + '/storage',
  }))
  .with('s3', () => S3DiskLive({
    bucket: env('AWS_BUCKET'),
    region: env('AWS_DEFAULT_REGION', 'us-east-1'),
    accessKeyId: env('AWS_ACCESS_KEY_ID'),
    secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
    endpoint: env('AWS_ENDPOINT', undefined),
  }))
  .with('memory', () => MemoryDiskLive)
  .otherwise(() => LocalDiskLive({ root: './storage' }));
```

---

## Implementation Phases

### Phase 1: Core (P0)
- [ ] Domain types (FilePath, DiskName, Visibility, FileInfo)
- [ ] StorageError ADT
- [ ] Disk port interface
- [ ] Storage service interface
- [ ] LocalDisk adapter
- [ ] Basic operations: get, put, exists, delete, copy, move
- [ ] Directory operations: files, directories, makeDirectory, deleteDirectory
- [ ] Unit tests

### Phase 2: Extended Operations (P1)
- [ ] size, lastModified, getMetadata
- [ ] URL generation
- [ ] Visibility get/set
- [ ] allFiles, allDirectories (recursive)
- [ ] StreamableDisk port
- [ ] readStream, writeStream on LocalDisk
- [ ] MemoryDisk adapter
- [ ] NullDisk adapter

### Phase 3: Cloud Storage (P2)
- [ ] S3Disk adapter
- [ ] TemporaryUrlDisk port
- [ ] temporaryUrl, temporaryUploadUrl
- [ ] AzureDisk adapter
- [ ] GCSDisk adapter
- [ ] prepend, append operations
- [ ] putFile, putFileAs (auto-named uploads)

### Phase 4: Advanced Features
- [ ] StorageManager for multi-disk
- [ ] FTPDisk adapter
- [ ] SFTPDisk adapter
- [ ] Config integration
- [ ] CLI generator templates
- [ ] Documentation
- [ ] Download response helpers

---

## Environment Variables

```bash
# Default filesystem disk: local, s3, azure, gcs, memory
FILESYSTEM_DISK=local

# Local disk
FILESYSTEM_LOCAL_ROOT=./storage
FILESYSTEM_LOCAL_PUBLIC_URL=http://localhost:3000/storage

# S3 / S3-compatible (MinIO, DigitalOcean Spaces, etc.)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=my-bucket
AWS_ENDPOINT=                    # Optional: for S3-compatible services
AWS_USE_PATH_STYLE_ENDPOINT=false

# Azure Blob Storage
AZURE_STORAGE_ACCOUNT=
AZURE_STORAGE_KEY=
AZURE_STORAGE_CONTAINER=

# Google Cloud Storage
GCS_PROJECT_ID=
GCS_BUCKET=
GCS_KEY_FILE=                    # Path to service account JSON
```

---

## Testing Utilities

```typescript
import { MockStorage, testStorage } from '@gello/storage/testing';

describe('FileUploadService', () => {
  it('stores uploaded files', async () => {
    const mockStorage = MockStorage.make();

    const result = await Effect.runPromise(
      uploadService.handleUpload(fileData).pipe(
        Effect.provide(mockStorage.layer)
      )
    );

    expect(mockStorage.puts).toHaveLength(1);
    expect(mockStorage.puts[0].path).toMatch(/^uploads\//);
    expect(mockStorage.puts[0].visibility).toBe('public');
  });

  it('generates correct URLs', async () => {
    const mockStorage = MockStorage.make({
      urlBase: 'https://cdn.example.com',
    });

    const url = await Effect.runPromise(
      storage.url('images/photo.jpg').pipe(
        Effect.provide(mockStorage.layer)
      )
    );

    expect(url).toBe('https://cdn.example.com/images/photo.jpg');
  });
});
```

---

## HTTP Response Helpers

```typescript
import { Storage } from '@gello/storage';
import * as HttpServerResponse from '@effect/platform/HttpServerResponse';

// Download file
HttpRouter.get('/download/:path', Effect.gen(function* () {
  const { path } = yield* HttpRouter.params;
  const storage = yield* Storage;

  const contents = yield* storage.get(path);
  const info = yield* storage.getMetadata(path);

  return HttpServerResponse.raw(contents, {
    headers: {
      'Content-Type': info.mimeType ?? 'application/octet-stream',
      'Content-Length': String(info.size),
      'Content-Disposition': `attachment; filename="${basename(path)}"`,
    },
  });
}));

// Stream large file
HttpRouter.get('/stream/:path', Effect.gen(function* () {
  const { path } = yield* HttpRouter.params;
  const storage = yield* Storage;

  const stream = yield* storage.readStream(path);
  const info = yield* storage.getMetadata(path);

  return HttpServerResponse.stream(stream, {
    headers: {
      'Content-Type': info.mimeType ?? 'application/octet-stream',
    },
  });
}));

// Redirect to signed URL
HttpRouter.get('/secure/:path', Effect.gen(function* () {
  const { path } = yield* HttpRouter.params;
  const storage = yield* Storage;
  const s3 = yield* storage.disk('s3');

  const url = yield* s3.temporaryUrl(path, minutes(5));

  return HttpServerResponse.redirect(url, { status: 302 });
}));
```

---

## References

- [Laravel 4.2 Filesystem Documentation](https://laravel.com/docs/4.2/filesystem)
- [Flysystem (PHP Filesystem Abstraction)](https://flysystem.thephpleague.com/)
- [Effect-TS Stream](https://effect.website/docs/guides/streaming)
- [AWS S3 SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
