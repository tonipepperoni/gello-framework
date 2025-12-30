/**
 * Wizard Types for gello new command
 */

export type StarterTemplate = 'empty' | 'todo';

export type ProjectType =
  | 'api-only'
  | 'api-spa-tanstack'
  | 'api-rsc-tanstack'
  | 'api-rsc-nextjs'
  | 'api-expo';

export interface InfrastructureConfig {
  queue: 'sync' | 'redis' | 'database';
  cache: 'memory' | 'redis' | 'database';
  mail: 'log' | 'smtp' | 'resend' | 'ses';
  session: 'memory' | 'redis' | 'database';
}

export interface FeatureFlags {
  authentication: boolean;
  authorization: boolean;
  oauth: boolean;
  database: boolean;
  storage: boolean;
  openapi: boolean;
}

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export type WizardStep =
  | 'project-type'
  | 'template'
  | 'infrastructure'
  | 'features'
  | 'package-manager'
  | 'creating'
  | 'complete'
  | 'error';

export interface WizardState {
  step: WizardStep;
  projectName: string;
  projectType: ProjectType;
  template: StarterTemplate;
  infrastructure: InfrastructureConfig;
  features: FeatureFlags;
  packageManager: PackageManager;
  progress: number;
  currentTask: string;
  error?: string;
}

export const TEMPLATE_OPTIONS = [
  {
    label: 'Empty Project',
    value: 'empty' as StarterTemplate,
    description: 'Minimal starter with basic setup',
  },
  {
    label: 'TODO Application',
    value: 'todo' as StarterTemplate,
    description: 'Full CRUD example with todos (auth-guarded if auth enabled)',
  },
] as const;

export const PROJECT_TYPE_OPTIONS = [
  {
    label: 'REST API only',
    value: 'api-only' as ProjectType,
    description: 'Gello API with no frontend',
  },
  {
    label: 'REST API + SPA (TanStack Router)',
    value: 'api-spa-tanstack' as ProjectType,
    description: 'React SPA with client-side routing',
  },
  {
    label: 'REST API + Web App (TanStack Start)',
    value: 'api-rsc-tanstack' as ProjectType,
    description: 'React with server components',
  },
  {
    label: 'REST API + Web App (Next.js)',
    value: 'api-rsc-nextjs' as ProjectType,
    description: 'Next.js 15 with App Router',
  },
  {
    label: 'REST API + Mobile App (Expo)',
    value: 'api-expo' as ProjectType,
    description: 'React Native with Expo Router',
  },
] as const;

export const INFRASTRUCTURE_OPTIONS = {
  queue: [
    { label: 'Sync', value: 'sync' as const, description: 'Synchronous (no queue)' },
    { label: 'Redis', value: 'redis' as const, description: 'Redis-backed queue' },
    { label: 'Database', value: 'database' as const, description: 'Database-backed queue' },
  ],
  cache: [
    { label: 'Memory', value: 'memory' as const, description: 'In-memory cache' },
    { label: 'Redis', value: 'redis' as const, description: 'Redis cache' },
    { label: 'Database', value: 'database' as const, description: 'Database cache' },
  ],
  mail: [
    { label: 'Log', value: 'log' as const, description: 'Log to console (dev)' },
    { label: 'SMTP', value: 'smtp' as const, description: 'SMTP server' },
    { label: 'Resend', value: 'resend' as const, description: 'Resend API' },
    { label: 'AWS SES', value: 'ses' as const, description: 'Amazon SES' },
  ],
  session: [
    { label: 'Memory', value: 'memory' as const, description: 'In-memory sessions' },
    { label: 'Redis', value: 'redis' as const, description: 'Redis sessions' },
    { label: 'Database', value: 'database' as const, description: 'Database sessions' },
  ],
} as const;

export const FEATURE_OPTIONS = [
  {
    label: 'Authentication',
    value: 'authentication',
    description: 'API tokens + sessions',
    default: true,
  },
  {
    label: 'Authorization',
    value: 'authorization',
    description: 'Abilities & policies',
    default: true,
  },
  {
    label: 'OAuth Providers',
    value: 'oauth',
    description: 'GitHub, Google login',
    default: false,
  },
  {
    label: 'Database',
    value: 'database',
    description: 'Drizzle + PostgreSQL',
    default: true,
  },
  {
    label: 'Storage',
    value: 'storage',
    description: 'S3-compatible storage',
    default: false,
  },
  {
    label: 'OpenAPI + Codegen',
    value: 'openapi',
    description: 'API client generation',
    default: true,
  },
] as const;

export const PACKAGE_MANAGER_OPTIONS = [
  { label: 'pnpm (Recommended)', value: 'pnpm' as PackageManager },
  { label: 'npm', value: 'npm' as PackageManager },
  { label: 'yarn', value: 'yarn' as PackageManager },
  { label: 'bun', value: 'bun' as PackageManager },
] as const;

export const getDefaultState = (projectName: string): WizardState => ({
  step: 'project-type',
  projectName,
  projectType: 'api-spa-tanstack',
  template: 'empty',
  infrastructure: {
    queue: 'sync',
    cache: 'memory',
    mail: 'log',
    session: 'memory',
  },
  features: {
    authentication: true,
    authorization: true,
    oauth: false,
    database: true,
    storage: false,
    openapi: true,
  },
  packageManager: 'pnpm',
  progress: 0,
  currentTask: '',
});
