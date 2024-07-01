// W7TnrjTEp
import { MenuPermission } from '@/types/apis/menu';
import { Menu } from '@/types/menu';
import { generatorRouterCodeMapByMenus } from '@/utils/code';
import noPermissionMenu from '@/menus/no-permission';

export const formatMenuToPermission = (list: Menu.Instance[]): MenuPermission.MenuInstance[] => {
  return list.map((menu) => {
    const children = menu.children || [];
    return {
      id: menu.id,
      type: menu.type,
      name: menu.name,
      url: menu.url || '',
      code: menu.code || '',
      parentId: 0,
      level: 1,
      seq: 1,
      icon: '',
      parentIds: '',
      isHasChild: true,
      ext1: '',
      ext2: '',
      ext3: '',
      ext4: '',
      ext5: '',
      ext6: '',
      ext7: '',
      ext8: '',
      ext9: '',
      ext10: '',
      extendedField: '',
      route: '',
      children: formatMenuToPermission(children),
    };
  });
};

const menu: MenuPermission.MenuInstance[] = formatMenuToPermission([
  {
    id: 200000000000,
    type: 1,
    name: '模板管理(旧)',
    url: '',
    code: 'template_management_old',
    children: [
      {
        id: 200000000001,
        type: 1,
        name: '标准模板',
        url: 'StandardTemplate',
        code: 'standard_template',
      },
      {
        id: 200000000002,
        type: 1,
        name: '半自定义模板',
        url: 'CustomManage',
        code: 'custom_manage',
      },
      {
        id: 200000000003,
        type: 1,
        name: '全自定义模板',
        url: 'OpenTemplate',
        code: 'open_template',
      },
    ],
  },
  {
    id: 300000000000,
    type: 1,
    name: '运维运营(旧)',
    url: '',
    code: 'operation_old',
    children: [
      {
        id: 300000000001,
        type: 1,
        name: '承运商管理',
        url: 'Express',
        code: 'express',
      },
      {
        id: 300000000002,
        type: 1,
        name: '白名单认证审核',
        url: 'WhiteList',
        code: 'white_list_old',
      },
      {
        id: 300000000003,
        type: 1,
        name: '插件装机管理',
        url: 'PluginInstall',
        code: 'plugin_install',
      },
      {
        id: 300000000004,
        type: 1,
        name: '打印日志查询',
        url: 'LogsSearch',
        code: 'logs_search_old',
      },
      {
        id: 300000000005,
        type: 1,
        name: '模板置换配置',
        url: 'TemplateReplace',
        code: 'template_replace_old',
      },
      {
        id: 300000000006,
        type: 1,
        name: '支持的蓝牙设备',
        url: 'BlueToothDevice',
        code: 'bluetooth_device',
      },
    ],
  },
  {
    id: 100000000000,
    type: 1,
    name: '系统接入(旧)',
    url: '',
    code: 'system_management_old',
    parentId: 0,
    children: [
      {
        id: 100000000001,
        type: 1,
        name: '系统管理',
        url: 'SystemManagement',
        code: 'system_management',
      },
      {
        id: 100000000002,
        type: 1,
        name: '数据源管理',
        url: 'SourceData',
        code: 'source_data',
      },
      {
        id: 100000000003,
        type: 1,
        name: '枚举管理',
        url: 'EnumManage',
        code: 'enum_manage',
      },
      {
        id: 100000000004,
        type: 1,
        name: '承运商维护',
        url: 'ExpressMaintain',
        code: 'express_maintain',
      },
    ],
  },
]);

export const adminMenu = menu;
export const ownerMenu: MenuPermission.MenuInstance[] = formatMenuToPermission([
  {
    id: 200000000000,
    type: 1,
    name: '模板管理(旧)',
    url: '',
    code: 'template_management_old',
    children: [
      {
        id: 200000000001,
        type: 1,
        name: '标准模板',
        url: 'StandardTemplate',
        code: 'standard_template',
      },
      {
        id: 200000000002,
        type: 1,
        name: '半自定义模板',
        url: 'CustomManage',
        code: 'custom_manage',
      },
      {
        id: 200000000003,
        type: 1,
        name: '全自定义模板',
        url: 'OpenTemplate',
        code: 'open_template',
      },
    ],
  },
  {
    id: 100000000000,
    type: 1,
    name: '系统接入(旧)',
    url: '',
    code: 'system_management_old',
    children: [
      {
        id: 100000000001,
        type: 1,
        name: '系统管理',
        url: 'SystemManagement',
        code: 'system_management',
      },
      {
        id: 100000000002,
        type: 1,
        name: '数据源管理',
        url: 'SourceData',
        code: 'source_data',
      },
      {
        id: 100000000003,
        type: 1,
        name: '枚举管理',
        url: 'EnumManage',
        code: 'enum_manage',
      },
      {
        id: 100000000004,
        type: 1,
        name: '承运商维护',
        url: 'ExpressMaintain',
        code: 'express_maintain',
      },
    ],
  },
]);

export const memberMenu: MenuPermission.MenuInstance[] = formatMenuToPermission([
  {
    id: 200000000000,
    type: 1,
    name: '模板管理(旧)',
    url: '',
    code: 'template_management_old',
    children: [
      {
        id: 200000000001,
        type: 1,
        name: '标准模板',
        url: 'StandardTemplate',
        code: 'standard_template',
      },
      {
        id: 200000000002,
        type: 1,
        name: '半自定义模板',
        url: 'CustomManage',
        code: 'custom_manage',
      },
      {
        id: 200000000003,
        type: 1,
        name: '全自定义模板',
        url: 'OpenTemplate',
        code: 'open_template',
      },
    ],
  },
  {
    id: 100000000000,
    type: 1,
    name: '系统接入(旧)',
    url: '',
    code: 'system_management_old',
    children: [
      {
        id: 100000000002,
        type: 1,
        name: '数据源管理',
        url: 'SourceData',
        code: 'source_data',
      },
      {
        id: 100000000003,
        type: 1,
        name: '枚举管理',
        url: 'EnumManage',
        code: 'enum_manage',
      },
      {
        id: 100000000004,
        type: 1,
        name: '承运商维护',
        url: 'ExpressMaintain',
        code: 'express_maintain',
      },
    ],
  },
]);

export const OLD_ROUTER_CODE_MAP: Record<string, string> = generatorRouterCodeMapByMenus(
  [...menu, ...formatMenuToPermission(noPermissionMenu)],
  {},
);
