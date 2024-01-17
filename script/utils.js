const green = require('chalk');
const { parse } = require('dotenv');
const fs = require('fs');
const { get } = require('http');
const { builtinModules } = require('module');
const path = require('path');
const logger = require('./logger');
const electron = require('electron');
const global = require('./global');

const spawnSync = require('child_process').spawnSync;
const cmdSuffix = process.platform === 'win32' ? '.cmd' : '';

const yarn = (arg, cwd = process.cwd()) => {
  logger.info(`yarn ${arg.join(' ')}`);
  const child = spawnSync('yarn' + cmdSuffix, [...arg], {
    stdio: 'inherit',
    cwd: cwd
  });
  if (child.error || child.status !== 0) {
    process.exit(1);
  }
  return child;
};

const yarnRun = (arg) => {
  logger.info(`yarn run ${arg.join(' ')}`);
  const child = spawnSync('yarn' + cmdSuffix, ['run', ...arg], {
    stdio: 'inherit'
  });
  if (child.error || child.status !== 0) {
    process.exit(1);
  }
  return child;
};

const nodeRun = (arg, env) => {
  logger.info(`node ${arg.join(' ')}`);
  const child = spawnSync('node', [...arg], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: env }
  });
  if (child.error || child.status !== 0) {
    process.exit(1);
  }
  return child;
};

const runElectron = (debug) => {
  /** @type {any} */
  const electronPath = electron;
  const child = spawnSync(electronPath, ['.', debug ? '--debug' : '', '--enable-logging'], {
    stdio: 'inherit'
  });
  if (child.error || child.status !== 0) {
    process.exit(1);
  }
  return child;
};

const electronBuildMac = (arg, env) => {
  logger.info(`electron-builder build --mac ${arg.join(' ')}`);
  const electronBuilder = process.platform === 'win32' ? '.\\node_modules\\.bin\\electron-builder' : './node_modules/.bin/electron-builder';
  logger.info('CSC_LINK:' + global.cscPath);
  const child = spawnSync(electronBuilder + cmdSuffix, ['build', '--mac', ...arg], {
    stdio: 'inherit',
    env: { ...process.env, CSC_LINK: global.cscPath, CSC_IDENTITY_AUTO_DISCOVERY: true, WIN_CSC_LINK: undefined, NODE_ENV: env }
  });
  if (child.error || child.status !== 0) {
    process.exit(1);
  }
  return child;
};

const electronBuildWin = (arg, env) => {
  logger.info(`electron-builder build --win ${arg.join(' ')}`);
  const electronBuilder = process.platform === 'win32' ? '.\\node_modules\\.bin\\electron-builder' : './node_modules/.bin/electron-builder';
  const child = spawnSync(electronBuilder + cmdSuffix, ['build', '--win', ...arg], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: env }
  });
  if (child.error || child.status !== 0) {
    process.exit(1);
  }
  return child;
};

const electronBuildDir = (arg, env) => {
  logger.info(`electron-builder build --dir ${arg.join(' ')}`);
  const electronBuilder = process.platform === 'win32' ? '.\\node_modules\\.bin\\electron-builder' : './node_modules/.bin/electron-builder';
  const child = spawnSync(electronBuilder + cmdSuffix, ['build', '--dir', ...arg], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: env }
  });
  if (child.error || child.status !== 0) {
    process.exit(1);
  }
  return child;
};

/** 轮询监听 vite 启动 */
function waitOn(arg0) {
  return new Promise((resolve) => {
    const { port, interval = 100 } = arg0;
    const url = `http://localhost:${port}`;
    let counter = 0;
    const timer = setInterval(() => {
      get(url, (res) => {
        clearInterval(timer);
        console.log('[waitOn]', green(`"${url}" are already responsive.`));
        resolve(res.statusCode);
      }).on('error', (err) => {
        if (counter % 10 == 0) {
          console.log('[waitOn]', `counter: ${counter++}`);
        }
      });
    }, interval);
  });
}

/** node.js builtins module */
const builtins = () => builtinModules.filter((x) => !/^_|^(internal|v8|node-inspect)\/|\//.test(x));

const getEnv = (mode) => {
  try {
    if (getEnv.env) {
      return getEnv.env;
    }
    const env = parse(fs.readFileSync(path.join(process.cwd(), `.env.${mode || 'production'}`)));
    return (getEnv.env = env);
  } catch (error) {
    return {};
  }
};
getEnv.env = undefined; // Just fix ts check

const removeSourceMap = () => {
  // 读取sourcemap文件
  deleteSourceMap('./app/dist/render/assets');
};

const deleteSourceMap = (assetsPath) => {
  const assets = fs.readdirSync(path.resolve(process.cwd(), assetsPath));
  assets
    .filter((name) => /\.map$/.test(name))
    .forEach((name) => {
      const filePath = path.join(assetsPath, name.split('?')[0]);
      if (filePath) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(`unable to delete '${name}'. ` + 'File does not exist; it may not have been created ' + 'due to a build error.');
      }
    });
};

module.exports = { yarn, yarnRun, nodeRun, runElectron, electronBuildMac, electronBuildWin, electronBuildDir, builtins, getEnv, waitOn, removeSourceMap };
