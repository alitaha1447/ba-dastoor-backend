const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload')

const { uploadMobileBanner, getMobileBannerByPage, deleteMobileBannerById } = require('../mobileBanner/mobileControllers')

router.post('/upload-mobileBanner', upload.fields([
    { name: "mobile", maxCount: 1 }
]), uploadMobileBanner);
router.get('/get-mobileBanner', getMobileBannerByPage);
router.delete('/delete-mobileBanner/:id', deleteMobileBannerById);

module.exports = router;