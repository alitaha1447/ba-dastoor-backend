const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload')

const { uploadDesktopBanner, getDesktopBannerByPage, deleteDesktopBannerById, updateDesktopBannerSelection, getSelectedDesktopBanners } = require('../desktopBanner/desktopControllers');

router.post('/upload-desktopBanner',
    upload.fields([
        { name: "desktop", maxCount: 1 }
    ]),
    uploadDesktopBanner);
router.get('/get-desktopBanner', getDesktopBannerByPage);
router.delete('/delete-desktopBanner/:id', deleteDesktopBannerById);
router.patch('/patch-desktopBanner', updateDesktopBannerSelection);
router.get('/get-selected-desktopBanner', getSelectedDesktopBanners);

module.exports = router;