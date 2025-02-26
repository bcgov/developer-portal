import React from 'react';
import Box from '@material-ui/core/Box';
import { Select } from '@backstage/core-components';

export const EntityAlertCategoryPicker = () => {
  return (
    <Box pb={1} pt={1}>
      <Select
        label="Category"
        items={[
          {
            value: 'dependencies',
            label: 'Dependencies',
          },
          {
            value: 'runtime',
            label: 'Runtime',
          },
          {
            value: 'secrets',
            label: 'Secrets',
          },
        ]}
        onChange={() => {}}
      />
    </Box>
  );
};

export const EntityAlertLevelPicker = () => {
  return (
    <Box pb={1} pt={1}>
      <Select
        label="Policy Level"
        items={[
          {
            value: 'recommended',
            label: 'Recommended',
          },
          {
            value: 'required',
            label: 'Required',
          },
          {
            value: 'optional',
            label: 'Optional',
          },
        ]}
        onChange={() => {}}
      />
    </Box>
  );
};

export const EntityAlertSeverityPicker = () => {
  return (
    <Box pb={1} pt={1}>
      <Select
        label="Severity"
        items={[
          {
            value: 'warning',
            label: 'Warning',
          },
          {
            value: 'info',
            label: 'Info',
          },
          {
            value: 'critical',
            label: 'Critical',
          },
        ]}
        onChange={() => {}}
      />
    </Box>
  );
};
