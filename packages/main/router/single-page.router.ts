const ContainerNoSideMenu = () => import('../components/ContainerNoSideMenu.vue');
const StandardAddForJWMS = () => import('../modules/standard/chooseJWMS.vue');
const ChooseSystem = () => import('../views/Choose.vue');
const ChooseSystemNew = () => import('../views/ChooseSystem.vue');
const Transfrom = () => import('../views/Transfrom.vue');
export const indexRoute = {
  path: '/',
  name: 'home',
  component: ContainerNoSideMenu,
  meta: {
    alias: '首页',
  },
  children: [
    {
      path: '/chooseSystemNew',
      name: 'ChooseSystemNew',
      component: ChooseSystemNew,
      meta: {
        alias: '选择系统新',
        code: 'choose_system_new',
      },
    },
    {
      path: '/applyJoinSystem',
      name: 'ApplyJoinSystem',
      component: ChooseSystem,
      meta: {
        alias: '没有系统新',
        code: 'apply_join_system',
        refer_code: 'choose_system_new',
      },
    },
  ],
};

export const singlePageRouter = [
  indexRoute,
  {
    path: '/:w+',
    name: '*',
    redirect: '/',
  },
  // 外部系统进入模板选择界面
  {
    path: '/chooseStandard',
    name: 'ChooseStandard',
    component: StandardAddForJWMS,
    meta: {
      alias: '选择模板',
    },
  },
  // 选择系统界面 重定向至新版选择系统界面
  // {
  //   path: '/chooseSystem',
  //   name: 'ChooseSystem',
  //   component: ChooseSystem,
  //   meta: {
  //     alias: '选择系统',
  //   },
  // },
  // 模板转换页面
  {
    path: '/transfrom',
    name: 'Transfrom',
    component: Transfrom,
    meta: {
      alias: '模板转换',
    },
  },
];
