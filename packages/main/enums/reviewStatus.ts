import { cloneDeep } from 'lodash';
import { ENUMS } from '@/types/enums';
/**
 * 运行状态
 */
export const reviewStatus: ENUMS.Instance[] = [
  {
    label: '通过',
    value: 1,
  },
  {
    label: '审批中',
    value: 2,
  },
  {
    label: '驳回',
    value: 3,
  },
];

export const reviewStatusEnum: ENUMS.Obj = reviewStatus.reduce((result: ENUMS.Obj, type) => {
  result[type.value] = type.label;
  return result;
}, {});

export default function () {
  return cloneDeep(reviewStatus);
}
