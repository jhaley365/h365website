const express = require('express');
const employeesDb = require('../db/employees');
const logsDb = require('../db/logs');
const { todayInTimezone, formatDateForDisplay, formatMonthDayForDisplay, observedMonthDay } = require('../utils/dates');
const config = require('../config');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validateEmployeeInput(body) {
  const errors = [];
  const firstName = (body.firstName || '').trim();
  const lastName = (body.lastName || '').trim();
  const email = (body.email || '').trim();
  const birthDate = (body.birthDate || '').trim();

  if (!firstName) errors.push('First name is required.');
  if (!lastName) errors.push('Last name is required.');
  if (!email || !EMAIL_RE.test(email)) errors.push('A valid email address is required.');
  if (!birthDate || !DATE_RE.test(birthDate)) {
    errors.push('A valid birth date is required.');
  } else {
    const parsed = new Date(`${birthDate}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) {
      errors.push('Birth date is not a valid calendar date.');
    } else if (parsed.getTime() > Date.now()) {
      errors.push('Birth date cannot be in the future.');
    }
  }

  return { errors, values: { firstName, lastName, email, birthDate } };
}

function withDisplayFields(employee) {
  const today = todayInTimezone();
  const isBirthdayToday = observedMonthDay(employee.birth_date, today.year) === today.monthDay;
  return {
    ...employee,
    birthDateDisplay: formatDateForDisplay(employee.birth_date),
    birthMonthDayDisplay: formatMonthDayForDisplay(employee.birth_date),
    isBirthdayToday,
    announcedThisYear: logsDb.hasSentAnnouncement(employee.id, today.year),
  };
}

router.get('/', (req, res) => {
  const employees = employeesDb.list().map(withDisplayFields);
  res.render('employees/list', { employees, companyName: config.companyName });
});

router.get('/new', (req, res) => {
  res.render('employees/form', {
    mode: 'create',
    employee: { firstName: '', lastName: '', email: '', birthDate: '' },
    errors: [],
  });
});

router.post('/', (req, res) => {
  const { errors, values } = validateEmployeeInput(req.body);
  if (errors.length) {
    return res.status(400).render('employees/form', { mode: 'create', employee: values, errors });
  }
  employeesDb.create(values);
  res.redirect('/employees');
});

router.get('/:id/edit', (req, res) => {
  const employee = employeesDb.get(req.params.id);
  if (!employee) return res.status(404).render('employees/not-found');
  res.render('employees/form', {
    mode: 'edit',
    employee: {
      id: employee.id,
      firstName: employee.first_name,
      lastName: employee.last_name,
      email: employee.email,
      birthDate: employee.birth_date,
    },
    errors: [],
  });
});

router.post('/:id', (req, res) => {
  const existing = employeesDb.get(req.params.id);
  if (!existing) return res.status(404).render('employees/not-found');

  const { errors, values } = validateEmployeeInput(req.body);
  if (errors.length) {
    return res
      .status(400)
      .render('employees/form', { mode: 'edit', employee: { id: existing.id, ...values }, errors });
  }
  employeesDb.update(req.params.id, values);
  res.redirect('/employees');
});

router.post('/:id/delete', (req, res) => {
  const existing = employeesDb.get(req.params.id);
  if (existing) employeesDb.remove(req.params.id);
  res.redirect('/employees');
});

module.exports = router;
