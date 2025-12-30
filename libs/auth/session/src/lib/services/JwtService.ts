/**
 * @gello/auth-session - JWT Service
 *
 * Service for signing and verifying JWT tokens.
 */

import { Context, Effect, Layer } from "effect"
import { JwtError } from "../domain/errors.js"

/**
 * JWT payload
 */
export interface JwtPayload {
  readonly sub: string
  readonly iat: number
  readonly exp: number
  readonly [key: string]: unknown
}

/**
 * JWT service interface
 */
export interface JwtService {
  /**
   * Sign a payload and return a JWT token
   */
  readonly sign: (
    payload: Record<string, unknown>,
    expiresInSeconds?: number
  ) => Effect.Effect<string, JwtError>

  /**
   * Verify and decode a JWT token
   */
  readonly verify: (
    token: string
  ) => Effect.Effect<JwtPayload, JwtError>

  /**
   * Decode a JWT without verifying (for debugging)
   */
  readonly decode: (
    token: string
  ) => Effect.Effect<JwtPayload, JwtError>
}

/**
 * JWT service tag
 */
export class JwtServiceTag extends Context.Tag("@gello/auth/JwtService")<
  JwtServiceTag,
  JwtService
>() {}

/**
 * Base64url encode
 */
const base64urlEncode = (data: string): string => {
  const base64 = Buffer.from(data).toString("base64")
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

/**
 * Base64url decode
 */
const base64urlDecode = (data: string): string => {
  const base64 = data.replace(/-/g, "+").replace(/_/g, "/")
  const pad = base64.length % 4
  const padded = pad ? base64 + "=".repeat(4 - pad) : base64
  return Buffer.from(padded, "base64").toString("utf-8")
}

/**
 * HMAC SHA-256 signature
 */
const hmacSha256 = async (data: string, secret: string): Promise<string> => {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data))
  const base64 = Buffer.from(signature).toString("base64")
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

/**
 * Create a simple HS256 JWT service
 */
export const makeJwtService = (secret: string): JwtService => {
  return {
    sign: (payload, expiresInSeconds = 3600) =>
      Effect.tryPromise({
        try: async () => {
          const now = Math.floor(Date.now() / 1000)
          const fullPayload = {
            ...payload,
            iat: now,
            exp: now + expiresInSeconds,
          }

          const header = base64urlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }))
          const body = base64urlEncode(JSON.stringify(fullPayload))
          const signature = await hmacSha256(`${header}.${body}`, secret)

          return `${header}.${body}.${signature}`
        },
        catch: (e) =>
          new JwtError({
            message: "Failed to sign JWT",
            reason: "malformed",
            cause: e,
          }),
      }),

    verify: (token) =>
      Effect.tryPromise({
        try: async () => {
          const parts = token.split(".")
          if (parts.length !== 3) {
            throw new JwtError({
              message: "Invalid JWT format",
              reason: "malformed",
            })
          }

          const [header, body, signature] = parts
          const expectedSignature = await hmacSha256(`${header}.${body}`, secret)

          if (signature !== expectedSignature) {
            throw new JwtError({
              message: "Invalid JWT signature",
              reason: "invalid",
            })
          }

          const payload = JSON.parse(base64urlDecode(body)) as JwtPayload
          const now = Math.floor(Date.now() / 1000)

          if (payload.exp && payload.exp < now) {
            throw new JwtError({
              message: "JWT has expired",
              reason: "expired",
            })
          }

          return payload
        },
        catch: (e) => {
          if (e instanceof JwtError) return e
          return new JwtError({
            message: "Failed to verify JWT",
            reason: "malformed",
            cause: e,
          })
        },
      }),

    decode: (token) =>
      Effect.try({
        try: () => {
          const parts = token.split(".")
          if (parts.length !== 3) {
            throw new JwtError({
              message: "Invalid JWT format",
              reason: "malformed",
            })
          }
          return JSON.parse(base64urlDecode(parts[1])) as JwtPayload
        },
        catch: (e) => {
          if (e instanceof JwtError) return e
          return new JwtError({
            message: "Failed to decode JWT",
            reason: "malformed",
            cause: e,
          })
        },
      }),
  }
}

/**
 * Create a JWT service layer with a secret
 */
export const JwtServiceLive = (secret: string) =>
  Layer.succeed(JwtServiceTag, makeJwtService(secret))
