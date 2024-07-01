import { FormRules } from 'element-plus';

const rules: FormRules = {
  title: [
    { required: true, trigger: 'change', message: '请填写计划标题' },
    { min: 5, max: 30, trigger: 'change', message: '长度为5-30' },
  ],
  timeRange: [
    {
      type: 'array',
      required: true,
      len: 2,
      fields: {
        0: { type: 'string', required: true },
        1: { type: 'string', required: true },
      },
      message: '请选择开始日期-结束日期',
    },
  ],
  channelRange: [
    {
      type: 'array',
      required: true,
      fields: { 0: { type: 'string', required: true } },
      message: '请选择打印渠道',
    },
  ],
  deliveryRange: [
    {
      type: 'array',
      required: true,
      fields: { 0: { type: 'string', required: true } },
      message: '请选择承运商',
    },
  ],
  // cityRange: [
  //   {
  //     type: 'array',
  //     fields: {
  //       0: {
  //         type: 'array',
  //         required: true,
  //         fields: { 0: { type: 'string', required: true } },
  //       },
  //     },
  //     message: '请选择收件人一级地址、二级地址',
  //   },
  // ],
  image: [{ required: true, trigger: 'change', message: '请上传图片' }],
  qrcode: [
    { required: true, trigger: 'change', type: 'url', message: '请输入正确的URL' },
    { pattern: /https?:\/\/.+/, trigger: 'change', message: '请输入正确的URL' },
  ],
};

export { rules };
