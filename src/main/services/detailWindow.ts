import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { join } from 'path';
import { __log, lgoinWinSize, preloadJs, resourcesPath } from '../global';
import { handWebContents } from './webContents';

export class DetailWindow {
  private window: BrowserWindow;

  public constructor() {
    const windowOptions: BrowserWindowConstructorOptions = {
      width: lgoinWinSize.width,
      height: lgoinWinSize.height,
      minWidth: lgoinWinSize.width,
      minHeight: lgoinWinSize.height,
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
    handWebContents(this.window);
  }

  public getWindow() {
    return this.window;
  }

  public load(url) {
    __log(url);
    this.window.loadURL(url);
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
}
