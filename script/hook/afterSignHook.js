const { notarize } = require('electron-notarize');
const logger = require('../logger');
const global = require('../global');

exports.default = async function (context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }
  logger.info('start afterSignHook');

  // macOS app 公证
  let extraData = { notarizeEnable: false };
  if (context.packager.info._configuration.extraMetadata.extraData) {
    extraData = JSON.parse(context.packager.info._configuration.extraMetadata.extraData);
  }
  if (!extraData.notarizeEnable) {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  logger.info(`notarize with: ${appOutDir}/${appName}.app`);

  await notarize({
    appPath: `${appOutDir}/${appName}.app`,
    appleId: global.appleId,
    appleIdPassword: global.appleIdPassword,
    teamId: global.teamId,
    tool: 'notarytool'
  });
  logger.info(`${appName}.app 公证完成`);
};
