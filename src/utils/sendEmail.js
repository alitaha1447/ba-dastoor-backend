const nodemailer = require("nodemailer");
const transporter = require("./mailer");

const sendThankYouEmail = async (toEmail, userName, enquiryType) => {
    // const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         user: process.env.ADMIN_EMAIL,
    //         pass: process.env.ADMIN_EMAIL_PASS,
    //     }
    // });
    if (!toEmail) return;
    const mailOptions = {
        from: `"Taha Ali" <${process.env.ADMIN_EMAIL}>`,
        to: toEmail, // ✅ FIXED
        subject: "Thank You for Your Support",
        html: `
            <p>Hi ${userName || "there"},</p>

            <p>
                Thank you for your <b>${enquiryType || ""}</b> enquiry.
                We truly appreciate your interest and trust in us.
            </p>

            <p>
                Our team will get back to you shortly.
                If you need anything in the meantime, feel free to reply to this email.
            </p>

            <br />

            <p>
                Best regards,<br/>
                <b>Taha Ali</b>
            </p>
        `,
    };

    await transporter.sendMail(mailOptions);

};

module.exports = sendThankYouEmail;