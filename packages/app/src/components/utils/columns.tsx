import {
  CatalogTable,
  CatalogTableColumnsFunc,
} from '@backstage/plugin-catalog';
import {
  entityColumn,
  policyColumn,
  alertRuleToolColumn,
  severityColumn,
  securityLevelColumn,
  policyCategoryColumn,
} from 'backstage-plugin-policy-react';

export const columns: CatalogTableColumnsFunc = entityListContext => {
  if (entityListContext.filters.kind?.value === 'alert') {
    return [
      CatalogTable.columns.createNameColumn(),
      entityColumn,
      policyColumn,
      alertRuleToolColumn,
      severityColumn,
      securityLevelColumn,
      policyCategoryColumn,
    ];
  }

  return CatalogTable.defaultColumnsFunc(entityListContext);
};
