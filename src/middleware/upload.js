const multer = require("multer")
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // temp folder
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
})

// ✅ Allow images & videos only
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
        "video/mp4",
        "video/webm",
        "video/quicktime", // mov
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error("Only image and video files are allowed"),
            false
        );
    }
};

const upload = multer({ storage, fileFilter, });

module.exports = upload