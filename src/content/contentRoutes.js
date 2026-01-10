const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload')

const { createContent, getContentByPage, deleteContentByPage } = require('./contentControllers');

router.post('/upload-content', upload.fields([
    { name: "media", maxCount: 1 },
    { name: "logo", maxCount: 1 },
]), createContent);
router.get('/get-content', getContentByPage);
router.delete('/delete-content', deleteContentByPage);

module.exports = router;