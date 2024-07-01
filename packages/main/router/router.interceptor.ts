// 挂载路由导航守卫
import { Session } from '@/utils/session';
import { Router } from 'vue-router';
import routerGuard from '@/router/router.guard';
import store from '@/store';
import RouterGuard from '@/router/router.guard';
import { assignQuery } from '@/utils/hashQuery';
import type { SystemList } from '@/types/apis/join-system';

export default function (router: Router) {
  router.beforeEach(async (to, from, next) => {
    store.commit('updateRouterLoading', true);
    getOrgIdOrName(to.query);
    const orgId = Session.getOrgId();
    const orgName = Session.getOrgName();
    // 如果需要 系统ID 还没有找到系统ID 并且不是系统页面那么
    if (to.meta.needOrgId && !orgId && to.name !== 'ChooseSystemNew') {
      // 那么强制跳转到 选择系统页面
      await router.replace({ name: 'ChooseSystemNew' });
      next(false);
      return;
    }
    to.fullPath = assignQuery(to.fullPath, { orgId, orgName });
    // 进入菜单权限验证函数
    routerGuard.validMenuAuthority(to, from, next);
    return;
  });

  router.afterEach((to) => {
    console.log('to ->', to);
    store.commit('updateRouterLoading', false);
    if (to.name === 'ChooseSystemNew') {
      console.log('afterEach clearAllMenu');
      store.commit('clearAllMenu');
      return;
    }
    // 获取usf Code编码 或者参考编码 或者 编码
    const code = to.meta?.refer_code || to.meta?.usfCode || to.meta?.code || '';
    store.commit('updateMenuCurrentByRoute', {
      activeMenuPath: RouterGuard.getMenuCodePath(code as string) || to.name,
    });
  });

  const getOrgIdOrName = (query: SystemList.OrgForm) => {
    let orgId = Session.getOrgId();
    let orgName = Session.getOrgName();
    // 如果全局系统ID不存在
    if (!orgId) {
      // 从路由里面获取系统ID
      if (typeof query.orgId === 'undefined') {
        orgId = undefined;
      } else if (query.orgId !== null && typeof +query.orgId === 'number') {
        orgId = +query.orgId;
      } else {
        orgId = undefined;
      }
      // 并写入至session中
      Session.setOrgId(orgId);
    }
    // 如果全局系统ID不存在
    if (!orgName) {
      // 从路由里面获取系统ID
      if (query.orgName !== null && typeof query.orgName === 'string') {
        orgName = query.orgName;
      } else {
        orgName = undefined;
      }
      // 并写入至session中
      Session.setOrgName(orgName);
    }
  };
}
