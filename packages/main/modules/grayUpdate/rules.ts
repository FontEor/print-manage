import { FormRules } from 'element-plus';
import { NUM } from '@/const/regexp';

export const rules: FormRules = {
  name: [
    {
      required: true,
      message: '请输入策略名称',
    },
    {
      min: 2,
      max: 50,
      message: '长度为2-50',
    },
  ],
  version: [
    {
      required: true,
      message: '请输入版本号',
    },
    {
      min: 2,
      max: 10,
      message: '长度为2-10',
    },
  ],
  upgradeType: [
    {
      required: true,
      message: '请选择投放范围',
    },
  ],
};

export const otherRules: FormRules = {
  percentage: [
    {
      required: true,
      message: '请输入商家编码',
    },
    {
      pattern: NUM,
      message: '请输入整数',
    },
    {
      type: 'number',
      min: 1,
      max: 50,
      message: '输入范围为1~50',
    },
  ],
  appKey: [
    {
      required: true,
      message: '请输入appKey',
    },
    {
      validator: (rule, value, callback) => {
        const list = (value || '').split(',');
        if (list.length > 1000) {
          callback(new Error('appKey不得超过1000个'));
        }
        callback();
      },
    },
  ],
  pin: [
    {
      required: true,
      message: '请输入pin',
    },
    {
      validator: (rule, value, callback) => {
        const list = (value || '').split(',');
        if (list.length > 5000) {
          callback(new Error('pin不得超过5000个'));
        }
        callback();
      },
    },
  ],
  machineId: [
    {
      required: true,
      message: '请输入机器ID',
    },
    {
      validator: (rule, value, callback) => {
        const list = (value || '').split(',');
        if (list.length > 5000) {
          callback(new Error('机器ID不得超过1000个'));
        }
        callback();
      },
    },
  ],
};

export const editRules: FormRules = {
  traderName: rules.traderName,
};
