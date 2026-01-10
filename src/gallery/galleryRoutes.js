const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload')
const { uploadGalleryImages, getGalleryImages, deleteGalleryImage } = require('./galleryControllers')

// router.post('/upload-galleryImg',
//     // upload.array("images"),
//     uploadGalleryImages)
// router.get('/get-galleryImg', getGalleryImages);
// router.delete("/delete-galleryImg/:id", deleteGalleryImage);


module.exports = router