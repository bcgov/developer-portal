import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('@backstage/plugin-catalog-backend-module-github-org'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
backend.add(import('@backstage/plugin-events-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(
  import('@roadiehq/scaffolder-backend-module-http-request/new-backend'),
);
backend.add(import('@roadiehq/scaffolder-backend-module-utils'));
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-pg'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));
backend.add(
  import('@backstage/plugin-search-backend-module-stack-overflow-collator'),
);
backend.add(import('@backstage/plugin-techdocs-backend'));

backend.add(import('@backstage/plugin-permission-backend'));
backend.add(import('./extensions/permissionsPolicyExtension'));

backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@app/scaffolder-backend-module-snowplow'));
backend.start();
