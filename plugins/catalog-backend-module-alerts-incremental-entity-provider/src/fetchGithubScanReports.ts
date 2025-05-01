import { call, type Queue } from 'effection';
import { Octokit } from '@octokit/rest';

export function* fetchGithubScanReports({
  octokit,
  organization,
  results,
  logger,
}: {
  octokit: Octokit;
  organization: string;
  results: Queue<any, void>; // 🚨
  logger: typeof console;
}) {
  // @ts-ignore
  const repositories = yield* call(() =>
    octokit.paginate(octokit.rest.repos.listForOrg, {
      org: organization,
      per_page: 100,
    }),
  );
  for (const repository of repositories as Array<{
    name: string;
    owner: { login: string };
  }>) {
    const {
      name: repo,
      owner: { login: owner },
    } = repository;

    try {
      const alerts = yield* call(() =>
        octokit.paginate(octokit.rest.codeScanning.listAlertsForRepo, {
          owner: owner,
          repo: repo,
        }),
      );

      const activeAlerts = alerts.filter(alert => alert.state === 'open');

      logger.info(
        `🟢 fetched ${activeAlerts.length} active alerts out of ${alerts.length} total for ${repo}`,
      );

      activeAlerts.forEach(alert => {
        results.add(alert);
      });
    } catch (e) {
      const error = e as { response: { data: { message: string } } };
      logger.error('🔴 skipping', repo, error.response.data.message);
    }
  }
}
