const mongoose = require("mongoose");
const branchImageSchema = new mongoose.Schema({
    branchId: {
        type: mongoose.Schema.ObjectId,
        ref: "Branch",
        required: true,
    },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("BranchImage", branchImageSchema);
