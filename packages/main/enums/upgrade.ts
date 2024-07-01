import { cloneDeep } from 'lodash';
import { ENUMS } from '../types/enums';
/**
 * 运行状态
 */
export const upgradeStates: ENUMS.Instance[] = [
  {
    label: '初始化',
    value: 0,
  },
  {
    label: '升级中',
    value: 1,
  },
  {
    label: '升级暂停',
    value: 2,
  },
  {
    label: '升级完成',
    value: 3,
  },
];

export const upgradeStateEnum: ENUMS.Obj = upgradeStates.reduce((result: ENUMS.Obj, type) => {
  result[type.value] = type.label;
  return result;
}, {});

export default function () {
  return cloneDeep(upgradeStates);
}
