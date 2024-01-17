/**
 * 使用electron 的 ipcRenderer
 */
import { electron } from '@/utils/electron';
import { generate } from 'shortid';

/**
 * renderer 接收事件 尽量少使用
 * @param eventName 事件名称
 * @param handler 回调
 */
export const useOnIpc = (eventName: string, handler: (response?: any) => void) => {
  electron.ipcRenderer.on(eventName, (event, response) => {
    handler(response);
  });
};

/**
 * renderer 发送ipc事件，无需返回
 * @param eventName 事件名
 * @param data 发送数据
 */
export const useSendIpc = (eventName: string, data?: any) => {
  electron.ipcRenderer.send(eventName, { id: '-1', data, noResponse: true });
};

/**
 * renderer 发送ipc事件
 * @param eventName 事件名
 * @param data 发送数据
 */
export const useSendIpcWithReply = (eventName: string, data?: any): Promise<any> => {
  const id = generate();
  const responseEvent = `${eventName}_res_${id}`;
  return new Promise((resolve, reject) => {
    electron.ipcRenderer.once(responseEvent, (event, response: { code: number; data: any }) => {
      if (response.code === 200) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    });
    electron.ipcRenderer.send(eventName, { id, data });
  });
};

/**
 * 注销监听
 * @param eventName
 * @param handler
 */
export const useRemoveIpc = (eventName: string, handler: (response?: any) => void) => {
  electron.ipcRenderer.removeListener(eventName, handler);
};

/**
 * 注销监听
 * @param eventName
 * @param handler
 */
export const useRemoveAllIpc = (eventName: string) => {
  electron.ipcRenderer.removeAllListeners(eventName);
};

/**
 * renderer 发送ipc长事件
 * @param eventName 事件名
 * @param data 发送数据
 */
export const useSendLongIpc = (eventName: string, data?: any): LongEventClient => {
  const client = new LongEventClient(eventName, data);
  client.connect();
  return client;
};

// 长事件类型
export class LongEventClient {
  id = generate();
  eventName: string;
  data: any;
  events = new Map();

  constructor(eventName: string, data?: any) {
    this.eventName = eventName;
    this.data = data;
  }

  _getEventName(event: string) {
    return `${this.eventName}_${this.id}_${event}`;
  }

  connect(): LongEventClient {
    electron.ipcRenderer.send(this.eventName, { id: this.id, data: this.data });
    return this;
  }

  /**
   * 关闭长连接
   */
  disconnect() {
    electron.ipcRenderer.send(this._getEventName('disconnect'));
    this.clearEvents();
  }

  /**
   *  监听事件
   * @param event
   * @param handler
   */
  on(event, handler: (response?: any) => void): (e, response) => void {
    const count = this.events.get(event);
    if (!count) {
      this.events.set(event, 1);
    } else {
      this.events.set(event, count + 1);
    }

    const listener = (e, response) => handler(response);
    electron.ipcRenderer.on(this._getEventName(event), listener);
    return listener;
  }

  removeListener(event: string, listener) {
    let count = this.events.get(event);
    if (!count) {
      return;
    }
    count -= 1;
    if (count === 0) {
      this.events.delete(event);
    }

    electron.ipcRenderer.removeListener(this._getEventName(event), listener);
  }

  removeAllListener(event: string) {
    this.events.delete(event);
    electron.ipcRenderer.removeAllListeners(this._getEventName(event));
  }

  clearEvents() {
    this.events.forEach((k, event) => this.removeAllListener(event));
  }
}
