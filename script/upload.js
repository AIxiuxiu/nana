const logger = require('./logger');
const global = require('./global');
const fs = require('fs-extra');
const path = require('path');

const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

/** 上传文件,相对于 build目录 */
const uploadFile = async function (uploadPaths, env) {
  for (let index = 0; index < global.ssh[env].length; index++) {
    const shhInfo = global.ssh[env][index];
    await sshUpload(uploadPaths, shhInfo);
  }
};

async function sshUpload(uploadPaths, sshInfo) {
  logger.debug(`连接 ${sshInfo.sshHost}`);
  await ssh
    .connect({
      host: sshInfo.sshHost,
      port: sshInfo.sshPort,
      username: sshInfo.sshUsername,
      password: sshInfo.sshPassword
    })
    .then(() => {
      logger.info(`连接 ${sshInfo.sshHost} 成功`);
    })
    .catch((reason) => {
      logger.error('连接失败' + reason);
    });

  for (const uploadPath of uploadPaths) {
    const upload_path = path.join(global.buildPath, uploadPath);
    if (!fs.existsSync(upload_path)) {
      logger.error(`上传文件${upload_path}不存在`);
    } else {
      await ssh.putDirectory(upload_path, `${sshInfo.remoteDir}/${uploadPath}`).then(
        () => {
          logger.info(`上传文件${uploadPath}完成`);
        },
        (error) => {
          logger.error(`上传文件${uploadPath}失败：${error}`);
        }
      );
    }
  }

  ssh.dispose();
}

module.exports = uploadFile;
