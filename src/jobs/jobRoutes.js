const express = require('express')
const { createJob, getJob, editJobById, deleteJobById } = require('./jobControllers')

const router = express.Router();

router.post("/create-jobs", createJob);
router.get("/all-jobs", getJob);
router.put("/edit-job/:id", editJobById);
router.delete("/delete-job/:id", deleteJobById);


module.exports = router