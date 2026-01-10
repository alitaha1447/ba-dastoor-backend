// const Branch = require("../models/branchDetailModel")
// const uploadToCloudinary = require("../../utils/cloudinaryUpload")
// const branchCloudinary = require('../../utils/branchCloudinary')
// const cloudinary = require("../../config/cloudinary")

// // SLOT ORDER (VERY IMPORTANT)
// const SLOTS = ["primary", "secondary1", "secondary2"];


// module.exports = {
//     createBranch: async (req, res) => {
//         try {
//             const { branchName, address, contact, embedUrl } = req.body;
//             const images = [];
//             // 1️⃣ upload images to cloudinary
//             for (const file of req.files) {
//                 const upload = await uploadToCloudinary(file.path, "branches");

//                 images.push({
//                     url: upload.secure_url,
//                     publicId: upload.public_id,
//                 });
//             }
//             // 2️⃣ save everything in ONE document
//             const branch = await Branch.create({
//                 branchName,
//                 address,
//                 contact,
//                 embedUrl,
//                 images,
//             });
//             res.status(201).json({
//                 success: true,
//                 branch,
//             });

//         } catch (error) {
//             res.status(500).json({ message: error.message });
//         }
//         // const data = { ...req.body };
//         // const branch = await Branch.create(data);
//         // res.status(201).json({
//         //     success: true,
//         //     branchId: branch._id, // 🔥 THIS is important
//         // });
//         // const branch = await Branch.create({
//         //     branchName: req.body.branchName,
//         //     address: req.body.branchName,
//         //     contact: req.body.branchName,
//         // })
//     },
//     getBranches: async (req, res) => {
//         try {
//             const branches = await Branch.find().sort({ createdAt: -1 });
//             res.json({
//                 success: true,
//                 data: branches,
//             });
//         } catch (error) {
//             res.status(500).json({ message: error.message });
//         }
//     },
//     deleteBranchById: async (req, res) => {
//         const { id } = req.params;
//         try {

//             // 1. Find branch
//             const branch = await Branch.findById(id);
//             // console.log(branch);

//             // 2. Delete images from Cloudinary
//             if (branch.images && branch.images.length > 0) {
//                 const deletePromises = branch.images.map(img =>
//                     cloudinary.uploader.destroy(img.publicId)
//                 );
//                 // console.log(deletePromises)
//                 await Promise.all(deletePromises);
//             }

//             // // 3. Delete folder (only if empty)
//             // try {
//             //     await cloudinary.api.delete_folder(`branches/${branch._id}`);
//             // } catch (err) {
//             //     console.warn("Folder delete skipped:", err.message);
//             // }

//             // 4. Delete branch from MongoDB
//             await Branch.findByIdAndDelete(id);

//             res.status(200).json({
//                 success: true,
//                 message: "Branch and images deleted successfully",
//             });

//         } catch (error) {
//             console.error("Delete Branch Error:", error);
//             res.status(500).json({
//                 success: false,
//                 message: "Server error while deleting branch",
//             });
//         }
//     },
//     // editBranchById: async (req, res) => {
//     //     try {
//     //         const { id } = req.params;

//     //         const branch = await Branch.findById(id);
//     //         if (!branch) {
//     //             return res.status(404).json({ message: "Branch not found" });
//     //         }

//     //         // 1️⃣ Update text fields
//     //         branch.branchName = req.body.branchName;
//     //         branch.address = req.body.address;
//     //         branch.contact = req.body.contact;
//     //         branch.embedUrl = req.body.embedUrl;

//     //         // 2️⃣ Handle images (array-based, overwrite-safe)
//     //         if (req.files && req.files.length > 0) {

//     //             for (let i = 0; i < req.files.length; i++) {
//     //                 const file = req.files[i];

//     //                 // 🔁 CASE A: replace existing image (overwrite)
//     //                 if (branch.images[i]) {
//     //                     const oldImage = branch.images[i];

//     //                     const upload = await branchCloudinary(
//     //                         file.path,
//     //                         "branches",
//     //                         oldImage.publicId // 🔥 SAME publicId → overwrite
//     //                     );

