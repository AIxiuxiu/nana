const { nodeResolve } = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');
const alias = require('@rollup/plugin-alias');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const path = require('path');
const esbuild = require('rollup-plugin-esbuild').default;
const { defineConfig } = require('rollup');
const { builtins, getEnv } = require('./utils');
const { builtinModules } = require('module');

module.exports = (env = 'production', type = 'main') => {
  const configObject = defineConfig({
    input: type === 'main' ? path.join(__dirname, '..', 'src', 'main', 'index.ts') : path.join(__dirname, '..', 'src', 'preload', 'index.ts'),
    output: {
      file: path.join(__dirname, '..', 'app', 'dist', `${type}`, 'index.js'),
      format: 'cjs',
      name: type === 'main' ? 'MainProcess' : 'MainPreloadProcess',
      sourcemap: false
    },
    plugins: [
      replace({
        preventAssignment: true,
        ...Object.entries({ ...getEnv(process.env.NODE_ENV) }).reduce((acc, [k, v]) => Object.assign(acc, { [`process.env.${k}`]: JSON.stringify(v) }), {})
      }),
      // 提供路径和读取别名
      nodeResolve({
        preferBuiltins: true,
        browser: false,
        extensions: ['.mjs', '.ts', '.js', '.json', '.node']
      }),
      commonjs({
        sourceMap: false
      }),
      json(),
      esbuild({
        // All options are optional
        include: /\.[jt]s?$/, // default, inferred from `loaders` option
        exclude: /node_modules/, // default
        // watch: process.argv.includes('--watch'), // rollup 中有配置
        sourceMap: env != 'production', // default
        minify: env === 'production',
        target: 'node14.16', // default, or 'es20XX', 'esnext'
        // Like @rollup/plugin-replace
        define: {
          __VERSION__: '"x.y.z"'
        },
        // Add extra loaders
        loaders: {
          '.json': 'json'
        }
      }),
      alias({
        entries: {
          '@root': path.join(__dirname, '..')
        }
      })
    ],
    onwarn(warning) {
      if (warning.code != 'CIRCULAR_DEPENDENCY') {
        console.log(warning);
      }
    },
    external: [...builtins(), ...builtinModules, 'electron']
  });
  return configObject;
};
