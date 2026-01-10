const express = require("express");
const router = express.Router();
const upload = require('../../middleware/newUpload')

const { uploadGalleryVideos, getAllGalleryVideos, deleteGalleryVideoById } = require('../newGalleryVideos/galleryVideoControllers')

router.post("/new-upload-galleryVideo",
    // upload.array("images", 6),
    upload.fields([
        { name: "primary", maxCount: 1 },
        { name: "sibling1", maxCount: 1 },
        { name: "sibling2", maxCount: 1 },
        { name: "sibling3", maxCount: 1 },
        { name: "sibling4", maxCount: 1 },
        { name: "sibling5", maxCount: 1 },
    ]),
    uploadGalleryVideos);
router.get("/new-get-galleryVideo", getAllGalleryVideos),
    router.delete("/new-delete-galleryVideo/:id", deleteGalleryVideoById),
    // router.put("/new-edit-galleryVideo",),

    module.exports = router;