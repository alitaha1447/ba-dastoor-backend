const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload')

const { createAboutUs, getAboutUs, updateAboutUs } = require('./aboutController')

router.post('/create-aboutus', upload.single('ownerImage'), createAboutUs);
router.get('/get-aboutus', getAboutUs);
router.put('/update-aboutus', upload.single('ownerImage'), updateAboutUs);

module.exports = router;