// 广告相关路由
import { RouteRecordRaw } from 'vue-router';
const Container = () => import('../components/Container.vue');
const AdvertisingList = () => import('../modules/advertising/List.vue');
const advertisingDataReport = () => import('../modules/advertisingDataReport/List.vue');
import { Empty } from '@/types/components/empty';
export const advertisingRouter: RouteRecordRaw = {
  path: '/',
  name: 'Advertising',
  component: Container,
  meta: {
    alias: '面单广告管理',
    usfCode: 'advertising_manage',
  },
  children: [
    {
      path: 'advertisingPlan',
      name: 'AdvertisingPlan',
      component: AdvertisingList,
      meta: {
        alias: '广告计划',
        usfCode: 'advertising_plan',
      },
      props: {
        type: 2 as Empty.Type,
      },
    },
    {
      path: 'advertisingDataReport',
      name: 'AdvertisingDataReport',
      component: advertisingDataReport,
      meta: {
        alias: '数据报表',
        usfCode: 'advertising_data_report',
      },
      props: {
        type: 1 as Empty.Type,
      },
    },
  ],
};
