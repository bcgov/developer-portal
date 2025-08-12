import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  PolicyDecision,
  AuthorizeResult,
  isPermission,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';
import { catalogEntityDeletePermission } from '@backstage/plugin-catalog-common/alpha';
import {
  catalogConditions,
  createCatalogConditionalDecision,
} from '@backstage/plugin-catalog-backend/alpha';
import { githubDiscussionsReadPermission } from '@backstage-community/plugin-github-discussions-common';

class CatalogPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    if (isPermission(request.permission, catalogEntityDeletePermission)) {
      return createCatalogConditionalDecision(
        request.permission,
        catalogConditions.isEntityOwner({
          claims: user?.info.ownershipEntityRefs ?? [],
        }),
      );
    }

    // Handle search discussions permissions
    if (isPermission(request.permission, githubDiscussionsReadPermission)) {
      if (user?.info?.userEntityRef !== 'user:default/guest') {
        return { result: AuthorizeResult.ALLOW };
      } else {
        return { result: AuthorizeResult.DENY };
      }
    }

    return {
      result: AuthorizeResult.ALLOW,
    };
  }
}

const catalogPermissionBackendModule = createBackendModule({
  pluginId: 'permission',
  moduleId: 'catalog-policy',
  register(reg) {
    reg.registerInit({
      deps: { policy: policyExtensionPoint },
      async init({ policy }) {
        policy.setPolicy(new CatalogPermissionPolicy());
      },
    });
  },
});

export default catalogPermissionBackendModule;
