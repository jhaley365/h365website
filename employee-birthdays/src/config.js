require('dotenv').config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  return value;
}

module.exports = {
  port: Number(process.env.PORT || 3000),
  sessionSecret: required('SESSION_SECRET', 'insecure-dev-secret-change-me'),

  adminUsername: required('ADMIN_USERNAME', 'admin'),
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',

  dbPath: required('DB_PATH', './data/birthdays.db'),

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
  },
  mailFrom: required('MAIL_FROM', '"Haley365 HR" <hr@haley365.com>'),

  birthdayAnnouncementTo: required('BIRTHDAY_ANNOUNCEMENT_TO', ''),
  managementSummaryTo: required('MANAGEMENT_SUMMARY_TO', ''),

  timezone: required('TIMEZONE', 'America/New_York'),
  sendHour: Number(process.env.SEND_HOUR || 8),
  sendMinute: Number(process.env.SEND_MINUTE || 0),

  companyName: required('COMPANY_NAME', 'Haley365'),
};
