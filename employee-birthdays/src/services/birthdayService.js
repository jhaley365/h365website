const path = require('path');
const employeesDb = require('../db/employees');
const logsDb = require('../db/logs');
const { sendMail } = require('./mailer');
const { pickRandomBirthdayImage } = require('./images');
const { buildBirthdayEmail } = require('./templates/birthdayEmail');
const { buildManagementSummaryEmail } = require('./templates/managementSummaryEmail');
const { todayInTimezone, observedMonthDay, formatDateForDisplay } = require('../utils/dates');
const config = require('../config');

// Sends the birthday announcement for every employee whose birthday falls on
// `today` and who hasn't already been announced this year. Idempotent: safe
// to call more than once for the same day (e.g. after a server restart).
async function sendBirthdayAnnouncements(today) {
  const employees = employeesDb.list();
  const todaysEmployees = employees.filter(
    (e) => observedMonthDay(e.birth_date, today.year) === today.monthDay
  );

  const results = [];

  for (const employee of todaysEmployees) {
    if (logsDb.hasSentAnnouncement(employee.id, today.year)) {
      results.push({ employee, status: 'already-sent' });
      continue;
    }

    if (!config.birthdayAnnouncementTo) {
      logsDb.recordAnnouncement({
        employeeId: employee.id,
        sentDate: today.iso,
        sentYear: today.year,
        status: 'failed',
        errorMessage: 'BIRTHDAY_ANNOUNCEMENT_TO is not configured.',
      });
      results.push({ employee, status: 'failed', error: 'No recipient configured' });
      continue;
    }

    try {
      const imagePath = pickRandomBirthdayImage();
      const imageCid = 'birthday-image';
      const { subject, html, text } = buildBirthdayEmail({
        firstName: employee.first_name,
        lastName: employee.last_name,
        companyName: config.companyName,
        imageCid,
      });

      await sendMail({
        to: config.birthdayAnnouncementTo,
        subject,
        html,
        text,
        attachments: [
          {
            filename: path.basename(imagePath),
            path: imagePath,
            cid: imageCid,
          },
        ],
      });

      logsDb.recordAnnouncement({
        employeeId: employee.id,
        sentDate: today.iso,
        sentYear: today.year,
        status: 'sent',
      });
      results.push({ employee, status: 'sent' });
    } catch (err) {
      logsDb.recordAnnouncement({
        employeeId: employee.id,
        sentDate: today.iso,
        sentYear: today.year,
        status: 'failed',
        errorMessage: err.message,
      });
      results.push({ employee, status: 'failed', error: err.message });
    }
  }

  return results;
}

// Sends the daily management summary (full roster + today's announcement status).
// Idempotent per calendar day.
async function sendManagementSummary(today) {
  if (logsDb.hasSentSummary(today.iso)) {
    return { status: 'already-sent' };
  }

  if (!config.managementSummaryTo) {
    logsDb.recordSummary({
      sentDate: today.iso,
      status: 'failed',
      errorMessage: 'MANAGEMENT_SUMMARY_TO is not configured.',
    });
    return { status: 'failed', error: 'No recipient configured' };
  }

  const employees = employeesDb.list();
  const rows = employees.map((e) => {
    const isBirthdayToday = observedMonthDay(e.birth_date, today.year) === today.monthDay;
    return {
      firstName: e.first_name,
      lastName: e.last_name,
      email: e.email,
      birthDate: e.birth_date,
      isBirthdayToday,
      announcementSent: isBirthdayToday ? logsDb.hasSentAnnouncement(e.id, today.year) : false,
    };
  });

  try {
    const { subject, html, text } = buildManagementSummaryEmail({
      companyName: config.companyName,
      todayDisplay: formatDateForDisplay(today.iso),
      rows,
    });

    await sendMail({
      to: config.managementSummaryTo,
      subject,
      html,
      text,
    });

    logsDb.recordSummary({ sentDate: today.iso, status: 'sent' });
    return { status: 'sent' };
  } catch (err) {
    logsDb.recordSummary({ sentDate: today.iso, status: 'failed', errorMessage: err.message });
    return { status: 'failed', error: err.message };
  }
}

// Runs the full daily job: birthday announcements first, then the
// management summary (which reports on whether those announcements went out).
async function runDailyJob(today = todayInTimezone()) {
  const announcementResults = await sendBirthdayAnnouncements(today);
  const summaryResult = await sendManagementSummary(today);
  return { today, announcementResults, summaryResult };
}

module.exports = { sendBirthdayAnnouncements, sendManagementSummary, runDailyJob };
