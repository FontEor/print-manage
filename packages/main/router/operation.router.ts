import { RouteRecordRaw } from 'vue-router';
const Container = () => import('../components/Container.vue');
const TemplateReplacement = () => import('../modules/replacement/Template.vue');
const BlueToothManagement = () => import('../modules/bluetoothManagement/Index.vue');
const ExpressPreserve = () => import('../modules/expresses/Index.vue');
const ExpressMappingCode = () => import('../modules/expresses/Maintain.vue');
const MerchantWhitelist = () => import('../modules/examineAudit/Index.vue');
const Troubleshooting = () => import('../modules/troubleshooting/Index.vue');
const SystemAdministration = () => import('../modules/systemAdministration/index.vue');
const SystemAdministrationDetail = () =>
  import('../modules/systemAdministration/systemAdministrationDetail/index.vue');
const TemplateClassification = () => import('../modules/templateClassification/List.vue');
const CustomizeSize = () => import('../modules/customizeSize/index.vue');
const WaybillTemplateReview = () => import('../modules/waybillTemplateReview/List.vue');
// const PluginInstall = () => import('../modules/plugin/Detail.vue');
const PluginInstallTab = () => import('../modules/plugin/tabs/Install.vue');
const PluginVersionTab = () => import('../modules/plugin/tabs/Version.vue');
const PluginUpgradeTab = () => import('../modules/plugin/tabs/Upgrade.vue');
const PluginMessagePushTab = () => import('../modules/plugin/tabs/MessagePush.vue');
const GrayUpdate = () => import('../modules/grayUpdate/List.vue');

export const operationRouter: RouteRecordRaw = {
  path: '/',
  name: 'OperationMaintenance',
  component: Container,
  meta: {
    alias: '运营运维',
    usfCode: 'operation',
  },
  children: [
    {
      path: '',
      name: 'TemplateConfiguration',
      meta: {
        alias: '模板配置',
        usfCode: 'TemplateConfiguration',
      },
      children: [
        {
          path: 'templateClassification',
          name: 'TemplateClassification',
          component: TemplateClassification,
          meta: {
            alias: '模板分类',
            usfCode: 'Templateclassification',
          },
        },
        {
          path: 'customizeSize',
          name: 'CustomizeSize',
          component: CustomizeSize,
          meta: {
            alias: '自定义区尺寸',
            usfCode: 'CustomAreaSize',
          },
        },
        {
          path: 'templateReplacement',
          name: 'TemplateReplacement',
          component: TemplateReplacement,
          meta: {
            alias: '模板置换',
            usfCode: 'TemplateReplacement',
          },
        },
      ],
    },
    {
      path: 'bluetoothManagement',
      name: 'BlueToothManagement',
      component: BlueToothManagement,
      meta: {
        alias: '蓝牙设备管理',
        usfCode: 'Bluetoothdevicemanagement',
      },
    },
    {
      path: '',
      name: 'ExpressManage',
      meta: {
        alias: '承运商管理',
        usfCode: 'CarrierManagement',
      },
      children: [
        {
          path: 'expressMaintenance',
          name: 'ExpressMaintenance',
          component: ExpressPreserve,
          meta: {
            alias: '承运商维护',
            usfCode: 'Carriermaintenance',
          },
        },
        {
          path: 'expressMappingCode',
          name: 'ExpressMappingCode',
          component: ExpressMappingCode,
          meta: {
            alias: '承运商映射码',
            usfCode: 'Carriermappingcode',
          },
        },
      ],
    },
    {
      path: '',
      name: 'WaybillReview',
      meta: {
        alias: '电子面单审核',
        usfCode: 'Electronicfacesheetreview',
      },
      children: [
        {
          path: 'merchantWhitelist',
          name: 'MerchantWhitelist',
          component: MerchantWhitelist,
          meta: {
            alias: '商家白名单认证',
            usfCode: 'Merchantwhitelistauthentication',
          },
        },
        {
          path: 'waybillTemplateReview',
          name: 'WaybillTemplateReview',
          component: WaybillTemplateReview,
          meta: {
            alias: '面单模板审核',
            usfCode: 'Facesheettemplatereview',
          },
        },
      ],
    },
    {
      path: '',
      name: 'TroubleshootingTool',
      meta: {
        alias: '问题排查工具',
        usfCode: 'Problemsolvingtools',
      },
      children: [
        {
          path: 'troubleshooting',
          name: 'Troubleshooting',
          component: Troubleshooting,
          meta: {
            alias: '面单打印问题排查',
            usfCode: 'Facesheetprintingissues',
          },
        },
      ],
    },
    {
      path: '',
      name: 'PluginAdministration',
      meta: {
        alias: '组件管理',
        usfCode: 'componentmanagement',
      },
      children: [
        {
          path: 'componentVersion',
          name: 'ComponentVersion',
          component: PluginVersionTab,
          meta: {
            alias: '组件版本',
            usfCode: 'ComponentVersion',
          },
        },
        {
          path: 'installationList',
          name: 'InstallationList',
          component: PluginInstallTab,
          meta: {
            alias: '装机清单',
            usfCode: 'InstallationList',
          },
        },
        {
          path: 'forcedUpdate',
          name: 'ForcedUpdate',
          component: PluginUpgradeTab,
          meta: {
            alias: '强制升级',
            usfCode: 'ForceUpgrade',
          },
        },
        {
          path: 'pushMessage',
          name: 'PushMessage',
          component: PluginMessagePushTab,
          meta: {
            alias: '消息推送',
            usfCode: 'Messagepush',
          },
        },
        {
          path: 'grayUpdate',
          name: 'GrayUpdate',
          component: GrayUpdate,
          meta: {
            alias: '灰度升级',
            usfCode: 'gray-update',
          },
        },
      ],
    },
    {
      path: 'systemAdministration',
      name: 'SystemAdministration',
      component: SystemAdministration,
      meta: {
        alias: '系统管理',
        usfCode: 'systemmanagement',
      },
    },
    {
      path: 'systemAdministrationDetail',
      name: 'SystemAdministrationDetail',
      component: SystemAdministrationDetail,
      meta: {
        alias: '系统管理详情页',
        code: 'systemmanagement_detail',
        refer_code: 'systemmanagement',
      },
    },
  ],
};
