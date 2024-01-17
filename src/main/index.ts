import * as Sentry from '@sentry/electron/main';
import { app, crashReporter, dialog, session, shell } from 'electron';
import contextMenu from 'electron-context-menu';
import { MessageBoxReturnValue } from 'electron/main';
import { WX_CODE_RUL } from '../common/event';
import { __error, __log, appEnName, appId, appName, appVersion, isWin, logPath } from './global';
import { initDetailListener, initMainListener } from './services/appListeners';
import { createAppMenu } from './services/appMenus';
import { getMainWindow, showMainWindow } from './services/appWindow';
import { onWillDownload } from './services/download';
import { hotUpdateBeforeClose, hotUpdater } from './services/hotUpdater';
import { updateHandle } from './services/updater';
import { appQuit, reloadWindow } from './utils/appUtil';

// 故障报告
Sentry.init({
  dsn: 'https://46b7574c01974d26ad7e3f5f96bce05a@o166642.ingest.sentry.io/6408852',
  debug: false,
  sampleRate: 1.0,
  release: appVersion,
  maxBreadcrumbs: 30,
  environment: process.env.VITE_APP_STORE_PREFIX,
  ignoreErrors: [
    // GPU错误
    'Fatal Error: EXCEPTION_ACCESS_VIOLATION_READ',
    'Fatal Error: EXCEPTION_ACCESS_VIOLATION_WRITE',
    // dl.nana.net 无法请求，DNS和TLS证书问题
    'getaddrinfo ENOTFOUND',
    'net::ERR_NAME_NOT_RESOLVED',
    'net::ERR_CERT_AUTHORITY_INVALID',
    'Error: read ECONNRESET',
    'unsupported certificate purpose',
    'Hostname/IP does not match certificate',
    'Client network socket disconnected before secure TLS connection was established'
  ]
});

crashReporter.start({
  companyName: '安娜网',
  productName: appName,
  ignoreSystemCrashHandler: true,
  submitURL: 'https://o166642.ingest.sentry.io/api/6408852/minidump/?sentry_key=46b7574c01974d26ad7e3f5f96bce05a'
});
// 取消安全策略 ，bug pdf黑屏
// app.commandLine.appendSwitch('disable-site-isolation-trials');
// 禁用缓存
// app.commandLine.appendSwitch('--disable-http-cache');
// 禁用同源策略
app.commandLine.appendSwitch('disable-web-security');
// 版本问题，可能需要加入该配置关闭跨域问题
// app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

app.commandLine.appendSwitch('lang', 'zh-CN');
// window必须有appId
if (isWin && app.isPackaged) {
  app.setAppUserModelId(appId);
}
app.setName(appName);

contextMenu({
  prepend: (defaultActions, params, browserWindow) => [
    {
      label: '刷新',
      role: 'reload'
    }
  ],
  showLookUpSelection: false,
  showSearchWithGoogle: false,
  showCopyImageAddress: false,
  showCopyImage: true,
  showSaveImage: true,
  showSaveLinkAs: false,
  showInspectElement: true,
  showServices: false,
  labels: {
    cut: '剪切',
    copy: '复制',
    paste: '粘贴',
    saveImage: '保存图片',
    saveImageAs: '图片另存为...',
    copyLink: '复制链接',
    copyImage: '复制图片',
    copyImageAddress: '复制图片地址',
    inspect: '检查元素',
    searchWithGoogle: '使用谷歌搜索'
  }
});

const appReady = () => {
  // 创建窗口
  showMainWindow().then((window) => {
    // 下载管理
    onWillDownload();
    // 更新程序
    hotUpdater();
    updateHandle();
  });

  /*创建electron的菜单栏*/
  createAppMenu();

  // ipc通讯
  initMainListener();
  initDetailListener();

  _handleAfterReady();

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    if (details.url.indexOf('sjzd.cninfo.com.cn') == -1) {
      details.requestHeaders['User-Agent'] = `${session.defaultSession.getUserAgent()} ${appEnName}/${appVersion}`;
    }
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
};

