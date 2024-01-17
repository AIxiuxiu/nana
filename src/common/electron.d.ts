export interface QjMenuItem {
  label?: string;
  action?: () => void;
  type?: 'separator';
  accelerator?: string;
  enabled?: boolean;
  role?: Electron.MenuItemConstructorOptions['role'];
}

export interface QjDialog {
  type?: 'error' | 'open' | 'save' | 'message';
  errorOptions?: { title?: string; message?: string };
  openOptions?: Electron.OpenDialogOptions;
  saveOptions?: Electron.SaveDialogOptions;
  options?: Electron.MessageBoxOptions;
}
