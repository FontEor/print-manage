import { General } from '../../types/general';
import moment from 'moment';

/**
 * 解构时间戳
 * @param {Date[]} dates 时间数据数组
 * @param {string[]} keys 数据库列表
 * @param {T extends General.G_A_Object} target 目标数据
 * @returns {T}
 */
export function deconstructionTimestamp<T>(
  dates: [Date?, Date?],
  keys: [string, string],
  target: T extends {} ? any : any,
): T {
  dates = dates || [];
  keys.forEach((key, index) => {
    const targetKey = key;
    const value = dates[index];
    if (targetKey && value) {
      // 不这么写 类型断言会错误 没有找到断言错误的原因 暂时先这么处理
      Object.assign(target, {
        [targetKey]: moment(value).format('YYYY-MM-DD HH:mm:ss'),
      });
    }
  });
  return target;
}

export function formatDataString(date: string | Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const time = moment(date).format(format);
  if (time.toString() === 'Invalid date') {
    return '';
  }
  return time;
}
