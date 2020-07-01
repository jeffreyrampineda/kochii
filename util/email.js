const sgMail = require('@sendgrid/mail');
const HOST_URL = process.env.HOST_URL;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendVerificationEmail(to, verificationToken) {
    const msg = {
        to,
        from: {
            email: 'kochii.inventory.app@gmail.com',
            name: "Kochii"
        },
        subject: 'Confirm your email',
        text: 'Click on this link to verify your email',
        html: `<strong>${HOST_URL}/public/verification?token=${verificationToken}&email=${to}</strong>`,
    };
    sgMail.send(msg, false, (error, result) => {
        if (error) {
            console.log(error);
        }
    });
}

module.exports = {
    sendVerificationEmail,
}
