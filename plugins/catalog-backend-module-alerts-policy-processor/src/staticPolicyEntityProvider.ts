import {
  EntityProviderConnection,
  type EntityProvider,
} from '@backstage/plugin-catalog-node';

interface PolicyMetadata {
  name: string;
}

export class StaticPolicyProvider implements EntityProvider {
  private policies: PolicyMetadata[];
  protected connection?: EntityProviderConnection;

  constructor(policies: PolicyMetadata[]) {
    this.policies = policies;
  }

  getProviderName() {
    return 'StaticPolicyProvider';
  }

  async connect(connection: EntityProviderConnection) {
    await connection.applyMutation(
      /* */ {
        type: 'delta',
        added: this.policies.map(({ name }) => ({
          entity: {
            apiVersion: 'bc-gov/policyv1',
            kind: 'Policy',
            metadata: {
              name,
              annotations: {
                'backstage.io/managed-by-location':
                  'url:https://github.com/guidanti',
                'backstage.io/managed-by-origin-location':
                  'url:https://github.com/guidanti',
              },
            },
          },
          locationKey: `policy-${name}`,
        })),
        removed: [],
      },
    );
  }
}
