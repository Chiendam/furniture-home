const nodemailer = require('nodemailer');
const {models} = require("mongoose");

const sendEmail = async options => {
    // 1. create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
    });

    // 2. Define the email options
    const mailOptions = {
        from: "Fred Foo <shop@example.com>", // sender address
        to: options.email, // list of receivers
        subject:  options.subject, // Subject line
        text: options.message, // plain text body
        html: `<h1 style='background: aquamarine'>Yêu cầu reset</h1>`, // html body
    }

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
}
module.exports = sendEmail;