const express = require('express');
const employeesDb = require('../db/employees');
const logsDb = require('../db/logs');
const { todayInTimezone, observedMonthDay, formatMonthDayForDisplay } = require('../utils/dates');
const config = require('../config');

const router = express.Router();

router.get('/', (req, res) => {
  const today = todayInTimezone();
  const employees = employeesDb.list();

  const todaysBirthdays = employees.filter(
    (e) => observedMonthDay(e.birth_date, today.year) === today.monthDay
  );

  const todayUtc = new Date(Date.UTC(today.year, Number(today.month) - 1, Number(today.day)));

  const upcoming = employees
    .map((e) => {
      const [month, day] = observedMonthDay(e.birth_date, today.year).split('-').map(Number);
      let occursOn = new Date(Date.UTC(today.year, month - 1, day));
      if (occursOn < todayUtc) {
        occursOn = new Date(Date.UTC(today.year + 1, month - 1, day));
      }
      const daysUntil = Math.round((occursOn - todayUtc) / 86400000);
      return { ...e, daysUntil, monthDayDisplay: formatMonthDayForDisplay(e.birth_date) };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 5);

  const summarySentToday = logsDb.hasSentSummary(today.iso);

  res.render('dashboard', {
    companyName: config.companyName,
    today,
    todaysBirthdays,
    upcoming,
    summarySentToday,
    totalEmployees: employees.length,
    sendTime: `${String(config.sendHour).padStart(2, '0')}:${String(config.sendMinute).padStart(2, '0')}`,
    timezone: config.timezone,
  });
});

module.exports = router;
