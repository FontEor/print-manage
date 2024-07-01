import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

import { router } from './router/index';
import '@/less/index.less';
import './less/index.less';

import App from './App.vue';

function initApp() {
  console.log('router', router.getRoutes());
  const app = createApp(App).use(router).use(ElementPlus, {
    locale: zhCn,
  });
  app.mount('#app');
}

initApp();
