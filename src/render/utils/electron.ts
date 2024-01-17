import { getOS } from './browser';

export const isElectronApp = !!window.navigator.userAgent.match(/electron\/(\d+\.\d+\.\d+)/i);

export const isMacOS: boolean = isElectronApp ? window.platform === 'darwin' : getOS() === 'Mac OS';

export const isWindows: boolean = isElectronApp ? window.platform === 'win32' : getOS() === 'Windows';

export const electronVersion = isElectronApp ? /electron\/(\d+\.\d+\.\d+)/i.exec(navigator.userAgent)[1] : '';

const getElectron = () => {
  if (window && window.electron && isElectronApp) {
    return window.electron;
  }
  return new QjElectron();
};

class QjElectron {
  ipcRenderer: QjIpcRenderer = new QjIpcRenderer();
  shell: QjShell = new QjShell();
}

class QjIpcRenderer {
  on(channel: string, listener: (event: any, ...args: any[]) => void) {
    console.log('IpcRenderer on:' + channel);
  }

  once(channel: string, listener: (event: any, ...args: any[]) => void) {
    console.log('IpcRenderer once:' + channel);
  }

  send(channel: string, ...args: any[]) {
    console.log('IpcRenderer send:' + channel);
  }

  removeAllListeners(channel: string) {
    console.log('IpcRenderer removeAllListeners:' + channel);
  }

  removeListener(channel: string, listener?: () => void) {
    console.log('IpcRenderer removeListener:' + channel);
  }
}

class QjShell {
  openExternal(url: string, options?: Electron.OpenExternalOptions): Promise<void> {
    return new Promise((resolve) => {
      console.log('Shell openExternal:' + url);
      window.open(url);
      resolve();
    });
  }
  showItemInFolder(path) {
    console.log('Shell showItemInFolder:' + path);
  }
  openPath(path) {
    console.log('Shell openPath:' + path);
  }
}

export const electron = getElectron();
