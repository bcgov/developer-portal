import {
  type CatalogProcessor,
  type CatalogProcessorEmit,
  type CatalogProcessorRelationResult,
} from '@backstage/plugin-catalog-node';
import { type Entity } from '@backstage/catalog-model';
import type { LocationSpec } from '@backstage/plugin-catalog-common';
import type { LoggerService } from '@backstage/backend-plugin-api';

export class EntityRelationsProcessor implements CatalogProcessor {
  constructor(
    private options: {
      logger: LoggerService;
    },
  ) {
    options.logger.info(`${this.getProcessorName()} started`);
  }

  getProcessorName() {
    return 'EntityRelationsProcessor';
  }

  async preProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
    _originLocation: LocationSpec,
  ): Promise<Entity> {
    this.options.logger.debug(
      `${this.getProcessorName()} preProcessing an entity of kind ${
        entity.kind
      } named ${entity.metadata.name}`,
    );

    const relationships =
      (entity.spec?.__entity_relations as CatalogProcessorRelationResult[]) ??
      []; // 🚨

    if (Array.isArray(relationships)) {
      relationships.forEach(emit);
    }

    delete entity.spec?.__entity_relations;

    return entity;
  }
}
