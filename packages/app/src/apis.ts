import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
  analyticsApiRef,
} from '@backstage/core-plugin-api';
import { SnowplowAnalytics } from '@internal/plugin-analytics-module-snowplow';
import {
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import { PolicyIcon } from './components/utils/icons';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: entityPresentationApiRef,
    deps: {
      catalgoApi: catalogApiRef,
    },
    factory({ catalgoApi }) {
      return DefaultEntityPresentationApi.create({
        catalogApi: catalgoApi,
        kindIcons: {
          Policy: PolicyIcon,
        },
      });
    },
  }),
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  ScmAuth.createDefaultApiFactory(),
  createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => SnowplowAnalytics.fromConfig(configApi),
  }),
];
