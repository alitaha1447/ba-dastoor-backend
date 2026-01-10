// const multer = require("multer");
// const path = require("path");
// // const fs = require("fs");

// // ensure folder exists
// // const uploadDir = path.join(process.cwd(), "uploads/resumes");
// // if (!fs.existsSync(uploadDir)) {
// //     fs.mkdirSync(uploadDir, { recursive: true });
// // }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads/resumes"); // temp folder
//     },

//     filename: function (req, file, cb) {
//         cb(null, Date.now() + "-" + file.originalname);
//     }
// });

// // const fileFilter = (req, file, cb) => {
// //     const allowed = /pdf|doc|docx/;
// //     const ext = path.extname(file.originalname).toLowerCase();

// //     if (allowed.test(ext)) {
// //         cb(null, true);
// //     } else {
// //         cb(new Error("Only PDF/DOC/DOCX allowed"));
// //     }
// // }

// const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// module.exports = upload



// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const uploadDir = path.join(process.cwd(), "uploads", "resumes");

// // ensure folder exists
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

// const fileFilter = (req, file, cb) => {
//     const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
//     if (allowed.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only PDF/DOC/DOCX files allowed"));
//     }
// };

// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
// });

// module.exports = upload;
const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files allowed"), false);
        }
    },
});

module.exports = upload;