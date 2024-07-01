const Container = () => import('../../components/Container.vue');
const PluginInstall = () => import('../../modules/plugin/Index.vue');
export const pluginRouter = {
  path: '/',
  name: 'Plugin',
  component: Container,
  meta: {
    id: 'mAe7uUb9A',
    alias: '插件装机管理',
    code: 'plugin_install',
  },
  children: [
    {
      path: 'pluginInstall',
      name: 'PluginInstall',
      component: PluginInstall,
      meta: {
        id: 'mAe7uUb9A',
        alias: '插件装机管理',
        code: 'plugin_install',
      },
    },
  ],
};
