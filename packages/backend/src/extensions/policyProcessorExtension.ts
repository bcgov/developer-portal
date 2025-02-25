import { Entity } from '@backstage/catalog-model';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { CatalogProcessor } from '@backstage/plugin-catalog-node';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';

class PolicyEntityProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'PolicyEntityProcessor';
  }

  async validateEntityKind(entity: Entity): Promise<boolean> {
    return entity.kind === 'Policy';
  }
}

export const catalogModulePolicyProcessor = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'example-custom-processor',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ catalog }) {
        catalog.addProcessor(new PolicyEntityProcessor());
      },
    });
  },
});

export { catalogModulePolicyProcessor as default };
