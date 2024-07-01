declare namespace CustomAxios {
  export interface ApiOption {
    key: string;
    url: string;
    method: 'get' | 'post' | 'put' | 'delete';
  }
}
