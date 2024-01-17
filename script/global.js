const path = require('path');

const rootPath = path.join(__dirname, '..');
const srcPath = path.join(rootPath, 'src');
const appPath = path.join(rootPath, 'app');
const distPath = path.join(appPath, 'dist');
const buildPath = path.join(rootPath, 'build');
const buildResourcesPath = path.join(rootPath, 'build_resources');
const mainPath = path.join(distPath, 'main');
const updateAsar = path.join(buildPath, 'update.asar');

const config = {
  rootPath,
  srcPath,
  appPath,
  distPath,
  buildPath,
  buildResourcesPath,
  mainPath,
  updateAsar,
  allProjects: ['main', 'preload', 'render'],
  skinPath: path.join(buildPath, 'skin.zip'),
  skinDirPath: path.join(buildResourcesPath, 'nsis', 'skin'),
  configPath: path.join(mainPath, 'js'),
  packageJsonPath: path.join(rootPath, 'app', 'package.json'),

  nsisPath: path.join(rootPath, 'node_modules', 'app-builder-lib', 'out', 'targets', 'nsis', 'NsisTarget.js'),
  macPackagerPath: path.join(rootPath, 'node_modules', 'app-builder-lib', 'out', 'macPackager.js'),

  licensePath: path.join(buildResourcesPath, 'mac', 'license_zh_CN.txt'),
  licenseBuildPath: path.join(buildPath, 'license_zh_CN.txt'),

  packageInfo: require('./../app/package.json'),

  // 更新文件夹
  publishHotUpdatePath: 'update/hot',
  publishUpdatePath: 'update/app',

  // ssh info
  ssh: {
    test: [
      {
        sshHost: '120.78.70.105',
        sshPort: 13222,
        sshUsername: 'root',
        sshPassword: 'Www.nana.net',
        remoteDir: '/home/application/nginx/webroot/qjkhd_web'
      }
    ],
    staging: []
  },

  // apple
  cscPath: path.join(buildResourcesPath, 'mac', 'developerIDApp.p12'),
  appleId: 'xcfyuqing@163.com',
  appleIdPassword: 'weih-cppc-pdnl-cyyd',
  teamId: 'E595X2V5Y2'
};

module.exports = config;
