const sgMail = require('@sendgrid/mail');
const ejs = require('ejs');
const path = require('path');
const HOST_URL = process.env.HOST_URL;
const Validator = require('validator');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendVerificationEmail(to, verificationToken) {
    const confirmationUrl = `${HOST_URL}/api/verification?token=${verificationToken}&email=${to}`;

    ejs.renderFile(path.join(__dirname, '../views/layouts/email_template.html'), { confirmationUrl: confirmationUrl }, (err, html) => {
        if (err) throw err;

        const msg = {
            to,
            from: {
                email: 'no-reply@kochii.app',
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

function sendContactEmail(from_email, from_name, body) {

    const clean_email = Validator.escape(from_email);
    const clean_name = Validator.escape(from_name);
    const clean_body = Validator.escape(body);

    const msg = {
        to: 'contact@kochii.app',
        from: {
            email: 'contact@kochii.app',
            name: "Kochii"
        },
        subject: `Contact from: ${clean_email} `,
        text: `from: ${clean_name} <${clean_email}>\n\n${clean_body}`,
    };
    sgMail.send(msg, false, (error, result) => {
        if (error) {
            console.log(error);
        }
    });
}

module.exports = {
    sendVerificationEmail,
    sendContactEmail,
}
