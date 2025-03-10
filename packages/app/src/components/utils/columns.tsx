import React from 'react';
import {
  CatalogTable,
  CatalogTableColumnsFunc,
} from '@backstage/plugin-catalog';
import { startCase, camelCase } from 'lodash-es';
import { Theme, Typography, makeStyles } from '@material-ui/core';
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

export const columns: CatalogTableColumnsFunc = entityListContext => {
  if (entityListContext.filters.kind?.value === 'policy') {
    return [
      CatalogTable.columns.createNameColumn(),
      {
        title: 'Level',
        field: 'spec.level',
        width: '17%',
        render: row => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const classes = useStyles();
          const level =
            row.entity.spec?.level?.toString() as keyof typeof classes;
          return (
            <Typography className={classes[level]} variant="body2">
              {prettyText(level || '')}
            </Typography>
          );
        },
      },
      {
        title: 'Description',
        field: 'resolved.description',
        highlight: false,
        render: ({ entity }) => entity.metadata?.description,
      },
      {
        title: 'Type',
        field: 'spec.type',
        render: row => {
          return prettyText(row.entity.spec?.type?.toString() || '');
        },
      },
    ];
  }

  // alert columns
  if (entityListContext.filters.kind?.value === 'alert') {
    return [
      CatalogTable.columns.createNameColumn(),
      {
        title: 'Source',
        field: 'spec.source',
        render: ({ entity }) => entity.spec?.source,
      },
      {
        title: 'Description',
        field: 'spec.alert',
        highlight: false,
        render: ({ entity }) => entity.spec?.alert,
      },
      {
        title: 'Category',
        field: 'spec.category',
        highlight: false,
        render: ({ entity }) => entity.spec?.category,
      },
      {
        title: 'Entity',
        field: 'spec.entity',
        render: ({ entity }) => {
          return <EntityRefLink entityRef={`${entity.spec?.entity}`} />;
        },
      },
      {
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
      },
    ];
  }

  return CatalogTable.defaultColumnsFunc(entityListContext);
};
