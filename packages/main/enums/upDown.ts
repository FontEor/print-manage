import { cloneDeep } from 'lodash';
import { ENUMS } from '../types/enums';
/**
 * 运行状态
 */
export const upDown: ENUMS.Instance[] = [
  {
    label: '已下架',
    value: 3,
  },
  {
    label: '上架',
    value: 2,
  },
  {
    label: '新增',
    value: 1,
  },
];

export const upDownEnum: ENUMS.Obj = upDown.reduce((result: ENUMS.Obj, type) => {
  result[type.value] = type.label;
  return result;
}, {});

export default function () {
  return cloneDeep(upDown);
}
