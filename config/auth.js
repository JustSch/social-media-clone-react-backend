module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        res.status(403).send('You Are Not Authorized To Access This Resource');
    }
}