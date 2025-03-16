import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  catalogProcessingExtensionPoint,
  catalogServiceRef,
} from '@backstage/plugin-catalog-node/alpha';
import { loadPolicy } from '@open-policy-agent/opa-wasm';
import { promises as fs } from 'fs';
import { join } from 'path';
import { PolicyProcessor } from './PolicyProcessor';
import { EntityRelationsProcessor } from './relationshipsProcessor';

export const catalogModuleAlertsPolicyProcessor = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'alerts-policy-processor',
  register(reg) {
    reg.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        logger: coreServices.logger,
        catalogClient: catalogServiceRef,
      },
      async init({ catalog, logger, catalogClient }) {
        const policiesDir = '../../policies.bundle';

        const policyPath = join(policiesDir, './policy.wasm');
        console.log('policyPath', policyPath);

        const policy = await loadPolicy(await fs.readFile(policyPath));

        catalog.addProcessor(
          new PolicyProcessor({ policy, logger: logger.child({ module: 'PolicyProcessor' }), catalogClient }),
        );
        catalog.addProcessor(new EntityRelationsProcessor({ logger }));
      },
    });
  },
});
