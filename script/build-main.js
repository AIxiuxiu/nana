const fs = require('fs-extra');
const chalk = require('chalk');
const { spawn } = require('child_process');
const electron = require('electron');
const minimist = require('minimist');
const ora = require('ora');
const path = require('path');
const { rollup, watch } = require('rollup');
const { main } = require('../package.json');
const { getEnv, waitOn } = require('./utils');
const global = require('./global');
const rollupOptions = require('./rollup.config');

const env = getEnv(process.env.NODE_ENV);
const argv = minimist(process.argv.slice(1));
const TAG = '[build-main]';
const spinner = ora(`${TAG} Electron main build for ${process.env.NODE_ENV}...`);

(async () => {
  const config = rollupOptions(process.env.NODE_ENV, 'main');
  if (argv.watch) {
    // Wait on vite server launched
    await waitOn({ port: env.VITE_SERVER_PORT });

    const watcher = watch(config);
    let child;
    watcher.on('change', (filename) => {
      const log = chalk.green(`change -- ${filename}`);
      console.log(TAG, log);
    });
    watcher.on('event', (ev) => {
      if (ev.code === 'END') {
        if (child) child.kill();
        child = spawn(electron, [path.join(__dirname, `../${main}`)], { stdio: 'inherit' });
      } else if (ev.code === 'ERROR') {
        console.log(ev.error);
      }
    });
  } else {
    spinner.start();
    try {
      fs.copySync(path.join(global.srcPath, 'main', 'resources'), path.join(global.mainPath, 'resources'), { overwrite: true });
      const bundle = await rollup(config);
      await bundle.write(config.output);
      spinner.succeed();
      process.exit();
    } catch (error) {
      console.log(`\n${TAG} ${chalk.red('构建报错')}\n`, error, '\n');
      spinner.fail();
      process.exit(1);
    }
  }
})();
