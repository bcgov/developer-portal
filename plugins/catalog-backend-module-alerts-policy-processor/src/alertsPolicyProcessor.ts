import { type CatalogProcessor } from '@backstage/plugin-catalog-node';
import { Entity } from '@backstage/catalog-model';
import { JsonValue } from '@backstage/types';
import { LoadedPolicy } from '@open-policy-agent/opa-wasm';

interface PolicyResultMessage {
  text: string;
}

interface PolicyResult {
  ruleId: string;
  level: 'recommended' | 'optional';
  message: PolicyResultMessage;
}

export class AlertPolicyProcessor implements CatalogProcessor {
  constructor(policy: LoadedPolicy) {
    this.policy = policy;
  }

  getProcessorName(): string {
    return `AlertPolicyProcessor`;
  }

  private policy: LoadedPolicy;

  async preProcessEntity(entity: Entity): Promise<Entity> {
    if (entity.kind !== 'Alert') return entity;

    // parse with zod
    const policyResults: PolicyResult[] =
      (entity?.spec?.policyResults as unknown as PolicyResult[]) ?? [];

    const [
      {
        result: { result: text },
      },
    ] = this.policy.evaluate({
      entity,
    });

    // parse value with zod

    return {
      ...entity,
      spec: {
        ...entity.spec,
        policyResults: [
          ...policyResults,
          {
            // todo: needs to be changed
            ruleId: 'policy:AlertPolicyProcessor',
            level: 'optional',
            message: {
              text: text,
            },
          },
        ] as unknown as JsonValue,
      },
    };
  }
}
