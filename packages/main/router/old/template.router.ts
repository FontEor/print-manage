const Container = () => import('../../components/Container.vue');
const OpenTemplate = () => import('../../modules/templateManagement/openTemplate/index.vue');
const OpenTemplateDetail = () =>
  import('../../modules/templateManagement/openTemplate/openTemplateDetail/index.vue');
const ElementManagement = () =>
  import('../../modules/templateManagement/elementManagement/index.vue');
const ElementDetail = () =>
  import('../../modules/templateManagement/elementManagement/elementDetail/index.vue');
const Standard = () => import('../../modules/standard/index.vue');
const StandardAdd = () => import('../../modules/standard/choose.vue');
const TemplateReplace = () => import('../../modules/replace/Template.vue');
export const templateRouter = {
  path: '/',
  name: 'Template',
  component: Container,
  meta: {
    id: 'osGtlDLiE',
    alias: '模板管理',
    code: 'open_template',
  },
  children: [
    {
      path: 'openTemplate',
      name: 'OpenTemplate',
      component: OpenTemplate,
      meta: {
        id: '0F9Ab_IjF',
        alias: '全自定义模板',
        code: 'open_template',
        needOrgId: true,
      },
    },
    {
      path: 'standardTemplate',
      name: 'StandardTemplate',
      component: Standard,
      meta: {
        id: 'gCOVqk_cw',
        alias: '标准模板',
        code: 'standard_template',
        needOrgId: true,
      },
    },
    {
      path: 'standardTemplateAdd',
      name: 'StandardTemplateAdd',
      component: StandardAdd,
      meta: {
        id: 'gCOVqk_cw',
        alias: '新增模板',
        code: 'open_template_add',
        // 路径参考代码
        refer_code: 'open_template',
        needOrgId: true,
      },
    },
    {
      path: 'openTemplateDetail',
      name: 'OpenTemplateDetail',
      component: OpenTemplateDetail,
      meta: {
        id: '0F9Ab_IjF',
        alias: '模板管理详情页',
        code: 'open_template_detail',
        // 路径参考代码
        refer_code: 'open_template',
        needOrgId: true,
      },
    },
    {
      path: 'elementManagement',
      name: 'ElementManagement',
      component: ElementManagement,
      meta: {
        id: 'FiKEKq8uA',
        alias: '要素管理',
        code: 'discard_element',
      },
    },
    {
      path: 'elementDetail',
      name: 'ElementDetail',
      component: ElementDetail,
      meta: {
        id: 'FiKEKq8uA',
        alias: '要素管理详情页',
        code: 'discard_element_detail',
        // 路径参考代码
        refer_code: 'discard_element',
      },
    },
    {
      path: 'templateReplace',
      name: 'TemplateReplace',
      component: TemplateReplace,
      meta: {
        id: 'Ro535e1Vt',
        alias: '模板置换配置',
        code: 'template_replace_old',
      },
    },
  ],
};
