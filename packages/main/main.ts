import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { router } from './router';
import './less/index.less';
import App from './App.vue';
import store, { key } from './store';
import permissionsDirectives from './directives/permissions';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import getMenus from './menus';
// const app = createApp(App);

// document.domain = import.meta.env.VITE_APP_CROSS_DOMAIN as string;
zhCn.el.pagination.total = '共{total}条记录';
zhCn.el.pagination.goto = '跳转';
function initApp() {
  const app = createApp(App).use(store, key).use(router).use(ElementPlus, {
    locale: zhCn,
  });
  // 改成按需引入
  // 注册图标
  // eslint-disable-next-line prefer-const
  for (let [key, component] of Object.entries(ElementPlusIconsVue)) {
    if (key === 'Menu') {
      key = 'IconMenu';
    }
    app.component(key, component);
  }
  permissionsDirectives(app);
  app.mount('#app');
}

getMenus().then(() => {
  initApp();
});
