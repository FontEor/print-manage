import { Property } from '../../../types/apis/sourceData';

const addIndex = (list: Property.Instance[], prefix = ''): Property.Instance[] => {
  list.forEach((item, index) => {
    const children = item.children;
    item.$index = prefix + index.toString();
    if (children) {
      addIndex(children, prefix + index.toString() + '.children.');
    }
  });
  return list;
};

export const propertyFormatList = (data: Property.ListResponse): Property.ListResponse => {
  const list = data.data;
  list.forEach((item) => {
    if (item.parentId) {
      const instance = list.find((ele) => ele.id === item.parentId);
      if (instance) {
        instance.children = instance.children || [];
        instance.children.push(item);
      }
    }
  });
  data.data = list.filter((item) => item.parentId === 0);
  data.data = addIndex(data.data, '0.children.');
  return data;
};

export const propertyFormatListBack = (list: Property.Instance[]): Property.Instance[] => {
  const result: Property.Instance[] = [];
  const loop = function (list: Property.Instance[], result: Property.Instance[]) {
    list.forEach((item, index) => {
      const children = item.children;
      delete item.children;
      result.push(item);
      if (children) {
        loop(children, result);
      }
    });
  };
  loop(list, result);
  return result;
};

export const propertyFormatPut = (list: Property.Instance[]): Property.ChangeData[] => {
  return list.map((item) => {
    return {
      dataType: item.dataType,
      id: item.id,
      propertyName: item.propertyName,
      remark: item.remark || '',
      simpData: item.simpData,
    };
  });
};
