/**
 * Environment detection and utilities
 */

import { Effect } from "effect"

export type Environment = "local" | "development" | "staging" | "production" | "testing"

const ENVIRONMENT_ALIASES: Record<string, Environment> = {
  local: "local",
  dev: "development",
  development: "development",
  staging: "staging",
  stage: "staging",
  prod: "production",
  production: "production",
  test: "testing",
  testing: "testing",
}

/**
 * Detect the current environment from process.env
 */
export const detectEnvironment = (): Environment => {
  const envValue = (
    process.env["GELLO_ENV"] ||
    process.env["APP_ENV"] ||
    process.env["NODE_ENV"] ||
    "local"
  ).toLowerCase()

  return ENVIRONMENT_ALIASES[envValue] ?? "local"
}

/**
 * Get current environment as an Effect
 */
export const environment = Effect.sync(detectEnvironment)

/**
 * Check if running in a specific environment
 */
export const isEnvironment = (env: Environment): Effect.Effect<boolean> =>
  Effect.map(environment, (current) => current === env)

/**
 * Check if local environment
 */
export const isLocal = isEnvironment("local")

/**
 * Check if development environment
 */
export const isDevelopment = Effect.map(
  environment,
  (env) => env === "local" || env === "development"
)

/**
 * Check if production environment
 */
export const isProduction = isEnvironment("production")

/**
 * Check if testing environment
 */
export const isTesting = isEnvironment("testing")

/**
 * Check if staging environment
 */
export const isStaging = isEnvironment("staging")

/**
 * Run an effect only in specific environments
 */
export const whenEnvironment = <A, E, R>(
  envs: Environment | Environment[],
  effect: Effect.Effect<A, E, R>
): Effect.Effect<A | undefined, E, R> => {
  const envList = Array.isArray(envs) ? envs : [envs]
  return Effect.flatMap(environment, (current) =>
    envList.includes(current)
      ? Effect.map(effect, (a) => a as A | undefined)
      : Effect.succeed(undefined)
  )
}

/**
 * Run an effect only in local/development
 */
export const whenLocal = <A, E, R>(
  effect: Effect.Effect<A, E, R>
): Effect.Effect<A | undefined, E, R> =>
  whenEnvironment(["local", "development"], effect)

/**
 * Run an effect only in production
 */
export const whenProduction = <A, E, R>(
  effect: Effect.Effect<A, E, R>
): Effect.Effect<A | undefined, E, R> =>
  whenEnvironment("production", effect)
