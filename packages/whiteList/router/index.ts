import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const Container = () => import('../components/Container.vue');
const Identify = () => import('../views/Identity/Apply.vue');
const Business = () => import('../views/Identity/List.vue');

const staticRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: '首页',
    component: Container,
    children: [
      {
        path: 'identify',
        name: 'Identify',
        component: Identify,
        meta: {
          alias: '商家身份认证',
        },
      },
      {
        path: 'business',
        name: 'Business',
        component: Business,
        meta: {
          alias: '商家身份认证',
        },
      },
    ],
    beforeEnter(to, form, next) {
      if (to.name === '首页') {
        return router.replace({
          name: 'Business',
        });
      } else {
        return next();
      }
    },
  },
  {
    path: '',
    name: '*',
    redirect: (to) => {
      return {
        name: 'Identify',
      };
    },
  },
];

// 注册路由
export const router = createRouter({
  history: createWebHashHistory('white-list.html'),
  routes: staticRoutes,
});
