import { BrowserWindow } from 'electron';
import { __log, isWin } from '../global';
import { DetailWindow } from './detailWindow';
import { MainWindow } from './mainWindow';
import { QjscWindow } from './qjscWindow';
import { ScreenWindow } from './screenWindow';

export let mainWindow: MainWindow;
export let detailWindow: DetailWindow;
export let qjscWindow: QjscWindow;
export let screenWindow: ScreenWindow;

export function getMainWindow(): BrowserWindow {
  if (mainWindow) {
    return mainWindow.getWindow();
  }
}

export function getDetailWindow(): BrowserWindow {
  if (detailWindow) {
    return detailWindow.getWindow();
  }
}

export function getQjscWindow(): BrowserWindow {
  if (qjscWindow) {
    return qjscWindow.getWindow();
  }
}

export function getScreenWindow(): BrowserWindow {
  if (screenWindow) {
    return screenWindow.getWindow();
  }
}
/**
 * 创建主窗口
 */
export const createMainWindow = (): Promise<BrowserWindow> => {
  return new Promise((resolve, reject) => {
    if (mainWindow && mainWindow.getWindow()) {
      reject();
      return;
    }
    mainWindow = new MainWindow();
    mainWindow.onReadyShow(() => {
      mainWindow.getWindow().show();
    });

    mainWindow.onFinishLoad(() => {
      if (mainWindow) {
        resolve(mainWindow.getWindow());
      }
    });

    mainWindow.onClose(() => {
      mainWindow = null;
      reject();
    });
    mainWindow.load();
  });
};

/**
 * 展示主窗口
 */
export const showMainWindow = (): Promise<BrowserWindow> => {
  const win = getMainWindow();
  if (win) {
    return new Promise((resolve, reject) => {
      try {
        if (isWin) {
          win.setSkipTaskbar(false);
        }
        focusWindow();
        resolve(win);
      } catch (error) {
        reject(error);
      }
    });
  } else {
    return createMainWindow();
  }
};

/**
 * 创建详情窗口
 */
export const createDetailWindow = (url): Promise<BrowserWindow> => {
  __log('createDetailWindow', url);
  return new Promise((resolve, reject) => {
    if (detailWindow) {
      reject();
      return;
    }
    detailWindow = new DetailWindow();
    detailWindow.onReadyShow(() => {
      detailWindow.getWindow().show();
    });

    detailWindow.onFinishLoad(() => {
      if (detailWindow) {
        resolve(detailWindow.getWindow());
      }
    });

    detailWindow.onClose(() => {
      detailWindow = null;
      reject();
    });
    detailWindow.load(url);
  });
};

/**
 * 展示详情窗口
 */
export const showDetailWindow = (url): Promise<BrowserWindow> => {
  const win = getDetailWindow();
  __log('showDetailWindow', win);
  if (win) {
    return new Promise((resolve) => {
      if (isWin) {
        win.setSkipTaskbar(false);
      }
      win.loadURL(url);
      __log('loadURL', url);
      focusWindow(win);
      resolve(win);
    });
  } else {
    return createDetailWindow(url);
  }
};

/**
 * 创建详情窗口
 */
export const createQjscWindow = (url): Promise<BrowserWindow> => {
  __log('createQjscWindow', url);
  return new Promise((resolve, reject) => {
    if (qjscWindow) {
      reject();
      return;
    }
    qjscWindow = new QjscWindow();
    qjscWindow.onReadyShow(() => {
      qjscWindow.getWindow().show();
    });

    qjscWindow.onFinishLoad(() => {
      if (qjscWindow) {
        resolve(qjscWindow.getWindow());
      }
    });

    qjscWindow.onClose(() => {
      qjscWindow = null;
      reject();
    });
    qjscWindow.load(url);
  });
};

/**
 * 展示详情窗口
 */
export const showQjscWindow = (url): Promise<BrowserWindow> => {
  const win = getQjscWindow();
  __log('showQjscWindow', win);
  if (win) {
    return new Promise((resolve) => {
      if (isWin) {
        win.setSkipTaskbar(false);
      }
      win.loadURL(url);
      __log('loadURL', url);
      focusWindow(win);
      resolve(win);
    });
  } else {
    return createQjscWindow(url);
  }
};

/**
 * 创建大屏窗口
 */
export const createScreenWindow = (url): Promise<BrowserWindow> => {
  __log('createScreenWindow', url);
  return new Promise((resolve, reject) => {
    if (screenWindow) {
      reject();
      return;
    }
    screenWindow = new ScreenWindow();
    screenWindow.onReadyShow(() => {
      screenWindow.getWindow().show();
    });

    screenWindow.onFinishLoad(() => {
      if (screenWindow) {
        resolve(screenWindow.getWindow());
      }
    });

    screenWindow.onClose(() => {
      screenWindow = null;
      reject();
    });
    screenWindow.load(url);
  });
};

/**
 * 展示详情窗口
 */
export const showScreenWindow = (url): Promise<BrowserWindow> => {
  const win = getScreenWindow();
  __log('showScreenWindow', win);
  if (win) {
    return new Promise((resolve) => {
      if (isWin) {
        win.setSkipTaskbar(false);
      }
      win.loadURL(url);
      __log('loadURL', url);
      focusWindow(win);
      resolve(win);
    });
  } else {
    return createScreenWindow(url);
  }
};

/**
 * 隐藏窗口
 */
export const hideWindow = (win?: BrowserWindow) => {
  if (!win) {
    win = getMainWindow();
  }
  if (win) {
    win.close;
    if (isWin) {
      win.setSkipTaskbar(true);
    }
  }
};

export const focusWindow = (win?: BrowserWindow) => {
  if (!win) {
    win = getMainWindow();
  }
  if (win) {
    win.show();
    if (win.isMinimized()) {
      win.restore();
    }
    win.focus();
  }
};

// 最大化
export const toggleMaximizeWindow = (win?: BrowserWindow) => {
  if (!win) {
    win = getMainWindow();
  }
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
};

// 最小化
export const minimizeWindow = (win?: BrowserWindow) => {
  if (!win) {
    win = getMainWindow();
  }
  if (win) {
    win.minimize();
  }
};
