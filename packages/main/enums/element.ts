import { cloneDeep } from 'lodash';
import type { ENUMS } from '../types/enums';

export const elementTypeList: ENUMS.List = [
  {
    value: 'text',
    label: '文本',
  },
  {
    value: 'ercode',
    label: '二维码',
  },
  {
    value: 'barcode',
    label: '条形码',
  },
  {
    value: 'image',
    label: '图片',
  },
  // {
  //   value: 'ellipse',
  //   label: "圆形"
  // },
  // {
  //   value: 'logo',
  //   label: "Logo"
  // },
  {
    value: 'water',
    label: '水印',
  },
];

export const elementTypeEnum: ENUMS.Obj = elementTypeList.reduce((result: ENUMS.Obj, type) => {
  result[type.value] = type.label;
  return result;
}, {});

export default function () {
  return cloneDeep(elementTypeList);
}
