import { adminMenu, ownerMenu, memberMenu, formatMenuToPermission } from './menu';
import { requestV2 } from '@/axios/request';
import store from '../store';
import { MenuPermission } from '@/types/apis/menu';
import { ElMessage } from 'element-plus';
import routerGuard from '@/router/router.guard';
import { ROUTER_CODE_MAP } from '@/router';
import { generatorMenuCodePathMapByMenuPermissionList } from '@/utils/code';
import {
  noOperationMenu,
  noOperationOldMenu,
  noSystemOldMenu,
  noTemplateMenu,
  noTemplateOldMenu,
} from '@/menus/no-permission';
import lodash from 'lodash';

/**
 * 整理为树状结构
 * @param {MenuPermission.MenuInstance[]} list
 * @return {MenuPermission.MenuInstance[]}
 */
function formatListToTree(list: MenuPermission.MenuInstance[]): MenuPermission.MenuInstance[] {
  list.forEach((outer) => {
    outer.url = ROUTER_CODE_MAP[outer.code] || '';
    list.forEach((inner) => {
      if (inner.parentId === outer.id) {
        if (outer.children) {
          outer.children.push(inner);
        } else {
          outer.children = [inner];
        }
      }
    });
  });
  return list.filter((item) => item.level === 1);
}
/**
 * 分离数据
 * @param {MenuPermission.MenuInstance[]} list
 */
function separateData(list: MenuPermission.MenuInstance[]) {
  const buttonMap: Record<string, string> = {};
  const menus: MenuPermission.MenuInstance[] = [];
  const codes: string[] = [];
  list.forEach((item) => {
    if (!item.children) {
      item.children = [];
    }
    switch (item.type) {
      // 菜单
      case 0:
        menus.push(item);
        codes.push(item.code);
        break;
      // 按钮
      case 1:
        buttonMap[item.code] = item.name || item.code;
        break;
      default:
        break;
    }
  });
  // 加载到 拦截器中
  routerGuard.setAllowCode(codes);
  return {
    menus: formatListToTree(menus),
    buttonMap: buttonMap,
  };
}

function extendMenu(list: MenuPermission.MenuInstance[], identity: 1 | 2 | 3) {
  switch (identity) {
    case 1:
      return [...list, ...adminMenu];
    case 2:
      return [...list, ...ownerMenu];
    case 3:
      return [...list, ...memberMenu];
  }
}

function addNoPermissionMenu(list: MenuPermission.MenuInstance[]): MenuPermission.MenuInstance[] {
  const result: MenuPermission.MenuInstance[] = [];
  list.forEach((item) => {
    // 模板管理 权限
    if (item.code === 'template_management') {
      result[0] = item;
    }
    // 运维运营 权限
    if (item.code === 'operation') {
      result[1] = item;
    }
    // 广告权限
    if (item.code === 'advertising_manage') {
      result[2] = item;
    }
  });
  if (!result[0]) {
    result[0] = formatMenuToPermission([noTemplateMenu])[0];
  }
  if (!result[1]) {
    result[1] = formatMenuToPermission([noOperationMenu])[0];
  }
  return lodash.compact(result);
}

function catchFn(err: unknown) {
  console.log('拉取菜单失败', err);
  ElMessage.error('拉取菜单失败');
}

export default function () {
  return new Promise((resolve, reject) => {
    requestV2
      .menuAllList({
        params: {
          parentResourceCode: '',
        },
      })
      .then((response) => {
        const data = response.data || [];
        const { buttonMap, menus } = separateData(lodash.orderBy(data, 'seq', 'asc'));
        const hasAuthMenus = addNoPermissionMenu(menus);
        const menuPath = generatorMenuCodePathMapByMenuPermissionList(hasAuthMenus, {}, []);
        routerGuard.setMenuCodePath(menuPath);
        store.commit('updateMenu', {
          menus: hasAuthMenus,
          buttons: buttonMap,
        });
        return resolve(undefined);
      })
      .catch((err) => {
        catchFn(err);
        reject(err);
      });
  });
}
