import { createPlugin } from '@backstage/core-plugin-api';

import {
	createTechDocsAddonExtension,
	TechDocsAddonLocations,
} from '@backstage/plugin-techdocs-react';
import { TocFixer } from './addons/TocFixer';

export const tocFix2Plugin = createPlugin({
  id: 'toc-fix2',
});

// You must "provide" your Addon, just like any extension, via your plugin.
export const TocFix = tocFix2Plugin.provide(
	// This function "creates" the Addon given a component and location. If your
	// component can be configured via props, pass the prop type here too.
	createTechDocsAddonExtension({
		name: 'TocFix',
		location: TechDocsAddonLocations.Content,
		component: TocFixer,
	}),
);
