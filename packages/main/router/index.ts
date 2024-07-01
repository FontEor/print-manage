import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import routerInterceptor from './router.interceptor';

import { singlePageRouter } from '@/router/single-page.router';
import { templateRouters } from './template.router';
import { operationRouter } from '@/router/operation.router';
import { systemRouter as oldSystemRouter } from '@/router/old/system.router';
import { templateRouter as oldTemplateRouters } from '@/router/old/template.router';
import { customRouter as oldCustomRouters } from '@/router/old/custom.router';
import { pluginRouter as oldPluginRouter } from '@/router/old/plugin.router';
import { logsRouter as oldLogsRouter } from '@/router/old/logs.router';
import { bluetoothRouter as oldBluetoothRouter } from '@/router/old/bluetooth.router';
import { permissionRouter } from '@/router/permission.router';
import { advertisingRouter } from '@/router/advertising.router';
import { generatorRouterCodeMapByRouters } from '@/utils/code';

const staticRoutes = [
  ...singlePageRouter,
  permissionRouter,
  {
    path: '/:w+',
    name: '*',
    redirect: '/templateManage',
  },
];

/**
 * 路由定义
 */
const dynamicRoutes: RouteRecordRaw[] = [
  templateRouters,
  operationRouter,
  advertisingRouter,
  // 旧菜单定义
  oldSystemRouter,
  oldTemplateRouters,
  oldCustomRouters,
  oldPluginRouter,
  oldLogsRouter,
  oldBluetoothRouter,
];

// 注册路由
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [...staticRoutes, ...dynamicRoutes],
});

export const ROUTER_CODE_MAP: Record<string, string> = generatorRouterCodeMapByRouters(
  [templateRouters, operationRouter, advertisingRouter],
  {},
);

// 添加拦截器
routerInterceptor(router);
