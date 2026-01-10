const mongoose = require("mongoose");

const socialSchema = new mongoose.Schema(
    {
        facebook: { url: { type: String, default: "" } },
        instagram: { url: { type: String, default: "" } },
        twitter: { url: { type: String, default: "" } },
        linkedin: { url: { type: String, default: "" } },
        // facebook: { type: String },
        // instagram: { type: String },
        // twitter: { type: String },
        // linkedin: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Social", socialSchema);
