const path = require('path');
const express = require('express');
const session = require('express-session');
const config = require('./src/config');
require('./src/db'); // ensures tables are created before anything else runs

const authRoutes = require('./src/routes/auth');
const dashboardRoutes = require('./src/routes/dashboard');
const employeesRoutes = require('./src/routes/employees');
const { requireLogin } = require('./src/middleware/auth');
const { startScheduler } = require('./src/services/scheduler');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    name: 'birthdays.sid',
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    },
  })
);

app.use(authRoutes);
app.use('/', requireLogin, dashboardRoutes);
app.use('/employees', requireLogin, employeesRoutes);

app.use((req, res) => {
  res.status(404).send('Not found');
});

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`Employee Birthdays app listening on port ${config.port}`);
    startScheduler();
  });
}

module.exports = app;
