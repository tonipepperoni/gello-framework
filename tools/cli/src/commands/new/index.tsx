/**
 * gello new command - Create a new Gello project with wizard
 */
import { render } from 'ink';
import { Wizard } from './Wizard.js';
import { createProject } from './createProject.js';

export interface NewProjectOptions {
  name: string;
  template?: string;
  yes?: boolean; // Non-interactive mode with defaults
}

export const newCommand = async (options: NewProjectOptions) => {
  // Non-interactive mode: use sensible defaults
  if (options.yes) {
    console.log(`Creating project: ${options.name}`);
    console.log('Using defaults: api-spa-tanstack, todo template, auth enabled, pnpm\n');

    await createProject({
      projectName: options.name,
      projectType: 'api-spa-tanstack',
      template: 'todo',
      infrastructure: {
        queue: 'sync',
        cache: 'memory',
        mail: 'log',
        session: 'memory',
      },
      features: {
        authentication: true,
        authorization: true,
        oauth: false,
        database: true,
        storage: false,
        openapi: true,
      },
      packageManager: 'pnpm',
      onProgress: (progress) => {
        if (progress.type === 'step-start') {
          process.stdout.write(`  ${progress.message}...`);
        } else if (progress.type === 'step-complete') {
          console.log(' done');
        }
      },
    });

    console.log('\n✓ Project created successfully!');
    console.log(`\nGet started:\n  cd ${options.name}\n  cp .env.example .env\n  gello serve`);
    return;
  }

  // Interactive wizard mode
  const { waitUntilExit } = render(<Wizard projectName={options.name} />);
  await waitUntilExit();
};

export default newCommand;
