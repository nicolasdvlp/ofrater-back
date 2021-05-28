function requireHTTPS(req, res, next) {
  if ((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
    res.redirect('https://' + req.get('Host') + req.url);
  }
  else
    next();
}

function userConnect(req, res, next) {

  console.log(req.session.user);

  if (req.session.user) {
    res.locals.connected_user = req.session.user;
    next();
  } else {
    res.locals.connected_user = false;
    res.status(401).json('Unauthorized. User must login')
  }
}

module.exports = { userConnect, requireHTTPS };