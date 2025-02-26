import React from 'react';
import { Grid } from '@material-ui/core';
import {
  EntityListProvider,
  CatalogFilterLayout,
  EntityKindPicker,
} from '@backstage/plugin-catalog-react';
import { CatalogTable } from '@backstage/plugin-catalog';
import {
  EntityAlertCategoryPicker,
  EntityAlertLevelPicker,
  EntityAlertSeverityPicker,
} from './filters';
import { componentAlertsColumns, systemAlertsColumns } from './columns';

export const componentSecurityAlertsContent = (
  <EntityListProvider>
    <CatalogFilterLayout>
      <CatalogFilterLayout.Filters>
        <EntityKindPicker initialFilter="alert" hidden />
        <EntityAlertCategoryPicker />
        <EntityAlertLevelPicker />
        <EntityAlertSeverityPicker />
      </CatalogFilterLayout.Filters>
      <CatalogFilterLayout.Content>
        <CatalogTable columns={componentAlertsColumns} actions={[]} />
      </CatalogFilterLayout.Content>
    </CatalogFilterLayout>
  </EntityListProvider>
);

export const systemSecurityAlertsContent = (
  <Grid container spacing={3} alignItems="stretch">
    <Grid item md={6}>
      header with rating
    </Grid>
  </Grid>
);
