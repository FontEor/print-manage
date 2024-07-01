import axios from '../../intercepts/cloud-print';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { UserData } from '../../../types/apis/userData';
import { userFormat, erpFormat } from '../../format/user';

// 代理请求多个
const userPinProxy = function wrapOptions(options: UserData.ErpPinQueryAxios): Promise<any> {
  return new Promise((resolve, reject) => {
    Promise.all([
      axios({
        url: '/users/pin/{erp}',
        method: 'get',
        ...options,
      }),
      axios({
        url: '/users/{erp}',
        method: 'get',
        ...options,
      }),
    ])
      .then((responses) => {
        const pinInstance = responses[0] as AxiosResponse<UserData.PinUserDataInstance>;
        const erpInstance = responses[1] as AxiosResponse<UserData.ErpInstance>;
        const result: UserData.UserAndErpInstance[] = [];
        if (erpInstance.data && erpInstance.data.pin) {
          result.push(erpFormat(erpInstance.data));
        }
        if (pinInstance.data && pinInstance.data.pin) {
          result.push(userFormat(pinInstance.data));
        }
        return resolve({
          data: result,
        });
      })
      .catch(reject);
  });
};

export { userPinProxy };
