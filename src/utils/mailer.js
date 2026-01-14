const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
    },
});

// Debug (shows error in Render logs)
transporter.verify((err) => {
    if (err) {
        console.error("SMTP ERROR:", err);
    } else {
        console.log("SMTP READY");
    }
});

module.exports = transporter;