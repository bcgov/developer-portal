import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
import { PolicyRating } from '../EntityPoliciesCard';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: '15px',
    marginRight: '15px',
    marginBottom: '15px',
  },
  systemsAlertsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
});

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

export const SystemSecurityAlertsContent = () => {
  const classes = useStyles();
  return (
    <Grid className={classes.systemsAlertsContainer}>
      <Grid className={classes.header}>
        <Typography variant="h5">Security Alerts</Typography>
        <PolicyRating rating="BRONZE" />
      </Grid>
      <Divider variant="middle" />
      <EntityListProvider>
        <CatalogFilterLayout>
          <CatalogFilterLayout.Filters>
            <EntityKindPicker initialFilter="alert" hidden />
            <EntityAlertCategoryPicker />
            <EntityAlertLevelPicker />
            <EntityAlertSeverityPicker />
          </CatalogFilterLayout.Filters>
          <CatalogFilterLayout.Content>
            <CatalogTable columns={systemAlertsColumns} actions={[]} />
          </CatalogFilterLayout.Content>
        </CatalogFilterLayout>
      </EntityListProvider>
    </Grid>
  );
};
