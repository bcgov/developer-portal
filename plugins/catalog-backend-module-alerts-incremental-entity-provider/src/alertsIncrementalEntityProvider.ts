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
    cursor: Cursor,
  ): Promise<EntityIteratorResult<Cursor>> {
    const alerts = [];
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

    return {} as EntityIteratorResult<Cursor>; // 🚨
  }
}
