import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { Config } from '@backstage/config';
import { newTracker, buildSelfDescribingEvent } from '@snowplow/node-tracker';

/**
 * Creates an `bcgov:analytics` Scaffolder action.
 *
 * @remarks
 * @public
 */
export function createAnalyticsAction(options: { config: Config }) {
  const { config } = options;

  // For more information on how to define custom actions, see
  //   https://backstage.io/docs/features/software-templates/writing-custom-actions
  return createTemplateAction<{
    name: string;
    ministry: string;
    options?: string[];
    platform?: string;
    timeSaved: number;
  }>({
    id: 'bcgov:analytics',
    description:
      'Uses Snowplow + app-config to create a SelfDescribingEvent with user input.',
    schema: {
      input: {
        type: 'object',
        required: ['name', 'ministry', 'timeSaved'],
        properties: {
          name: {
            title: 'The template/wizard name',
            description:
              'This is the name of the template/wizard that was run.',
            type: 'string',
          },
          ministry: {
            title: 'The selected ministry',
            description: 'This is the ministry name selected by the user',
            type: 'string',
          },
          options: {
            title: 'The selected configuration options',
            description: 'These are configuration options selected by the user',
            type: 'array(string)',
          },
          platform: {
            title: 'The selected platform',
            description: 'This is the platform selected by the user',
            type: 'string',
          },
          timeSaved: {
            title: 'The time savings in minutes',
            description:
              'This is the time savings in minutes. Akin to the backstage.io/time-saved value',
            type: 'number',
          },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info('Running snowplow analytics action');

      if (config.getBoolean('app.analytics.snowplow.enabled')) {
        const trackerId =
          config.getOptionalString('app.analytics.snowplow.trackerId') || 'rt1';
        const endpoint =
          config.getString('app.analytics.snowplow.collectorUrl') ?? '';
        const appId =
          config.getOptionalString('app.analytics.snowplow.appId') ||
          'Snowplow_standalone_OCIO';

        const tracker = newTracker(
          {
            namespace: trackerId,
            appId: appId,
            encodeBase64: false,
          },
          {
            endpoint: endpoint,
            eventMethod: 'post',
            bufferSize: 1,
          },
        );

        tracker.track(
          buildSelfDescribingEvent({
            event: {
              schema: 'iglu:ca.bc.gov.devx/action/jsonschema/1-0-0',
              data: {
                action: 'wizard-complete',
                text: ctx.input.name,
                ministry: ctx.input.ministry,
                options: ctx.input.options,
                platform: ctx.input.platform,
                time_saved: ctx.input.timeSaved,
              },
            },
          }),
        );
      }
    },
  });
}
