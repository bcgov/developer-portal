/* eslint-disable func-names */
import {
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import {
  EntityIteratorResult,
  IncrementalEntityProvider,
} from '@backstage/plugin-catalog-backend-module-incremental-ingestion';
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { ScmIntegrations } from '@backstage/integration';
import {
  run,
  createQueue,
  spawn,
  Operation,
  Subscription,
  each,
} from 'effection';
import { fetchGithubScanReports } from './fetchGithubScanReports';
import gh from 'parse-github-url';

interface Cursor {
  page: number;
}

interface Context {
  octokit: Octokit;
}

export class AlertsIncrementalEntityProvider
  implements IncrementalEntityProvider<Cursor, Context>
{
  private readonly logger: LoggerService;
  private readonly config: RootConfigService;

  constructor(options: { logger: LoggerService; config: RootConfigService }) {
    this.logger = options.logger;
    this.config = options.config;
  }

  getProviderName() {
    return 'AlertsEntityProvider';
  }

  async around(burst: (context: Context) => Promise<void>): Promise<void> {
    const { github } = ScmIntegrations.fromConfig(this.config);
    const githubIntegration = github.byHost('github.com');

    if (githubIntegration && githubIntegration.config.apps?.length) {
      const { appId, privateKey } = githubIntegration.config.apps[0];
      const octokit: Octokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
          appId,
          privateKey,
          installationId: 55462171, // 🚨
        },
      });
      await burst({ octokit });
    } else {
      throw new Error('GitHub App configuration not found');
    }
  }

  async next(
    context: Context,
    _cursor: Cursor,
  ): Promise<EntityIteratorResult<Cursor>> {
    type CodeScanningAlertsResponse = Awaited<
      ReturnType<typeof octokit.rest.codeScanning.listAlertsForRepo>
    >['data'];
    const alerts = [] as CodeScanningAlertsResponse;
    const { octokit } = context;
    try {
      await run(function* () {
        const results = createQueue<any, void>(); // 🚨

        yield* spawn(function* () {
          yield* fetchGithubScanReports({
            octokit,
            results,
            logger: console,
          });
          results.close();
        });

        function* createResultsSubscription(): Operation<
          Subscription<any, void> // 🚨
        > {
          return results;
        }

        for (const result of yield* each(createResultsSubscription())) {
          if (result) {
            alerts.push(result);
          }
          yield* each.next();
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
      }
    }

    const entities = alerts.map(alert => {
      const url = gh(alert.url);
      if (url) {
        const { name, owner } = url;
        return {
          entity: {
            apiVersion: 'bc-gov/alertsv1',
            kind: 'Alert',
            metadata: {
              // Strings of length at least 1, and at most 63
              // Must consist of sequences of [a-z0-9A-Z] possibly separated by one of [-_.]
              name: `${name}-${alert.number}`,
              // Namespaces must be sequences of [a-zA-Z0-9], possibly separated by -,
              // at most 63 characters in total. Namespace names are case insensitive
              // and will be rendered as lower case in most places.
              namespace: `${owner}`,
              annotations: {
                'backstage.io/managed-by-location':
                  'url:https://github.com/guidanti',
                'backstage.io/managed-by-origin-location':
                  'url:https://github.com/guidanti',
              },
            },
            spec: {
              alert,
              __entity_relations: [
                {
                  type: 'relation',
                  relation: {
                    // from component to alert
                    type: 'hasAlerts',
                    source: {
                      kind: 'component',
                      namespace: 'default',
                      name,
                    },
                    target: {
                      kind: 'alert',
                      namespace: `${owner}`,
                      name: `${name}-${alert.number}`,
                    },
                  },
                },
                {
                  type: 'relation',
                  relation: {
                    // from alert to component
                    type: 'forComponent',
                    target: {
                      kind: 'component',
                      namespace: 'default',
                      name,
                    },
                    source: {
                      kind: 'alert',
                      namespace: `${owner}`,
                      name: `${name}-${alert.number}`,
                    },
                  },
                },
              ],
            },
          },
          locationKey: `alert-${alert.number}`,
        };
      }
      throw new Error(
        `Skipping because there was an issue parsing the following GitHub URL: ${alert.url}`,
      );
    });

    return {
      done: true,
      entities,
      cursor: {
        page: 1,
      },
    };
  }
}
