#!/usr/bin/env node
const readline = require('readline');
const bcrypt = require('bcryptjs');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Enter the admin password to hash: ', (password) => {
  rl.close();
  if (!password) {
    console.error('No password entered.');
    process.exit(1);
  }
  const hash = bcrypt.hashSync(password, 12);
  console.log('\nAdd this to your .env file:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
});
