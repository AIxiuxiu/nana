import { app, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import { join } from 'path';
import { UPDATER } from '../../common/event';
import { __error, __log, __store, appVersion, getAppUpdateUrl } from '../global';
import { getMainWindow } from './appWindow';

const message = {
  error: '检查更新出错',
  checking: '正在检查更新',
  updateAva: '检测到新版本',
  updateNotAva: '现在使用的就是最新版本，不用更新',
  updateDownloaded: '更新内容下载完成'
};

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

export async function updateHandle() {
  __log('全量更新updateHandle');

  const appUpdateUrl = await getAppUpdateUrl();
  //设置更新包的地址
  __log(appUpdateUrl);
  autoUpdater.setFeedURL(join(appUpdateUrl, 'app'));

  //给渲染进程发送消息
  const sendUpdateMessage = (text) => {
    __log('sendUpdateMessage:' + JSON.stringify(text));
    const mainWindow = getMainWindow();
    mainWindow && mainWindow.webContents.send(UPDATER.updateMessage, text);
  };

  //监听升级失败事件
  autoUpdater.on('error', function (error) {
    __error('autoUpdater error', error);
    sendUpdateMessage({
      cmd: 'error',
      message: message.error
    });
  });

  //监听开始检测更新事件
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage({
      cmd: 'checking-for-update',
      message: message.checking
    });
  });

  //监听发现可用更新事件
  autoUpdater.on('update-available', function () {
    sendUpdateMessage({
      cmd: 'update-available',
      message: message.updateAva
    });
  });

  //监听没有可用更新事件
  autoUpdater.on('update-not-available', function () {
    sendUpdateMessage({
      cmd: 'update-not-available',
      message: message.updateNotAva
    });
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    sendUpdateMessage({
      cmd: 'download-progress',
      message: progressObj
    });
  });

  //监听下载完成事件
  autoUpdater.on('update-downloaded', function ({ releaseName }) {
    __log('下载更新完成' + releaseName);
    sendUpdateMessage({
      cmd: 'update-downloaded',
      message: message.updateDownloaded
    });
    __store.set('oldVersion', appVersion);
    autoUpdater.quitAndInstall();
  });

  ipcMain.on(UPDATER.updateNow, () => {
    __log('下载并安装更新包');
    autoUpdater.downloadUpdate();
  });

  ipcMain.on(UPDATER.updateCheck, () => {
    if (!app.isPackaged) {
      return;
    }
    __log('接收渲染进程消息updateCheck，开始检查更新');
    autoUpdater.checkForUpdates();
  });
}
