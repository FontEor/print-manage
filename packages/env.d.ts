/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
interface ImportMetaEnv {
  VITE_APP_TITLE: string;
  VITE_APP_HOST: string;
  VITE_APP_AXIOS_PREFIX: string;
  VITE_APP_AXIOS_PREFIX_PLUGIN: string;
  VITE_APP_DOWNLOAD_PRE: string;
  VITE_APP_TEMPLATE_CONTENT: string;
  VITE_APP_CONTENT_DOMAIN: string;
  VITE_APP_LOGIN: string;
  VITE_APP_LOGOUT: string;
  VITE_APP_CROSS_DOMAIN: string;
  VITE_APP_EDITOR_PREFIX: string;
  // 更多环境变量...
}
interface ImportMeta {
  env: ImportMetaEnv;
}

interface Window {
  VITE_APP_ERP: string;
}

declare module '*.png';
