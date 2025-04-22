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
  identityApiRef,
  errorApiRef,
} from '@backstage/core-plugin-api';
import { SnowplowAnalytics } from '@internal/plugin-analytics-module-snowplow';
import { visitsApiRef, VisitsWebStorageApi } from '@backstage/plugin-home';

export const apis: AnyApiFactory[] = [
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
  createApiFactory({
    api: visitsApiRef,
    deps: {
      identityApi: identityApiRef,
      errorApi: errorApiRef,
    },
    factory: ({ identityApi, errorApi }) =>
      VisitsWebStorageApi.create({ identityApi, errorApi }),
  }),
];
