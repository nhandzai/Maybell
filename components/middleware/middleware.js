function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    if (req.method === 'GET') {
     
        res.status(401).render('error', {
            message: 'You need to log in to use this feature.',
            error: { status: 401, stack: '' },
            title: 'error'
        });
    } else {
  
        res.status(401).json({
            message: 'You need to log in to use this feature.',
            error: { status: 401 }
        });
    }
}

module.exports = { isAuthenticated };
