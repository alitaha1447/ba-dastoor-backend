const Enquiry = require("./enquiryModel");
const transporter = require("../utils/mailer")
const sendThankYouEmail = require("../utils/sendEmail");
const path = require("path");
const fsPromises = require("fs/promises");
const cloudinary = require('../config/cloudinary')
const { Readable } = require("stream");

module.exports = {
    // create an enquiry
    createEnquiry: async (req, res) => {
        let uploadedFilePath = null;
        try {
            const { enquiryType } = req.body;
            console.log('...................')
            console.log(enquiryType)
            console.log('...................')
            // console.log(req.file.filename)
            if (!["contact", "catering", "franchise", "career"].includes(enquiryType)) {
                return res.status(400).json({ message: "Invalid enquiry type" });
            }
            // console.log("REQ.FILE 👉", req.file);
            // 🔒 Resume mandatory for career
            // if (enquiryType === "career" && !req.file) {
            //     return res.status(400).json({
            //         message: "Resume (CV) is required for career enquiry",
            //     });
            // }
            // const data = { ...req.body };
            const data = req.body;
            console.log('3')
            console.log(data)
            // Resume only for career
            // if (enquiryType === "career" && req.file) {
            //     data.resume = {
            //         filename: req.file.filename,
            //         path: req.file.path,
            //         mimetype: req.file.mimetype,
            //         size: req.file.size,
            //     };
            // }
            // 📄 Upload resume to Cloudinary (career only)
            // 📄 Upload CV to Cloudinary
            // if (enquiryType === "career" && req.file) {
            //     const absolutePath = path.resolve(req.file.path);
            //     uploadedFilePath = req.file.path;

            //     const cloudinaryRes = await cloudinary.uploader.upload(
            //         absolutePath,
            //         {
            //             folder: "enquiries/resumes",
            //             resource_type: "raw",
            //         }
            //     );
            //     const signedDownloadUrl = cloudinary.utils.private_download_url(
            //         cloudinaryRes.public_id, // ✅ NO .pdf here
            //         null,                    // ✅ IMPORTANT for RAW
            //         {
            //             resource_type: "raw",
            //             expires_at: Math.floor(Date.now() / 1000) + 60 * 15, // 15 min
            //             attachment: true,
            //         }
            //     );



            //     data.resume = {
            //         url: signedDownloadUrl,
            //         public_id: cloudinaryRes.public_id,
            //         originalName: req.file.originalname,
            //         mimetype: req.file.mimetype,
            //         size: req.file.size,
            //     };





            //     // data.resume = {
            //     //     url: cloudinaryRes.secure_url,
            //     //     public_id: cloudinaryRes.public_id,
            //     //     originalName: req.file.originalname,
            //     //     mimetype: req.file.mimetype,
            //     //     size: req.file.size,
            //     // };
            // }
            // if (enquiryType === "career" && req.file) {
            //     const cloudinaryResult = await new Promise((resolve, reject) => {
            //         const uploadStream = cloudinary.uploader.upload_stream(
            //             {
            //                 folder: "enquiries/resumes",
            //                 resource_type: "raw", // REQUIRED for PDFs
            //                 public_id: `${Date.now()}-${req.file.originalname.replace(".pdf", "")}`,
            //             },
            //             (error, result) => {
            //                 if (error) return reject(error);
            //                 resolve(result);
            //             }
            //         );

            //         // Buffer → Stream (Node native)
            //         Readable.from(req.file.buffer).pipe(uploadStream);
            //     });

            //     // 🔐 Signed download URL (15 minutes)
            //     const signedDownloadUrl =
            //         cloudinary.utils.private_download_url(
            //             cloudinaryResult.public_id,
            //             null, // IMPORTANT for raw
            //             {
            //                 resource_type: "raw",
            //                 expires_at: Math.floor(Date.now() / 1000) + 60 * 15,
            //                 attachment: true,
            //             }
            //         );

            //     data.resume = {
            //         downloadUrl: signedDownloadUrl, // api.cloudinary.com → download
            //         previewUrl: cloudinary.url(cloudinaryResult.public_id, {
            //             resource_type: "raw",
            //             secure: true,
            //         }),
            //         public_id: cloudinaryResult.public_id,
            //         originalName: req.file.originalname,
            //         mimetype: req.file.mimetype,
            //         size: req.file.size,
            //     };

            // }
            // Save to DB
            console.log('4')
            const enquiry = await Enquiry.create(data);
            console.log(enquiry)
            // new code for mail
            const adminMail = {
                from: `"Website Enquiry" <${process.env.SMTP_USER}>`,
                to: process.env.ADMIN_EMAIL,
                subject: `New ${enquiryType.toUpperCase()} Enquiry`,
                html: `
        <h2>New Enquiry Received</h2>
        <p><b>Type:</b> ${enquiryType}</p>
        <p><b>Name:</b> ${data.name || "-"}</p>
        <p><b>Email:</b> ${data.email || "-"}</p>
        <p><b>Phone:</b> ${data.phone || "-"}</p>
    `,
            };
            const userMail = {
                from: `"Ba-Dastoor" <${process.env.SMTP_USER}>`,
                to: data.email,
                subject: "Thank you for contacting us",
                html: `
        <p>Hi ${data.name || "there"},</p>
        <p>Thank you for reaching out. We’ll get back to you shortly.</p>
    `,
            };

            // 🚀 send both (non-blocking)
            await Promise.all([
                transporter.sendMail(adminMail),
                data.email && transporter.sendMail(userMail),
            ]);
            // 📧 Send Email to Admin
            // const mailOptions = {
            //     from: `"Website Enquiry" <${process.env.ADMIN_EMAIL}>`,
            //     to: process.env.ADMIN_EMAIL,
            //     subject: `New ${enquiryType.toUpperCase()} Enquiry`,
            //     html: `
            //         <h2>New Enquiry Received</h2>
            //         <p><b>Type:</b> ${enquiryType}</p>
            //         <p><b>Name:</b> ${data.name || "-"}</p>
            //         <p><b>Email:</b> ${data.email || "-"}</p>
            //         <p><b>Phone:</b> ${data.phone || "-"}</p>
            //          ${data.resume?.url
            //             ? `<p><b>Resume:</b> <a href="${data.resume.url}" target="_blank">View CV</a></p>`
            //             : ""
            //         }

            //     `,
            //     // attachments:
            //     //     enquiryType === "career" && req.file
            //     //         ? [
            //     //             {
            //     //                 filename: req.file.originalname,
            //     //                 path: path.resolve(req.file.path),
            //     //             },
            //     //         ]
            //     //         : [],
            // };
            // const mailOptions = {
            //     from: `"Website Enquiry" <${process.env.ADMIN_EMAIL}>`,
            //     to: process.env.ADMIN_EMAIL,
            //     subject: `New ${enquiryType.toUpperCase()} Enquiry`,
            //     html: `
            //     <h2>New Enquiry Received</h2>
            //     <p><b>Type:</b> ${enquiryType}</p>
            //     <p><b>Name:</b> ${data.name || "-"}</p>
            //     <p><b>Email:</b> ${data.email || "-"}</p>
            //     <p><b>Phone:</b> ${data.phone || "-"}</p>

            // `
            //     ,
            // };
            // // 🚀 Send both emails in parallel
            // await Promise.all([
            //     transporter.sendMail(mailOptions),
            //     sendThankYouEmail(data.email, data.name, enquiryType),
            // ]);

            res.status(201).json({
                success: true,
                message: "Enquiry submitted successfully",
                data: enquiry,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        // finally {
        //     // 🧹 Always remove local file
        //     if (uploadedFilePath) {
        //         try {
        //             await fsPromises.unlink(uploadedFilePath);
        //             console.log("🧹 Local CV deleted:", uploadedFilePath);
        //         } catch (err) {
        //             console.error("❌ Local file delete failed:", err.message);
        //         }
        //     }
        // }
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
    }
}