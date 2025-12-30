/**
 * MultiSelect component for feature selection
 */
import * as React from 'react';
import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { gruvbox } from './theme.js';

interface Option {
  label: string;
  value: string;
  description?: string;
  default?: boolean;
}

interface MultiSelectProps {
  options: readonly Option[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
  onSubmit: () => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  onSubmit,
}) => {
  const [focusIndex, setFocusIndex] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) {
      setFocusIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
    } else if (key.downArrow) {
      setFocusIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
    } else if (input === ' ') {
      const option = options[focusIndex];
      const newSelected = new Set(selected);
      if (newSelected.has(option.value)) {
        newSelected.delete(option.value);
      } else {
        newSelected.add(option.value);
      }
      onChange(newSelected);
    } else if (key.return) {
      onSubmit();
    }
  });

  return (
    <Box flexDirection="column">
      {options.map((option, index) => {
        const isFocused = index === focusIndex;
        const isSelected = selected.has(option.value);

        return (
          <Box key={option.value}>
            <Text color={isFocused ? gruvbox.orange : gruvbox.gray}>
              {isFocused ? '❯ ' : '  '}
            </Text>
            <Text color={isSelected ? gruvbox.green : gruvbox.gray}>
              {isSelected ? '◉ ' : '○ '}
            </Text>
            <Text color={isFocused ? gruvbox.fg : gruvbox.fg4}>
              {option.label}
            </Text>
            {option.description && (
              <Text color={gruvbox.gray}> - {option.description}</Text>
            )}
          </Box>
        );
      })}
      <Box marginTop={1}>
        <Text color={gruvbox.gray}>
          [↑↓] Navigate  [Space] Toggle  [Enter] Continue
        </Text>
      </Box>
    </Box>
  );
};
