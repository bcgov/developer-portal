import { type CatalogProcessor } from '@backstage/plugin-catalog-node';
import { Entity } from '@backstage/catalog-model';
import { LoadedPolicy } from '@open-policy-agent/opa-wasm';
import { LoggerService } from '@backstage/backend-plugin-api';
import { z } from 'zod';

const PolicyResultSchema = z.array(
  z.object({
    result: z.record(z.string(), z.any()),
  }),
);

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
    const entrypoints = Object.keys(this.policy.entrypoints);
    if (!this.entrypoints.includes(entity.kind.toLocaleLowerCase())) {
      this.logger.debug(
        `PolicyProcessor received entity of kind ${entity.kind} but no entrypoints found for it`,
      );
      return entity;
    }

    // need to add zod schema to validate the result
    const [{ result }] = PolicyResultSchema.parse(
      this.policy.evaluate({
        entity,
      }),
    );

    return {
      ...entity,
      spec: {
        ...entity.spec,
        ...result,
      },
    };
  }
}
