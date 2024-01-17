const chalk = require('chalk');
const minimist = require('minimist');
const ora = require('ora');
const { rollup, watch } = require('rollup');
const rollupOptions = require('./rollup.config');

const argv = minimist(process.argv.slice(1));
const TAG = '[build-preload]';
const spinner = ora(`${TAG} Electron preload build for ${process.env.NODE_ENV}...`);

(async () => {
  const config = rollupOptions(process.env.NODE_ENV, 'preload');
  if (argv.watch) {
    const watcher = watch(config);
    watcher.on('change', (filename) => {
      const log = chalk.yellow(`change -- ${filename}`);
      console.log(TAG, log);

      /**
       * @todo Hot reload render process !!!
       */
    });
  } else {
    spinner.start();
    try {
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
