import { createPlugin } from '@backstage/core-plugin-api';
import {
  createTechDocsAddonExtension,
  TechDocsAddonLocations,
} from '@backstage/plugin-techdocs-react';
import { AccessibilityStylesAddon } from './addons/AccessibilityStyles';

export const techdocsAccessibilityStylesPlugin = createPlugin({
  id: 'techdocs-accessibility-styles',
});
export const TechdocsAccessibilityStyles =
  techdocsAccessibilityStylesPlugin.provide(
    createTechDocsAddonExtension({
      name: 'AccessibilityStyles',
      location: TechDocsAddonLocations.Content,
      component: AccessibilityStylesAddon,
    }),
  );
