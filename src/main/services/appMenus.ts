import { app, BrowserWindow, Menu, MenuItemConstructorOptions, shell } from 'electron';
import { appName, isMacOS } from '../global';
import { appQuit } from '../utils/appUtil';

/**
 * Build the main menu of our app.
 */
export const createAppMenu = () => {
  const editMenu: MenuItemConstructorOptions = {
    label: '编辑',
    submenu: [
      {
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: '重做',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll'
      }
    ]
  };

  const viewMenu: MenuItemConstructorOptions = {
    label: '查看',
    submenu: [
      {
        label: '重载',
        accelerator: 'CmdOrCtrl+R',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            // 重载之后, 刷新并关闭所有的次要窗体
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach((win) => {
                if (win.id > 1) {
                  win.close();
                }
              });
            }
            focusedWindow.reload();
          }
        },
        visible: !app.isPackaged
      },
      {
        label: '切换开发者工具',
        accelerator: (() => {
          return isMacOS ? 'Alt+Command+I' : 'Ctrl+Shift+I';
        })(),
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.webContents.toggleDevTools();
          }
        },
        visible: !app.isPackaged
      },
      {
        label: '切换全屏',
        accelerator: (() => {
          return isMacOS ? 'Ctrl+Command+F' : 'F11';
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        }
      }
    ]
  };

  const windowMenu: MenuItemConstructorOptions = {
    label: '窗口',
    role: 'window',
    submenu: [
      {
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
      {
        label: '缩放',
        role: 'zoom'
      },
      {
        type: 'separator'
      },
      {
        label: '全部置于顶层',
        role: 'front'
      }
    ]
  };

  const helpMenu: MenuItemConstructorOptions = {
    label: '帮助',
    submenu: [
      {
        label: '安娜网',
        click: () => {
          shell.openExternal('https://www.nana.net');
        }
      }
    ]
  };

  const macOsMenu: MenuItemConstructorOptions = {
    label: appName,
    submenu: [
      {
        label: `关于 ${appName}`,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: '服务',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: `隐藏 ${appName}`,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: '隐藏其它',
        accelerator: 'Command+Alt+H',
        role: 'hideOthers'
      },
      {
        label: '显示全部',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: '退出',
        accelerator: 'Command+Q',
        click: () => {
          appQuit();
        }
      }
    ]
  };

  const template: MenuItemConstructorOptions[] = [editMenu, viewMenu, windowMenu, helpMenu];

  if (appName) {
    template.unshift(macOsMenu);
  }

  const menu = Menu.buildFromTemplate(template);
  if (isMacOS) {
    Menu.setApplicationMenu(menu);
  } else {
    // window 删除菜单
    Menu.setApplicationMenu(null);
  }
};