//     //                     branch.images[i] = {
//     //                         url: upload.secure_url,
//     //                         publicId: oldImage.publicId,
//     //                     };
//     //                 }

//     //                 // 🆕 CASE B: add new image
//     //                 else {
//     //                     const upload = await branchCloudinary(
//     //                         file.path,
//     //                         "branches"
//     //                     );

//     //                     branch.images.push({
//     //                         url: upload.secure_url,
//     //                         publicId: upload.public_id,
//     //                     });
//     //                 }
//     //             }

//     //             // 🔥 tell mongoose array changed
//     //             branch.markModified("images");
//     //         }

//     //         await branch.save();

//     //         res.status(200).json({
//     //             success: true,
//     //             message: "Branch updated successfully",
//     //             branch,
//     //         });

//     //     } catch (error) {
//     //         console.error("Edit Branch Error:", error);
//     //         res.status(500).json({ message: "Edit failed" });
//     //     }
//     // },
//     // editBranchById: async (req, res) => {
//     //     try {
//     //         const { id } = req.params;

//     //         const branch = await Branch.findById(id);
//     //         if (!branch) {
//     //             return res.status(404).json({ message: "Branch not found" });
//     //         }

//     //         // 1️⃣ Update text fields
//     //         branch.branchName = req.body.branchName;
//     //         branch.address = req.body.address;
//     //         branch.contact = req.body.contact;
//     //         branch.embedUrl = req.body.embedUrl;

//     //         // 2️⃣ Handle partial image replacement
//     //         if (req.files && req.files.length > 0) {

//     //             const indexes = Array.isArray(req.body.imageIndexes)
//     //                 ? req.body.imageIndexes.map(Number)
//     //                 : [Number(req.body.imageIndexes)];

//     //             for (let i = 0; i < req.files.length; i++) {
//     //                 const file = req.files[i];
//     //                 const index = indexes[i];

//     //                 if (branch.images[index]) {
//     //                     // 🔥 delete only that image
//     //                     await cloudinary.uploader.destroy(
//     //                         branch.images[index].publicId
//     //                     );
//     //                 }

//     //                 // 🔥 upload replacement
//     //                 const upload = await uploadToCloudinary(file.path, "branches");

//     //                 branch.images[index] = {
//     //                     url: upload.secure_url,
//     //                     publicId: upload.public_id,
//     //                 };
//     //             }
//     //         }

//     //         await branch.save();

//     //         res.status(200).json({
//     //             success: true,
//     //             message: "Branch updated successfully",
//     //             branch,
//     //         });

//     //     } catch (error) {
//     //         console.error("Edit Branch Error:", error);
//     //         res.status(500).json({ message: "Edit failed" });
//     //     }
//     // }

//     editBranchById: async (req, res) => {
//         try {
//             const { id } = req.params;

//             const branch = await Branch.findById(id);
//             if (!branch) {
//                 return res.status(404).json({ message: "Branch not found" });
//             }

//             // Update text fields
//             branch.branchName = req.body.branchName;
//             branch.address = req.body.address;
//             branch.contact = req.body.contact;
//             branch.embedUrl = req.body.embedUrl;

//             // Replace only uploaded slots
//             for (let i = 0; i < SLOTS.length; i++) {
//                 const slot = SLOTS[i];

//                 if (req.files?.[slot]?.[0]) {
//                     const file = req.files[slot][0];

//                     // delete old image (only this slot)
//                     if (branch.images[i]?.publicId) {
//                         await cloudinary.uploader.destroy(branch.images[i].publicId);
//                     }

//                     const upload = await uploadToCloudinary(file.path, "branches");

//                     branch.images[i] = {
//                         url: upload.secure_url,
//                         publicId: upload.public_id,
//                     };
//                 }
//             }

//             await branch.save();

//             res.status(200).json({
//                 success: true,
//                 message: "Branch updated successfully",
//                 branch,
//             });

