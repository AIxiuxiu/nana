const fs = require('fs-extra');
const path = require('path');
const logger = require('./logger');
const prompt = require('inquirer').prompt;
const global = require('./global');
const { yarn, yarnRun, nodeRun, electronBuildMac, electronBuildWin, electronBuildDir, getEnv, removeSourceMap } = require('./utils.js');
const hotUpdater = require('./hot-updater');
const uploadFile = require('./upload');

let packageJson = fs.readFileSync(path.join(global.appPath, 'package.json'));

const debug = () => {
  const isDebug = process.argv.slice(2).some((val) => val === '--debug');
  if (isDebug) {
    // process.env.DEBUG = 'electron-builder';
    process.env.DEBUG = '*';
    logger.showDebug = true;
    return true;
  }
  return false;
};

function moveYml(ymlFile, publishAppPath) {
  const updatePath = path.join(global.buildPath, publishAppPath, global.publishUpdatePath);
  const latestYmlFile = path.join(global.buildPath, ymlFile);
  const latestToYmlFile = path.join(updatePath, ymlFile);
  if (fs.existsSync(latestYmlFile)) {
    fs.moveSync(latestYmlFile, latestToYmlFile);
  }
}

const prebuild = async function () {
  const questions = [
    {
      type: 'list',
      message: '环境',
      name: 'env',
      choices: [
        {
          name: '内测',
          value: 'test'
        },
        {
          name: '公测',
          value: 'staging'
        },
        {
          name: '正式',
          value: 'production'
        }
      ]
    },
    {
      type: 'list',
      message: '版本更新',
      name: 'version',
      choices: [
        {
          name: '内部版本号',
          value: 'prerelease'
        },
        {
          name: '修订号',
          value: 'patch'
        },
        {
          name: '次版本号',
          value: 'minor'
        },
        {
          name: '主版本号',
          value: 'major'
        },
        {
          name: '不修改',
          value: ''
        }
      ],
      when: function (answers) {
        return answers.env != 'production';
      }
    },
    {
      type: 'confirm',
      name: 'isConfirmV',
      message: `确认发布版本号为：${JSON.parse(packageJson).version}`,
      default: true,
      when: function (answers) {
        return answers.env == 'production';
      }
    },
    {
      type: 'list',
      message: '更新方式',
      name: 'updateType',
      choices: [
        {
          name: '热更新',
          value: 'hot'
        },
        {
          name: '全量更新',
          value: 'all'
        }
      ],
      when: function (answers) {
        return answers.env != 'production' || answers.isConfirmV;
      }
    },
    {
      type: 'confirm',
      name: 'notBuildApp',
      message: '不打包app，快速更新:',
      default: true,
      when: function (answers) {
        return answers.env == 'test' && answers.updateType == 'hot';
      }
    }
  ];

  const { env, updateType, version, isConfirmV, notBuildApp } = await prompt(questions);

  debug();
  if (env == 'production' && !isConfirmV) {
    logger.error('版本号错误，请去app/package.json文件修改');
    process.exit();
  }

  // 清空build
  fs.removeSync(global.buildPath);

  if (version) {
    yarn(['version', `--${version}`, '--no-git-tag-version'], global.appPath);
  }
  packageJson = fs.readFileSync(path.join(global.appPath, 'package.json'));
  const newVersion = JSON.parse(packageJson).version;
  logger.warning(`当前版本号: ${newVersion}`);

  const skipDist = process.argv.slice(2).some((val) => val === '--skipDist');
  if (!skipDist) {
    nodeRun([`script/build-main.js`], env);
    nodeRun([`script/build-preload.js`], env);
    env != 'test' && (process.env.SENTRY_UPLOAD = true); //上传sourcemap到 sentry
    yarnRun(['vite', 'build', `--mode=${env}`]);
    // removeSourceMap();
  } else {
    logger.warning('跳过app的dist编译');
  }

  // 添加 license 文件
  fs.copySync(global.licensePath, global.licenseBuildPath, { overwrite: true });

  let platform = process.platform === 'win32' ? 'win' : 'win-mac';
  if (notBuildApp) {
    platform = 'dir';
  }
  const prod = env != 'test';
  const publishAppPath = env != 'test' ? 'qjkhdg' : 'qjkhdgtest';
  const extraJson = JSON.stringify({
    notarizeEnable: prod,
    uploadApp: true,
    updateApp: updateType == 'all',
    env: env,
    publishAppPath: publishAppPath
  });

  const config = getEnv(env);
  const arg = [`-c.extraMetadata.extraData=${extraJson}`, `-c.publish.url=${config.VITE_MAIN_UPDATE_URL}/app`];
  const macArg = updateType == 'all' ? ['dmg', 'zip', ...arg] : ['dmg', ...arg];
  if (platform == 'dir') {
    electronBuildDir(arg, env);
  } else if (platform == 'win-mac') {
    electronBuildMac(macArg, env);
    electronBuildWin(arg, env);
  } else if (platform == 'mac') {
    electronBuildMac(macArg, env);
  } else {
    electronBuildWin(arg, env);
  }

  const uploadFiles = notBuildApp ? [`${publishAppPath}/update`] : [publishAppPath];

  if (updateType == 'hot') {
    hotUpdater(newVersion, publishAppPath, env != 'production');
  } else if (updateType == 'all') {
    moveYml('latest-mac.yml', publishAppPath);
    moveYml('latest.yml', publishAppPath);
  }

  if (!prod) {
    uploadFile(uploadFiles, env);
  }
};

prebuild();
