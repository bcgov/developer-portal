import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
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
  private auth: AuthService;

  getProcessorName(): string {
    return `PolicyProcessor`;
  }

  constructor({
    policy,
    logger,
    catalogClient,
    auth,
  }: {
    policy: LoadedPolicy;
    logger: LoggerService;
    catalogClient: CatalogApi;
    auth: AuthService;
  }) {
    this.policy = policy;
    this.logger = logger;
    this.catalogClient = catalogClient;
    this.entrypoints = Object.keys(this.policy.entrypoints);
    this.auth = auth;

    this.logger.debug(
      `PolicyProcessor received policy with ${this.entrypoints.join(
        ',',
      )} entrypoints`,
    );
  }

  async preProcessEntity(entity: Entity): Promise<Entity> {
    const kind = entity.kind.toLocaleLowerCase();
    if (!this.entrypoints.includes(kind)) {
      return entity;
    }
    const entityRef = `${entity.kind}:${
      entity.metadata.namespace ?? 'default'
    }/${entity.metadata.name}`.toLocaleLowerCase();

    const input: Record<string, Entity | Entity[]> = {
      entity,
    };

    // checks if query entrypoint exists for this kind
    // it'll look like `component/query`
    if (this.entrypoints.includes(`${kind}/query`)) {
      // evaluate the query entry point with the entity as input
      const policyEvaluationQueryResult = this.policy.evaluate(
        input,
        `${kind}/query`,
      );
      try {
        // Attempt to parse the policy evaluation query result
        // Uses zod schema to pass the result which gives us a
        // strictly types result.
        const [{ result } = { result: {} }] =
          PolicyEvaluationQueryResultSchema.parse(policyEvaluationQueryResult);

        this.logger.debug(`Evaluated[${kind}/query]`, {
          entityRef,
          entrypoint: kind,
          preparse: JSON.stringify(policyEvaluationQueryResult),
          query: JSON.stringify(result),
        });

        // generate a token for calling the catalog backend
        const { token } = await this.auth.getPluginRequestToken({
          onBehalfOf: await this.auth.getOwnServiceCredentials(),
          targetPluginId: 'catalog',
        });

        // user the result of query entrypoint to filter the catalog
        await Promise.all(
          Object.entries(result).map(async ([key, filter]) => {
            if (filter === null) {
              input[key] = [];
            } else {
              const { items } = await this.catalogClient.queryEntities(
                {
                  filter,
                },
                { token },
              );
              input[key] = items;
            }
          }),
        );
      } catch (error) {
        this.logger.error(`Failed to process query for entity`, {
          entityRef,
          entrypoint: `${kind}/query`,
          error: error instanceof Error ? error.message : String(error),
        });
        return entity;
      }
    }

    const policyEvaluationResult = this.policy.evaluate(input, kind);

    // need to add zod schema to validate the result
    const [{ result } = { result: {} }] = PolicyEvaluationResultSchema.parse(
      policyEvaluationResult,
    );

    this.logger.debug(`Evaluated[${kind}]`, {
      entityRef,
      entrypoint: kind,
      result: JSON.stringify(result),
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