//         } catch (err) {
//             console.error(err);
//             res.status(500).json({ message: "Edit failed" });
//         }
//         // try {
//         //     const { id } = req.params;
//         //     console.log(id)
//         //     console.log('req.file', req.files)

//         //     // 1️⃣ Find branch
//         //     // const branch = await Branch.findById(id);
//         //     // console.log('branch old', branch.images)
//         //     // if (!branch) {
//         //     //     return res.status(404).json({ message: "Branch not found" });
//         //     // }

//         //     // // 2️⃣ Update text fields (always safe)
//         //     // branch.branchName = req.body.branchName;
//         //     // branch.address = req.body.address;
//         //     // branch.contact = req.body.contact;
//         //     // branch.embedUrl = req.body.embedUrl;

//         //     // // 3️⃣ Only handle images IF new images uploaded
//         //     // if (req.files && req.files.length > 0) {

//         //     //     // 🔥 delete old images
//         //     //     if (branch.images && branch.images.length > 0) {
//         //     //         await Promise.all(
//         //     //             branch.images.map(img =>
//         //     //                 cloudinary.uploader.destroy(img.publicId)
//         //     //             )
//         //     //         );
//         //     //     }

//         //     //     // 🔥 upload new images
//         //     //     const updatedImages = [];
//         //     //     for (const file of req.files) {
//         //     //         const upload = await uploadToCloudinary(file.path, "branches");
//         //     //         updatedImages.push({
//         //     //             url: upload.secure_url,
//         //     //             publicId: upload.public_id,
//         //     //         });
//         //     //     }

//         //     //     branch.images = updatedImages;
//         //     // }

//         //     // // 4️⃣ Save
//         //     // await branch.save();

//         //     // res.status(200).json({
//         //     //     success: true,
//         //     //     message: "Branch updated successfully",
//         //     //     branch,
//         //     // });

//         // } catch (error) {
//         //     console.error("Edit Branch Error:", error);
//         //     res.status(500).json({ message: "Edit failed" });
//         // }
//     }

//     // editBranchById: async (req, res) => {

//     //     try {
//     //         const { id } = req.params;
//     //         // 1️⃣ Find existing branch
//     //         const branch = await Branch.findById(id);
//     //         console.log(branch)
//     //         let updatedImages = branch.images || [];

//     //         if (branch.images && branch.images.length > 0) {

//     //             // 🔥 delete old images from Cloudinary
//     //             if (branch.images && branch.images.length > 0) {
//     //                 await Promise.all(branch.images.map(img => cloudinary.uploader.destroy(img.publicId)))
//     //             }
//     //         }
//     //         // 🔥 upload new images
//     //         updatedImages = [];
//     //         for (const file of req.files) {
//     //             const upload = await uploadToCloudinary(file.path, "branches");
//     //             updatedImages.push({
//     //                 url: upload.secure_url,
//     //                 publicId: upload.public_id,
//     //             });
//     //         }

//     //         // 3️⃣ Update branch
//     //         branch.branchName = req.body.branchName;
//     //         branch.address = req.body.address;
//     //         branch.contact = req.body.contact;
//     //         branch.embedUrl = req.body.embedUrl;
//     //         branch.images = updatedImages;

//     //         await branch.save();

//     //         res.status(200).json({
//     //             success: true,
//     //             message: "Branch updated successfully",
//     //             branch,
//     //         });

//     //     } catch (error) {
//     //         console.error("Edit Branch Error:", error);
//     //         res.status(500).json({ message: "Edit failed" });
//     //     }
//     // }
// }


const Branch = require("../models/branchDetailModel");
const cloudinary = require("../../config/cloudinary");
const uploadToCloudinary = require("../../utils/branchCloudinary");
// const fs = require("fs");
const fsPromises = require("fs/promises");

// SLOT ORDER (VERY IMPORTANT)
const SLOTS = ["primary", "secondary1", "secondary2"];

