import { isElectronApp } from '@/utils/electron';
import { ref, unref } from 'vue';

// 复制工具
export function useClipboard(options: any = {}) {
  const copied = ref(false);

  const { navigator = window.navigator, source, copiedDuring = 1500 } = options;

  const isSupported = isElectronApp || Boolean(navigator && 'clipboard' in navigator);

  async function copy(value = unref(source)) {
    if (value != null) {
      if (isElectronApp) {
        window.electron.clipboard.writeText(value);
      } else if (isSupported) {
        await navigator.clipboard.writeText(value);
      } else {
        return;
      }
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, copiedDuring);
    }
  }
  return {
    isSupported,
    copied,
    copy
  };
}
