const express = require("express");
const router = express.Router();

const { createCategory, getCategories, getCategoryWithDishes, updateCategory } = require("../../menus/controllers/categoryControllers");

router.post("/create-category", createCategory);
router.get("/get-categories", getCategories);
router.get("/get-categorywithdishes", getCategoryWithDishes);
router.put("/upate-category/:id", updateCategory);

module.exports = router;