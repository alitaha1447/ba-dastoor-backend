const NewGalleryVideo = require('../newGalleryVideos/galleryVideoModel')
const uploadToCloudinary = require('../../utils/videoUploadToCloudinary')
const cloudinary = require('../../config/cloudinary')
// const fs = require("fs");
const fsPromises = require("fs/promises");


module.exports = {
    uploadGalleryVideos: async (req, res) => {
        const tempPaths = [];
        // const files = req.files || [];
        try {
            const files = req.files;

            if (!files?.primary) {
                return res.status(400).json({
                    success: false,
                    message: "Primary video is required",
                });
            }

            /* ========= PRIMARY ========= */
            const primaryFile = files.primary[0];
            tempPaths.push(primaryFile.path);

            const primaryUpload = await uploadToCloudinary(
                primaryFile.path, "galleryVideo"
            );

            const primaryVideo = {
                url: primaryUpload.secure_url,
                publicId: primaryUpload.public_id,
            };


            /* ========= SIBLINGS ========= */
            // const siblings = [];

            // for (const key of Object.keys(files)) {
            //     if (!key.startsWith("sibling")) continue;

            //     const file = files[key][0];
            //     tempPaths.push(file.path);

            //     const upload = await uploadToCloudinary(file.path, "galleryVideo");

            //     siblings.push({
            //         slot: key, // ✅ VERY IMPORTANT
            //         url: upload.secure_url,
            //         publicId: upload.public_id,
            //     });
            // }
            const siblingKeys = Object.keys(files).filter(k => k.startsWith("sibling"));

            const siblings = await Promise.all(
                siblingKeys.map(async (key) => {
                    const file = files[key][0];
                    tempPaths.push(file.path);

                    const upload = await uploadToCloudinary(
                        file.path,
                        "galleryVideo",
                        { resource_type: "video" }
                    );

                    return {
                        slot: key,
                        url: upload.secure_url,
                        publicId: upload.public_id,
                    };
                })
            );


            const gallery = await NewGalleryVideo.create({
                primaryVideo,
                siblings,
            });

            res.status(201).json({
                success: true,
                data: gallery,
            })



        } catch (error) {
            console.error("GALLERY ERROR:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        } finally {
            for (const filePath of tempPaths) {
                try {
                    await fsPromises.unlink(filePath);
                    console.log("Temp deleted:", filePath);
                } catch (err) {
                    console.error("Temp delete failed:", filePath, err.message);
                }
            }
        }
    },
    getAllGalleryVideos: async (req, res) => {
        try {
            const galleries = await NewGalleryVideo.find()
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
    getAllGalleryVideosByPagination: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 1; // ✅ 1 slot per page
            const skip = (page - 1) * limit;

            const galleries = await NewGalleryVideo.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await NewGalleryVideo.countDocuments();
            const totalPages = Math.ceil(total / limit);


            return res.status(200).json({
                success: true,
                page,
                totalPages,
                hasNextPage: page < totalPages, // ✅ ADD THIS
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
    deleteGalleryVideoById: async (req, res) => {
        try {
            const { id } = req.params;
            const gallery = await NewGalleryVideo.findById(id);
            if (!gallery) {
                return res.status(404).json({
                    success: false,
                    message: "Gallery not found",
                });
            }
            console.log(gallery)
            // 1️⃣ Delete primary image from Cloudinary
            if (gallery?.primaryVideo?.publicId) {
                await cloudinary.uploader.destroy(
                    gallery.primaryVideo.publicId, { resource_type: "video", invalidate: true }
                );
            }
            // 2️⃣ Delete sibling images from Cloudinary
            if (Array.isArray(gallery.siblings) && gallery.siblings.length > 0) {
                for (const img of gallery.siblings) {
                    if (img.publicId) {
                        await cloudinary.uploader.destroy(
                            img.publicId,
                            { resource_type: "video", invalidate: true }
                        );
                    }
                }
            }
            // 3️⃣ Delete gallery document from DB
            await NewGalleryVideo.findByIdAndDelete(id);

            return res.status(200).json({
                success: true,
                message: "Gallery Videos (primary + all siblings) deleted successfully",
            });

        } catch (error) {
            console.error("DELETE GALLERY ERROR:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    editGalleryVideo: async (req, res) => {
        const tempPaths = []; // ✅ Track temp files
        try {
            const { id } = req.params;
            const files = req.files;

            const gallery = await NewGalleryVideo.findById(id);
            if (!gallery) {
                return res.status(404).json({
                    success: false,
                    message: "Gallery not found",
                });
            }
            /* ========= PRIMARY ========= */
            if (files?.primary?.[0]) {
                const primaryFile = files.primary[0];
                tempPaths.push(primaryFile.path); // ✅ track file

                if (gallery.primaryVideo?.publicId) {
                    await cloudinary.uploader.destroy(
                        gallery.primaryVideo.publicId,
                        { resource_type: "video", invalidate: true }
                    );
                }

                const upload = await uploadToCloudinary(
                    files.primary[0].path,
                    "galleryVideo",
                    { resource_type: "video" }
                );

                gallery.primaryVideo = {
                    url: upload.secure_url,
                    publicId: upload.public_id,
                };
            }
            /* ========= SIBLINGS ========= */
            for (const key of Object.keys(files)) {
                if (!key.startsWith("sibling")) continue;

                const file = files[key][0];
                tempPaths.push(file.path); // ✅ track file

                // upload new video
                const upload = await uploadToCloudinary(
                    file.path,
                    "galleryVideo",
                    { resource_type: "video" } // ✅ IMPORTANT
                );

                // find sibling by slot
                const index = gallery.siblings.findIndex(
                    (vid) => vid.slot === key
                );

                // delete only this slot from cloudinary
                if (index !== -1) {
                    if (gallery.siblings[index]?.publicId) {
                        await cloudinary.uploader.destroy(
                            gallery.siblings[index].publicId,
                            {
                                resource_type: "video",
                                invalidate: true
                            }
                        );
                    }

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
                message: "Gallery videos updated successfully",
                data: gallery,
            });

        } catch (error) {

        } finally {
            for (const path of tempPaths) {
                try {
                    await fsPromises.unlink(path);
                } catch (err) {
                    console.error("Temp delete failed:", err.message);
                }
            }
        }
    }
}
