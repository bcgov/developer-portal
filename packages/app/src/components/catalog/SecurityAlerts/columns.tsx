import React from 'react';
import {
  CatalogTableColumnsFunc,
  CatalogTableRow,
} from '@backstage/plugin-catalog';
import { Theme, Typography, makeStyles } from '@material-ui/core';
import { TableColumn } from '@backstage/core-components';
import { startCase, camelCase } from 'lodash-es';
import { EntityRefLink } from '@backstage/plugin-catalog-react';

function prettyText(text: string) {
  return startCase(camelCase(text));
}

const useStyles = makeStyles((theme: Theme) => ({
  optional: {
    color: theme.palette.success.main,
  },
  recommended: {
    color: theme.palette.primary.main,
  },
  required: {
    color: theme.palette.warning.main,
  },
  'strictly-enforced': {
    color: theme.palette.error.main,
  },
}));

const entityColumn: TableColumn<CatalogTableRow> = {
  title: 'Entity',
  field: 'spec.entity',
  width: '15%',
  render: ({ entity }) => (
    <EntityRefLink entityRef={`${entity.spec?.entity}`} />
  ),
};

const alertColumn: TableColumn<CatalogTableRow> = {
  title: 'Alert',
  field: 'spec.alert',
  render: ({ entity }) => entity.spec?.alert,
};

const severityColumn: TableColumn<CatalogTableRow> = {
  title: 'Severity',
  field: 'spec.severity',
  width: '10%',
  render: row => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const classes = useStyles();
    const severity = row.entity.spec?.severity?.toString().toLowerCase();
    let level = 'recommended' as keyof typeof classes;
    if (severity === 'warning') {
      level = 'required';
    } else if (severity === 'critical') {
      level = 'strictly-enforced';
    }
    return (
      <Typography className={classes[level]} variant="body2">
        {prettyText(`${severity}`)}
      </Typography>
    );
  },
};

const policyColumn: TableColumn<CatalogTableRow> = {
  title: 'Policy',
  field: 'spec.policy',
  render: row => (
    <EntityRefLink entityRef={`policy:default/${row.entity.spec?.policy}`} />
  ),
};

const policyCategoryColumn: TableColumn<CatalogTableRow> = {
  title: 'Policy Category',
  field: 'spec.category',
  render: row => {
    return row.entity.spec?.category?.toString() || '';
  },
};

const levelColumn: TableColumn<CatalogTableRow> = {
  title: 'Policy Level',
  field: 'spec.level',
  width: '15%',
  render: row => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const classes = useStyles();
    const level = row.entity.spec?.level
      ?.toString()
      .toLowerCase() as keyof typeof classes;
    return (
      <Typography className={classes[level]} variant="body2">
        {prettyText(level) || ''}
      </Typography>
    );
  },
};

export const componentAlertsColumns: CatalogTableColumnsFunc = () => {
  return [
    alertColumn,
    severityColumn,
    levelColumn,
    policyColumn,
    policyCategoryColumn,
  ];
};

export const systemAlertsColumns: CatalogTableColumnsFunc = () => {
  return [
    entityColumn,
    alertColumn,
    severityColumn,
    levelColumn,
    policyColumn,
    policyCategoryColumn,
  ];
};
