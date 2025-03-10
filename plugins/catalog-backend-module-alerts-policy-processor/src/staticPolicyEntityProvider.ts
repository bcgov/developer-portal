import {
  EntityProviderConnection,
  type EntityProvider,
} from '@backstage/plugin-catalog-node';

interface PolicyMetadata {
  name: string;
}

export class StaticPolicyProvider implements EntityProvider {
  private policies: PolicyMetadata[];

  constructor(policies: PolicyMetadata[]) {
    this.policies = policies;
  }
  getProviderName() {
    return 'StaticPolicyProvider';
  }
  async connect(connection: EntityProviderConnection) {
    connection.applyMutation(
      /* */ {
        type: 'delta',
        added: this.policies.map(({ name }) => ({
          entity: {
            apiVersion: 'bc-gov/alertsv1',
            kind: 'Policy',
            metadata: {
              name,
            },
          },
        })),
        removed: [],
      },
    );
  }
}
