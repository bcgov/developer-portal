import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { CatalogImportPage } from '@backstage/plugin-catalog-import';
import React from 'react';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { ScaffolderPage } from '@backstage/plugin-scaffolder';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { CatalogEntityPage, CatalogIndexPage } from '@backstage/plugin-catalog';
import { entityPage } from './components/catalog/EntityPage';

export const protectedRoutes = [
  {
    path: '/create',
    element: (
      <ScaffolderPage
        headerOptions={{
          title: '🧙‍♂️ DevHub wizards',
          subtitle:
            'Create or modify bcgov GitHub repositories with easy and fast templates for common tools and technologies',
        }}
      />
    ),
  },
  {
    path: '/catalog',
    element: <CatalogIndexPage />,
  },
  // {
  //   path: '/catalog/:namespace/:kind/:name',
  //   element: <CatalogEntityPage />,
  //   page: entityPage
  // },
  {
    path: '/catalog-graph',
    element: <CatalogGraphPage />,
  },
  {
    path: '/catalog-import',
    element: (
      <RequirePermission permission={catalogEntityCreatePermission}>
        <CatalogImportPage />
      </RequirePermission>
    ),
  },
  {
    path: '/settings',
    element: <UserSettingsPage />,
  },
];

export const redirectRoutes = [
  {
    path: '/Design-System/About-the-Design-System',
    to: '/docs/default/component/bc-developer-guide/design-system/about-the-design-system/',
  },
  {
    path: '/Data-and-APIs/API-Guidelines',
    to: '/docs/default/component/bc-developer-guide/bc-government-api-guidelines/',
  },
  {
    path: '/API-Guidelines',
    to: '/docs/default/component/bc-developer-guide/bc-government-api-guidelines/',
  },
];
