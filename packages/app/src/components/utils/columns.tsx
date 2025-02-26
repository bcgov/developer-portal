import React from 'react';
import {
  CatalogTable,
  CatalogTableColumnsFunc,
} from '@backstage/plugin-catalog';
import { startCase, camelCase } from 'lodash-es';
import { Theme, Typography, makeStyles } from '@material-ui/core';

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

  return CatalogTable.defaultColumnsFunc(entityListContext);
};
