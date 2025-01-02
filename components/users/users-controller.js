
const userServices = require('./users-service');
const passport = require('passport');
const { users } = require('../../library/models');
const client = require('../redis/redis.js');
const { mergeCart } = require('../cart/cart-model.js');

const getSignUp = (req, res) => {
    res.render('sign-up', { title: 'Sign Up' });
};
const getLogin = (req, res) => {
    res.render('log-in', { title: 'Log in' });
}
const getForgotPassword = (req, res) => {
    res.render('forgot-password', { title: 'Forgot Password' });
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
    const sessionKey = `cart:${req.sessionID}`;
    passport.authenticate('login', (err, user, info) => {

        if (err) {
            return res.status(500).json({ message: 'Server error during authentication', error: err });
        }
        if (!user) {
            return res.status(400).json({ message: info.message });
        }


        req.logIn(user, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Login failed.' });
            }
            const userId = user.id;

            console.log('sessionKey', sessionKey);
            console.log('userId', userId);
            await mergeCart(userId, sessionKey);
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

    // Kiểm tra token từ Redis
    try {
        const userId = await client.get(`verify:${token}`);

        if (!userId) {
            req.flash('error', 'Invalid or expired token.');
            return res.redirect('/');
        }

        // Tìm user từ database dựa trên userId
        const user = await users.findOne({ where: { id: userId } });
        if (!user) {
            req.flash('error', 'Invalid or expired token.');
            return res.redirect('/');
        }

        user.isVerified = true;
        await user.save();

        await client.del(`verify:${token}`);
        req.flash('success', 'Email verified successfully.');
        return res.redirect('/');

    } catch (error) {
        console.error('Error verifying email:', error);
        return res.status(500).send('Server error.');
    }
};

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
        const action = req.query.state;
        if (action === 'register') {
            req.flash('success', 'Registration successful! Please verify your email.');
            return res.redirect('/log-in');

        } else
            if (action === 'login') {


                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', 'Login failed.');
                        return res.redirect('/log-in');
                    }


                    req.flash('success', 'Login successful!');
                    return res.redirect('/');
                });
            }
    })(req, res, next);
};






module.exports = {
    createUser, getSignUp, getLogin, authenticateUser, getLogout, verifyEmail, handleGoogleCallback, getForgotPassword
};

