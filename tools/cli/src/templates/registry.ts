/**
 * Template Registry
 *
 * Central registry for all available starter templates.
 */
import type { StarterTemplate } from '../components/wizard/types.js';
import type { Template, TemplateConfig, GeneratedFiles } from './types.js';
import { createTemplateContext } from './types.js';

class TemplateRegistry {
  private templates = new Map<StarterTemplate, Template>();

  /**
   * Register a template
   */
  register(template: Template): void {
    this.templates.set(template.id, template);
  }

  /**
   * Get a template by ID
   */
  get(id: StarterTemplate): Template | undefined {
    return this.templates.get(id);
  }

  /**
   * Get all registered templates
   */
  all(): Template[] {
    return Array.from(this.templates.values());
  }

  /**
   * Generate files for a template
   */
  generate(id: StarterTemplate, config: TemplateConfig): GeneratedFiles {
    const template = this.templates.get(id);
    if (!template) {
      // Return empty result for unknown templates
      return {
        files: new Map(),
        dependencies: [],
        devDependencies: [],
      };
    }

    const context = createTemplateContext(config);
    return template.generate(context);
  }
}

// Singleton registry instance
export const templateRegistry = new TemplateRegistry();
