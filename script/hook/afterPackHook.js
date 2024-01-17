const logger = require('../logger');
const global = require('../global');
const fs = require('fs-extra');
const archiver = require('archiver');
const path = require('path');
const { getEnv } = require('../utils');

exports.default = async function (context) {
  logger.info('start afterPackHook');
  // 打包window
  if (context.electronPlatformName === 'win32') {
    winPostinstall();
  }
  // macOS app 公证
  let extraData = { uploadApp: false };
  if (context.packager.info._configuration.extraMetadata.extraData) {
    extraData = JSON.parse(context.packager.info._configuration.extraMetadata.extraData);
  }
  if (extraData.uploadApp) {
    createUpdateAsar(context);
  }
  if (context.packager.platform.nodeName === 'win32') {
    fs.copySync(path.join(global.buildResourcesPath, 'updater', 'updater.exe'), path.join(context.appOutDir, 'updater.exe'));
    fs.copySync(path.join(global.buildResourcesPath, 'updater', 'qjUpdater.exe'), path.join(context.appOutDir, 'qjUpdater.exe'));
    const config = getEnv(extraData.env);
    fs.writeFileSync(path.join(context.appOutDir, 'updaterConfig.json'), JSON.stringify({ updateUrl: config.VITE_MAIN_UPDATE_URL + '/hot/' }), 'utf-8');
  }

  removeLanguages(context);

  logger.info('end afterPackHook');
};

const createUpdateAsar = function (context) {
  let targetPath;
  if (context.packager.platform.nodeName === 'darwin') {
    targetPath = path.join(context.appOutDir, `${context.packager.appInfo.productName}.app/Contents/Resources`);
  } else {
    targetPath = path.join(context.appOutDir, 'resources');
  }
  const asar = path.join(targetPath, 'app.asar');
  fs.copySync(asar, path.join(context.outDir, 'update.asar'));
};

/**
 * 修改nsis 为utf8,生成skin.zip压缩包
 */
const winPostinstall = function () {
  if (fs.existsSync(global.skinPath)) {
    return;
  }

  const output = fs.createWriteStream(global.skinPath);
  const archive = archiver('zip');

  archive.on('error', (err) => {
    logger.error('压缩失败');
    throw err;
  });

  archive.on('error', (err) => {
    logger.error('skin 压缩失败');
  });

  archive.pipe(output);
  archive.directory(global.skinDirPath, false);
  archive.finalize();
};

const removeLanguages = async (context) => {
  logger.info('start removeLanguages on ' + context.packager.platform.nodeName);

  if (context.packager.platform.nodeName === 'darwin') {
    let languages = ['zh_CN'];
    let targetPath = path.join(context.appOutDir, `${context.packager.appInfo.productName}.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources`);
    let glob = require('glob');
    const files = glob.sync(`${targetPath}/!(${languages.join('|')}).lproj`);
    logger.debug('removeLanguages files' + files);
    files.forEach((file) => {
      fs.removeSync(file);
    });
  } else if (context.packager.platform.nodeName === 'win32') {
    let languages = ['zh-CN'];
    let targetPath = path.join(context.appOutDir, `locales`);
    let glob = require('glob');
    const files = glob.sync(`${targetPath}/!(${languages.join('|')}).pak`);
    logger.debug('removeLanguages files' + files);
    files.forEach((file) => {
      fs.removeSync(file);
    });
  }
  logger.info('end removeLanguages');
};
