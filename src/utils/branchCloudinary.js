const cloudinary = require("../config/cloudinary");

// const branchCloudinary = async (filePath, folder) => {
//     return await cloudinary.uploader.upload(filePath, {
//         folder,
//     });
// };
// NEW CODE OPTIMIZATION
const branchCloudinary = async (filePath, folder) => {
    return await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: "image",

        // 🔽 SAFE optimizations (DO NOT affect quality badly)
        fetch_format: "auto",  // allows WebP/AVIF later
        quality: "auto",       // intelligent baseline
        strip_metadata: true,  // removes EXIF (saves size)
    });
};

module.exports = branchCloudinary;
