const Container = () => import('../../components/Container.vue');
const StandardAdd = () => import('../../modules/standard/choose.vue');
const Custom = () => import('../../modules/custom/Index.vue');
const CustomDetail = () => import('../../modules/custom/Detail.vue');
export const customRouter = {
  path: '/',
  name: 'Custom',
  component: Container,
  meta: {
    id: '5C-E4KK5r',
    alias: '半自定义模板',
    code: 'custom_manage',
  },
  children: [
    {
      path: 'customManage',
      name: 'CustomManage',
      component: Custom,
      meta: {
        id: '5C-E4KK5r',
        alias: '半自定义模板',
        code: 'custom_manage',
      },
    },
    {
      path: 'customDetail',
      name: 'CustomDetail',
      component: CustomDetail,
      meta: {
        id: '5C-E4KK5r',
        alias: '半自定义模板详情',
        code: 'custom_manage_detail',
        // 路径参考代码
        refer_code: 'custom_manage',
      },
      props: (route: { query: { id: string; temId: string } }) => ({
        id: route.query.id,
        temId: route.query.temId,
      }),
    },
    {
      path: 'customTemplateAdd',
      name: 'CustomTemplateAdd',
      component: StandardAdd,
      meta: {
        id: 'gCOVqk_cw',
        alias: '新增模板',
        code: 'custom_manage_add',
        // 路径参考代码
        refer_code: 'custom_manage',
      },
    },
  ],
};
