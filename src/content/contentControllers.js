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

            /* 🔒 ONE PAGE = ONE DOCUMENT */
            const exists = await GeneralContent.findOne({ page });
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Content already exists for this page. You can edit or delete it.",
                });
            }

            /* ========= OPTIONAL MEDIA ========= */
            let mediaData;
            if (req.files?.media?.length) {
                const mediaFile = req.files.media[0];
                tempFiles.push(mediaFile);

                const mediaUpload = await uploadToCloudinary(
                    mediaFile.path,
                    "content",
                    mediaType || "auto"
                );

                mediaData = {
                    url: mediaUpload.secure_url,
                    publicId: mediaUpload.public_id,
                    mediaType: mediaType || "auto",
                };
            }

            /* ========= OPTIONAL LOGO ========= */
            let logoData;
            if (req.files?.logo?.length) {
                const logoFile = req.files.logo[0];
                tempFiles.push(logoFile);

                const logoUpload = await uploadToCloudinary(
                    logoFile.path,
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
                ...(mediaData && { media: mediaData }),
                ...(logoData && { logo: logoData }),
            });

            return res.status(201).json({
                success: true,
                message: "Content created successfully",
                data: content,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        } finally {
            /* 🔥 CLEAN TEMP FILES */
            for (const file of tempFiles) {
                try {
                    await fsPromises.unlink(file.path);
                } catch {
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
    updateContentByPage: async (req, res) => {
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

            const content = await GeneralContent.findOne({ page });
            if (!content) {
                return res.status(404).json({
                    success: false,
                    message: "Content not found for this page",
                });
            }

            /* ========= UPDATE TEXT ========= */
            if (heading) content.heading = heading;
            if (description) content.description = description;

            /* ========= UPDATE MEDIA ========= */
            if (req.files?.media?.length) {
                const mediaFile = req.files.media[0];
                tempFiles.push(mediaFile);

                // delete old media
                if (content.media?.publicId) {
                    await cloudinary.uploader.destroy(
                        content.media.publicId,
                        content.media.mediaType === "video"
                            ? { resource_type: "video" }
                            : {}
                    );
                }

                const mediaUpload = await uploadToCloudinary(
                    mediaFile.path,
                    "content",
                    mediaType || content.media?.mediaType || "auto"
                );

                content.media = {
                    url: mediaUpload.secure_url,
                    publicId: mediaUpload.public_id,
                    mediaType: mediaType || content.media?.mediaType || "auto",
                };
            }

            /* ========= UPDATE LOGO ========= */
            if (req.files?.logo?.length) {
                const logoFile = req.files.logo[0];
                tempFiles.push(logoFile);

                if (content.logo?.publicId) {
                    await cloudinary.uploader.destroy(content.logo.publicId);
                }

                const logoUpload = await uploadToCloudinary(
                    logoFile.path,
                    "content",
                    "image"
                );

                content.logo = {
                    url: logoUpload.secure_url,
                    publicId: logoUpload.public_id,
                };
            }

            await content.save();

            // 🔥 THIS RESPONSE WAS MISSING
            return res.status(200).json({
                success: true,
                message: "Content updated successfully",
                data: content,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        } finally {
            /* 🔥 TEMP FILE CLEANUP */
            for (const file of tempFiles) {
                try {
                    await fsPromises.unlink(file.path);
                } catch {
                    console.error("Failed to remove temp file:", file.path);
                }
            }
        }
    }

};
