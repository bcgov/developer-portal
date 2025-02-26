import { Entity } from '@backstage/catalog-model';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { CatalogProcessor } from '@backstage/plugin-catalog-node';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';

class AlertEntityProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'AlertEntityProcessor';
  }

  async validateEntityKind(entity: Entity): Promise<boolean> {
    return entity.kind === 'Alert';
  }
}

export const catalogModuleAlertProcessor = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'alert-processor',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ catalog }) {
        catalog.addProcessor(new AlertEntityProcessor());
      },
    });
  },
});

export { catalogModuleAlertProcessor as default };
