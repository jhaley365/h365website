const db = require('./index');

const insertAnnouncementStmt = db.prepare(`
  INSERT INTO announcement_log (employee_id, sent_date, sent_year, status, error_message)
  VALUES (@employeeId, @sentDate, @sentYear, @status, @errorMessage)
`);

const findSentAnnouncementStmt = db.prepare(`
  SELECT * FROM announcement_log
  WHERE employee_id = ? AND sent_year = ? AND status = 'sent'
  ORDER BY id DESC LIMIT 1
`);

const findAnnouncementsForDateStmt = db.prepare(`
  SELECT * FROM announcement_log WHERE sent_date = ? AND status = 'sent'
`);

const insertSummaryStmt = db.prepare(`
  INSERT INTO daily_summary_log (sent_date, status, error_message)
  VALUES (@sentDate, @status, @errorMessage)
`);

const findSentSummaryStmt = db.prepare(`
  SELECT * FROM daily_summary_log WHERE sent_date = ? AND status = 'sent' LIMIT 1
`);

function recordAnnouncement({ employeeId, sentDate, sentYear, status, errorMessage = null }) {
  return insertAnnouncementStmt.run({ employeeId, sentDate, sentYear, status, errorMessage });
}

// Has a *successful* announcement already gone out for this employee this year?
function hasSentAnnouncement(employeeId, sentYear) {
  return Boolean(findSentAnnouncementStmt.get(employeeId, sentYear));
}

function announcementsSentOn(sentDate) {
  return findAnnouncementsForDateStmt.all(sentDate);
}

function recordSummary({ sentDate, status, errorMessage = null }) {
  return insertSummaryStmt.run({ sentDate, status, errorMessage });
}

// Has the daily management summary already gone out successfully today?
function hasSentSummary(sentDate) {
  return Boolean(findSentSummaryStmt.get(sentDate));
}

module.exports = {
  recordAnnouncement,
  hasSentAnnouncement,
  announcementsSentOn,
  recordSummary,
  hasSentSummary,
};
