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
      name: repo,
      owner: { login: owner },
    } = repository;

    try {
      const { data: alerts } = yield* call(() =>
        octokit.rest.codeScanning.listAlertsForRepo({
          owner,
          repo,
          // ref: default_branch,
          ref: 'mk/reports',
        }),
      );

      const activeAlerts = alerts.filter(alert => alert.state === 'open');

      logger.info(
        `🟢🟢🟢 fetched ${activeAlerts.length} active alerts out of ${alerts.length} total for ${repo}`,
      );

      activeAlerts.forEach(alert => {
        results.add(alert);
      });
    } catch (e) {
      const error = e as { response: { data: { message: string } } };
      logger.error('🔴🔴🔴 skipping', repo, error.response.data.message);
    }
  }
}
