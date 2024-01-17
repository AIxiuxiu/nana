import { captureException } from '@sentry/electron/main';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import { spawn } from 'child_process';
import { createHmac } from 'crypto';
import { app, ipcMain } from 'electron';
import extract from 'extract-zip';
import { createWriteStream, emptyDir, existsSync, readFile, removeSync, renameSync, unlinkSync } from 'fs-extra';
import { join } from 'path';
import ProgressBar from 'progress';
import gt from 'semver/functions/gt';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { UPDATER } from '../../common/event';
import { __error, __log, __store, appVersion, getAppUpdateUrl, isWin } from '../global';
import { relaunchApp } from '../utils/appUtil';
import { getMainWindow } from './appWindow';

const streamPipeline = promisify(pipeline);
const appPath = app.getAppPath();
const updatePath = join(app.getPath('userData'), 'update');

const request = axios.create({ adapter: httpAdapter });
let isReadUpdate = false;
let isUpdateing = false;
let isFirstUpdate = true;
/**
 * @param data 文件流
 * @param type 类型，默认sha256
 * @param key 密钥，用于匹配计算结果
 * @returns {string} 计算结果
 * @date 2021-03-05
 */
function hash(data, type = 'sha256', key = 'Sky') {
  const hmac = createHmac(type, key);
  hmac.update(data);
  return hmac.digest('hex');
}

/**
 * @param url 下载地址
 * @param filePath 文件存放地址
 * @returns {void}
 * @date 2021-03-05
 */
async function download(url: string, filePath: string) {
  const mainWindow = getMainWindow();
  if (isFirstUpdate) {
    mainWindow && mainWindow.webContents.send(UPDATER.hotUpdateProgress, 0);
  }

  const res = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  if (isFirstUpdate) {
    const totalLength = res.headers['content-length'];
    __log('totalLength' + totalLength);

    const progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
      width: 40,
      complete: '=',
      incomplete: ' ',
      renderThrottle: 1,
      total: parseInt(totalLength)
    });

    res.data.on('data', (chunk) => {
      progressBar.tick(chunk.length);
    });

    const timer = setInterval(function () {
      if (progressBar.complete) {
        mainWindow && mainWindow.webContents.send(UPDATER.hotUpdateProgress, 100);
        clearInterval(timer);
      } else {
        let ratio = progressBar.curr / progressBar.total;
        ratio = Math.min(Math.max(ratio, 0), 1);
        const percent = Math.floor(ratio * 100);
        mainWindow && mainWindow.webContents.send(UPDATER.hotUpdateProgress, percent);
      }
    }, 200);
  }

  await streamPipeline(res.data, createWriteStream(filePath));
}

/**
 * 热更新
 * @returns {void}
 */
export const hotUpdater = async () => {
  if (!app.isPackaged) {
    return;
  }

  ipcMain.on(UPDATER.hotCheck, () => {
    __log('接收渲染进程消息hotCheck，开始检查热更新');
    hotUpdate();
  });

  ipcMain.on(UPDATER.hotRestart, async () => {
    __log('接收渲染进程消息hotRestart，开始更新并重启');
    if (existsSync(join(updatePath, 'update.bin'))) {
      await handlerUpdate(true);
    }
  });
};

export const hotUpdateBeforeClose = async () => {
  if (!app.isPackaged) {
    return;
  }
  __log('退出前尝试更新');
  if (existsSync(join(updatePath, 'update.bin'))) {
    await handlerUpdate(false);
  }
};

