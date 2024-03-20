import React from 'react';
import {Navigate, Route} from 'react-router-dom';
import {ApiExplorerPage} from '@backstage/plugin-api-docs';
import {
	CatalogEntityPage,
	CatalogIndexPage,
	catalogPlugin,
} from '@backstage/plugin-catalog';
import {
	CatalogImportPage,

} from '@backstage/plugin-catalog-import';
import {ScaffolderPage, scaffolderPlugin} from '@backstage/plugin-scaffolder';
import {orgPlugin} from '@backstage/plugin-org';
import {SearchPage} from '@backstage/plugin-search';
import {TechRadarPage} from '@backstage/plugin-tech-radar';
import {
	TechDocsIndexPage,
	techdocsPlugin,
	TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import {TechDocsAddons} from '@backstage/plugin-techdocs-react';
import {ExpandableNavigation, ReportIssue} from '@backstage/plugin-techdocs-module-addons-contrib';
import {UserSettingsPage} from '@backstage/plugin-user-settings';
import {apis} from './apis';
import {entityPage} from './components/catalog/EntityPage';
import {searchPage} from './components/search/SearchPage';
import {Root} from './components/Root';

import {AlertDisplay, OAuthRequestDialog} from '@backstage/core-components';
import {createApp} from '@backstage/app-defaults';
import {AppRouter, FlatRoutes} from '@backstage/core-app-api';
import {CatalogGraphPage} from '@backstage/plugin-catalog-graph';
import {RequirePermission} from '@backstage/plugin-permission-react';
import {catalogEntityCreatePermission} from '@backstage/plugin-catalog-common/alpha';

import {CssBaseline, ThemeProvider} from '@material-ui/core';
import {darkTheme, lightTheme} from '@backstage/theme';
import {devExTheme} from './devex-theme';

import {HomepageCompositionRoot} from '@backstage/plugin-home';
import HomePage from './components/home/HomePage';
import { TocFix } from '@app/plugin-toc-fix2';
import { TechdocExpandableToc } from '@app/plugin-expandable-toc';
import {Mermaid} from "backstage-plugin-techdocs-addon-mermaid";

const app = createApp({
	apis,
	bindRoutes({bind}) {
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
			Provider: ({children}) => (
				<ThemeProvider theme={devExTheme}>
					<CssBaseline>{children}</CssBaseline>
				</ThemeProvider>
			),
		},
		{
			id: 'light',
			title: 'Light Theme',
			variant: 'light',
			Provider: ({children}) => (
				<ThemeProvider theme={lightTheme}>
					<CssBaseline>{children}</CssBaseline>
				</ThemeProvider>
			),
		},
		{
			id: 'dark',
			title: 'Dark Theme',
			variant: 'dark',
			Provider: ({children}) => (
				<ThemeProvider theme={darkTheme}>
					<CssBaseline>{children}</CssBaseline>
				</ThemeProvider>
			),
		},
	],
});

const routes = (
	<FlatRoutes>
		<Route path="/" element={<HomepageCompositionRoot/>}>
			<HomePage/>
		</Route>
		<Route path="/Systems" element={<Navigate to="catalog"/>}/>
		<Route path="/catalog" element={<CatalogIndexPage/>}/>
		<Route
			path="/catalog/:namespace/:kind/:name"
			element={<CatalogEntityPage/>}
		>
			{entityPage}
		</Route>
		<Route path="/docs" element={<TechDocsIndexPage/>}/>
		{/* redirect in case anyone has bookmarked bcdg*/}
		<Route path="/docs/default/component/bcdg" element={<Navigate to='/docs/default/component/bc-developer-guide' />}/>

		<Route
			path="/docs/:namespace/:kind/:name/*"
			element={<TechDocsReaderPage/>}
		>
			<TechDocsAddons>
				<ReportIssue/>
				<TocFix/>
				<ExpandableNavigation />
				<TechdocExpandableToc />
				<Mermaid config={{ theme: 'forest', themeVariables: { lineColor: '#000000' } }} />
			</TechDocsAddons>
		</Route>
		<Route path="/create" element={<ScaffolderPage
				headerOptions={{
					title: "DevHub quick starts", 
					subtitle: "Create or modify bcgov GitHub repositories with easy and fast templates for common tools and technologies"
				}}
			/>}
		/>
		<Route path="/api-docs" element={<ApiExplorerPage/>}/>
		<Route
			path="/tech-radar"
			element={<TechRadarPage width={1500} height={800}/>}
		/>
		<Route
			path="/catalog-import"
			element={
				<RequirePermission permission={catalogEntityCreatePermission}>
					<CatalogImportPage/>
				</RequirePermission>
			}
		/>
		<Route path="/search" element={<SearchPage/>}>
			{searchPage}
		</Route>
		<Route path="/settings" element={<UserSettingsPage/>}/>
		<Route path="/catalog-graph" element={<CatalogGraphPage/>}/>
	</FlatRoutes>
);

export default app.createRoot(
	<>
		<AlertDisplay/>
		<OAuthRequestDialog/>
		<AppRouter>
			<Root>{routes}</Root>
		</AppRouter>
	</>,
);
