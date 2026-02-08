const express = require("express");
const router = express.Router();

const { createSEO, getAllSEO, getSEOByPageType, updateSEO, deleteSEO } = require('./seoControllers');

router.post("/create-seo", createSEO);
router.get("/get-all-seo", getAllSEO);   // 👈 NEW
router.get("/get-seo-by-pageType/:pageType", getSEOByPageType);  // 👈 NEW
router.put("/update-seo/:id", updateSEO);
router.delete("/delete-seo/:id", deleteSEO);

module.exports = router;