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
  render: ({ entity }) => entity.spec?.entity,
};

const typeColumn: TableColumn<CatalogTableRow> = {
  title: 'Type',
  field: 'spec.entityType',
  width: '10%',
  render: ({ entity }) => entity.spec?.entityType,
};

const alertColumn: TableColumn<CatalogTableRow> = {
  title: 'Alert',
  field: 'metadata.description',
  render: ({ entity }) => entity.metadata?.description,
};

const severityColumn: TableColumn<CatalogTableRow> = {
  title: 'Severity',
  field: 'spec.severity',
  width: '10%',
  render: row => {
    return row.entity.spec?.severity?.toString() || '';
  },
};

const policyColumn: TableColumn<CatalogTableRow> = {
  title: 'Policy Category',
  field: 'spec.category',
  render: row => (
    <EntityRefLink
      entityRef={`policy:${
        row.entity.metadata.title || row.entity.metadata.name
      }`}
    />
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
  title: 'Level',
  field: 'spec.level',
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
    policyColumn,
    policyCategoryColumn,
    levelColumn,
  ];
};

export const systemAlertsColumns: CatalogTableColumnsFunc = () => {
  return [
    entityColumn,
    typeColumn,
    alertColumn,
    severityColumn,
    policyColumn,
    policyCategoryColumn,
    levelColumn,
  ];
};
