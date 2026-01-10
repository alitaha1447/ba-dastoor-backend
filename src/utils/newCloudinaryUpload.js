const cloudinary = require('../config/cloudinary')

const newUploadToCloudinary = async (filePath, folder) => {
    return await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: "image", // ✅ FORCE IMAGE ONLY
    });
};

module.exports = newUploadToCloudinary;