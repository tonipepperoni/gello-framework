/**
 * InfrastructureSelect component for driver selection
 */
import * as React from 'react';
import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { gruvbox } from './theme.js';
import type { InfrastructureConfig } from './types.js';
import { INFRASTRUCTURE_OPTIONS } from './types.js';

interface InfrastructureSelectProps {
  config: InfrastructureConfig;
  onChange: (config: InfrastructureConfig) => void;
  onSubmit: () => void;
}

type Field = keyof InfrastructureConfig;
const FIELDS: Field[] = ['queue', 'cache', 'mail', 'session'];
const FIELD_LABELS: Record<Field, string> = {
  queue: 'Queue Driver',
  cache: 'Cache Driver',
  mail: 'Mail Driver',
  session: 'Session Driver',
};

export const InfrastructureSelect: React.FC<InfrastructureSelectProps> = ({
  config,
  onChange,
  onSubmit,
}) => {
  const [fieldIndex, setFieldIndex] = useState(0);
  const currentField = FIELDS[fieldIndex];
  const options = INFRASTRUCTURE_OPTIONS[currentField];
  const currentValue = config[currentField];
  const currentOptionIndex = options.findIndex((o) => o.value === currentValue);

  useInput((input, key) => {
    if (key.upArrow) {
      // Move to previous field
      setFieldIndex((prev) => (prev > 0 ? prev - 1 : FIELDS.length - 1));
    } else if (key.downArrow) {
      // Move to next field
      setFieldIndex((prev) => (prev < FIELDS.length - 1 ? prev + 1 : 0));
    } else if (key.leftArrow) {
      // Previous option in current field
      const newIndex = currentOptionIndex > 0 ? currentOptionIndex - 1 : options.length - 1;
      onChange({
        ...config,
        [currentField]: options[newIndex].value,
      });
    } else if (key.rightArrow) {
      // Next option in current field
      const newIndex = currentOptionIndex < options.length - 1 ? currentOptionIndex + 1 : 0;
      onChange({
        ...config,
        [currentField]: options[newIndex].value,
      });
    } else if (key.return) {
      onSubmit();
    }
  });

  return (
    <Box flexDirection="column">
      {FIELDS.map((field, index) => {
        const isFocused = index === fieldIndex;
        const fieldOptions = INFRASTRUCTURE_OPTIONS[field];
        const selectedValue = config[field];

        return (
          <Box key={field} marginBottom={1}>
            <Box width={18}>
              <Text color={isFocused ? gruvbox.orange : gruvbox.fg4}>
                {isFocused ? '❯ ' : '  '}
                {FIELD_LABELS[field]}:
              </Text>
            </Box>
            <Box>
              {fieldOptions.map((option, optIndex) => {
                const isSelected = option.value === selectedValue;
                return (
                  <Box key={option.value} marginRight={2}>
                    <Text
                      color={isSelected ? gruvbox.green : gruvbox.gray}
                      bold={isSelected}
                    >
                      {isSelected ? '●' : '○'} {option.label}
                    </Text>
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      })}
      <Box marginTop={1}>
        <Text color={gruvbox.gray}>
          [↑↓] Change field  [←→] Select option  [Enter] Continue
        </Text>
      </Box>
    </Box>
  );
};
