import { electron, isElectronApp } from '@/utils/electron';

/**
 * 使用 electron
 * @param onElectron electron环境的回调
 * @param noElectron 不是electron的回调
 * @returns shell
 */
export default function useElectron(onElectron?: (version: string) => any, noElectron?: () => any) {
  if (isElectronApp) {
    onElectron && onElectron(/electron\/(\d+\.\d+\.\d+)/i.exec(navigator.userAgent)[1]);
  } else {
    noElectron && noElectron();
  }
  return { shell: electron.shell };
}
