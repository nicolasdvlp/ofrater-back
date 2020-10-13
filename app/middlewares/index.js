function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && process.env.NODE_ENV !== "development") {
      return res.redirect('https://' + req.get('host') + req.url);
    }
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