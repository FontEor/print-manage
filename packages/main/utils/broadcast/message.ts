import shortid from 'shortid';

export namespace BroadcastMessage {
  export interface Data {
    type: 'refreshList';
  }
  export type unkownFn = (value: any) => void;
  export type resolve = (value: object | string) => void;
  export type reject = (reason: object | string) => void;
  export type MessageMapValues = [resolve, reject];
  export type MessageMap = Map<string, MessageMapValues>;

  export type types =
    | 'create-template'
    | 'relation-template'
    | 'save-template'
    | 'login-failed'
    | 'login-failed-editor'
    | 'close';
  export interface MessageData<T> {
    id: string;
    type: types;
    data: T;
    success: boolean;
    message?: string;
  }
  export type Event = MessageEvent<MessageData<any>>;
  export interface SendMessageArgs {
    type: types;
    data: any;
  }
  export type MessageDataT = {
    templateCode: string;
    tempId: string | number;
    tempType: number;
    customId?: string | number;
  };
  export type StandardMessageData = MessageData<MessageDataT>;
}

/**
 * worker 通信类
 */
class BroadcastMessage {
  map: BroadcastMessage.MessageMap;
  constructor() {
    this.map = new Map();
    window.removeEventListener('message', this.onListener.bind(this));
    window.addEventListener('message', this.onListener.bind(this));
  }
  unkownFn(data: any, type: number): void {
    switch (type) {
      case 1:
        console.log('未知的数据类型', data);
        break;
      case 2:
        console.log('未知的数据ID', data);
        break;
      default:
        break;
    }
  }
  onListener(e: BroadcastMessage.Event): void {
    const data = e.data;
    if (data.type) {
      const callbacks = this.map.get(data.id);
      this.map.delete(data.id);
      if (callbacks && callbacks.length) {
        const [resolve, reject] = callbacks;
        if (data.success) {
          return resolve(data);
        } else {
          return reject({ message: data.message });
        }
      } else {
        this.unkownFn(data, 2);
      }
    } else {
      this.unkownFn(data, 1);
    }
  }
  /**
   * 发送postmessage数据
   * @param type 类型
   * @param data 数据
   * @param otherWindow 其他窗口
   * @returns
   */
  sendMessage(data: BroadcastMessage.SendMessageArgs, otherWindow?: Window): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = shortid.generate();
      const messageData: BroadcastMessage.MessageData<BroadcastMessage.SendMessageArgs> = {
        id,
        data: data.data,
        type: data.type,
        success: true,
        message: '',
      };
      (otherWindow || window.parent).postMessage(messageData, '*');
      this.map.set(id, [resolve, reject]);
    });
  }
}

export default new BroadcastMessage();
