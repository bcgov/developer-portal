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

export const entityColumn: TableColumn<CatalogTableRow> = {
  title: 'Entity',
  field: 'spec.alert.url',
  width: '10%',
  render: ({ entity }) => {
    // @ts-ignore 🚨🚨🚨
    const url = gh(entity.spec?.alert?.url);
    return <EntityRefLink entityRef={`component:${url?.name}`} />;
  },
};

export const alertRuleDescriptionColumn: TableColumn<CatalogTableRow> = {
  title: 'Alert',
  field: 'spec.alert.rule.description',
  // @ts-ignore 🚨🚨🚨
  render: ({ entity }) => entity.spec?.alert?.rule?.description,
};

export const alertRuleToolColumn: TableColumn<CatalogTableRow> = {
  title: 'Source',
  field: 'spec.alert.tool.name',
  width: '10%',
  // @ts-ignore 🚨🚨🚨
  render: ({ entity }) => entity.spec?.alert?.tool?.name,
};

export const severityColumn: TableColumn<CatalogTableRow> = {
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

export const securityLevelColumn: TableColumn<CatalogTableRow> = {
  title: 'Remediation',
  field: 'spec.alert.rule.security_severity_level',
  width: '15%',
  render: ({ entity }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const classes = useStyles();

    if (
      Array.isArray(entity.spec?.remediation) &&
      entity.spec?.remediation.length
    ) {
      return entity.spec.remediation.map((remediation, index) => {
        const severity =
          // @ts-ignore 🚨🚨🚨
          remediation.level?.toString().toLowerCase() || '';
        let level = 'optional' as keyof typeof classes;
        if (severity === 'required') {
          level = 'required';
        } else if (severity === 'recommended') {
          level = 'recommended';
        } else if (severity === 'enforced') {
          level = 'strictly-enforced';
        }
        return (
          <>
            {index > 0 && ', '}
            <Typography className={classes[level]} variant="body2">
              {prettyText(severity) || ''}
            </Typography>
          </>
        );
      });
    }
    return <></>;
  },
};

export const policyColumn: TableColumn<CatalogTableRow> = {
  title: 'Policy',
  render: ({ entity }) => {
    if (
      Array.isArray(entity.spec?.remediation) &&
      entity.spec?.remediation.length
    ) {
      return entity.spec.remediation.map((remediation, index) => {
        return (
          <>
            {index > 0 && ', '}
            {/* @ts-ignore 🚨🚨🚨 */}
            <EntityRefLink entityRef={`policy:default/${remediation.policy}`} />
          </>
        );
      });
    }
    return <></>;
  },
};

export const policyCategoryColumn: TableColumn<CatalogTableRow> = {
  title: 'Policy Category',
  field: 'spec.category',
  render: ({ entity }) => {
    if (Array.isArray(entity.spec?.category) && entity.spec?.category.length) {
      return entity.spec.category.map((category, index) => {
        return (
          <>
            {index > 0 && ', '}
            {/* @ts-ignore 🚨🚨🚨 */}
            <Typography>{category.id}</Typography>
          </>
        );
      });
    }
    return <></>;
  },
};

export const componentAlertsColumns: CatalogTableColumnsFunc = () => {
  return [
    alertRuleToolColumn,
    alertRuleDescriptionColumn,
    policyColumn,
    severityColumn,
    securityLevelColumn,
  ];
};

export const systemAlertsColumns: CatalogTableColumnsFunc = () => {
  return [
    entityColumn,
    alertRuleToolColumn,
    policyColumn,
    alertRuleDescriptionColumn,
    severityColumn,
    securityLevelColumn,
  ];
};
