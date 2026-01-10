const express = require("express");
const router = express.Router();

const { createContent, getContent, updateContent, deleteContent } = require("../controllers/contentControllers");

router.post("/create-content", createContent);
router.get("/get-content", getContent);
router.put("/update-content", updateContent);
router.delete("/delete-content", deleteContent);

module.exports = router