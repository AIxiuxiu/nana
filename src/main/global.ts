import axios from 'axios';
import { app } from 'electron';
import log from 'electron-log';
import Store from 'electron-store';
import { renameSync } from 'fs-extra';
import { join, parse } from 'path';

log.transports.file.level = 'info';
log.transports.console.level = 'debug';
// log.transports.file.maxSize = 5 * 1024 * 1024;
log.transports.file.archiveLog = archiveLog;

function archiveLog(file: log.LogFile): void {
  const oldPath = file.toString();
  const info = parse(oldPath);
  try {
    const iso = new Date().toISOString().replace(/[-:]/g, '');
    renameSync(oldPath, join(info.dir, info.name + '-' + iso + info.ext));
  } catch (e) {
    log.transports.console({
      data: ['Could not rotate log', e],
      date: new Date(),
      level: 'warn'
    });
  }
}

const packageInfo: {
  name: string;
  appId: string;
  version: string;
} = require('../../package.json');

export const lgoinWinSize = {
  width: 900,
  height: 602
};

export const isWin = process.platform === 'win32';
export const isMacOS = process.platform === 'darwin';
export const isLinux = process.platform === 'linux';
export const isWin64 = process.arch == 'x64';
export const appName = process.env.VITE_APP_TITLE;

// 英文名称
export const appEnName = packageInfo.name;
export const appId = packageInfo.appId;
export const appVersion = packageInfo.version || app.getVersion();

//资源文件
export const resourcesPath: string = join(__dirname, 'resources');
export const preloadJs = join(__dirname, '../preload/index.js');

//加载文件路径 和 地址
export const indexHtml = join(__dirname, '../render/index.html');
export const indexURL = `http://localhost:${process.env.VITE_SERVER_PORT}`;

export const __store = new Store();

export const __log = log.log;
export const __info = log.info;
export const __warn = log.warn;
export const __error = log.error;

export const logPath = log.transports.file.getFile().path;

export const getAppUpdateUrl = async () => {
  const url = process.env.VITE_MAIN_UPDATE_URL;
  if (url.includes('172.22.9.72')) {
    try {
      // 判断内网外网，替换
      await axios.get('http://172.22.9.72', { timeout: 3000 });
    } catch (error) {
      return url.replace('172.22.9.72', '1.85.59.252:10072');
    }
  }
  return url;
};
