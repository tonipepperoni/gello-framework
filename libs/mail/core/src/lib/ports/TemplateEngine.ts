/**
 * @gello/mail-core - TemplateEngine Port
 *
 * Port interface for template rendering implementations.
 */

import { Context, Effect } from "effect"
import type { TemplateError, TemplateNotFoundError } from "../domain/errors.js"

// =============================================================================
// Rendered Template
// =============================================================================

/**
 * Result of rendering a template
 */
export interface RenderedTemplate {
  readonly html: string
  readonly text?: string
}

// =============================================================================
// Compiled Template
// =============================================================================

/**
 * A pre-compiled template for reuse
 */
export interface CompiledTemplate {
  /**
   * Render the compiled template with data
   */
  render(
    data: Record<string, unknown>
  ): Effect.Effect<RenderedTemplate, TemplateError>
}

// =============================================================================
// TemplateEngine Interface
// =============================================================================

/**
 * Port interface for template engines.
 *
 * Implementations include:
 * - ReactEmailEngine: React Email components
 * - MjmlEngine: MJML templates (future)
 */
export interface TemplateEngine {
  /**
   * Engine name identifier
   */
  readonly name: string

  /**
   * Render a template with data
   */
  render(
    template: string,
    data: Record<string, unknown>
  ): Effect.Effect<RenderedTemplate, TemplateError | TemplateNotFoundError>

  /**
   * Compile a template for reuse (optimization)
   */
  compile(
    template: string
  ): Effect.Effect<CompiledTemplate, TemplateError | TemplateNotFoundError>

  /**
   * Check if a template exists
   */
  exists(template: string): Effect.Effect<boolean, TemplateError>
}

// =============================================================================
// Context Tag
// =============================================================================

/**
 * Context tag for TemplateEngine dependency injection
 */
export class TemplateEngineTag extends Context.Tag("@gello/TemplateEngine")<
  TemplateEngineTag,
  TemplateEngine
>() {}
