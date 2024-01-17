const fs = require('fs-extra');
const path = require('path');
const logger = require('./logger');
const prompt = require('inquirer').prompt;
const global = require('./global');
const { yarnRun, nodeRun, electronBuildMac, electronBuildWin, electronBuildDir, runElectron, getEnv, removeSourceMap } = require('./utils.js');

// 文件是否存在
const skinFileExist = fs.existsSync(global.skinPath);
const licenseFileExist = fs.existsSync(global.licenseBuildPath);

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

const buildProject = (projects, env) => {
  for (const project of projects) {
    if (project == 'render') {
      yarnRun(['vite', 'build', `--mode=${env}`]);
      removeSourceMap();
    } else if (project == 'main') {
      nodeRun([`script/build-main.js`], env);
    } else if (project == 'preload') {
      nodeRun([`script/build-preload.js`], env);
    } else if (project == 'skin') {
      cleanSkin();
    } else if (project == 'license') {
      moveLiscense();
    }
  }
};

const cleanSkin = () => {
  if (skinFileExist) {
    fs.removeSync(global.skinPath);
    logger.info('删除skin.zip完成');
  }
};

// 添加 license 文件
const moveLiscense = () => {
  fs.copySync(global.licensePath, global.licenseBuildPath, { overwrite: true });
};

// 额外信息
const getExtraJson = (notarizeEnable, env) => {
  const extraJson = JSON.stringify({
    notarizeEnable: notarizeEnable,
    env: env
  });
  logger.debug(`extraMetadata.extraData: ${extraJson}`);
  return extraJson;
};

// electron build
const buildElectron = (platform, extraJson, env) => {
  if (platform == 'local') {
    runElectron(logger.showDebug);
  } else {
    const config = getEnv(env);
    const arg = ['-p=never', `-c.extraMetadata.extraData=${extraJson}`, `-c.publish.url=${config.VITE_MAIN_UPDATE_URL}/app`];
    const macArg = ['dmg', ...arg];
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
  }
};

const winChoices = [
  {
    name: 'dir      只生成当前环境App文件，不打包，用于生成更新文件',
    value: 'dir'
  },
  {
    name: 'win      生成Window包',
    value: 'win'
  }
];

const macChoices = [
  {
    name: 'dir      只生成App文件，不打包',
    value: 'dir'
  },
  {
    name: 'win      生成Window包',
    value: 'win'
  },
  {
    name: 'mac      生成MacOS包',
    value: 'mac'
  },
  {
    name: 'win-mac  生成Window和MacOS包',
    value: 'win-mac'
  }
];
const prebuild = async function () {
  const platformChoices = process.platform === 'win32' ? winChoices : macChoices;
  const buildProjects = global.allProjects.map((item) => ({
    name: `${item}`,
    value: `${item}`,
    checked: !fs.existsSync(path.join(global.distPath, `${item}`))
  }));

  const questions = [
    {
      type: 'checkbox',
      message: '选择编译任务:',
      name: 'projects',
      choices: [
        ...buildProjects,
        {
          name: 'skin:         win图标',
          value: 'skin',
          checked: !skinFileExist
        },
        {
          name: 'license:      dmg用户协议',
          value: 'license',
          checked: !licenseFileExist && process.platform === 'darwin'
        }
      ]
    },
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
      message: '请选择编译环境:',
      name: 'platform',
      choices: platformChoices
    },
    {
      type: 'confirm',
      name: 'notarizeEnable',
      message: 'MacOS APP 公证:',
      default: false,
      when: function (answers) {
        return answers.platform.indexOf('mac') != -1;
      }
    }
  ];

  const { projects, env, platform, notarizeEnable } = await prompt(questions);

  buildProject(projects, env);

  debug();

  const extraJson = getExtraJson(notarizeEnable, env);
  buildElectron(platform, extraJson, env);
};

prebuild();
