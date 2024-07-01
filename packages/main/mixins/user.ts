import { ElMessage, MessageHandler } from 'element-plus';
import { requestV1 } from '@/axios/request';
import { UserData } from '@/types/apis/userData';
import { erpFormat, userFormat } from '@/axios/format/user';

let loading: MessageHandler | undefined = undefined;
let bLoading: MessageHandler | undefined = undefined;

const messageFn = () => {
  if (loading) {
    return;
  }
  loading = ElMessage.error({
    type: 'error',
    message: '未查询到数据，请检查是否填写错误',
    onClose: () => {
      loading = undefined;
    },
  });
};

/**
 * 不是Bpin的提示语 需要允许与上面的提示语同时显示
 */
const messageBPinFn = () => {
  if (bLoading) {
    return;
  }
  bLoading = ElMessage.error({
    type: 'error',
    message: '此用户Pin不是企业用户',
    onClose: () => {
      bLoading = undefined;
    },
  });
};
// 新建系统没有显示成员名称

export default function () {
  const getUserOrErp = function (erpOrPin: string): Promise<UserData.UserAndErpInstance[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await requestV1.userPinProxy({
          replacements: {
            erp: erpOrPin,
          },
        });
        const data = response.data || [];
        // 如果数据不存在
        if (!data.length) {
          messageFn();
        }
        return resolve(data);
      } catch (error) {
        return reject(error);
      }
    });
  };

  const getUser = function (pin: string, mustBPin: boolean): Promise<UserData.UserAndErpInstance> {
    return new Promise(async (resolve, reject) => {
      try {
        // if (mustBPin) {
        //   const isBPin = await requestV1.userPinIsBPin({
        //     replacements: {
        //       pin
        //     }
        //   })
        //   if(!isBPin){
        //     return reject(new Error('此pin不是B Pin'))
        //   }
        // }
        const response = await requestV1.userPinInfo({
          replacements: {
            pin,
          },
        });
        const data = response.data;
        // 如果数据不存在
        if (!data || !data.pin) {
          messageFn();
        }
        if (mustBPin && data.bpin !== true) {
          messageBPinFn();
          return reject(new Error('此pin不是B Pin'));
        }
        return resolve(userFormat(data));
      } catch (error) {
        return reject(error);
      }
    });
  };

  const getERP = function (erp: string): Promise<UserData.UserAndErpInstance> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await requestV1.userErpInfo({
          replacements: {
            erp,
          },
        });
        const data = response.data;
        // 如果数据不存在
        if (!data || !data.pin) {
          return messageFn();
        }
        return resolve(erpFormat(data));
      } catch (error) {
        return reject(error);
      }
    });
  };

  return {
    getERP,
    getUser,
    getUserOrErp,
  };
}
