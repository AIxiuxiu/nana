import { ipcMain, IpcMainEvent, WebContents } from 'electron';

/**
 * 监听单次事件
 * @param eventName
 * @param handler
 */
export const ipcOnceListen = (eventName: string, handler: (data?: any, event?: IpcMainEvent) => void) => {
  ipcMain.once(eventName, async (event: IpcMainEvent, request: { id: string; data: any; noResponse?: boolean }) => {
    listenHander(eventName, handler, event, request);
  });
};

/**
 * 监听事件
 * @param eventName
 * @param handler
 */
export const ipcListen = (eventName: string, handler: (data?: any, event?: IpcMainEvent) => void) => {
  ipcMain.on(eventName, async (event: IpcMainEvent, request: { id: string; data: any; noResponse?: boolean }) => {
    listenHander(eventName, handler, event, request);
  });
};

/**
 * 长监听
 * @param eventName
 */
export const ipcLongListen = (eventName: string): Promise<LongEventServer> => {
  return new Promise((resolve, reject) => {
    ipcMain.on(eventName, (event: IpcMainEvent, args) => {
      const { id, data } = args;
      const server = new LongEventServer({
        eventName,
        id,
        data,
        sender: event.sender
      });

      ipcMain.once(server.disconnectEvent(), () => {
        reject(new Error(`${eventName} disconnect`));
      });
      resolve(server);
    });
  });
};

const listenHander = async (
  eventName: string,
  handler: (data?: any, event?: IpcMainEvent) => void,
  event: IpcMainEvent,
  request: { id: string; data: any; noResponse?: boolean }
) => {
  const { id, data, noResponse } = request;
  const response: { code: number; data?: any } = { code: 200 };
  try {
    response.data = await handler(data, event);
  } catch (err) {
    response.code = err.code || 500;
    response.data = {
      message: err.message || `Main thread error with ${eventName}`
    };
  }
  if (!noResponse) {
    event.sender.send(`${eventName}_res_${id}`, response);
  }
};

class LongEventServer {
  data: any;
  private eventName: string;
  private id: string;
  private sender: WebContents;

  constructor({ eventName, id, data, sender }) {
    this.eventName = eventName;
    this.id = id;
    this.data = data;
    this.sender = sender;
  }

  _getEventName(event): string {
    return `${this.eventName}_${this.id}_${event}`;
  }

  disconnectEvent(): string {
    return this._getEventName('disconnect');
  }

  /**
   * 发送事件
   * @param event
   * @param data
   */
  emit(event: string, data?: any) {
    this.sender.send(this._getEventName(event), data);
  }
}
