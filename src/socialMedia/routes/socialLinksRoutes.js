const express = require("express");
const router = express.Router();

const { createSocial, getSocials, updateSocial, deleteSocial } = require('../controllers/socialLinksControllers')

router.post("/create-socialLinks", createSocial);
router.get("/get-socialLinks", getSocials);
router.put("/update-socialLinks", updateSocial);
router.delete("/delete-socialLinks/:id", deleteSocial);

module.exports = router;
