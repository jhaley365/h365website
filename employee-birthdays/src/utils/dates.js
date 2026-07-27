const config = require('../config');

// Returns { year, month, day, iso, monthDay } for "today" in the configured timezone,
// independent of the server's own local timezone.
function todayInTimezone(timezone = config.timezone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const map = {};
  for (const { type, value } of parts) map[type] = value;

  const year = Number(map.year);
  const month = map.month; // '01'..'12'
  const day = map.day; // '01'..'31'

  return {
    year,
    month,
    day,
    iso: `${map.year}-${month}-${day}`,
    monthDay: `${month}-${day}`,
  };
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Employees born on Feb 29 celebrate on Feb 28 during non-leap years.
function observedMonthDay(birthDate, year) {
  const monthDay = birthDate.slice(5, 10); // 'MM-DD'
  if (monthDay === '02-29' && !isLeapYear(year)) {
    return '02-28';
  }
  return monthDay;
}

function formatDateForDisplay(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatMonthDayForDisplay(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

module.exports = {
  todayInTimezone,
  isLeapYear,
  observedMonthDay,
  formatDateForDisplay,
  formatMonthDayForDisplay,
};
