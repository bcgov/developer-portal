import {CatalogBuilder} from '@backstage/plugin-catalog-backend';
import {ScaffolderEntitiesProcessor} from '@backstage/plugin-scaffolder-backend';
import {Router} from 'express';
import {PluginEnvironment} from '../types';
import {GithubEntityProvider} from '@backstage/plugin-catalog-backend-module-github';
import { GithubOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-github';



export default async function createPlugin(
	env: PluginEnvironment,
): Promise<Router> {
	const builder = await CatalogBuilder.create(env);
	builder.setProcessingIntervalSeconds(500);
	builder.addProcessor(new ScaffolderEntitiesProcessor());
	builder.addEntityProvider(
		GithubEntityProvider.fromConfig(env.config, {
			logger: env.logger,
			// // optional: alternatively, use scheduler with schedule defined in app-config.yaml
			// schedule: env.scheduler.createScheduledTaskRunner({
			// 	frequency: { minutes: 30 },
			// 	timeout: { minutes: 3 },
			// }),
			// // optional: alternatively, use schedule
			scheduler: env.scheduler,
		}),
	);

	// The org URL below needs to match a configured integrations.github entry
	// specified in your app-config.
	builder.addEntityProvider(
		GithubOrgEntityProvider.fromConfig(env.config, {
			id: 'production',
			orgUrl: 'https://github.com/bcgov',
			logger: env.logger,
			schedule: env.scheduler.createScheduledTaskRunner({
				frequency: { minutes: 60 },
				timeout: { minutes: 15 },
			}),
		}),
	);

	const {processingEngine, router} = await builder.build();
	await processingEngine.start();
	return router;
}
