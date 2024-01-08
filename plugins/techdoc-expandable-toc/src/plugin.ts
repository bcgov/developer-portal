import { createPlugin } from '@backstage/core-plugin-api';
import {
  createTechDocsAddonExtension,
  TechDocsAddonLocations,
} from '@backstage/plugin-techdocs-react';
import { ExpandableTocAddon } from './addons/ExpandableToc'

export const techdocExpandableTocPlugin = createPlugin({
  id: 'techdoc-expandable-toc',
});

export const TechdocExpandableToc = techdocExpandableTocPlugin.provide(
  createTechDocsAddonExtension({
    name: 'ExpandableToc',
    location: TechDocsAddonLocations.SecondarySidebar,
    component: ExpandableTocAddon,
}),
);
