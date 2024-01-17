import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { join } from 'path';
import { __log, lgoinWinSize, resourcesPath } from '../global';
import { handWebContents } from './webContents';

export class QjscWindow {
  private window: BrowserWindow;

  public constructor() {
    const windowOptions: BrowserWindowConstructorOptions = {
      width: 1090,
      height: 800,
      minWidth: lgoinWinSize.width,
      minHeight: lgoinWinSize.height,
      show: false,
      frame: true,
      backgroundColor: '#ffffff',
      icon: join(resourcesPath, 'scicon.png'),
      webPreferences: {
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
