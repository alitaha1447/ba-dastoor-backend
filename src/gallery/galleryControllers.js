const Gallery = require('./galleryModel')
const uploadToCloudinary = require('../utils/cloudinaryUpload')
const cloudinary = require('../config/cloudinary')
const fs = require("fs");

// module.exports = {
//     uploadGalleryImages: async (req, res) => {
//         try {
//             const savedImages = [];

//             const mediaTypes = Array.isArray(req.body.mediaTypes)
//                 ? req.body.mediaTypes
//                 : [req.body.mediaTypes];


//             for (let i = 0; i < req.files.length; i++) {
//                 const file = req.files[i];
//                 const mediaType = mediaTypes[i] || "image";


//                 // ✅ IMPORTANT: tell Cloudinary image or video
//                 const upload = await uploadToCloudinary(
//                     file.path,
//                     "gallery",

//                 );

//                 fs.unlinkSync(file.path);

//                 const imageDoc = await Gallery.create({
//                     image: {
//                         url: upload.secure_url,
//                         publicId: upload.public_id,
//                     },
//                     mediaType, // ✅ saved correctly
//                 });

//                 savedImages.push(imageDoc);
//             }

//             return res.status(201).json({
//                 success: true,
//                 message: "Gallery uploaded successfully",
//                 data: savedImages,
//             });

//             // for (const file of req.files) {
//             //     const upload = await uploadToCloudinary(file.path, "galley")
//             //     fs.unlinkSync(file.path);
//             //     const imageDoc = await Gallery.create({
//             //         image: {
//             //             url: upload.secure_url,
//             //             publicId: upload.public_id,
//             //         },
//             //     });
//             // }
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: error.message,
//             });
//         }
//     },
//     getGalleryImages: async (req, res) => {
//         try {
//             const page = parseInt(req.query.page) || 1; // current page
//             const limit = 6; // ✅ 5 images per page
//             const skip = (page - 1) * limit;

//             const totalImages = await Gallery.countDocuments();

//             const images = await Gallery.find()
//                 .sort({ createdAt: -1 }).skip(skip).limit(limit);

//             res.status(200).json({
//                 success: true,
//                 data: images,
//                 pagination: {
//                     totalImages,
//                     currentPage: page,
//                     totalPages: Math.ceil(totalImages / limit),
//                     perPage: limit,
//                 }
//             });
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: error.message,
//             });
//         }
//     },
//     deleteGalleryImage: async (req, res) => {
//         try {
//             const { id } = req.params;
//             const image = await Gallery.findById(id);
//             if (!image) {
//                 return res.status(404).json({
//                     success: false,
//                     message: "Image not found",
//                 });
//             }
//             // Delete from Cloudinary
//             await cloudinary.uploader.destroy(image.image.publicId);

//             // Delete from DB
//             await Gallery.findByIdAndDelete(id);

//             res.status(200).json({
//                 success: true,
//                 message: "Gallery image deleted successfully",
//             });

//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: error.message,
//             });
//         }
//     },
// }