const express = require("express");
const router = express.Router();
const upload = require('../../middleware/upload')

const { uploadGalleryVideos, getAllGalleryVideos, getAllGalleryVideosByPagination, deleteGalleryVideoById, editGalleryVideo } = require('../newGalleryVideos/galleryVideoControllers')

router.post("/new-upload-galleryVideo",

    upload.fields([
        { name: "primary", maxCount: 1 },
        { name: "sibling1", maxCount: 1 },
        { name: "sibling2", maxCount: 1 },
        { name: "sibling3", maxCount: 1 },
        { name: "sibling4", maxCount: 1 },
        { name: "sibling5", maxCount: 1 },
    ]),
    uploadGalleryVideos);
router.get("/new-get-galleryVideo", getAllGalleryVideos);
router.get("/new-get-galleryVideoByPage", getAllGalleryVideosByPagination)
router.delete("/new-delete-galleryVideo/:id", deleteGalleryVideoById);
router.put("/new-edit-galleryVideo/:id",
    upload.fields([
        { name: "primary", maxCount: 1 },
        { name: "sibling1", maxCount: 1 },
        { name: "sibling2", maxCount: 1 },
        { name: "sibling3", maxCount: 1 },
        { name: "sibling4", maxCount: 1 },
        { name: "sibling5", maxCount: 1 },
    ]),
    editGalleryVideo);



module.exports = router;