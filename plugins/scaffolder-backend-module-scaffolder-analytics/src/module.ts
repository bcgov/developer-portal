import {
  createBackendModule,
  coreServices,
} from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createAnalyticsAction } from './actions/analytics';

/**
 * A backend module that registers the action into the scaffolder
 */
export const scaffolderModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'analytics-action',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolderActions: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ scaffolderActions, config }) {
        scaffolderActions.addActions(createAnalyticsAction({ config }));
      },
    });
  },
});
