/**
 * StepIndicator component showing wizard progress
 */
import * as React from 'react';
import { Box, Text } from 'ink';
import { gruvbox } from './theme.js';
import type { WizardStep } from './types.js';

interface StepIndicatorProps {
  currentStep: WizardStep;
}

const STEPS: { key: WizardStep; label: string }[] = [
  { key: 'project-type', label: 'Type' },
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'features', label: 'Features' },
  { key: 'package-manager', label: 'Package Manager' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  // Don't show for creating/complete/error states
  if (currentIndex === -1) {
    return null;
  }

  return (
    <Box marginBottom={1}>
      {STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        let color: string = gruvbox.gray;
        let symbol = '○';

        if (isComplete) {
          color = gruvbox.green;
          symbol = '●';
        } else if (isCurrent) {
          color = gruvbox.orange;
          symbol = '◉';
        }

        return (
          <React.Fragment key={step.key}>
            <Box>
              <Text color={color}>
                {symbol} {step.label}
              </Text>
            </Box>
            {index < STEPS.length - 1 && (
              <Text color={gruvbox.gray}> → </Text>
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};
