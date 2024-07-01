import { FormRules } from 'element-plus';

export const rules: FormRules = {
  traderCodeType: [
    {
      required: true,
      message: '请选择商家编码类型',
    },
  ],
  traderCode: [
    {
      required: true,
      message: '请输入商家编码',
    },
  ],
  traderName: [
    {
      required: true,
      message: '请输入商家名称',
    },
    {
      max: 100,
      message: '不得超过100个字符',
    },
  ],
  traderJdAccount: [
    // {
    //   required: true,
    //   message: '请输入商家京东账号',
    // },
    {
      max: 100,
      message: '不得超过100个字符',
    },
  ],
  categories: [
    {
      required: true,
      message: '请选择模板分类',
    },
  ],
  templateCode: [
    {
      required: true,
      message: '请输入模板编码',
    },
  ],
  templateId: [
    {
      required: true,
      message: '请检查模板编码与模板分类是否错误',
    },
  ],
  remark: [
    {
      required: true,
      message: '请输入配置说明',
    },
    {
      max: 200,
      message: '不得超过200个字符',
    },
  ],
};

export const editRules: FormRules = {
  traderJdAccount: rules.traderJdAccount,
  remark: rules.remark,
};
