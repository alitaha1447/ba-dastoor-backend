const express = require("express");
const router = express.Router();

const { createDish, getDishes, updateDish, deleteDish } = require('../controllers/dishControllers');

router.post("/create-dish/:categoryId", createDish);
router.get("/get-dish/:categoryId", getDishes);
router.put("/update-dish/:id", updateDish);
router.delete("/delete-dish/:id", deleteDish);

module.exports = router;