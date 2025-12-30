/**
 * Template System Types
 *
 * Defines the interfaces for the starter template system.
 */
import type {
  ProjectType,
  InfrastructureConfig,
  FeatureFlags,
  PackageManager,
  StarterTemplate,
} from '../components/wizard/types.js';

/**
 * Configuration passed to template generators
 */
export interface TemplateConfig {
  projectName: string;
  projectType: ProjectType;
  infrastructure: InfrastructureConfig;
  features: FeatureFlags;
  packageManager: PackageManager;
}

/**
 * Template context with computed values for interpolation
 */
export interface TemplateContext extends TemplateConfig {
  /** PascalCase project name (e.g., "MyApp") */
  projectNamePascal: string;
  /** kebab-case project name (e.g., "my-app") */
  projectNameKebab: string;
  /** camelCase project name (e.g., "myApp") */
  projectNameCamel: string;
  /** Whether authentication is enabled */
  hasAuth: boolean;
  /** Whether database is enabled */
  hasDatabase: boolean;
  /** Whether OAuth is enabled */
  hasOAuth: boolean;
  /** Whether frontend is included */
  hasFrontend: boolean;
  /** Whether it's a mobile app */
  isMobile: boolean;
}

/**
 * Result of template generation
 */
export interface GeneratedFiles {
  /** Map of relative file paths to their content */
  files: Map<string, string>;
  /** Additional npm dependencies to install */
  dependencies: string[];
  /** Additional npm dev dependencies to install */
  devDependencies: string[];
}

/**
 * A starter template definition
 */
export interface Template {
  /** Unique identifier matching StarterTemplate type */
  id: StarterTemplate;
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Generate template files */
  generate(context: TemplateContext): GeneratedFiles;
}

/**
 * Helper to create template context from config
 */
export function createTemplateContext(config: TemplateConfig): TemplateContext {
  const { projectName, projectType, features } = config;

  // Convert project name to different cases
  const projectNameKebab = projectName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

  const projectNamePascal = projectNameKebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  const projectNameCamel =
    projectNamePascal.charAt(0).toLowerCase() + projectNamePascal.slice(1);

  return {
    ...config,
    projectNamePascal,
    projectNameKebab,
    projectNameCamel,
    hasAuth: features.authentication,
    hasDatabase: features.database,
    hasOAuth: features.oauth,
    hasFrontend: projectType !== 'api-only',
    isMobile: projectType === 'api-expo',
  };
}
