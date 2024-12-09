const bcrypt = require('bcryptjs');
const { users} = require('../../library/models');
require('dotenv').config();

const registerUser = async (fullName, email, password, country, city) => {
    if (!fullName || !email || !password|| !country || !city) {
        throw new Error('All fields are required.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await users.create({
            fullName,
            email,
            password: hashedPassword,
            country,
            city
        });

        return user;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Email already in use.');
        }
        throw new Error('Server error.');
    }
};




module.exports = {
    registerUser
};
