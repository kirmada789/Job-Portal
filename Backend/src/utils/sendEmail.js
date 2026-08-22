const nodemailer = require("nodemailer");

async function sendEmail(options) {
    // Transporter create karo using Gmail OAuth2
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
        }
    });
    
    // Email option define karo
    const mailOptions = {
        from: `"JobNetic Job Portal" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    // Email send karo
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;