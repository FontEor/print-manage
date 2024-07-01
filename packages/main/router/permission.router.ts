import { RouteRecordRaw } from 'vue-router';
const ContainerNoSideMenu = () => import('../components/ContainerNoSideMenu.vue');
import EmptyPage from '../components/EmptyPage.vue';
import { Empty } from '@/types/components/empty';

export const permissionRouter: RouteRecordRaw = {
  path: '/',
  name: 'Permission',
  component: ContainerNoSideMenu,
  meta: {
    id: '0',
    alias: '权限缺省菜单',
  },
  children: [
    {
      path: 'noTemplatePermission',
      name: 'NoTemplatePermission',
      component: EmptyPage,
      meta: {
        alias: '无模板管理系统权限',
        // 无系统权限
        code: 'no_template_permission',
      },
      props: {
        type: 1 as Empty.Type,
      },
    },
    {
      path: 'noOperationPermission',
      name: 'NoOperationPermission',
      component: EmptyPage,
      meta: {
        alias: '无运维运营权限',
        code: 'no_operation_permission',
      },
      props: {
        type: 2 as Empty.Type,
      },
    },
    {
      path: 'noOperationOldPermission',
      name: 'NoOperationOldPermission',
      component: EmptyPage,
      meta: {
        alias: '无【运维运营（旧）】菜单的权限',
        code: 'no_operation_old_permission',
      },
      props: {
        type: 3 as Empty.Type,
      },
    },
    {
      path: 'noTemplateOldPermission',
      name: 'NoTemplateOldPermission',
      component: EmptyPage,
      meta: {
        alias: '无模板管理(旧)系统权限',
        // 无系统权限
        code: 'no_template_old_permission',
      },
      props: {
        type: 1 as Empty.Type,
      },
    },
    {
      path: 'noSystemOldPermission',
      name: 'NoSystemOldPermission',
      component: EmptyPage,
      meta: {
        alias: '无系统管理(旧)系统权限',
        // 无系统权限
        code: 'no_system_old_permission',
      },
      props: {
        type: 1 as Empty.Type,
      },
    },
  ],
};
