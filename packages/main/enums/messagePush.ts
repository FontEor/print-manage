import { ENUMS } from '../types/enums';
/**
 * 推送类型
 */
export const pushType: ENUMS.Instance[] = [
  {
    label: '全网推送',
    value: 5,
  },
  {
    label: '按版本号推送',
    value: 1,
  },
  {
    label: '按AppKey推送',
    value: 2,
  },
  {
    label: '按PIN推送',
    value: 3,
  },
  {
    label: '按机器ID推送',
    value: 4,
  },
];

export const pushTypeEnum: ENUMS.Obj = pushType.reduce((result: ENUMS.Obj, type) => {
  result[type.value] = type.label;
  return result;
}, {});

// 行为
export const actions: ENUMS.Instance[] = [
  {
    label: '立即展示',
    value: 1,
  },
  {
    label: '定时展示',
    value: 2,
  },
];

export const actionEnum: ENUMS.Obj = actions.reduce((result: ENUMS.Obj, type) => {
  result[type.value] = type.label;
  return result;
}, {});

export const states: ENUMS.Instance[] = [
  {
    label: '待审核',
    value: 1,
  },
  {
    label: '已推送',
    value: 2,
  },
  {
    label: '已驳回',
    value: 3,
  },
  {
    label: '已关闭',
    value: 4,
  },
];

export const statusEnum: ENUMS.Obj = states.reduce((result: ENUMS.Obj, type) => {
  result[type.value] = type.label;
  return result;
}, {});

export const formatMessageType = (type: number) => {
  return pushTypeEnum[type] || '';
};

export const formatMessageAction = (action: number) => {
  return actionEnum[action] || '';
};

export const formatMessageIsRepeat = (type: number) => {
  return type === 1 ? '否' : '是';
};

export const formatMessageState = (status: number) => {
  return statusEnum[status] || '';
};

export const formatTypeLabel = (type: number) => {
  switch (type) {
    case 1:
      return '版本号';
    case 2:
      return 'AppKey';
    case 3:
      return 'PIN';
    case 4:
      return '机器ID';
    default:
      return '';
  }
};
