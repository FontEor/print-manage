import { ENUMS } from '@/types/enums';

export const businessCodeTypes: ENUMS.Instance[] = [
  {
    label: '青龙业主号',
    value: 1,
  },
  {
    label: '事业部编码',
    value: 2,
  },
  {
    label: '商家ID',
    value: 3,
  },
];

export const businessCodeTypeEnum: ENUMS.Obj<string> = businessCodeTypes.reduce(
  (result: ENUMS.Obj<string>, type) => {
    result[type.value] = type.label;
    return result;
  },
  {},
);

export const formatBusinessCodeTypeLabel = (value: number): string => {
  return businessCodeTypeEnum[`${value}`] || '';
};
