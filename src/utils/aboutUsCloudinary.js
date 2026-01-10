const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: "about-us",
                resource_type: "image",
                quality: "auto:eco",
                fetch_format: "auto",
                transformation: [{ width: 600, crop: "limit" }],
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        ).end(buffer);
    });
};

module.exports = uploadToCloudinary;
