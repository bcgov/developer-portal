import { createBackendModule } from '@backstage/backend-plugin-api';
import { loadPolicy } from '@open-policy-agent/opa-wasm';
import { AlertPolicyProcessor } from './alertsPolicyProcessor';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { promises as fs } from 'fs';
import { StaticPolicyProvider } from './staticPolicyEntityProvider';

export const catalogModuleAlertsPolicyProcessor = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'alerts-policy-processor',
  register(reg) {
    reg.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ catalog }) {
        // get list of policies from directory
        // for each policy, register a new processor

        const policyEntityProvider = new StaticPolicyProvider();
        catalog.addEntityProvider(policyEntityProvider);

        const policy = await loadPolicy(await fs.readFile('../../policy.wasm'));
        catalog.addProcessor(new AlertPolicyProcessor(policy));

        // add processor that connects relationships
      },
    });
  },
});
