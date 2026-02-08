const express = require("express");
const router = express.Router();

const { createCategory, getCategories, getCategoryWithDishes, updateCategory, deleteCategory } = require("../../menus/controllers/categoryControllers");

router.post("/create-category", createCategory);
router.get("/get-categories", getCategories);
router.get("/get-categorywithdishes", getCategoryWithDishes);
router.put("/upate-category/:id", updateCategory);
router.delete("/delete-category/:id", deleteCategory);


module.exports = router;