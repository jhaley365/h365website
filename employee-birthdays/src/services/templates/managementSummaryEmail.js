const { escapeHtml } = require('../../utils/html');
const { formatDateForDisplay } = require('../../utils/dates');

function buildManagementSummaryEmail({ companyName, todayDisplay, rows }) {
  const birthdaysToday = rows.filter((r) => r.isBirthdayToday);
  const subject = `Employee Birthday Summary — ${todayDisplay}${
    birthdaysToday.length ? ` (${birthdaysToday.length} today)` : ''
  }`;

  const tableRows = rows
    .map((r) => {
      const highlight = r.isBirthdayToday ? ' style="background:#fff7e0;"' : '';
      const sentCell = r.isBirthdayToday ? (r.announcementSent ? 'Yes' : 'No') : '—';
      return `
        <tr${highlight}>
          <td style="padding:8px 12px; border-bottom:1px solid #e3e7ee;">${escapeHtml(r.firstName)} ${escapeHtml(r.lastName)}</td>
          <td style="padding:8px 12px; border-bottom:1px solid #e3e7ee;">${escapeHtml(r.email)}</td>
          <td style="padding:8px 12px; border-bottom:1px solid #e3e7ee;">${escapeHtml(formatDateForDisplay(r.birthDate))}</td>
          <td style="padding:8px 12px; border-bottom:1px solid #e3e7ee;">${r.isBirthdayToday ? '🎂 Yes' : ''}</td>
          <td style="padding:8px 12px; border-bottom:1px solid #e3e7ee;">${sentCell}</td>
        </tr>`;
    })
    .join('');

  const html = `
<!doctype html>
<html>
  <body style="margin:0; padding:0; background:#f6f8fb; font-family: -apple-system, Arial, sans-serif; color:#0c111e;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff; border:1px solid #e3e7ee; border-radius:10px; padding:24px;">
            <tr>
              <td>
                <h1 style="font-size:20px; margin:0 0 4px;">Employee Birthday Summary</h1>
                <p style="margin:0 0 16px; color:#5b6675; font-size:13px;">${escapeHtml(todayDisplay)} &middot; ${escapeHtml(companyName)}</p>
                <p style="margin:0 0 16px; font-size:14px;">
                  <strong>${birthdaysToday.length}</strong> employee birthday(s) today.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:13px;">
                  <thead>
                    <tr>
                      <th align="left" style="padding:8px 12px; border-bottom:2px solid #0c111e; color:#5b6675;">Name</th>
                      <th align="left" style="padding:8px 12px; border-bottom:2px solid #0c111e; color:#5b6675;">Email</th>
                      <th align="left" style="padding:8px 12px; border-bottom:2px solid #0c111e; color:#5b6675;">Birth date</th>
                      <th align="left" style="padding:8px 12px; border-bottom:2px solid #0c111e; color:#5b6675;">Birthday today?</th>
                      <th align="left" style="padding:8px 12px; border-bottom:2px solid #0c111e; color:#5b6675;">Announcement sent</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${tableRows || '<tr><td colspan="5" style="padding:12px;">No employees in the system yet.</td></tr>'}
                  </tbody>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const textLines = rows.map(
    (r) =>
      `${r.firstName} ${r.lastName} <${r.email}> — ${formatDateForDisplay(r.birthDate)}` +
      (r.isBirthdayToday ? ` — BIRTHDAY TODAY — announcement sent: ${r.announcementSent ? 'yes' : 'no'}` : '')
  );
  const text = `Employee Birthday Summary — ${todayDisplay}\n\n${birthdaysToday.length} employee birthday(s) today.\n\n${textLines.join('\n')}`;

  return { subject, html, text };
}

module.exports = { buildManagementSummaryEmail };
