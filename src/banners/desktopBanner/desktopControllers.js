const cloudinary = require('../../config/cloudinary.js')
const uploadToCloudinary = require("../../utils/cloudinaryUpload.js")
const DesktopBanner = require('../desktopBanner/desktopModel.js');
const fsPromises = require("fs/promises");


module.exports = {
    uploadDesktopBanner: async (req, res) => {
        const desktopFile = req.files?.desktop?.[0];
        let tempFilePath = desktopFile?.path;

        try {

            const { page } = req.query;

            if (!desktopFile) {
                return res.status(400).json({
                    success: false,
                    message: "Desktop file not received"
                });
            }

            const desktopUpload = await uploadToCloudinary(
                desktopFile.path,
                "banners/desktop",
                req.body.desktopMediaType || "auto"
            );

            const bannerData = {
                page,
                mediaType: desktopUpload.resource_type,
                desktop: {
                    url: desktopUpload.secure_url,
                    publicId: desktopUpload.public_id,
                    mediaType: desktopUpload.resource_type,
                },
            };

            // console.log("DATA TO SAVE:", bannerData);

            const banner = await DesktopBanner.create(bannerData);

            res.status(200).json({
                success: true,
                data: banner,
            });

        } catch (error) {
            console.error("UPLOAD ERROR:", error);
            res.status(500).json({
                success: false,
                message: "Banner upload failed",
                error: error.message,
            });
        } finally {
            // 🧹 ALWAYS clean temp file
            if (tempFilePath) {
                try {
                    await fsPromises.unlink(tempFilePath);
                    console.log("🧹 Temp banner file deleted:", tempFilePath);
                } catch (err) {
                    console.error("❌ Failed to delete temp file:", err.message);
                }
            }
        }
    },

    getDesktopBannerByPage: async (req, res) => {
        const { page } = req.query;
        try {
            const banners = await DesktopBanner.find({ page }).sort({ createdAt: -1 });
            res.status(200).json({
                success: true,
                count: banners.length,
                data: banners   // ARRAY
            });
        } catch (error) {
            console.error("FETCH ERROR:", error);
            res.status(500).json({
                success: false,
                message: "Banner fetch failed",
                error: error.message,
            });
        }
    },

    deleteDesktopBannerById: async (req, res) => {
        const { id } = req.params;
        try {
            const banner = await DesktopBanner.findById(id);
            console.log(banner)
            // 2. Delete from Cloudinary (if exists)
            const cloudinaryRes = await cloudinary.uploader.destroy(banner.desktop.publicId, {
                resource_type:
                    banner.desktop.mediaType === "video"
                        ? "video"
                        : "image",
            });
            console.log('cloudinary delete response:', cloudinaryRes);
            // 3. Delete banner from DB
            await DesktopBanner.findByIdAndDelete(id);
            res.status(200).json({
                success: true,
                message: "Desktop banner deleted successfully",
            });
        } catch (error) {
            res.status(500).json({ message: "Failed to delete Desktop banner" });
        }
    },
    updateDesktopBannerSelection: async (req, res) => {
        const { ids, isSelected } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "IDs array is required",
            });
        }
        try {
            await DesktopBanner.updateMany(
                { _id: { $in: ids } },
                { $set: { isSelected } }
            );
            res.status(200).json({
                success: true,
                message: "Selection updated successfully",
            });
        } catch (error) {
            console.error("PATCH ERROR:", error);
            res.status(500).json({
                success: false,
                message: "Failed to update selection",
            });
        }
    },
    getSelectedDesktopBanners: async (req, res) => {
        const { page } = req.query;
        if (!page) {
            return res.status(400).json({
                success: false,
                message: "Page is required",
            });
        }
        try {
            const banners = await DesktopBanner.find({
                page,
                isSelected: true,
            }).sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                count: banners.length,
                data: banners,
            });

        } catch (error) {
            console.error("GET SELECTED ERROR:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch selected banners",
            });
        }
    },
}