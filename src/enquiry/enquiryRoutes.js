const express = require("express")
const { createEnquiry, getEnquiries } = require('./enquiryControllers')
// const uploadResume = require('../middleware/multerResume')
// const upload = require('../middleware/multerResume')
const router = express.Router();

router.post("/create-enquiry",


    // upload.single("cv"),


    createEnquiry);
router.get("/get-enquiry", getEnquiries);

module.exports = router