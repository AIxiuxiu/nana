/**
 * 主进程、渲染进程公用事件常量
 */

/** 退出 */
export const LOGOUT = '@event/logout';

/** 登录 */
export const LOGIN = '@event/login';

/** 刷新 */
export const RELOAD = '@event/reload';

/** 重启 */
export const RELAUNCH = '@event/relaunch';

/** 窗口操作 */
export const WIN_OPERATION = '@event/window-operation';

/** 获取窗口大小 */
export const GET_SCREEN_SIZE = '@event/get-screen-size';

/** 展示 dialog */
export const SHOW_DIALOG = '@event/show-dialog';

/** 右键菜单 */
export const SHOW_CONTEXTUAL_MENU = '@event/show-contextual-menu';

/** 获取版本号 */
export const GET_VERSION = '@event/get-version';

/** 清除旧版本号 */
export const CLEAN_OLD_VERSION = '@event/clean-old-version';

/** 下载文件 */
export const DOWNLOAD_FILE = '@event/download-file';
export const DOWNLOAD_PATH_CHNAGE = '@event/downloads-path-change';
export const GET_DOWNLOAD_PATH = '@event/get-downloads-path';
export const DOWNLOAD_PATH_KEY = '@key/downloads-path';

export const FILES_MANAGE = {
  willDownload: '@event/will-download-file',
  pause: '@event/pause-downloads-progress',
  resume: '@event/resume-downloads-progress',
  cancel: '@event/cancel-downloads-progress',
  update: '@event/update-downloads-progress',
  complete: '@event/complete-downloads-progress'
};

export const UPDATER = {
  updateMessage: '@event/update-message',
  updateNow: '@event/update-now',
  updateCheck: '@event/update-check',
  hotCheck: '@event/hot-check',
  hotUpdate: '@event/hot-update',
  hotUpdateing: '@event/hot-updateing',
  hotUpdateError: '@event/hot-update-error',
  hotNoUpdate: '@event/hot-no-update',
  hotRestart: '@event/hot-restart',
  hotUpdateProgress: '@event/hot-update-progress'
};

// 详情监听
/** 窗口操作 */
export const WIN_DETAIL_OPERATION = '@event/detail-window-operation';

export const WIN_DETAIL_SHOW = '@event/detail-window-show';

export const WIN_QJSC_SHOW = '@event/qjsc-window-show';

export const WIN_SCREEN_SHOW = '@event/screen-window-show';

export const RELOAD_SCREEN = '@event/reload-screen';

/** 打开控制台 */
export const OPEN_DEV_TOOLS = '@event/openDevTools';

/** 微信code */
export const WX_CODE_RUL = '@event/wx-code';
