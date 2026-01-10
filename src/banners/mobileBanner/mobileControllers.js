const cloudinary = require('../../config/cloudinary')
const uploadToCloudinary = require('../../utils/cloudinaryUpload')
const MobileBanner = require('../mobileBanner/mobileModel')
// const fs = require("fs");
const fsPromises = require("fs/promises");


module.exports = {
    uploadMobileBanner: async (req, res) => {
        let tempFilePath = null;
        try {
            // console.log("FILES:", req.files);
            // console.log("BODY:", req.body);
            // console.log("QUERY:", req.query);

            const { page } = req.query;
            const mobileFile = req.files?.mobile?.[0];

            if (!mobileFile) {
                return res.status(400).json({
                    success: false,
                    message: "Mobile file not received"
                });
            }

            tempFilePath = mobileFile.path; // ✅ track temp file

            const mobileUpload = await uploadToCloudinary(
                mobileFile.path,
                "banners/mobile",
                req.body.mobileMediaType || "auto"
            );

            // fs.unlinkSync(mobileFile.path);

            // console.log("CLOUDINARY RESULT:", mobileUpload);

            const bannerData = {
                page,
                mediaType: mobileUpload.resource_type,
                mobile: {
                    url: mobileUpload.secure_url,
                    publicId: mobileUpload.public_id,
                    mediaType: mobileUpload.resource_type,
                },
            };

            // console.log("DATA TO SAVE:", bannerData);

            const banner = await MobileBanner.create(bannerData);

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
            // 🧹 ALWAYS remove temp file
            if (tempFilePath) {
                try {
                    await fsPromises.unlink(tempFilePath);
                    console.log("🧹 Mobile banner temp deleted:", tempFilePath);
                } catch (err) {
                    console.error("❌ Failed to delete temp file:", err.message);
                }
            }
        }
    },
    getMobileBannerByPage: async (req, res) => {
        const { page } = req.query;
        try {
            const banners = await MobileBanner.find({ page }).sort({ createdAt: -1 });
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
    deleteMobileBannerById: async (req, res) => {
        const { id } = req.params;
        try {
            const banner = await MobileBanner.findById(id);
            console.log(banner);
            // 2. Delete from Cloudinary (if exists)
            const cloudinaryRes = await cloudinary.uploader.destroy(banner.mobile.publicId, {
                resource_type:
                    banner.mobile.mediaType === "video"
                        ? "video"
                        : "image",
            });
            console.log('cloudinary delete response:', cloudinaryRes);
            // 3. Delete banner from DB
            await MobileBanner.findByIdAndDelete(id);
            res.status(200).json({
                success: true,
                message: "Mobile banner deleted successfully",
            });
        } catch (error) {
            res.status(500).json({ message: "Failed to delete Mobile banner" });

        }
    }
}