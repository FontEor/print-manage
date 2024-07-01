import moment from 'moment';

const startTime = moment().format('YYYY-MM-DD 00:00:00');
const endTime = moment().format('YYYY-MM-DD 23:59:59');

export const datetimes = [new Date(startTime), new Date(endTime)];
