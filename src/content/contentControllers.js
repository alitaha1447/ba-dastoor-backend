const GeneralContent = require("../content/contentModel");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const fsPromises = require("fs/promises");
const cloudinary = require('../config/cloudinary')

module.exports = {
    createContent: async (req, res) => {
        const tempFiles = [];

        try {
            const { page } = req.query;
            const { heading, description, mediaType } = req.body;

            if (!page) {
                return res.status(400).json({
                    success: false,
                    message: "page is required",
                });
            }

            if (!heading || !description) {
                return res.status(400).json({
                    success: false,
                    message: "heading and description are required",
                });
            }

            /* 🔒 ONE DOCUMENT PER PAGE VALIDATION */
            const alreadyExists = await GeneralContent.findOne({ page });
            if (alreadyExists) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Content already exists for this page. You can either edit or delete it.",
                });
            }

            if (!req.files?.media?.length) {
                return res.status(400).json({
                    success: false,
                    message: "Media file is required",
                });
            }

            const mediaFile = req.files.media[0];
            tempFiles.push(mediaFile);

            if (req.files.logo?.length) {
                tempFiles.push(req.files.logo[0]);
            }

            /* ========= MEDIA UPLOAD ========= */
            const mediaUpload = await uploadToCloudinary(
                mediaFile.path,
                "content",
                mediaType || "auto"
            );

            /* ========= LOGO UPLOAD ========= */
            let logoData = {};
            if (req.files.logo?.length) {
                const logoUpload = await uploadToCloudinary(
                    req.files.logo[0].path,
                    "content",
                    "image"
                );

                logoData = {
                    url: logoUpload.secure_url,
                    publicId: logoUpload.public_id,
                };
            }

            /* ========= CREATE DOCUMENT ========= */
            const content = await GeneralContent.create({
                page,
                heading,
                description,
                mediaType,
                logo: logoData,
                media: {
                    url: mediaUpload.secure_url,
                    publicId: mediaUpload.public_id,
                    mediaType,
                },
            });

            res.status(201).json({
                success: true,
                message: "Content created successfully",
                data: content,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        } finally {
            /* 🔥 TEMP FILE CLEANUP */
            for (const file of tempFiles) {
                try {
                    await fsPromises.unlink(file.path);
                    console.log(`🗑️ Temp file removed: ${file.path}`);
                } catch (err) {
                    console.error(`❌ Failed to remove temp file: ${file.path}`);
                }
            }
        }
    },

    getContentByPage: async (req, res) => {
        try {
            const { page } = req.query;
            if (!page) {
                return res.status(400).json({ message: "page is required" });
            }
            const content = await GeneralContent.findOne({ page });
            if (!content) {
                return res.status(404).json({
                    success: false,
                    message: "No content found for this page",
                });
            }
            res.status(200).json({
                success: true,
                data: content,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    deleteContentByPage: async (req, res) => {
        try {
            const { page } = req.query;
            console.log(page)
            if (!page) {
                return res.status(400).json({
                    success: false,
                    message: "page is required",
                });
            }

            const content = await GeneralContent.findOne({ page });

            if (!content) {
                return res.status(404).json({
                    success: false,
                    message: "Content not found for this page",
                });
            }
            /* 🔥 DELETE MEDIA FROM CLOUDINARY */
            if (content.media?.publicId) {
                await cloudinary.uploader.destroy(
                    content.media.publicId,
                    content.media.mediaType === "video"
                        ? { resource_type: "video" }
                        : {}
                );
            }
            /* 🔥 DELETE LOGO FROM CLOUDINARY */
            if (content.logo?.publicId) {
                await cloudinary.uploader.destroy(content.logo.publicId);
            }
            /* 🗑️ DELETE DB RECORD */
            await GeneralContent.deleteOne({ page });

            res.status(200).json({
                success: true,
                message: "Content deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
