import { app, BrowserWindow, BrowserWindowConstructorOptions, screen } from 'electron';
import { join } from 'path';
import { __error, indexHtml, indexURL, lgoinWinSize, preloadJs, resourcesPath } from '../global';
import { handWebContents } from './webContents';
import windowState, { WindowState } from './windowState';

export class MainWindow {
  private window: BrowserWindow;
  private savedWindowState: WindowState;
  private resizable = true;

  public constructor() {
    const size = screen ? screen.getPrimaryDisplay().workAreaSize : lgoinWinSize;
    this.savedWindowState = windowState({
      defaultWidth: size.width - 20,
      defaultHeight: size.height - 10
    });

    const windowOptions: BrowserWindowConstructorOptions = {
      width: this.savedWindowState.width,
      height: this.savedWindowState.height,
      minWidth: lgoinWinSize.width - 20,
      minHeight: lgoinWinSize.height - 20,
      show: false,
      frame: false,
      titleBarStyle: 'hidden',
      backgroundColor: '#ffffff',
      icon: join(resourcesPath, 'icon.png'),
      webPreferences: {
        preload: preloadJs,
        contextIsolation: true,
        nodeIntegration: false,
        webSecurity: false,
        nativeWindowOpen: true
      }
    };

    this.window = new BrowserWindow(windowOptions);
    this.window.on('will-resize', (e) => {
      //即使可调整大小的属性为真，也要防止调整大小。
      return !this.resizable && e.preventDefault();
    });
    this.savedWindowState.manage(this.window);
    handWebContents(this.window);
  }

  public getWindow() {
    return this.window;
  }

  public load() {
    // 加载应用的 index.html。
    if (app.isPackaged) {
      // this.window.webContents.openDevTools();
      this.window.loadFile(indexHtml);
    } else {
      this.window.webContents.openDevTools();
      this.window.loadURL(indexURL);
    }
  }

  public onReadyShow(fn: () => void) {
    if (this.window) {
      this.window.once('ready-to-show', () => {
        fn();
      });
    }
  }

  public onFinishLoad(fn: () => void) {
    this.window.webContents.on('did-finish-load', () => {
      fn();
    });
  }

  public onClose(fn: (event) => void) {
    if (this.window) {
      this.window.on('close', fn);
    }
  }

  public close() {
    if (this.window) {
      this.window.close();
      this.window = null;
    }
  }

  public loginWindowSize() {
    if (this.window) {
      this.window.unmaximize();
      this.window.setSize(lgoinWinSize.width, lgoinWinSize.height, true);
      this.window.setMaximizable(false);
      this.resizable = false;
      this.window.center();
    }
  }

  public mainWindowSize() {
    if (this.window) {
      try {
        const size = screen.getPrimaryDisplay().workAreaSize;
        this.window.unmaximize();
        this.window.setSize(Math.floor(size.width * 0.9), Math.floor(size.height * 0.9), true);
        this.window.setMaximizable(true);
        this.resizable = true;
        this.window.center();
      } catch (error) {
        __error(error);
      }
    }
  }
}
