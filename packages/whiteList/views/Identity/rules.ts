import { UnwrapNestedRefs } from 'vue';
import { WhiteList } from '../../types/apis/whiteList';
import type { FormRules } from 'element-plus';
import { request } from '../../axios';

const businessInfoValid = (form: UnwrapNestedRefs<WhiteList.SubmitExamine>) => {
  const { companyName, companyCode, companyMerchantCode, scene } = form;
  return new Promise((resolve, reject) => {
    if (companyName && companyCode && companyMerchantCode && scene) {
      request
        .whiteBusinessFirm({
          data: {
            companyName,
            companyCode,
            companyMerchantCode,
            scene,
          },
        })
        .then((response) => {
          const { code, data } = response || {};
          if (code === 0) {
            return reject({ message: '企业信息与商家编码不匹配，请填写合同签约时的企业信息' });
          } else {
            return resolve(data);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    } else {
      return reject({ message: '请填写正确的企业与商家编码' });
    }
  });
};

export default function (form: UnwrapNestedRefs<WhiteList.SubmitExamine>): FormRules {
  return {
    companyName: [
      { required: true, message: '请填写企业名称', trigger: 'blur' },
      {
        min: 2,
        max: 1000,
        message: '企业名称需要大于等于2个字符，小于等于1000个字符',
        trigger: 'blur',
      },
    ],
    companyCode: [
      {
        required: true,
        message: '请填写企业社会信用代码',
        trigger: 'blur',
      },
      {
        pattern: /^[0-9A-Z]{18}$/,
        message: '请输入包含大写字母和数字的18位字符',
      },
    ],
    companyMerchantCode: [
      {
        required: true,
        trigger: 'blur',
        message: '请填写商家编码',
      },
      {
        validator: (rule, value, callback) => {
          businessInfoValid(form)
            .then(() => {
              callback();
            })
            .catch((reason) => {
              callback(reason.message);
            });
        },
        trigger: 'blur',
      },
    ],
    companyContact: [
      {
        required: true,
        min: 1,
        max: 10,
        message: '联系人长度需小于等于10个字符',
        trigger: 'blur',
      },
    ],
    companyNumber: [
      {
        required: true,
        trigger: 'blur',
        min: 1,
        max: 20,
        message: '联系电话长度需小于等于20个字符',
      },
    ],
    companyMail: [
      {
        required: true,
        trigger: 'blur',
        min: 1,
        max: 100,
        message: '联系邮箱长度需小于等于100个字符',
      },
      {
        pattern: /^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/,
        message: '请输入正确的邮箱地址',
        trigger: 'blur',
      },
    ],
    platformType: [{ required: true, trigger: 'blur', message: '请选择平台' }],
    appKey: [
      {
        required: true,
        trigger: 'blur',
        message: '不能为空',
      },
    ],
    sysName: [
      {
        required: true,
        trigger: 'blur',
        min: 1,
        max: 50,
        message: '系统名称长度小于等于50个字符',
      },
    ],
    waybillCode: [
      {
        required: true,
        trigger: 'blur',
        min: 1,
        max: 20,
        message: '运单号长度小于等于20个字符',
      },
      {
        validator: (rule, value, callback) => {
          if (!form.appKey || !form.companyMerchantCode) {
            return callback(new Error('请输入合法的企业商家编码、AppKey'));
          }
          if (!form.waybillCode) {
            return callback(new Error('请输入运单号'));
          }
          form.generateTempUrl = '';
          request
            .whiteGenerateTemplate({
              data: {
                appKey: form.appKey,
                companyMerchantCode: form.companyMerchantCode,
                scene: form.scene,
                waybillCode: form.waybillCode,
              },
            })
            .then((response) => {
              const { code, data } = response || {};
              if (code === 0) {
                callback(new Error('系统未查询到此运单号'));
              } else {
                form.generateTempUrl = data;
                callback();
              }
            })
            .catch(() => {
              callback(new Error('系统未查询到此运单号'));
            });
        },
        trigger: 'blur',
      },
    ],
    hasCustomArea: [
      {
        required: true,
        trigger: 'blur',
        message: '请选择是否含京东物流电子面单标准元素外的自定义元素',
      },
    ],
    imageUrl: [{ required: true, trigger: 'blur', message: '请上传面单' }],
  };
}
