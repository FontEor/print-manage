import { InjectionKey } from 'vue';
import { createStore, Store, useStore as useS } from 'vuex';
import { Menu } from '@/types/menu';
import { UserData } from '@/types/apis/userData';
import { router } from '@/router';
import RootStateTypes, { UpdateMenuCurrentData } from '../types/store';
import { indexTabConfig } from '@/router/routeConfig';

const store = createStore<RootStateTypes>({
  state() {
    return {
      user: undefined,
      menus: [], // 所有处理完成的菜单
      menuSides: [], // 对应的左侧菜单
      // 菜单展开项目
      menuSideOpened: [], // 左侧的展开菜单
      // 菜单选中项
      menuSideActive: '', // 左侧的选中菜单
      menuCodes: [], // 没用到
      menuCurrent: '', // 当前顶部菜单选中态度
      currentTab: undefined,
      tabs: [indexTabConfig],
      buttons: {
        系统创建: true,
      }, // 改为MAP
      currentOrgId: undefined,
      currentOrgName: undefined,
      routerLoading: false,
    };
  },
  getters: {},
  mutations: {
    updateUserInfo(state, userInfo: UserData.Instance) {
      state.user = userInfo;
    },
    updateMenu(state, info: Menu.UpdateMenu) {
      // proxyRegisterRouter(info.menus);
      state.menus = info.menus;
      // state.buttons = info.buttons;
    },
    updateMenuCurrent(state, code: string) {
      console.log('updateMenuCurrent code', code);
      // 更新当前顶部导航
      state.menuCurrent = code || '';
      const instance = state.menus.find((menu) => {
        return menu.code === code;
      });
      if (instance) {
        // 更新当前左侧导航列表数据
        state.menuSides = instance.children || [];
      }
    },
    updateMenuCurrentByRoute(state, info: UpdateMenuCurrentData) {
      console.log('updateMenuCurrentByRoute info', info);
      if (info.activeMenuPath) {
        const paths = info.activeMenuPath;
        const activeHeaderName = paths.shift();
        const active = paths.pop();
        state.menuSideOpened = paths;
        store.commit('updateMenuCurrent', activeHeaderName || '');
        state.menuSideActive = active || '';
      }
    },
    updateCurrentOrgId(state, orgId: number | undefined) {
      state.currentOrgId = orgId;
    },
    updateCurrentOrgName(state, orgName: string | undefined) {
      state.currentOrgName = orgName;
    },
    updateRouterLoading(state, loading: boolean) {
      state.routerLoading = loading;
    },
    clearAllMenu(state) {
      state.menuCurrent = '';
      state.menuSideOpened = [];
      state.menuSideActive = '';
    },
  },
  actions: {
    changeTab(store, name: string) {
      const tab = store.state.tabs.find((tab) => tab.name === name);
      if (tab) {
        router
          .push({
            name: tab.route?.name,
          })
          .then((error) => {
            if (!error) {
              store.commit('changeTab', tab);
            }
          });
      }
    },
  },
  modules: {},
});

export default store;

export type StoreRoot = Store<RootStateTypes>;
// 注册store时使用
export const key: InjectionKey<Store<RootStateTypes>> | string = Symbol('store');

export const useStore = (name: InjectionKey<Store<any>> | string = key) => {
  return useS(name);
};
