const cloudinary = require('../../config/cloudinary')
const uploadToCloudinary = require('../../utils/cloudinaryUpload')
const MobileBanner = require('../mobileBanner/mobileModel')
const fsPromises = require("fs/promises");
const path = require("path");

module.exports = {
    // uploadMobileBanner: async (req, res) => {

    //     const mobileFile = req.files?.mobile?.[0];
    //     let tempFilePath = mobileFile?.path;
    //     try {

    //         const { page } = req.query;

    //         if (!mobileFile) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Mobile file not received"
    //             });
    //         }

    //         const mobileUpload = await uploadToCloudinary(
    //             mobileFile.path,
    //             "banners/mobile",
    //             req.body.mobileMediaType || "auto"
    //         );


    //         const bannerData = {
    //             page,
    //             mediaType: mobileUpload.resource_type,
    //             mobile: {
    //                 url: mobileUpload.secure_url,
    //                 publicId: mobileUpload.public_id,
    //                 mediaType: mobileUpload.resource_type,
    //             },
    //         };

    //         // console.log("DATA TO SAVE:", bannerData);

    //         const banner = await MobileBanner.create(bannerData);

    //         res.status(200).json({
    //             success: true,
    //             data: banner,
    //         });

    //     } catch (error) {
    //         console.error("UPLOAD ERROR:", error);
    //         res.status(500).json({
    //             success: false,
    //             message: "Banner upload failed",
    //             error: error.message,
    //         });
    //     } finally {
    //         // 🧹 ALWAYS remove temp file
    //         // if (tempFilePath) {
    //         //     try {
    //         //         await fsPromises.unlink(tempFilePath);
    //         //         console.log("🧹 Mobile banner temp deleted:", tempFilePath);
    //         //     } catch (err) {
    //         //         console.error("❌ Failed to delete temp file:", err.message);
    //         //     }
    //         // }
    //         if (tempFilePath) {
    //             try {
    //                 // ⏳ allow Cloudinary to release file lock (important on Windows)
    //                 await new Promise(resolve => setTimeout(resolve, 150));

    //                 await fsPromises.unlink(tempFilePath);
    //                 console.log("🧹 Temp banner file deleted:", tempFilePath);

    //             } catch (err) {
    //                 console.error("❌ Failed to delete temp file:", err.message);
    //             }
    //         }
    //     }
    // },
    // getMobileBannerByPage: async (req, res) => {
    //     const { page } = req.query;
    //     try {
    //         const banners = await MobileBanner.find({ page }).sort({ createdAt: -1 });
    //         res.status(200).json({
    //             success: true,
    //             count: banners.length,
    //             data: banners   // ARRAY
    //         });
    //     } catch (error) {
    //         console.error("FETCH ERROR:", error);
    //         res.status(500).json({
    //             success: false,
    //             message: "Banner fetch failed",
    //             error: error.message,
    //         });
    //     }
    // },
    // deleteMobileBannerById: async (req, res) => {
    //     const { id } = req.params;
    //     try {
    //         const banner = await MobileBanner.findById(id);
    //         console.log(banner);
    //         // 2. Delete from Cloudinary (if exists)
    //         const cloudinaryRes = await cloudinary.uploader.destroy(banner.mobile.publicId, {
    //             resource_type:
    //                 banner.mobile.mediaType === "video"
    //                     ? "video"
    //                     : "image",
    //         });
    //         console.log('cloudinary delete response:', cloudinaryRes);
    //         // 3. Delete banner from DB
    //         await MobileBanner.findByIdAndDelete(id);
    //         res.status(200).json({
    //             success: true,
    //             message: "Mobile banner deleted successfully",
    //         });
    //     } catch (error) {
    //         res.status(500).json({ message: "Failed to delete Mobile banner" });

    //     }
    // },
    // updateMobileBannerSelection: async (req, res) => {
    //     const { ids, isSelected } = req.body;
    //     if (!Array.isArray(ids) || ids.length === 0) {
    //         return res.status(400).json({
    //             success: false,
    //             message: "IDs array is required",
    //         });
    //     }
    //     try {
    //         await MobileBanner.updateMany(
    //             { _id: { $in: ids } },
    //             { $set: { isSelected } }
    //         );
    //         res.status(200).json({
    //             success: true,
    //             message: "Selection updated successfully",
    //         })
    //     } catch (error) {
    //         console.error("PATCH ERROR:", error);
    //         res.status(500).json({
    //             success: false,
    //             message: "Failed to update selection",
    //         });
    //     }
    // },
    // getSelectedMobileBanners: async (req, res) => { },

    // REFACTOR CODE UPLOAD ALL MEDIA IN SERVER

    uploadMobileBanner: async (req, res) => {
        try {
            const { page } = req.query;

            if (!req.files?.mobile?.length) {
                return res.status(400).json({
                    success: false,
                    message: "Mobile banner is required",
                });
            }

            const file = req.files.mobile[0];
            const mediaType = file.mimetype.startsWith("video")
                ? "video"
                : "image";

            const mobile = {
                url: `/uploads/${file.filename}`, // frontend access
                publicId: file.filename, // used for delete
                mediaType,
            };
            const banner = await MobileBanner.create({
                page,
                mediaType,
                mobile,
            });
            return res.status(201).json({
                success: true,
                message: "Mobile banner uploaded successfully",
                data: banner,
            });

        } catch (error) {
            console.error("UPLOAD ERROR:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getMobileBannerByPage: async (req, res) => {
        try {
            const { page } = req.query;
            const banners = await MobileBanner
                .find({ page })
                .sort({ createdAt: -1 })
                .lean();
            return res.status(200).json({
                success: true,
                count: banners.length,
                data: banners,
            });
        } catch (error) {
            console.error("FETCH ERROR:", error);
            return res.status(500).json({
                success: false,
                message: "Banner fetch failed",
            });
        }
    },
    deleteMobileBannerById: async (req, res) => {
        try {
            const { id } = req.params;
            const banner = await MobileBanner.findById(id);

            if (!banner) {
                return res.status(404).json({
                    success: false,
                    message: "Banner not found",
                });
            }

            // Delete file from server

            if (banner.mobile?.publicId) {
                const filePath = path.join(
                    process.cwd(),
                    "uploads",
                    "media",
                    banner.mobile.publicId
                );

                try {
                    await fsPromises.unlink(filePath);
                    console.log("🗑 File deleted:", filePath);
                } catch (err) {
                    console.warn("File already missing:", err.message);
                }
            }
            await banner.deleteOne();
            return res.status(200).json({
                success: true,
                message: "Mobile banner deleted successfully",
            });

        } catch (error) {
            console.error("DELETE ERROR:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to delete Mobile banner",
            });
        }
    },
    updateMobileBannerSelection: async (req, res) => {
        try {
            const { ids, isSelected } = req.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "IDs array is required",
                });
            }
            await MobileBanner.updateMany(
                { _id: { $in: ids } },
                { $set: { isSelected: Boolean(isSelected) } }
            );
            return res.status(200).json({
                success: true,
                message: "Selection updated successfully",
            });

        } catch (error) {
            console.error("PATCH ERROR:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to update selection",
            });
        }
    },
}