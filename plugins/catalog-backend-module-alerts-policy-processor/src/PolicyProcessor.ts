import { type CatalogProcessor } from '@backstage/plugin-catalog-node';
import { Entity } from '@backstage/catalog-model';
import { LoadedPolicy } from '@open-policy-agent/opa-wasm';
import { LoggerService } from '@backstage/backend-plugin-api';
import { PolicyEvaluationResultSchema } from './schemas/PolicyEvaluationResult';
import { JsonValue } from '@backstage/types';

export class PolicyProcessor implements CatalogProcessor {
  private policy: LoadedPolicy;
  private logger: LoggerService;
  private entrypoints: string[];
  getProcessorName(): string {
    return `PolicyProcessor`;
  }

  constructor({
    policy,
    logger,
  }: {
    policy: LoadedPolicy;
    logger: LoggerService;
  }) {
    this.policy = policy;
    this.logger = logger;
    this.entrypoints = Object.keys(this.policy.entrypoints);

    this.logger.debug(
      `PolicyProcessor received policy with ${this.entrypoints.join(
        ',',
      )} entrypoints`,
    );
  }

  async preProcessEntity(entity: Entity): Promise<Entity> {
    const entrypoint = entity.kind.toLocaleLowerCase();
    if (!this.entrypoints.includes(entrypoint)) {
      return entity;
    }

    const policyEvaluationResult = this.policy.evaluate({
      entity,
    }, entrypoint);

    // need to add zod schema to validate the result
    const [{ result }] = PolicyEvaluationResultSchema.parse(
      policyEvaluationResult,
    );

    return {
      ...entity,
      spec: {
        ...entity.spec,
        ...result,
      } as JsonValue,
    };
  }
}
