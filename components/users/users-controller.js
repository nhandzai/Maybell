
const userServices = require('./users-service');
const passport = require('passport');

const getSignUp = (req, res) => {
    res.render('sign-up', { title: 'Sign Up' });
};
const getLogin = (req, res) => {
    res.render('log-in', { title: 'Log in' });
}

const createUser = async (req, res) => {
    const { fullName, email, password, country, city  } = req.body;

    try {
        const user = await userServices.registerUser(fullName, email, password, country, city);
        res.status(201).json({ message: 'User registered successfully.', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const authenticateUser = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
       
        if (err) {
            return res.status(500).json({ message: 'Server error during authentication', error: err });
        }
        if (!user) {
            return res.status(400).json({ message: info.message });
        }


        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Login failed.' });
            }
            return res.status(200).json({ message: 'Login successful', user });
        });
    })(req, res, next);
}
const getLogout = (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out.' });
        }
        res.redirect('/log-in');
    });
};


module.exports = {
    createUser, getSignUp, getLogin, authenticateUser, getLogout
};

