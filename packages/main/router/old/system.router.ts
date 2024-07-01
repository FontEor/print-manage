const Container = () => import('../../components/Container.vue');
const Source = () => import('../../modules/source/Index.vue');
const SourceDetail = () => import('../../modules/source/Detail.vue');
const SystemManagement = () => import('../../modules/systemManagement/index.vue');
const SystemManagementDetail = () =>
  import('../../modules/systemManagement/systemManagementDetail/index.vue');
const WhiteList = () => import('../../modules/examine/Index.vue');
const Express = () => import('../../modules/express/Index.vue');
const ExpressMaintain = () => import('../../modules/express/Maintain.vue');
const EnumManage = () => import('../../modules/enumManage/Index.vue');

export const systemRouter = {
  path: '/',
  name: 'System',
  component: Container,
  redirect: 'systemManagement',
  meta: {
    id: 'zOiG81p6-',
    alias: '系统接入',
    code: 'system_management',
  },
  children: [
    {
      path: 'systemManagement',
      name: 'SystemManagement',
      component: SystemManagement,
      meta: {
        id: 'H1eJSfb8K',
        alias: '系统管理',
        code: 'system_management',
        needOrgId: true,
      },
    },
    {
      path: 'systemManagementDetail',
      name: 'SystemManagementDetail',
      component: SystemManagementDetail,
      meta: {
        id: 'H1eJSfb8K',
        alias: '系统管理详情页',
        code: 'system_management_detail',
        // 路径参考代码
        refer_code: 'system_management',
        needOrgId: true,
      },
    },
    {
      path: 'express',
      name: 'Express',
      component: Express,
      meta: {
        id: '2jR0tvqh2',
        alias: '承运商管理',
        keepAlive: true,
        code: 'express',
      },
    },
    {
      path: 'whiteList',
      name: 'WhiteList',
      component: WhiteList,
      meta: {
        id: 'W7TnrjTEp',
        alias: '白名单认证审核',
        keepAlive: true,
        code: 'white_list_old',
      },
    },
    {
      path: 'source',
      name: 'SourceData',
      component: Source,
      meta: {
        id: 'WS4aKf2VB',
        alias: '数据源管理',
        keepAlive: true,
        code: 'source_data',
        needOrgId: true,
      },
    },
    {
      path: 'sourceDetail',
      name: 'SourceDetail',
      component: SourceDetail,
      meta: {
        id: 'WS4aKf2VB',
        alias: '数据源详情',
        keepAlive: false,
        code: 'source_data',
        // 路径参考代码
        refer_code: 'custom_manage',
        needOrgId: true,
      },
      props: (route: { query: { id: any; sourceId: any } }) => ({
        id: route.query.id,
        sourceId: route.query.sourceId,
      }),
    },
    {
      path: 'enums',
      name: 'EnumManage',
      component: EnumManage,
      meta: {
        id: 'kn1sL5d2x',
        alias: '枚举管理',
        keepAlive: true,
        code: 'enum_manage',
        needOrgId: true,
      },
    },
    {
      path: 'expressMaintain',
      name: 'ExpressMaintain',
      component: ExpressMaintain,
      meta: {
        id: 'GSEYFc-Mp',
        alias: '承运商维护',
        keepAlive: true,
        code: 'express_maintain',
        needOrgId: true,
      },
    },
  ],
};
