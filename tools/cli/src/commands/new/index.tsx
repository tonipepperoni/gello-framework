/**
 * gello new command - Create a new Gello project with wizard
 */
import { render } from 'ink';
import { Wizard } from './Wizard.js';

export interface NewProjectOptions {
  name: string;
  template?: string;
  skipWizard?: boolean;
}

export const newCommand = async (options: NewProjectOptions) => {
  const { waitUntilExit } = render(<Wizard projectName={options.name} />);
  await waitUntilExit();
};

export default newCommand;
