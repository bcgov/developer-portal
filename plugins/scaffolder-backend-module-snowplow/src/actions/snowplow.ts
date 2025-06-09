import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { Config } from '@backstage/config';
import { newTracker, buildSelfDescribingEvent } from '@snowplow/node-tracker';

/**
 * Creates `bcgov:snowplow:create` Scaffolder action that sends analytics data to Snowplow.
 *
 * @remarks
 * This action tracks template usage metrics by sending self-describing events to a
 * configured Snowplow collector. It captures information such as the template name,
 * ministry, selected options, platform, and estimated time saved.
 *
 * The action requires Snowplow configuration in your app-config.yaml:
 * ```yaml
 * app:
 *   analytics:
 *     snowplow:
 *       enabled: true
 *       collectorUrl: 'https://your-snowplow-collector.example.com'
 *       trackerId: 'rt1' # optional, defaults to 'rt1'
 *       appId: 'YourAppId' # optional, defaults to 'Snowplow_standalone_OCIO'
 * ```
 *
 * @param options - The options object
 * @param options.config - The application configuration
 * @returns A Backstage scaffolder action
 * @public
 */
export function createSnowplowAction(options: { config: Config }) {
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
    id: 'bcgov:snowplow:create',
    description:
      'Creates a Snowplow tracker from app-config fields to track a SelfDescribingEvent with user selections & input.',
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
            description: 'This is the ministry acronym selected by the user',
            type: 'string',
          },
          options: {
            title: 'The selected configuration options',
            description: 'These are configuration options selected by the user',
            type: 'array',
            items: { type: 'string' },
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
        if (!endpoint) {
          ctx.logger.warn(
            'Snowplow tracking enabled but no collector URL provided, skipping analytics',
          );
          return;
        }

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

        /*
          This is a self-describing event that will be sent to the Snowplow collector.
          The schema is defined in the Iglu schema registry with the following properties:

          action: currently this is just “wizard-complete”, but we can do other actions
          text: the label for the wizard
          ministry: the 3-4 letter code for a ministry or agency
          time_saved: a number in minutes (max 999999)
          platform: a string (max 63 char)
          options: an array of strings (max 63 char, each)
        */
        try {
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
        } catch (error) {
          ctx.logger.error(
            `Failed to send Snowplow analytics: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }
      }
    },
  });
}
