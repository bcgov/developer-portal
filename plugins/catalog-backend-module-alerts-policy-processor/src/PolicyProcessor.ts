import { LoggerService } from '@backstage/backend-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { type CatalogProcessor } from '@backstage/plugin-catalog-node';
import { JsonValue } from '@backstage/types';
import { LoadedPolicy } from '@open-policy-agent/opa-wasm';
import { CatalogApi } from '@backstage/catalog-client';

import { PolicyEvaluationQueryResultSchema } from './schemas/PolicyEvaluationQuery';
import { PolicyEvaluationResultSchema } from './schemas/PolicyEvaluationResult';

export class PolicyProcessor implements CatalogProcessor {
  private policy: LoadedPolicy;
  private logger: LoggerService;
  private entrypoints: string[];
  private catalogClient: CatalogApi;

  getProcessorName(): string {
    return `PolicyProcessor`;
  }

  constructor({
    policy,
    logger,
    catalogClient,
  }: {
    policy: LoadedPolicy;
    logger: LoggerService;
    catalogClient: CatalogApi;
  }) {
    this.policy = policy;
    this.logger = logger;
    this.catalogClient = catalogClient;
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

    const input: Record<string, Entity | Entity[]> = {
      entity,
    };

    if (this.entrypoints.includes(`${entrypoint}/query`)) {
      const policyEvaluationQueryResult = this.policy.evaluate(
        { entity },
        `${entrypoint}/query`,
      );
      const [{ result }] = PolicyEvaluationQueryResultSchema.parse(
        policyEvaluationQueryResult,
      );

      this.logger.debug(`Evaluated[${entrypoint}/query]`, {
        entityRef: `${entity.kind}:${entity.metadata.namespace}/${entity.metadata.name}`,
        entrypoint,
        query: result,
      });

      await Promise.all(
        Object.entries(result).map(async ([key, filter]) => {
          if (filter === null) {
            input[key] = [];
          } else {
            const { items } = await this.catalogClient.queryEntities({
              filter,
            });
            input[key] = items;
          }
        }),
      );
    }

    const policyEvaluationResult = this.policy.evaluate(input, entrypoint);

    // need to add zod schema to validate the result
    const [{ result }] = PolicyEvaluationResultSchema.parse(
      policyEvaluationResult,
    );

    this.logger.debug(`Evaluated[${entrypoint}]`, {
      entityRef: `${entity.kind}:${entity.metadata.namespace}/${entity.metadata.name}`,
      entrypoint,
      result,
    });

    return {
      ...entity,
      spec: {
        ...entity.spec,
        ...result,
      } as JsonValue,
    };
  }
}
