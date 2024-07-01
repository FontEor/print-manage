import { ElMessage } from 'element-plus';

export namespace Broadcast {
  export type Types = 'refreshList' | 'refreshVersion' | 'refreshTemplateList';
  export interface Data {
    type: Types;
  }
}

class Broadcast {
  channel?: BroadcastChannel;
  map: Map<Broadcast.Types, Set<Function>> = new Map();
  constructor() {
    try {
      this.restore();
    } catch (error) {
      this.onMessageError();
    }
  }
  addListener(type: Broadcast.Types = 'refreshList', fn: Function) {
    const queue = this.map.get(type) || new Set();
    queue.add(fn);
    if (!this.map.get(type)) {
      this.map.set(type, queue);
    }
  }
  removeListener(type: Broadcast.Types = 'refreshList', fn: Function) {
    this.map.get(type)?.delete(fn);
  }
  postMessage(data = { type: 'refreshList' }) {
    this.channel && this.channel.postMessage(data);
  }
  onMessage(event: MessageEvent) {
    const type = event.data.type || '';
    const queue = this.map.get(type) || [];
    queue.forEach((fn) => {
      fn(event.data);
    });
  }
  onMessageError() {
    ElMessage.warning('通信建立失败, 保存后请自行刷新列表页面');
  }
  close() {
    this.channel && this.channel.close();
  }
  restore() {
    this.map.clear();
    this.channel = new BroadcastChannel('print-template-design');
    this.channel.addEventListener('message', this.onMessage.bind(this));
    this.channel.addEventListener('messageerror', this.onMessageError.bind(this));
  }
  destroy() {
    if (this.channel) {
      this.channel.removeEventListener('message', this.onMessage);
      this.channel.removeEventListener('messageerror', this.onMessageError);
      this.close();
      this.channel = undefined;
    }
    this.map.clear();
  }
}

const instance = new Broadcast();
export default instance;
