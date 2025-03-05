import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { incrementalIngestionProvidersExtensionPoint } from '@backstage/plugin-catalog-backend-module-incremental-ingestion';
import { AlertsIncrementalEntityProvider } from './alertsIncrementalEntityProvider';

export const catalogModuleAlertsIncrementalEntityProvider = createBackendModule(
  {
    pluginId: 'catalog',
    moduleId: 'alerts-incremental-entity-provider',
    register(env) {
      env.registerInit({
        deps: {
          incrementalBuilder: incrementalIngestionProvidersExtensionPoint,
          config: coreServices.rootConfig,
          logger: coreServices.logger,
        },
        async init({ incrementalBuilder, config, logger }) {
          incrementalBuilder.addProvider({
            provider: new AlertsIncrementalEntityProvider({
              config,
              logger,
            }),
            options: {
              burstInterval: { seconds: 3 },
              burstLength: { seconds: 3 },
              restLength: { hours: 2 },
            },
          });
        },
      });
    },
  },
);
