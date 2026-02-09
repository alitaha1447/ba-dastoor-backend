const cloudinary = require('../config/cloudinary');

const videoUploadToCloudinary = async (filePath, folder) => {
    return await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: "video", // ✅ FORCE VIDEO
        eager: [{
            format: "mp4",
            video_codec: "auto",
            audio_codec: "aac",

            bitrate: "auto",       // smart compression
            quality: "auto",

            width: 1280,          // prevent 4K waste
            crop: "limit",
        },],
        eager_async: true,
        fetch_format: "auto",
    });
};

module.exports = videoUploadToCloudinary;