import type { ViteSentryPluginOptions } from 'vite-plugin-sentry';
import viteSentry from 'vite-plugin-sentry';
import packageJson from '../../app/package.json';

/*
	Configure sentry plugin
*/
export default function createSentry(env: any) {
  const { VITE_APP_STORE_PREFIX } = env;
  const sentryConfig: ViteSentryPluginOptions = {
    debug: false,
    silent: true, //禁止cli日志
    url: 'https://sentry.io',
    authToken: '35ccc80b03fc4a5884f1500e526280652b7c25f2f5554c8c88dc2d724f5edce4',
    org: 'an-oc',
    project: 'nanaservicevue',
    release: `${packageJson.version}`,
    cleanSourcemapsAfterUpload: true,
    deploy: {
      env: VITE_APP_STORE_PREFIX
    },
    setCommits: {
      auto: false
    },
    sourceMaps: {
      urlPrefix: '',
      include: ['./app/dist/render/assets'],
      ignore: ['node_modules']
    }
  };
  return viteSentry(sentryConfig);
}
