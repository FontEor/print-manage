import moment from 'moment';

export const timeHMSToISO = (time = ''): string => {
  if (!time) {
    return '';
  }
  const t = moment(`2000-01-01 ${time}`);
  if (t.isValid()) {
    return t.toISOString();
  }
  return time || '';
};
