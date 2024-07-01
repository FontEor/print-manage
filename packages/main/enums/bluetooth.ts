import { cloneDeep } from 'lodash';
import type { ENUMS } from '../types/enums';

// 蓝牙打印指令集ESC/POS-3，蓝牙打印指令集CPCL-4 ，BMP-5，（待扩展 JPG-6,PNG-7）

export const bluetoothLevel: ENUMS.LEVEL[] = [
  // {
  //   value: 1,
  //   label: 'PDF',
  //   children: [
  //     {
  //       value: 1,
  //       label: 'URL',
  //     },
  //     {
  //       value: 2,
  //       label: 'Base64字符串',
  //     },
  //   ],
  // },
  // {
  //   value: 2,
  //   label: '手持贴标机专用',
  //   children: [
  //     {
  //       value: 2,
  //       label: 'base64字符串',
  //     },
  //   ],
  // },
  {
    value: 3,
    label: '蓝牙打印指令集',
    children: [
      {
        value: 3,
        label: 'ESC/POS',
      },
      {
        value: 4,
        label: 'CPCL',
      },
      {
        value: 5,
        label: 'BMP',
      },
    ],
  },
  // {
  //   value: 4,
  //   label: '图片',
  //   children: [
  //     {
  //       value: 1,
  //       label: 'URL',
  //     },
  //     {
  //       value: 2,
  //       label: 'Base64字符串',
  //     },
  //     {
  //       value: 5,
  //       label: 'BMP',
  //     },
  //     {
  //       value: 6,
  //       label: 'JPG',
  //     },
  //     {
  //       value: 7,
  //       label: 'PNG',
  //     },
  //   ],
  // },
];

export default function () {
  return cloneDeep(bluetoothLevel);
}
