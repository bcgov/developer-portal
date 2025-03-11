import { createBackendModule } from '@backstage/backend-plugin-api';
import { loadPolicy } from '@open-policy-agent/opa-wasm';
import { AlertPolicyProcessor } from './alertsPolicyProcessor';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { promises as fs } from 'fs';
import { StaticPolicyProvider } from './staticPolicyEntityProvider';
import path from 'path';

export const catalogModuleAlertsPolicyProcessor = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'alerts-policy-processor',
  register(reg) {
    reg.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ catalog }) {
        const policiesDir = '../../policies';
        await fs.access(policiesDir);
        const policiesPath = await fs.readdir(policiesDir);
        const policies = [];

        for (const policyFile of policiesPath) {
          const policyPath = path.join(policiesDir, policyFile);
          const policy = await loadPolicy(await fs.readFile(policyPath));
          catalog.addProcessor(new AlertPolicyProcessor(policy));
          policies.push({ name: policyFile });
        }

        const policyEntityProvider = new StaticPolicyProvider(policies);
        catalog.addEntityProvider(policyEntityProvider);

        // add processor that connects relationships
      },
    });
  },
});
