/**
 * 热更新， asar 必须是 false
 */

const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const AdmZip = require('adm-zip');
const global = require('./global');
const logger = require('./logger');

const hash = (data, type = 'sha256') => {
  const hmac = crypto.createHmac(type, 'Sky');
  hmac.update(data);
  return hmac.digest('hex');
};

const createZip = (filePath, dest) => {
  const zip = new AdmZip();
  zip.addLocalFile(filePath, '', 'update.bin');
  zip.toBuffer();
  zip.writeZip(dest);
};

const hotUpdater = (version, publishAppPath, publish = false) => {
  const name = 'update.zip';
  const outputPath = path.join(global.buildPath, publishAppPath, global.publishHotUpdatePath);

  const zipPath = path.resolve(outputPath, name);
  fs.ensureDirSync(outputPath);
  fs.emptyDirSync(outputPath);
  // createZip(global.appPath, zipPath);
  createZip(global.updateAsar, zipPath);
  const buffer = fs.readFileSync(zipPath);
  const sha256 = hash(buffer);
  const hashName = sha256.slice(7, 12);

  fs.copySync(zipPath, path.resolve(outputPath, `${hashName}.zip`));
  fs.removeSync(zipPath);
  fs.outputJSONSync(path.join(outputPath, `update.json`), {
    version: version,
    name: `${hashName}.zip`,
    hash: sha256,
    publish
  });
};

module.exports = hotUpdater;
