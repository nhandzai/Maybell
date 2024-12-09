const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const {users} = require('../../library/models');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
          
            try {
     
                const user = await users.findOne({ where: { email } });
                console.log("test2: ",user);
                if (!user) {
                    return done(null, false, { message: 'User not found.' });
                }


                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return done(null, false, { message: 'Invalid credentials.' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await users.findByPk(id,{
                attributes: ['id', 'fullName', 'email'] 
            });
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};
