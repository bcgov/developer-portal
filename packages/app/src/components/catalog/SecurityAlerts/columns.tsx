import React from 'react';
import {
  CatalogTableColumnsFunc,
  CatalogTableRow,
} from '@backstage/plugin-catalog';
import { Theme, Typography, makeStyles } from '@material-ui/core';
import { TableColumn } from '@backstage/core-components';
import { startCase, camelCase } from 'lodash-es';
import { EntityRefLink } from '@backstage/plugin-catalog-react';
import gh from 'parse-github-url';

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
  field: 'spec.alert.url',
  width: '15%',
  render: ({ entity }) => {
    // @ts-ignore 🚨🚨🚨
    const url = gh(entity.spec?.alert?.url);
    return <EntityRefLink entityRef={`component:${url?.name}`} />;
  },
};

const alertRuleDescriptionColumn: TableColumn<CatalogTableRow> = {
  title: 'Alert',
  field: 'spec.alert.rule.description',
  // @ts-ignore 🚨🚨🚨
  render: ({ entity }) => entity.spec?.alert?.rule?.description,
};

const alertRuleToolColumn: TableColumn<CatalogTableRow> = {
  title: 'Source',
  field: 'spec.alert.tool.name',
  // @ts-ignore 🚨🚨🚨
  render: ({ entity }) => entity.spec?.alert?.tool?.name,
};

const severityColumn: TableColumn<CatalogTableRow> = {
  title: 'Severity',
  field: 'spec.alert.rule.severity',
  width: '10%',
  render: row => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const classes = useStyles();
    // @ts-ignore 🚨🚨🚨
    const severity = row.entity.spec?.alert?.rule?.severity
      ?.toString()
      .toLowerCase();
    let level = 'optional' as keyof typeof classes;
    if (severity === 'warning') {
      level = 'required';
    } else if (severity === 'note') {
      level = 'recommended';
    } else if (severity === 'error') {
      level = 'strictly-enforced';
    }
    return (
      <Typography className={classes[level]} variant="body2">
        {prettyText(`${severity}`)}
      </Typography>
    );
  },
};

const securityLevelColumn: TableColumn<CatalogTableRow> = {
  title: 'Remediation',
  field: 'spec.alert.rule.security_severity_level',
  width: '15%',
  render: row => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const classes = useStyles();
    const severity =
      // @ts-ignore 🚨🚨🚨
      row.entity.spec?.alert?.rule?.security_severity_level
        ?.toString()
        .toLowerCase() || '';
    let level = 'optional' as keyof typeof classes;
    if (severity === 'high') {
      level = 'required';
    } else if (severity === 'medium') {
      level = 'recommended';
    } else if (severity === 'critical') {
      level = 'strictly-enforced';
    }
    return (
      <Typography className={classes[level]} variant="body2">
        {prettyText(severity) || ''}
      </Typography>
    );
  },
};

const policyColumn: TableColumn<CatalogTableRow> = {
  title: 'Policy',
  render: () => <EntityRefLink entityRef="policy:default/example.wasm" />,
};

const policyCategoryColumn: TableColumn<CatalogTableRow> = {
  title: 'Policy Category',
  field: 'spec.category',
  render: () => <Typography>TBD</Typography>,
};

export const componentAlertsColumns: CatalogTableColumnsFunc = () => {
  return [
    alertRuleToolColumn,
    alertRuleDescriptionColumn,
    severityColumn,
    securityLevelColumn,
    policyColumn, // 🚨 ref to policy
    policyCategoryColumn, // 🚨 TBD get from policy
  ];
};

export const systemAlertsColumns: CatalogTableColumnsFunc = () => {
  return [
    entityColumn,
    alertRuleToolColumn,
    alertRuleDescriptionColumn,
    severityColumn,
    securityLevelColumn,
    policyColumn, // 🚨 ref to policy
    policyCategoryColumn, // 🚨 TBD get from policy
  ];
};
