/**
 * .env file loader
 *
 * Loads environment variables from .env files with priority:
 * 1. .env.{environment}.local (highest)
 * 2. .env.local
 * 3. .env.{environment}
 * 4. .env (lowest)
 */

import { Effect, Option } from "effect"
import * as fs from "node:fs"
import * as path from "node:path"
import { detectEnvironment, type Environment } from "../Environment.js"

export interface EnvLoadError {
  readonly _tag: "EnvLoadError"
  readonly file: string
  readonly cause: unknown
}

/**
 * Parse a .env file content into key-value pairs
 */
export const parseEnvFile = (content: string): Record<string, string> => {
  const result: Record<string, string> = {}
  const lines = content.split("\n")

  for (const line of lines) {
    // Skip empty lines and comments
    const trimmed = line.trim()
    if (trimmed === "" || trimmed.startsWith("#")) continue

    // Find the first = sign
    const eqIndex = trimmed.indexOf("=")
    if (eqIndex === -1) continue

    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()

    // Handle quoted values
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    // Handle escape sequences in double-quoted strings
    if (value.includes("\\")) {
      value = value
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\\\/g, "\\")
    }

    result[key] = value
  }

  return result
}

/**
 * Try to read and parse a .env file
 */
const tryLoadEnvFile = (
  filePath: string
): Effect.Effect<Option.Option<Record<string, string>>> =>
  Effect.sync(() => {
    try {
      if (!fs.existsSync(filePath)) {
        return Option.none()
      }
      const content = fs.readFileSync(filePath, "utf-8")
      return Option.some(parseEnvFile(content))
    } catch {
      return Option.none()
    }
  })

/**
 * Get the list of .env files to load in priority order (lowest to highest)
 */
const getEnvFilePaths = (basePath: string, env: Environment): string[] => {
  const files = [
    ".env", // Base
    `.env.${env}`, // Environment-specific
    ".env.local", // Local overrides
    `.env.${env}.local`, // Environment-specific local overrides
  ]

  return files.map((file) => path.join(basePath, file))
}

/**
 * Load all .env files and merge them
 * Later files override earlier ones
 */
export const loadEnvFiles = (
  basePath: string = process.cwd()
): Effect.Effect<Record<string, string>> =>
  Effect.gen(function* () {
    const env = detectEnvironment()
    const filePaths = getEnvFilePaths(basePath, env)
    let merged: Record<string, string> = {}

    for (const filePath of filePaths) {
      const result = yield* tryLoadEnvFile(filePath)
      if (Option.isSome(result)) {
        merged = { ...merged, ...result.value }
      }
    }

    return merged
  })

/**
 * Load .env files and inject into process.env
 */
export const loadAndInjectEnv = (
  basePath: string = process.cwd()
): Effect.Effect<Record<string, string>> =>
  Effect.gen(function* () {
    const envVars = yield* loadEnvFiles(basePath)

    // Only set if not already set in process.env
    for (const [key, value] of Object.entries(envVars)) {
      if (process.env[key] === undefined) {
        process.env[key] = value
      }
    }

    return envVars
  })

/**
 * Get an environment variable with optional default
 */
export const env = <T extends string | undefined>(
  key: string,
  defaultValue?: T
): T extends undefined ? string | undefined : string => {
  const value = process.env[key]
  return (value ?? defaultValue) as T extends undefined
    ? string | undefined
    : string
}

/**
 * Get a required environment variable
 */
export const envRequired = (key: string): Effect.Effect<string, EnvLoadError> =>
  Effect.try({
    try: () => {
      const value = process.env[key]
      if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}`)
      }
      return value
    },
    catch: (cause) => ({
      _tag: "EnvLoadError" as const,
      file: "process.env",
      cause,
    }),
  })
