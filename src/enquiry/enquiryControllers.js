const Enquiry = require("./enquiryModel");
const transporter = require("../utils/mailer")




module.exports = {
    // create an enquiry
    createEnquiry: async (req, res) => {
        try {
            const { enquiryType } = req.body;

            if (!["contact", "catering", "franchise", "career"].includes(enquiryType)) {
                return res.status(400).json({ message: "Invalid enquiry type" });
            }

            const data = req.body;
            // Save to DB
            const enquiry = await Enquiry.create(data);

            // 👉 Alias routing (ONLY FOR FROM / TO)
            const MAILS = {
                contact: process.env.MAIL_CONTACT,
                career: process.env.MAIL_CAREER,
                franchise: process.env.MAIL_FRANCHISE,
                catering: process.env.MAIL_CATERING,
            };

            const mailAddress = MAILS[enquiryType];

            // ================= ADMIN MAIL =================
            const adminMail = {
                from: `"Website Enquiry" <${mailAddress}>`,   // alias display
                to: mailAddress,                              // alias inbox
                replyTo: data.email, // 👈 important
                subject: `New ${enquiryType.toUpperCase()} Enquiry`,
                html: `
          <h2>New Enquiry Received</h2>
          <p><b>Type:</b> ${enquiryType}</p>
          <p><b>Name:</b> ${data.name || "-"}</p>
          <p><b>Email:</b> ${data.email || "-"}</p>
          <p><b>Phone:</b> ${data.phone || "-"}</p>
        `,
            };

            // ================= USER TEMPLATES =================
            const USER_TEMPLATES = {

                // ---------- CONTACT ----------
                contact: {
                    subject: "Thank you for contacting Ruh Café",
                    html: `
                        <p>Hi ${data.name || "there"},</p>
                        <p>Thank you for getting in touch with <strong>Ruh Café</strong>.<br/>
                            We truly appreciate your interest and the time you took to write to us.</p>
                        <p>Our team has received your message and we’ll get back to you shortly with the required details.  
                        If your query is urgent, rest assured—we’ll prioritize it.</p>
                        <p>Until then, thank you for your patience and for choosing Ruh Café.<br/>
                        We look forward to connecting with you.</p>
                        <br/>
                        <p>Warm regards,<br/>
                        <strong>Abdul Azeem</strong><br/>
                        Owner, Ruh Café<br/>
                        ☕ <i>Where every sip has a soul</i></p>
                        <hr/>
                        <small>This is an automated acknowledgement email. Please do not reply directly to this message.</small>`,
                },

                // ---------- CAREER ----------
                career: {
                    subject: "Career Application Received – Ruh Café",
                    html: `
                        <p>Hi ${data.name || "there"},</p>
                        <p>
                       Thank you for getting in touch with Ba-Dastoor.We truly appreciate your interest and the time you took to write to us.
                        </p>
                        <p>
Our team has received your message and will get back to you shortly with the required details. If your query is urgent, please rest assured—we’ll give it priority.
                        </p>
                        <p>
                        Until then, thank you for your patience and for choosing Ba-Dastoor.We look forward to serving you soon.
                        </p>
                       
                        <br/>
                        <p>
                        Warm regards,<br/>
                        <strong>Abdul Azeem</strong><br/>
                        Owner, Ruh Café<br/>
                        ☕ <i>Where every sip has a soul</i>
                        </p>
                        `,
                },


                // ---------- FRANCHISE ----------
                franchise: {
                    subject: "Franchise Enquiry Received – Ruh Café",
                    html: `
                            <p>Hi ${data.name || "there"},</p>
                            <p>
                            Thank you for reaching out and showing interest in becoming a part of Ba-Dastoor – Authentic Royal Hyderabadi Cuisine. We truly appreciate your enthusiasm and the time you took to connect with us.
                            </p>
                            <p>
                            Our franchise team has received your inquiry and will review your details shortly. We’ll get back to you soon with the next steps, requirements, and all the necessary information. If your request is time-sensitive, please be assured that we’ll give it priority.
                            </p>
                            <p>
                            We look forward to the possibility of partnering with you and bringing the royal taste of Ba-Dastoor to new locations.
                            </p>
                            <br/>
                            <p>
                            Warm regards,<br/>
                            <strong>Abdul Azeem</strong><br/>
                            Owner, Ruh Café<br/>
                            ☕ <i>Where every sip has a soul</i>
                            </p>`,
                },
                // ---------- CATERING ----------
                catering: {
                    subject: "catering Enquiry Received – Ruh Café",
                    html: `
    <p>Hi ${data.name || "there"},</p>

    <p>
     Thank you for reaching out to Ba-Dastoor – Authentic Royal Hyderabadi Cuisine for your catering needs. We truly appreciate your interest and the time you took to connect with us.
    </p>

    <p>
    Our catering team has received your inquiry and will get back to you shortly with the required details, menu options, and pricing. If your request is time-sensitive, please be assured that we’ll give it priority.
    </p>

    <p>
        We look forward to being a part of your special occasion and serving you the royal flavors of Ba-Dastoor.    </p>

    <br/>

    <p>
      Warm regards,<br/>
      <strong>Abdul Azeem</strong><br/>
      Owner, Ruh Café<br/>
      🍽️ 
      ☕ <i>Authentic Royal Hyderabadi Cuisine</i>
    </p>

    <hr/>
   
  `,
                },

            };
            const template = USER_TEMPLATES[enquiryType];
            // ================= USER AUTO REPLY =================
            const userMail = {
                from: `"Ba-Dastoor" <${mailAddress}>`,
                to: data.email,
                subject: "Thank you for contacting us",
                html: template.html,
            };

            // ✅ NON-BLOCKING EMAIL (API NEVER HANGS)
            const isValidEmail = (email) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            const mailPromises = [transporter.sendMail(adminMail)];

            if (data.email && isValidEmail(data.email)) {
                mailPromises.push(transporter.sendMail(userMail));
            }

            Promise.allSettled(mailPromises)
                .then((results) => console.log("Mail results:", results))
                .catch((err) => console.error("Mail error:", err));


            res.status(201).json({
                success: true,
                message: "Enquiry submitted successfully",
                data: enquiry,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    },
    // get enquiries
    getEnquiries: async (req, res) => {
        try {
            const { enquiryType } = req.query;
            const filter = enquiryType ? { enquiryType } : {}
            const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
            res.status(200).json({
                success: true,
                count: enquiries.length,
                data: enquiries,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // enquiry counts
    getEnquiryCounts: async (req, res) => {
        try {
            const counts = await Enquiry.aggregate([
                {
                    $group: {
                        _id: "$enquiryType",
                        count: { $sum: 1 }
                    }
                }
            ]);

            // Convert to structured object
            const formattedCounts = {
                all: await Enquiry.countDocuments(),
                contact: 0,
                career: 0,
                franchise: 0
            };

            counts.forEach(item => {
                formattedCounts[item._id] = item.count;
            });

            res.status(200).json({
                success: true,
                data: formattedCounts
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}