import { RouteRecordRaw } from 'vue-router';
import { MenuPermission } from '@/types/apis/menu';

/**
 * 根据路由生成code映射
 * @param {RouteRecordRaw[]} routers
 * @param {Record<string, string>} output
 * @return {Record<string, string>}
 */
export const generatorRouterCodeMapByRouters = (
  routers: RouteRecordRaw[],
  output: Record<string, string>,
): Record<string, string> => {
  routers.forEach((router) => {
    if (router.children) {
      generatorRouterCodeMapByRouters(router.children, output);
    }
    if (router.meta?.usfCode) {
      const name = router.name as string;
      const code = router.meta.usfCode as string;
      if (!code) {
        return;
      }
      if (!name) {
        throw new Error('路由不允许没有name值');
      }
      output[code] = name;
    }
  });
  return output;
};

/**
 * 通过菜单生成路由code映射
 * @param {MenuPermission.MenuInstance[]} menus
 * @param {Record<string, string>} output
 */
export const generatorRouterCodeMapByMenus = (
  menus: MenuPermission.MenuInstance[],
  output: Record<string, string>,
) => {
  menus.forEach((menu) => {
    if (menu.children) {
      generatorRouterCodeMapByMenus(menu.children, output);
    }
    if (menu.code) {
      const url = menu.url as string;
      const code = menu.code as string;
      if (!url) {
        return;
      }
      if (!code) {
        throw new Error('路由不允许没有code值');
      }
      output[code] = url;
    }
  });
  return output;
};

/**
 * 通过菜单生成路由code路径映射
 * @param {MenuPermission.MenuInstance[]} tree
 * @param {Record<string, string[]>} output
 * @param {string[]} prefix
 */
export const generatorMenuCodePathMapByMenuPermissionList = (
  tree: MenuPermission.MenuInstance[],
  output: Record<string, string[]>,
  prefix: string[],
) => {
  tree.forEach((menu) => {
    output[menu.code as string] = [...prefix, menu.code as string];
    if (menu.children && menu.children.length > 0) {
      generatorMenuCodePathMapByMenuPermissionList(menu.children, output, [
        ...prefix,
        menu.code as string,
      ]);
    }
  });
  return output;
};
