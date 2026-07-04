import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import { timezones } from 'src/assets/data/timezones';

import constants from './constants';

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(isoWeek);
dayjs.extend(duration);

const formatDate = (value) => dayjs(value).format(constants.dateFormat);
const formatTime = (value) => dayjs(value).format(constants.timeFormat);
const formatTimeToUtc = (value) => dayjs.utc(value).format(constants.timeFormat);
const formatDateTime = (value) => dayjs(value).format(constants.dateTimeFormat);
const formatDateForStage = (value) => dayjs(value).format('YYYY-MM-DD');

const getTimeDuration = (startTime, endTime) => {
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  const duration = dayjs.duration(end.diff(start));

  const hours = Math.floor(duration.asHours());
  if (hours >= 1) return `${hours}h`;

  const minutes = Math.floor(duration.asMinutes());
  if (minutes >= 1) return `${minutes}m`;

  const seconds = Math.floor(duration.asSeconds());
  return `${seconds >= 1 ? seconds : 1}s`; // Minimum 1s
};

const convertMonthNumbersToName = (monthNumbers, yearDates) => {
  if (!Array.isArray(monthNumbers) || !Array.isArray(yearDates)) return [];

  return monthNumbers.map((monthNumber, index) => {
    if (monthNumber < 1 || monthNumber > 12) return 'Invalid';

    const monthName = dayjs()
      .month(monthNumber - 1)
      .format('MMM');

    const year = yearDates[index] !== undefined ? yearDates[index] : '';
    return `${monthName} - ${year}`.trim();
  });
};

const getWeeklyDateRanges = (weekNumbers, yearDates) => {
  if (!Array.isArray(weekNumbers) || !Array.isArray(yearDates)) return [];
  if (weekNumbers.length !== yearDates.length) return [];

  return weekNumbers.map((weekNumber, index) => {
    const year = yearDates[index];
    const fullYear = 2000 + parseInt(year, 10); // "25" → 2025

    const startDate = dayjs().year(fullYear).isoWeek(weekNumber).startOf('isoWeek');
    // const endDate = startDate.add(6, 'days');
    const formattedStart = startDate.format('DD MMM, YY');
    // const formattedEnd = endDate.format('MM/DD/YY');
    return `${formattedStart}`;
  });
};

const getCurrentTimeZone = () => {
  return dayjs.tz.guess();
};

const isUSTimezone = () => {
  const currentTimeZone = getCurrentTimeZone();
  const usTimezones = timezones.US.map((tz) => tz.value);
  return usTimezones.includes(currentTimeZone);
};

function isValidDate(value) {
  return dayjs(value).isValid();
}

function dateFromNow(value) {
  return dayjs(value).fromNow();
}

function getFromDate(value) {
  return dayjs.utc(value).startOf('d').toDate();
}

function getToDate(value) {
  return dayjs.utc(value).endOf('d').toDate();
}

function formatMinutes(totalMinutes) {
  // return dayjs.duration(totalMinutes, 'minutes').humanize(); // 2 days ago
  const dur = dayjs.duration(totalMinutes, 'minutes');

  const days = Math.floor(dur.asDays());
  const hours = dur.hours();
  const mins = dur.minutes();

  let parts = [];

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }

  if (mins > 0 || totalMinutes === 0) {
    parts.push(`${mins} min`);
  }

  return parts.join(' ');
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatTimeToUtc,
  getTimeDuration,
  convertMonthNumbersToName,
  getCurrentTimeZone,
  isUSTimezone,
  getWeeklyDateRanges,
  isValidDate,
  dateFromNow,
  getFromDate,
  getToDate,
  formatDateForStage,
  formatMinutes,
  addDays,
};
