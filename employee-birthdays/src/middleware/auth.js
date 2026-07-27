function requireLogin(req, res, next) {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  req.session.redirectTo = req.originalUrl;
  return res.redirect('/login');
}

module.exports = { requireLogin };
