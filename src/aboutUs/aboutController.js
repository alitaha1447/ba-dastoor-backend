const AboutUs = require('./aboutModel')
// const uploadToCloudinary = require('../utils/aboutUsCloudinary')
const cloudinary = require('../config/cloudinary')
// const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");

module.exports = {
    // createAboutUs: async (req, res) => {
    //     const tempPaths = []; // 🔴 track temp files

    //     try {
    //         const { heading, ownerName, description, } = req.body || {};

    //         if (!heading || !ownerName || !description) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "All fields are required",
    //             });
    //         }

    //         if (!req.file) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Owner image is required",
    //             });
    //         }
    //         // console.log(req.file.path)
    //         // collect temp path
    //         tempPaths.push(req.file.path);

    //         const uploadResult = await cloudinary.uploader.upload(
    //             req.file.path,
    //             { folder: "about-us" }
    //         );

    //         const exists = await AboutUs.findOne();
    //         if (exists) {
    //             return res.status(409).json({
    //                 success: false,
    //                 message: "About Us already exists",
    //             });
    //         }

    //         const about = await AboutUs.create({
    //             heading,
    //             ownerName,
    //             description,
    //             ownerImage: {
    //                 url: uploadResult.secure_url,
    //                 publicId: uploadResult.public_id,
    //             },
    //         });

    //         res.status(201).json({
    //             success: true,
    //             message: "About Us created successfully",
    //             data: about,
    //         });


    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({
    //             success: false,
    //             message: error.message,
    //         });
    //     } finally {
    //         // ✅ ALWAYS clean temp files
    //         await Promise.all(
    //             tempPaths.map(async (filePath) => {
    //                 try {
    //                     await fsPromises.unlink(filePath);
    //                     console.log("🧹 Temp file deleted:", filePath);
    //                 } catch (err) {
    //                     console.error("❌ Failed to delete temp file:", filePath, err.message);
    //                 }
    //             })
    //         );
    //     }
    // },
    // getAboutUs: async (req, res) => {
    //     try {
    //         const about = await AboutUs.findOne();

    //         res.status(200).json({
    //             success: true,
    //             data: about,
    //         });
    //     } catch (error) {
    //         res.status(500).json({
    //             success: false,
    //             message: error.message,
    //         });
    //     }
    // },
    // updateAboutUs: async (req, res) => {
    //     const tempPaths = [];
    //     let newUploadedImage = null;
    //     let oldPublicId = null;

    //     try {
    //         const { heading, ownerName, description, } = req.body || {};

    //         const existing = await AboutUs.findOne();
    //         if (!existing) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "About Us not found",
    //             });
    //         }

    //         const updatePayload = {
    //             ...(heading !== undefined && { heading }),
    //             ...(ownerName !== undefined && { ownerName }),
    //             ...(description !== undefined && { description }),
    //         };

    //         /* IMAGE UPDATE */
    //         if (req.file) {
    //             tempPaths.push(req.file.path);
    //             oldPublicId = existing.ownerImage?.publicId;

    //             const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    //                 folder: "about-us",
    //                 quality: "auto:eco",
    //                 fetch_format: "auto",
    //             });

    //             newUploadedImage = uploadResult;

    //             // ✅ MUST be inside updatePayload
    //             updatePayload.ownerImage = {
    //                 url: uploadResult.secure_url,
    //                 publicId: uploadResult.public_id,
    //             };
    //         }

    //         const updated = await AboutUs.findOneAndUpdate(
    //             {},
    //             { $set: updatePayload },
    //             { new: true }
    //         );

    //         if (oldPublicId) {
    //             await cloudinary.uploader.destroy(oldPublicId);
    //         }

    //         return res.status(200).json({
    //             success: true,
    //             message: "About Us updated successfully",
    //             data: updated,
    //         });

    //     } catch (error) {
    //         console.error(error);

    //         if (newUploadedImage?.public_id) {
    //             await cloudinary.uploader.destroy(newUploadedImage.public_id);
    //         }

    //         return res.status(500).json({
    //             success: false,
    //             message: error.message,
    //         });

    //     } finally {
    //         await Promise.all(
    //             tempPaths.map(async (filePath) => {
    //                 try {
    //                     await fsPromises.unlink(filePath);
    //                 } catch (err) {
    //                     console.error("Temp cleanup failed:", err.message);
    //                 }
    //             })
    //         );
    //     }
    // }

    createAboutUs: async (req, res) => {
        try {
            const { heading, ownerName, description } = req.body;

            if (!heading || !ownerName || !description) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                });
            }
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Owner image is required",
                });
            }
            const exists = await AboutUs.findOne();
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: "About Us already exists",
                });
            }

            const about = await AboutUs.create({
                heading,
                ownerName,
                description,
                ownerImage: {
                    url: `/uploads/${req.file.filename}`,
                    publicId: req.file.filename,
                },
            });

            res.status(201).json({
                success: true,
                message: "About Us created successfully",
                data: about,
            });


        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getAboutUs: async (req, res) => {
        try {
            const about = await AboutUs.findOne();
            res.status(200).json({
                success: true,
                data: about,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    // updateAboutUs: async (req, res) => {
    //     try {
    //         const { heading, ownerName, description } = req.body;
    //         const existing = await AboutUs.findOne();
    //         if (!existing) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "About Us not found",
    //             });
    //         }
    //         const updatePayload = {
    //             ...(heading && { heading }),
    //             ...(ownerName && { ownerName }),
    //             ...(description && { description }),
    //         };
    //         /* ===== IMAGE UPDATE ===== */
    //         if (req.file) {

    //             // 🗑 delete old image
    //             if (existing.ownerImage?.publicId) {
    //                 const oldPath = path.join(
    //                     process.cwd(),
    //                     "uploads",
    //                     "media",
    //                     existing.ownerImage.publicId
    //                 );

    //                 try {
    //                     await fsPromises.unlink(oldPath);
    //                 } catch (err) {
    //                     console.warn("Old image already missing");
    //                 }
    //             }

    //             updatePayload.ownerImage = {
    //                 url: `/uploads/${req.file.filename}`,
    //                 publicId: req.file.filename,
    //             };
    //         }

    //         const updated = await AboutUs.findOneAndUpdate(
    //             {},
    //             { $set: updatePayload },
    //             { new: true }
    //         );
    //         return res.status(200).json({
    //             success: true,
    //             message: "About Us updated successfully",
    //             data: updated,
    //         });

    //     } catch (error) {

    //     }
    // },
    updateAboutUs: async (req, res) => {
        try {
            const { heading, ownerName, description } = req.body;

            const existing = await AboutUs.findOne();

            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: "About Us not found",
                });
            }

            const updatePayload = {
                ...(heading && { heading }),
                ...(ownerName && { ownerName }),
                ...(description && { description }),
            };

            // ✅ DEBUG LOG
            console.log("FILE RECEIVED:", req.file);

            /* ===== IMAGE UPDATE ===== */
            if (req.file) {
                // 🗑 DELETE OLD IMAGE
                if (existing.ownerImage?.publicId) {
                    const oldPath = path.join(
                        process.cwd(),
                        "uploads",
                        "media",
                        existing.ownerImage.publicId
                    );

                    try {
                        await fsPromises.unlink(oldPath);
                    } catch (err) {
                        console.warn("Old image already missing or path wrong");
                    }
                }

                updatePayload.ownerImage = {
                    url: `/uploads/${req.file.filename}`,
                    publicId: req.file.filename,
                };
            }

            const updated = await AboutUs.findOneAndUpdate(
                {},
                { $set: updatePayload },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: "About Us updated successfully",
                data: updated,
            });

        } catch (error) {

            // ❌ YOUR OLD CODE HAD EMPTY CATCH → REQUEST NEVER ENDS

            console.log("UPDATE ABOUT ERROR:", error);

            return res.status(500).json({
                success: false,
                message: error.message || "Failed to update About Us",
            });
        }
    },

}