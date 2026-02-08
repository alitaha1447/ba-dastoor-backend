// const nodemailer = require("nodemailer");

// const getTransporter = (type) => {
//     const accounts = {
//         career: {
//             user: process.env.CAREER_EMAIL,
//             pass: process.env.CAREER_PASS,
//         },
//     }

//     const selected = accounts[type];

//     if (!selected?.user || !selected?.pass) {
//         throw new Error(`Missing SMTP credentials for: ${type}`);
//     }

//     const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: Number(process.env.SMTP_PORT),
//         secure: true,
//         auth: {
//             user: selected.user,
//             pass: selected.pass,
//         },
//     });

//     // Debug (shows error in Render logs)
//     transporter.verify((err) => {
//         if (err) {
//             console.error("SMTP ERROR:", err);
//         } else {
//             console.log("SMTP READY");
//         }
//     });
//     return transporter;
// }



// module.exports = getTransporter;

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,   // 👉 ONLY ADMIN LOGIN
        pass: process.env.SMTP_PASS,
    },
});

// Debug at server start
transporter.verify((err) => {
    if (err) {
        console.error("SMTP ERROR:", err.message);
    } else {
        console.log("SMTP READY WITH:", process.env.SMTP_USER);
    }
});

module.exports = transporter;
