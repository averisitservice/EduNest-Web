import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import constants from './constants';

dayjs.extend(utc);
dayjs.extend(tz);

const formatDate = (value) => (value ? dayjs(value).format(constants.dateFormat) : '');
const formatTime = (value) => (value ? dayjs(value).format(constants.timeFormat) : '');
const formatDateTime = (value) => (value ? dayjs(value).format(constants.dateTimeFormat) : '');

function isValidDate(value) {
  return Boolean(value) && dayjs(value).isValid();
}

export default {
  formatDate,
  formatDateTime,
  formatTime,
  isValidDate,
};
