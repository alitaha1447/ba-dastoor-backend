const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload")

const { uploadBanner, getBanners, deleteBannerById } = require('./bannerControllers');

router.post("/upload-banner",
    upload.fields([
        { name: "desktop", maxCount: 1 },
        { name: "mobile", maxCount: 1 }
    ]),
    uploadBanner);
router.get("/get-banners", getBanners);
router.delete("/delete-banner", deleteBannerById);

module.exports = router;