const flash = require('connect-flash');
const db = require('../../library/models');


async function isAuthenticated(req, res, next) {

    if (req.isAuthenticated()) {
        const userId = req.user.id
        console.log("userId", userId)

        const user = await db.users.findOne({ where: { id: userId } });
        console.log("user", user)
        if (user.isBan) {
            req.flash('error', 'Your account has been banned.');
            return res.redirect('/log-out');
        }
        return next();
    }




    req.flash('error', 'You need to log in to use this feature.');
    return res.redirect('/log-in');


}

module.exports = { isAuthenticated };
