const GeneralContent = require("../content/contentModel");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const cloudinary = require('../config/cloudinary')
const fsPromises = require("fs/promises");
const path = require("path");

module.exports = {
    // createContent: async (req, res) => {
    //     // const tempFiles = [];
    //     console.log('REQ BODY -->', req.body)
    //     try {
    //         const { page } = req.query;
    //         const { heading, description, secondaryHeading, secondaryDescription, mediaType } = req.body;

    //         if (!page) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "page is required",
    //             });
    //         }

    //         if (!heading || !description) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "heading and description are required",
    //             });
    //         }

    //         /* 🔒 ONE PAGE = ONE DOCUMENT */
    //         const exists = await GeneralContent.findOne({ page });
    //         if (exists) {
    //             return res.status(409).json({
    //                 success: false,
    //                 message:
    //                     "Content already exists for this page. You can edit or delete it.",
    //             });
    //         }

    //         /* ========= OPTIONAL MEDIA ========= */
    //         let mediaData;
    //         if (req.files?.media?.length) {
    //             const mediaFile = req.files.media[0];
    //             // tempFiles.push(mediaFile);

    //             const mediaUpload = await uploadToCloudinary(
    //                 mediaFile.path,
    //                 "content",
    //                 mediaType || "auto"
    //             );

    //             mediaData = {
    //                 url: mediaUpload.secure_url,
    //                 publicId: mediaUpload.public_id,
    //                 mediaType: mediaType || "auto",
    //             };
    //             console.log(req?.files)
    //             console.log("mediaUpload ----> ", mediaUpload)
    //         }
    //         // if (req.files?.media?.length) {
    //         //     const mediaFile = req.files.media[0];

    //         //     const mediaUpload = await uploadToCloudinary(
    //         //         mediaFile,
    //         //         "content",
    //         //         mediaType || "auto"
    //         //     );

    //         //     mediaData = {
    //         //         url: mediaUpload.secure_url,
    //         //         publicId: mediaUpload.public_id,
    //         //         mediaType: mediaType || "auto",
    //         //     };
    //         // }

    //         /* ========= OPTIONAL LOGO ========= */
    //         let logoData;
    //         if (req.files?.logo?.length) {
    //             const logoFile = req.files.logo[0];
    //             // tempFiles.push(logoFile);

    //             const logoUpload = await uploadToCloudinary(
    //                 logoFile.path,
    //                 "content",
    //                 "image"
    //             );

    //             logoData = {
    //                 url: logoUpload.secure_url,
    //                 publicId: logoUpload.public_id,
    //             };
    //         }

    //         /* ========= CREATE DOCUMENT ========= */
    //         const content = await GeneralContent.create({
    //             page,
    //             heading,
    //             description,
    //             secondaryHeading,
    //             secondaryDescription,
    //             ...(mediaData && { media: mediaData }),
    //             ...(logoData && { logo: logoData }),
    //         });
    //         console.log('content --> ', content)
    //         return res.status(201).json({
    //             success: true,
    //             message: "Content created successfully",
    //             data: content,
    //         });

    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: error.message,
    //         });
    //     }
    //     finally {
    //         /* 🔥 CLEAN ALL MULTER FILES (MEDIA + LOGO) */
    //         console.log('finaly block log')
    //         if (req.files) {
    //             console.log('req.files', req.files)
    //             const allFiles = Object.values(req.files).flat();
    //             for (const file of allFiles) {
    //                 try {
    //                     console.log('file --> ', file)
    //                     // Small delay fixes Windows file lock
    //                     await new Promise(resolve => setTimeout(resolve, 50));
    //                     await fsPromises.unlink(file.path);
    //                     console.log("🗑️ Deleted:", file.path);
    //                 } catch (err) {
    //                     console.error("❌ Failed to delete:", file.path, err.message);
    //                 }
    //             }
    //         }
    //     }

    //     // finally {
    //     //     /* 🔥 CLEAN TEMP FILES */
    //     //     for (const file of tempFiles) {
    //     //         try {
    //     //             await fsPromises.unlink(file.path);
    //     //         } catch {
    //     //             console.error(`❌ Failed to remove temp file: ${file.path}`);
    //     //         }
    //     //     }
    //     // }
    // },

    // getContentByPage: async (req, res) => {
    //     try {
    //         const { page } = req.query;
    //         if (!page) {
    //             return res.status(400).json({ message: "page is required" });
    //         }
    //         const content = await GeneralContent.findOne({ page });
    //         if (!content) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "No content found for this page",
    //             });
    //         }
    //         res.status(200).json({
    //             success: true,
    //             data: content,
    //         });
    //     } catch (error) {
    //         res.status(500).json({
    //             success: false,
    //             message: error.message,
    //         });
    //     }
    // },
    // deleteContentByPage: async (req, res) => {
    //     try {
    //         const { page } = req.query;
    //         console.log(page)
    //         if (!page) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "page is required",
    //             });
    //         }

    //         const content = await GeneralContent.findOne({ page });

    //         if (!content) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Content not found for this page",
    //             });
    //         }
    //         /* 🔥 DELETE MEDIA FROM CLOUDINARY */
    //         if (content.media?.publicId) {
    //             await cloudinary.uploader.destroy(
    //                 content.media.publicId,
    //                 content.media.mediaType === "video"
    //                     ? { resource_type: "video" }
    //                     : {}
    //             );
    //         }
    //         /* 🔥 DELETE LOGO FROM CLOUDINARY */
    //         if (content.logo?.publicId) {
    //             await cloudinary.uploader.destroy(content.logo.publicId);
    //         }
    //         /* 🗑️ DELETE DB RECORD */
    //         await GeneralContent.deleteOne({ page });

    //         res.status(200).json({
    //             success: true,
    //             message: "Content deleted successfully",
    //         });
    //     } catch (error) {
    //         res.status(500).json({
    //             success: false,
    //             message: error.message,
    //         });
    //     }
    // },
    // updateContentByPage: async (req, res) => {
    //     const tempFiles = [];
    //     console.log('REQ BODY -->', req.body)
    //     try {
    //         const { page } = req.query;
    //         const { heading, description, secondaryHeading, secondaryDescription, mediaType } = req.body;

    //         if (!page) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "page is required",
    //             });
    //         }

    //         const content = await GeneralContent.findOne({ page });
    //         if (!content) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Content not found for this page",
    //             });
    //         }

    //         /* ========= UPDATE TEXT ========= */
    //         if (heading) content.heading = heading;
    //         if (description) content.description = description;
    //         if (secondaryHeading) content.secondaryHeading = secondaryHeading;
    //         if (secondaryDescription) content.secondaryDescription = secondaryDescription;

    //         /* ========= UPDATE MEDIA ========= */
    //         if (req.files?.media?.length) {
    //             const mediaFile = req.files.media[0];
    //             tempFiles.push(mediaFile);

    //             // delete old media
    //             if (content.media?.publicId) {
    //                 await cloudinary.uploader.destroy(
    //                     content.media.publicId,
    //                     content.media.mediaType === "video"
    //                         ? { resource_type: "video" }
    //                         : {}
    //                 );
    //             }

    //             const mediaUpload = await uploadToCloudinary(
    //                 mediaFile.path,
    //                 "content",
    //                 mediaType || content.media?.mediaType || "auto"
    //             );

    //             content.media = {
    //                 url: mediaUpload.secure_url,
    //                 publicId: mediaUpload.public_id,
    //                 mediaType: mediaType || content.media?.mediaType || "auto",
    //             };
    //         }

    //         /* ========= UPDATE LOGO ========= */
    //         if (req.files?.logo?.length) {
    //             const logoFile = req.files.logo[0];
    //             tempFiles.push(logoFile);

    //             if (content.logo?.publicId) {
    //                 await cloudinary.uploader.destroy(content.logo.publicId);
    //             }

    //             const logoUpload = await uploadToCloudinary(
    //                 logoFile.path,
    //                 "content",
    //                 "image"
    //             );

    //             content.logo = {
    //                 url: logoUpload.secure_url,
    //                 publicId: logoUpload.public_id,
    //             };
    //         }

    //         await content.save();

    //         // 🔥 THIS RESPONSE WAS MISSING
    //         return res.status(200).json({
    //             success: true,
    //             message: "Content updated successfully",
    //             data: content,
    //         });

    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: error.message,
    //         });
    //     } finally {
    //         /* 🔥 TEMP FILE CLEANUP */
    //         for (const file of tempFiles) {
    //             try {
    //                 await fsPromises.unlink(file.path);
    //             } catch {
    //                 console.error("Failed to remove temp file:", file.path);
    //             }
    //         }
    //     }
    // },

    // REFACTOR CODE UPLOAD ALL MEDIA IN SERVER
    createContent: async (req, res) => {
        try {
            const { page } = req.query;
            const { heading, description, secondaryHeading, secondaryDescription, } = req.body;

            if (!page) {
                return res.status(400).json({ success: false, message: "page is required" });
            }

            if (!heading || !description) {
                return res.status(400).json({
                    success: false,
                    message: "heading and description are required",
                });
            }
            const exists = await GeneralContent.findOne({ page });
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: "Content already exists for this page",
                });
            }
            /* ===== MEDIA ===== */
            let mediaData;
            if (req.files?.media?.length) {
                const file = req.files.media[0];

                const mediaType = file.mimetype.startsWith("video")
                    ? "video"
                    : "image";

                mediaData = {
                    url: `/uploads/${file.filename}`,
                    publicId: file.filename,
                    mediaType,
                };
            }
            /* ===== LOGO ===== */
            let logoData;
            if (req.files?.logo?.length) {
                const file = req.files.logo[0];

                logoData = {
                    url: `/uploads/${file.filename}`,
                    publicId: file.filename,
                };
            }

            const content = await GeneralContent.create({
                page,
                heading,
                description,
                secondaryHeading,
                secondaryDescription,
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
                    message: "No content found",
                });
            }

            res.status(200).json({
                success: true,
                data: content,
            });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });

        }
    },
    deleteContentByPage: async (req, res) => {
        try {
            const { page } = req.query;
            if (!page) {
                return res.status(400).json({ success: false, message: "page required" });
            }
            const content = await GeneralContent.findOne({ page });
            if (!content) {
                return res.status(404).json({
                    success: false,
                    message: "Content not found",
                });
            }
            // 🗑 Delete media file
            if (content.media?.publicId) {
                const mediaPath = path.join(
                    process.cwd(),
                    "uploads",
                    "media",
                    content.media.publicId
                );

                try {
                    await fsPromises.unlink(mediaPath);
                } catch (err) {
                    console.warn("Media file already missing");
                }
            }

            // 🗑 Delete logo file
            if (content.logo?.publicId) {
                const logoPath = path.join(
                    process.cwd(),
                    "uploads",
                    "media",
                    content.logo.publicId
                );

                try {
                    await fsPromises.unlink(logoPath);
                } catch (err) {
                    console.warn("Logo file already missing");
                }
            }

            await GeneralContent.deleteOne({ page });

            res.status(200).json({
                success: true,
                message: "Content deleted successfully",
            });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });

        }
    },
    updateContentByPage: async (req, res) => {
        try {
            const { page } = req.query;

            if (!page) {
                return res.status(400).json({ success: false, message: "page required" });
            }

            const content = await GeneralContent.findOne({ page });

            if (!content) {
                return res.status(404).json({
                    success: false,
                    message: "Content not found",
                });
            }

            const {
                heading,
                description,
                secondaryHeading,
                secondaryDescription,
            } = req.body;

            if (heading) content.heading = heading;
            if (description) content.description = description;
            if (secondaryHeading) content.secondaryHeading = secondaryHeading;
            if (secondaryDescription)
                content.secondaryDescription = secondaryDescription;

            /* ===== UPDATE MEDIA ===== */
            if (req.files?.media?.length) {
                const file = req.files.media[0];

                // delete old
                if (content.media?.publicId) {
                    const oldPath = path.join(
                        process.cwd(),
                        "uploads",
                        "media",
                        content.media.publicId
                    );

                    try {
                        await fsPromises.unlink(oldPath);
                    } catch { }
                }

                const mediaType = file.mimetype.startsWith("video")
                    ? "video"
                    : "image";

                content.media = {
                    url: `/uploads/${file.filename}`,
                    publicId: file.filename,
                    mediaType,
                };
            }

            /* ===== UPDATE LOGO ===== */
            if (req.files?.logo?.length) {
                const file = req.files.logo[0];

                if (content.logo?.publicId) {
                    const oldLogoPath = path.join(
                        process.cwd(),
                        "uploads",
                        "media",
                        content.logo.publicId
                    );

                    try {
                        await fsPromises.unlink(oldLogoPath);
                    } catch { }
                }

                content.logo = {
                    url: `/uploads/${file.filename}`,
                    publicId: file.filename,
                };
            }

            await content.save();

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
        }
    },
};
