/**
 * @gello/storage - Effect-powered storage abstraction
 *
 * A hexagonal architecture storage library providing:
 * - Multi-disk storage management
 * - Local, Memory, S3, and Null disk adapters
 * - Streaming support for large files
 * - Temporary URL generation
 * - Type-safe file paths and errors
 *
 * @example
 * ```typescript
 * import { Effect, Layer } from "effect"
 * import {
 *   Storage,
 *   StorageLive,
 *   makeStorageService,
 *   StorageManagerBuilder,
 * } from "@gello/storage"
 * import { LocalDiskLive, MemoryDiskLive } from "@gello/storage-drivers"
 *
 * // Simple usage with a single disk
 * const program = Effect.gen(function* () {
 *   const storage = yield* Storage
 *   yield* storage.put("hello.txt", "Hello, World!")
 *   const content = yield* storage.getString("hello.txt")
 *   console.log(content) // "Hello, World!"
 * })
 *
 * // Run with local disk
 * const LocalStorage = StorageLive.pipe(
 *   Layer.provide(LocalDiskLive({ root: "./storage" }))
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(LocalStorage)))
 *
 * // Multi-disk setup
 * const manager = new StorageManagerBuilder()
 *   .default("local")
 *   .disk("local", await Effect.runPromise(makeLocalDisk({ root: "./storage" })))
 *   .disk("memory", await Effect.runPromise(makeMemoryDisk()))
 *   .toLayer()
 * ```
 *
 * @module @gello/storage
 */

// Domain types
export {
  // FilePath
  type FilePath,
  makeFilePath,
  unsafeFilePath,
  dirname,
  basename,
  extension,
  join,
  unsafeJoin,
  // DiskName
  type DiskName,
  makeDiskName,
  unsafeDiskName,
  LOCAL,
  S3,
  MEMORY,
  NULL,
  PUBLIC,
  AZURE,
  GCS,
  isBuiltIn,
  // Visibility
  type Visibility,
  Visibility as VisibilityEnum,
  // FileInfo
  type FileInfo,
  FileInfo as FileInfoSchema,
  // MimeType
  guessMimeType,
  isImage,
  isVideo,
  isAudio,
  isDocument,
  isText,
  isArchive,
} from "./domain/index.js"

// Errors
export {
  type StorageError,
  FileNotFoundError,
  FileExistsError,
  PermissionDeniedError,
  DiskNotFoundError,
  DiskConnectionError,
  InvalidPathError,
  InvalidDiskNameError,
  StorageQuotaExceededError,
  StreamError,
  DirectoryNotEmptyError,
  NotADirectoryError,
  IsADirectoryError,
  isFileNotFound,
  isFileExists,
  isPermissionDenied,
  isDiskNotFound,
  isDiskConnection,
} from "./errors/index.js"

// Ports (interfaces)
export {
  type Disk,
  type PutOptions,
  DiskTag,
  type StreamableDisk,
  StreamableDiskTag,
  isStreamable,
  type TemporaryUrlDisk,
  TemporaryUrlDiskTag,
  supportsTemporaryUrls,
} from "./ports/index.js"

// Storage service
export {
  type StorageService,
  makeStorageService,
  Storage,
  StorageLive,
  makeStorageLayer,
} from "./Storage.js"

// Storage manager
export {
  type StorageManager,
  type StorageManagerConfig,
  makeStorageManager,
  StorageManagerTag,
  StorageManagerLive,
  StorageManagerBuilder,
  storageManagerBuilder,
  useStorage,
  useDisk,
} from "./StorageManager.js"

// Testing utilities
export {
  type MockFile,
  type MockStorageConfig,
  makeMockDisk,
  MockStorageLive,
  MockDiskLive,
} from "./testing.js"

// Config integration
export {
  // Schemas
  StorageDriver,
  type StorageDriver as StorageDriverType,
  VisibilityConfig,
  type VisibilityConfig as VisibilityConfigType,
  LocalDiskConfigSchema,
  type LocalDiskConfigSchema as LocalDiskConfigSchemaType,
  S3DiskConfigSchema,
  type S3DiskConfigSchema as S3DiskConfigSchemaType,
  AzureDiskConfigSchema,
  type AzureDiskConfigSchema as AzureDiskConfigSchemaType,
  GCSDiskConfigSchema,
  type GCSDiskConfigSchema as GCSDiskConfigSchemaType,
  MemoryDiskConfigSchema,
  type MemoryDiskConfigSchema as MemoryDiskConfigSchemaType,
  NullDiskConfigSchema,
  type NullDiskConfigSchema as NullDiskConfigSchemaType,
  DiskConfigSchema,
  type DiskConfigSchema as DiskConfigSchemaType,
  StorageConfigSchema,
  type StorageConfigSchema as StorageConfigSchemaType,
  // Env mapping
  STORAGE_ENV_MAPPING,
  // Config reader interface
  type ConfigReader,
  // Disk factories
  type DiskFactory,
  registerDiskFactory,
  getDiskFactory,
  // Layer factories
  type StorageLayerConfig,
  makeStorageLayerFromConfig,
  makeStorageManagerLayerFromConfig,
  // Preset configs
  localStorageConfig,
  memoryStorageConfig,
  nullStorageConfig,
  // Env reader
  readStorageConfigFromEnv,
} from "./StorageConfig.js"

// HTTP helpers
export {
  type DownloadOptions,
  type StreamOptions,
  type FileResponse,
  download,
  stream,
  redirect,
  fileInfo,
  isModifiedSince,
  parseRangeHeader,
} from "./http.js"
