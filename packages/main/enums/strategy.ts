import { cloneDeep } from 'lodash';
import { ENUMS } from '@/types/enums';
/**
 * 策略类型
 */
export const strategyTypes: ENUMS.Instance[] = [
  {
    label: '指定放量比例升级',
    value: 1,
  },
  {
    label: '指定appKey升级',
    value: 2,
  },
  {
    label: '指定PIN升级',
    value: 3,
  },
  {
    label: '指定机器ID升级',
    value: 4,
  },
];

export const strategyTypeEnum: ENUMS.Obj = strategyTypes.reduce((result: ENUMS.Obj, type) => {
  result[type.value] = type.label;
  return result;
}, {});

export default function () {
  return cloneDeep(strategyTypes);
}
