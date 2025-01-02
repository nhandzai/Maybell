
const userServices = require('./users-service');
const passport = require('passport');
const { users } = require('../../library/models');

const getSignUp = (req, res) => {
    res.render('sign-up', { title: 'Sign Up' });
};
const getLogin = (req, res) => {
    res.render('log-in', { title: 'Log in' });
}
const getForgotPassword = (req, res) => {
    res.render('forgot-password', {title: 'Forgot password' })
}

const createUser = (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Server error during registration', error: err });
        }
        if (!user) {
            return res.status(400).json({ message: info.message });
        }

        res.status(201).json({
            message: 'Registration successful. A verification email has been sent. Please verify your email.',
            user: { email: user.email },
        });
    })(req, res, next);
};



const authenticateUser = async (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {

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
const verifyEmail = async (req, res) => {
    const { token } = req.query;
    if (!req.session.token || req.session.token !== token) {
        return res.status(400).send('Invalid or expired token.');
    }

    try {
        const user = await users.findOne({ where: { id: req.session.userId } });
        if (!user) {
            return res.status(400).send('Invalid or expired token.');
        }
        user.isVerified = true;
        await user.save();
        return res.status(200).send('Email verified successfully.');
    }
    catch (error) {
        return res.status(500).send('Server error.');
    }
}
const handleGoogleCallback = async (req, res, next) => {
    passport.authenticate('google', async (err, user, info) => {
        if (err) {
            req.flash('error', 'Error during Google authentication: ' + err.message);
            return res.redirect('/log-in');
        }
        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/log-in');
        }

        req.logIn(user, (err) => {
            if (err) {
                req.flash('error', 'Login failed.');
                return res.redirect('/log-in');
            }

            
            const action = req.query.state;
            if (action === 'register') {
                req.flash('success', 'Registration successful! Please verify your email.');
            } else if (action === 'login') {
                req.flash('success', 'Login successful!');
            }
            return res.redirect('/');
        });
    })(req, res, next);
};






module.exports = {
    createUser, getSignUp, getLogin, authenticateUser, getLogout, verifyEmail, handleGoogleCallback, getForgotPassword
};

