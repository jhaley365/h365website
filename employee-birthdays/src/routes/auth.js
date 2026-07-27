const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const config = require('../config');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts. Please try again in a few minutes.',
});

router.get('/login', (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    return res.redirect('/');
  }
  res.render('login', { error: null });
});

router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!config.adminPasswordHash) {
    return res.render('login', {
      error:
        'No admin password is configured on the server. Set ADMIN_PASSWORD_HASH (see README) and restart.',
    });
  }

  const usernameMatches = typeof username === 'string' && username === config.adminUsername;
  const passwordMatches =
    typeof password === 'string' && bcrypt.compareSync(password, config.adminPasswordHash);

  if (!usernameMatches || !passwordMatches) {
    return res.render('login', { error: 'Invalid username or password.' });
  }

  req.session.regenerate((err) => {
    if (err) {
      return res.render('login', { error: 'Something went wrong. Please try again.' });
    }
    req.session.isAuthenticated = true;
    req.session.username = username;
    const redirectTo = req.session.redirectTo || '/';
    delete req.session.redirectTo;
    res.redirect(redirectTo);
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
