import { ElMessage, MessageHandler } from 'element-plus';
import { requestV2 } from '@/axios/request';
import { UserData } from '@/types/apis/userData';
import { erpFormat } from '@/axios/format/user';

let loading: MessageHandler | undefined = undefined;

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

export default function () {
  const getERP = function (erp: string): Promise<UserData.UserAndErpInstance> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await requestV2.userErpInfo({
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
  };
}