/* ================= CREATE ================= */
exports.createBranch = async (req, res) => {
    const tempPaths = []; // 👈 track all temp files
    try {
        const { branchName, address, contact, embedUrl } = req.body;
        const images = [];

        for (const slot of SLOTS) {
            if (req.files?.[slot]?.[0]) {
                const file = req.files[slot][0];
                tempPaths.push(file.path); // 👈 save temp path

                const upload = await uploadToCloudinary(file.path, "branches");

                images.push({
                    url: upload.secure_url,
                    publicId: upload.public_id,
                });
            }
        }

        const branch = await Branch.create({
            branchName,
            address,
            contact,
            embedUrl,
            images,
        });

        res.status(201).json({
            success: true,
            message: "Branch created successfully",
            branch,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Create failed" });
    } finally {
        // 🧹 ALWAYS cleanup temp files (NON-BLOCKING, SAFE)
        for (const filePath of tempPaths) {
            try {
                await fsPromises.unlink(filePath);
                console.log("🧹 Temp file deleted:", filePath);
            } catch (err) {
                console.error("❌ Failed to delete temp file:", filePath, err.message);
            }
        }
    }
};

/* ================= EDIT ================= */
exports.editBranchById = async (req, res) => {
    const tempPaths = []; // 👈 track temp files
    try {
        const { id } = req.params;
        // console.log(res.files)
        const branch = await Branch.findById(id);
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        // Update text fields
        branch.branchName = req.body.branchName;
        branch.address = req.body.address;
        branch.contact = req.body.contact;
        branch.embedUrl = req.body.embedUrl;



        // Replace only uploaded slots
        // for (let i = 0; i < SLOTS.length; i++) {
        //     const slot = SLOTS[i];


        //     if (req.files?.[slot]?.[0]) {
        //         console.log('there file --> ', req.files?.[slot]?.[0])
        //         const file = req.files[slot][0];
        //         // delete old image (only this slot)
        //         if (branch.images[i]?.publicId) {
        //             // console.log('branch --> ', branch)
        //             await cloudinary.uploader.destroy(branch.images[i].publicId);
        //         }

        //         const upload = await uploadToCloudinary(file.path, "branches");

        //         branch.images[i] = {
        //             url: upload.secure_url,
        //             publicId: upload.public_id,
        //         };
        //     }
        // }

        // new code for fast api's optimization
        const tasks = [];

        for (let i = 0; i < SLOTS.length; i++) {
            const slot = SLOTS[i];

            if (req.files?.[slot]?.[0]) {
                const file = req.files[slot][0];
                const oldPublicId = branch.images[i]?.publicId;

                tempPaths.push(file.path); // ✅ track temp file

                tasks.push(
                    (async () => {
                        const [, upload] = await Promise.all([
                            oldPublicId
                                ? cloudinary.uploader.destroy(oldPublicId, { resource_type: "image" })
                                : Promise.resolve(),

                            uploadToCloudinary(file.path, "branches"),
                        ]);

                        branch.images[i] = {
                            url: upload.secure_url,
                            publicId: upload.public_id,
                        };
                    })()
                );
            }
        }

        await Promise.all(tasks);
        await branch.save();

        res.status(200).json({
            success: true,
            message: "Branch updated successfully",
            branch,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Edit failed" });
    } finally {
        // 🧹 ALWAYS cleanup temp files
        for (const filePath of tempPaths) {
            try {
                await fsPromises.unlink(filePath);
                console.log("🧹 Temp file deleted:", filePath);
            } catch (err) {
                console.error("❌ Failed to delete temp file:", filePath, err.message);
            }
        }
    }
};

/* ================= GET ALL ================= */
exports.getBranches = async (req, res) => {
    try {
        const branches = await Branch.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: branches });
    } catch (err) {
        res.status(500).json({ message: "Fetch failed" });
    }
};

/* ================= DELETE ================= */
exports.deleteBranchById = async (req, res) => {
    try {
        const { id } = req.params;

        const branch = await Branch.findById(id);
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        // delete images
        if (branch.images?.length) {
            await Promise.all(
                branch.images.map(img =>
                    cloudinary.uploader.destroy(img.publicId)
                )
            );
        }

        await Branch.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Branch deleted successfully",
        });

    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
};
