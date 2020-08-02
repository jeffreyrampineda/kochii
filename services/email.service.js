const sgMail = require('@sendgrid/mail');
const ejs = require('ejs');
const path = require('path');
const HOST_URL = process.env.HOST_URL;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendVerificationEmail(to, verificationToken) {
    const confirmationUrl = `${HOST_URL}/api/verification?token=${verificationToken}&email=${to}`;
    
    ejs.renderFile(path.join(__dirname, 'email_template.html'), { confirmationUrl: confirmationUrl }, (err, html) => {
        if (err) throw err;

        const msg = {
            to,
            from: {
                email: 'kochii.inventory.app@gmail.com',
                name: "Kochii"
            },
            subject: 'Confirm your email',
            text: 'Click on this link to verify your email',
            html: html,
        };
        sgMail.send(msg, false, (error, result) => {
            if (error) {
                console.log(error);
            }
        });
    });
}

module.exports = {
    sendVerificationEmail,
}
