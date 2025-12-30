/**
 * TODO Template - Database Files
 *
 * Generates Drizzle ORM schema and migrations for todos.
 */
import type { TemplateContext, GeneratedFiles } from '../types.js';

export function generateDatabaseFiles(context: TemplateContext): GeneratedFiles {
  const files = new Map<string, string>();

  // Generate Drizzle schema
  files.set('apps/api/src/db/schema.ts', generateSchema(context));

  // Generate database connection
  files.set('apps/api/src/db/index.ts', generateDbIndex(context));

  // Generate drizzle config
  files.set('apps/api/drizzle.config.ts', generateDrizzleConfig(context));

  return {
    files,
    dependencies: ['drizzle-orm', 'postgres'],
    devDependencies: ['drizzle-kit'],
  };
}

function generateSchema(context: TemplateContext): string {
  // Drizzle v0.30+ requires indexes to be defined inside table definitions
  const userIdColumn = context.hasAuth
    ? `\n  userId: text('user_id').notNull(),`
    : '';

  const todosTableEnd = context.hasAuth
    ? `}, (table) => ({
  userIdIdx: index('todos_user_id_idx').on(table.userId),
}));`
    : `});`;

  const authTables = context.hasAuth
    ? `

// ============================================================================
// Users Table
// ============================================================================

export const users = pgTable('users', {
  id: text('id').primaryKey(), // e.g., "user_1"
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(), // hashed
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
}));

// ============================================================================
// Personal Access Tokens Table
// ============================================================================

export const personalAccessTokens = pgTable('personal_access_tokens', {
  id: text('id').primaryKey(), // e.g., "token_abc123"
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  token: text('token').notNull().unique(), // SHA-256 hashed
  scopes: text('scopes').array().notNull().default([]),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index('tokens_user_id_idx').on(table.userId),
  tokenIdx: index('tokens_token_idx').on(table.token),
}));`
    : '';

  const authTypes = context.hasAuth
    ? `
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PersonalAccessToken = typeof personalAccessTokens.$inferSelect;
export type NewPersonalAccessToken = typeof personalAccessTokens.$inferInsert;`
    : '';

  return `/**
 * Database Schema
 *
 * Drizzle ORM schema definitions for the application.
 */
import {
  pgTable,
  text,
  boolean,
  timestamp,
  uuid,
  index,
} from 'drizzle-orm/pg-core';

// ============================================================================
// Todos Table
// ============================================================================

export const todos = pgTable('todos', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').notNull().default(false),${userIdColumn}
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
${todosTableEnd}${authTables}

// ============================================================================
// Types
// ============================================================================

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;${authTypes}
`;
}

function generateDbIndex(context: TemplateContext): string {
  const authExports = context.hasAuth
    ? `
export type { User, NewUser, PersonalAccessToken, NewPersonalAccessToken } from './schema.js';`
    : '';

  return `/**
 * Database Connection
 *
 * Drizzle ORM setup with PostgreSQL.
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

// Create PostgreSQL connection
const connectionString = process.env['DATABASE_URL'] ??
  \`postgres://\${process.env['DB_USER'] ?? 'postgres'}:\${process.env['DB_PASSWORD'] ?? 'secret'}@\${process.env['DB_HOST'] ?? 'localhost'}:\${process.env['DB_PORT'] ?? '5432'}/\${process.env['DB_NAME'] ?? 'app'}\`;

const client = postgres(connectionString);

// Create Drizzle instance with schema
export const db = drizzle(client, { schema });

// Export schema for convenience
export { schema };

// Export types
export type { Todo, NewTodo } from './schema.js';${authExports}
`;
}

function generateDrizzleConfig(context: TemplateContext): string {
  return `/**
 * Drizzle Kit Configuration
 */
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env['DATABASE_URL'] ??
      \`postgres://\${process.env['DB_USER'] ?? 'postgres'}:\${process.env['DB_PASSWORD'] ?? 'secret'}@\${process.env['DB_HOST'] ?? 'localhost'}:\${process.env['DB_PORT'] ?? '5432'}/\${process.env['DB_NAME'] ?? 'app'}\`,
  },
});
`;
}
