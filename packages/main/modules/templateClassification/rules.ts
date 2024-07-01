import { FormRules } from 'element-plus';
import { EN, EN_NUM } from '@/const/regexp';

export const rules: FormRules = {
  code: [
    {
      required: true,
      message: '请输入编码',
    },
    {
      min: 2,
      max: 30,
      message: '请输入2-30位英文字母或数字',
    },
    {
      pattern: EN_NUM,
      message: '请输入2-30位英文字母或数字',
    },
  ],
  name: [
    {
      required: true,
      message: '请输入名称',
    },
    {
      min: 2,
      max: 30,
      message: '长度为2-30',
    },
  ],
};

export const editRules: FormRules = {
  name: rules.name,
};
