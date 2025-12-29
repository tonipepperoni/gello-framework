/**
 * @gello/mail-templates - ReactEmailEngine
 *
 * Template engine implementation using React Email.
 * Renders React components to HTML and plain text for email delivery.
 */

import * as React from "react"
import { Effect, Layer } from "effect"
import { render } from "@react-email/render"
import {
  type TemplateEngine,
  type RenderedTemplate,
  type CompiledTemplate,
  TemplateEngineTag,
  TemplateError,
  TemplateNotFoundError,
} from "@gello/mail-core"

// =============================================================================
// Types
// =============================================================================

/**
 * A React Email template component
 */
export type EmailTemplate<TProps = Record<string, unknown>> =
  React.ComponentType<TProps>

/**
 * Template registry for storing named templates
 */
export type TemplateRegistry = Map<string, EmailTemplate>

// =============================================================================
// Template Registry
// =============================================================================

/**
 * In-memory registry for React Email templates.
 * Templates are registered by name and can be rendered with data.
 */
const templateRegistry: TemplateRegistry = new Map()

/**
 * Register a React Email template
 */
export function registerTemplate<TProps = Record<string, unknown>>(
  name: string,
  template: EmailTemplate<TProps>
): void {
  templateRegistry.set(name, template as EmailTemplate)
}

/**
 * Register multiple templates at once
 */
export function registerTemplates(
  templates: Record<string, EmailTemplate>
): void {
  for (const [name, template] of Object.entries(templates)) {
    registerTemplate(name, template)
  }
}

/**
 * Get a registered template
 */
export function getTemplate(name: string): EmailTemplate | undefined {
  return templateRegistry.get(name)
}

/**
 * Clear all registered templates (useful for testing)
 */
export function clearTemplates(): void {
  templateRegistry.clear()
}

// =============================================================================
// Render Utilities
// =============================================================================

/**
 * Render a React component to HTML
 */
const renderToHtml = (
  element: React.ReactElement
): Effect.Effect<string, TemplateError> =>
  Effect.tryPromise({
    try: () => render(element, { pretty: true }),
    catch: (error) =>
      new TemplateError({
        message: `Failed to render HTML: ${error}`,
        cause: error,
      }),
  })

/**
 * Render a React component to plain text
 */
const renderToText = (
  element: React.ReactElement
): Effect.Effect<string, TemplateError> =>
  Effect.tryPromise({
    try: () => render(element, { plainText: true }),
    catch: (error) =>
      new TemplateError({
        message: `Failed to render text: ${error}`,
        cause: error,
      }),
  })

/**
 * Render a React component to both HTML and plain text
 */
export const renderEmail = (
  element: React.ReactElement
): Effect.Effect<RenderedTemplate, TemplateError> =>
  Effect.gen(function* () {
    const html = yield* renderToHtml(element)
    const text = yield* renderToText(element)
    return { html, text }
  })

// =============================================================================
// ReactEmailEngine Implementation
// =============================================================================

/**
 * Create a React Email template engine instance
 */
const makeReactEmailEngine = (): TemplateEngine => ({
  name: "react-email",

  render: (
    template: string,
    data: Record<string, unknown>
  ): Effect.Effect<RenderedTemplate, TemplateError | TemplateNotFoundError> =>
    Effect.gen(function* () {
      const Template = templateRegistry.get(template)

      if (!Template) {
        return yield* Effect.fail(
          new TemplateNotFoundError({
            message: `Template "${template}" not found`,
            template,
          })
        )
      }

      const element = React.createElement(Template, data)
      return yield* renderEmail(element)
    }),

  compile: (
    template: string
  ): Effect.Effect<CompiledTemplate, TemplateError | TemplateNotFoundError> =>
    Effect.gen(function* () {
      const Template = templateRegistry.get(template)

      if (!Template) {
        return yield* Effect.fail(
          new TemplateNotFoundError({
            message: `Template "${template}" not found`,
            template,
          })
        )
      }

      return {
        render: (
          data: Record<string, unknown>
        ): Effect.Effect<RenderedTemplate, TemplateError> => {
          const element = React.createElement(Template, data)
          return renderEmail(element)
        },
      }
    }),

  exists: (template: string): Effect.Effect<boolean, TemplateError> =>
    Effect.succeed(templateRegistry.has(template)),
})

// =============================================================================
// Layer
// =============================================================================

/**
 * Live layer for React Email engine
 */
export const ReactEmailEngineLive = Layer.succeed(
  TemplateEngineTag,
  makeReactEmailEngine()
)

// =============================================================================
// Direct Rendering (without registry)
// =============================================================================

/**
 * Render a React Email component directly without using the registry.
 * Useful for one-off emails or testing.
 */
export const renderDirect = <TProps extends Record<string, unknown>>(
  Template: EmailTemplate<TProps>,
  props: TProps
): Effect.Effect<RenderedTemplate, TemplateError> => {
  const element = React.createElement(Template, props)
  return renderEmail(element)
}

/**
 * Render a React element directly to HTML and text
 */
export const renderElement = (
  element: React.ReactElement
): Effect.Effect<RenderedTemplate, TemplateError> => renderEmail(element)
