#!/usr/bin/env node
// Manually runs the daily birthday-announcement + management-summary job right now.
// Useful for testing SMTP configuration or re-running after a failure.
// Idempotent: employees already announced this year / summaries already sent
// today will be skipped (see src/services/birthdayService.js).
const { runDailyJob } = require('../src/services/birthdayService');

runDailyJob()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
