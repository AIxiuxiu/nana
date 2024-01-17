declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production';
    readonly PORT: string;
  }
}

interface Window {
  /** 加载动画 */
  appendLoading: () => void;
  /** 关闭预加载动画 */
  removeLoading: () => void;
  /** NodeJs fs */
  fs: typeof import('fs');
  /** Electron */
  electron: typeof import('electron');
  platform: typeof process.platform;
  setZoomFactor: (zoom: number) => void;
  ROP: any; //aodianyun长链接
  AWSC: any;
  nc: any;
  tinymce: any; //tinymce编辑器
}

type Indexable<T> = {
  [index: string]: T;
};

type Nullable<T> = T | null;

type Fn<V> = (...arg: unknown[]) => V;
