const Container = () => import('../../components/Container.vue');
const Bluetooth = () => import('../../modules/bluetooth/Index.vue');
export const bluetoothRouter = {
  path: '/',
  name: 'bluetooth',
  component: Container,
  meta: {
    id: 'JuvAYUTXJ',
    alias: '支持的蓝牙设备管理',
    code: 'bluetooth_device',
  },
  children: [
    {
      path: 'bluetoothDevice',
      name: 'BlueToothDevice',
      component: Bluetooth,
      meta: {
        id: 'JuvAYUTXJ',
        alias: '支持的蓝牙设备管理',
        code: 'bluetooth_device',
      },
    },
  ],
};
