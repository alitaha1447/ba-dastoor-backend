const cloudinary = require('../../config/cloudinary.js')
const uploadToCloudinary = require("../../utils/cloudinaryUpload.js")
const DesktopBanner = require('../desktopBanner/desktopModel.js');
const path = require("path");
const fsPromises = require("fs/promises");


module.exports = {
    // uploadDesktopBanner: async (req, res) => {
    //     const desktopFile = req.files?.desktop?.[0];
    //     let tempFilePath = desktopFile?.path;

    //     try {

    //         const { page } = req.query;

    //         if (!desktopFile) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Desktop file not received"
    //             });
    //         }

    //         const desktopUpload = await uploadToCloudinary(
    //             desktopFile.path,
    //             "banners/desktop",
    //             req.body.desktopMediaType || "auto"
    //         );

    //         const bannerData = {
    //             page,
    //             mediaType: desktopUpload.resource_type,
    //             desktop: {
    //                 url: desktopUpload.secure_url,
    //                 publicId: desktopUpload.public_id,
    //                 mediaType: desktopUpload.resource_type,
    //             },
    //         };


    //         const banner = await DesktopBanner.create(bannerData);

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
    //         if (tempFilePath) {
    //             try {
    //                 await fsPromises.unlink(tempFilePath);
    //                 console.log("🧹 Temp banner file deleted:", tempFilePath);
    //             } catch (err) {
    //                 console.error("❌ Failed to delete temp file:", err.message);
    //             }
    //         }
    //     }
    // },

    // getDesktopBannerByPage: async (req, res) => {
    //     const { page } = req.query;
    //     try {
    //         const banners = await DesktopBanner.find({ page }).sort({ createdAt: -1 });
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

    // deleteDesktopBannerById: async (req, res) => {
    //     const { id } = req.params;
    //     try {
    //         const banner = await DesktopBanner.findById(id);
    //         console.log(banner)
    //         // 2. Delete from Cloudinary (if exists)
    //         const cloudinaryRes = await cloudinary.uploader.destroy(banner.desktop.publicId, {
    //             resource_type:
    //                 banner.desktop.mediaType === "video"
    //                     ? "video"
    //                     : "image",
    //         });
    //         console.log('cloudinary delete response:', cloudinaryRes);
    //         // 3. Delete banner from DB
    //         await DesktopBanner.findByIdAndDelete(id);
    //         res.status(200).json({
    //             success: true,
    //             message: "Desktop banner deleted successfully",
    //         });
    //     } catch (error) {
    //         res.status(500).json({ message: "Failed to delete Desktop banner" });
    //     }
    // },
    // updateDesktopBannerSelection: async (req, res) => {
    //     const { ids, isSelected } = req.body;

    //     if (!Array.isArray(ids) || ids.length === 0) {
    //         return res.status(400).json({
    //             success: false,
    //             message: "IDs array is required",
    //         });
    //     }
    //     try {
    //         await DesktopBanner.updateMany(
    //             { _id: { $in: ids } },
    //             { $set: { isSelected } }
    //         );
    //         res.status(200).json({
    //             success: true,
    //             message: "Selection updated successfully",
    //         });
    //     } catch (error) {
    //         console.error("PATCH ERROR:", error);
    //         res.status(500).json({
    //             success: false,
    //             message: "Failed to update selection",
    //         });
    //     }
    // },
    // getSelectedDesktopBanners: async (req, res) => {
    //     const { page } = req.query;
    //     if (!page) {
    //         return res.status(400).json({
    //             success: false,
    //             message: "Page is required",
    //         });
    //     }
    //     try {
    //         const banners = await DesktopBanner.find({
    //             page,
    //             isSelected: true,
    //         }).sort({ createdAt: -1 });

    //         res.status(200).json({
    //             success: true,
    //             count: banners.length,
    //             data: banners,
    //         });

    //     } catch (error) {
    //         console.error("GET SELECTED ERROR:", error);
    //         res.status(500).json({
    //             success: false,
    //             message: "Failed to fetch selected banners",
    //         });
    //     }
    // },

    // REFACTOR CODE UPLOAD ALL MEDIA IN SERVER
    uploadDesktopBanner: async (req, res) => {
        try {
            const { page } = req.query;

            if (!req.files?.desktop?.length) {
                return res.status(400).json({
                    success: false,
                    message: "Desktop file not received",
                });
            }
            const file = req.files.desktop[0];

            const mediaType = file.mimetype.startsWith("video")
                ? "video"
                : "image";

            const desktop = {
                url: `/uploads/${file.filename}`, // frontend access
                publicId: file.filename, // used for delete
                mediaType,
            };

            const content = await DesktopBanner.create({
                page,
                mediaType,
                desktop,
            });
            return res.status(201).json({
                success: true,
                message: "Desktop banner uploaded successfully",
                data: content,
            });
        } catch (error) {
            console.error("UPLOAD ERROR:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getDesktopBannerByPage: async (req, res) => {
        try {
            const { page } = req.query;

            const contents = await DesktopBanner
                .find({ page })
                .sort({ createdAt: -1 })
                .lean();
            return res.status(200).json({
                success: true,
                count: contents.length,
                data: contents,
            });
        } catch (error) {
            console.error("FETCH ERROR:", error);
            return res.status(500).json({
                success: false,
                message: "Banner fetch failed",
            });
        }
    },
    deleteDesktopBannerById: async (req, res) => {
        try {
            const { id } = req.params;
            const content = await DesktopBanner.findById(id);

            if (!content) {
                return res.status(404).json({
                    success: false,
                    message: "Banner not found",
                });
            }
            // Delete file from server
            if (content.desktop?.publicId) {
                const filePath = path.join(
                    process.cwd(),
                    "uploads",
                    "media",
                    content.desktop.publicId
                );
                console.log("REAL DELETE PATH →", filePath);


                try {
                    await fsPromises.unlink(filePath);   // ✅ CORRECT
                    console.log("File deleted successfully");

                } catch (err) {
                    console.warn("File already deleted or missing:", err.message);
                }
            }
            await content.deleteOne();
            res.status(200).json({
                success: true,
                message: "Desktop Banner deleted successfully",
            });
        } catch (error) {
            console.error("DELETE ERROR:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to delete banner",
            });
        }
    },
    updateDesktopBannerSelection: async (req, res) => {
        try {
            const { ids, isSelected } = req.body;
            await DesktopBanner.updateMany(
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
    // getSelectedDesktopBanners: async (req, res) => { },
}