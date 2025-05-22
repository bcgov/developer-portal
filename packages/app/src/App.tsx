import { Navigate, Route } from 'react-router-dom';
import { ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage-community/plugin-tech-radar';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import {
  /* ExpandableNavigation*/ ReportIssue,
} from '@backstage/plugin-techdocs-module-addons-contrib';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';
import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { darkTheme, lightTheme } from '@backstage/theme';
import { devExTheme } from './devex-theme';

import { HomepageCompositionRoot } from '@backstage/plugin-home';
import HomePage from './components/home/HomePage';
import { TocFix } from '@app/plugin-toc-fix2';
import { TechdocExpandableToc } from '@app/plugin-expandable-toc';
import { Mermaid } from 'backstage-plugin-techdocs-addon-mermaid';
import { Custom404Page } from './components/404/Custom404Page';
import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { ProtectedPage } from './components/auth/ProtectedPage';
import { CustomSignInPage } from './components/auth/CustomSignInPage';
import { protectedRoutes, redirectRoutes } from './components/utils/routes';
import { RequirePermission } from '@backstage/plugin-permission-react';

const github_auth_provider = {
  id: 'github-auth-provider',
  title: 'GitHub',
  message:
    'Sign in using GitHub. You must be a member of the bcgov GitHub organization.',
  apiRef: githubAuthApiRef,
};

const app = createApp({
  apis,
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
      createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
    });

    bind(scaffolderPlugin.externalRoutes, {
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });

    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
  themes: [
    {
      id: 'devex',
      title: 'DevEx Theme',
      variant: 'light',
      Provider: ({ children }) => (
        <ThemeProvider theme={devExTheme}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
    {
      id: 'light',
      title: 'Light Theme',
      variant: 'light',
      Provider: ({ children }) => (
        <ThemeProvider theme={lightTheme}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
    {
      id: 'dark',
      title: 'Dark Theme',
      variant: 'dark',
      Provider: ({ children }) => (
        <ThemeProvider theme={darkTheme}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
  ],
  components: {
    NotFoundErrorPage: () => <Custom404Page />,
    SignInPage: props => (
      <CustomSignInPage provider={github_auth_provider} {...props} />
    ),
  },
});

const routes = (
  <FlatRoutes>
    <Route path="/" element={<HomepageCompositionRoot />}>
      <HomePage />
    </Route>
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ReportIssue />
        <TocFix />
        {/* <ExpandableNavigation /> */}
        <TechdocExpandableToc />
        <Mermaid
          config={{ theme: 'forest', themeVariables: { lineColor: '#000000' } }}
        />
      </TechDocsAddons>
    </Route>

    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />

    {redirectRoutes.map(route => (
      <Route
        key={route.path}
        path={route.path}
        element={<Navigate to={route.to} />}
      />
    ))}

    {protectedRoutes.map(route => (
      <Route
        key={route.path}
        path={route.path}
        element={
          <ProtectedPage provider={github_auth_provider}>
            {route.permission ? (
              <RequirePermission permission={route.permission}>
                {route.element}
              </RequirePermission>
            ) : (
              route.element
            )}
          </ProtectedPage>
        }
      />
    ))}
  </FlatRoutes>
);

export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
