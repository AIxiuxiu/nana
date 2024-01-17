const logger = require('../logger');
const global = require('../global');
const fs = require('fs-extra');
const path = require('path');

exports.default = function (buildResult) {
  logger.info('start afterAllArtifactBuild');
  let extraData = { uploadApp: false, updateApp: false };
  if (buildResult.configuration.extraMetadata.extraData) {
    logger.info('extraData.json: ' + buildResult.configuration.extraMetadata.extraData);
    extraData = JSON.parse(buildResult.configuration.extraMetadata.extraData);
  }
  if (extraData.uploadApp) {
    createAPPFiles(buildResult, extraData.publishAppPath);
  }
  if (extraData.updateApp) {
    moveAPPUpdateFiles(buildResult, extraData.publishAppPath);
  }
  logger.info('end afterAllArtifactBuild');
};

// 复制安装包并重命名
const createAPPFiles = function (buildResult, publishAppPath) {
  logger.info('移动生成的安装包');
  const appPath = path.join(buildResult.outDir, publishAppPath);
  fs.ensureDirSync(appPath);
  for (const artifactPath of buildResult.artifactPaths) {
    if (artifactPath.endsWith('dmg') || artifactPath.endsWith('exe')) {
      const fileName = process.platform === 'win32' ? artifactPath.split('\\').pop() : artifactPath.split('/').pop();
      const appSourceFile = path.join(appPath, fileName.replace(`-${global.packageInfo.version}`, ''));
      fs.copyFileSync(artifactPath, appSourceFile);
    }
  }
};

// 移动更新需要的安装包
const moveAPPUpdateFiles = async function (buildResult, publishAppPath) {
  logger.info('移动生成的更新包');
  const updatePath = path.join(buildResult.outDir, publishAppPath, global.publishUpdatePath);
  for (const artifactPath of buildResult.artifactPaths) {
    if (artifactPath.endsWith('zip') || artifactPath.endsWith('exe')) {
      const fileName = process.platform === 'win32' ? artifactPath.split('\\').pop() : artifactPath.split('/').pop();
      const appSourceFile = path.join(updatePath, fileName);
      fs.moveSync(artifactPath, appSourceFile);
    }
  }
};
