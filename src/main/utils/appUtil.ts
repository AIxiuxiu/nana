import { app, BrowserWindow } from 'electron';

/**
 * 退出
 */
export const appQuit = () => {
  app.quit();
};

/**
 * 重启 app
 */
export const relaunchApp = () => {
  app.relaunch();
  app.exit();
};

/**
 * 重新打开窗口
 * @param window
 */
export const reloadWindow = (window: BrowserWindow) => {
  if (window.isDestroyed()) {
    relaunchApp();
  } else {
    BrowserWindow.getAllWindows().forEach((w) => {
      if (w.id !== window.id) {
        w.destroy();
      }
    });
    window.reload();
  }
};

export const getFileIcon = async (path: string): Promise<string> => {
  try {
    if (!path) return '';
    const icon = await app.getFileIcon(path, {
      size: 'normal'
    });
    return icon.toDataURL();
  } catch (error) {
    return '';
  }
};

const MimeType = {
  'application/msword': 'doc',
  'application/vnd.ms-excel': 'xls',
  'application/msexcel': 'xls',
  'application/pdf': 'pdf',
  'application/json': 'json',
  'application/javascript': 'js',
  'application/x-download': 'zip'
};

export const getMimeType = (mime: string): string => {
  return MimeType[mime] ? MimeType[mime] : '';
};
