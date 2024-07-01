// 新菜单定义
import { RouteRecordRaw } from 'vue-router';

const Container = () => import('../components/Container.vue');
const TemplateMarket = () => import('../modules/templateMarket/Index.vue');
const SourceNew = () => import('../modules/sourceNew/List.vue');
const SourceDetailNew = () => import('../modules/sourceNew/Detail.vue');
const EnumManagementNew = () => import('../modules/enumManageNew/List.vue');
const TemplateList = () => import('../modules/templates/List.vue');
const TemplateDetail = () => import('../modules/templates/Detail.vue');
const Print = () => import('../modules/print/Index.vue');
const CustomArea = () => import('../modules/customArea/Index.vue');
const BusinessTemplateConfig = () => import('../modules/businessTemplateConfig/List.vue');
export const templateRouters: RouteRecordRaw = {
  path: '/',
  name: 'Templates',
  component: Container,
  meta: {
    alias: '模板管理',
    usfCode: 'template_management',
  },
  children: [
    {
      path: 'templateManage',
      name: 'TemplateManage',
      component: TemplateList,
      meta: {
        alias: '模板',
        usfCode: 'template',
        needOrgId: true,
      },
    },
    {
      path: 'templateManageDetail',
      name: 'TemplateManageDetail',
      component: TemplateDetail,
      meta: {
        alias: '模板详情',
        code: 'template_management_detail',
        refer_code: 'template',
        needOrgId: true,
      },
    },
    {
      path: 'templateMarket',
      name: 'templateMarket',
      component: TemplateMarket,
      meta: {
        alias: '模板市场',
        code: 'template_market',
        refer_code: 'template',
        needOrgId: true,
      },
    },
    {
      path: 'sourcesNew',
      name: 'SourcesNew',
      component: SourceNew,
      meta: {
        keepAlive: true,
        alias: '数据源',
        usfCode: 'datasource',
        needOrgId: true,
      },
    },
    {
      path: 'sourcesDetailNew',
      name: 'SourcesDetailNew',
      component: SourceDetailNew,
      meta: {
        keepAlive: false,
        alias: '数据源详情',
        code: 'source-detail',
        refer_code: 'datasource',
        needOrgId: true,
      },
      props: (route: { query: { id: any; sourceId: any } }) => ({
        id: route.query.id,
        sourceId: route.query.sourceId,
      }),
    },
    {
      path: 'enumManagementNew',
      name: 'EnumManagementNew',
      component: EnumManagementNew,
      meta: {
        keepAlive: true,
        alias: '枚举管理',
        code: 'enum_manage_new',
        refer_code: 'datasource',
        needOrgId: true,
      },
    },
    {
      path: 'print',
      name: 'Print',
      component: Print,
      meta: {
        alias: '打印项',
        usfCode: 'printitem',
        needOrgId: true,
      },
    },
    {
      path: 'customArea',
      name: 'CustomArea',
      component: CustomArea,
      meta: {
        alias: '自定义区',
        usfCode: 'CustomArea',
        needOrgId: true,
      },
    },
    {
      path: 'businessTemplateConfig',
      name: 'BusinessTemplateConfig',
      component: BusinessTemplateConfig,
      meta: {
        alias: '商家模板配置',
        usfCode: 'business-template-config',
        needOrgId: true,
      },
    },
  ],
};
