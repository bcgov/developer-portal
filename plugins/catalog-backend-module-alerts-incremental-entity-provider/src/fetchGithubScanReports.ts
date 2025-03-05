import { call, type Queue } from 'effection';
import { Octokit } from '@octokit/rest';

export function* fetchGithubScanReports({
  octokit,
  results,
  logger,
}: {
  octokit: Octokit;
  results: Queue<any, void>; // 🚨
  logger: typeof console;
}) {
  const {
    data: { repositories },
  } = yield* call(() => octokit.rest.apps.listReposAccessibleToInstallation());
  for (const repository of repositories) {
    const {
      default_branch,
      name: repo,
      owner: { login: owner },
    } = repository;

    try {
      const { data: alerts } = yield* call(() =>
        octokit.rest.codeScanning.listAlertsForRepo({
          owner,
          repo,
          ref: default_branch,
        }),
      );

      logger.info(`🟢🟢🟢 fetched ${alerts.length} alerts for ${repo}`);

      alerts
        .filter(alert => alert.state === 'open')
        .forEach(alert => {
          results.add(alert);
        });
    } catch (e) {
      const error = e as { response: { data: { message: string } } };
      logger.error('🔴🔴🔴 skipping', repo, error.response.data.message);
    }
  }
}
