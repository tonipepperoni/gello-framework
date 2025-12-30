/**
 * Template System
 *
 * Central export for the template system and all registered templates.
 */

// Export types
export type {
  Template,
  TemplateConfig,
  TemplateContext,
  GeneratedFiles,
} from './types.js';
export { createTemplateContext } from './types.js';

// Export registry
export { templateRegistry } from './registry.js';

// Import and register templates
import { templateRegistry } from './registry.js';
import { emptyTemplate } from './empty/index.js';
import { todoTemplate } from './todo/index.js';

// Register all templates
templateRegistry.register(emptyTemplate);
templateRegistry.register(todoTemplate);
