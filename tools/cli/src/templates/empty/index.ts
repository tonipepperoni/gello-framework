/**
 * Empty Template
 *
 * The default template that adds no additional files.
 * Uses the base project structure from createProject.
 */
import type { Template, GeneratedFiles, TemplateContext } from '../types.js';

export const emptyTemplate: Template = {
  id: 'empty',
  name: 'Empty Project',
  description: 'Minimal starter with basic setup',

  generate(_context: TemplateContext): GeneratedFiles {
    // Empty template doesn't add any extra files
    return {
      files: new Map(),
      dependencies: [],
      devDependencies: [],
    };
  },
};
