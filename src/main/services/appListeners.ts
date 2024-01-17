import { app, BrowserWindow, dialog, IpcMainEvent, screen } from 'electron';
import gt from 'semver/functions/gt';
import { QjDialog, QjMenuItem } from '../../common/electron';
import {
  CLEAN_OLD_VERSION,
  DOWNLOAD_FILE,
  DOWNLOAD_PATH_CHNAGE,
  DOWNLOAD_PATH_KEY,
  GET_DOWNLOAD_PATH,
  GET_SCREEN_SIZE,
  GET_VERSION,
  LOGIN,
  LOGOUT,
  OPEN_DEV_TOOLS,
  RELAUNCH,
  RELOAD,
  RELOAD_SCREEN,
  SHOW_CONTEXTUAL_MENU,
  SHOW_DIALOG,
  WIN_DETAIL_OPERATION,
  WIN_DETAIL_SHOW,
  WIN_OPERATION,
  WIN_QJSC_SHOW,
  WIN_SCREEN_SHOW
} from '../../common/event';
import { __error, __log, __store, appVersion } from '../global';
import { relaunchApp } from '../utils/appUtil';
import { buildContextMenu } from '../utils/contextMenu';
import { ipcListen } from '../utils/ipcListen';
import {
  detailWindow,
  getDetailWindow,
  getMainWindow,
  getScreenWindow,
  mainWindow,
  minimizeWindow,
  showDetailWindow,
  showQjscWindow,
  showScreenWindow,
  toggleMaximizeWindow
} from './appWindow';

/**
 * 消息监听 ipc通讯 Electron IPC listeners.
 */
export const initMainListener = () => {
  /**
   * 登录成功
   */
  ipcListen(LOGIN, (res) => {
    __log('LOGIN', !!mainWindow);
    mainWindow && mainWindow.mainWindowSize();
    setTimeout(() => {
      if (res && mainWindow && mainWindow.getWindow()) {
        mainWindow.getWindow().webContents.send(res.eventName, res.data);
      }
    }, 1000);
  });

  /**
   * 退出登录
   */
  ipcListen(LOGOUT, () => {
    __log('LOGOUT');
    mainWindow && mainWindow.loginWindowSize();
  });

  /**
   * 刷新
   */
  ipcListen(RELOAD, () => {
    getMainWindow().webContents.reload();
  });

  /**
   * 打开控制台
   */
  ipcListen(OPEN_DEV_TOOLS, () => {
    getMainWindow().webContents.openDevTools();
  });

  // 重启
  ipcListen(RELAUNCH, () => {
    __log('RELAUNCH app');
    relaunchApp();
  });

  /**
   * 窗口操作
   */
  ipcListen(WIN_OPERATION, (operation: string) => {
    if (operation === 'min') {
      minimizeWindow();
    } else if (operation === 'max') {
      toggleMaximizeWindow();
    } else if (operation === 'close') {
      mainWindow.close();
    }
  });

  /**
   * 获取屏幕大小
   */
  ipcListen(GET_SCREEN_SIZE, () => {
    return screen ? screen.getPrimaryDisplay().workAreaSize : null;
  });

  /**
   * 展示 dialog
   */
  ipcListen(SHOW_DIALOG, async (data: QjDialog) => {
    const type = data.type;
    if (type === 'error') {
      dialog.showErrorBox(data.errorOptions.title, data.errorOptions.message);
    } else if (type === 'open') {
      return await dialog.showOpenDialog(getMainWindow(), data.openOptions);
    } else if (type === 'save') {
      return await dialog.showSaveDialog(getMainWindow(), data.saveOptions);
    } else {
      return await dialog.showMessageBox(getMainWindow(), data.options);
    }
  });

  /**
   * 右键菜单
   */
  ipcListen(SHOW_CONTEXTUAL_MENU, (items: ReadonlyArray<QjMenuItem>, event: IpcMainEvent) => {
    return new Promise((resolve) => {
      const menu = buildContextMenu(items, (index, item) => {
        resolve({ index, item });
      });
      const window = BrowserWindow.fromWebContents(event.sender);
      menu.popup({ window });
    });
  });

  // 下载文件
  ipcListen(DOWNLOAD_FILE, (data) => {
    if (data.name) {
      __store.set(data.url, data.name);
    }
    const mainWindow = getMainWindow();
    mainWindow && mainWindow.webContents.downloadURL(data.url);
  });

  /**
   * 修改下载目录
   */
  ipcListen(DOWNLOAD_PATH_CHNAGE, async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: '选择文件存放目录',
      properties: ['openDirectory']
    });
    if (canceled) return;
    if (filePaths && filePaths.length) {
      const downloadsPath = filePaths[0];
      // 先更新一下本地缓存
      __store.set(DOWNLOAD_PATH_KEY, downloadsPath);
      // 更新当前的下载目录
      app.setPath('downloads', downloadsPath);
      // 更新下载目录文案
      return downloadsPath;
    }
  });

  /**
   * 获取下载目录
   */
  ipcListen(GET_DOWNLOAD_PATH, async () => {
    return __store.get(DOWNLOAD_PATH_KEY) || app.getPath('downloads');
  });

  // 展示详情页窗口
  ipcListen(WIN_DETAIL_SHOW, (url) => {
    __log('open detail:' + url);
    showDetailWindow(url);
  });

  // 展示视窗页窗口
  ipcListen(WIN_QJSC_SHOW, (url) => {
    __log('open qjsc:' + url);
    showQjscWindow(url).then((win) => {
      win.maximize();
    });
  });

  // 展示大屏窗口
  ipcListen(WIN_SCREEN_SHOW, (url) => {
    __log('open screen:' + url);
    showScreenWindow(url).then((win) => {
      win.maximize();
    });
  });

  /**
   * 刷新
   */
  ipcListen(RELOAD_SCREEN, () => {
    getScreenWindow().webContents.reload();
  });

  /**
   * 获取版本号
   */
  ipcListen(GET_VERSION, () => {
    const oldVersion: any = __store.get('oldVersion') || '';
    let showVersionInfo = false;
    if (oldVersion && gt(appVersion, oldVersion)) {
      showVersionInfo = true;
    }
    return { appVersion, oldVersion, showVersionInfo };
  });

  /**
   * 清理旧版本号
   */
  ipcListen(CLEAN_OLD_VERSION, () => {
    __store.delete('oldVersion');
  });
};

// 详情窗口监听
export const initDetailListener = () => {
  /**
   * 窗口操作
   */
  ipcListen(WIN_DETAIL_OPERATION, (operation: string) => {
    const win = getDetailWindow();
    if (!win) {
      __error('未获取到详情窗口！');
      return;
    }
    if (operation === 'min') {
      minimizeWindow(win);
    } else if (operation === 'max') {
      toggleMaximizeWindow(win);
    } else if (operation === 'close') {
      detailWindow.close();
    }
  });
};
