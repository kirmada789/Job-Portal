const nodemailer = require("nodemailer");

async function sendEmail(options) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL_USER,
            clientId: process.env.GOOGLE_CLIENT_ID,       // 👈 Yahan GOOGLE_CLIENT_ID kar diya
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, // 👈 Yahan GOOGLE_CLIENT_SECRET kar diya
            refreshToken: process.env.REFRESH_TOKEN,
        }
    });
    
    const mailOptions = {
        from: `"JobNetic Job Portal" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;