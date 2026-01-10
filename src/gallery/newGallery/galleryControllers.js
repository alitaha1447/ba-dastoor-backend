const NewGallery = require("../newGallery/galleryModel");
const uploadToCloudinary = require("../../utils/branchCloudinary");
const cloudinary = require('../../config/cloudinary')
const fsPromises = require("fs/promises");

const SLOTS = ["primary", "sibling1", "sibling2", "sibling3", "sibling4", "sibling5"];

module.exports = {
    uploadGalleryImages: async (req, res) => {
        const tempPaths = [];
        // const files = req.files || [];
        try {
            const files = req.files;

            if (!files?.primary) {
                return res.status(400).json({
                    success: false,
                    message: "Primary image is required",
                });
            }

            /* ========= PRIMARY ========= */
            const primaryFile = files.primary[0];
            tempPaths.push(primaryFile.path);

            const primaryUpload = await uploadToCloudinary(
                primaryFile.path, "gallery"
            );

            const primaryImage = {
                url: primaryUpload.secure_url,
                publicId: primaryUpload.public_id,
            };

            /* ========= SIBLINGS ========= */
            // const siblings = [];

            // for (const key of Object.keys(files)) {
            //     if (!key.startsWith("sibling")) continue;

            //     const file = files[key][0];
            //     tempPaths.push(file.path); // 👈 save temp path

            //     const upload = await uploadToCloudinary(file.path, "gallery");
            //     siblings.push({
            //         url: upload.secure_url,
            //         publicId: upload.public_id,
            //     });
            // }
            /* ========= SIBLINGS ========= */
            const siblings = [];

            for (const key of Object.keys(files)) {
                if (!key.startsWith("sibling")) continue;

                const file = files[key][0];
                tempPaths.push(file.path);

                const upload = await uploadToCloudinary(file.path, "gallery");

                siblings.push({
                    slot: key, // ✅ VERY IMPORTANT
                    url: upload.secure_url,
                    publicId: upload.public_id,
                });
            }


            const gallery = await NewGallery.create({
                primaryImage,
                siblings,
            });

            res.status(201).json({
                success: true,
                data: gallery,
            })

            // const images = [];
            // for (const slot of SLOTS) {
            //     if (req.files?.[slot]?.[0]) {
            //         const file = req.files[slot][0];
            //         tempPaths.push(file.path); // 👈 save temp path

            //         const upload = await uploadToCloudinary(file.path, "branches");

            //         images.push({
            //             url: upload.secure_url,
            //             publicId: upload.public_id,
            //         });
            //     }
            // }


            // const files = req.files;
            // if (!files || files.length === 0) {
            //     return res.status(400).json({
            //         success: false,
            //         message: "At least one image is required",
            //     });
            // }

            // const uploads = [];

            // for (const file of files) {
            //     tempPaths.push(file.path); // 👈 track temp files
            //     const upload = await uploadToCloudinary(
            //         file.path,
            //         "newGallery"
            //     );


            //     uploads.push({
            //         url: upload.secure_url,
            //         publicId: upload.public_id,
            //     });
            // }

            // const gallery = await NewGallery.create({
            //     primaryImage: uploads[0],
            //     siblings: uploads.slice(1),
            // });
            // const gallery = await NewGallery.create({
            //     images
            // });

            // return res.status(201).json({
            //     success: true,
            //     message: "Gallery slot created successfully",
            //     data: gallery,
            // });

        } catch (error) {
            console.error("GALLERY ERROR:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        } finally {
            // 🧹 ALWAYS cleanup temp files (ASYNC + SAFE)
            for (const filePath of tempPaths) {
                try {
                    await fsPromises.unlink(filePath);
                    console.log("🧹 Temp file deleted:", filePath);
                } catch (err) {
                    console.error(
                        "❌ Failed to delete temp file:",
                        filePath,
                        err.message
                    );
                }
            }
        }
    },

    getAllGalleries: async (req, res) => {
        try {
            const galleries = await NewGallery.find()
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                count: galleries.length,
                data: galleries,
            });

        } catch (error) {
            console.error("GET ALL GALLERY ERROR:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    deleteGalleryById: async (req, res) => {
        try {
            const { id } = req.params;

            const gallery = await NewGallery.findById(id);

            if (!gallery) {
                return res.status(404).json({
                    success: false,
                    message: "Gallery not found",
                });
            }

            // 1️⃣ Delete primary image from Cloudinary
            if (gallery.primaryImage?.publicId) {
                await cloudinary.uploader.destroy(
                    gallery.primaryImage.publicId, { resource_type: "image", invalidate: true }
                );
            }

            // 2️⃣ Delete sibling images from Cloudinary
            // if (gallery.siblings?.length > 0) {
            //     for (const img of gallery.siblings) {
            //         if (img.publicId) {
            //             await cloudinary.uploader.destroy(img.publicId);
            //         }
            //     }
            // }
            if (Array.isArray(gallery.siblings) && gallery.siblings.length > 0) {
                for (const img of gallery.siblings) {
                    if (img.publicId) {
                        await cloudinary.uploader.destroy(
                            img.publicId,
                            { resource_type: "image", invalidate: true }
                        );
                    }
                }
            }

            // 3️⃣ Delete gallery document from DB
            await NewGallery.findByIdAndDelete(id);

            return res.status(200).json({
                success: true,
                message: "Gallery (primary + all siblings) deleted successfully",
            });
        } catch (error) {
            console.error("DELETE GALLERY ERROR:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    editGalleryImages: async (req, res) => {
        const tempPaths = [];
        try {
            const { id } = req.params;
            const files = req.files || {};

            const gallery = await NewGallery.findById(id);
            if (!gallery) {
                return res.status(404).json({
                    success: false,
                    message: "Gallery not found",
                });
            }
            /* ========= UPDATE PRIMARY (OPTIONAL) ========= */
            if (files.primary?.[0]) {
                const file = files.primary[0];
                tempPaths.push(file.path);

                // delete old primary
                if (gallery.primaryImage?.publicId) {
                    await cloudinary.uploader.destroy(
                        gallery.primaryImage.publicId,
                        { resource_type: "image" } // ✅ FIX
                    );
                }

                const upload = await uploadToCloudinary(file.path, "gallery");

                gallery.primaryImage = {
                    url: upload.secure_url,
                    publicId: upload.public_id,
                };
            }
            /* ========= UPDATE ONLY SELECTED SIBLINGS ========= */
            for (const key of Object.keys(files)) {
                if (!key.startsWith("sibling")) continue;

                const file = files[key][0];
                tempPaths.push(file.path);

                const upload = await uploadToCloudinary(file.path, "gallery");

                // find sibling by slot
                const index = gallery.siblings.findIndex(
                    (img) => img.slot === key
                );

                // delete only this slot from cloudinary
                if (index !== -1) {
                    await cloudinary.uploader.destroy(
                        gallery.siblings[index].publicId, { resource_type: "image" } // ✅ FIX
                    );

                    // replace only this slot
                    gallery.siblings[index] = {
                        slot: key,
                        url: upload.secure_url,
                        publicId: upload.public_id,
                    };
                } else {
                    // add new slot if not present
                    gallery.siblings.push({
                        slot: key,
                        url: upload.secure_url,
                        publicId: upload.public_id,
                    });
                }
            }
            await gallery.save();

            return res.status(200).json({
                success: true,
                message: "Gallery updated successfully",
                data: gallery,
            });
        } catch (error) {
            console.error("EDIT GALLERY ERROR:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        } finally {
            // 🧹 ALWAYS cleanup temp files (ASYNC + SAFE)
            for (const filePath of tempPaths) {
                try {
                    await fsPromises.unlink(filePath);
                    console.log("🧹 Temp file deleted:", filePath);
                } catch (err) {
                    console.error(
                        "❌ Failed to delete temp file:",
                        filePath,
                        err.message
                    );
                }
            }
        }
    }
};
