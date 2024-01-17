import { app, ipcMain, session } from 'electron';
import { existsSync } from 'fs-extra';
import { basename, dirname, extname, format, join } from 'path';
import { DOWNLOAD_PATH_KEY, FILES_MANAGE } from '../../common/event';
import { __error, __log, __store } from '../global';
import { getFileIcon } from '../utils/appUtil';
import { getMainWindow } from './appWindow';

export const onWillDownload = (): void => {
  initDownloadPath();
  const sess = session.defaultSession as Electron.Session;
  sess.on('will-download', async (event, item, webContents) => {
    const mainWindow = getMainWindow();
    const url = item.getURL();
    __log(url);
    const realyName = __store.get<string>(url, '') as string;
    __store.delete(url);
    __log(realyName);

    // 设置下载目录，阻止系统dialog的出现
    const savePath = getDownloadFilePath(item.getFilename(), realyName);
    item.setSavePath(savePath);

    const startTime = item.getStartTime();
    const fileName = basename(savePath);
    __log('send willDownload', {
      startTime,
      savePath,
      name: fileName,
      url: url,
      isPaused: item.isPaused(),
      canResume: item.canResume(),
      totalBytes: item.getTotalBytes(),
      receivedBytes: item.getReceivedBytes(),
      dataState: 'init'
    });
    mainWindow.webContents.send(FILES_MANAGE.willDownload, {
      startTime,
      savePath,
      name: fileName,
      url: url,
      isPaused: item.isPaused(),
      canResume: item.canResume(),
      totalBytes: item.getTotalBytes(),
      receivedBytes: item.getReceivedBytes(),
      dataState: 'init'
    });

    ipcMain.on(FILES_MANAGE.pause, (event: Electron.Event, res) => {
      __log(res.data);
      if (startTime === res.data) {
        item.pause();
      }
    });
    ipcMain.on(FILES_MANAGE.resume, (event: Electron.Event, res) => {
      __log(res.data);
      if (startTime === res.data) {
        item.resume();
      }
    });
    ipcMain.on(FILES_MANAGE.cancel, (event: Electron.Event, res) => {
      __log(res.data);
      if (startTime === res.data) {
        item.cancel();
      }
    });

    let icon = '';
    item.on('updated', async (event: Electron.Event, state: string) => {
      __log('file updated', item.getSavePath());
      if (!icon) {
        icon = await getFileIcon(item.getSavePath());
      }
      __log('file icon', icon);
      mainWindow.webContents.send(FILES_MANAGE.update, {
        startTime: item.getStartTime(),
        totalBytes: item.getTotalBytes(),
        getReceivedBytes: item.getReceivedBytes(),
        savePath: item.getSavePath(),
        isPaused: item.isPaused(),
        canResume: item.canResume(),
        dataState: state,
        icon: icon
      });
    });

    item.on('done', (event: Electron.Event, state: string) => {
      __log('file done', item.getSavePath());
      ipcMain.removeAllListeners(FILES_MANAGE.pause);
      ipcMain.removeAllListeners(FILES_MANAGE.resume);
      ipcMain.removeAllListeners(FILES_MANAGE.cancel);
      mainWindow.webContents.send(FILES_MANAGE.complete, {
        name: fileName,
        getReceivedBytes: item.getReceivedBytes(),
        totalBytes: item.getTotalBytes(),
        startTime: item.getStartTime(),
        dataState: state
      });
    });
  });
};

function initDownloadPath() {
  const downloadsPath = __store.get(DOWNLOAD_PATH_KEY) as string;
  if (downloadsPath) {
    app.setPath('downloads', downloadsPath);
    __log('下载地址 downloadsPath', app.getPath('downloads'));
  }
}
/**
 * 文件下载地址
 * @param filename 文件名
 */
function getDownloadFilePath(filename: string, realyName: string): string {
  const downloadPath = app.getPath('downloads');
  let savePath = join(downloadPath, filename);

  // savePath基础信息
  let ext = extname(savePath);
  let name = basename(savePath, ext);
  const dir = dirname(savePath);

  try {
    if (realyName) {
      if (ext) {
        name = basename(realyName, ext);
      } else {
        ext = extname(realyName);
        name = basename(realyName, ext);
      }
    }
  } catch (error) {
    __error('自定义文件名失败', error);
  }

  savePath = format({ dir, ext, name });
  // 文件名自增逻辑
  let fileNum = 0;
  while (existsSync(savePath)) {
    fileNum += 1;
    savePath = format({
      dir,
      ext,
      name: `${name}(${fileNum})`
    });
  }
  return savePath;
}
