const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'; 
const REFRESH_TOKEN = process.env.REFRESH_TOKEN; 


const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);


oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (to, subject, text) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

      
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'phkha22@clc.fitus.edu.vn', 
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const mailOptions = {
            from: '"MeyBell" <phkha22@clc.fitus.edu.vn>',
            to: to,
            subject: subject,
            text: text,
        };

        // Gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.log('Error sending email:', error);
    }
};
module.exports = { sendEmail };

// Gọi hàm gửi email
//sendEmail('recipient@example.com', 'Test Subject', 'Test Email Body')
 
