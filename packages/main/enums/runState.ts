import { cloneDeep } from 'lodash';
import { ENUMS } from '../types/enums';
/**
 * 运行状态
 */
export const runStates: ENUMS.Instance[] = [
  {
    label: '离线',
    value: 0,
  },
  {
    label: '在线',
    value: 1,
  },
];

export const runStateEnum: ENUMS.Obj = runStates.reduce((result: ENUMS.Obj, type) => {
  result[type.value] = type.label;
  return result;
}, {});

export default function () {
  return cloneDeep(runStates);
}
