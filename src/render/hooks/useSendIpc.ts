/**
 * 使用electron 的 ipcRenderer
 */
import { isElectronApp } from '@/utils/electron';
import { MessageBoxOptions, OpenDialogOptions, SaveDialogOptions } from 'electron/main';
import { QjMenuItem } from '../../common/electron';
import {
  CLEAN_OLD_VERSION,
  DOWNLOAD_FILE,
  DOWNLOAD_PATH_CHNAGE,
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
import { useSendIpc, useSendIpcWithReply } from './useIpc';

/**
 * 发送登录消息
 */

export function useSendLogin(protocolData?: string) {
  useSendIpc(LOGIN, protocolData);
}

/**
 * 发送登出消息
 */
export function useSendLogout() {
  useSendIpc(LOGOUT);
}

/**
 * 发送刷新
 */
export function useSendRelaod() {
  if (isElectronApp) {
    useSendIpc(RELOAD);
  } else {
    location.reload();
  }
}

/**
 * 发送打开控制台
 */
export function useSendOpenDevTools() {
  if (isElectronApp) {
    useSendIpc(OPEN_DEV_TOOLS);
  }
}

/**
 * 发送重启消息
 */
export function useSendRelaunchApp() {
  useSendIpc(RELAUNCH);
}

/**
 * 主窗口操作
 * @param operation 操作类型
 */
export function useSendMainWindowOperation(operation: 'max' | 'min' | 'close') {
  useSendIpc(WIN_OPERATION, operation);
}

/**
 * 详情窗口操作
 * @param operation 操作类型
 */
export function useSendDetailWindowOperation(operation: 'max' | 'min' | 'close') {
  useSendIpc(WIN_DETAIL_OPERATION, operation);
}

/**
 * 获取屏幕大小
 * @param hander
 */
export function useSendGetScreenSize(hander?: (result?: any) => void) {
  useSendIpcWithReply(GET_SCREEN_SIZE).then((result) => {
    hander(result);
  });
}

/**
 * Dialog操作
 */
export function useSendMessageDialog(options: MessageBoxOptions, hander?: (result?: any) => void) {
  if (hander) {
    useSendIpcWithReply(SHOW_DIALOG, { type: 'message', options }).then((result) => {
      hander(result);
    });
  } else {
    useSendIpc(SHOW_DIALOG, { type: 'message', options });
  }
}
// 打开
export function useSendOpenDialog(openOptions: OpenDialogOptions, hander: (result?: any) => void) {
  useSendIpcWithReply(SHOW_DIALOG, { type: 'open', openOptions }).then((result) => {
    hander(result);
  });
}
// 保存
export function useSendOpenSave(saveOptions: SaveDialogOptions, hander: (result?: any) => void) {
  useSendIpcWithReply(SHOW_DIALOG, { type: 'save', saveOptions }).then((result) => {
    hander(result);
  });
}
// 错误
export function useSendOpenError(title: string, message: string) {
  useSendIpc(SHOW_DIALOG, { type: 'error', errorOptions: { title, message } });
}

/**
 * 右键菜单
 */
export function useShowContextualMenu(menus: QjMenuItem[]) {
  const sendMenus = [];
  menus.forEach((v) => {
    sendMenus.push({ label: v.label, type: v.type, enabled: v.enabled, role: v.role });
  });
  useSendIpcWithReply(SHOW_CONTEXTUAL_MENU, sendMenus).then((result) => {
    menus[result.index].action && menus[result.index].action();
  });
}

/**
 * 下载文件
 * @param url 下载地址
 * @param name 下载名称
 */
export function useSendDownloadFile(url: string, name = '') {
  if (isElectronApp) {
    useSendIpc(DOWNLOAD_FILE, { url, name });
  } else {
    window.open(url);
  }
}

// 修改下载目录
export function useSendChangeDownloadPath(hander: (result?: any) => void) {
  useSendIpcWithReply(DOWNLOAD_PATH_CHNAGE).then((result) => {
    hander(result);
  });
}

// 获取下载目录
export function useSendDownloadPath(hander: (result?: any) => void) {
  useSendIpcWithReply(GET_DOWNLOAD_PATH).then((result) => {
    hander(result);
  });
}

/**
 * 展示详情窗口
 * @param url 地址
 */
export function useSendShowDetailWindow(url: string) {
  useSendIpc(WIN_DETAIL_SHOW, url);
}

/**
 * 展示详情窗口
 * @param url 地址
 */
export function useSendShowQjscWindow(url: string) {
  useSendIpc(WIN_QJSC_SHOW, url);
}

/**
 * 大屏窗口刷新
 */
export function useSendReloadScreen() {
  if (isElectronApp) {
    useSendIpc(RELOAD_SCREEN);
  } else {
    location.reload();
  }
}
/**
 * 展示大屏窗口
 * @param url 地址
 */
export function useSendShowScreenWindow(url: string) {
  useSendIpc(WIN_SCREEN_SHOW, url);
}

/**
 * 获取版本号
 * @param hander
 */
export function useSendGetVersion(hander?: (result?: any) => void) {
  useSendIpcWithReply(GET_VERSION).then((result) => {
    hander(result);
  });
}

/**
 * 清除旧版本号
 */
export function useSendCleanOldVersion() {
  useSendIpc(CLEAN_OLD_VERSION, '');
}
