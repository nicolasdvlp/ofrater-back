module.exports = (req, res, next) => {
    if (req.session.user){
        res.locals.connected_user = req.session.user;
    }
    else {
        res.locals.connected_user = false;
        throw new Error('Unauthorized. User must login.') 
    }
    next();


}