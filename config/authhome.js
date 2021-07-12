module.exports = {
    ensureAuthenticatedHome: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        res.render('welcome');
    
    }
}