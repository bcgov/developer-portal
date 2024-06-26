import { createPlugin } from '@backstage/core-plugin-api';

export const analyticsModuleSnowplow = createPlugin({
  id: 'analytics-provider-snowplow',
});