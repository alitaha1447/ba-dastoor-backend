const express = require("express");
const router = express.Router();
const upload = require("../../middleware/upload");

const { createBranch, getBranches, deleteBranchById, editBranchById } = require('../controllers/branchController');

router.post("/create-branch",
    upload.fields([
        { name: "primary", maxCount: 1 },
        { name: "secondary1", maxCount: 1 },
        { name: "secondary2", maxCount: 1 },
    ]),




    createBranch);
router.get("/get-branches", getBranches);
router.delete("/delete-branches/:id", deleteBranchById);
router.put("/edit-branches/:id",


    // upload.array("images"),
    upload.fields([
        { name: "primary", maxCount: 1 },
        { name: "secondary1", maxCount: 1 },
        { name: "secondary2", maxCount: 1 },
    ]),
    editBranchById);

module.exports = router;