module.exports = (req, res, next) => {

    console.log(req.session.user);

    if (req.session.user){
        res.locals.connected_user = req.session.user;
        next();

    }
    else {
        res.locals.connected_user = false;
        res.status(401).json('Unauthorized. User must login')
    }


}