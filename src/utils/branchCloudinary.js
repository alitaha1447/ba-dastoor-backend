const cloudinary = require("../config/cloudinary");

const branchCloudinary = async (filePath, folder) => {
    return await cloudinary.uploader.upload(filePath, {
        folder,
    });
};

module.exports = branchCloudinary;
