const cloudinary = require('../config/cloudinary.js')
const uploadToCloudinary = require("../utils/cloudinaryUpload.js")
const Banner = require('../banners/bannerModel');
const fs = require("fs");

module.exports = {
    uploadBanner: async (req, res) => {
        const { page } = req.query
        const { desktopMediaType, mobileMediaType } = req.body;
        try {
            const desktopFile = req.files?.desktop?.[0];
            const mobileFile = req.files?.mobile?.[0];

            if (!desktopFile && !mobileFile) {
                return res.status(400).json({
                    success: false,
                    message: "No banner files uploaded"
                });
            }

            let desktopUpload, mobileUpload;

            if (desktopFile) {
                desktopUpload = await uploadToCloudinary(
                    desktopFile.path,
                    "banners/desktop",
                    desktopMediaType || "auto"
                    // req.body.desktopMediaType
                );
                fs.unlinkSync(desktopFile.path); // remove local file
            }

            if (mobileFile) {
                mobileUpload = await uploadToCloudinary(
                    mobileFile.path,
                    "banners/mobile",
                    req.body.mobileMediaType
                );
                fs.unlinkSync(mobileFile.path); // remove local file
            }

            // Save in DB
            // const banner = await Banner.create({
            //     // title,
            //     page,
            //     // mediaType: "image",
            //     desktop: {
            //         url: desktopUpload.secure_url,
            //         publicId: desktopUpload.public_id,
            //         mediaType: desktopMediaType || desktopUpload.resource_type,
            //         // mediaType: req.body.desktopMediaType,
            //         width: desktopUpload.width,
            //         height: desktopUpload.height
            //     },
            //     mobile: {
            //         url: mobileUpload.secure_url,
            //         publicId: mobileUpload.public_id,
            //         mediaType: req.body.mobileMediaType,
            //         width: mobileUpload.width,
            //         height: mobileUpload.height
            //     }
            // });
            //-------------------------------

            const bannerData = { page };

            if (desktopUpload) {
                bannerData.desktop = {
                    url: desktopUpload.secure_url,
                    publicId: desktopUpload.public_id,
                    mediaType: desktopUpload.resource_type,
                    width: desktopUpload.width,
                    height: desktopUpload.height,
                };
            }

            if (mobileUpload) {
                bannerData.mobile = {
                    url: mobileUpload.secure_url,
                    publicId: mobileUpload.public_id,
                    mediaType: mobileUpload.resource_type,
                    width: mobileUpload.width,
                    height: mobileUpload.height,
                };
            }

            const banner = await Banner.create(bannerData);

            // res.status(201).json({
            //     success: true,
            //     message: "Banner uploaded successfully",
            //     data: banner
            // });

            // FRONTEND SAFE PATHS (store these in DB)
            // const desktopPath = desktopFile
            //     ? `/uploads/banners/${desktopFile.filename}`
            //     : null;

            // const mobilePath = mobileFile
            //     ? `/uploads/banners/${mobileFile.filename}`
            //     : null;

            res.status(200).json({
                success: true,
                data: banner
                // data: {
                //     desktop: desktopPath,
                //     mobile: mobilePath
                // }
            });



        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Banner upload failed",
                error: error.message
            });
        }
    },
    // get banners
    getBanners: async (req, res) => {
        try {
            const { page } = req.query
            const banners = await Banner.find({ page }).sort({ createdAt: -1 });
            res.status(200).json({
                success: true,
                count: banners.length,
                data: banners   // ARRAY
            });
        } catch (error) {
            console.error("Get banners error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch banners",
                error: error.message
            });
        }
    },
    // delete banner by id
    deleteBannerById: async (req, res) => {
        const { id, type } = req.query; // 👈 query params
        // console.log(id, 'id')
        // console.log(type, 'type')
        try {
            if (!id || !["mobile", "desktop"].includes(type)) {
                return res.status(400).json({ message: "Invalid request" });
            }
            const banner = await Banner.findById(id);
            // console.log(banner[type])
            if (!banner[type].publicId) {
                // console.log('Banner not found')
                return res.status(404).json({ message: "Banner not found" });
            }
            // Delete from Cloudinary
            const cloudinaryRes = await cloudinary.uploader.destroy(banner[type].publicId);
            console.log('cloudinary')
            console.log(cloudinaryRes)
            console.log('cloudinary')
            // Delete field from MongoDB
            await Banner.findByIdAndUpdate(
                id,
                { $unset: { [type]: 1 } },
            );

            res.json({ success: true, message: `${type} deleted` });

        } catch (error) {
            res.status(500).json({ message: "Delete failed" });

        }
    },
}