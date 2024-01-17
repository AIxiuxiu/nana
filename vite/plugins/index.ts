import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import type { PluginOption } from 'vite';
import createComponents from './components';
import createCompression from './compression';
import { viteProgress } from './progress';
import createRestart from './restart';
import createSentry from './sentry';
import createSvgIcon from './svg-icon';

export default function createVitePlugins(viteEnv: any, isBuild = false) {
  const vitePlugins: PluginOption[] = [vue()];
  !isBuild && vitePlugins.push(createRestart());
  vitePlugins.push(createComponents());
  vitePlugins.push(createSvgIcon());
  // 构建时显示进度条
  isBuild && vitePlugins.push(viteProgress());
  isBuild && process.env.SENTRY_UPLOAD && vitePlugins.push(createSentry(viteEnv));
  isBuild && vitePlugins.push(...createCompression(viteEnv));
  isBuild && process.env.VISUALIZER && vitePlugins.push(visualizer({ filename: './node_modules/.cache/visualizer/stats.html', open: true }));
  return vitePlugins;
}
