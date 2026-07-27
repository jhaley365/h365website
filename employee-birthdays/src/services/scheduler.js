const cron = require('node-cron');
const config = require('../config');
const { runDailyJob } = require('./birthdayService');

function startScheduler() {
  const cronExpression = `${config.sendMinute} ${config.sendHour} * * *`;

  cron.schedule(
    cronExpression,
    async () => {
      try {
        const result = await runDailyJob();
        console.log(
          `[scheduler] Daily job completed for ${result.today.iso}: ` +
            `${result.announcementResults.length} birthday(s) processed, ` +
            `summary status=${result.summaryResult.status}`
        );
      } catch (err) {
        console.error('[scheduler] Daily job failed:', err);
      }
    },
    { timezone: config.timezone }
  );

  console.log(
    `[scheduler] Daily birthday job scheduled for ${String(config.sendHour).padStart(2, '0')}:` +
      `${String(config.sendMinute).padStart(2, '0')} (${config.timezone})`
  );
}

module.exports = { startScheduler };