async function handlerUpdate(relaunch: boolean) {
  try {
    __store.set('oldVersion', appVersion);
    const resourcesPath = process.resourcesPath;
    if (isWin) {
      let updaterExe = 'updater.exe';
      __log(process.execPath);
      if (process.execPath.startsWith('C:')) {
        // C盘可能有权限问题，使用管理员权限运行
        updaterExe = 'qjUpdater.exe';
      }
      if (!existsSync(join(resourcesPath, '..', 'qjUpdater.exe'))) {
        updaterExe = 'updater.exe';
      }
      let winArgs = `"${join(resourcesPath, '..', updaterExe)}" "${join(updatePath, 'update.bin')}" "${join(resourcesPath, 'app.asar')}"`;
      if (relaunch) {
        winArgs += ` "${process.execPath}"`;
      }
      __log(winArgs);

      const child = spawn('cmd', ['/s', '/c', '"' + winArgs + '"'], {
        detached: true, // 让子进程能在父进程退出后继续运行
        windowsVerbatimArguments: true,
        stdio: 'ignore'
      });
      child.unref(); //子进程和父进程分离

      app.exit();
    } else {
      const currentPack = join(resourcesPath, 'app.asar');
      unlinkSync(currentPack);
      renameSync(join(updatePath, 'update.bin'), currentPack);
      if (relaunch) {
        relaunchApp();
      }
    }
  } catch (error) {
    __log(error);
    captureException(error, {
      level: 'error',
      tags: {
        context: 'handerHotUpdate'
      }
    });
  }
}

async function hotUpdate() {
  const mainWindow = getMainWindow();
  try {
    if (isUpdateing) {
      return;
    }
    isUpdateing = true;
    if (isReadUpdate) {
      isFirstUpdate = false;
      mainWindow && mainWindow.webContents.send(UPDATER.hotUpdate);
      return;
    }
    const appUpdateUrl = await getAppUpdateUrl();
    const hotUpdateUrl = `${appUpdateUrl}/hot/update.json?time=${new Date().getTime()}`;
    __log('开始热更新', hotUpdateUrl);
    const res = await request({ url: hotUpdateUrl });
    __log(res.data, appPath);
    const forceUpdate = __store.get('forceUpdate');
    __log('publish>>' + res.data.publish + '    forceUpdate>>' + forceUpdate);
    if (gt(res.data.version, appVersion) && (res.data.publish || forceUpdate)) {
      mainWindow && mainWindow.webContents.send(UPDATER.hotUpdateing, res.data);
      await emptyDir(updatePath);
      const filePath = join(updatePath, res.data.name);
      try {
        // 判断更新文件是否存在-window又是报没权限
        if (!existsSync(filePath)) {
          // 下载更新文件
          await download(`${appUpdateUrl}/hot/${res.data.name}`, filePath);
        }
      } catch (error) {
        removeSync(filePath);
        mainWindow && mainWindow.webContents.send(UPDATER.hotUpdateError, error);
        isUpdateing = false;
        throw new Error('download hot update error');
      }
      const buffer = await readFile(filePath);
      const sha256 = hash(buffer);
      if (sha256 !== res.data.hash) {
        removeSync(filePath);
        mainWindow && mainWindow.webContents.send(UPDATER.hotUpdateError, 'sha256 error');
        isFirstUpdate = false;
        isUpdateing = false;
        throw new Error('sha256 error');
      }

      try {
        await extract(filePath, { dir: updatePath });
        removeSync(filePath);
      } catch (error) {
        removeSync(filePath);
        mainWindow && mainWindow.webContents.send(UPDATER.hotUpdateError, error);
        isFirstUpdate = false;
        isUpdateing = false;
        throw new Error('hot update extract error');
      }
      //给渲染进程发送消息
      __log('热更新下载完成:' + JSON.stringify(res.data));
      isReadUpdate = true;
      mainWindow && mainWindow.webContents.send(UPDATER.hotUpdate, res.data);
      isUpdateing = false;
    } else {
      isFirstUpdate = false;
      mainWindow && mainWindow.webContents.send(UPDATER.hotNoUpdate, res.data);
      isUpdateing = false;
    }
  } catch (error) {
    isFirstUpdate = false;
    isReadUpdate = false;
    __error('hot update error', error);
    mainWindow && mainWindow.webContents.send(UPDATER.hotUpdateError, error);
    isUpdateing = false;
    captureException(error, {
      level: 'error',
      tags: {
        context: 'hotUpdate'
      }
    });
  }
}
