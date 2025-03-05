import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { CatalogImportPage } from '@backstage/plugin-catalog-import';
import React from 'react';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { ScaffolderPage } from '@backstage/plugin-scaffolder';

export const protectedRoutes = [
  {
    path: '/catalog-import',
    element: <CatalogImportPage />,
    permission: catalogEntityCreatePermission,
  },
  {
    path: '/create',
    element: (
      <ScaffolderPage
        headerOptions={{
          title: '🧙‍♂️ DevHub wizards',
          subtitle:
            'Create or modify bcgov GitHub repositories with easy and fast templates for common tools and technologies',
        }}
        groups={[
          {
            title: 'Quickstarts',
            filter: entity =>
              entity?.metadata?.tags?.includes('quickstarts') ?? false,
          },
          {
            title: 'TechDocs',
            filter: entity =>
              entity?.metadata?.tags?.includes('techdocs') ?? false,
          },
        ]}
      />
    ),
  },
  {
    path: '/settings',
    element: <UserSettingsPage />,
  },
];

export const redirectRoutes = [
  /* redirect several popular "classic" devhub urls */
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
  {
    /* redirect in case anyone has bookmarked bcdg*/
    path: '/docs/default/component/bcdg',
    to: '/docs/default/component/bc-developer-guide',
  },
];
