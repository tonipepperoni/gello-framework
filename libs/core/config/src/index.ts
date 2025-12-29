/**
 * @gello/core-config
 *
 * Laravel-inspired configuration system for Effect applications.
 *
 * Features:
 * - Dot notation access: Config.get("database.host")
 * - Type coercion: Config.string, Config.number, Config.boolean
 * - Schema validation: Config.schema(key, Port)
 * - Environment detection: Config.environment(), Config.isLocal()
 * - .env file loading with cascading
 * - Testing utilities: Config.testLayer, Config.withOverrides
 */

// Main Config module
export {
  // Service and Tag
  Config,
  type ConfigService,
  type ConfigStore,

  // Layer constructors
  layer,
  fromEnv,
  fromEnvFiles,

  // Accessors (require Config in context)
  get,
  string,
  number,
  boolean,
  schema,
  has,
  all,

  // Testing
  testLayer,
  withOverrides,

  // Environment
  environment,
  isLocal,
  isProduction,
  isTesting,
  isStaging,
  isDevelopment,
  whenEnvironment,
  whenLocal,
  whenProduction,
  detectEnvironment,
  type Environment,

  // Env helper
  env,
} from "./lib/Config.js"

// Dot notation utilities
export {
  getPath,
  setPath,
  hasPath,
  deepMerge,
  flatten,
} from "./lib/DotNotation.js"

// Validators
export {
  // String validators
  NonEmptyString,
  TrimmedString,

  // Number validators
  Port,
  PositiveInt,
  NonNegativeInt,
  Timeout,
  PoolSize,
  Percentage,

  // Format validators
  Url,
  Email,
  UUID,
  Hostname,

  // Enum validators
  LogLevel,
  EnvironmentSchema,

  // Coercion
  BooleanFromString,
  NumberFromString,
  PortFromString,

  // Composite schemas
  DatabaseConnectionConfig,
  DatabasePoolConfig,
  HttpServerConfig,
  RedisConfig,
  AppConfig,
} from "./lib/validators.js"

// Loaders
export {
  loadEnvFiles,
  loadAndInjectEnv,
  parseEnvFile,
  envRequired,
} from "./lib/loaders/EnvLoader.js"

// Logger Configuration
export {
  loggerFromConfig,
  developmentLogger,
  productionLogger,
  testLogger,
  stagingLogger,
  environmentLogger,
  buildLogger,
  getLogger,
  logInfo,
  logDebug,
  logWarning,
  logError,
  withContext,
  type LoggerBuilderOptions,
} from "./lib/LoggerConfig.js"
