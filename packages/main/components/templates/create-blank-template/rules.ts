import { FormRules } from 'element-plus';
import { InternalRuleItem } from 'async-validator/dist-types/interface';

const validateSize = (
  rule: InternalRuleItem,
  value: string,
  callback: (error?: string | Error) => void,
) => {
  if (Number(value) > 500 || Number(value) < 1) {
    callback(new Error('可设置范围为1-500mm'));
    return;
  }
  callback();
};

const rules: FormRules = {
  code: [
    { required: true, trigger: 'change', message: '请填写模板编码' },
    { min: 2, max: 50, trigger: 'change', message: '长度为2-50' },
    {
      validator: function (rule, value, callback) {
        const reg = /^[a-zA-Z0-9.\-_]+$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error('字符类型只能是英文、数字、.、-、_'));
        }
      },
      trigger: 'change',
    },
  ],
  name: [
    { required: true, trigger: 'change', message: '请填写模板名称' },
    { min: 2, max: 50, trigger: 'change', message: '长度为2-50' },
  ],
  category: [{ required: true, trigger: 'change', message: '请选择模板分类' }],
  width: [
    { required: true, trigger: 'change', message: '请选择纸张尺寸' },
    { validator: validateSize, trigger: 'change', message: '可设置范围为1-500mm' },
  ],
  height: [
    { required: true, trigger: 'change', message: '请选择纸张尺寸' },
    { validator: validateSize, trigger: 'change', message: '可设置范围为1-500mm' },
  ],
  hasCustom: [{ required: true, trigger: 'change', message: '请选择' }],
  des: [
    { required: true, trigger: 'change', message: '请填写使用说明' },
    { min: 10, max: 100, trigger: 'change', message: '长度为10-100' },
  ],
  extend1: [{ trigger: 'change', message: '长度为0-50', min: 0, max: 50 }],
  extend2: [{ trigger: 'change', message: '长度为0-50', min: 0, max: 50 }],
  extend3: [{ trigger: 'change', message: '长度为0-50', min: 0, max: 50 }],
  extend4: [{ trigger: 'change', message: '长度为0-50', min: 0, max: 50 }],
  extend5: [{ trigger: 'change', message: '长度为0-50', min: 0, max: 50 }],
};

export { rules };
