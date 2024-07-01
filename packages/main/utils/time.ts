import moment from 'moment';

export const dateToString = (date: string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  const time = moment(date).format(format);
  return time === 'Invalid date' ? '' : time;
};

export const secondToString = (second: number, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  const time = moment.unix(second).format(format);
  return time === 'Invalid date' ? '' : time;
};

export const millisecondToString = (
  millisecond: number,
  format = 'YYYY-MM-DD HH:mm:ss',
): string => {
  const time = moment(millisecond).format(format);
  return time === 'Invalid date' ? '' : time;
};

export const secondToDate = (second: number): Date => {
  return new Date(second * 1000);
};

export const millisecondToDate = (millisecond: number): Date => {
  return new Date(millisecond);
};

export const stringToSecond = (time: string): number => {
  return moment(time).unix();
};

export const stringToMillisecond = (time: string): number => {
  return moment(time).valueOf();
};

export const geTomorrowTimestamp = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export const getYesterdayTimestamp = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export const getTodayTimestamp = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}
