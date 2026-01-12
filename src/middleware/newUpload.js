const multer = require("multer");
const path = require("path");
// const fs = require("fs");
// const fsPromises = require("fs/promises");


// ensure uploads folder exists
// if (!fs.existsSync("uploads")) {
//     fs.mkdirSync("uploads");
// }

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // ✅ REQUIRED
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

module.exports = upload;
