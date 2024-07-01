import { UserData } from '../../../types/apis/userData';

// 格式化用户数据
export const userFormat = (
  pinInstance: UserData.PinUserDataInstance,
): UserData.UserAndErpInstance => {
  return {
    pin: pinInstance.pin,
    deptName: pinInstance.comName || '',
    type: 3,
    label: `${pinInstance.pin}[PIN]`,
    name: pinInstance.nickname,
  };
};

// 格式化ERP数据
export const erpFormat = (erpInstance: UserData.ErpInstance): UserData.UserAndErpInstance => {
  return {
    pin: erpInstance.pin,
    deptName: erpInstance.deptName,
    type: 0,
    label: `${erpInstance.pin}[ERP]`,
    name: erpInstance.name,
  };
};
