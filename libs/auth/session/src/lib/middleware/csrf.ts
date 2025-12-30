/**
 * @gello/auth-session - CSRF Middleware
 *
 * Cross-Site Request Forgery protection for SPA authentication.
 */

import { Context, Effect } from "effect"
import { HttpServerRequest, HttpServerResponse } from "@effect/platform"
import type { Middleware } from "@gello/core-domain-middleware"
import { CsrfToken, Session } from "../domain/types.js"
import { CsrfMismatchError } from "../domain/errors.js"

/**
 * Context tag for the CSRF token
 */
export class CsrfTokenTag extends Context.Tag("@gello/auth/CsrfToken")<
  CsrfTokenTag,
  CsrfToken
>() {}

/**
 * CSRF configuration
 */
export interface CsrfConfig {
  /**
   * Cookie name for CSRF token
   */
  readonly cookieName: string

  /**
   * Header name for CSRF token
   */
  readonly headerName: string

  /**
   * HTTP methods that require CSRF validation
   */
  readonly protectedMethods: ReadonlyArray<string>

  /**
   * Cookie path
   */
  readonly path: string

  /**
   * Secure cookie
   */
  readonly secure: boolean

  /**
   * Same-site policy
   */
  readonly sameSite: "strict" | "lax" | "none"
}

/**
 * Default CSRF configuration
 */
export const defaultCsrfConfig: CsrfConfig = {
  cookieName: "XSRF-TOKEN",
  headerName: "X-XSRF-TOKEN",
  protectedMethods: ["POST", "PUT", "PATCH", "DELETE"],
  path: "/",
  secure: true,
  sameSite: "lax",
}

/**
 * Parse cookies from header
 */
const parseCookies = (header: string | undefined): Map<string, string> => {
  const cookies = new Map<string, string>()
  if (!header) return cookies

  header.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split("=")
    if (name) {
      cookies.set(name, rest.join("="))
    }
  })

  return cookies
}

/**
 * CSRF protection middleware
 *
 * For SPA authentication flow:
 * 1. GET /api/csrf-cookie - Sets XSRF-TOKEN cookie (readable by JS)
 * 2. POST /api/login - Validates X-XSRF-TOKEN header matches cookie
 */
export const csrf = (config: Partial<CsrfConfig> = {}): Middleware => {
  const cfg = { ...defaultCsrfConfig, ...config }

  return {
    name: "csrf",
    apply: <A, E, R>(effect: Effect.Effect<A, E, R>) =>
      Effect.gen(function* () {
        const request = yield* HttpServerRequest.HttpServerRequest
        const method = request.method.toUpperCase()

        // Only validate protected methods
        if (!cfg.protectedMethods.includes(method)) {
          return yield* effect
        }

        const cookies = parseCookies(request.headers["cookie"])
        const cookieToken = cookies.get(cfg.cookieName)
        const headerToken = request.headers[cfg.headerName.toLowerCase()]

        if (!cookieToken || !headerToken) {
          return HttpServerResponse.json(
            { error: "CSRF token missing" },
            { status: 419 }
          ) as A
        }

        // Constant-time comparison to prevent timing attacks
        if (cookieToken !== headerToken) {
          return HttpServerResponse.json(
            { error: "CSRF token mismatch" },
            { status: 419 }
          ) as A
        }

        return yield* effect.pipe(
          Effect.provideService(CsrfTokenTag, CsrfToken(cookieToken))
        )
      }) as Effect.Effect<A, E, R>,
  }
}

/**
 * Generate CSRF cookie for SPA
 * Use this in a route like GET /api/csrf-cookie
 */
export const generateCsrfCookie = (
  config: Partial<CsrfConfig> = {}
): Effect.Effect<string> => {
  const cfg = { ...defaultCsrfConfig, ...config }

  return Effect.sync(() => {
    const token = Session.generateCsrfToken()

    const cookieParts = [
      `${cfg.cookieName}=${token}`,
      `Path=${cfg.path}`,
      // Not HttpOnly so JS can read it
      cfg.secure ? "Secure" : "",
      `SameSite=${cfg.sameSite}`,
    ].filter(Boolean)

    return cookieParts.join("; ")
  })
}

/**
 * Verify CSRF token manually (for non-middleware use)
 */
export const verifyCsrfToken = (
  expected: string,
  provided: string
): Effect.Effect<void, CsrfMismatchError> =>
  Effect.gen(function* () {
    if (expected !== provided) {
      return yield* Effect.fail(
        new CsrfMismatchError({
          message: "CSRF token mismatch",
        })
      )
    }
  })
