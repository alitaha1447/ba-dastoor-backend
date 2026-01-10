const cloudinary = require('../config/cloudinary');

const videoUploadToCloudinary = async (filePath, folder) => {
    return await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: "video", // ✅ FORCE VIDEO
        eager: [],
        eager_async: true
    });
};

module.exports = videoUploadToCloudinary;