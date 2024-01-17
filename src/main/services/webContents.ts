import { BrowserWindow } from 'electron';

export const handWebContents = (mainWindow: BrowserWindow): void => {
  mainWindow.webContents.session.webRequest.onHeadersReceived({ urls: ['*://*/*'] }, (d, c) => {
    const resHeadersStr = JSON.stringify(Object.keys(d.responseHeaders));
    const removeHeaders = ['X-Frame-Options', 'Content-Security-Policy']; //在这里把你想要移除的header头部添加上，代码中已经实现了忽略大小了，所以不用担心匹配不到大小写的问题
    removeHeaders.forEach((header) => {
      const regPattern = new RegExp(header, 'ig');
      const matchResult = resHeadersStr.match(regPattern);
      if (matchResult && matchResult.length) {
        matchResult.forEach((i) => {
          delete d.responseHeaders[i];
        });
      }
    });
    c({ cancel: false, responseHeaders: d.responseHeaders });
  });
};
