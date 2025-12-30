/**
 * Main Wizard component for gello new command
 */
import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Box, Text, useApp } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import {
  gruvbox,
  GELLO_LOGO,
  type WizardState,
  type ProjectType,
  type InfrastructureConfig,
  type FeatureFlags,
  type PackageManager,
  PROJECT_TYPE_OPTIONS,
  FEATURE_OPTIONS,
  PACKAGE_MANAGER_OPTIONS,
  getDefaultState,
} from '../../components/wizard/index.js';
import { MultiSelect } from '../../components/wizard/MultiSelect.js';
import { InfrastructureSelect } from '../../components/wizard/InfrastructureSelect.js';
import { StepIndicator } from '../../components/wizard/StepIndicator.js';
import { createProject, type CreationProgress } from './createProject.js';

interface WizardProps {
  projectName: string;
}

export const Wizard: React.FC<WizardProps> = ({ projectName }) => {
  useApp(); // Required for ink lifecycle
  const [state, setState] = useState<WizardState>(getDefaultState(projectName));
  const [creationSteps, setCreationSteps] = useState<Array<{ text: string; done: boolean }>>([]);

  // Project type selection handler
  const handleProjectTypeSelect = useCallback((item: { value: string }) => {
    setState((prev) => ({
      ...prev,
      projectType: item.value as ProjectType,
      step: 'infrastructure',
    }));
  }, []);

  // Infrastructure config handler
  const handleInfrastructureChange = useCallback((config: InfrastructureConfig) => {
    setState((prev) => ({
      ...prev,
      infrastructure: config,
    }));
  }, []);

  const handleInfrastructureSubmit = useCallback(() => {
    setState((prev) => ({ ...prev, step: 'features' }));
  }, []);

  // Features selection handler
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(
    new Set(FEATURE_OPTIONS.filter((f) => f.default).map((f) => f.value))
  );

  const handleFeaturesChange = useCallback((selected: Set<string>) => {
    setSelectedFeatures(selected);
  }, []);

  const handleFeaturesSubmit = useCallback(() => {
    const features: FeatureFlags = {
      authentication: selectedFeatures.has('authentication'),
      authorization: selectedFeatures.has('authorization'),
      oauth: selectedFeatures.has('oauth'),
      database: selectedFeatures.has('database'),
      storage: selectedFeatures.has('storage'),
      openapi: selectedFeatures.has('openapi'),
    };
    setState((prev) => ({
      ...prev,
      features,
      step: 'package-manager',
    }));
  }, [selectedFeatures]);

  // Package manager selection handler
  const handlePackageManagerSelect = useCallback((item: { value: string }) => {
    setState((prev) => ({
      ...prev,
      packageManager: item.value as PackageManager,
      step: 'creating',
    }));
  }, []);

  // Project creation
  useEffect(() => {
    if (state.step !== 'creating') return;

    const runCreation = async () => {
      const onProgress = (progress: CreationProgress) => {
        if (progress.type === 'step-start') {
          setCreationSteps((prev) => [...prev, { text: progress.message, done: false }]);
        } else if (progress.type === 'step-complete') {
          setCreationSteps((prev) => {
            const newSteps = [...prev];
            const lastIncomplete = newSteps.findIndex((s) => !s.done);
            if (lastIncomplete !== -1) {
              newSteps[lastIncomplete] = { ...newSteps[lastIncomplete], done: true };
            }
            return newSteps;
          });
        }
      };

      try {
        await createProject({
          projectName: state.projectName,
          projectType: state.projectType,
          infrastructure: state.infrastructure,
          features: state.features,
          packageManager: state.packageManager,
          onProgress,
        });
        setState((prev) => ({ ...prev, step: 'complete' }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          step: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    runCreation();
  }, [state.step]);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Logo */}
      <Box marginBottom={1}>
        <Text color={gruvbox.orange}>{GELLO_LOGO}</Text>
      </Box>

      {/* Title */}
      <Box marginBottom={1}>
        <Text bold color={gruvbox.fg}>
          Creating new project: <Text color={gruvbox.aqua}>{projectName}</Text>
        </Text>
      </Box>

      {/* Step Indicator */}
      <StepIndicator currentStep={state.step} />

      {/* Step Content */}
      <Box flexDirection="column" marginTop={1}>
        {/* Step 1: Project Type */}
        {state.step === 'project-type' && (
          <Box flexDirection="column">
            <Box marginBottom={1}>
              <Text bold color={gruvbox.yellow}>
                What would you like to build?
              </Text>
            </Box>
            <SelectInput
              items={PROJECT_TYPE_OPTIONS.map((opt) => ({
                label: `${opt.label} - ${opt.description}`,
                value: opt.value,
              }))}
              onSelect={handleProjectTypeSelect}
            />
          </Box>
        )}

        {/* Step 2: Infrastructure */}
        {state.step === 'infrastructure' && (
          <Box flexDirection="column">
            <Box marginBottom={1}>
              <Text bold color={gruvbox.yellow}>
                Configure your infrastructure:
              </Text>
            </Box>
            <InfrastructureSelect
              config={state.infrastructure}
              onChange={handleInfrastructureChange}
              onSubmit={handleInfrastructureSubmit}
            />
          </Box>
        )}

        {/* Step 3: Features */}
        {state.step === 'features' && (
          <Box flexDirection="column">
            <Box marginBottom={1}>
              <Text bold color={gruvbox.yellow}>
                Select additional features:
              </Text>
            </Box>
            <MultiSelect
              options={FEATURE_OPTIONS}
              selected={selectedFeatures}
              onChange={handleFeaturesChange}
              onSubmit={handleFeaturesSubmit}
            />
          </Box>
        )}

        {/* Step 4: Package Manager */}
        {state.step === 'package-manager' && (
          <Box flexDirection="column">
            <Box marginBottom={1}>
              <Text bold color={gruvbox.yellow}>
                Choose your package manager:
              </Text>
            </Box>
            <SelectInput
              items={PACKAGE_MANAGER_OPTIONS.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
              onSelect={handlePackageManagerSelect}
            />
          </Box>
        )}

        {/* Creating */}
        {state.step === 'creating' && (
          <Box flexDirection="column">
            <Box marginBottom={1}>
              <Text bold color={gruvbox.yellow}>
                Creating your project...
              </Text>
            </Box>
            {creationSteps.map((step, i) => (
              <Box key={i}>
                {step.done ? (
                  <Text color={gruvbox.green}>✓ </Text>
                ) : (
                  <Text color={gruvbox.yellow}>
                    <Spinner type="dots" />{' '}
                  </Text>
                )}
                <Text color={step.done ? gruvbox.fg4 : gruvbox.fg}>{step.text}</Text>
              </Box>
            ))}
          </Box>
        )}

        {/* Complete */}
        {state.step === 'complete' && (
          <Box
            flexDirection="column"
            borderStyle="round"
            borderColor={gruvbox.green}
            paddingX={2}
            paddingY={1}
          >
            <Text color={gruvbox.green} bold>
              Project created successfully!
            </Text>
            <Box marginTop={1} flexDirection="column">
              <Text color={gruvbox.fg}>Get started:</Text>
              <Box marginLeft={2} flexDirection="column" marginTop={1}>
                <Text color={gruvbox.yellow}>cd {projectName}</Text>
                <Text color={gruvbox.yellow}>cp .env.example .env</Text>
                <Text color={gruvbox.yellow}>gello serve</Text>
              </Box>
            </Box>
            <Box marginTop={1}>
              <Text color={gruvbox.gray}>
                Or start individual apps with: gello serve api, gello serve web
              </Text>
            </Box>
          </Box>
        )}

        {/* Error */}
        {state.step === 'error' && (
          <Box
            flexDirection="column"
            borderStyle="round"
            borderColor={gruvbox.red}
            paddingX={2}
            paddingY={1}
          >
            <Text color={gruvbox.red} bold>
              Error creating project
            </Text>
            <Text color={gruvbox.fg}>{state.error}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
