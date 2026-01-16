const cloudinary = require("../config/cloudinary");


exports.buildImageUrl = (publicId, width, height) =>
    cloudinary.url(publicId, {
        width,
        height,
        crop: "fill",
        format: "auto",
        quality: "auto:best", // better quality
    });