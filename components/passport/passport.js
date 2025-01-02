const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { sendEmail } = require('../mail/sendMail.js');
const bcrypt = require('bcryptjs');
const { users } = require('../../library/models');
const crypto = require('crypto');
const client = require('../redis/redis.js');



module.exports = (passport) => {

    passport.use(
        'login',
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await users.findOne({ where: { email } });
                if (!user) {
                    return done(null, false, { message: 'Invalid email or password.' });
                }
                if (!user.isVerified) {
                    return done(null, false, { message: 'Please verify your email first.' });
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return done(null, false, { message: 'Invalid email or password.' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.use(
        'register',
        new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
            try {
                const { fullName } = req.body;
                if (!fullName || !email || !password) {
                    return done(null, false, { message: 'All fields are required.' });
                }
                const existingUser = await users.findOne({ where: { email } });
                if (existingUser) {
                    return done(null, false, { message: 'Email already in use.' });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const newUser = await users.create({
                    fullName,
                    email,
                    password: hashedPassword,
                    isVerified: false,
                });

                const verificationToken = crypto.randomBytes(32).toString('hex');
                const expiry = 24 * 60 * 60; // 24 giờ (TTL)
                await client.set(`verify:${verificationToken}`, newUser.id, { EX: expiry });
                const verificationLink = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;
                await sendEmail(newUser.email, 'Verify Your Email', `Click the link to verify your account: ${verificationLink}`);


                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/google/callback',
                passReqToCallback: true,
            },
            async (req, accessToken, refreshToken, profile, done) => {
                try {

                    const action = req.query.state;

                    if (action === 'register') {

                        let user = await users.findOne({ where: { googleId: profile.id } });
                        if (user) {
                            return done(null, false, { message: 'Account already exists.' });
                        }
                        user = await users.create({
                            googleId: profile.id,
                            fullName: profile.displayName,
                            email: profile.emails[0]?.value,
                            isVerified: false,
                        });
                        req.session.userId = user.id;
                        const verificationToken = crypto.randomBytes(32).toString('hex');
                        const expiry = 24 * 60 * 60; // 24 giờ (TTL)
                        await client.set(`verify:${verificationToken}`, user.id, { EX: expiry });
                        const verificationLink = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;
                        await sendEmail(user.email, 'Verify Your Email', `Click the link to verify your account: ${verificationLink}`);


                        return done(null, user);
                    } else if (action === 'login') {
                        const user = await users.findOne({ where: { googleId: profile.id } });
                        if (!user) {
                            return done(null, false, { message: 'Account does not exist' });
                        }
                        if (!user.isVerified) {
                            return done(null, false, { message: 'Please verify your email first.' });
                        }
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Invalid action.' });
                    }
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );


    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await users.findByPk(id, {
                attributes: ['id', 'fullName', 'email'],
            });
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};
