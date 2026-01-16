const cloudinary = require("../config/cloudinary");


exports.buildImageUrl = (publicId, width, height) =>
    cloudinary.url(publicId, {
        width,
        height,
        crop: "fill",
        fetch_format: "auto", // 🔥 better than format
        quality: "auto",
        secure: true,         // ✅ THIS FIXES YOUR ISSUE
    });