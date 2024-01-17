#!/usr/bin/env node

/*---------------------------------------------------------------------------------------------
 *  限制安装环境为 node >=16  yarn >=1.22.0， 使用 yarn 安装 dependencies
 *--------------------------------------------------------------------------------------------*/

const logger = require('../logger');
const cp = require('child_process');

let err = false;

const nodeVs = /^(\d+)\./.exec(process.versions.node) || [];
const majorNodeVersion = parseInt(nodeVs[1]);

if (majorNodeVersion < 16) {
  logger.error('请使用node16及以上版本 .\n');
  err = true;
}

const yarnVersion = cp.execSync('yarn -v', { encoding: 'utf8' }).trim();
const parsedYarnVersion = /^(\d+)\.(\d+)\./.exec(yarnVersion) || [];
const majorYarnVersion = parseInt(parsedYarnVersion[1]);
const minorYarnVersion = parseInt(parsedYarnVersion[2]);

if (majorYarnVersion < 1 || minorYarnVersion < 22) {
  logger.error('请使用 yarn >=1.22.0. 安装最新yarn： npm install yarn@latest -g\n');
  err = true;
}

console.error(process.env['npm_execpath']);

if (!/yarn\.js$|yarnpkg$/.test(process.env['npm_execpath'] || '')) {
  logger.error('请使用yarn安装依赖，安装yarn：npm install yarn@latest -g\n');
  err = true;
}

if (err) {
  process.exit(1);
}
