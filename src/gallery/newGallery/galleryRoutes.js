const express = require("express");
const router = express.Router();
const upload = require('../../middleware/upload')

const { uploadGalleryImages, getAllGalleries, getAllGalleriesAdmin, deleteGalleryById, editGalleryImages } = require('../newGallery/galleryControllers')

router.post(
    "/new-upload-galleryImg",
    // upload.array("images", 6),
    upload.fields([
        { name: "primary", maxCount: 1 },
        { name: "sibling1", maxCount: 1 },
        { name: "sibling2", maxCount: 1 },
        { name: "sibling3", maxCount: 1 },
        { name: "sibling4", maxCount: 1 },
        { name: "sibling5", maxCount: 1 },
    ]),
    uploadGalleryImages
);
router.get("/new-get-galleryImg", getAllGalleries);
router.get("/new-get-galleryImgAdmin", getAllGalleriesAdmin);
router.delete("/new-delete-galleryImg/:id", deleteGalleryById);
router.put("/new-edit-galleryImg/:id",
    upload.fields([
        { name: "primary", maxCount: 1 },
        { name: "sibling1", maxCount: 1 },
        { name: "sibling2", maxCount: 1 },
        { name: "sibling3", maxCount: 1 },
        { name: "sibling4", maxCount: 1 },
        { name: "sibling5", maxCount: 1 },
    ]),
    editGalleryImages);



module.exports = router;