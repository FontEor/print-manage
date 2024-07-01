import { ENUMS } from '../types/enums';

const list2KVMap = (list: ENUMS.Instance[]) => {
  const map = new Map();
  list.forEach((enumInstance) => {
    map.set(enumInstance.label, enumInstance.value);
  });
  return map;
};

const list2VKMap = (list: ENUMS.Instance[]) => {
  const map = new Map();
  list.forEach((enumInstance) => {
    map.set(enumInstance.value, enumInstance.label);
  });
  return map;
};

export const dataTypes: ENUMS.Instance[] = [
  {
    label: '数组',
    value: 0,
  },
  {
    label: '对象',
    value: 1,
  },
  {
    label: '字符串',
    value: 2,
  },
];