try {
  // 保证只有一个实例程序
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  } else {
    // Electron 会在初始化后并准备
    app.whenReady().then(() => appReady());

    // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      showMainWindow().then((win) => {
        // Windows 下通过协议URL启动时，URL会作为参数，所以需要在这个事件里处理
        if (process.platform === 'win32') {
          const commands = commandLine.slice();
          const urlStr = decodeURI(commands.pop());
          // const urlStr = process.argv.splice(app.isPackaged ? 1 : 2).join('');
          __log('window open-url' + urlStr);
          if (urlStr && urlStr.startsWith('nanaqjkhdg://')) {
            // 协议打开
          }
        }
      });
    });
    // Mac
    app.on('open-url', (event, urlStr) => {
      __log('mac open-url' + urlStr);
      showMainWindow().then((win) => {
        // 协议打开
      });
    });

    // 当全部窗口关闭时退出。
    app.on('window-all-closed', () => {
      // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
      if (isWin) {
        appQuit();
      }
    });

    app.on('will-quit', async (e) => {
      console.log('[app] will-quit');
      e.preventDefault();
      await hotUpdateBeforeClose();
      app.exit();
    });

    app.on('activate', () => {
      // 在macOS上，当单击dock图标并且没有其他窗口打开时，
      // 通常在应用程序中重新创建一个窗口。
      showMainWindow()
        .then(() => {})
        .catch((err) => __log(err));
    });

    app.on('web-contents-created', (createEvent, contents) => {
      contents.on('render-process-gone', (e, details) => {
        __error('render-process-gone');
        __error(e);
        __error(details);
        if (details.reason == 'crashed') {
          const options = {
            type: 'error',
            title: '进程崩溃了',
            message: '这个进程已经崩溃.',
            buttons: ['重载', '查看日志', '退出']
          };
          const window = getMainWindow();
          dialog.showMessageBox(window, options).then((result: MessageBoxReturnValue) => {
            if (result.response === 0) {
              if (window) {
                window.webContents.session.clearStorageData();
              }
              reloadWindow(window);
            } else if (result.response === 1) {
              shell.showItemInFolder(logPath);
            } else {
              appQuit();
            }
          });
        }
      });
      // 处理a链接跳转
      contents.on('will-navigate', (e, url) => {
        __log("Blocked by 'new-window'" + url);
        if (url.startsWith('file://') || url.includes('//sc.nana.net')) {
          return true;
        }
        e.preventDefault();
        if (url.startsWith(process.env.VITE_APP_WX_REDIRECT_URL)) {
          const mainWindow = getMainWindow();
          mainWindow && mainWindow.webContents.send(WX_CODE_RUL, url);
        } else {
          shell.openExternal(url);
        }
      });
      // 阻止 window.open 打开新窗口
      contents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('file://') || url.startsWith('http://localhost') || url.includes('//sc.nana.net')) {
          return {
            action: 'allow',
            overrideBrowserWindowOptions: {
              width: 1130,
              height: 800,
              frame: true,
              backgroundColor: '#ffffff',
              webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                webSecurity: false,
                nativeWindowOpen: true
              }
            }
          };
        } else {
          setImmediate(() => {
            shell.openExternal(url);
          });
          __log("Blocked by 'setWindowOpenHandler'" + url);
          return { action: 'deny' };
        }
      });
    });
  }
} catch (error) {
  __error(`app start error: [${error}]`);
}

// 当应用启动完成后，主动判断应用是否是从网页中调起
const _handleAfterReady = () => {
  // windows如果是通过url schema启动则发出时间处理
  // 启动参数超过1个才可能是通过url schema启动
  if (process.argv.length > 1) {
    if (!app.isReady()) {
      app.once('browser-window-created', () => {
        // app 未打开时，通过 open-url打开 app，此时可能还没 ready，需要延迟发送事件
        // 此段ready延迟无法触发 service/app/ open-url 处理，因为saga初始化需要时间
        app.emit('second-instance', null, process.argv);
      });
    } else {
      app.emit('second-instance', null, process.argv);
    }
  }
};

// node 崩溃日志
process.on('uncaughtException', (error: Error) => {
  __error(`app uncaughtException: [${error.stack || JSON.stringify(error)}]`);
});
