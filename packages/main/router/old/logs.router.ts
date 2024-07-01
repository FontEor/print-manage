const Container = () => import('../../components/Container.vue');
const Logs = () => import('../../modules/logs/Index.vue');
export const logsRouter = {
  path: '/',
  name: 'Logs',
  component: Container,
  meta: {
    id: 'TWkGpQSpl',
    alias: '打印日志查询',
    code: 'logs_search_old',
  },
  children: [
    {
      path: 'logsSearch',
      name: 'LogsSearch',
      component: Logs,
      meta: {
        id: 'TWkGpQSpl',
        alias: '打印日志查询',
        code: 'logs_search_old',
      },
    },
  ],
};
