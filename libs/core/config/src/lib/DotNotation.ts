/**
 * Dot notation path utilities for nested config access
 *
 * "database.connections.postgres.host" -> config.database.connections.postgres.host
 */

import { Option } from "effect"

/**
 * Get a nested value from an object using dot notation
 */
export const getPath = (obj: unknown, path: string): Option.Option<unknown> => {
  if (path === "") return Option.some(obj)

  const parts = path.split(".")
  let current: unknown = obj

  for (const part of parts) {
    if (current === null || current === undefined) {
      return Option.none()
    }
    if (typeof current !== "object") {
      return Option.none()
    }
    current = (current as Record<string, unknown>)[part]
  }

  return current === undefined ? Option.none() : Option.some(current)
}

/**
 * Set a nested value in an object using dot notation (immutably)
 */
export const setPath = <T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown
): T => {
  if (path === "") return value as T

  const parts = path.split(".")
  const result = { ...obj } as Record<string, unknown>
  let current = result

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (current[part] === undefined || current[part] === null) {
      current[part] = {}
    } else {
      current[part] = { ...(current[part] as Record<string, unknown>) }
    }
    current = current[part] as Record<string, unknown>
  }

  current[parts[parts.length - 1]] = value
  return result as T
}

/**
 * Check if a path exists in an object
 */
export const hasPath = (obj: unknown, path: string): boolean => {
  return Option.isSome(getPath(obj, path))
}

/**
 * Deep merge two config objects
 * Later values override earlier ones
 */
export const deepMerge = <T extends Record<string, unknown>>(
  base: T,
  override: Partial<T>
): T => {
  const result = { ...base } as Record<string, unknown>

  for (const key of Object.keys(override)) {
    const baseValue = result[key]
    const overrideValue = (override as Record<string, unknown>)[key]

    if (
      overrideValue !== null &&
      typeof overrideValue === "object" &&
      !Array.isArray(overrideValue) &&
      baseValue !== null &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue)
    ) {
      result[key] = deepMerge(
        baseValue as Record<string, unknown>,
        overrideValue as Record<string, unknown>
      )
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue
    }
  }

  return result as T
}

/**
 * Flatten a nested object to dot notation keys
 */
export const flatten = (
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, unknown> => {
  const result: Record<string, unknown> = {}

  for (const key of Object.keys(obj)) {
    const value = obj[key]
    const newKey = prefix ? `${prefix}.${key}` : key

    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      Object.assign(result, flatten(value as Record<string, unknown>, newKey))
    } else {
      result[newKey] = value
    }
  }

  return result
}
