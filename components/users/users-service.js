const bcrypt = require('bcryptjs');
const { users } = require('../../library/models');
const { sendEmail } = require('../mail/sendMail.js');
require('dotenv').config();
// hàm check xem email pass word có null hay khôngkhông

async function checkPasswordEmailExist(email) {
    const user = await users.findOne({ where: { email } });
    if(user.googleId ) {
        return true;
    }
    return false;

   
}

async function checkEmailExist(email) {
    const user = await users.findOne({ where: { email } });
    return user;
}
async function sendResetPasswordEmail(email) {
    try {
        
        // tao password ngau nhien 10 ki tu
        const newPassword = Math.random().toString(36).slice(-10);
        await users.update({ password: newPassword }, { where: { email } });

        await sendEmail(email, 'Reset Your Password', ` Your new password: ${newPassword}`);
    }
    catch (err) {
        console.log(err);
    }
}
async function checkEmailExist(email) {
    const user = await users.findOne({ where: { email } });
    return user;
}



module.exports = {
    checkEmailExist,
    sendResetPasswordEmail,
    checkPasswordEmailExist,
    checkEmailExist
};
