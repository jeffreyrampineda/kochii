const axios = require('axios');
const sgMail = require('@sendgrid/mail');
const Validator = require('validator');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function searchRawFood(query) {
    try {
        const apiUrlBase = 'https://api.nal.usda.gov/fdc/v1/foods/search?';
        const apiKey = process.env.FDC_API_KEY;
        const apiQuery = query;
        const apiUrl = `${apiUrlBase}api_key=${apiKey}&query=${apiQuery}&dataType=Survey%20(FNDDS)%20&pageSize=3`;

        const apiResponse = await axios.get(apiUrl);

        const firstFood = apiResponse.data.foods[0];
        const response = {
            description: apiResponse.data.totalHits ? firstFood.description : query,
            foodNutrients: apiResponse.data.totalHits ? firstFood.foodNutrients : [],
        }

        return response;
    } catch (error) {
        throw (error);
    }
}

function sendVerificationEmail(to, verificationToken) {
    const hostUrl = process.env.HOST_URL;
    const template_id = process.env.SENDGRID_TEMPLATE_ID;
    const confirmation_url = `${hostUrl}/api/verification?token=${verificationToken}&email=${to}`;
    const msg = {
        to,
        from: {
            email: 'no-reply@kochii.app',
            name: "Kochii"
        },
        dynamic_template_data: {
            confirmation_url: confirmation_url
        },
        template_id: template_id
    };
    sgMail.send(msg, false, (error, result) => {
        if (error) {
            console.log(error);
        }
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
    searchRawFood,
    sendVerificationEmail,
    sendContactEmail,
}