const flash = require('connect-flash');


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

  
    req.flash('error', 'You need to log in to use this feature.');
    return res.redirect('/log-in');
     
 
}

module.exports = { isAuthenticated };
