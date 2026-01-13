const cloudinary = require("../config/cloudinary.js");

// const uploadToCloudinary = async (filePath, folder, mediaType) => {
//     // const resourceType = mediaType === "video" ? "video" : "image";
//     const resourceType = mediaType === "video"
//         ? "video"
//         : mediaType === "image"
//             ? "image"
//             : "auto"; // ✅ when mediaType not passed
//     return await cloudinary.uploader.upload(filePath, {
//         folder,
//         resource_type: resourceType,
//     });
// };
const uploadToCloudinary = async (file, folder, resourceType = "auto") => {
    const base64 = file.buffer.toString("base64");

    return await cloudinary.uploader.upload(
        `data: ${file.mimetype}; base64, ${base64}`,
        {
            folder,
            resource_type: resourceType,
        }
    );
};

module.exports = uploadToCloudinary;